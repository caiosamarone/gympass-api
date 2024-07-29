import { expect, describe, it, beforeEach } from 'vitest'

import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateService

describe('authenticate service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })
  it('should authenticate user', async () => {
    const userMock = {
      name: 'John Doe',
      email: 'john.does@mail.com',
      passoword_hash: await hash('123456', 6),
    }
    await usersRepository.create(userMock)
    const { user } = await sut.execute({
      email: 'john.does@mail.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })
  it('should not authenticate with wrong email', async () => {
    await expect(async () => {
      await sut.execute({
        email: 'john.does@mail.com',
        password: '1234567',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not authenticate with wrong password', async () => {
    const userMock = {
      name: 'John Doe',
      email: 'john.does@mail.com',
      passoword_hash: await hash('123456', 6),
    }
    await usersRepository.create(userMock)

    await expect(async () => {
      await sut.execute({
        email: 'john.does@mail.com',
        password: '1234567',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})

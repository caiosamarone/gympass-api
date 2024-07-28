import { expect, describe, it } from 'vitest'

import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('authenticate service', () => {
  it('should authenticate user', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)
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
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

    expect(async () => {
      await sut.execute({
        email: 'john.does@mail.com',
        password: '1234567',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)
    const userMock = {
      name: 'John Doe',
      email: 'john.does@mail.com',
      passoword_hash: await hash('123456', 6),
    }
    await usersRepository.create(userMock)

    expect(async () => {
      await sut.execute({
        email: 'john.does@mail.com',
        password: '1234567',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})

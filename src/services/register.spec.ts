import { expect, test, describe, it, beforeEach } from 'vitest'
import { RegisterService } from './register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { compare, hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterService

describe('register service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterService(usersRepository)
  })
  it('should create user', async () => {
    const userMock = {
      name: 'John Doe',
      email: 'john.does@mail.com',
      password: '123455687',
    }
    const { user } = await sut.execute(userMock)
    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon registration', async () => {
    const userMock = {
      name: 'John Doe',
      email: 'john.does@mail.com',
      password: '123455687',
    }
    const { user } = await sut.execute(userMock)
    const isPasswordCorrectlyHashed = await compare(
      userMock.password,
      user.passoword_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not register duplicate emails', async () => {
    const firstUserMock = {
      name: 'Rafael Leao',
      email: 'john.does@mail.com',
      password: '123455687',
    }
    const secondUserMock = {
      name: 'John Doe',
      email: 'john.does@mail.com',
      password: '123455687',
    }
    await sut.execute(firstUserMock)
    await expect(() => sut.execute(secondUserMock)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})

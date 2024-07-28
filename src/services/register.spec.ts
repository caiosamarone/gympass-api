import { expect, test, describe, it } from 'vitest'
import { RegisterService } from './register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { compare, hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('register service', () => {
  it('should create user', async () => {
    const usersRepositoryInMemory = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepositoryInMemory)
    const userMock = {
      name: 'John Doe',
      email: 'john.does@mail.com',
      password: '123455687',
    }
    const { user } = await registerService.execute(userMock)
    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon registration', async () => {
    const usersRepositoryInMemory = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepositoryInMemory)
    const userMock = {
      name: 'John Doe',
      email: 'john.does@mail.com',
      password: '123455687',
    }
    const { user } = await registerService.execute(userMock)
    const isPasswordCorrectlyHashed = await compare(
      userMock.password,
      user.passoword_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not register duplicate emails', async () => {
    const usersRepositoryInMemory = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepositoryInMemory)
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
    await registerService.execute(firstUserMock)
    await expect(() =>
      registerService.execute(secondUserMock),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})

import { expect, describe, it, beforeEach } from 'vitest'

import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UserProfileService } from './user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found'

let usersRepository: InMemoryUsersRepository
let sut: UserProfileService

describe('user profile service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UserProfileService(usersRepository)
  })
  it('should get user profile', async () => {
    const userMock = {
      name: 'John Doe',
      email: 'john.does@mail.com',
      passoword_hash: await hash('123456', 6),
    }
    const createdUser = await usersRepository.create(userMock)
    const { user } = await sut.execute({
      userId: createdUser.id,
    })
    expect(user).toEqual(createdUser)
  })
  it('should not get user profile with wrong userId', async () => {
    await expect(
      async () =>
        await sut.execute({
          userId: '3213213',
        }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

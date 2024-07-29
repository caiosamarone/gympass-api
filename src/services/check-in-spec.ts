import { expect, describe, it, beforeEach } from 'vitest'

import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UserProfileService } from './user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInService } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInService

describe('check in service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInService(checkInsRepository)
  })
  it('should get create a check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual('gym-01')
  })
})

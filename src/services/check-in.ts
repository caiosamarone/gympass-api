import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare, hash } from 'bcryptjs'
import { CheckIn, User } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface CheckInRequest {
  userId: string
  gymId: string
}
interface CheckInResponse {
  checkIn: CheckIn
}

export class CheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ gymId, userId }: CheckInRequest): Promise<CheckInResponse> {
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })
    return {
      checkIn,
    }
  }
}

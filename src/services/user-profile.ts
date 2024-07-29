import { UsersRepository } from '@/repositories/users-repository'

import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface UserProfileServiceRequest {
  userId: string
}
interface UserProfileServiceResponse {
  user: User
}

export class UserProfileService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: UserProfileServiceRequest): Promise<UserProfileServiceResponse> {
    const user = await this.usersRepository.findByUserId(userId)
    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}

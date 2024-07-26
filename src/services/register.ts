import { prisma } from '@/lib/prisma'

import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './user-already-exists'

interface RegisterServiceParams {
  password: string
  email: string
  name: string
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterServiceParams) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    this.usersRepository.create({ email, name, passoword_hash: password_hash })
  }
}

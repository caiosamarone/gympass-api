import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email)
    if (!user) {
      return null
    }
    return user
  }
  async findByUserId(userId: string) {
    const user = this.items.find((user) => user.id === userId)
    if (!user) {
      return null
    }
    return user
  }
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      passoword_hash: data.passoword_hash,
      created_at: new Date(),
    }
    this.items.push(user)
    return user
  }
}

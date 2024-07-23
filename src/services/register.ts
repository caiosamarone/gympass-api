import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterServiceParams {
  password: string
  email: string
  name: string
}

export async function registerService({
  email,
  name,
  password,
}: RegisterServiceParams) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('E-mail already exists.')
  }

  await prisma.user.create({
    data: {
      name,
      email,
      passoword_hash: password_hash,
    },
  })
}

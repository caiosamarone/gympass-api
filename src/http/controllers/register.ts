import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error'

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeRegisterUseCase } from '@/services/factories/make-register-service'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = requestBodySchema.parse(request.body)

  try {
    const registerService = makeRegisterUseCase()
    await registerService.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      reply.status(409).send({ message: err.message })
    }
    throw err
  }
  return reply.status(201).send()
}

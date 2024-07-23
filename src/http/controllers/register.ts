import { prisma } from '@/lib/prisma'
import { registerService } from '@/services/register'
import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = requestBodySchema.parse(request.body)

  try {
    await registerService({ name, email, password })
  } catch (err) {
    reply.status(409).send()
  }
  return reply.status(201).send()
}

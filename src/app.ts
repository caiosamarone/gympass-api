import { PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import { ZodError, z } from 'zod'
import { prisma } from './lib/prisma'
import { register } from './http/controllers/register'
import { appRoutes } from './http/routes'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    //SHOULD LOG External tool like Datadog, grafana, new relic, sentry
  }

  return reply.status(500).send({ message: 'Internal server error' })
})

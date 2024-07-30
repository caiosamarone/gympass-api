import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import { ZodError, z } from 'zod'
import { prisma } from './lib/prisma'
import { register } from './http/controllers/register'
import { appRoutes } from './http/routes'
import { env } from './env'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export default async function (app: FastifyInstance) {
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
  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'Teste',
        version: '123',
      },
      servers: [{ url: 'http://localhost:3333' }],
      paths: {},
      tags: [{ name: 'Hello' }, { name: 'Users' }],
    },
  })

  await app.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject
    },
    transformSpecificationClone: true,
  })
  app.register(appRoutes)
  app.ready(() => {
    console.log(app.printRoutes())
  })
}

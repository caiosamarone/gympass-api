import { authenticate } from './controllers/authenticate'
import { register } from './controllers/register'
import { FastifyInstance } from 'fastify'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post(
    '/sessions',
    {
      schema: {
        tags: ['Users'],
        summary: 'teste',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Sucesso',
            type: 'string',
            example: 'world',
          },
          401: {
            description: 'Unauthorized',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
            example: {
              message: 'Unauthorized',
            },
          },
        },
      },
    },
    authenticate,
  )
  app.get(
    '/hello-word',
    {
      schema: {
        tags: ['Hello'],
        response: {
          200: {
            description: 'Sucesso',
            type: 'string',
            example: 'world',
          },
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send('ola mundop')
    },
  )
}

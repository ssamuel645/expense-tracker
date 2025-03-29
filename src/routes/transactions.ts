import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';


export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    
    const createTransactionBodySchema = z.object({
      amount: z.number(),
      description: z.string(),
      type: z.enum(['credit', 'debit']),
    });

    const { amount, description, type } = createTransactionBodySchema.parse(req.body);

    await knex('transactions').insert({
      id: randomUUID(),
      description,
      amount: type === 'credit' ? amount : amount * -1
    });

    return reply.status(201).send();
  });
}
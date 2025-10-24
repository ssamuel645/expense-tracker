import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (req) => {
    const { sessionId } = req.cookies;
    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select('*');
    return { transactions };
  });

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (req, reply) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionParamsSchema.parse(req.params);

      const { sessionId } = req.cookies;
      const transaction = await knex('transactions')
        .where({ id, session_id: sessionId })
        .first();

      if (!transaction) {
        return reply.status(404).send({ message: 'Transaction not found' });
      }

      return { transaction };
    }
  );

  app.get('/summary', { preHandler: [checkSessionIdExists] }, async (req) => {
    const { sessionId } = req.cookies;
    const summary = await knex('transactions')
      .where({ session_id: sessionId })
      .sum('amount', { as: 'amount' })
      .first();

    return { summary };
  });

  app.post('/', async (req, reply) => {
    const createTransactionBodySchema = z.object({
      amount: z.number(),
      description: z.string(),
      type: z.enum(['credit', 'debit']),
    });

    const { amount, description, type } = createTransactionBodySchema.parse(
      req.body
    );

    let sessionId = req.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    await knex('transactions').insert({
      id: randomUUID(),
      description,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}

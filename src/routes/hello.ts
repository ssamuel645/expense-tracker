import { FastifyInstance } from 'fastify';
// import { knex } from './database';
// import { randomUUID } from 'node:crypto';


export async function helloRoute(app: FastifyInstance) {
  app.get('/hello', async () => {
    return 'Hello World!';
  });
}
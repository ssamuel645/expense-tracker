import { it, beforeAll, afterAll, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { describe } from 'node:test';
import { execSync } from 'node:child_process';

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });

  it('should be able to can create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      description: 'New transaction',
      amount: 5000,
      type: 'credit',
    });

    expect(response.statusCode).toEqual(201);
  });

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        description: 'New transaction',
        amount: 5000,
        type: 'credit',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies ?? [])
      .expect(200);

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        description: 'New transaction',
        amount: 5000,
      }),
    ]);
  });

  it('should be able to find specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        description: 'New transaction',
        amount: 5000,
        type: 'credit',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies ?? [])
      .expect(200);

    const transactionId = listTransactionResponse.body.transactions[0].id;

    const findTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies ?? []);

    console.log(findTransactionResponse.body);

    expect(findTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        description: 'New transaction',
        amount: 5000,
      })
    );
  });

  it('should be able to summarize transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        description: 'New transaction',
        amount: 5000,
        type: 'credit',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies ?? [])
      .send({
        description: 'New transaction',
        amount: 2000,
        type: 'debit',
      });

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies ?? [])
      .expect(200);

    expect(summaryResponse.body.summary).toEqual({ amount: 3000 });
  });
});

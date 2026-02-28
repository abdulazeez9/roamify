import supertest from 'supertest';
import { describe, it, expect } from 'vitest';
import { createServer } from '../server';

describe('server', () => {
  it('status check returns 200', async () => {
    await supertest(createServer())
      .get('/api/health')
      .expect(200)
      .then((res) => {
        expect(res.body.status).toBe('healthy');
      });
  });

  it('welcome endpoint returns message', async () => {
    await supertest(createServer())
      .get('/')
      .expect(200)
      .then((res) => {
        expect(res.body.message).toBe('Welcome to ZagoTour API');
        expect(res.body.version).toBe('1.0.0');
        expect(res.body.status).toBe('active');
      });
  });

  it('404 handler works', async () => {
    await supertest(createServer())
      .get('/nonexistent')
      .expect(404)
      .then((res) => {
        expect(res.body.error).toBe('Route not found');
        expect(res.body.path).toBe('/nonexistent');
      });
  });
});

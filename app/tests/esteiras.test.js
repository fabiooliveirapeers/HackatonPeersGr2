const request = require('supertest');
const app = require('../server');

describe('LogiTrack API', () => {
  test('GET /health retorna status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /esteiras retorna lista de esteiras', async () => {
    const res = await request(app).get('/esteiras');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /esteiras/:id retorna 404 para id inexistente', async () => {
    const res = await request(app).get('/esteiras/999');
    expect(res.statusCode).toBe(404);
  });

  test('GET /esteiras aceita filtro por status', async () => {
    const res = await request(app).get('/esteiras?status=operando');
    expect(res.statusCode).toBe(200);
    expect(res.body.every((esteira) => esteira.status === 'operando')).toBe(true);
  });

  test('GET /esteiras aceita filtro por setor', async () => {
    const res = await request(app).get('/esteiras?setor=Recebimento');
    expect(res.statusCode).toBe(200);
    expect(res.body.every((esteira) => esteira.setor === 'Recebimento')).toBe(true);
  });

  test('GET /tests retorna a lista de testes disponíveis', async () => {
    const res = await request(app).get('/tests');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(expect.arrayContaining([expect.stringContaining('GET /health')]));
  });

  test('GET /demo/failure retorna o estado da simulação', async () => {
    const res = await request(app).get('/demo/failure');
    expect(res.statusCode).toBe(200);
    expect(res.body.active).toBe(false);
  });

  test('POST /demo/failure simula uma falha de deploy', async () => {
    const res = await request(app).post('/demo/failure');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Falha simulada de deploy');
  });
});

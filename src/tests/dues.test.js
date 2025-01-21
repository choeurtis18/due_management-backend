import request from 'supertest';
import app from '../server.js';

let token;

beforeAll(async () => {
  const res = await request(app).post('/api/auth/login').send({
    email: 'admin.cas@yopmail.com',
    password: 'password123',
  });
  token = res.body.token;
});

describe('Dues Routes', () => {
  test('GET /api/dues - should return all dues', async () => {
    const res = await request(app)
      .get('/api/dues')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/dues - should create a new due', async () => {
    const res = await request(app)
      .post('/api/dues')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 50,
        isLate: false,
        memberId: 1,
        categoryId: 1,
        monthId: 1,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe(50);
  });

  test('PATCH /api/dues/:id - should update a due', async () => {
    const res = await request(app)
      .patch('/api/dues/1') // Remplacez par un ID valide
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 75,
        isLate: true,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.amount).toBe(75);
  });

  test('DELETE /api/dues/:id - should delete a due', async () => {
    const res = await request(app)
      .delete('/api/dues/1') // Remplacez par un ID valide
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

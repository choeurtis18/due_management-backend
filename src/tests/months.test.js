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

describe('Months Routes', () => {
  test('GET /api/months - should return all months', async () => {
    const res = await request(app)
      .get('/api/months')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/months - should create a new month', async () => {
    const res = await request(app)
      .post('/api/months')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'January',
        year: 2023,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('January');
  });

  test('PATCH /api/months/:id - should update a month', async () => {
    const res = await request(app)
      .patch('/api/months/1') // Remplacez par un ID valide
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated January',
        year: 2024,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated January');
  });

  test('DELETE /api/months/:id - should delete a month', async () => {
    const res = await request(app)
      .delete('/api/months/1') // Remplacez par un ID valide
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

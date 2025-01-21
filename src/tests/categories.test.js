import request from 'supertest';
import app from '../server.js';

let token;

beforeAll(async () => {
  // Obtenez un token valide
  const res = await request(app).post('/api/auth/login').send({
    email: 'admin.cas@yopmail.com',
    password: 'password123',
  });
  token = res.body.token;
});

describe('Categories Routes', () => {
  test('GET /api/categories - should return all categories', async () => {
    const res = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/categories - should create a new category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Category',
        description: 'A category for testing',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Category');
  });

  test('PATCH /api/categories/:id - should update a category', async () => {
    const res = await request(app)
      .patch('/api/categories/1') // Remplacez par un ID valide
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Category',
        description: 'Updated description',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Updated Category');
  });

  test('DELETE /api/categories/:id - should delete a category', async () => {
    const res = await request(app)
      .delete('/api/categories/1') // Remplacez par un ID valide
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

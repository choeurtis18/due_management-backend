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

describe('Members Routes', () => {
  test('GET /api/members - should return all members', async () => {
    const res = await request(app)
      .get('/api/members')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/members - should create a new member', async () => {
    const res = await request(app)
      .post('/api/members')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.firstName).toBe('John');
  });

  test('PATCH /api/members/:id - should update a member', async () => {
    const res = await request(app)
      .patch('/api/members/1') // Remplacez par un ID valide
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'Updated John',
        lastName: 'Updated Doe',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe('Updated John');
  });

  test('DELETE /api/members/:id - should delete a member', async () => {
    const res = await request(app)
      .delete('/api/members/1') // Remplacez par un ID valide
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

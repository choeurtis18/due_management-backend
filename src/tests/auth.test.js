import request from 'supertest';
import app from '../server.js';

describe('Authentication Routes', () => {
  const testUser = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
    role: "ADMIN"
  };

  let token;

  // Test de la route register
  test('POST /api/auth/register - should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Utilisateur créé avec succès');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', testUser.username);
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });

  // Test de la route login
  test('POST /api/auth/login - should authenticate the user and return a token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token; // Stocker le token pour les tests suivants
    expect(token).toBeDefined();
  });

  // Test de connexion avec des identifiants incorrects
  test('POST /api/auth/login - should return 400 for invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
        email: 'wronguser',
        password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Identifiants invalides');
  });

  // Test pour vérifier si l'utilisateur enregistré peut se connecter
  test('GET /api/auth/me - should return the authenticated user\'s details', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});

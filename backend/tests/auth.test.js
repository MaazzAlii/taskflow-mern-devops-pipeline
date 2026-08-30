const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Auth System Integration Tests (InMemory DB)', () => {
  const testUser = {
    name: 'Integration User',
    email: 'integration@example.com',
    password: 'password123',
  };

  it('should register a new user, return user data, and set httpOnly cookie', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user.passwordHash).toBeUndefined();

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/token=/);

    const dbUser = await User.findOne({ email: testUser.email });
    expect(dbUser).not.toBeNull();
    expect(dbUser.passwordHash).not.toBe(testUser.password);
  });

  it('should reject registration with duplicate email', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(409);
  });

  it('should authenticate registered user on login', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    await request(app).post('/api/auth/register').send(testUser);

    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
  });

  it('should return 401 on /api/auth/me when unauthenticated', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  it('should return authenticated user profile on /api/auth/me with cookie', async () => {
    const registerRes = await request(app).post('/api/auth/register').send(testUser);
    const authCookie = registerRes.headers['set-cookie'];

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', authCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });
});

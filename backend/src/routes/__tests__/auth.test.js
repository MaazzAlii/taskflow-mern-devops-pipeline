const request = require('supertest');
const app = require('../../app');

// Mock User model methods for unit testing without live DB connection
const User = require('../../models/User');

jest.mock('../../models/User');

describe('Auth Endpoints API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a user successfully and set token cookie', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

      expect(response.statusCode).toBe(201);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.passwordHash).toBeUndefined();

      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/token=/);
    });

    it('should reject registration if email is already taken', async () => {
      User.findOne.mockResolvedValue({ _id: '123', email: 'test@example.com' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

      expect(response.statusCode).toBe(409);
      expect(response.body.error).toMatch(/already exists/i);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 if no auth token cookie is provided', async () => {
      const response = await request(app).get('/api/auth/me');
      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear token cookie on logout', async () => {
      const response = await request(app).post('/api/auth/logout');
      expect(response.statusCode).toBe(200);
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/token=;/);
    });
  });
});

const request = require('supertest');
const express = require('express');
const errorHandler = require('../errorHandler');
const validate = require('../validate');
const AppError = require('../../utils/AppError');
const { registerSchema } = require('../../validators/schemas');

describe('Validation & Error Handling Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Test validation route
    app.post('/test-validation', validate(registerSchema), (req, res) => {
      res.status(200).json({ success: true });
    });

    // Test thrown operational error route
    app.get('/test-operational-error', (req, res, next) => {
      next(new AppError(403, 'Forbidden resource'));
    });

    // Test unhandled error route
    app.get('/test-unhandled-error', (req, res, next) => {
      next(new Error('Unexpected database failure'));
    });

    app.use(errorHandler);
  });

  it('should return 400 with clear message when validation fails', async () => {
    const res = await request(app)
      .post('/test-validation')
      .send({ email: 'invalid-email', password: '123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toMatch(/email|password/i);
  });

  it('should return operational error statusCode and message', async () => {
    const res = await request(app).get('/test-operational-error');
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Forbidden resource');
  });

  it('should catch unhandled errors and return 500 without crashing', async () => {
    const res = await request(app).get('/test-unhandled-error');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Unexpected database failure');
  });
});

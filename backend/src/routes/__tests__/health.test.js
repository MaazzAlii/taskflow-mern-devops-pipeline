const request = require('supertest');
const app = require('../../app');

describe('GET /api/health', () => {
  it('should return status 200 with status ok and timestamp', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.uptime).toBeDefined();
    expect(response.body.timestamp).toBeDefined();
  });
});

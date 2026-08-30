const request = require('supertest');
const app = require('../src/app');
const Board = require('../src/models/Board');

describe('Board API Integration Tests (InMemory DB)', () => {
  let cookieUserA;
  let cookieUserB;

  beforeEach(async () => {
    const resA = await request(app).post('/api/auth/register').send({
      name: 'User A',
      email: 'usera@example.com',
      password: 'password123',
    });
    cookieUserA = resA.headers['set-cookie'];

    const resB = await request(app).post('/api/auth/register').send({
      name: 'User B',
      email: 'userb@example.com',
      password: 'password123',
    });
    cookieUserB = resB.headers['set-cookie'];
  });

  it('should create and list boards for authenticated user', async () => {
    const createRes = await request(app)
      .post('/api/boards')
      .set('Cookie', cookieUserA)
      .send({ title: 'User A Board' });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.data.title).toBe('User A Board');

    const listRes = await request(app)
      .get('/api/boards')
      .set('Cookie', cookieUserA);

    expect(listRes.statusCode).toBe(200);
    expect(listRes.body.data).toHaveLength(1);
    expect(listRes.body.data[0].title).toBe('User A Board');
  });

  it('should enforce user isolation: User B cannot access or list User A boards', async () => {
    const createRes = await request(app)
      .post('/api/boards')
      .set('Cookie', cookieUserA)
      .send({ title: 'Private Board A' });

    const boardId = createRes.body.data._id;

    // User B listing boards should be empty
    const listResB = await request(app)
      .get('/api/boards')
      .set('Cookie', cookieUserB);
    expect(listResB.body.data).toHaveLength(0);

    // User B getting Board A by ID should return 404
    const getResB = await request(app)
      .get(`/api/boards/${boardId}`)
      .set('Cookie', cookieUserB);
    expect(getResB.statusCode).toBe(404);
  });

  it('should update and delete board', async () => {
    const createRes = await request(app)
      .post('/api/boards')
      .set('Cookie', cookieUserA)
      .send({ title: 'Original Board' });

    const boardId = createRes.body.data._id;

    const updateRes = await request(app)
      .patch(`/api/boards/${boardId}`)
      .set('Cookie', cookieUserA)
      .send({ title: 'Updated Board' });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.data.title).toBe('Updated Board');

    const deleteRes = await request(app)
      .delete(`/api/boards/${boardId}`)
      .set('Cookie', cookieUserA);

    expect(deleteRes.statusCode).toBe(200);

    const getRes = await request(app)
      .get(`/api/boards/${boardId}`)
      .set('Cookie', cookieUserA);
    expect(getRes.statusCode).toBe(404);
  });
});

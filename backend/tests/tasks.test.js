const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/Task');

describe('Task API Integration Tests (InMemory DB)', () => {
  let cookieUserA;
  let cookieUserB;
  let boardIdA;

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

    const boardRes = await request(app)
      .post('/api/boards')
      .set('Cookie', cookieUserA)
      .send({ title: 'Tasks Test Board' });
    boardIdA = boardRes.body.data._id;
  });

  it('should create and list tasks for a board', async () => {
    const taskRes = await request(app)
      .post(`/api/boards/${boardIdA}/tasks`)
      .set('Cookie', cookieUserA)
      .send({ title: 'Task 1', description: 'First task' });

    expect(taskRes.statusCode).toBe(201);
    expect(taskRes.body.data.title).toBe('Task 1');
    expect(taskRes.body.data.status).toBe('todo');

    const listRes = await request(app)
      .get(`/api/boards/${boardIdA}/tasks`)
      .set('Cookie', cookieUserA);

    expect(listRes.statusCode).toBe(200);
    expect(listRes.body.data).toHaveLength(1);
    expect(listRes.body.data[0].title).toBe('Task 1');
  });

  it('should update task status and description', async () => {
    const taskRes = await request(app)
      .post(`/api/boards/${boardIdA}/tasks`)
      .set('Cookie', cookieUserA)
      .send({ title: 'Task 1' });

    const taskId = taskRes.body.data._id;

    const updateRes = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Cookie', cookieUserA)
      .send({ status: 'in-progress', description: 'Updated desc' });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.data.status).toBe('in-progress');
    expect(updateRes.body.data.description).toBe('Updated desc');
  });

  it('should cascade delete tasks when a board is deleted', async () => {
    const taskRes = await request(app)
      .post(`/api/boards/${boardIdA}/tasks`)
      .set('Cookie', cookieUserA)
      .send({ title: 'Cascade Task' });

    const taskId = taskRes.body.data._id;

    // Delete board
    await request(app)
      .delete(`/api/boards/${boardIdA}`)
      .set('Cookie', cookieUserA);

    // Verify task is deleted
    const dbTask = await Task.findById(taskId);
    expect(dbTask).toBeNull();
  });

  it('should prevent User B from creating or modifying tasks on User A board', async () => {
    const createResB = await request(app)
      .post(`/api/boards/${boardIdA}/tasks`)
      .set('Cookie', cookieUserB)
      .send({ title: 'Unauthorized Task' });

    expect(createResB.statusCode).toBe(404);
  });
});

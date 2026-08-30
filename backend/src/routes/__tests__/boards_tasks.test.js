const request = require('supertest');
const app = require('../../app');
const Board = require('../../models/Board');
const Task = require('../../models/Task');
const User = require('../../models/User');
const { generateToken } = require('../../utils/token');

jest.mock('../../models/Board');
jest.mock('../../models/Task');
jest.mock('../../models/User');

describe('Boards & Tasks Core API Unit Tests', () => {
  const userId = '507f1f77bcf86cd799439011';
  let authCookie;

  beforeEach(() => {
    jest.clearAllMocks();
    const token = generateToken(userId);
    authCookie = `token=${token}`;

    User.findById.mockResolvedValue({
      _id: userId,
      name: 'Test User',
      email: 'test@example.com',
    });
  });

  describe('GET /api/boards', () => {
    it('should return boards owned by user', async () => {
      Board.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          { _id: 'board1', title: 'Sprint 1', owner: userId },
        ]),
      });

      const res = await request(app)
        .get('/api/boards')
        .set('Cookie', [authCookie]);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Sprint 1');
    });

    it('should return 401 if unauthenticated', async () => {
      const res = await request(app).get('/api/boards');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/boards', () => {
    it('should create a new board for user', async () => {
      Board.create.mockResolvedValue({
        _id: 'board123',
        title: 'Development Board',
        owner: userId,
      });

      const res = await request(app)
        .post('/api/boards')
        .set('Cookie', [authCookie])
        .send({ title: 'Development Board' });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.title).toBe('Development Board');
    });
  });

  describe('POST /api/boards/:boardId/tasks', () => {
    it('should create a task in a board owned by user', async () => {
      Board.findOne.mockResolvedValue({ _id: 'board123', owner: userId });
      Task.create.mockResolvedValue({
        _id: 'task123',
        title: 'Setup Docker',
        status: 'todo',
        board: 'board123',
        owner: userId,
      });

      const res = await request(app)
        .post('/api/boards/board123/tasks')
        .set('Cookie', [authCookie])
        .send({ title: 'Setup Docker' });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.title).toBe('Setup Docker');
      expect(res.body.data.status).toBe('todo');
    });

    it('should return 404 if user does not own board', async () => {
      Board.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/boards/other_board/tasks')
        .set('Cookie', [authCookie])
        .send({ title: 'Setup Docker' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/boards/:id', () => {
    it('should delete board and cascade delete tasks', async () => {
      Board.findOneAndDelete.mockResolvedValue({ _id: 'board123', owner: userId });
      Task.deleteMany.mockResolvedValue({ deletedCount: 5 });

      const res = await request(app)
        .delete('/api/boards/board123')
        .set('Cookie', [authCookie]);

      expect(res.statusCode).toBe(200);
      expect(Task.deleteMany).toHaveBeenCalledWith({ board: 'board123' });
    });
  });
});

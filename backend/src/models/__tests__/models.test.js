const mongoose = require('mongoose');
const User = require('../User');
const Board = require('../Board');
const Task = require('../Task');

describe('Mongoose Models Schema Validation', () => {
  describe('User Model', () => {
    it('should reject validation if required fields are missing', () => {
      const user = new User({});
      const err = user.validateSync();
      expect(err.errors.name).toBeDefined();
      expect(err.errors.email).toBeDefined();
      expect(err.errors.passwordHash).toBeDefined();
    });

    it('should reject invalid email formats', () => {
      const user = new User({
        name: 'John Doe',
        email: 'invalid-email',
        passwordHash: 'hashed123',
      });
      const err = user.validateSync();
      expect(err.errors.email).toBeDefined();
    });

    it('should validate a valid user object and exclude passwordHash in toJSON', () => {
      const user = new User({
        name: 'Jane Doe',
        email: 'jane@example.com',
        passwordHash: 'secretHash123',
      });
      const err = user.validateSync();
      expect(err).toBeUndefined();

      const jsonUser = user.toJSON();
      expect(jsonUser.name).toBe('Jane Doe');
      expect(jsonUser.email).toBe('jane@example.com');
      expect(jsonUser.passwordHash).toBeUndefined();
    });
  });

  describe('Board Model', () => {
    it('should reject validation if title or owner is missing', () => {
      const board = new Board({});
      const err = board.validateSync();
      expect(err.errors.title).toBeDefined();
      expect(err.errors.owner).toBeDefined();
    });

    it('should pass validation with valid data', () => {
      const ownerId = new mongoose.Types.ObjectId();
      const board = new Board({
        title: 'Project Roadmap',
        owner: ownerId,
      });
      const err = board.validateSync();
      expect(err).toBeUndefined();
    });
  });

  describe('Task Model', () => {
    it('should reject validation if title, board, or owner is missing', () => {
      const task = new Task({});
      const err = task.validateSync();
      expect(err.errors.title).toBeDefined();
      expect(err.errors.board).toBeDefined();
      expect(err.errors.owner).toBeDefined();
    });

    it('should reject invalid task status enum', () => {
      const boardId = new mongoose.Types.ObjectId();
      const ownerId = new mongoose.Types.ObjectId();
      const task = new Task({
        title: 'Build API',
        board: boardId,
        owner: ownerId,
        status: 'invalid-status',
      });
      const err = task.validateSync();
      expect(err.errors.status).toBeDefined();
    });

    it('should set default status to todo', () => {
      const boardId = new mongoose.Types.ObjectId();
      const ownerId = new mongoose.Types.ObjectId();
      const task = new Task({
        title: 'Build API',
        board: boardId,
        owner: ownerId,
      });
      expect(task.status).toBe('todo');
    });
  });
});

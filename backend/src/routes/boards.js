const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const validate = require('../middleware/validate');
const { createBoardSchema, updateBoardSchema, createTaskSchema } = require('../validators/schemas');
const {
  getBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
} = require('../controllers/boardController');
const {
  getTasksForBoard,
  createTask,
} = require('../controllers/taskController');

const router = express.Router();

router.use(requireAuth);

router.route('/')
  .get(getBoards)
  .post(validate(createBoardSchema), createBoard);

router.route('/:id')
  .get(getBoardById)
  .patch(validate(updateBoardSchema), updateBoard)
  .delete(deleteBoard);

router.route('/:boardId/tasks')
  .get(getTasksForBoard)
  .post(validate(createTaskSchema), createTask);

module.exports = router;

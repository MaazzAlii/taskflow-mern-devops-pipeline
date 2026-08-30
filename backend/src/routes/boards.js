const express = require('express');
const requireAuth = require('../middleware/requireAuth');
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

// Apply requireAuth to all board endpoints
router.use(requireAuth);

router.route('/')
  .get(getBoards)
  .post(createBoard);

router.route('/:id')
  .get(getBoardById)
  .patch(updateBoard)
  .delete(deleteBoard);

// Nested routes for tasks under a board
router.route('/:boardId/tasks')
  .get(getTasksForBoard)
  .post(createTask);

module.exports = router;

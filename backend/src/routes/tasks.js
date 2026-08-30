const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

// Apply requireAuth to all task endpoints
router.use(requireAuth);

router.route('/:id')
  .patch(updateTask)
  .delete(deleteTask);

module.exports = router;

const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const validate = require('../middleware/validate');
const { updateTaskSchema } = require('../validators/schemas');
const { updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

router.use(requireAuth);

router.route('/:id')
  .patch(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

module.exports = router;

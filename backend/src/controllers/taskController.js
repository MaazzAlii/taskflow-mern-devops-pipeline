const Board = require('../models/Board');
const Task = require('../models/Task');

// @desc    Get all tasks for a specific board
// @route   GET /api/boards/:boardId/tasks
// @access  Private
const getTasksForBoard = async (req, res, next) => {
  try {
    const board = await Board.findOne({ _id: req.params.boardId, owner: req.user._id });
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const tasks = await Task.find({ board: req.params.boardId, owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task for a board
// @route   POST /api/boards/:boardId/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const board = await Board.findOne({ _id: req.params.boardId, owner: req.user._id });
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: 'todo',
      board: board._id,
      owner: req.user._id,
    });

    res.status(201).json({ data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task (title, description, status)
// @route   PATCH /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    const updates = {};
    if (title !== undefined) {
      if (title.trim() === '') {
        return res.status(400).json({ error: 'Task title cannot be empty' });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description.trim();
    }

    if (status !== undefined) {
      if (!['todo', 'in-progress', 'done'].includes(status)) {
        return res.status(400).json({ error: 'Invalid task status' });
      }
      updates.status = status;
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasksForBoard,
  createTask,
  updateTask,
  deleteTask,
};

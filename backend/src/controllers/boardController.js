const Board = require('../models/Board');
const Task = require('../models/Task');

// @desc    Get all boards owned by current user
// @route   GET /api/boards
// @access  Private
const getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ data: boards });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new board
// @route   POST /api/boards
// @access  Private
const createBoard = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Board title is required' });
    }

    const board = await Board.create({
      title: title.trim(),
      owner: req.user._id,
    });

    res.status(201).json({ data: board });
  } catch (error) {
    next(error);
  }
};

// @desc    Get board by ID (ownership checked)
// @route   GET /api/boards/:id
// @access  Private
const getBoardById = async (req, res, next) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, owner: req.user._id });
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    res.status(200).json({ data: board });
  } catch (error) {
    next(error);
  }
};

// @desc    Update board title (ownership checked)
// @route   PATCH /api/boards/:id
// @access  Private
const updateBoard = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Board title is required' });
    }

    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { title: title.trim() },
      { new: true, runValidators: true }
    );

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.status(200).json({ data: board });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete board and cascade delete its tasks
// @route   DELETE /api/boards/:id
// @access  Private
const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Cascade delete associated tasks
    await Task.deleteMany({ board: board._id });

    res.status(200).json({ message: 'Board and associated tasks deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
};

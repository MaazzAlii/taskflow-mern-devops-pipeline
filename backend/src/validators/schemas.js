const { z } = require('zod');

const registerSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim().min(1, 'Name cannot be empty').max(100),
  email: z.string({ required_error: 'Email is required' }).trim().email('Invalid email address'),
  password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters long'),
});

const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).trim().email('Invalid email address'),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

const createBoardSchema = z.object({
  title: z.string({ required_error: 'Board title is required' }).trim().min(1, 'Title cannot be empty').max(100),
});

const updateBoardSchema = z.object({
  title: z.string({ required_error: 'Board title is required' }).trim().min(1, 'Title cannot be empty').max(100),
});

const createTaskSchema = z.object({
  title: z.string({ required_error: 'Task title is required' }).trim().min(1, 'Title cannot be empty').max(200),
  description: z.string().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty').max(200).optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done'], { errorMap: () => ({ message: 'Status must be todo, in-progress, or done' }) }).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  createBoardSchema,
  updateBoardSchema,
  createTaskSchema,
  updateTaskSchema,
};

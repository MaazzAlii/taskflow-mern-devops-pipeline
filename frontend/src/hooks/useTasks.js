import { useState, useEffect, useCallback } from 'react';
import { getBoardByIdApi } from '../api/boards';
import { getTasksForBoardApi, createTaskApi, updateTaskApi, deleteTaskApi } from '../api/tasks';

export function useTasks(boardId) {
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoardAndTasks = useCallback(async () => {
    if (!boardId) return;
    setLoading(true);
    setError(null);
    try {
      const [boardRes, tasksRes] = await Promise.all([
        getBoardByIdApi(boardId),
        getTasksForBoardApi(boardId),
      ]);
      setBoard(boardRes.data.data);
      setTasks(tasksRes.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load board details.');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoardAndTasks();
  }, [fetchBoardAndTasks]);

  const createTask = async (taskData) => {
    const response = await createTaskApi(boardId, taskData);
    setTasks((prev) => [response.data.data, ...prev]);
    return response.data.data;
  };

  const updateTask = async (taskId, updates) => {
    const response = await updateTaskApi(taskId, updates);
    setTasks((prev) => prev.map((t) => (t._id === taskId ? response.data.data : t)));
    return response.data.data;
  };

  const deleteTask = async (taskId) => {
    await deleteTaskApi(taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  return {
    board,
    tasks,
    loading,
    error,
    refetch: fetchBoardAndTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}

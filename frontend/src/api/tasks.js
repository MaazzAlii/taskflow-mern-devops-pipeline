import apiClient from './client';

export const getTasksForBoardApi = (boardId) => apiClient.get(`/boards/${boardId}/tasks`);
export const createTaskApi = (boardId, taskData) => apiClient.post(`/boards/${boardId}/tasks`, taskData);
export const updateTaskApi = (id, updates) => apiClient.patch(`/tasks/${id}`, updates);
export const deleteTaskApi = (id) => apiClient.delete(`/tasks/${id}`);

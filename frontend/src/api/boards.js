import apiClient from './client';

export const getBoardsApi = () => apiClient.get('/boards');
export const getBoardByIdApi = (id) => apiClient.get(`/boards/${id}`);
export const createBoardApi = (boardData) => apiClient.post('/boards', boardData);
export const updateBoardApi = (id, updates) => apiClient.patch(`/boards/${id}`, updates);
export const deleteBoardApi = (id) => apiClient.delete(`/boards/${id}`);

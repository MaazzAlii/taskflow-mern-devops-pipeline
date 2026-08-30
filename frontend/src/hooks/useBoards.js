import { useState, useEffect, useCallback } from 'react';
import { getBoardsApi, createBoardApi, deleteBoardApi } from '../api/boards';

export function useBoards() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBoardsApi();
      setBoards(response.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load boards.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const createBoard = async (title) => {
    const response = await createBoardApi({ title });
    setBoards((prev) => [response.data.data, ...prev]);
    return response.data.data;
  };

  const deleteBoard = async (id) => {
    await deleteBoardApi(id);
    setBoards((prev) => prev.filter((b) => b._id !== id));
  };

  return {
    boards,
    loading,
    error,
    refetch: fetchBoards,
    createBoard,
    deleteBoard,
  };
}

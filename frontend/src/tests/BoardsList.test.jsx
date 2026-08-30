import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BoardsList from '../pages/BoardsList';
import * as boardsApi from '../api/boards';

vi.mock('../api/boards');

describe('BoardsList Page Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderBoardsList = () =>
    render(
      <BrowserRouter>
        <BoardsList />
      </BrowserRouter>
    );

  it('renders loading state initially', () => {
    boardsApi.getBoardsApi.mockReturnValue(new Promise(() => {})); // pending promise
    renderBoardsList();

    expect(screen.getByText(/fetching your boards/i)).toBeInTheDocument();
  });

  it('renders empty state when user has no boards', async () => {
    boardsApi.getBoardsApi.mockResolvedValue({ data: { data: [] } });
    renderBoardsList();

    await waitFor(() => {
      expect(screen.getByText(/no boards yet/i)).toBeInTheDocument();
    });
  });

  it('renders list of boards when data is returned', async () => {
    boardsApi.getBoardsApi.mockResolvedValue({
      data: {
        data: [
          { _id: '1', title: 'Sprint 1', createdAt: '2026-08-30T10:00:00Z' },
          { _id: '2', title: 'DevOps Roadmap', createdAt: '2026-08-30T11:00:00Z' },
        ],
      },
    });

    renderBoardsList();

    await waitFor(() => {
      expect(screen.getByText('Sprint 1')).toBeInTheDocument();
      expect(screen.getByText('DevOps Roadmap')).toBeInTheDocument();
    });
  });
});

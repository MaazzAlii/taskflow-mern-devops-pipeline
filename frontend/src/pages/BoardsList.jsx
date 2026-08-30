import { useBoards } from '../hooks/useBoards';
import BoardCard from '../components/boards/BoardCard';
import CreateBoardForm from '../components/boards/CreateBoardForm';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BoardsList() {
  const { boards, loading, error, createBoard, deleteBoard } = useBoards();

  if (loading) {
    return <LoadingSpinner message="Fetching your boards..." />;
  }

  return (
    <div className="boards-page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Your Workspaces & Boards</h1>
          <p className="page-subtitle">Manage projects and track progress across boards</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <CreateBoardForm onCreateBoard={createBoard} />

      <div className="boards-grid-section">
        <h2 className="section-title">All Boards ({boards.length})</h2>

        {boards.length === 0 ? (
          <div className="empty-state-card">
            <span className="empty-icon">📁</span>
            <h3>No boards yet</h3>
            <p>Create your first board above to start adding tasks and organizing work.</p>
          </div>
        ) : (
          <div className="boards-grid">
            {boards.map((board) => (
              <BoardCard key={board._id} board={board} onDelete={deleteBoard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

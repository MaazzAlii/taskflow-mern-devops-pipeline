import { Link } from 'react-router-dom';
import { formatDate } from '../../lib/utils';

export default function BoardCard({ board, onDelete }) {
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete board "${board.title}"? This will also delete all tasks in it.`)) {
      onDelete(board._id);
    }
  };

  return (
    <div className="board-card">
      <Link to={`/boards/${board._id}`} className="board-card-link">
        <div className="board-card-header">
          <h3 className="board-card-title">{board.title}</h3>
          <button
            onClick={handleDeleteClick}
            className="btn-danger-icon"
            title="Delete Board"
            aria-label="Delete Board"
          >
            🗑️
          </button>
        </div>
        <div className="board-card-footer">
          <span className="board-date">Created {formatDate(board.createdAt)}</span>
          <span className="board-arrow">View Board →</span>
        </div>
      </Link>
    </div>
  );
}

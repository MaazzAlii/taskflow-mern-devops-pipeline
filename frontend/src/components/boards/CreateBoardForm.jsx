import { useState } from 'react';

export default function CreateBoardForm({ onCreateBoard }) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Board title cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateBoard(title.trim());
      setTitle('');
    } catch (err) {
      setError(err.message || 'Failed to create board.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-board-card">
      <h3>Create New Board</h3>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="create-board-form">
        <div className="form-group-inline">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Project Roadmap, Sprint 1"
            disabled={isSubmitting}
            required
          />
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : '+ Create Board'}
          </button>
        </div>
      </form>
    </div>
  );
}

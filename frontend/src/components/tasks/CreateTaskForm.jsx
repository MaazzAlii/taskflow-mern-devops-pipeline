import { useState } from 'react';

export default function CreateTaskForm({ onCreateTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateTask({
        title: title.trim(),
        description: description.trim(),
      });
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message || 'Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-task-card">
      <h3>+ Add New Task</h3>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="create-task-form">
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            disabled={isSubmitting}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details, notes, or acceptance criteria (optional)..."
            rows={2}
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" className="btn-primary btn-sm" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}

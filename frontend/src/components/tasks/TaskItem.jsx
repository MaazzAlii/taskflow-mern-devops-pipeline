import { useState } from 'react';
import { getStatusBadgeClass, formatDate } from '../../lib/utils';

export default function TaskItem({ task, onUpdateStatus, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');

  const handleStatusChange = (e) => {
    onUpdateStatus(task._id, e.target.value);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    await onUpdateTask(task._id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      onDeleteTask(task._id);
    }
  };

  if (isEditing) {
    return (
      <div className="task-item editing">
        <form onSubmit={handleSaveEdit} className="task-edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="input-title"
            required
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Add detailed description..."
            rows={2}
          />
          <div className="task-edit-actions">
            <button type="submit" className="btn-success btn-sm">
              Save
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary btn-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`task-item task-status-${task.status}`}>
      <div className="task-header">
        <h4 className="task-title">{task.title}</h4>
        <div className="task-actions">
          <button onClick={() => setIsEditing(true)} className="btn-icon" title="Edit Task">
            ✏️
          </button>
          <button onClick={handleDelete} className="btn-icon btn-danger-icon" title="Delete Task">
            🗑️
          </button>
        </div>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-footer">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className={`status-select ${getStatusBadgeClass(task.status)}`}
        >
          <option value="todo">📋 To Do</option>
          <option value="in-progress">⏳ In Progress</option>
          <option value="done">✅ Done</option>
        </select>
        <span className="task-date">{formatDate(task.createdAt)}</span>
      </div>
    </div>
  );
}

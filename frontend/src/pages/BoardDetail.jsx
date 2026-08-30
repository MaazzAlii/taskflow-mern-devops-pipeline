import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import TaskItem from '../components/tasks/TaskItem';
import CreateTaskForm from '../components/tasks/CreateTaskForm';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BoardDetail() {
  const { id: boardId } = useParams();
  const { board, tasks, loading, error, createTask, updateTask, deleteTask } = useTasks(boardId);
  const [statusFilter, setStatusFilter] = useState('all');

  if (loading) {
    return <LoadingSpinner message="Loading board tasks..." />;
  }

  if (error || !board) {
    return (
      <div className="not-found-card">
        <h2>Board Not Found</h2>
        <p>{error || 'This board does not exist or you do not have permission to view it.'}</p>
        <Link to="/" className="btn-primary">
          ← Back to All Boards
        </Link>
      </div>
    );
  }

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="board-detail-container">
      <div className="board-detail-header">
        <Link to="/" className="back-link">
          ← Back to Boards
        </Link>
        <div className="board-header-main">
          <h1 className="board-title">{board.title}</h1>
          <span className="task-count-pill">{tasks.length} Total Tasks</span>
        </div>
      </div>

      <div className="board-content-grid">
        <div className="board-sidebar">
          <CreateTaskForm onCreateTask={createTask} />

          <div className="filter-card">
            <h4>Filter Tasks</h4>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All ({tasks.length})
              </button>
              <button
                className={`filter-btn ${statusFilter === 'todo' ? 'active' : ''}`}
                onClick={() => setStatusFilter('todo')}
              >
                📋 To Do ({todoCount})
              </button>
              <button
                className={`filter-btn ${statusFilter === 'in-progress' ? 'active' : ''}`}
                onClick={() => setStatusFilter('in-progress')}
              >
                ⏳ In Progress ({inProgressCount})
              </button>
              <button
                className={`filter-btn ${statusFilter === 'done' ? 'active' : ''}`}
                onClick={() => setStatusFilter('done')}
              >
                ✅ Done ({doneCount})
              </button>
            </div>
          </div>
        </div>

        <div className="board-tasks-main">
          {filteredTasks.length === 0 ? (
            <div className="empty-tasks-card">
              <span className="empty-icon">📝</span>
              <h3>No tasks found</h3>
              <p>
                {statusFilter === 'all'
                  ? 'No tasks created yet. Use the form on the left to add your first task.'
                  : `No tasks currently marked as "${statusFilter}".`}
              </p>
            </div>
          ) : (
            <div className="tasks-list">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onUpdateStatus={(id, status) => updateTask(id, { status })}
                  onUpdateTask={(id, updates) => updateTask(id, updates)}
                  onDeleteTask={deleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

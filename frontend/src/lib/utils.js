// Utility functions for frontend UI
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'done':
      return 'badge-done';
    case 'in-progress':
      return 'badge-in-progress';
    default:
      return 'badge-todo';
  }
};

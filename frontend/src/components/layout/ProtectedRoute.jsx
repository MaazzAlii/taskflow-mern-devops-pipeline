import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

export default function ProtectedRoute({ isAuthenticated, isLoading }) {
  if (isLoading) {
    return <LoadingSpinner message="Verifying authentication session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

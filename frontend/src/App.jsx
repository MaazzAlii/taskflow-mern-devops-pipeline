import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading] = useState(false);

  const handleLogout = async () => {
    setUser(null);
  };

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar user={user} onLogout={handleLogout} />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<div className="page-card">Login Page Placeholder</div>} />
              <Route path="/register" element={<div className="page-card">Register Page Placeholder</div>} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute isAuthenticated={!!user} isLoading={isLoading} />}>
                <Route path="/" element={<div className="page-card">Boards List Placeholder</div>} />
                <Route path="/boards/:id" element={<div className="page-card">Board Detail Placeholder</div>} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

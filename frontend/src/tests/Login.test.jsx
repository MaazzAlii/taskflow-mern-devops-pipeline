import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthProvider } from '../context/AuthContext';
import * as authApi from '../api/auth';

vi.mock('../api/auth');

describe('Login Page Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = () =>
    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );

  it('renders login form elements correctly', async () => {
    authApi.getMeApi.mockRejectedValue(new Error('Unauthenticated'));
    renderLogin();

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows error message if required fields are missing on submit', async () => {
    authApi.getMeApi.mockRejectedValue(new Error('Unauthenticated'));
    renderLogin();

    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/please enter both email and password/i)).toBeInTheDocument();
  });

  it('calls login API and handles successful authentication', async () => {
    authApi.getMeApi.mockRejectedValue(new Error('Unauthenticated'));
    authApi.loginApi.mockResolvedValue({
      data: {
        user: { id: '123', name: 'John Doe', email: 'john@example.com' },
      },
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(authApi.loginApi).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
      });
    });
  });

  it('surfaces API error messages when login fails', async () => {
    authApi.getMeApi.mockRejectedValue(new Error('Unauthenticated'));
    authApi.loginApi.mockRejectedValue({
      message: 'Invalid email or password',
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });
});

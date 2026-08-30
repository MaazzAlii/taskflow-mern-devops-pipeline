import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TaskFlow Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <h2>Something went wrong in TaskFlow.</h2>
          <p>{this.state.error?.message || 'An unexpected application error occurred.'}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

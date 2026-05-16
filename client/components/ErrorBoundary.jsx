import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-wrap">
          <div className="error-boundary-card">
            <div className="error-icon">
              <i className="fas fa-exclamation-triangle" />
            </div>
            <h1 className="text-gold">Something went wrong.</h1>
            <p className="text-muted">
              We encountered an unexpected error. Our team has been notified.
            </p>
            <button 
              className="btn btn-gold"
              onClick={() => window.location.href = '/'}
            >
              <span>Return Home</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

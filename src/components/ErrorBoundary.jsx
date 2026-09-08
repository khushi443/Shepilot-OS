import React from 'react';

// AUTO-GENERATED. Top-level safety net: catches render-time crashes (including
// React error #130 from an undefined/component-type) so one bad component shows
// a fallback instead of white-screening the whole app.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (typeof console !== 'undefined') {
      console.error('Render error caught by ErrorBoundary:', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui, sans-serif', background: '#0b0b0f', color: '#e5e7eb', textAlign: 'center' }}>
          <div style={{ maxWidth: '28rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Something went wrong</h1>
            <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>This section failed to render. Try reloading the page.</p>
            <button onClick={() => window.location.reload()} style={{ padding: '0.6rem 1.25rem', borderRadius: '9999px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

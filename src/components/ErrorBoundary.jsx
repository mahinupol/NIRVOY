import React from 'react';
import { RefreshCw, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error Caught by Boundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('NIRVOY_AUTH_TOKEN');
      localStorage.removeItem('NIRVOY_USER');
    } catch (e) {}
    window.location.reload();
  };

  handleHardReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = window.location.origin;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          padding: '24px',
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: '#ffffff',
            borderRadius: '20px',
            padding: '32px 24px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertTriangle size={28} />
            </div>

            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>
              NIRVOY (নির্ভয়)
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>
              সাময়িক লোডিং সমস্যা হয়েছে। নিচের বোতামে ক্লিক করে অ্যাপ রিলোড করুন।
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
              <button
                onClick={this.handleReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0284c7 0%, #059669 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                }}
              >
                <RefreshCw size={16} />
                <span>রিলোড ও রিসেট করুন (Reload)</span>
              </button>

              <button
                onClick={this.handleHardReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                <span>ক্যাশ ক্লিয়ার (Clear Cache)</span>
              </button>
            </div>

            {this.state.error && (
              <div style={{ marginTop: '16px', textAlign: 'left' }}>
                <button
                  onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    margin: '0 auto 8px'
                  }}
                >
                  <span>Technical details</span>
                  {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {this.state.showDetails && (
                  <pre style={{
                    padding: '12px',
                    background: '#0f172a',
                    color: '#f87171',
                    borderRadius: '8px',
                    fontSize: '0.74rem',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '180px'
                  }}>
                    {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error Caught by Boundary:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
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
            maxWidth: '500px',
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

            <button
              onClick={this.handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
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
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

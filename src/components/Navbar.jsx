import React from 'react';
import { HeartPulse, Eye, Globe } from 'lucide-react';

export default function Navbar({ currentTab, setCurrentTab, elderlyMode, setElderlyMode }) {
  const tabs = [
    { id: 'scanner', label: 'AI Scanner (স্ক্যানার)' },
    { id: 'history', label: 'Rx Archive (হিস্ট্রি)' },
    { id: 'doctor', label: 'Doctor Portal (ডাক্তার)' },
    { id: 'pharmacy', label: 'Pharmacy Radar (ফার্মেসি)' },
    { id: 'verify', label: 'DGDA Verifier (ঔষধ যাচাই)' },
    { id: 'assistant', label: 'AI Health Bot' },
    { id: 'team', label: 'Team Goku' }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      padding: '10px 0'
    }}>
      <div className="container-max" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('scanner')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
          }}>
            <HeartPulse size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
                NIRVOY <span style={{ color: '#059669', fontSize: '1.05rem', fontWeight: 700 }}>(নির্ভয়)</span>
              </span>
              <span style={{
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '2px 7px',
                borderRadius: '6px',
                fontSize: '0.68rem',
                fontWeight: 700
              }}>
                Team_Goku
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
              AI Bangla Prescription Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '999px',
          border: '1px solid #e2e8f0',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              style={{
                border: 'none',
                background: currentTab === tab.id ? '#0284c7' : 'transparent',
                color: currentTab === tab.id ? '#ffffff' : '#475569',
                padding: '7px 13px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: currentTab === tab.id ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setElderlyMode(!elderlyMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: elderlyMode ? '#0284c7' : '#cbd5e1',
              background: elderlyMode ? '#e0f2fe' : '#ffffff',
              color: elderlyMode ? '#0369a1' : '#475569',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Eye size={14} />
            <span>{elderlyMode ? 'Dark / Large Text: ON' : 'Large Text Mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { Pill, Volume2, Sparkles, Eye, ShieldCheck, HeartPulse } from 'lucide-react';

export default function Navbar({ currentTab, setCurrentTab, lang, setLang, elderlyMode, setElderlyMode }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
    }}>
      <div className="container-custom" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('scanner')} 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.35)',
            transform: 'rotate(-4deg)'
          }}>
            <HeartPulse size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0284c7', margin: 0 }}>
                NIRVOY <span style={{ fontSize: '1.15rem', color: '#10b981' }}>(নির্ভয়)</span>
              </h1>
              <span style={{
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.05em'
              }}>
                TEAM GOKU
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, fontWeight: 600 }}>
              {lang === 'bn' ? 'AI বাংলা প্রেসক্রিপশন ইন্টেলিজেন্স' : 'AI-Powered Bangla Prescription Intelligence'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(241, 245, 249, 0.8)',
          padding: '4px',
          borderRadius: '999px',
          border: '1px solid #e2e8f0',
          overflowX: 'auto',
          maxWidth: '100%'
        }}>
          {[
            { id: 'scanner', labelBn: '📷 স্ক্যানার ও OCR', labelEn: '📷 AI Scanner' },
            { id: 'history', labelBn: '📋 প্রেসক্রিপশন হিস্ট্রি', labelEn: '📋 Rx Archive' },
            { id: 'doctor', labelBn: '👨‍⚕️ ডাক্তার ড্যাশবোর্ড', labelEn: '👨‍⚕️ Doctor Portal' },
            { id: 'pharmacy', labelBn: '🏪 ফার্মেসি রাডার', labelEn: '🏪 Pharmacy' },
            { id: 'verify', labelBn: '🛡️ নকল ঔষধ যাচাই', labelEn: '🛡️ Fake Verifier' },
            { id: 'assistant', labelBn: '💬 AI হেলথ অ্যাসিস্ট্যান্ট', labelEn: '💬 AI Health Bot' },
            { id: 'team', labelBn: '👥 টিম পরিচিতি', labelEn: '👥 Team Goku' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              style={{
                border: 'none',
                background: currentTab === tab.id ? '#0ea5e9' : 'transparent',
                color: currentTab === tab.id ? 'white' : '#475569',
                padding: '8px 14px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: currentTab === tab.id ? '0 2px 8px rgba(14, 165, 233, 0.35)' : 'none'
              }}
            >
              {lang === 'bn' ? tab.labelBn : tab.labelEn}
            </button>
          ))}
        </nav>

        {/* Accessibility & Language Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Elderly / Rural Accessibility Mode Toggle */}
          <button
            onClick={() => setElderlyMode(!elderlyMode)}
            title="Senior / High-Contrast Mode"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '999px',
              border: '1.5px solid',
              borderColor: elderlyMode ? '#f59e0b' : '#cbd5e1',
              background: elderlyMode ? '#fef3c7' : 'white',
              color: elderlyMode ? '#b45309' : '#475569',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Eye size={16} />
            <span>{elderlyMode ? (lang === 'bn' ? '👴 সহজ ভিউ সক্রিয়' : '👴 Senior View ON') : (lang === 'bn' ? 'সহজ ভিউ' : 'Senior View')}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            style={{
              padding: '7px 14px',
              borderRadius: '999px',
              border: '1.5px solid #0ea5e9',
              background: '#e0f2fe',
              color: '#0369a1',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{lang === 'bn' ? '🌐 বাংলা (BN)' : '🌐 English (EN)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

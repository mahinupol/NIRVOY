import React, { useState } from 'react';
import { 
  HeartPulse, 
  Eye, 
  Scan, 
  History, 
  Stethoscope, 
  Building2, 
  ShieldCheck, 
  Bot, 
  Users, 
  Menu, 
  X,
  Languages
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ currentTab, setCurrentTab, elderlyMode, setElderlyMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const tabs = [
    { id: 'scanner', label: t('tabScanner'), shortLabel: language === 'bn' ? 'স্ক্যানার' : 'Scanner', icon: Scan },
    { id: 'history', label: t('tabHistory'), shortLabel: language === 'bn' ? 'আর্কাইভ' : 'Archive', icon: History },
    { id: 'doctor', label: t('tabDoctor'), shortLabel: language === 'bn' ? 'ডাক্তার' : 'Doctor', icon: Stethoscope },
    { id: 'pharmacy', label: t('tabPharmacy'), shortLabel: language === 'bn' ? 'ফার্মেসি' : 'Pharmacy', icon: Building2 },
    { id: 'verify', label: t('tabVerify'), shortLabel: language === 'bn' ? 'যাচাই' : 'DGDA', icon: ShieldCheck },
    { id: 'assistant', label: t('tabAssistant'), shortLabel: language === 'bn' ? 'AI বট' : 'AI Bot', icon: Bot },
    { id: 'team', label: t('tabTeam'), shortLabel: language === 'bn' ? 'টিম' : 'Team', icon: Users }
  ];

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Main Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '10px 0'
      }}>
        <div className="container-max" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          {/* Brand Logo */}
          <div 
            onClick={() => handleTabClick('scanner')} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
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
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
              flexShrink: 0
            }}>
              <HeartPulse size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
                  NIRVOY <span style={{ color: '#059669', fontSize: '1rem', fontWeight: 700 }}>({language === 'bn' ? 'নির্ভয়' : 'Prescription AI'})</span>
                </span>
                <span style={{
                  background: '#e0f2fe',
                  color: '#0369a1',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  fontSize: '0.65rem',
                  fontWeight: 700
                }}>
                  Team_Goku
                </span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                {t('brandSubtitle')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav 
            className="hide-on-mobile-xs"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#f1f5f9',
              padding: '4px',
              borderRadius: '999px',
              border: '1px solid #e2e8f0',
              overflowX: 'auto',
              maxWidth: '60%'
            }}
          >
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  style={{
                    border: 'none',
                    background: currentTab === tab.id ? '#0284c7' : 'transparent',
                    color: currentTab === tab.id ? '#ffffff' : '#475569',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: currentTab === tab.id ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: Language Switcher, Senior Mode & Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '999px',
                border: '1px solid #0284c7',
                background: '#eff6ff',
                color: '#0284c7',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(2, 132, 199, 0.15)',
                transition: 'all 0.15s ease'
              }}
              title="Switch Language (বাংলা / English)"
            >
              <Languages size={14} />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Senior Mode Toggle */}
            <button
              onClick={() => setElderlyMode(!elderlyMode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: elderlyMode ? '#0284c7' : '#cbd5e1',
                background: elderlyMode ? '#e0f2fe' : '#ffffff',
                color: elderlyMode ? '#0369a1' : '#475569',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Toggle Large Text Mode"
            >
              <Eye size={13} />
              <span className="hide-on-mobile-xs">{elderlyMode ? t('seniorModeOn') : t('seniorModeOff')}</span>
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: mobileMenuOpen ? '#e0f2fe' : '#f8fafc',
                color: '#0f172a',
                cursor: 'pointer'
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer Menu */}
        {mobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
            padding: '12px',
            zIndex: 99
          }}>
            {/* Quick Language Toggle in Drawer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '6px 8px', background: '#f8fafc', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>ভাষা / Language:</span>
              <button
                onClick={toggleLanguage}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Languages size={12} />
                <span>Switch to {language === 'bn' ? 'English' : 'বাংলা'}</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: isActive ? '#0284c7' : '#e2e8f0',
                      background: isActive ? '#e0f2fe' : '#f8fafc',
                      color: isActive ? '#0369a1' : '#334155',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={16} color={isActive ? '#0284c7' : '#64748b'} />
                    <span>{tab.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Sticky Mobile Bottom Navigation Bar */}
      <div 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '6px 4px',
          zIndex: 1000,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
        }}
      >
        {[
          { id: 'scanner', label: language === 'bn' ? 'স্ক্যানার' : 'Scanner', icon: Scan },
          { id: 'history', label: language === 'bn' ? 'আর্কাইভ' : 'Archive', icon: History },
          { id: 'doctor', label: language === 'bn' ? 'ডাক্তার' : 'Doctor', icon: Stethoscope },
          { id: 'verify', label: language === 'bn' ? 'যাচাই' : 'DGDA', icon: ShieldCheck },
          { id: 'assistant', label: language === 'bn' ? 'AI বট' : 'AI Bot', icon: Bot }
        ].map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                padding: '4px 8px',
                borderRadius: '8px',
                color: isActive ? '#0284c7' : '#64748b',
                cursor: 'pointer',
                flex: 1
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
              <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 700 : 500 }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

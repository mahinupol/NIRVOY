import React, { useState } from 'react';
import { 
  HeartPulse, 
  Scan, 
  History, 
  Stethoscope, 
  Building2, 
  ShieldCheck, 
  Bot, 
  Users, 
  Menu, 
  X, 
  Languages,
  LogIn,
  Mic
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentTab, setCurrentTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const { user, isAuthenticated, isDoctor, openAuthModal, openProfileModal } = useAuth();

  const isBn = language === 'bn';

  const tabs = [
    { id: 'scanner', label: isBn ? 'স্ক্যানার' : 'Scanner', icon: Scan },
    { id: 'consult', label: isBn ? 'ডক্টর রেকর্ড' : 'Doctor Record', icon: Mic },
    { id: 'assistant', label: isBn ? 'AI সহকারী' : 'AI Assistant', icon: Bot },
    { id: 'verify', label: isBn ? 'যাচাই' : 'Verify', icon: ShieldCheck },
    { id: 'history', label: isBn ? 'আর্কাইভ' : 'History', icon: History },
    { id: 'doctor', label: isBn ? 'ডাক্তার প্যাড' : 'Doctor Pad', icon: Stethoscope },
    { id: 'pharmacy', label: isBn ? 'ফার্মেসি' : 'Pharmacy', icon: Building2 },
    { id: 'team', label: isBn ? 'টিম' : 'Team', icon: Users }
  ];

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 0'
      }}>
        <div className="container-max" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Brand Logo */}
          <div 
            onClick={() => handleTabClick('scanner')} 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0
            }}>
              <HeartPulse size={20} />
            </div>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                NIRVOY <span style={{ color: '#0284c7', fontSize: '1rem', fontWeight: 700 }}>({isBn ? 'নির্ভয়' : 'AI'})</span>
              </span>
            </div>
          </div>

          {/* Clean Desktop Navigation Tabs */}
          <nav 
            className="hide-on-tablet-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#f8fafc',
              padding: '4px',
              borderRadius: '999px',
              border: '1px solid #e2e8f0'
            }}
          >
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              const isDoctorTab = tab.id === 'doctor' || tab.id === 'consult';
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  style={{
                    border: 'none',
                    background: isActive ? (isDoctorTab ? '#059669' : '#0284c7') : 'transparent',
                    color: isActive ? '#ffffff' : '#475569',
                    padding: '7px 14px',
                    borderRadius: '999px',
                    fontSize: '0.84rem',
                    fontWeight: isActive ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0
                  }}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Auth / Doctor / Patient Profile Button */}
            {isAuthenticated && user ? (
              <button
                onClick={openProfileModal}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '5px 12px 5px 6px',
                  borderRadius: '999px',
                  border: isDoctor ? '1.5px solid #10b981' : '1px solid #bbf7d0',
                  background: isDoctor ? '#ecfdf5' : '#f0fdf4',
                  color: isDoctor ? '#065f46' : '#166534',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isDoctor ? '#059669' : '#0284c7',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {isDoctor ? '🩺' : (user?.name ? user.name.charAt(0).toUpperCase() : 'P')}
                </div>
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {isDoctor 
                    ? (user?.name?.startsWith('Dr.') || user?.name?.startsWith('ডা.') ? user.name : `Dr. ${user?.name || 'Doctor'}`)
                    : (user?.name || 'Patient').split(' ')[0]}
                </span>
                {isDoctor && (
                  <span style={{
                    background: '#059669',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    fontWeight: 800,
                    letterSpacing: '0.02em'
                  }}>
                    BMDC
                  </span>
                )}
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {/* Dedicated Doctor Portal Button */}
                <button
                  onClick={() => openAuthModal('login', 'doctor')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    border: '1.5px solid #059669',
                    background: '#f0fdf4',
                    color: '#047857',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s'
                  }}
                  title={isBn ? 'ডাক্তার লগইন ও সাইনআপ পোর্টাল' : 'Doctor Login & Registration Portal'}
                >
                  <Stethoscope size={14} color="#059669" />
                  <span>{isBn ? 'ডাক্তার পোর্টাল' : 'Doctor Portal'}</span>
                </button>

                {/* Patient Login Button */}
                <button
                  onClick={() => openAuthModal('login', 'patient')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    border: 'none',
                    background: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <LogIn size={13} />
                  <span>{isBn ? 'লগইন' : 'Sign In'}</span>
                </button>
              </div>
            )}

            {/* Clean Language Switcher */}
            <button
              onClick={toggleLanguage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '999px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
              title="Change Language"
            >
              <Languages size={14} />
              <span>{isBn ? 'EN' : 'বাং'}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="show-on-tablet-mobile hide-on-desktop-nav"
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: mobileMenuOpen ? '#e0f2fe' : '#ffffff',
                color: '#0f172a',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div style={{
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '14px 20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
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
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: isActive ? '#0284c7' : '#e2e8f0',
                      background: isActive ? '#e0f2fe' : '#ffffff',
                      color: isActive ? '#0369a1' : '#334155',
                      fontSize: '0.84rem',
                      fontWeight: isActive ? 700 : 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={16} color={isActive ? '#0284c7' : '#64748b'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Sticky Mobile Bottom Navigation Bar */}
      <div 
        className="hide-on-desktop"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '6px 4px',
          zIndex: 1000,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
        }}
      >
        {[
          { id: 'scanner', label: isBn ? 'স্ক্যানার' : 'Scanner', icon: Scan },
          { id: 'consult', label: isBn ? 'রেকর্ড' : 'Record', icon: Mic },
          { id: 'assistant', label: isBn ? 'AI বট' : 'AI Bot', icon: Bot },
          { id: 'verify', label: isBn ? 'যাচাই' : 'Verify', icon: ShieldCheck },
          { id: 'history', label: isBn ? 'আর্কাইভ' : 'History', icon: History }
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
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              <span style={{ fontSize: '0.68rem', fontWeight: isActive ? 700 : 500 }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

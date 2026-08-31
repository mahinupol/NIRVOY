import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import PrescriptionScanner from './components/PrescriptionScanner';
import BanglaExplainer from './components/BanglaExplainer';
import PatientHistory from './components/PatientHistory';
import DoctorDashboard from './components/DoctorDashboard';
import PharmacyFinder from './components/PharmacyFinder';
import FakeMedicineVerifier from './components/FakeMedicineVerifier';
import HealthChatbot from './components/HealthChatbot';
import TeamShowcase from './components/TeamShowcase';
import AuthModal from './components/AuthModal';
import PatientProfileModal from './components/PatientProfileModal';
import { SAMPLE_PRESCRIPTIONS } from './data/samplePrescriptions';

import { useAuth } from './context/AuthContext';

export default function App() {
  const [currentTab, setCurrentTab] = useState('scanner');
  const [elderlyMode, setElderlyMode] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(SAMPLE_PRESCRIPTIONS[0]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (elderlyMode) {
      document.body.classList.add('elderly-mode');
    } else {
      document.body.classList.remove('elderly-mode');
    }
  }, [elderlyMode]);

  const handleScanComplete = (prescription) => {
    setSelectedPrescription(prescription);

    // ONLY save if user is logged in
    if (isAuthenticated && user?.id && prescription) {
      try {
        const userStorageKey = `NIRVOY_USER_PRESCRIPTIONS_${user.id}`;
        const existing = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
        const updated = [prescription, ...existing.filter(p => p.id !== prescription.id)];
        localStorage.setItem(userStorageKey, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save user prescription:', e);
      }
    }
  };

  const handleSelectFromHistory = (prescription) => {
    setSelectedPrescription(prescription);
    setCurrentTab('scanner');
  };

  const handleNewPrescriptionCreated = (newRx) => {
    setSelectedPrescription(newRx);
    setCurrentTab('scanner');

    // ONLY save if user is logged in
    if (isAuthenticated && user?.id && newRx) {
      try {
        const userStorageKey = `NIRVOY_USER_PRESCRIPTIONS_${user.id}`;
        const existing = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
        const updated = [newRx, ...existing.filter(p => p.id !== newRx.id)];
        localStorage.setItem(userStorageKey, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save user prescription:', e);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        elderlyMode={elderlyMode}
        setElderlyMode={setElderlyMode}
      />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {currentTab === 'scanner' && (
          <HeroBanner
            onStartScan={() => {
              const scannerElem = document.getElementById('ocr-scanner-section');
              if (scannerElem) scannerElem.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenDemo={() => {
              setSelectedPrescription(SAMPLE_PRESCRIPTIONS[1]);
              const scannerElem = document.getElementById('ocr-scanner-section');
              if (scannerElem) scannerElem.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        <div id="ocr-scanner-section">
          {currentTab === 'scanner' && (
            <>
              <PrescriptionScanner
                onScanComplete={handleScanComplete}
                selectedPrescription={selectedPrescription}
                setSelectedPrescription={setSelectedPrescription}
              />
              <BanglaExplainer
                prescription={selectedPrescription}
                elderlyMode={elderlyMode}
              />
            </>
          )}

          {currentTab === 'history' && (
            <PatientHistory
              onSelectPrescription={handleSelectFromHistory}
            />
          )}

          {currentTab === 'doctor' && (
            <DoctorDashboard
              onNewPrescriptionCreated={handleNewPrescriptionCreated}
            />
          )}

          {currentTab === 'pharmacy' && (
            <PharmacyFinder />
          )}

          {currentTab === 'verify' && (
            <FakeMedicineVerifier />
          )}

          {currentTab === 'assistant' && (
            <HealthChatbot />
          )}

          {currentTab === 'team' && (
            <TeamShowcase />
          )}
        </div>
      </main>

      {/* Clean Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '24px 0',
        marginTop: '36px'
      }}>
        <div className="container-max" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>💊</span>
              <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>NIRVOY (নির্ভয়)</strong>
              <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.7rem', fontWeight: 700, padding: '2px 7px', borderRadius: '999px' }}>
                AI Prescription Intelligence
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
              AI-Powered Bangla Prescription Intelligence & Counterfeit Drug Protection.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.82rem', color: '#475569' }}>
            <span>
              Built with precision by <strong style={{ color: '#0284c7' }}>Team_Goku</strong>
            </span>
            <button
              onClick={() => setCurrentTab('team')}
              style={{
                background: '#f1f5f9',
                border: 'none',
                color: '#0284c7',
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Team Profile →
            </button>
          </div>
        </div>
      </footer>

      {/* Auth & Patient Profile Modals */}
      <AuthModal />
      <PatientProfileModal />
    </div>
  );
}

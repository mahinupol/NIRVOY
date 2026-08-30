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
import { SAMPLE_PRESCRIPTIONS } from './data/samplePrescriptions';
import { Heart, Volume2, ShieldCheck, Sparkles, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('scanner');
  const [lang, setLang] = useState('bn');
  const [elderlyMode, setElderlyMode] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(SAMPLE_PRESCRIPTIONS[0]);

  // Sync elderlyMode class on body for high-contrast accessibility
  useEffect(() => {
    if (elderlyMode) {
      document.body.classList.add('elderly-mode');
    } else {
      document.body.classList.remove('elderly-mode');
    }
  }, [elderlyMode]);

  const handleScanComplete = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const handleSelectFromHistory = (prescription) => {
    setSelectedPrescription(prescription);
    setCurrentTab('scanner');
  };

  const handleNewPrescriptionCreated = (newRx) => {
    setSelectedPrescription(newRx);
    setCurrentTab('scanner');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        elderlyMode={elderlyMode}
        setElderlyMode={setElderlyMode}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {/* Show Hero on top when on scanner tab */}
        {currentTab === 'scanner' && (
          <HeroBanner
            lang={lang}
            onStartScan={() => {
              const scannerElem = document.getElementById('ocr-scanner-section');
              if (scannerElem) {
                scannerElem.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onOpenDemo={() => {
              setSelectedPrescription(SAMPLE_PRESCRIPTIONS[1]);
              const scannerElem = document.getElementById('ocr-scanner-section');
              if (scannerElem) {
                scannerElem.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        )}

        <div id="ocr-scanner-section">
          {currentTab === 'scanner' && (
            <>
              <PrescriptionScanner
                lang={lang}
                onScanComplete={handleScanComplete}
                selectedPrescription={selectedPrescription}
                setSelectedPrescription={setSelectedPrescription}
              />
              <BanglaExplainer
                lang={lang}
                prescription={selectedPrescription}
                elderlyMode={elderlyMode}
              />
            </>
          )}

          {currentTab === 'history' && (
            <PatientHistory
              lang={lang}
              onSelectPrescription={handleSelectFromHistory}
            />
          )}

          {currentTab === 'doctor' && (
            <DoctorDashboard
              lang={lang}
              onNewPrescriptionCreated={handleNewPrescriptionCreated}
            />
          )}

          {currentTab === 'pharmacy' && (
            <PharmacyFinder
              lang={lang}
            />
          )}

          {currentTab === 'verify' && (
            <FakeMedicineVerifier
              lang={lang}
            />
          )}

          {currentTab === 'assistant' && (
            <HealthChatbot
              lang={lang}
            />
          )}

          {currentTab === 'team' && (
            <TeamShowcase
              lang={lang}
            />
          )}
        </div>
      </main>

      {/* Playful Footer */}
      <footer style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '32px 20px',
        marginTop: '40px'
      }}>
        <div className="container-custom" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>💊</span>
              <strong style={{ fontSize: '1.1rem', color: '#0284c7' }}>NIRVOY (নির্ভয়)</strong>
              <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                AI Prescription Intelligence
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0' }}>
              {lang === 'bn' ? 'বাংলা প্রেসক্রিপশন সহজীকরণ ও স্বাস্থ্য সুরক্ষা প্ল্যাটফর্ম' : 'AI-Powered Bangla Prescription Intelligence & Counterfeit Drug Protection.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: '#475569' }}>
            <span style={{ fontWeight: 700 }}>
              Crafted with ❤️ by <span style={{ color: '#0ea5e9', fontWeight: 800 }}>Team_Goku</span>
            </span>
            <button
              onClick={() => setCurrentTab('team')}
              style={{
                background: '#e0f2fe',
                border: 'none',
                color: '#0369a1',
                padding: '6px 12px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              টিম পরিচিতি দেখুন →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

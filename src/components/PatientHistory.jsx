import React, { useState, useEffect } from 'react';
import { Download, Search, Calendar, CheckCircle2, Bell, Lock, LogIn, FileText, UserCheck } from 'lucide-react';
import { SAMPLE_PRESCRIPTIONS } from '../data/samplePrescriptions';
import { exportPrescriptionPDF } from '../utils/pdfGenerator';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

export default function PatientHistory({ onSelectPrescription }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [dailyChecklist, setDailyChecklist] = useState({
    morning: false,
    afternoon: false,
    night: false
  });

  // Only load prescriptions if user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      const userStorageKey = `NIRVOY_USER_PRESCRIPTIONS_${user.id}`;
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPrescriptions(parsed);
            return;
          }
        } catch (e) {
          console.warn('Failed to parse user prescriptions:', e);
        }
      }
      // If no custom user prescriptions yet, initialize with clean sample for this logged in user
      setPrescriptions(SAMPLE_PRESCRIPTIONS);
    } else {
      // Not logged in: NO data saved or shown!
      setPrescriptions([]);
    }
  }, [isAuthenticated, user]);

  const handleToggleDose = (slot) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    const nextState = { ...dailyChecklist, [slot]: !dailyChecklist[slot] };
    setDailyChecklist(nextState);

    if (Object.values(nextState).filter(Boolean).length === 3) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const filteredPrescriptions = prescriptions.filter(rx => {
    const query = searchQuery.toLowerCase();
    return (
      (rx.doctorName || '').toLowerCase().includes(query) ||
      (rx.patientName || '').toLowerCase().includes(query) ||
      (rx.diagnosis || '').toLowerCase().includes(query) ||
      (rx.date || '').includes(query)
    );
  });

  // IF NOT LOGGED IN: Do not show or save any data
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '30px 0 50px' }}>
        <div className="container-max" style={{ maxWidth: '640px' }}>
          <div className="clean-card" style={{
            padding: '40px 24px',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '1px solid #fee2e2'
            }}>
              <Lock size={30} />
            </div>

            <h2 style={{ fontSize: '1.45rem', color: '#0f172a', marginBottom: '8px', fontWeight: 800 }}>
              {isBn ? 'লগইন ছাড়া কোনো ডাটা বা প্রেসক্রিপশন সংরক্ষিত হবে না' : 'Login Required to Save & View Prescriptions'}
            </h2>

            <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
              {isBn 
                ? 'আপনার প্রেসক্রিপশন হিস্ট্রি ও স্বাস্থ্য তথ্য স্থায়ীভাবে নিরাপদ ডাটাবেজে সংরক্ষণ করতে অনুগ্রহ করে লগইন করুন।'
                : 'To protect privacy, prescriptions and medical records are only saved when you are signed in to your patient account.'}
            </p>

            <button
              onClick={openAuthModal}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.94rem' }}
            >
              <LogIn size={18} />
              <span>{isBn ? 'লগইন বা একাউন্ট তৈরি করুন' : 'Sign In / Register Account'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // IF LOGGED IN: Show clean prescription archive & dose tracker
  return (
    <div style={{ padding: '12px 0 36px' }}>
      <div className="container-max">
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            {isBn ? 'সংরক্ষিত প্রেসক্রিপশন ও হিস্ট্রি' : 'Prescription Archive & History'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: '540px', margin: '0 auto' }}>
            {isBn 
              ? `${user?.name || 'রোগী'} এর একাউন্টে সংরক্ষিত প্রেসক্রিপশনসমূহ।` 
              : `Saved prescriptions for ${user?.name || 'Patient'}.`}
          </p>
        </div>

        {/* Daily Medication Reminder Checklist */}
        <div className="clean-card" style={{
          padding: '18px 20px',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '14px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: '#059669',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bell size={16} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.98rem', color: '#065f46', fontWeight: 700 }}>
                  {isBn ? 'আজকের ঔষধ খাওয়ার ট্র্যাকার' : 'Today\'s Medicine Tracker'}
                </h3>
              </div>
            </div>

            <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>
              {Object.values(dailyChecklist).filter(Boolean).length}/3 {isBn ? 'সম্পন্ন' : 'Completed'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            {[
              { slot: 'morning', label: isBn ? 'সকাল (Morning)' : 'Morning' },
              { slot: 'afternoon', label: isBn ? 'দুপুর (Noon)' : 'Noon' },
              { slot: 'night', label: isBn ? 'রাত (Night)' : 'Night' }
            ].map(item => {
              const isChecked = dailyChecklist[item.slot];
              return (
                <button
                  key={item.slot}
                  onClick={() => handleToggleDose(item.slot)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: isChecked ? '#10b981' : '#cbd5e1',
                    background: isChecked ? '#ffffff' : '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: isChecked ? '#065f46' : '#334155' }}>
                    {item.label}
                  </span>
                  <CheckCircle2 size={18} color={isChecked ? '#059669' : '#94a3b8'} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '18px',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'ডাক্তারের নাম, রোগ বা তারিখ দিয়ে খুঁজুন...' : 'Search by doctor, disease or date...'}
              style={{
                width: '100%',
                padding: '9px 14px 9px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.86rem',
                outline: 'none',
                background: '#ffffff'
              }}
            />
          </div>
        </div>

        {/* Prescriptions List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {filteredPrescriptions.map(rx => (
            <div
              key={rx.id}
              className="clean-card"
              style={{
                padding: '18px',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700
                  }}>
                    {rx.id}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#64748b' }}>
                    <Calendar size={12} />
                    <span>{rx.date}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: '0 0 2px', fontWeight: 800 }}>
                  {rx.doctorName}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 8px' }}>
                  {rx.hospital || rx.qualifications}
                </p>

                <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem', color: '#334155', marginBottom: '10px' }}>
                  <strong>{isBn ? 'রোগ / সমস্যা:' : 'Diagnosis:'}</strong> {rx.diagnosis}
                </div>

                <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                  <strong>{isBn ? 'ঔষধসমূহ:' : 'Medicines:'}</strong>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                    {(rx.medicines || rx.boundingBoxes || []).map((m, i) => (
                      <li key={i}>{m.brandName || m.detectedMedicine} ({m.dosage || '1+0+1'})</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => onSelectPrescription && onSelectPrescription(rx)}
                  className="btn-primary"
                  style={{ flex: 1, padding: '7px 12px', fontSize: '0.8rem' }}
                >
                  <FileText size={14} />
                  <span>{isBn ? 'বিশ্লেষণ দেখুন' : 'View Details'}</span>
                </button>

                <button
                  onClick={() => exportPrescriptionPDF(rx)}
                  className="btn-outline"
                  style={{ padding: '7px 10px' }}
                  title="Download PDF"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

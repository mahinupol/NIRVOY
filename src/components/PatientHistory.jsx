import React, { useState } from 'react';
import { FileText, Download, Search, Calendar, CheckCircle2, Clock, Bell, User, Heart, Sparkles } from 'lucide-react';
import { SAMPLE_PRESCRIPTIONS } from '../data/samplePrescriptions';
import { exportPrescriptionPDF } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';

export default function PatientHistory({ lang, onSelectPrescription }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptions, setPrescriptions] = useState(SAMPLE_PRESCRIPTIONS);
  const [dailyChecklist, setDailyChecklist] = useState({
    morning: false,
    afternoon: false,
    night: false
  });

  const handleToggleDose = (slot) => {
    const nextState = { ...dailyChecklist, [slot]: !dailyChecklist[slot] };
    setDailyChecklist(nextState);

    // If all completed, trigger celebratory confetti
    if (Object.values(nextState).filter(Boolean).length === 3) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const filteredPrescriptions = prescriptions.filter(rx => {
    const query = searchQuery.toLowerCase();
    return (
      rx.doctorName.toLowerCase().includes(query) ||
      rx.patientName.toLowerCase().includes(query) ||
      rx.diagnosis.toLowerCase().includes(query) ||
      rx.date.includes(query)
    );
  });

  return (
    <div style={{ padding: '10px 0 40px' }}>
      <div className="container-custom">
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#e0e7ff',
            color: '#4338ca',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            MODULE 3 • PATIENT HISTORY & ARCHIVE
          </div>
          <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '8px' }}>
            {lang === 'bn' ? 'ডিজিটাল প্রেসক্রিপশন আর্কাইভ ও হিস্ট্রি' : 'Digital Prescription Archive & History'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '680px', margin: '0 auto' }}>
            {lang === 'bn' 
              ? 'আপনার পূর্ববর্তী সকল প্রেসক্রিপশন এক জায়গায় সংরক্ষণ করুন, তারিখ অনুযায়ী খুঁজুন এবং ১-ক্লিকে পিডিএফ ডাউনলোড করুন।'
              : 'Maintain an encrypted digital archive of past consultations with instant search and 1-click PDF downloads.'}
          </p>
        </div>

        {/* Daily Medication Reminder Adherence Widget */}
        <div className="playful-card" style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          border: '2px solid #a7f3d0',
          borderRadius: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: '#10b981',
                color: 'white',
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                <Bell size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#065f46' }}>
                  {lang === 'bn' ? 'আজকের ঔষধ রিমাইন্ডার ও সেবন ট্র্যাকার' : "Today's Medicine Dose Tracker"}
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#047857' }}>
                  {lang === 'bn' ? 'সময়মতো ঔষধ খেয়ে টিক চিহ্ন দিন ও নিয়মিত থাকুন' : 'Mark daily doses as taken to maintain your recovery score'}
                </p>
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#059669',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}>
              {Object.values(dailyChecklist).filter(Boolean).length} / 3 Completed
            </div>
          </div>

          {/* Dose Slots checklist */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { id: 'morning', labelBn: '🌅 সকালের ডোজ (৮:০০ AM)', labelEn: '🌅 Morning Dose (8:00 AM)', desc: 'Napa Extra + Seclo 20' },
              { id: 'afternoon', labelBn: '☀️ দুপুরের ডোজ (১:৩০ PM)', labelEn: '☀️ Noon Dose (1:30 PM)', desc: 'Azithrocin 500' },
              { id: 'night', labelBn: '🌙 রাতের ডোজ (৯:৩০ PM)', labelEn: '🌙 Night Dose (9:30 PM)', desc: 'Napa Extra + Monas 10' }
            ].map(slot => {
              const isChecked = dailyChecklist[slot.id];
              return (
                <div
                  key={slot.id}
                  onClick={() => handleToggleDose(slot.id)}
                  style={{
                    background: isChecked ? '#dcfce7' : 'white',
                    border: '2px solid',
                    borderColor: isChecked ? '#10b981' : '#cbd5e1',
                    borderRadius: '16px',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isChecked ? '#15803d' : '#1e293b' }}>
                      {lang === 'bn' ? slot.labelBn : slot.labelEn}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      {slot.desc}
                    </div>
                  </div>

                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isChecked ? '#10b981' : '#f1f5f9',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #cbd5e1'
                  }}>
                    {isChecked && <CheckCircle2 size={16} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            position: 'relative',
            flex: 1,
            minWidth: '280px',
            maxWidth: '480px'
          }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'ডাক্তার, রোগ বা তারিখ দিয়ে খুঁজুন...' : 'Search by doctor, diagnosis, date...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: '999px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                background: 'white'
              }}
            />
          </div>

          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>
            {lang === 'bn' ? `মোট প্রেসক্রিপশন: ${filteredPrescriptions.length} টি` : `Total Records: ${filteredPrescriptions.length}`}
          </div>
        </div>

        {/* Prescription Timeline Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="playful-card"
              style={{
                padding: '24px',
                background: 'white',
                borderRadius: '24px',
                border: '1.5px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#0ea5e9', fontWeight: 700, marginBottom: '4px' }}>
                      <Calendar size={14} />
                      <span>{rx.date}</span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0 }}>
                      {rx.doctorName}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0' }}>
                      {rx.qualifications}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>
                      {rx.hospital}
                    </p>
                  </div>

                  <span style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    {rx.id}
                  </span>
                </div>

                {/* Patient & Diagnosis */}
                <div style={{
                  background: '#f8fafc',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  color: '#334155',
                  marginBottom: '14px'
                }}>
                  <div><strong>রোগী:</strong> {rx.patientName} ({rx.patientAge} Y, {rx.patientGender})</div>
                  <div style={{ marginTop: '4px' }}><strong>রোগের বিবরণ:</strong> <span style={{ color: '#0369a1' }}>{rx.diagnosis}</span></div>
                </div>

                {/* Prescribed medicines tags */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                    ঔষধের তালিকা ({rx.boundingBoxes.length} টি):
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {rx.boundingBoxes.map((box, i) => (
                      <span
                        key={i}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#1e293b'
                        }}
                      >
                        {box.detectedMedicine} ({box.dosage})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                paddingTop: '16px',
                borderTop: '1px solid #f1f5f9'
              }}>
                <button
                  onClick={() => exportPrescriptionPDF(rx)}
                  className="playful-btn playful-btn-outline"
                  style={{ flex: 1, padding: '10px 14px', fontSize: '0.82rem' }}
                >
                  <Download size={16} />
                  <span>{lang === 'bn' ? 'পিডিএফ ডাউনলোড' : 'Download PDF'}</span>
                </button>

                <button
                  onClick={() => onSelectPrescription(rx)}
                  className="playful-btn playful-btn-primary"
                  style={{ flex: 1, padding: '10px 14px', fontSize: '0.82rem' }}
                >
                  <Sparkles size={16} />
                  <span>{lang === 'bn' ? 'বাংলায় দেখুন' : 'View in Bangla'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

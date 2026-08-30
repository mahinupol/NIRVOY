import React, { useState } from 'react';
import { Download, Search, Calendar, CheckCircle2, Bell, Sparkles } from 'lucide-react';
import { SAMPLE_PRESCRIPTIONS } from '../data/samplePrescriptions';
import { exportPrescriptionPDF } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';

export default function PatientHistory({ onSelectPrescription }) {
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

    if (Object.values(nextState).filter(Boolean).length === 3) {
      confetti({
        particleCount: 60,
        spread: 70,
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
    <div style={{ padding: '8px 0 36px' }}>
      <div className="container-max">
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#e0e7ff',
            color: '#4338ca',
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '6px'
          }}>
            MODULE 3 • PATIENT HISTORY & ARCHIVE
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Prescription Archive & Daily Tracker (প্রেসক্রিপশন হিস্ট্রি)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
            আপনার পূর্ববর্তী প্রেসক্রিপশন সংরক্ষণ করুন এবং দৈনিক ওষুধ সেবন ট্র্যাকার দিয়ে নিয়মিত থাকুন।
          </p>
        </div>

        {/* Daily Medication Reminder Checklist */}
        <div className="clean-card" style={{
          padding: '20px',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: '#059669',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bell size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#065f46', fontWeight: 700 }}>
                  Daily Medicine Dose Tracker (দৈনিক ঔষধ ট্র্যাকার)
                </h3>
                <p style={{ margin: '1px 0 0', fontSize: '0.75rem', color: '#047857' }}>
                  Mark your daily doses once taken to keep your medication adherence on track.
                </p>
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#059669',
              border: '1px solid #bbf7d0'
            }}>
              {Object.values(dailyChecklist).filter(Boolean).length} / 3 Completed
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {[
              { id: 'morning', label: 'Morning Dose (সকাল ৮:০০)', desc: 'Napa Extra + Seclo 20' },
              { id: 'afternoon', label: 'Noon Dose (দুপুর ১:৩০)', desc: 'Azithrocin 500' },
              { id: 'night', label: 'Night Dose (রাত ৯:৩০)', desc: 'Napa Extra + Monas 10' }
            ].map(slot => {
              const isChecked = dailyChecklist[slot.id];
              return (
                <div
                  key={slot.id}
                  onClick={() => handleToggleDose(slot.id)}
                  style={{
                    background: isChecked ? '#dcfce7' : '#ffffff',
                    border: '1px solid',
                    borderColor: isChecked ? '#059669' : '#cbd5e1',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isChecked ? '#15803d' : '#0f172a' }}>
                      {slot.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>
                      {slot.desc}
                    </div>
                  </div>

                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: isChecked ? '#059669' : '#f1f5f9',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #cbd5e1'
                  }}>
                    {isChecked && <CheckCircle2 size={14} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '420px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              placeholder="Search by doctor, diagnosis, date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px 9px 36px',
                borderRadius: '999px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none',
                background: '#ffffff'
              }}
            />
          </div>

          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            Total Records: <strong>{filteredPrescriptions.length}</strong>
          </div>
        </div>

        {/* Prescription Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="clean-card"
              style={{
                padding: '18px',
                background: '#ffffff',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#0284c7', fontWeight: 700, marginBottom: '2px' }}>
                      <Calendar size={12} />
                      <span>{rx.date}</span>
                    </div>
                    <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>
                      {rx.doctorName}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '1px 0' }}>
                      {rx.qualifications}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>
                      {rx.hospital}
                    </p>
                  </div>

                  <span style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.68rem',
                    fontWeight: 700
                  }}>
                    {rx.id}
                  </span>
                </div>

                <div style={{
                  background: '#f8fafc',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  color: '#334155',
                  marginBottom: '10px'
                }}>
                  <div><strong>Patient:</strong> {rx.patientName} ({rx.patientAge} Y, {rx.patientGender})</div>
                  <div style={{ marginTop: '2px' }}><strong>Diagnosis:</strong> <span style={{ color: '#0369a1' }}>{rx.diagnosis}</span></div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                    Prescribed Medicines ({rx.boundingBoxes.length}):
                  </span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {rx.boundingBoxes.map((box, i) => (
                      <span
                        key={i}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: '#1e293b'
                        }}
                      >
                        {box.detectedMedicine} ({box.dosage})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => exportPrescriptionPDF(rx)}
                  className="btn-outline"
                  style={{ flex: 1, padding: '7px 10px', fontSize: '0.75rem' }}
                >
                  <Download size={13} />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => onSelectPrescription(rx)}
                  className="btn-primary"
                  style={{ flex: 1, padding: '7px 10px', fontSize: '0.75rem' }}
                >
                  <Sparkles size={13} />
                  <span>View in Scanner</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

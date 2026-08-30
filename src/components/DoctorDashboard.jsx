import React, { useState } from 'react';
import { UserCheck, Plus, Trash2, Download, Stethoscope } from 'lucide-react';
import { BANGLADESHI_MEDICINES } from '../data/medicinesData';
import { exportPrescriptionPDF } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';

export default function DoctorDashboard({ onNewPrescriptionCreated }) {
  const [doctorInfo, setDoctorInfo] = useState({
    name: "Prof. Dr. M. A. Rahman",
    qualifications: "MBBS, FCPS (Medicine), MACP (USA)",
    hospital: "Dhaka Medical College & Hospital",
    regNumber: "BMDC-A-45892"
  });

  const [patientInfo, setPatientInfo] = useState({
    name: "Mohammad Tanvir",
    age: "34",
    gender: "Male",
    phone: "+880 1712-345678",
    diagnosis: "Acute Bronchitis & Peptic Acid Flare"
  });

  const [prescriptionItems, setPrescriptionItems] = useState([
    {
      id: "dr-1",
      brandName: "Napa Extra",
      generic: "Paracetamol 500mg + Caffeine 65mg",
      dosage: "1+0+1",
      duration: "5 days",
      timing: "খাবার পর",
      advice: "জ্বর বা ব্যথার জন্য"
    },
    {
      id: "dr-2",
      brandName: "Seclo 20",
      generic: "Omeprazole 20mg",
      dosage: "1+0+1",
      duration: "14 days",
      timing: "খাওয়ার ৩০ মিনিট আগে",
      advice: "গ্যাস্ট্রিকের জন্য"
    }
  ]);

  const [selectedMedToAdd, setSelectedMedToAdd] = useState(BANGLADESHI_MEDICINES[0].brandName);
  const [newDosage, setNewDosage] = useState('1+0+1');
  const [newDuration, setNewDuration] = useState('7 days');
  const [newTiming, setNewTiming] = useState('খাবার পর');

  const handleAddMedicine = () => {
    const medObj = BANGLADESHI_MEDICINES.find(m => m.brandName === selectedMedToAdd) || BANGLADESHI_MEDICINES[0];
    const newItem = {
      id: `dr-${Date.now()}`,
      brandName: medObj.brandName,
      generic: medObj.generic,
      dosage: newDosage,
      duration: newDuration,
      timing: newTiming,
      advice: medObj.purposeBn
    };

    setPrescriptionItems([...prescriptionItems, newItem]);
  };

  const handleRemoveMedicine = (id) => {
    setPrescriptionItems(prescriptionItems.filter(item => item.id !== id));
  };

  const handleGenerateRx = () => {
    const rxObject = {
      id: `RX-GEN-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${patientInfo.name} Prescription`,
      doctorName: doctorInfo.name,
      qualifications: doctorInfo.qualifications,
      hospital: doctorInfo.hospital,
      date: new Date().toISOString().split('T')[0],
      patientName: patientInfo.name,
      patientAge: patientInfo.age,
      patientGender: patientInfo.gender,
      diagnosis: patientInfo.diagnosis,
      ocrConfidence: 100,
      boundingBoxes: prescriptionItems.map(item => ({
        id: item.id,
        label: item.brandName,
        rawText: item.brandName,
        detectedMedicine: item.brandName,
        dosage: item.dosage,
        duration: item.duration,
        confidence: 100,
        timing: item.timing
      })),
      medicines: prescriptionItems
    };

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    exportPrescriptionPDF(rxObject);
    if (onNewPrescriptionCreated) onNewPrescriptionCreated(rxObject);
  };

  return (
    <div style={{ padding: '8px 0 36px' }}>
      <div className="container-max">
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#dcfce7',
            color: '#15803d',
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '6px'
          }}>
            MODULE 4 • DOCTOR DASHBOARD & DIGITAL RX
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Doctor Digital Prescription Builder (চিকিৎসক পোর্টাল)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
            ডিজিটাল প্রেসক্রিপশন তৈরি করুন যাতে রোগীরা সহজেই ১০০% স্পষ্ট ও ত্রুটিমুক্ত প্রেসক্রিপশন পেতে পারেন।
          </p>
        </div>

        {/* Doctor & Patient Information Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}>
          {/* Doctor Info */}
          <div className="clean-card" style={{ padding: '18px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                background: '#0284c7',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Stethoscope size={16} />
              </div>
              <h3 style={{ fontSize: '0.98rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>
                Doctor Profile (চিকিৎসক পরিচিতি)
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>Doctor Name:</label>
                <input
                  type="text"
                  value={doctorInfo.name}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, name: e.target.value })}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>Degrees & Hospital:</label>
                <input
                  type="text"
                  value={doctorInfo.qualifications}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, qualifications: e.target.value })}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="clean-card" style={{ padding: '18px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                background: '#059669',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserCheck size={16} />
              </div>
              <h3 style={{ fontSize: '0.98rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>
                Patient Details (রোগীর তথ্য)
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '6px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>Name:</label>
                  <input
                    type="text"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>Age:</label>
                  <input
                    type="text"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>Gender:</label>
                  <select
                    value={patientInfo.gender}
                    onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                    style={{ width: '100%', padding: '6px 4px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    <option value="Male">Male (পুরুষ)</option>
                    <option value="Female">Female (মহিলা)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>Diagnosis / Symptoms:</label>
                <input
                  type="text"
                  value={patientInfo.diagnosis}
                  onChange={(e) => setPatientInfo({ ...patientInfo, diagnosis: e.target.value })}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Prescription Builder */}
        <div className="clean-card" style={{ padding: '20px', background: '#ffffff', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} color="#0284c7" />
            <span>Add Medication to Rx (ওষুধ যোগ করুন)</span>
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
            alignItems: 'flex-end',
            background: '#f8fafc',
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '16px'
          }}>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '3px' }}>
                Select Medicine (ঔষধ):
              </label>
              <select
                value={selectedMedToAdd}
                onChange={(e) => setSelectedMedToAdd(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 600 }}
              >
                {BANGLADESHI_MEDICINES.map(med => (
                  <option key={med.id} value={med.brandName}>
                    {med.brandName} ({med.generic})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '3px' }}>
                Dosage (মাত্রা):
              </label>
              <select
                value={newDosage}
                onChange={(e) => setNewDosage(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              >
                <option value="1+0+1">1+0+1 (Morning & Night)</option>
                <option value="1+1+1">1+1+1 (Morning, Noon & Night)</option>
                <option value="0+0+1">0+0+1 (Bedtime / Night)</option>
                <option value="1+0+0">1+0+0 (Morning)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '3px' }}>
                Duration (স্থায়িত্ব):
              </label>
              <input
                type="text"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                placeholder="e.g. 5 days, 1 month"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '3px' }}>
                Timing (খাওয়ার নিয়ম):
              </label>
              <select
                value={newTiming}
                onChange={(e) => setNewTiming(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              >
                <option value="খাবার পর">খাবার পর (After meal)</option>
                <option value="খাওয়ার ৩০ মিনিট আগে">খাওয়ার ৩০ মিনিট আগে (Before meal)</option>
                <option value="খাবারের সাথে">খাবারের সাথে (With food)</option>
              </select>
            </div>

            <div>
              <button
                onClick={handleAddMedicine}
                className="btn-secondary"
                style={{ width: '100%', padding: '7px 14px', fontSize: '0.82rem' }}
              >
                <Plus size={14} />
                <span>Add (যোগ করুন)</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left' }}>
                  <th style={{ padding: '8px 12px' }}>#</th>
                  <th style={{ padding: '8px 12px' }}>Medicine & Generic</th>
                  <th style={{ padding: '8px 12px' }}>Dosage</th>
                  <th style={{ padding: '8px 12px' }}>Duration</th>
                  <th style={{ padding: '8px 12px' }}>Instructions</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {prescriptionItems.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700 }}>{idx + 1}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <strong style={{ color: '#0f172a' }}>{item.brandName}</strong>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.generic}</div>
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0284c7' }}>{item.dosage}</td>
                    <td style={{ padding: '10px 12px' }}>{item.duration}</td>
                    <td style={{ padding: '10px 12px', color: '#059669', fontWeight: 600 }}>{item.timing}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleRemoveMedicine(item.id)}
                        style={{
                          background: '#fef2f2',
                          border: 'none',
                          color: '#e11d48',
                          padding: '4px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid #f1f5f9'
          }}>
            <button
              onClick={handleGenerateRx}
              className="btn-primary"
              style={{ padding: '9px 20px' }}
            >
              <Download size={15} />
              <span>Generate & Download Rx PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

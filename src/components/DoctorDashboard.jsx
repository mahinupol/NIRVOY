import React, { useState } from 'react';
import { UserCheck, Plus, Trash2, Printer, Download, Sparkles, CheckCircle2, Stethoscope, Search } from 'lucide-react';
import { BANGLADESHI_MEDICINES } from '../data/medicinesData';
import { exportPrescriptionPDF } from '../utils/pdfGenerator';
import confetti from 'canvas-confetti';

export default function DoctorDashboard({ lang, onNewPrescriptionCreated }) {
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
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });

    exportPrescriptionPDF(rxObject);
    if (onNewPrescriptionCreated) onNewPrescriptionCreated(rxObject);
  };

  return (
    <div style={{ padding: '10px 0 40px' }}>
      <div className="container-custom">
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#dcfce7',
            color: '#15803d',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            MODULE 4 • DOCTOR DASHBOARD & DIGITAL RX
          </div>
          <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '8px' }}>
            {lang === 'bn' ? 'চিকিৎসকের ডিজিটাল প্রেসক্রিপশন পোর্টাল' : 'Physician Digital Prescription Suite'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '680px', margin: '0 auto' }}>
            {lang === 'bn' 
              ? 'হাতের লেখার বদলে দ্রুত নির্ভুল ডিজিটাল প্রেসক্রিপশন তৈরি করুন যা রোগী ও ফার্মেসির জন্য ১০০% স্পষ্ট।'
              : 'Empower doctors to generate structured, error-free digital prescriptions eliminating handwriting confusion.'}
          </p>
        </div>

        {/* Doctor & Patient Information Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Doctor Card */}
          <div className="playful-card" style={{ padding: '24px', background: 'white', border: '1.5px solid #bae6fd' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                background: '#0ea5e9',
                color: 'white',
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Stethoscope size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a', margin: 0 }}>
                {lang === 'bn' ? 'চিকিৎসক পরিচিতি' : 'Doctor Profile'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>চিকিৎসকের নাম:</label>
                <input
                  type="text"
                  value={doctorInfo.name}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>ডিগ্রি ও পদবী:</label>
                <input
                  type="text"
                  value={doctorInfo.qualifications}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, qualifications: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>হাসপাতাল / চেম্বার:</label>
                <input
                  type="text"
                  value={doctorInfo.hospital}
                  onChange={(e) => setDoctorInfo({ ...doctorInfo, hospital: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          {/* Patient Card */}
          <div className="playful-card" style={{ padding: '24px', background: 'white', border: '1.5px solid #bbf7d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                background: '#10b981',
                color: 'white',
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#0f172a', margin: 0 }}>
                {lang === 'bn' ? 'রোগীর তথ্য' : 'Patient Information'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>নাম:</label>
                  <input
                    type="text"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>বয়স:</label>
                  <input
                    type="text"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>লিঙ্গ:</label>
                  <select
                    value={patientInfo.gender}
                    onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                    style={{ width: '100%', padding: '8px 6px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  >
                    <option value="Male">পুরুষ</option>
                    <option value="Female">মহিলা</option>
                    <option value="Other">অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>রোগের লক্ষণ / ডায়াগনোসিস:</label>
                <input
                  type="text"
                  value={patientInfo.diagnosis}
                  onChange={(e) => setPatientInfo({ ...patientInfo, diagnosis: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Prescription Item Builder */}
        <div className="playful-card" style={{ padding: '24px', background: 'white', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} color="#0ea5e9" />
            <span>{lang === 'bn' ? 'প্রেসক্রিপশনে ওষুধ যোগ করুন' : 'Add Medication to Rx'}</span>
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            alignItems: 'flex-end',
            background: '#f8fafc',
            padding: '16px',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                ঔষধ নির্বাচন করুন (BD Drug DB):
              </label>
              <select
                value={selectedMedToAdd}
                onChange={(e) => setSelectedMedToAdd(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
              >
                {BANGLADESHI_MEDICINES.map(med => (
                  <option key={med.id} value={med.brandName}>
                    {med.brandName} ({med.generic})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                ডোজ (Dose):
              </label>
              <select
                value={newDosage}
                onChange={(e) => setNewDosage(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem' }}
              >
                <option value="1+0+1">1+0+1 (সকাল ও রাত)</option>
                <option value="1+1+1">1+1+1 (সকাল, দুপুর ও রাত)</option>
                <option value="0+0+1">0+0+1 (শুধু রাতে)</option>
                <option value="1+0+0">1+0+0 (শুধু সকালে)</option>
                <option value="1+1+1+1">1+1+1+1 (দিনে ৪ বার)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                স্থায়িত্ব (Duration):
              </label>
              <input
                type="text"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem' }}
                placeholder="যেমন: 5 days, 1 month"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                খাওয়ার নিয়ম:
              </label>
              <select
                value={newTiming}
                onChange={(e) => setNewTiming(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem' }}
              >
                <option value="খাবার পর">খাবার পর (After meal)</option>
                <option value="খাওয়ার ৩০ মিনিট আগে">খাওয়ার ৩০ মিনিট আগে (Before meal)</option>
                <option value="খাবারের সাথে">খাবারের সাথে (With food)</option>
                <option value="ঘুমানোর আগে">ঘুমানোর আগে (Bedtime)</option>
              </select>
            </div>

            <div>
              <button
                onClick={handleAddMedicine}
                className="playful-btn playful-btn-secondary"
                style={{ width: '100%', padding: '10px 16px', fontSize: '0.85rem' }}
              >
                <Plus size={16} />
                <span>যোগ করুন (Add)</span>
              </button>
            </div>
          </div>

          {/* Table of added medicines */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', borderRadius: '8px 0 0 8px' }}>#</th>
                  <th style={{ padding: '10px 14px' }}>ঔষধ ও জেনেরিক নাম</th>
                  <th style={{ padding: '10px 14px' }}>ডোজ</th>
                  <th style={{ padding: '10px 14px' }}>সময়কাল</th>
                  <th style={{ padding: '10px 14px' }}>খাওয়ার নিয়ম</th>
                  <th style={{ padding: '10px 14px', borderRadius: '0 8px 8px 0', textAlign: 'center' }}>অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {prescriptionItems.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800 }}>{idx + 1}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <strong style={{ color: '#0f172a' }}>{item.brandName}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.generic}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0284c7' }}>{item.dosage}</td>
                    <td style={{ padding: '12px 14px' }}>{item.duration}</td>
                    <td style={{ padding: '12px 14px', color: '#059669', fontWeight: 600 }}>{item.timing}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleRemoveMedicine(item.id)}
                        style={{
                          background: '#fef2f2',
                          border: 'none',
                          color: '#ef4444',
                          padding: '6px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export / Print Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #f1f5f9'
          }}>
            <button
              onClick={handleGenerateRx}
              className="playful-btn playful-btn-primary"
              style={{ padding: '12px 28px' }}
            >
              <Download size={18} />
              <span>{lang === 'bn' ? 'ডিজিটাল প্রেসক্রিপশন তৈরি ও পিডিএফ ডাউনলোড' : 'Generate & Download PDF Rx'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

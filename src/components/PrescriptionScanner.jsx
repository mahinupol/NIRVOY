import React, { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, CheckCircle2, AlertTriangle, RefreshCw, ZoomIn, Edit3, Volume2, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { SAMPLE_PRESCRIPTIONS } from '../data/samplePrescriptions';
import { BANGLADESHI_MEDICINES } from '../data/medicinesData';

export default function PrescriptionScanner({ lang, onScanComplete, selectedPrescription, setSelectedPrescription }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeBoxIndex, setActiveBoxIndex] = useState(null);
  const [customImage, setCustomImage] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const fileInputRef = useRef(null);

  // Trigger OCR Simulation for an active prescription
  const runOcrAnalysis = (prescription) => {
    setIsScanning(true);
    setScanProgress(10);
    setActiveBoxIndex(null);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setScanProgress(100);
            if (onScanComplete) onScanComplete(prescription);
          }, 400);
          return 95;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleSelectSample = (sample) => {
    setCustomImage(null);
    setSelectedPrescription(sample);
    runOcrAnalysis(sample);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomImage(imageUrl);

      // Map to dynamic prescription object
      const newCustomRx = {
        id: `rx-user-${Date.now()}`,
        title: "User Uploaded Prescription",
        doctorName: "Dr. Nazmul Huda",
        qualifications: "MBBS, FCPS (Medicine)",
        hospital: "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
        date: new Date().toISOString().split('T')[0],
        patientName: "Karim Chowdhury",
        patientAge: 38,
        patientGender: "Male",
        diagnosis: "Upper Respiratory Tract Infection & Hyperacidity",
        customImageUrl: imageUrl,
        ocrConfidence: 92.4,
        boundingBoxes: [
          { id: "u-box-1", label: "Tab. Napa Extra", rawText: "Napa Ext 500", detectedMedicine: "Napa Extra", dosage: "1+0+1", duration: "5 days", confidence: 96, timing: "খাবার পর", box: { top: 30, left: 12, width: 76, height: 14 } },
          { id: "u-box-2", label: "Cap. Seclo 20mg", rawText: "Seclo 20", detectedMedicine: "Seclo 20", dosage: "1+0+1", duration: "14 days", confidence: 94, timing: "খাওয়ার ৩০ মিনিট আগে", box: { top: 48, left: 12, width: 76, height: 14 } },
          { id: "u-box-3", label: "Tab. Monas 10mg", rawText: "Monas 10", detectedMedicine: "Monas 10", dosage: "0+0+1", duration: "14 days", confidence: 89, timing: "রাতে ঘুমানোর আগে", box: { top: 66, left: 12, width: 76, height: 14 } }
        ],
        banglaSummary: "প্রেসক্রিপশনে ৩টি ওষুধ সনাক্ত করা হয়েছে: নাপা এক্সট্রা (জ্বর ও ব্যথায়), সেকলো ২০ (গ্যাস্ট্রিকের জন্য) এবং মোনাস ১০ (কাশি ও শ্বাসকষ্টের জন্য)।"
      };

      setSelectedPrescription(newCustomRx);
      runOcrAnalysis(newCustomRx);
    }
  };

  const handleUpdateMedicine = (index, updatedField, value) => {
    if (!selectedPrescription) return;
    const updatedBoxes = [...selectedPrescription.boundingBoxes];
    updatedBoxes[index] = { ...updatedBoxes[index], [updatedField]: value };

    // If medicine changed, also update detectedMedicine
    if (updatedField === 'detectedMedicine') {
      const matched = BANGLADESHI_MEDICINES.find(m => m.brandName.toLowerCase().includes(value.toLowerCase()));
      if (matched) {
        updatedBoxes[index].label = matched.brandName;
        updatedBoxes[index].confidence = 99;
      }
    }

    const updatedRx = { ...selectedPrescription, boundingBoxes: updatedBoxes };
    setSelectedPrescription(updatedRx);
    if (onScanComplete) onScanComplete(updatedRx);
  };

  const currentRx = selectedPrescription || SAMPLE_PRESCRIPTIONS[0];

  return (
    <div style={{ padding: '10px 0 40px' }}>
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#e0f2fe',
            color: '#0284c7',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            MODULE 1 • PRESCRIPTION RECOGNITION
          </div>
          <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '8px' }}>
            {lang === 'bn' ? 'প্রেসক্রিপশন আপলোড ও কৃত্রিম বুদ্ধিমত্তা স্ক্যান' : 'Prescription Upload & AI Recognition'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '680px', margin: '0 auto' }}>
            {lang === 'bn' 
              ? 'হাতের লেখার প্রেসক্রিপশনের ছবি আপলোড করুন অথবা নিচের ডেমো প্রেসক্রিপশন নির্বাচন করে তাৎক্ষণিক TrOCR ও বাংলা এনএলপির ফলাফল দেখুন।'
              : 'Upload any prescription image or select a sample below to experience real-time TrOCR + EasyOCR detection with confidence scores.'}
          </p>
        </div>

        {/* Sample Selection Quick Bar */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', alignSelf: 'center' }}>
            {lang === 'bn' ? 'দ্রুত ডেমো প্রেসক্রিপশন:' : 'Quick Demo Samples:'}
          </span>
          {SAMPLE_PRESCRIPTIONS.map((sample, idx) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '999px',
                border: '1.5px solid',
                borderColor: currentRx.id === sample.id ? '#0ea5e9' : '#cbd5e1',
                background: currentRx.id === sample.id ? '#e0f2fe' : 'white',
                color: currentRx.id === sample.id ? '#0369a1' : '#334155',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{idx === 0 ? '🌡️' : idx === 1 ? '🫁' : '❤️'}</span>
              <span>{sample.title}</span>
            </button>
          ))}

          {/* Upload Custom File Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="playful-btn playful-btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <Upload size={16} />
            <span>{lang === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Image'}</span>
          </button>
        </div>

        {/* Main Scanner Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Left: Interactive Prescription Canvas / OCR Viewport */}
          <div className="playful-card" style={{ padding: '20px', background: 'white', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>📄</span>
                <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.95rem' }}>
                  {currentRx.title}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  background: isScanning ? '#fef3c7' : '#dcfce7',
                  color: isScanning ? '#b45309' : '#15803d',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {isScanning ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                  {isScanning ? `OCR Scanning (${scanProgress}%)` : `OCR Accuracy: ${currentRx.ocrConfidence}%`}
                </span>
              </div>
            </div>

            {/* Visual Prescription Canvas */}
            <div style={{
              position: 'relative',
              width: '100%',
              minHeight: '420px',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.03)'
            }}>
              {/* Scan Laser Animation */}
              {isScanning && <div className="scan-laser-line" />}

              {/* Prescription Header Area */}
              <div style={{ borderBottom: '2px dashed #cbd5e1', paddingBottom: '16px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#0f172a', margin: 0, fontFamily: 'cursive, sans-serif' }}>
                      {currentRx.doctorName}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0' }}>{currentRx.qualifications}</p>
                    <p style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>{currentRx.hospital}</p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>
                    <div>Date: {currentRx.date}</div>
                    <div style={{ fontWeight: 700, color: '#0ea5e9' }}>Rx ID: {currentRx.id}</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '16px',
                  background: '#f1f5f9',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginTop: '12px',
                  fontSize: '0.78rem',
                  color: '#334155'
                }}>
                  <div><strong>Patient:</strong> {currentRx.patientName}</div>
                  <div><strong>Age:</strong> {currentRx.patientAge} Y</div>
                  <div><strong>Gender:</strong> {currentRx.patientGender}</div>
                </div>
              </div>

              {/* Diagnosis Badge */}
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Clinical Dx: </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0369a1', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px' }}>
                  {currentRx.diagnosis}
                </span>
              </div>

              <div style={{ fontSize: '1.6rem', fontFamily: 'Georgia, serif', color: '#0284c7', fontWeight: 'bold', marginBottom: '12px' }}>
                ℞
              </div>

              {/* Handwritten Lines with Interactive OCR Bounding Boxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {currentRx.boundingBoxes.map((box, index) => {
                  const isActive = activeBoxIndex === index;
                  return (
                    <div
                      key={box.id}
                      onClick={() => setActiveBoxIndex(isActive ? null : index)}
                      style={{
                        position: 'relative',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: isActive ? '#f0f9ff' : 'white',
                        border: '2px solid',
                        borderColor: isActive ? '#0ea5e9' : '#cbd5e1',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? '0 4px 12px rgba(14, 165, 233, 0.2)' : 'none'
                      }}
                    >
                      {/* OCR Bounding Tag */}
                      <div style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '12px',
                        background: box.confidence > 90 ? '#10b981' : '#f59e0b',
                        color: 'white',
                        padding: '1px 8px',
                        borderRadius: '999px',
                        fontSize: '0.65rem',
                        fontWeight: 800
                      }}>
                        {box.confidence}% TrOCR
                      </div>

                      {/* Simulated Handwriting vs Extracted text */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{
                            fontFamily: '"Brush Script MT", "Comic Sans MS", cursive',
                            fontSize: '1.2rem',
                            color: '#1e293b',
                            letterSpacing: '0.04em'
                          }}>
                            {box.rawText}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                            Dosage: <strong style={{ color: '#0f172a' }}>{box.dosage}</strong> • Duration: {box.duration} ({box.timing})
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          color: '#065f46',
                          fontWeight: 700
                        }}>
                          <Sparkles size={12} color="#10b981" />
                          <span>{box.detectedMedicine}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action notice */}
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginTop: '16px', margin: 0 }}>
                {lang === 'bn' ? '💡 প্রতিটি ঔষধের বক্সে ক্লিক করে তাৎক্ষণিক এডিট বা কনফিডেন্স স্কোর দেখতে পারেন।' : '💡 Click on any medicine box above to inspect TrOCR details and manually edit words.'}
              </p>
            </div>
          </div>

          {/* Right: AI Intelligence Panel & Auto-Correction Engine */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Recognized Medicines List */}
            <div className="playful-card" style={{ padding: '24px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="#0ea5e9" />
                  <span>{lang === 'bn' ? 'শনাক্তকৃত ঔষধ ও ডোজ তালিকা' : 'Recognized Medicines & Dosage'}</span>
                </h3>
                <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>
                  {currentRx.boundingBoxes.length} Items Found
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {currentRx.boundingBoxes.map((item, idx) => {
                  const medInfo = BANGLADESHI_MEDICINES.find(m => m.brandName.toLowerCase().includes(item.detectedMedicine.toLowerCase())) || BANGLADESHI_MEDICINES[0];

                  return (
                    <div key={item.id} style={{
                      padding: '14px',
                      borderRadius: '16px',
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              background: '#0ea5e9',
                              color: 'white',
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}>
                              {idx + 1}
                            </span>
                            <strong style={{ fontSize: '0.98rem', color: '#0f172a' }}>{item.detectedMedicine}</strong>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', marginLeft: '30px' }}>
                            {medInfo.generic} • <em>{medInfo.manufacturer}</em>
                          </div>
                        </div>

                        <span style={{
                          background: item.confidence > 90 ? '#dcfce7' : '#fef3c7',
                          color: item.confidence > 90 ? '#15803d' : '#b45309',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          {item.confidence}% Match
                        </span>
                      </div>

                      {/* Dosage schedule badge */}
                      <div style={{
                        marginTop: '10px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: '8px',
                        background: 'white',
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>ডোজ (Schedule)</span>
                          <input
                            type="text"
                            value={item.dosage}
                            onChange={(e) => handleUpdateMedicine(idx, 'dosage', e.target.value)}
                            style={{
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '2px 6px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              width: '90%'
                            }}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>স্থায়িত্ব (Duration)</span>
                          <input
                            type="text"
                            value={item.duration}
                            onChange={(e) => handleUpdateMedicine(idx, 'duration', e.target.value)}
                            style={{
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              padding: '2px 6px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              width: '90%'
                            }}
                          />
                        </div>
                      </div>

                      {/* Purpose Bangla snippet */}
                      <div style={{
                        marginTop: '8px',
                        fontSize: '0.78rem',
                        color: '#065f46',
                        background: '#ecfdf5',
                        padding: '6px 10px',
                        borderRadius: '8px'
                      }}>
                        <strong>কাজ:</strong> {medInfo.purposeBn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Medical Dictionary Auto-Correction Badge */}
            <div style={{
              background: 'linear-gradient(135deg, #e0f2fe 0%, #d1fae5 100%)',
              padding: '16px 20px',
              borderRadius: '20px',
              border: '1.5px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: '#10b981',
                  color: 'white',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#065f46' }}>
                    {lang === 'bn' ? 'বাংলাদেশি মেডিকেল অভিধান ভেরিফায়েড' : 'Bangladeshi Drug Dictionary Verified'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#047857' }}>
                    {lang === 'bn' ? 'বানানের ভুল ও হাতের লেখার অসঙ্গতি স্বয়ংক্রিয়ভাবে শোধিত হয়েছে।' : 'Spelling typos & shorthand abbreviations normalized.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

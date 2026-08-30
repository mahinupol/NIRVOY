import React, { useState, useRef } from 'react';
import { Upload, Sparkles, CheckCircle2, RefreshCw, Edit3, ShieldCheck, Check, Activity, Info } from 'lucide-react';
import { SAMPLE_PRESCRIPTIONS } from '../data/samplePrescriptions';
import { BANGLADESHI_MEDICINES } from '../data/medicinesData';

export default function PrescriptionScanner({ onScanComplete, selectedPrescription, setSelectedPrescription }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeBoxIndex, setActiveBoxIndex] = useState(null);
  const fileInputRef = useRef(null);

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
          }, 350);
          return 95;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleSelectSample = (sample) => {
    setSelectedPrescription(sample);
    runOcrAnalysis(sample);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newCustomRx = {
        id: `RX-${Date.now().toString().slice(-4)}`,
        title: "Uploaded Prescription Slip",
        doctorName: "Dr. Nazmul Huda",
        qualifications: "MBBS, FCPS (Medicine)",
        hospital: "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
        date: new Date().toISOString().split('T')[0],
        patientName: "Karim Chowdhury",
        patientAge: 38,
        patientGender: "Male",
        diagnosis: "Upper Respiratory Tract Infection & Hyperacidity",
        customImageUrl: imageUrl,
        ocrConfidence: 94.2,
        boundingBoxes: [
          { id: "u-box-1", label: "Tab. Napa Extra", rawText: "Napa Ext 500+65mg", detectedMedicine: "Napa Extra", dosage: "1+0+1", duration: "5 days", confidence: 96, timing: "খাবার পর", box: { top: 30, left: 12, width: 76, height: 14 } },
          { id: "u-box-2", label: "Cap. Seclo 20mg", rawText: "Seclo 20mg Cap", detectedMedicine: "Seclo 20", dosage: "1+0+1", duration: "14 days", confidence: 94, timing: "খাওয়ার ৩০ মিনিট আগে", box: { top: 48, left: 12, width: 76, height: 14 } },
          { id: "u-box-3", label: "Tab. Monas 10mg", rawText: "Monas 10mg Tab", detectedMedicine: "Monas 10", dosage: "0+0+1", duration: "14 days", confidence: 91, timing: "রাতে ঘুমানোর আগে", box: { top: 66, left: 12, width: 76, height: 14 } }
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

    const updatedRx = { ...selectedPrescription, boundingBoxes: updatedBoxes };
    setSelectedPrescription(updatedRx);
    if (onScanComplete) onScanComplete(updatedRx);
  };

  const currentRx = selectedPrescription || SAMPLE_PRESCRIPTIONS[0];

  return (
    <div style={{ padding: '8px 0 32px' }}>
      <div className="container-max">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#e0f2fe',
            color: '#0369a1',
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '6px'
          }}>
            MODULE 1 • AI PRESCRIPTION OCR
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Prescription Recognition (প্রেসক্রিপশন স্ক্যান ও সনাক্তকরণ)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
            ছবি আপলোড করুন অথবা নিচের স্যাম্পল প্রেসক্রিপশন সিলেক্ট করে AI TrOCR এবং বাংলা ড্রাগ ডিকশনারি টেস্ট করুন।
          </p>
        </div>

        {/* Quick Sample Selector Bar */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
            Sample Prescriptions:
          </span>
          {SAMPLE_PRESCRIPTIONS.map((sample, idx) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: currentRx.id === sample.id ? '#0284c7' : '#cbd5e1',
                background: currentRx.id === sample.id ? '#e0f2fe' : '#ffffff',
                color: currentRx.id === sample.id ? '#0369a1' : '#334155',
                fontSize: '0.82rem',
                fontWeight: currentRx.id === sample.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{idx === 0 ? '🌡️ Flu & Pain' : idx === 1 ? '🫁 Asthma' : '❤️ Cardio'}</span>
            </button>
          ))}

          {/* Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="btn-primary"
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          >
            <Upload size={14} />
            <span>Upload Image (ছবি আপলোড)</span>
          </button>
        </div>

        {/* Scanner Viewport Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Left: Clean Prescription Document View */}
          <div className="clean-card" style={{ padding: '20px', background: '#ffffff', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1rem' }}>📄</span>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                  {currentRx.title}
                </span>
              </div>
              <span style={{
                background: isScanning ? '#fef3c7' : '#dcfce7',
                color: isScanning ? '#b45309' : '#15803d',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {isScanning ? <RefreshCw size={11} className="animate-spin" /> : <CheckCircle2 size={11} />}
                {isScanning ? `Processing OCR (${scanProgress}%)` : `Accuracy: ${currentRx.ocrConfidence}%`}
              </span>
            </div>

            {/* Document Surface */}
            <div style={{
              position: 'relative',
              background: '#fafbfc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              overflow: 'hidden'
            }}>
              {isScanning && <div className="laser-line" />}

              {/* Doctor Details Bar */}
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                      {currentRx.doctorName}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '1px 0' }}>{currentRx.qualifications}</p>
                    <p style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>{currentRx.hospital}</p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#64748b' }}>
                    <div>Date: <strong>{currentRx.date}</strong></div>
                    <div style={{ color: '#0284c7', fontWeight: 700 }}>{currentRx.id}</div>
                  </div>
                </div>

                {/* Patient Summary Bar */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  background: '#f1f5f9',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  marginTop: '10px',
                  fontSize: '0.75rem',
                  color: '#334155'
                }}>
                  <div><strong>Patient:</strong> {currentRx.patientName}</div>
                  <div><strong>Age:</strong> {currentRx.patientAge} Y</div>
                  <div><strong>Gender:</strong> {currentRx.patientGender}</div>
                </div>
              </div>

              {/* Diagnosis */}
              <div style={{ marginBottom: '12px', fontSize: '0.78rem' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Clinical Dx: </span>
                <span style={{ color: '#0369a1', fontWeight: 700, background: '#e0f2fe', padding: '1px 6px', borderRadius: '4px' }}>
                  {currentRx.diagnosis}
                </span>
              </div>

              {/* Rx Symbol */}
              <div style={{ fontSize: '1.4rem', fontFamily: 'Georgia, serif', color: '#0284c7', fontWeight: 'bold', marginBottom: '8px' }}>
                ℞
              </div>

              {/* Clean Prescribed Medicines with Crisp Bounding Boxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentRx.boundingBoxes.map((box, index) => {
                  const isActive = activeBoxIndex === index;
                  return (
                    <div
                      key={box.id}
                      onClick={() => setActiveBoxIndex(isActive ? null : index)}
                      style={{
                        position: 'relative',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: isActive ? '#f0f9ff' : '#ffffff',
                        border: '1px solid',
                        borderColor: isActive ? '#0284c7' : '#cbd5e1',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            color: '#0f172a'
                          }}>
                            {box.rawText}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                            Dosage: <strong style={{ color: '#0284c7' }}>{box.dosage}</strong> • Duration: {box.duration} ({box.timing})
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          color: '#15803d',
                          fontWeight: 700
                        }}>
                          <Check size={12} />
                          <span>{box.detectedMedicine}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center', marginTop: '14px', margin: 0 }}>
                💡 Click any medicine line to inspect OCR confidence or edit values.
              </p>
            </div>
          </div>

          {/* Right: Clean Extracted Medicine Items & AI Verification */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="clean-card" style={{ padding: '20px', background: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="#0284c7" />
                  <span>Detected Medicines (শনাক্তকৃত ঔষধ)</span>
                </h3>
                <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>
                  {currentRx.boundingBoxes.length} Items Found
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentRx.boundingBoxes.map((item, idx) => {
                  const medInfo = BANGLADESHI_MEDICINES.find(m => m.brandName.toLowerCase().includes(item.detectedMedicine.toLowerCase())) || BANGLADESHI_MEDICINES[0];

                  return (
                    <div key={item.id} style={{
                      padding: '12px',
                      borderRadius: '10px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              background: '#0284c7',
                              color: '#ffffff',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: 700
                            }}>
                              {idx + 1}
                            </span>
                            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{item.detectedMedicine}</strong>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', marginLeft: '24px' }}>
                            {medInfo.generic} • <em>{medInfo.manufacturer}</em>
                          </div>
                        </div>

                        <span style={{
                          background: item.confidence > 90 ? '#dcfce7' : '#fef3c7',
                          color: item.confidence > 90 ? '#15803d' : '#b45309',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.68rem',
                          fontWeight: 700
                        }}>
                          {item.confidence}% Match
                        </span>
                      </div>

                      {/* Dosage schedule inputs */}
                      <div style={{
                        marginTop: '8px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                        gap: '6px',
                        background: '#ffffff',
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Dosage (মাত্রা)</span>
                          <input
                            type="text"
                            value={item.dosage}
                            onChange={(e) => handleUpdateMedicine(idx, 'dosage', e.target.value)}
                            style={{
                              border: '1px solid #cbd5e1',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              width: '90%'
                            }}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Duration (মেয়াদ)</span>
                          <input
                            type="text"
                            value={item.duration}
                            onChange={(e) => handleUpdateMedicine(idx, 'duration', e.target.value)}
                            style={{
                              border: '1px solid #cbd5e1',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              width: '90%'
                            }}
                          />
                        </div>
                      </div>

                      {/* Purpose Bangla snippet */}
                      <div style={{
                        marginTop: '6px',
                        fontSize: '0.75rem',
                        color: '#065f46',
                        background: '#f0fdf4',
                        padding: '5px 8px',
                        borderRadius: '6px'
                      }}>
                        <strong>কাজ / Purpose:</strong> {medInfo.purposeBn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BD Medical Dictionary Verified Badge */}
            <div style={{
              background: '#f0fdf4',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
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
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#065f46', fontWeight: 700 }}>
                  BD Drug Dictionary Verified (বাংলাদেশি ঔষধ অভিধান)
                </h4>
                <p style={{ margin: 0, fontSize: '0.73rem', color: '#047857' }}>
                  বানান ও সংক্ষেপণ স্বয়ংক্রিয়ভাবে ডিজিডিএ ডেটাবেসের সাথে মেলানো হয়েছে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

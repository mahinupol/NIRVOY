import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Clock, AlertCircle, Sparkles, CheckCircle, Coffee, Moon, Sun, Utensils } from 'lucide-react';
import { ttsEngine } from '../utils/ttsHelper';
import { parseDosageInstruction, generateBanglaVoiceScript } from '../utils/prescriptionParser';
import { BANGLADESHI_MEDICINES } from '../data/medicinesData';

export default function BanglaExplainer({ lang, prescription, elderlyMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpeechSpeed, setActiveSpeechSpeed] = useState(0.9);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const items = prescription?.boundingBoxes || [];
  const banglaScript = generateBanglaVoiceScript(prescription?.patientName, items);

  const handlePlayVoice = () => {
    if (isPlaying) {
      ttsEngine.stop();
      setIsPlaying(false);
      setHighlightedIndex(null);
    } else {
      setIsPlaying(true);
      ttsEngine.speak(banglaScript, 'bn-BD', activeSpeechSpeed, {
        onStart: () => setIsPlaying(true),
        onEnd: () => {
          setIsPlaying(false);
          setHighlightedIndex(null);
        },
        onError: () => {
          setIsPlaying(false);
          setHighlightedIndex(null);
        }
      });
    }
  };

  const handleStopVoice = () => {
    ttsEngine.stop();
    setIsPlaying(false);
    setHighlightedIndex(null);
  };

  const handlePlaySingleMedicine = (item, index) => {
    const medInfo = parseDosageInstruction(item.dosage, item.timing);
    const speech = `${item.detectedMedicine || item.rawText}। ${medInfo.bn}। ${item.duration ? `মেয়াদ: ${item.duration}` : ''}।`;
    setHighlightedIndex(index);
    setIsPlaying(true);
    ttsEngine.speak(speech, 'bn-BD', activeSpeechSpeed, {
      onEnd: () => {
        setIsPlaying(false);
        setHighlightedIndex(null);
      }
    });
  };

  useEffect(() => {
    return () => {
      ttsEngine.stop();
    };
  }, []);

  return (
    <div style={{ padding: '10px 0 40px' }}>
      <div className="container-custom">
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ecfdf5',
            color: '#059669',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            MODULE 2 • BANGLA EXPLANATION & VOICE
          </div>
          <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '8px' }}>
            {lang === 'bn' ? 'সহজ বাংলা বিবরণ ও স্পিচ প্লেয়ার' : 'Simple Bangla Explanation & Voice Player'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '680px', margin: '0 auto' }}>
            {lang === 'bn' 
              ? 'ডাক্তারের জটিল সাংকেতিক ভাষা (1+0+1, AC, PC) এখন সম্পূর্ণ সহজ বাংলায় বুঝুন এবং অডিওতে শুনুন।'
              : 'Decodes complex medical abbreviations into native conversational Bangla with real-time Text-to-Speech.'}
          </p>
        </div>

        {/* Master Voice Audio Control Center */}
        <div className="playful-card" style={{
          padding: '24px 32px',
          background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
          color: 'white',
          borderRadius: '24px',
          marginBottom: '32px',
          boxShadow: '0 16px 36px rgba(14, 165, 233, 0.35)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <button
              onClick={handlePlayVoice}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'white',
                color: '#0284c7',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              className="animate-pulse-glow"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
                  {isPlaying ? (lang === 'bn' ? 'ভয়েস চলছে...' : 'Playing Bangla Audio...') : (lang === 'bn' ? 'সম্পূর্ণ প্রেসক্রিপশন বাংলায় শুনুন' : 'Listen to Full Prescription in Bangla')}
                </h3>
                {isPlaying && (
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '20px' }}>
                    <span className="audio-bar audio-bar-1" style={{ background: '#34d399' }} />
                    <span className="audio-bar audio-bar-2" style={{ background: '#38bdf8' }} />
                    <span className="audio-bar audio-bar-3" style={{ background: '#fef08a' }} />
                    <span className="audio-bar audio-bar-4" style={{ background: '#f472b6' }} />
                  </div>
                )}
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#e0f2fe' }}>
                {lang === 'bn' ? 'বয়োজ্যেষ্ঠ ও সাধারণ রোগীদের জন্য স্পষ্ট বাংলা উচ্চারণ' : 'Crystal-clear native Bangla pronunciation for elderly & rural patients.'}
              </p>
            </div>
          </div>

          {/* Speed & Control adjustments */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e0f2fe' }}>ভয়েস গতি (Speed):</span>
            {[
              { rate: 0.8, label: '0.8x (ধীর/সহজ)' },
              { rate: 0.95, label: '1.0x (স্বাভাবিক)' },
              { rate: 1.2, label: '1.2x (দ্রুত)' }
            ].map(spd => (
              <button
                key={spd.rate}
                onClick={() => {
                  setActiveSpeechSpeed(spd.rate);
                  if (isPlaying) {
                    handlePlayVoice();
                  }
                }}
                style={{
                  background: activeSpeechSpeed === spd.rate ? 'white' : 'rgba(255,255,255,0.2)',
                  color: activeSpeechSpeed === spd.rate ? '#0284c7' : 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {spd.label}
              </button>
            ))}

            {isPlaying && (
              <button
                onClick={handleStopVoice}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <VolumeX size={14} />
                <span>থামুন (Stop)</span>
              </button>
            )}
          </div>
        </div>

        {/* Medicine Bangla Breakdown Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {items.map((item, idx) => {
            const medInfo = BANGLADESHI_MEDICINES.find(m => m.brandName.toLowerCase().includes((item.detectedMedicine || '').toLowerCase())) || BANGLADESHI_MEDICINES[0];
            const parsedDosage = parseDosageInstruction(item.dosage, item.timing);
            const isCardActive = highlightedIndex === idx;

            return (
              <div
                key={item.id || idx}
                className="playful-card"
                style={{
                  padding: '24px',
                  background: isCardActive ? '#f0fdf4' : 'white',
                  border: isCardActive ? '2px solid #10b981' : '1.5px solid #e2e8f0',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  {/* Top Bar: Med Name & Single Audio Speaker */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          background: '#0ea5e9',
                          color: 'white',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem'
                        }}>
                          {idx + 1}
                        </span>
                        <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>
                          {item.detectedMedicine}
                        </h3>
                      </div>
                      <p style={{ margin: '2px 0 0 36px', fontSize: '0.8rem', color: '#64748b' }}>
                        {medInfo.generic}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePlaySingleMedicine(item, idx)}
                      title="Listen to this medicine instruction"
                      style={{
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#059669',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>

                  {/* Purpose Box in Bangla */}
                  <div style={{
                    background: '#f8fafc',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '14px'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369a1', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={14} />
                      <span>ঔষধের কাজ (Purpose):</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>
                      {medInfo.purposeBn}
                    </div>
                  </div>

                  {/* Meal Timing & Dosage Badges */}
                  <div style={{
                    background: '#fef3c7',
                    border: '1.5px solid #fde68a',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    marginBottom: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#b45309', marginBottom: '4px' }}>
                      <Utensils size={15} />
                      <span>খাওয়ার নিয়মাবলী ও সময়:</span>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#92400e', lineHeight: 1.4 }}>
                      {parsedDosage.bn}
                    </div>
                    {item.duration && (
                      <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} />
                        <span>সময়কাল: <strong>{item.duration}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Time of day breakdown icons */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <div style={{
                      flex: 1,
                      minWidth: '90px',
                      background: item.dosage.startsWith('1') ? '#dbeafe' : '#f1f5f9',
                      color: item.dosage.startsWith('1') ? '#1d4ed8' : '#94a3b8',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}>
                      <Sun size={16} style={{ margin: '0 auto 2px', display: 'block' }} />
                      <span>সকালে: {item.dosage.split('+')[0] || '1'} টি</span>
                    </div>

                    <div style={{
                      flex: 1,
                      minWidth: '90px',
                      background: (item.dosage.split('+')[1] || '0') !== '0' ? '#fef08a' : '#f1f5f9',
                      color: (item.dosage.split('+')[1] || '0') !== '0' ? '#854d0e' : '#94a3b8',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}>
                      <Coffee size={16} style={{ margin: '0 auto 2px', display: 'block' }} />
                      <span>দুপুরে: {item.dosage.split('+')[1] || '0'} টি</span>
                    </div>

                    <div style={{
                      flex: 1,
                      minWidth: '90px',
                      background: (item.dosage.split('+')[2] || '0') !== '0' ? '#ede9fe' : '#f1f5f9',
                      color: (item.dosage.split('+')[2] || '0') !== '0' ? '#6d28d9' : '#94a3b8',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}>
                      <Moon size={16} style={{ margin: '0 auto 2px', display: 'block' }} />
                      <span>রাতে: {item.dosage.split('+')[2] || '0'} টি</span>
                    </div>
                  </div>
                </div>

                {/* Precaution warning banner */}
                <div style={{
                  fontSize: '0.78rem',
                  color: '#991b1b',
                  background: '#fef2f2',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #fecaca',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertCircle size={14} color="#dc2626" />
                  <span><strong>সতর্কতা:</strong> {medInfo.precautionsBn}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

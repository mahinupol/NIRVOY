import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Clock, AlertCircle, Sparkles, Coffee, Moon, Sun, Utensils } from 'lucide-react';
import { ttsEngine } from '../utils/ttsHelper';
import { parseDosageInstruction, generateBanglaVoiceScript } from '../utils/prescriptionParser';
import { BANGLADESHI_MEDICINES } from '../data/medicinesData';

export default function BanglaExplainer({ prescription, elderlyMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpeechSpeed, setActiveSpeechSpeed] = useState(0.95);
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
            MODULE 2 • BANGLA EXPLANATION & TTS
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            Bangla Voice & Dosage Instructions (বাংলা অডিও ও সেবন নিয়ম)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
            চিকিৎসকের সাংকেতিক ভাষা (1+0+1, AC, PC) এখন পরিষ্কার বাংলা ব্যাখ্যা এবং স্পিচ প্লেয়ারে শুনুন।
          </p>
        </div>

        {/* Clean Audio Player Bar */}
        <div className="clean-card" style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 16px rgba(2, 132, 199, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={handlePlayVoice}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#ffffff',
                color: '#0284c7',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.15s ease'
              }}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '3px' }} />}
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                  {isPlaying ? 'Playing Audio (ভয়েস চলছে...)' : 'Listen to Full Prescription (বাংলা অডিও শুনুন)'}
                </h3>
                {isPlaying && (
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '16px' }}>
                    <span className="wave-bar wave-1" />
                    <span className="wave-bar wave-2" />
                    <span className="wave-bar wave-3" />
                    <span className="wave-bar wave-4" />
                  </div>
                )}
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#e0f2fe' }}>
                Clear Bengali speech narration optimized for elderly patients & rural users.
              </p>
            </div>
          </div>

          {/* Speed & Control adjustments */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e0f2fe' }}>Speed (গতি):</span>
            {[
              { rate: 0.8, label: '0.8x (Slow)' },
              { rate: 0.95, label: '1.0x (Normal)' },
              { rate: 1.2, label: '1.2x (Fast)' }
            ].map(spd => (
              <button
                key={spd.rate}
                onClick={() => {
                  setActiveSpeechSpeed(spd.rate);
                  if (isPlaying) handlePlayVoice();
                }}
                style={{
                  background: activeSpeechSpeed === spd.rate ? '#ffffff' : 'rgba(255,255,255,0.2)',
                  color: activeSpeechSpeed === spd.rate ? '#0284c7' : '#ffffff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
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
                  background: '#e11d48',
                  color: '#ffffff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <VolumeX size={12} />
                <span>Stop</span>
              </button>
            )}
          </div>
        </div>

        {/* Medicine Bangla Breakdown Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {items.map((item, idx) => {
            const medInfo = BANGLADESHI_MEDICINES.find(m => m.brandName.toLowerCase().includes((item.detectedMedicine || '').toLowerCase())) || BANGLADESHI_MEDICINES[0];
            const parsedDosage = parseDosageInstruction(item.dosage, item.timing);
            const isCardActive = highlightedIndex === idx;

            return (
              <div
                key={item.id || idx}
                className="clean-card"
                style={{
                  padding: '18px',
                  background: isCardActive ? '#f0fdf4' : '#ffffff',
                  border: isCardActive ? '1px solid #059669' : '1px solid #e2e8f0',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  {/* Top Bar: Med Name & Audio Speaker */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          background: '#0284c7',
                          color: '#ffffff',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }}>
                          {idx + 1}
                        </span>
                        <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>
                          {item.detectedMedicine}
                        </h3>
                      </div>
                      <p style={{ margin: '2px 0 0 28px', fontSize: '0.75rem', color: '#64748b' }}>
                        {medInfo.generic}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePlaySingleMedicine(item, idx)}
                      title="Listen in Bangla"
                      style={{
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        color: '#059669',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>

                  {/* Purpose Box */}
                  <div style={{
                    background: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '10px'
                  }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0369a1', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={12} />
                      <span>Purpose / ঔষধের কাজ:</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                      {medInfo.purposeBn}
                    </div>
                  </div>

                  {/* Meal Timing & Dosage Badges */}
                  <div style={{
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    marginBottom: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 700, color: '#b45309', marginBottom: '2px' }}>
                      <Utensils size={13} />
                      <span>সেবন বিধি ও সময় (Instructions):</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#92400e' }}>
                      {parsedDosage.bn}
                    </div>
                    {item.duration && (
                      <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        <span>Duration: <strong>{item.duration}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Time of day cards */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <div style={{
                      flex: 1,
                      minWidth: '80px',
                      background: item.dosage.startsWith('1') ? '#e0f2fe' : '#f1f5f9',
                      color: item.dosage.startsWith('1') ? '#0369a1' : '#94a3b8',
                      padding: '6px 8px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      <Sun size={14} style={{ margin: '0 auto 2px', display: 'block' }} />
                      <span>সকাল: {item.dosage.split('+')[0] || '1'} টি</span>
                    </div>

                    <div style={{
                      flex: 1,
                      minWidth: '80px',
                      background: (item.dosage.split('+')[1] || '0') !== '0' ? '#fef3c7' : '#f1f5f9',
                      color: (item.dosage.split('+')[1] || '0') !== '0' ? '#b45309' : '#94a3b8',
                      padding: '6px 8px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      <Coffee size={14} style={{ margin: '0 auto 2px', display: 'block' }} />
                      <span>দুপুর: {item.dosage.split('+')[1] || '0'} টি</span>
                    </div>

                    <div style={{
                      flex: 1,
                      minWidth: '80px',
                      background: (item.dosage.split('+')[2] || '0') !== '0' ? '#ede9fe' : '#f1f5f9',
                      color: (item.dosage.split('+')[2] || '0') !== '0' ? '#6d28d9' : '#94a3b8',
                      padding: '6px 8px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}>
                      <Moon size={14} style={{ margin: '0 auto 2px', display: 'block' }} />
                      <span>রাত: {item.dosage.split('+')[2] || '0'} টি</span>
                    </div>
                  </div>
                </div>

                {/* Precaution warning banner */}
                <div style={{
                  fontSize: '0.73rem',
                  color: '#991b1b',
                  background: '#fef2f2',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <AlertCircle size={13} color="#dc2626" />
                  <span><strong>Warning:</strong> {medInfo.precautionsBn}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

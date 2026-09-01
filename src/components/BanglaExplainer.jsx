import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Clock, AlertCircle, Sparkles, Coffee, Moon, Sun, Utensils } from 'lucide-react';
import { ttsEngine } from '../utils/ttsHelper';
import { 
  parseDosageInstruction, 
  generateBanglaVoiceScript, 
  generateEnglishVoiceScript 
} from '../utils/prescriptionParser';
import { BANGLADESHI_MEDICINES } from '../data/medicinesData';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function BanglaExplainer({ prescription, elderlyMode }) {
  const { language, t } = useLanguage();
  const { user, patientProfile, isAuthenticated, openProfileModal, openAuthModal } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpeechSpeed, setActiveSpeechSpeed] = useState(0.95);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const items = prescription?.boundingBoxes || [];
  const voiceScript = language === 'bn' 
    ? generateBanglaVoiceScript(prescription?.patientName, items)
    : generateEnglishVoiceScript(prescription?.patientName, items);

  const voiceLangCode = language === 'bn' ? 'bn-BD' : 'en-US';

  const handlePlayVoice = () => {
    if (isPlaying) {
      ttsEngine.stop();
      setIsPlaying(false);
      setHighlightedIndex(null);
    } else {
      setIsPlaying(true);
      ttsEngine.speak(voiceScript, voiceLangCode, activeSpeechSpeed, {
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
    const speech = language === 'bn'
      ? `${item.detectedMedicine || item.rawText}। ${medInfo.bn}। ${item.duration ? `মেয়াদ: ${item.duration}` : ''}।`
      : `${item.detectedMedicine || item.rawText}. ${medInfo.en}. ${item.duration ? `Duration: ${item.duration}` : ''}.`;

    setHighlightedIndex(index);
    setIsPlaying(true);
    ttsEngine.speak(speech, voiceLangCode, activeSpeechSpeed, {
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
            {t('explainerBadge')}
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            {t('explainerTitle')}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
            {t('explainerDesc')}
          </p>
        </div>

        {/* Patient Profile Card (Synced with Neon PostgreSQL) */}
        {isAuthenticated && user ? (
          <div style={{
            background: '#ffffff',
            border: '1px solid #bbf7d0',
            borderRadius: '16px',
            padding: '14px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(34, 197, 94, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem'
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 700 }}>
                    {user?.name || 'Patient'} ({language === 'bn' ? 'রোগী প্রোফাইল' : 'Patient Record'})
                  </h4>
                  <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.68rem', fontWeight: 700, padding: '1px 6px', borderRadius: '6px' }}>
                    PostgreSQL Synced
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#475569', marginTop: '2px', flexWrap: 'wrap' }}>
                  {patientProfile?.age && <span><strong>{language === 'bn' ? 'বয়স:' : 'Age:'}</strong> {patientProfile.age} {language === 'bn' ? 'বছর' : 'yrs'}</span>}
                  {patientProfile?.height && <span>• <strong>{language === 'bn' ? 'উচ্চতা:' : 'Height:'}</strong> {patientProfile.height}</span>}
                  {patientProfile?.weight_kg && <span>• <strong>{language === 'bn' ? 'ওজন:' : 'Weight:'}</strong> {patientProfile.weight_kg} kg</span>}
                  {patientProfile?.blood_group && <span>• <strong>{language === 'bn' ? 'রক্ত:' : 'Blood:'}</strong> {patientProfile.blood_group}</span>}
                </div>
                {Array.isArray(patientProfile?.chronic_diseases) && patientProfile.chronic_diseases.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                      {language === 'bn' ? 'পূর্বের রোগসমূহ:' : 'Conditions:'}
                    </span>
                    {patientProfile.chronic_diseases.map((d, i) => (
                      <span key={i} style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.68rem', fontWeight: 700, padding: '1px 6px', borderRadius: '999px', border: '1px solid #fde68a' }}>
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={openProfileModal}
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                padding: '6px 14px',
                borderRadius: '8px',
                color: '#0284c7',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {language === 'bn' ? 'স্বাস্থ্য তথ্য পরিবর্তন' : 'Edit Health Vitals'} →
            </button>
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)',
            border: '1px solid #cbd5e1',
            borderRadius: '16px',
            padding: '12px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>📋</span>
              <div>
                <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>
                  {language === 'bn' ? 'রোগী হিসেবে লগইন করুন ও বয়স-উচ্চতা-রোগ ডাটাবেজে সংরক্ষণ করুন' : 'Sign in to save your age, height & medical profile to database'}
                </strong>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748b' }}>
                  {language === 'bn' ? 'পোস্টগ্রেসকিউএল ডাটাবেজে আপনার তথ্য নিরাপদ থাকবে।' : 'Your health questionnaire is securely stored in Neon PostgreSQL.'}
                </p>
              </div>
            </div>
            <button
              onClick={openAuthModal}
              style={{
                background: '#0284c7',
                color: 'white',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {language === 'bn' ? 'লগইন / নিবন্ধন' : 'Login / Register'}
            </button>
          </div>
        )}

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
                  {isPlaying ? (language === 'bn' ? 'ভয়েস চলছে...' : 'Playing Speech Narration...') : (language === 'bn' ? 'সম্পূর্ণ প্রেসক্রিপশন শুনুন' : 'Listen to Full Prescription')}
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
                {language === 'bn' 
                  ? 'বয়স্ক রোগী ও সাধারণ ব্যবহারকারীদের জন্য সহজবোধ্য বাংলা ভয়েস নির্দেশনা।'
                  : 'Clear speech narration optimized for easy comprehension.'}
              </p>
            </div>
          </div>

          {/* Speed & Control adjustments */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e0f2fe' }}>{t('speedLabel')}</span>
            {[
              { rate: 0.8, label: '0.8x' },
              { rate: 0.95, label: '1.0x' },
              { rate: 1.2, label: '1.2x' }
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '20px'
        }}>
          {items.map((item, idx) => {
            const medInfo = BANGLADESHI_MEDICINES.find(m => m.brandName && m.brandName.toLowerCase().includes((item.detectedMedicine || '').toLowerCase())) || BANGLADESHI_MEDICINES[0];
            const parsedDosage = parseDosageInstruction(item.dosage, item.timing);
            const isCardActive = highlightedIndex === idx;

            return (
              <div
                key={item.id || idx}
                className="clean-card"
                style={{
                  padding: '22px',
                  background: isCardActive ? '#f0fdf4' : '#ffffff',
                  border: isCardActive ? '2px solid #059669' : '1px solid #e2e8f0',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  boxShadow: isCardActive ? '0 8px 24px rgba(5, 150, 105, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Top Bar: Med Name & Audio Speaker */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          background: '#0284c7',
                          color: '#ffffff',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          flexShrink: 0
                        }}>
                          {idx + 1}
                        </span>
                        <h3 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>
                          {item.detectedMedicine}
                        </h3>
                      </div>
                      <p style={{ margin: '4px 0 0 34px', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                        {medInfo.generic}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePlaySingleMedicine(item, idx)}
                      title={language === 'bn' ? 'বাংলায় শুনুন' : 'Listen in English'}
                      style={{
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        color: '#059669',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(5, 150, 105, 0.15)'
                      }}
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>

                  {/* Purpose Box */}
                  <div style={{
                    background: '#f8fafc',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0369a1', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Sparkles size={13} />
                      <span>{t('indicationLabel')}</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: 600, lineHeight: 1.6 }}>
                      {language === 'bn' ? medInfo.purposeBn : (medInfo.purposeEn || medInfo.purposeBn)}
                    </div>
                  </div>

                  {/* Meal Timing & Dosage Badges */}
                  <div style={{
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', fontWeight: 700, color: '#b45309' }}>
                      <Utensils size={14} />
                      <span>{language === 'bn' ? 'সেবন বিধি ও সময়:' : 'Instructions & Timing:'}</span>
                    </div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#92400e', lineHeight: 1.5 }}>
                      {language === 'bn' ? parsedDosage.bn : parsedDosage.en}
                    </div>
                    {item.duration && (
                      <div style={{ fontSize: '0.78rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={13} />
                        <span>{language === 'bn' ? 'চলবে / মেয়াদ:' : 'Duration:'} <strong>{item.duration}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Time of day cards with Non-Distorting Responsive Visuals */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px' }}>
                    {(() => {
                      const dParts = (item.dosage || '1+0+1').split('+');
                      const morning = (dParts[0] || '0').trim();
                      const noon = (dParts[1] || '0').trim();
                      const night = (dParts[2] || '0').trim();

                      return (
                        <>
                          <div style={{
                            background: morning !== '0' ? '#e0f2fe' : '#f1f5f9',
                            color: morning !== '0' ? '#0369a1' : '#94a3b8',
                            padding: '8px 6px',
                            borderRadius: '10px',
                            textAlign: 'center',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            border: morning !== '0' ? '1px solid #bae6fd' : '1px solid transparent',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                            minWidth: 0,
                            overflow: 'hidden'
                          }}>
                            <Sun size={15} style={{ flexShrink: 0 }} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                              {t('morningLabel')}: {morning}
                            </span>
                          </div>

                          <div style={{
                            background: noon !== '0' ? '#fef3c7' : '#f1f5f9',
                            color: noon !== '0' ? '#b45309' : '#94a3b8',
                            padding: '8px 6px',
                            borderRadius: '10px',
                            textAlign: 'center',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            border: noon !== '0' ? '1px solid #fde68a' : '1px solid transparent',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                            minWidth: 0,
                            overflow: 'hidden'
                          }}>
                            <Coffee size={15} style={{ flexShrink: 0 }} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                              {t('noonLabel')}: {noon}
                            </span>
                          </div>

                          <div style={{
                            background: night !== '0' ? '#ede9fe' : '#f1f5f9',
                            color: night !== '0' ? '#6d28d9' : '#94a3b8',
                            padding: '8px 6px',
                            borderRadius: '10px',
                            textAlign: 'center',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            border: night !== '0' ? '1px solid #ddd6fe' : '1px solid transparent',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                            minWidth: 0,
                            overflow: 'hidden'
                          }}>
                            <Moon size={15} style={{ flexShrink: 0 }} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                              {t('nightLabel')}: {night}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Precaution warning banner */}
                <div style={{
                  fontSize: '0.76rem',
                  color: '#991b1b',
                  background: '#fef2f2',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  lineHeight: 1.5
                }}>
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  <span><strong>{t('warningLabel')}</strong> {medInfo.precautionsBn}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

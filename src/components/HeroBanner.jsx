import React from 'react';
import { Sparkles, Scan, ArrowRight, CheckCircle2, ShieldCheck, HeartPulse, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

export default function HeroBanner({ onStartScan, onOpenDemo }) {
  const { language, t } = useLanguage();

  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <section style={{ padding: '32px 0 16px' }}>
      <div className="container-max">
        <div className="clean-card" style={{
          padding: '38px 34px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(240, 249, 255, 0.92) 50%, rgba(240, 253, 244, 0.92) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 20px 45px -12px rgba(2, 132, 199, 0.12), 0 0 1px rgba(2, 132, 199, 0.2)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center'
          }}>
            {/* Left Column */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                background: 'linear-gradient(135deg, #e0f2fe 0%, #dcfce7 100%)',
                color: '#0369a1',
                padding: '5px 14px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                marginBottom: '16px',
                border: '1px solid #bae6fd',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.15)'
              }}>
                <Activity size={14} style={{ color: '#0284c7' }} />
                <span>{t('heroBadge')}</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(1.9rem, 3.4vw, 2.7rem)',
                lineHeight: 1.18,
                color: '#0f172a',
                marginBottom: '16px',
                letterSpacing: '-0.035em'
              }}>
                {language === 'bn' ? (
                  <>
                    সহজ বাংলায় প্রেসক্রিপশন বুঝুন <span className="gradient-text-glow">ভয়েস অডিও</span> ও <span style={{ color: '#059669' }}>AI সহযোগে</span>
                  </>
                ) : (
                  <>
                    Understand Doctor Prescriptions <span className="gradient-text-glow">Clearly in Seconds</span> with <span style={{ color: '#059669' }}>Audio Voice</span>
                  </>
                )}
              </h1>

              <p style={{
                fontSize: '0.98rem',
                color: '#475569',
                marginBottom: '26px',
                lineHeight: 1.65
              }}>
                {t('heroDesc')}
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    triggerCelebration();
                    onStartScan();
                  }}
                  className="btn-primary"
                  style={{ padding: '12px 26px', fontSize: '0.92rem' }}
                >
                  <Scan size={18} />
                  <span>{t('heroScanBtn')}</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={onOpenDemo}
                  className="btn-outline"
                  style={{ padding: '12px 22px', fontSize: '0.92rem' }}
                >
                  <Sparkles size={17} color="#d97706" />
                  <span>{t('heroDemoBtn')}</span>
                </button>
              </div>

              {/* Feature Tags */}
              <div style={{
                display: 'flex',
                gap: '18px',
                marginTop: '26px',
                flexWrap: 'wrap',
                fontSize: '0.82rem',
                color: '#334155',
                fontWeight: 700
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={13} color="#059669" />
                  </div>
                  <span>{t('featAudio')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={13} color="#059669" />
                  </div>
                  <span>{t('featDgda')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={13} color="#059669" />
                  </div>
                  <span>{t('featPharmacy')}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Visual Pipeline */}
            <div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(186, 230, 253, 0.8)',
                borderRadius: '18px',
                padding: '22px',
                boxShadow: '0 10px 30px -5px rgba(2, 132, 199, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {language === 'bn' ? 'AI পাইপলাইন কার্যপদ্ধতি' : 'AI Pipeline Architecture'}
                  </span>
                  <span style={{
                    background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                    color: '#15803d',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    border: '1px solid #86efac',
                    boxShadow: '0 2px 6px rgba(34, 197, 94, 0.15)'
                  }}>
                    96.8% Accuracy
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Step 1 */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', width: '24px', height: '24px', borderRadius: '50%', aspectRatio: '1/1', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      1
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block' }}>
                        {language === 'bn' ? 'হ্যান্ডরাইটিং ভিশন ডিটেকশন' : 'Handwriting Vision OCR'}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', wordBreak: 'break-word' }}>
                        {language === 'bn' ? 'হাতের লেখার প্রতিটি বর্ণ ও বাউন্ডিং বক্স বিশ্লেষণ' : 'Sub-character frequency & LCS sequence matching'}
                      </span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ background: '#dcfce7', color: '#15803d', width: '24px', height: '24px', borderRadius: '50%', aspectRatio: '1/1', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      2
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block' }}>
                        {language === 'bn' ? 'বাংলাদেশী ড্রাগ ডিকশনারি ম্যাচিং' : 'Bangladeshi Drug Formulary Matching'}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', wordBreak: 'break-word' }}>
                        {language === 'bn' ? 'Square, Beximco, Incepta এর ৫০০+ ওষুধের সাথে মিলিয়ে নিশ্চিতকরণ' : 'Auto-snapped against 500+ Square, Beximco, Incepta brands'}
                      </span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ background: '#fef3c7', color: '#b45309', width: '24px', height: '24px', borderRadius: '50%', aspectRatio: '1/1', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      3
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block' }}>
                        {language === 'bn' ? 'ভয়েস অডিও ও DGDA যাচাই' : 'Audio Speech & DGDA Authenticity'}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', wordBreak: 'break-word' }}>
                        {language === 'bn' ? 'বাংলা ভয়েস স্পিচ ও DAR রেজিস্ট্রেশন চেক' : 'Clear voice playback & counterfeit drug protection'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

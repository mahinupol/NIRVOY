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
          padding: '36px 32px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.05)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            alignItems: 'center'
          }}>
            {/* Left Column */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '14px'
              }}>
                <Activity size={14} />
                <span>{t('heroBadge')}</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                lineHeight: 1.2,
                color: '#0f172a',
                marginBottom: '14px',
                letterSpacing: '-0.03em'
              }}>
                {language === 'bn' ? (
                  <>
                    সহজ বাংলায় প্রেসক্রিপশন বুঝুন <span style={{ color: '#0284c7' }}>ভয়েস অডিও</span> ও <span style={{ color: '#059669' }}>AI সহযোগে</span>
                  </>
                ) : (
                  <>
                    Understand Doctor Prescriptions <span style={{ color: '#0284c7' }}>Clearly in Seconds</span> with <span style={{ color: '#059669' }}>Audio Voice</span>
                  </>
                )}
              </h1>

              <p style={{
                fontSize: '0.95rem',
                color: '#475569',
                marginBottom: '24px',
                lineHeight: 1.6
              }}>
                {t('heroDesc')}
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    triggerCelebration();
                    onStartScan();
                  }}
                  className="btn-primary"
                  style={{ padding: '11px 22px' }}
                >
                  <Scan size={18} />
                  <span>{t('heroScanBtn')}</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={onOpenDemo}
                  className="btn-outline"
                  style={{ padding: '11px 20px' }}
                >
                  <Sparkles size={16} color="#d97706" />
                  <span>{t('heroDemoBtn')}</span>
                </button>
              </div>

              {/* Feature Tags */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginTop: '24px',
                flexWrap: 'wrap',
                fontSize: '0.8rem',
                color: '#475569',
                fontWeight: 600
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={15} color="#059669" />
                  <span>{t('featAudio')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={15} color="#059669" />
                  <span>{t('featDgda')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={15} color="#059669" />
                  <span>{t('featPharmacy')}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Visual Pipeline */}
            <div>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {language === 'bn' ? 'AI পাইপলাইন কার্যপদ্ধতি' : 'AI Pipeline Architecture'}
                  </span>
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>
                    96.8% Accuracy
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

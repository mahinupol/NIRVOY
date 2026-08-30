import React from 'react';
import { Sparkles, Scan, Volume2, ShieldCheck, ArrowRight, Zap, CheckCircle2, HeartPulse } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeroBanner({ lang, onStartScan, onOpenDemo }) {
  const triggerCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0ea5e9', '#10b981', '#f59e0b', '#ec4899']
    });
  };

  return (
    <section style={{
      padding: '40px 20px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container-custom">
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,253,250,0.85) 100%)',
          borderRadius: '32px',
          border: '2px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 20px 50px -10px rgba(14, 165, 233, 0.12)',
          padding: '48px 36px',
          position: 'relative'
        }}>
          {/* Floating Playful Accents */}
          <div style={{
            position: 'absolute',
            top: '-15px',
            right: '40px',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transform: 'rotate(2deg)'
          }}>
            <Sparkles size={16} />
            <span>TrOCR + EasyOCR Bangla AI</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center'
          }}>
            {/* Left Column: Heading & Call to action */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '16px'
              }}>
                <Zap size={16} className="animate-pulse-glow" />
                <span>{lang === 'bn' ? 'অস্পষ্ট হাতের লেখার ভয় দূর করুন' : 'End Prescription Handwriting Confusion'}</span>
              </div>

              <h2 style={{
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                lineHeight: 1.15,
                color: '#0f172a',
                marginBottom: '16px'
              }}>
                {lang === 'bn' ? (
                  <>
                    ডাক্তারের প্রেসক্রিপশন বুঝুন <span style={{ color: '#0ea5e9' }}>সহজ বাংলায়</span>, শুনুন <span style={{ color: '#10b981' }}>বাংলা কণ্ঠস্বরে</span>
                  </>
                ) : (
                  <>
                    Understand Prescriptions in <span style={{ color: '#0ea5e9' }}>Simple Bangla</span> with <span style={{ color: '#10b981' }}>AI Voice Audio</span>
                  </>
                )}
              </h2>

              <p style={{
                fontSize: '1.05rem',
                color: '#475569',
                marginBottom: '28px',
                lineHeight: 1.6
              }}>
                {lang === 'bn' 
                  ? 'NIRVOY কৃত্রিম বুদ্ধিমত্তার মাধ্যমে ডাক্তারের দুর্বোধ্য হাতের লেখা স্ক্যান করে নির্ভুল ঔষধের নাম, সঠিক ডোজ এবং খাবার নিয়ম বাংলায় বুঝিয়ে দেয় এবং উচ্চস্বরে পড়ে শোনায়।'
                  : 'Nirvoy transforms rushed handwritten doctor prescriptions into easy-to-understand Bangla explanations with interactive Text-to-Speech audio, stock radar, and DGDA fake drug verification.'}
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    triggerCelebration();
                    onStartScan();
                  }}
                  className="playful-btn playful-btn-primary"
                  style={{ fontSize: '1rem', padding: '14px 28px' }}
                >
                  <Scan size={20} />
                  <span>{lang === 'bn' ? 'প্রেসক্রিপশন স্ক্যান করুন' : 'Scan Prescription Now'}</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={onOpenDemo}
                  className="playful-btn playful-btn-outline"
                  style={{ fontSize: '1rem', padding: '14px 24px' }}
                >
                  <Sparkles size={18} color="#f59e0b" />
                  <span>{lang === 'bn' ? 'ডেমো প্রেসক্রিপশন দেখুন' : 'Try Demo Samples'}</span>
                </button>
              </div>

              {/* Highlights pills */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginTop: '28px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>{lang === 'bn' ? 'বাংলা অডিও সহায়তা' : 'Bengali Voice TTS'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>{lang === 'bn' ? 'ডিজিডিএ নকল ঔষধ যাচাই' : 'DGDA Drug Auth Check'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>{lang === 'bn' ? 'ফার্মেসি স্টক ও দাম' : 'Live Pharmacy Stock'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Playful Interactive Stats & Floating UI Demo Card */}
            <div style={{ position: 'relative' }}>
              <div className="playful-card" style={{
                padding: '24px',
                background: 'white',
                border: '2px solid #bae6fd',
                borderRadius: '24px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginLeft: '6px' }}>
                      NIRVOY AI LIVE PIPELINE
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '999px', fontWeight: 700 }}>
                    ● 96.8% ACCURACY
                  </span>
                </div>

                {/* Animated Pipeline preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem' }}>📝</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>Handwritten Doctor Slip</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>"Tab Napa Ext 1+0+1 5d"</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#0ea5e9', fontWeight: 700 }}>OCR Input</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                      background: '#0ea5e9',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 800
                    }}>
                      ⚡ TrOCR + BD Medical NLP
                    </div>
                  </div>

                  <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#ecfdf5',
                    border: '1.5px solid #a7f3d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem' }}>🔊</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#065f46' }}>নাপা এক্সট্রা ৫০০+৬৫ মি.গ্রা.</div>
                        <div style={{ fontSize: '0.75rem', color: '#047857' }}>সকাল ও রাতে খাবার পর ১টি করে ৫ দিন (জ্বর ও ব্যথার জন্য)</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                      বাংলা অডিও
                    </span>
                  </div>
                </div>

                {/* Micro Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9',
                  textAlign: 'center'
                }}>
                  <div style={{ background: '#f0f9ff', padding: '10px 6px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0284c7' }}>500+</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>BD Medicines</div>
                  </div>
                  <div style={{ background: '#f0fdf4', padding: '10px 6px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16a34a' }}>100%</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Bangla TTS</div>
                  </div>
                  <div style={{ background: '#fefce8', padding: '10px 6px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ca8a04' }}>DGDA</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Verified Seal</div>
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

import React from 'react';
import { Sparkles, Scan, ArrowRight, CheckCircle2, ShieldCheck, HeartPulse, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeroBanner({ onStartScan, onOpenDemo }) {
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
                <span>TrOCR + Bangla NLP Intelligence</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                lineHeight: 1.2,
                color: '#0f172a',
                marginBottom: '14px',
                letterSpacing: '-0.03em'
              }}>
                Understand Doctor Prescriptions in <span style={{ color: '#0284c7' }}>Simple Bangla</span> with <span style={{ color: '#059669' }}>Audio Voice</span>
              </h1>

              <p style={{
                fontSize: '0.95rem',
                color: '#475569',
                marginBottom: '24px',
                lineHeight: 1.6
              }}>
                ডাক্তারের দুর্বোধ্য হাতের লেখা স্ক্যান করুন এবং সঠিক ওষুধের নাম, সেবন মাত্রা ও খাওয়ার নিয়ম সহজ বাংলায় শুনুন। AI-driven prescription reading, audio voice assistance, and DGDA fake drug verification.
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
                  <span>Scan Prescription (প্রেসক্রিপশন স্ক্যান)</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={onOpenDemo}
                  className="btn-outline"
                  style={{ padding: '11px 20px' }}
                >
                  <Sparkles size={16} color="#d97706" />
                  <span>Try Demo Samples (ডেমো দেখুন)</span>
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
                  <span>Bangla Voice Audio (বাংলা ভয়েস)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={15} color="#059669" />
                  <span>DGDA Counterfeit Check (নকল ঔষধ যাচাই)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={15} color="#059669" />
                  <span>Pharmacy Stock Radar</span>
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
                    AI Pipeline Workflow
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
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>1. Prescription Input</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Raw handwritten image: "Tab Napa Ext 1+0+1 5d"</div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>OCR Input</span>
                  </div>

                  {/* Step 2 */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>2. AI Normalization</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Matched with Bangladeshi Drug Database (Beximco)</div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>Drug Dict</span>
                  </div>

                  {/* Step 3 */}
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>3. Bangla Voice & Instructions</div>
                      <div style={{ fontSize: '0.75rem', color: '#15803d' }}>"সকাল ও রাতে খাবার পর ১টি করে ৫ দিন (জ্বর ও ব্যথার জন্য)"</div>
                    </div>
                    <span style={{ background: '#059669', color: '#ffffff', padding: '2px 7px', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700 }}>
                      Audio Ready
                    </span>
                  </div>
                </div>

                {/* Quick stats grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginTop: '14px',
                  paddingTop: '12px',
                  borderTop: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0284c7' }}>500+</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>BD Drugs</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669' }}>100%</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Bangla TTS</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#d97706' }}>DGDA</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Verified</div>
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

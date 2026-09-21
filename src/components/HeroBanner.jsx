import React from 'react';
import { Scan, Bot, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Mic } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeroBanner({ onStartScan, onOpenChatbot, onOpenVerify, onOpenConsult }) {
  const triggerCelebration = () => {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <section style={{ padding: '20px 0 16px' }}>
      <div className="container-max">
        <div className="clean-card" style={{
          padding: '36px 32px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 24px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px',
            alignItems: 'center'
          }}>
            {/* Left Column: Minimalist Content */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#e0f2fe',
                color: '#0369a1',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '12px'
              }}>
                <Sparkles size={14} color="#0284c7" />
                <span>AI Health Intelligence • 21,700+ BD Drugs</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)',
                lineHeight: 1.25,
                color: '#0f172a',
                marginBottom: '10px',
                letterSpacing: '-0.025em',
                fontWeight: 800
              }}>
                Scan Prescriptions & Predict <span style={{ color: '#0284c7' }}>Medicines with AI</span>
              </h1>

              <p style={{
                fontSize: '0.94rem',
                color: '#475569',
                marginBottom: '20px',
                lineHeight: 1.55
              }}>
                Instantly decode handwritten doctor prescriptions and consult our AI Clinical Assistant for disease assessment and authentic medicine recommendations.
                <span style={{ display: 'block', color: '#0284c7', fontSize: '0.84rem', marginTop: '4px', fontWeight: 600 }}>
                  (ডাক্তারের প্রেসক্রিপশন স্ক্যান করুন অথবা এআই সহকারী থেকে সঠিক ঔষধ ও পরামর্শ জানুন)
                </span>
              </p>

              {/* Useful Action Buttons Only */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    triggerCelebration();
                    onStartScan && onStartScan();
                  }}
                  className="btn-primary"
                  style={{ padding: '11px 22px' }}
                >
                  <Scan size={17} />
                  <span>Scan Prescription</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={() => onOpenConsult && onOpenConsult()}
                  className="btn-outline"
                  style={{
                    padding: '11px 18px',
                    borderColor: '#ef4444',
                    color: '#b91c1c',
                    background: '#fef2f2'
                  }}
                >
                  <Mic size={17} color="#ef4444" />
                  <span>Record Doctor Visit (ডক্টর রেকর্ড)</span>
                </button>

                <button
                  onClick={() => onOpenChatbot && onOpenChatbot()}
                  className="btn-outline"
                  style={{
                    padding: '11px 18px',
                    borderColor: '#0284c7',
                    color: '#0369a1',
                    background: '#f0f9ff'
                  }}
                >
                  <Bot size={17} color="#0284c7" />
                  <span>AI Health Chatbot</span>
                </button>

                <button
                  onClick={() => onOpenVerify && onOpenVerify()}
                  className="btn-outline"
                  style={{ padding: '11px 18px' }}
                >
                  <ShieldCheck size={17} color="#059669" />
                  <span>Verify Medicine</span>
                </button>
              </div>

              {/* Minimal Trust Indicators */}
              <div style={{
                display: 'flex',
                gap: '18px',
                marginTop: '22px',
                flexWrap: 'wrap',
                fontSize: '0.82rem',
                color: '#64748b',
                fontWeight: 600
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={15} color="#16a34a" /> DGDA Drug Registry
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={15} color="#16a34a" /> OpenAI gpt-5.6-luna
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={15} color="#16a34a" /> Bangla Voice Audio
                </span>
              </div>
            </div>

            {/* Right Column: Sleek Minimalist Feature Preview Card */}
            <div>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                    Quick Diagnostic Flow
                  </span>
                  <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                    Instant AI
                  </span>
                </div>

                {/* Minimalist 3-Step Clean Row */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      1
                    </span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.84rem', color: '#0f172a', display: 'block' }}>
                        Upload or Scan Rx
                      </strong>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        Prescription photo or camera snap
                      </span>
                    </div>
                  </div>

                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ background: '#fef3c7', color: '#b45309', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      2
                    </span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.84rem', color: '#0f172a', display: 'block' }}>
                        AI Identifies Disease & Drug
                      </strong>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        Matched with 21,700+ BD registered medicines
                      </span>
                    </div>
                  </div>

                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ background: '#dcfce7', color: '#15803d', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      3
                    </span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.84rem', color: '#0f172a', display: 'block' }}>
                        Get Dosage & Audio Advice
                      </strong>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        Clean dosage schedule with audio voice
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

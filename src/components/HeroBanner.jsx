import React from 'react';
import { Sparkles, Scan, ArrowRight, CheckCircle2, Volume2, ShieldCheck, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

export default function HeroBanner({ onStartScan, onOpenDemo }) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const triggerCelebration = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <section style={{ padding: '24px 0 16px' }}>
      <div className="container-max">
        <div className="clean-card" style={{
          padding: '36px 30px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '14px'
              }}>
                <Sparkles size={14} color="#0284c7" />
                <span>{isBn ? 'AI প্রেসক্রিপশন সহকারী' : 'AI Prescription Assistant'}</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(1.7rem, 3.2vw, 2.4rem)',
                lineHeight: 1.25,
                color: '#0f172a',
                marginBottom: '14px',
                letterSpacing: '-0.025em'
              }}>
                {isBn ? (
                  <>
                    সহজ বাংলায় প্রেসক্রিপশন বুঝুন <span style={{ color: '#0284c7' }}>ভয়েস অডিও</span> ও <span style={{ color: '#059669' }}>AI সহযোগে</span>
                  </>
                ) : (
                  <>
                    Understand Prescriptions <span style={{ color: '#0284c7' }}>Clearly in Seconds</span> with <span style={{ color: '#059669' }}>Audio Voice</span>
                  </>
                )}
              </h1>

              <p style={{
                fontSize: '0.96rem',
                color: '#475569',
                marginBottom: '24px',
                lineHeight: 1.6
              }}>
                {isBn 
                  ? 'ডাক্তারের হাতের লেখা প্রেসক্রিপশন স্ক্যান করুন এবং সঠিক ঔষধের নাম, খাওয়ার নিয়ম ও ডোজ বাংলায় পরিষ্কারভাবে শুনুন।'
                  : 'Scan doctor prescriptions instantly to decode medicines, timing, dosage, and listen to voice explanations.'}
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    triggerCelebration();
                    onStartScan();
                  }}
                  className="btn-primary"
                >
                  <Scan size={18} />
                  <span>{isBn ? 'প্রেসক্রিপশন স্ক্যান করুন' : 'Scan Prescription'}</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={onOpenDemo}
                  className="btn-outline"
                >
                  <Sparkles size={16} color="#d97706" />
                  <span>{isBn ? 'ডেমো দেখুন' : 'View Demo'}</span>
                </button>
              </div>

              {/* Clean Feature Highlights */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginTop: '24px',
                flexWrap: 'wrap',
                fontSize: '0.84rem',
                color: '#334155',
                fontWeight: 600
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Volume2 size={16} color="#0284c7" />
                  <span>{isBn ? 'বাংলা ভয়েস অডিও' : 'Audio Speech'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="#059669" />
                  <span>{isBn ? 'DGDA ঔষধ যাচাই' : 'DGDA Verified'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color="#d97706" />
                  <span>{isBn ? 'ফার্মেসি স্টক' : 'Pharmacy Finder'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Visual Step Guide */}
            <div>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <h3 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '14px', fontWeight: 700 }}>
                  {isBn ? 'কিভাবে কাজ করে?' : 'How It Works'}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: 800, flexShrink: 0 }}>
                      ১
                    </span>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                        {isBn ? 'ছবি আপলোড করুন' : 'Upload Prescription'}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {isBn ? 'প্রেসক্রিপশনের স্পষ্ট ছবি নির্বাচন বা ক্যামেরা দিয়ে তুলুন' : 'Select a clear photo of your prescription'}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ background: '#dcfce7', color: '#15803d', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: 800, flexShrink: 0 }}>
                      ২
                    </span>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                        {isBn ? 'AI স্বয়ংক্রিয়ভাবে সনাক্ত করবে' : 'AI Medicine Recognition'}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {isBn ? 'হাতের লেখা বিশ্লেষণ করে সঠিক ওষুধের নাম বের করবে' : 'Decodes handwritten medicine names accurately'}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ background: '#fef3c7', color: '#b45309', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: 800, flexShrink: 0 }}>
                      ৩
                    </span>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                        {isBn ? 'ভয়েস অডিওতে শুনুন' : 'Listen with Audio'}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {isBn ? 'ঔষধ খাওয়ার সঠিক নিয়ম ও সময় বাংলায় শুনুন' : 'Listen to dosage instructions in clear Bangla voice'}
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

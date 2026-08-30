import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, QrCode, Search, CheckCircle2, AlertTriangle, Building2, Calendar, FileCheck, Sparkles, RefreshCw } from 'lucide-react';
import { DGDA_REGISTRY, DGDA_VERIFY_SAMPLE_PRESETS } from '../data/dgdaRegistry';
import confetti from 'canvas-confetti';

export default function FakeMedicineVerifier({ lang }) {
  const [inputCode, setInputCode] = useState('8941100230182');
  const [verificationResult, setVerificationResult] = useState(DGDA_REGISTRY[0]);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (codeToVerify) => {
    const target = codeToVerify || inputCode;
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const match = DGDA_REGISTRY.find(r => r.barcode === target || r.dgdaRegNo.toLowerCase() === target.toLowerCase() || r.batchNumber.toLowerCase() === target.toLowerCase());

      if (match) {
        setVerificationResult(match);
        if (match.status === 'AUTHENTIC') {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      } else {
        // Unknown unverified drug
        setVerificationResult({
          status: 'UNVERIFIED',
          brandName: 'Unknown Product',
          generic: 'Unregistered Generic',
          manufacturer: 'Not Found in DGDA Database',
          verificationMessageBn: 'সতর্কতা: এই বারকোড বা ব্যাচ নাম্বারটি ডিজিডিএ অনুমোদিত ডাটাবেসে পাওয়া যায়নি। এটি কেনা থেকে বিরত থাকুন।',
          verificationMessageEn: 'Caution: Unregistered record not found in DGDA official database.',
          hologramMatched: false,
          dgdaSealVerified: false,
          riskScore: 75
        });
      }
    }, 450);
  };

  const handlePresetSelect = (code) => {
    setInputCode(code);
    handleVerify(code);
  };

  const isAuthentic = verificationResult?.status === 'AUTHENTIC';
  const isCounterfeit = verificationResult?.status === 'COUNTERFEIT_ALERT';

  return (
    <div style={{ padding: '10px 0 40px' }}>
      <div className="container-custom">
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fef2f2',
            color: '#dc2626',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            MODULE 6 • FAKE MEDICINE VERIFICATION
          </div>
          <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '8px' }}>
            {lang === 'bn' ? 'ডিজিডিএ নকল ঔষধ ও বারকোড যাচাই' : 'DGDA Counterfeit Drug & Barcode Verifier'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '680px', margin: '0 auto' }}>
            {lang === 'bn' 
              ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের ঔষধ প্রশাসন অধিদপ্তর (DGDA) রেজিস্ট্রেশন ও হলোগ্রাম স্ক্যান করে আসল ঔষধ নিশ্চিত করুন।'
              : 'Verify drug authenticity, expiration, and manufacturer registration directly against DGDA records.'}
          </p>
        </div>

        {/* Preset Quick Test Bar */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', alignSelf: 'center' }}>
            {lang === 'bn' ? 'নমুনা যাচাই করুন:' : 'Test Scenarios:'}
          </span>
          {DGDA_VERIFY_SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(preset.code)}
              style={{
                background: preset.code.includes('9999') ? '#fee2e2' : '#f0fdf4',
                border: '1.5px solid',
                borderColor: preset.code.includes('9999') ? '#fca5a5' : '#86efac',
                color: preset.code.includes('9999') ? '#991b1b' : '#166534',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Search / Scan Bar */}
        <div className="playful-card" style={{
          padding: '24px',
          background: 'white',
          borderRadius: '24px',
          maxWidth: '720px',
          margin: '0 auto 32px',
          border: '1.5px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <QrCode size={20} color="#64748b" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="বারকোড বা DGDA DAR নম্বর লিখুন (যেমন: 8941100230182)"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 44px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <button
              onClick={() => handleVerify()}
              className="playful-btn playful-btn-primary"
              style={{ padding: '12px 24px' }}
            >
              {isVerifying ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
              <span>{lang === 'bn' ? 'যাচাই করুন (Verify)' : 'Verify Now'}</span>
            </button>
          </div>
        </div>

        {/* Verification Result Card */}
        {verificationResult && (
          <div className="playful-card" style={{
            maxWidth: '780px',
            margin: '0 auto',
            background: 'white',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '2px solid',
            borderColor: isAuthentic ? '#86efac' : isCounterfeit ? '#f87171' : '#fde047',
            boxShadow: isAuthentic ? '0 12px 36px rgba(16, 185, 129, 0.15)' : '0 12px 36px rgba(239, 68, 68, 0.15)'
          }}>
            {/* Top Status Header */}
            <div style={{
              background: isAuthentic ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : isCounterfeit ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)' : '#ca8a04',
              color: 'white',
              padding: '20px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  background: 'white',
                  color: isAuthentic ? '#059669' : '#dc2626',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isAuthentic ? <ShieldCheck size={26} /> : <ShieldAlert size={26} />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
                    {isAuthentic ? '১০০% আসল ও অনুমোদিত ঔষধ (AUTHENTIC)' : isCounterfeit ? '⚠️ নকল বা অবৈধ ঔষধের সতর্কতা (COUNTERFEIT)' : 'যাচাই করা সম্ভব হয়নি (UNVERIFIED)'}
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)' }}>
                    DGDA Verification Registry No: {verificationResult.dgdaRegNo || 'N/A'}
                  </p>
                </div>
              </div>

              <span style={{
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.05em'
              }}>
                RISK: {verificationResult.riskScore}%
              </span>
            </div>

            {/* Content Details */}
            <div style={{ padding: '28px' }}>
              <div style={{
                background: isAuthentic ? '#f0fdf4' : '#fef2f2',
                border: '1px solid',
                borderColor: isAuthentic ? '#bbf7d0' : '#fecaca',
                padding: '14px 18px',
                borderRadius: '16px',
                marginBottom: '20px',
                fontSize: '0.9rem',
                color: isAuthentic ? '#166534' : '#991b1b',
                fontWeight: 600,
                lineHeight: 1.5
              }}>
                {lang === 'bn' ? verificationResult.verificationMessageBn : verificationResult.verificationMessageEn}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px'
              }}>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>ঔষধের নাম (Brand Name)</span>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{verificationResult.brandName}</strong>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{verificationResult.generic}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>উৎপাদনকারী প্রতিষ্ঠান (Manufacturer)</span>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{verificationResult.manufacturer}</strong>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>লাইসেন্স: {verificationResult.licenseNo || 'N/A'}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>ব্যাচ ও মেয়াদ (Batch & Expiry)</span>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>Batch: {verificationResult.batchNumber || 'N/A'}</strong>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>মেয়াদোত্তীর্ণ: {verificationResult.expDate || 'N/A'}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>সিকিউরিটি হলোগ্রাম সিল</span>
                  <strong style={{
                    fontSize: '0.95rem',
                    color: verificationResult.hologramMatched ? '#15803d' : '#b91c1c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {verificationResult.hologramMatched ? '✓ ডিজিডিএ হলোগ্রাম ভেরিফায়েড' : '✕ কোনো বৈধ সিল মেলেনি'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

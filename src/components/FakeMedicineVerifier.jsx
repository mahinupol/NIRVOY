import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, QrCode, Search, RefreshCw } from 'lucide-react';
import { DGDA_REGISTRY, DGDA_VERIFY_SAMPLE_PRESETS } from '../data/dgdaRegistry';
import confetti from 'canvas-confetti';

export default function FakeMedicineVerifier() {
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
    }, 350);
  };

  const handlePresetSelect = (code) => {
    setInputCode(code);
    handleVerify(code);
  };

  const isAuthentic = verificationResult?.status === 'AUTHENTIC';
  const isCounterfeit = verificationResult?.status === 'COUNTERFEIT_ALERT';

  return (
    <div style={{ padding: '8px 0 36px' }}>
      <div className="container-max">
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            DGDA নকল ঔষধ যাচাইকরণ (Counterfeit Verifier)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: '540px', margin: '0 auto' }}>
            ঔষধ প্রশাসন অধিদপ্তর (DGDA) রেজিস্ট্রেশন ও বারকোড দিয়ে আসল ঔষধ যাচাই করুন।
          </p>
        </div>

        {/* Preset Quick Test Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', alignSelf: 'center' }}>
            Test Cases:
          </span>
          {DGDA_VERIFY_SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(preset.code)}
              style={{
                background: preset.code.includes('9999') ? '#ffe4e6' : '#f0fdf4',
                border: '1px solid',
                borderColor: preset.code.includes('9999') ? '#fecaca' : '#bbf7d0',
                color: preset.code.includes('9999') ? '#be123c' : '#166534',
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="clean-card" style={{
          padding: '18px 20px',
          background: '#ffffff',
          borderRadius: '16px',
          maxWidth: '680px',
          margin: '0 auto 24px'
        }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <QrCode size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter Barcode or DGDA DAR No. (e.g. 8941100230182)"
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 38px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <button
              onClick={() => handleVerify()}
              className="btn-primary"
              style={{ padding: '9px 20px' }}
            >
              {isVerifying ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
              <span>Verify Drug</span>
            </button>
          </div>
        </div>

        {/* Verification Result Card */}
        {verificationResult && (
          <div className="clean-card" style={{
            maxWidth: '720px',
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1.5px solid',
            borderColor: isAuthentic ? '#86efac' : isCounterfeit ? '#fca5a5' : '#fde047'
          }}>
            {/* Header */}
            <div style={{
              background: isAuthentic ? '#059669' : isCounterfeit ? '#e11d48' : '#d97706',
              color: '#ffffff',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  background: '#ffffff',
                  color: isAuthentic ? '#059669' : '#e11d48',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isAuthentic ? <ShieldCheck size={22} /> : <ShieldAlert size={22} />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                    {isAuthentic ? 'Verified Authentic (১০০% আসল ও অনুমোদিত ঔষধ)' : isCounterfeit ? '⚠️ Counterfeit Alert (নকল বা অবৈধ ব্যাচ)' : 'Unverified Record'}
                  </h3>
                  <p style={{ margin: '1px 0 0', fontSize: '0.72rem', color: 'rgba(255,255,255,0.9)' }}>
                    DGDA Registry DAR No: {verificationResult.dgdaRegNo || 'N/A'}
                  </p>
                </div>
              </div>

              <span style={{
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                Risk Score: {verificationResult.riskScore}%
              </span>
            </div>

            {/* Content Details */}
            <div style={{ padding: '20px' }}>
              <div style={{
                background: isAuthentic ? '#f0fdf4' : '#fef2f2',
                border: '1px solid',
                borderColor: isAuthentic ? '#bbf7d0' : '#fecaca',
                padding: '12px 14px',
                borderRadius: '10px',
                marginBottom: '16px',
                fontSize: '0.85rem',
                color: isAuthentic ? '#166534' : '#991b1b',
                fontWeight: 600,
                lineHeight: 1.5
              }}>
                {verificationResult.verificationMessageBn}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Brand & Generic</span>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{verificationResult.brandName}</strong>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{verificationResult.generic}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Manufacturer</span>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{verificationResult.manufacturer}</strong>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>License: {verificationResult.licenseNo || 'N/A'}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Batch & Expiry</span>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Batch: {verificationResult.batchNumber || 'N/A'}</strong>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Expiry: {verificationResult.expDate || 'N/A'}</div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>DGDA Security Seal</span>
                  <strong style={{
                    fontSize: '0.88rem',
                    color: verificationResult.hologramMatched ? '#15803d' : '#be123c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {verificationResult.hologramMatched ? '✓ Hologram Matched' : '✕ No Valid Seal Found'}
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

import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  HeartPulse, 
  Activity, 
  User, 
  Mail, 
  Lock, 
  Calendar, 
  Ruler, 
  Weight, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const COMMON_DISEASES = [
  { id: 'diabetes', en: 'Diabetes', bn: 'ডায়াবেটিস', icon: '🩺', color: '#0284c7' },
  { id: 'hypertension', en: 'High Blood Pressure (Hypertension)', bn: 'উচ্চ রক্তচাপ', icon: '💓', color: '#dc2626' },
  { id: 'asthma', en: 'Asthma / Respiratory', bn: 'হাঁপানি / শ্বাসকষ্ট', icon: '🫁', color: '#059669' },
  { id: 'heart_disease', en: 'Heart Disease', bn: 'হৃদরোগ', icon: '❤️', color: '#e11d48' },
  { id: 'kidney_disease', en: 'Kidney Disease', bn: 'কিডনি সমস্যা', icon: '🫘', color: '#d97706' },
  { id: 'gastritis', en: 'Chronic Gastritis / Acidity', bn: 'গ্যাস্ট্রিক / আলসার', icon: '🔥', color: '#ea580c' },
  { id: 'drug_allergy', en: 'Known Drug Allergies', bn: 'ওষুধে অ্যালার্জি', icon: '🌾', color: '#7c3aed' },
  { id: 'thyroid', en: 'Thyroid Disorder', bn: 'থাইরয়েড সমস্যা', icon: '🧠', color: '#4f46e5' },
  { id: 'arthritis', en: 'Arthritis / Joint Pain', bn: 'বাত ব্যথা', icon: '🦴', color: '#0891b2' },
  { id: 'cholesterol', en: 'High Cholesterol', bn: 'উচ্চ কোলেস্টেরল', icon: '🩸', color: '#be123c' }
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [mode, setMode] = useState('register'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    heightFeet: '5',
    heightInches: '6',
    heightCustom: '',
    weight_kg: '',
    gender: 'Male',
    blood_group: 'B+',
    chronic_diseases: [],
    customDisease: '',
    allergies: '',
    emergency_contact: ''
  });

  if (!isAuthModalOpen) return null;

  const handleDiseaseToggle = (diseaseName) => {
    setRegData(prev => {
      const exists = prev.chronic_diseases.includes(diseaseName);
      if (exists) {
        return { ...prev, chronic_diseases: prev.chronic_diseases.filter(d => d !== diseaseName) };
      } else {
        return { ...prev, chronic_diseases: [...prev.chronic_diseases, diseaseName] };
      }
    });
  };

  const handleAddCustomDisease = (e) => {
    e.preventDefault();
    if (regData.customDisease.trim()) {
      if (!regData.chronic_diseases.includes(regData.customDisease.trim())) {
        setRegData(prev => ({
          ...prev,
          chronic_diseases: [...prev.chronic_diseases, prev.customDisease.trim()],
          customDisease: ''
        }));
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      setSuccessMsg(isBn ? 'লগইন সফল হয়েছে!' : 'Login successful!');
      setTimeout(() => {
        closeAuthModal();
        setSuccessMsg('');
      }, 700);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!regData.name || !regData.email || !regData.password) {
      setError(isBn ? 'দয়া করে নাম, ইমেইল এবং পাসওয়ার্ড দিন।' : 'Please provide name, email/phone, and password.');
      return;
    }

    setLoading(true);
    try {
      const heightStr = `${regData.heightFeet} ft ${regData.heightInches} in`;
      const allergiesList = regData.allergies ? regData.allergies.split(',').map(s => s.trim()).filter(Boolean) : [];

      await register({
        name: regData.name,
        email: regData.email,
        password: regData.password,
        age: regData.age ? parseInt(regData.age, 10) : null,
        height: heightStr,
        weight_kg: regData.weight_kg ? parseFloat(regData.weight_kg) : null,
        gender: regData.gender,
        blood_group: regData.blood_group,
        chronic_diseases: regData.chronic_diseases,
        allergies: allergiesList,
        emergency_contact: regData.emergency_contact
      });

      setSuccessMsg(isBn ? 'রোগীর প্রোফাইল সফলভাবে তৈরি ও ডাটাবেজে সংরক্ষণ করা হয়েছে!' : 'Patient profile created and saved to database!');
      setTimeout(() => {
        closeAuthModal();
        setSuccessMsg('');
      }, 900);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        maxWidth: mode === 'register' ? '680px' : '440px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0',
        position: 'relative',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
            }}>
              <HeartPulse size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                {mode === 'register' 
                  ? (isBn ? 'রোগী নিবন্ধন ও স্বাস্থ্য প্রোফাইল' : 'Patient Registration & Health Profile')
                  : (isBn ? 'রোগী অ্যাকাউন্ট লগইন' : 'Patient Account Login')}
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                {mode === 'register'
                  ? (isBn ? 'ডাটাবেজে স্থায়ীভাবে আপনার তথ্য সংরক্ষণ করুন' : 'Save your medical records securely in Neon PostgreSQL')
                  : (isBn ? 'আপনার পূর্বের স্বাস্থ্য তথ্যে প্রবেশ করুন' : 'Access your saved medical profile & prescriptions')}
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Toggle (Login / Register) */}
        <div style={{ padding: '16px 24px 0' }}>
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '12px',
            gap: '4px'
          }}>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'register' ? '#ffffff' : 'transparent',
                color: mode === 'register' ? '#0284c7' : '#64748b',
                fontWeight: mode === 'register' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: mode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <UserPlus size={16} />
              {isBn ? 'নতুন রোগী নিবন্ধন (Sign Up)' : 'New Patient (Sign Up)'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'login' ? '#ffffff' : 'transparent',
                color: mode === 'login' ? '#0284c7' : '#64748b',
                fontWeight: mode === 'login' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: mode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <LogIn size={16} />
              {isBn ? 'লগইন (Sign In)' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        <div style={{ padding: '0 24px' }}>
          {error && (
            <div style={{
              margin: '12px 0 0',
              padding: '10px 14px',
              borderRadius: '10px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              margin: '12px 0 0',
              padding: '10px 14px',
              borderRadius: '10px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ padding: '20px 24px 24px' }}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                {isBn ? 'ইমেইল অথবা মোবাইল নম্বর' : 'Email or Phone Number'} *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  placeholder={isBn ? 'যেমন: patient@gmail.com বা 017xxxxxxxx' : 'e.g. patient@gmail.com or 017xxxxxxxx'}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                {isBn ? 'পাসওয়ার্ড' : 'Password'} *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7 0%, #059669 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
              }}
            >
              {loading ? (
                <span>{isBn ? 'লগইন হচ্ছে...' : 'Signing in...'}</span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>{isBn ? 'অ্যাকাউন্টে প্রবেশ করুন' : 'Sign In to Account'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* REGISTER & ONBOARDING FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ padding: '20px 24px 24px' }}>
            
            {/* Step 1: Account Credentials */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <span style={{ background: '#0284c7', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: '6px' }}>1</span>
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a', fontWeight: 700 }}>
                  {isBn ? 'অ্যাকাউন্ট ও যোগাযোগের তথ্য' : 'Account Credentials'}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'রোগীর পূর্ণ নাম' : 'Full Name'} *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      required
                      placeholder={isBn ? 'যেমন: রহিম আহমেদ' : 'e.g. Rahim Ahmed'}
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'ইমেইল / মোবাইল' : 'Email / Mobile'} *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      required
                      placeholder="patient@gmail.com"
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'পাসওয়ার্ড' : 'Password'} *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Physical Vitals (Age, Height, Weight, Blood Group) */}
            <div style={{
              background: '#f0fdf4',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '16px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <span style={{ background: '#059669', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: '6px' }}>2</span>
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#065f46', fontWeight: 700 }}>
                  {isBn ? 'শারীরিক পরিমাপ ও তথ্য (Vitals)' : 'Physical Vitals & Body Metrics'}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                {/* Age */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '3px' }}>
                    {isBn ? 'বয়স (Age)' : 'Age (Years)'} *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="number"
                      min="1"
                      max="120"
                      required
                      placeholder="45"
                      value={regData.age}
                      onChange={(e) => setRegData({ ...regData, age: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '8px', border: '1px solid #86efac', background: '#ffffff', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                {/* Height */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '3px' }}>
                    {isBn ? 'উচ্চতা (Height)' : 'Height'}
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <select
                      value={regData.heightFeet}
                      onChange={(e) => setRegData({ ...regData, heightFeet: e.target.value })}
                      style={{ width: '50%', padding: '8px 4px', borderRadius: '8px', border: '1px solid #86efac', background: '#ffffff', fontSize: '0.8rem' }}
                    >
                      {[3,4,5,6,7].map(f => <option key={f} value={f}>{f} ft</option>)}
                    </select>
                    <select
                      value={regData.heightInches}
                      onChange={(e) => setRegData({ ...regData, heightInches: e.target.value })}
                      style={{ width: '50%', padding: '8px 4px', borderRadius: '8px', border: '1px solid #86efac', background: '#ffffff', fontSize: '0.8rem' }}
                    >
                      {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => <option key={i} value={i}>{i} in</option>)}
                    </select>
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '3px' }}>
                    {isBn ? 'ওজন (Weight)' : 'Weight (kg)'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Weight size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="number"
                      step="0.5"
                      placeholder="68"
                      value={regData.weight_kg}
                      onChange={(e) => setRegData({ ...regData, weight_kg: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '8px', border: '1px solid #86efac', background: '#ffffff', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '3px' }}>
                    {isBn ? 'লিঙ্গ (Gender)' : 'Gender'}
                  </label>
                  <select
                    value={regData.gender}
                    onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #86efac', background: '#ffffff', fontSize: '0.82rem' }}
                  >
                    <option value="Male">{isBn ? 'পুরুষ (Male)' : 'Male'}</option>
                    <option value="Female">{isBn ? 'মহিলা (Female)' : 'Female'}</option>
                    <option value="Other">{isBn ? 'অন্যান্য (Other)' : 'Other'}</option>
                  </select>
                </div>

                {/* Blood Group */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '3px' }}>
                    {isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}
                  </label>
                  <select
                    value={regData.blood_group}
                    onChange={(e) => setRegData({ ...regData, blood_group: e.target.value })}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #86efac', background: '#ffffff', fontSize: '0.82rem' }}
                  >
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Chronic Diseases & Health Conditions Questionnaire */}
            <div style={{
              background: '#fef3c7',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '16px',
              border: '1px solid #fde68a'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ background: '#d97706', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: '6px' }}>3</span>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#92400e', fontWeight: 700 }}>
                    {isBn ? 'দীর্ঘস্থায়ী রোগ ও শারীরিক অবস্থা নির্বাচন করুন' : 'Select Common Diseases / Health Conditions'}
                  </h4>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 600 }}>
                  {regData.chronic_diseases.length} {isBn ? 'টি নির্বাচিত' : 'selected'}
                </span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: '#78350f' }}>
                {isBn 
                  ? 'আপনার কোনো বিদ্যমান রোগ বা এলার্জি থাকলে সিলেক্ট করুন (এটি প্রেসক্রিপশন ড্রাগ ইন্টারঅ্যাকশন সতর্কতায় সাহায্য করবে):'
                  : 'Select any known conditions (used for personalized AI medication contraindication alerts):'}
              </p>

              {/* Disease Tags / Badges Grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {COMMON_DISEASES.map(disease => {
                  const isSelected = regData.chronic_diseases.includes(disease.en);
                  return (
                    <button
                      key={disease.id}
                      type="button"
                      onClick={() => handleDiseaseToggle(disease.en)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '999px',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: isSelected ? `2px solid ${disease.color}` : '1px solid #e5e7eb',
                        background: isSelected ? `${disease.color}15` : '#ffffff',
                        color: isSelected ? disease.color : '#4b5563',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{disease.icon}</span>
                      <span>{isBn ? disease.bn : disease.en}</span>
                      {isSelected && <CheckCircle2 size={13} style={{ strokeWidth: 3 }} />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Disease input */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder={isBn ? 'অন্য কোনো রোগ থাকলে লিখুন এবং যোগ করুন...' : 'Other conditions (e.g. Migraine, Fatty Liver)...'}
                  value={regData.customDisease}
                  onChange={(e) => setRegData({ ...regData, customDisease: e.target.value })}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.78rem',
                    background: '#ffffff'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomDisease}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#d97706',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  + {isBn ? 'যোগ করুন' : 'Add'}
                </button>
              </div>
            </div>

            {/* Step 4: Emergency Contact & Drug Allergies */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '12px 16px',
              marginBottom: '18px',
              border: '1px solid #e2e8f0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                  {isBn ? 'নির্দিষ্ট কোনো ওষুধে অ্যালার্জি (যদি থাকে)' : 'Specific Drug Allergies (e.g. Penicillin)'}
                </label>
                <input
                  type="text"
                  placeholder={isBn ? 'যেমন: Penicillin, Sulfa' : 'e.g. Penicillin, Sulfa'}
                  value={regData.allergies}
                  onChange={(e) => setRegData({ ...regData, allergies: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                  {isBn ? 'জরুরি যোগাযোগ নম্বর (Emergency Contact)' : 'Emergency Contact Phone'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="018xxxxxxxx"
                    value={regData.emergency_contact}
                    onChange={(e) => setRegData({ ...regData, emergency_contact: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7 0%, #059669 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)'
              }}
            >
              {loading ? (
                <span>{isBn ? 'ডাটাবেজে সংরক্ষণ করা হচ্ছে...' : 'Saving to PostgreSQL...'}</span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>{isBn ? 'নিবন্ধন সম্পন্ন ও ডাটাবেজে সংরক্ষণ করুন' : 'Complete Registration & Save Profile'}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

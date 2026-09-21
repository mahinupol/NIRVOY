import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Stethoscope,
  Award,
  Zap,
  Building,
  Clock,
  Coins
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

const DOCTOR_SPECIALTIES = [
  'Medicine Specialist (মেডিসিন বিশেষজ্ঞ)',
  'Cardiologist (হৃদরোগ বিশেষজ্ঞ)',
  'Chest & Pulmonology (বক্ষব্যাধি ও শ্বাসকষ্ট)',
  'Gastroenterology (লিভার ও পরিপাকতন্ত্র)',
  'Endocrinology & Diabetology (ডায়াবেটিস বিশেষজ্ঞ)',
  'General Physician (জেনারেল ফিজিশিয়ান)',
  'Pediatrician (শিশু বিশেষজ্ঞ)',
  'Gynecologist (স্ত্রীরোগ ও প্রসূতি বিশেষজ্ঞ)',
  'Neurologist (নিউরোমেডিসিন বিশেষজ্ঞ)',
  'Orthopedic Surgeon (হাড় ও জোড়া বিশেষজ্ঞ)',
  'Dermatologist (চর্ম ও যৌন রোগ বিশেষজ্ঞ)'
];

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register, authModalConfig } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [activeRole, setActiveRole] = useState('patient'); // 'patient' or 'doctor'
  const [mode, setMode] = useState('register'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Patient Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Patient Register form state
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

  // Doctor Registration form state
  const [drData, setDrData] = useState({
    name: '',
    bmdc_reg: '',
    specialty: DOCTOR_SPECIALTIES[0],
    qualifications: 'MBBS, FCPS (Medicine)',
    hospital_chamber: 'Dhaka Medical College Hospital',
    phone: '',
    email: '',
    password: '',
    consultation_fee: '1000',
    chamber_schedule: 'Sat - Thu: 5:00 PM - 9:00 PM'
  });

  // Synchronize initial configuration when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      if (authModalConfig?.role) {
        setActiveRole(authModalConfig.role);
      }
      if (authModalConfig?.mode) {
        setMode(authModalConfig.mode);
      } else if (authModalConfig?.role === 'doctor') {
        setMode('login'); // Default doctor to login for quick demo access
      }
      setError('');
      setSuccessMsg('');
    }
  }, [isAuthModalOpen, authModalConfig]);

  if (!isAuthModalOpen) return null;

  const handleDiseaseToggle = (diseaseName) => {
    setRegData(prev => {
      const currentList = Array.isArray(prev.chronic_diseases) ? prev.chronic_diseases : [];
      const exists = currentList.includes(diseaseName);
      if (exists) {
        return { ...prev, chronic_diseases: currentList.filter(d => d !== diseaseName) };
      } else {
        return { ...prev, chronic_diseases: [...currentList, diseaseName] };
      }
    });
  };

  const handleAddCustomDisease = (e) => {
    e.preventDefault();
    if (regData.customDisease.trim()) {
      const currentList = Array.isArray(regData.chronic_diseases) ? regData.chronic_diseases : [];
      if (!currentList.includes(regData.customDisease.trim())) {
        setRegData(prev => ({
          ...prev,
          chronic_diseases: [...currentList, prev.customDisease.trim()],
          customDisease: ''
        }));
      }
    }
  };

  // Login submit for both patient and doctor
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

  // Instant 1-click Demo Doctor Login
  const handleDemoDoctorLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login('doctor@nirvoy.ai', 'doctor123');
      setSuccessMsg(isBn ? 'ডা. মো. বেলায়েত হোসেন হিসেবে সফলভাবে লগইন হয়েছে!' : 'Logged in successfully as Demo Doctor (Dr. MD. Bellal Hossain)!');
      setTimeout(() => {
        closeAuthModal();
        setSuccessMsg('');
      }, 700);
    } catch (err) {
      setError(err.message || 'Demo doctor login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Patient registration submit
  const handlePatientRegisterSubmit = async (e) => {
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
        role: 'patient',
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

  // Doctor registration submit
  const handleDoctorRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!drData.name || !drData.email || !drData.password || !drData.bmdc_reg) {
      setError(isBn ? 'নাম, BMDC নম্বর, ইমেইল এবং পাসওয়ার্ড আবশ্যক।' : 'Name, BMDC Reg No., Email, and Password are required.');
      return;
    }

    setLoading(true);
    try {
      const drFormattedName = drData.name.startsWith('Dr.') || drData.name.startsWith('ডা.') 
        ? drData.name 
        : `Dr. ${drData.name}`;

      await register({
        name: drFormattedName,
        email: drData.email,
        password: drData.password,
        role: 'doctor',
        doctorProfile: {
          bmdc_reg: drData.bmdc_reg.trim(),
          specialty: drData.specialty,
          qualifications: drData.qualifications,
          hospital_chamber: drData.hospital_chamber,
          phone: drData.phone || drData.email,
          consultation_fee: drData.consultation_fee,
          chamber_schedule: drData.chamber_schedule
        }
      });

      setSuccessMsg(isBn ? 'চিকিৎসক প্রোফাইল সফলভাবে নিবন্ধন ও ডাটাবেজে সংরক্ষণ করা হয়েছে!' : 'Doctor profile registered and saved to database!');
      setTimeout(() => {
        closeAuthModal();
        setSuccessMsg('');
      }, 900);
    } catch (err) {
      setError(err.message || 'Doctor registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDoctor = activeRole === 'doctor';

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
        maxWidth: (mode === 'register' || isDoctor) ? '680px' : '440px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: isDoctor ? '2px solid #10b981' : '1px solid #e2e8f0',
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
          background: isDoctor
            ? 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: isDoctor 
                ? 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' 
                : 'linear-gradient(135deg, #0284c7 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: isDoctor ? '0 4px 12px rgba(5, 150, 105, 0.35)' : '0 4px 12px rgba(2, 132, 199, 0.3)'
            }}>
              {isDoctor ? <Stethoscope size={24} /> : <HeartPulse size={24} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  {isDoctor
                    ? (mode === 'register' 
                        ? (isBn ? 'চিকিৎসক নিবন্ধন পোর্টাল' : 'Doctor Registration Portal')
                        : (isBn ? 'চিকিৎসক পোর্টাল লগইন' : 'Doctor Portal Sign In'))
                    : (mode === 'register' 
                        ? (isBn ? 'রোগী নিবন্ধন ও স্বাস্থ্য প্রোফাইল' : 'Patient Registration & Health Profile')
                        : (isBn ? 'রোগী অ্যাকাউন্ট লগইন' : 'Patient Account Login'))}
                </h3>
                {isDoctor && (
                  <span style={{
                    background: '#dcfce7',
                    color: '#047857',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    border: '1px solid #86efac',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Award size={12} /> BMDC Verified
                  </span>
                )}
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                {isDoctor
                  ? (isBn ? 'ডিজিটাল প্রেসক্রিপশন প্যাড, ড্রাগ ইন্টারেকশন ও লাইভ ভয়েস কনসালটেশন' : 'Digital Prescription Pad, Interaction Shield & Live Consultation Voice Recorder')
                  : (mode === 'register'
                      ? (isBn ? 'ডাটাবেজে স্থায়ীভাবে আপনার তথ্য সংরক্ষণ করুন' : 'Save your medical records securely in Neon PostgreSQL')
                      : (isBn ? 'আপনার পূর্বের স্বাস্থ্য তথ্যে প্রবেশ করুন' : 'Access your saved medical profile & prescriptions'))}
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
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

        {/* PRIMARY ROLE SWITCHER (Patient vs Doctor) */}
        <div style={{ padding: '16px 24px 0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '14px',
            gap: '6px'
          }}>
            <button
              type="button"
              onClick={() => {
                setActiveRole('patient');
                setError('');
              }}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: !isDoctor ? '#ffffff' : 'transparent',
                color: !isDoctor ? '#0284c7' : '#64748b',
                fontWeight: !isDoctor ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: !isDoctor ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <User size={17} />
              <span>{isBn ? '👤 সাধারণ রোগী (Patient)' : '👤 Patient Account'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole('doctor');
                setError('');
              }}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isDoctor ? '#ffffff' : 'transparent',
                color: isDoctor ? '#059669' : '#64748b',
                fontWeight: isDoctor ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: isDoctor ? '0 2px 8px rgba(5, 150, 105, 0.15)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <Stethoscope size={17} />
              <span>{isBn ? '🩺 নিবন্ধিত চিকিৎসক (Doctor)' : '🩺 Doctor Portal'}</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle (Sign Up / Sign In) */}
        <div style={{ padding: '12px 24px 0' }}>
          <div style={{
            display: 'flex',
            background: '#f8fafc',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            gap: '4px'
          }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'login' ? (isDoctor ? '#059669' : '#0284c7') : 'transparent',
                color: mode === 'login' ? '#ffffff' : '#64748b',
                fontWeight: mode === 'login' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s'
              }}
            >
              <LogIn size={15} />
              {isDoctor 
                ? (isBn ? 'চিকিৎসক লগইন (Doctor Sign In)' : 'Doctor Sign In')
                : (isBn ? 'রোগী লগইন (Sign In)' : 'Patient Sign In')}
            </button>

            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'register' ? (isDoctor ? '#059669' : '#0284c7') : 'transparent',
                color: mode === 'register' ? '#ffffff' : '#64748b',
                fontWeight: mode === 'register' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s'
              }}
            >
              <UserPlus size={15} />
              {isDoctor 
                ? (isBn ? 'নতুন চিকিৎসক নিবন্ধন (Register Doctor)' : 'Register Doctor')
                : (isBn ? 'নতুন রোগী নিবন্ধন (Sign Up)' : 'New Patient (Sign Up)')}
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

        {/* ============================================================ */}
        {/* DOCTOR LOGIN / SIGN IN */}
        {/* ============================================================ */}
        {isDoctor && mode === 'login' && (
          <div style={{ padding: '16px 24px 24px' }}>
            {/* Quick 1-Click Demo Doctor Button */}
            <div style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              border: '1px solid #a7f3d0',
              borderRadius: '14px',
              padding: '14px',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>⚡</span>
                  <strong style={{ fontSize: '0.88rem', color: '#065f46' }}>
                    {isBn ? '১-ক্লিকে পরীক্ষামূলক চিকিৎসক লগইন' : 'Instant Demo Doctor Access'}
                  </strong>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#059669', color: 'white', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                  BMDC Verified
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#047857', margin: '0 0 10px' }}>
                {isBn 
                  ? 'দ্রুত মূল্যায়নের জন্য ডা. বেলায়েত হোসেন (BMDC-A-46050)-এর লাইভ প্রেফাইলে ১ ক্লিকেই প্রবেশ করুন।' 
                  : 'Instantly sign in as Dr. MD. Bellal Hossain (BMDC-A-46050) with full prescription and live recorder suite.'}
              </p>
              <button
                type="button"
                onClick={handleDemoDoctorLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#059669',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 10px rgba(5, 150, 105, 0.25)'
                }}
              >
                <Zap size={16} />
                <span>{loading ? (isBn ? 'লগইন হচ্ছে...' : 'Signing in...') : (isBn ? '🚀 ১-ক্লিকে ডেমো ডাক্তার হিসেবে লগইন' : '🚀 1-Click Demo Doctor Sign In')}</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                {isBn ? 'অথবা আপনার অ্যাকাউন্টে লগইন করুন' : 'Or sign in with doctor email/phone'}
              </span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                  {isBn ? 'চিকিৎসকের ইমেইল অথবা মোবাইল নম্বর' : 'Doctor Email or Phone'} *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    required
                    placeholder="doctor@nirvoy.ai"
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

              <div style={{ marginBottom: '18px' }}>
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
                  background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                }}
              >
                <LogIn size={18} />
                <span>{loading ? (isBn ? 'লগইন হচ্ছে...' : 'Signing in...') : (isBn ? 'ডাক্তার পোর্টালে প্রবেশ করুন' : 'Access Doctor Portal')}</span>
              </button>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* DOCTOR REGISTRATION */}
        {/* ============================================================ */}
        {isDoctor && mode === 'register' && (
          <form onSubmit={handleDoctorRegisterSubmit} style={{ padding: '16px 24px 24px' }}>
            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '14px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <span style={{ background: '#059669', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: '6px' }}>1</span>
                <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#0f172a', fontWeight: 700 }}>
                  {isBn ? 'চিকিৎসকের অফিসিয়াল পরিচিতি ও BMDC তথ্য' : 'Doctor Credentials & BMDC Info'}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'চিকিৎসকের পূর্ণ নাম' : 'Doctor Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isBn ? 'যেমন: ডা. মো. বেলায়েত হোসেন' : 'e.g. Dr. MD. Bellal Hossain'}
                    value={drData.name}
                    onChange={(e) => setDrData({ ...drData, name: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'BMDC রেজিস্ট্রেশন নম্বর' : 'BMDC Registration Number'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BMDC-A-46050"
                    value={drData.bmdc_reg}
                    onChange={(e) => setDrData({ ...drData, bmdc_reg: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', fontWeight: 700, color: '#047857' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'বিশেষজ্ঞতা (Specialty)' : 'Specialty / Field'} *
                  </label>
                  <select
                    value={drData.specialty}
                    onChange={(e) => setDrData({ ...drData, specialty: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', background: '#ffffff' }}
                  >
                    {DOCTOR_SPECIALTIES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'ডিগ্রি ও শিক্ষাগত যোগ্যতা' : 'Qualifications'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MBBS, BCS (Health), FCPS (Medicine)"
                    value={drData.qualifications}
                    onChange={(e) => setDrData({ ...drData, qualifications: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Hospital & Chamber Schedule */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '14px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <span style={{ background: '#059669', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: '6px' }}>2</span>
                <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#0f172a', fontWeight: 700 }}>
                  {isBn ? 'হাসপাতাল, চেম্বার ও কনসালটেশন শিডিউল' : 'Hospital, Chamber & Schedule'}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'বর্তমান হাসপাতাল / চেম্বার নাম' : 'Hospital / Chamber'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka Medical College Hospital / Popular"
                    value={drData.hospital_chamber}
                    onChange={(e) => setDrData({ ...drData, hospital_chamber: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'পরামর্শ ফি (টাকায়)' : 'Consultation Fee (BDT)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1000"
                    value={drData.consultation_fee}
                    onChange={(e) => setDrData({ ...drData, consultation_fee: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'রোগী দেখার সময়সূচী' : 'Chamber Schedule'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. শনিবার - বৃহস্পতিবার: বিকাল ৫:০০ - রাত ৯:০০"
                    value={drData.chamber_schedule}
                    onChange={(e) => setDrData({ ...drData, chamber_schedule: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Login Credentials */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <span style={{ background: '#059669', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: '6px' }}>3</span>
                <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#0f172a', fontWeight: 700 }}>
                  {isBn ? 'অ্যাকাউন্ট লগইন তথ্য' : 'Account Login Details'}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'মোবাইল নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    placeholder="017xxxxxxxx"
                    value={drData.phone}
                    onChange={(e) => setDrData({ ...drData, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'} *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="doctor@nirvoy.ai"
                    value={drData.email}
                    onChange={(e) => setDrData({ ...drData, email: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'গোপন পাসওয়ার্ড' : 'Password'} *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={drData.password}
                    onChange={(e) => setDrData({ ...drData, password: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
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
                <span>{isBn ? 'ডাটাবেজে সংরক্ষণ করা হচ্ছে...' : 'Saving Doctor Profile...'}</span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>{isBn ? 'চিকিৎসক নিবন্ধন সম্পন্ন ও ড্যাশবোর্ডে প্রবেশ করুন' : 'Complete Doctor Registration & Enter Portal'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ============================================================ */}
        {/* PATIENT LOGIN */}
        {/* ============================================================ */}
        {!isDoctor && mode === 'login' && (
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
                  <span>{isBn ? 'রোগী অ্যাকাউন্টে প্রবেশ করুন' : 'Sign In to Patient Account'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ============================================================ */}
        {/* PATIENT REGISTRATION & ONBOARDING */}
        {/* ============================================================ */}
        {!isDoctor && mode === 'register' && (
          <form onSubmit={handlePatientRegisterSubmit} style={{ padding: '20px 24px 24px' }}>
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
                      style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'ইমেইল অথবা মোবাইল নম্বর' : 'Email or Phone'} *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      required
                      placeholder={isBn ? 'patient@gmail.com বা 017xxxxxxxx' : 'patient@gmail.com or 017xxxxxxxx'}
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
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
                      style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Physical Vitals */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <span style={{ background: '#0284c7', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: '6px' }}>2</span>
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a', fontWeight: 700 }}>
                  {isBn ? 'শারীরিক পরিমাপ ও রক্ত গ্রুপ' : 'Physical Vitals & Blood Group'}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'বয়স (বছর)' : 'Age (Years)'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="number"
                      placeholder="35"
                      value={regData.age}
                      onChange={(e) => setRegData({ ...regData, age: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'লিঙ্গ' : 'Gender'}
                  </label>
                  <select
                    value={regData.gender}
                    onChange={(e) => setRegData({ ...regData, gender: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#ffffff' }}
                  >
                    <option value="Male">{isBn ? 'পুরুষ (Male)' : 'Male'}</option>
                    <option value="Female">{isBn ? 'নারী (Female)' : 'Female'}</option>
                    <option value="Other">{isBn ? 'অন্যান্য (Other)' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'উচ্চতা (ফুট ও ইঞ্চি)' : 'Height (Ft & In)'}
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <select
                      value={regData.heightFeet}
                      onChange={(e) => setRegData({ ...regData, heightFeet: e.target.value })}
                      style={{ flex: 1, padding: '8px 4px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#ffffff' }}
                    >
                      {[3, 4, 5, 6, 7].map(f => (
                        <option key={f} value={f}>{f} ft</option>
                      ))}
                    </select>
                    <select
                      value={regData.heightInches}
                      onChange={(e) => setRegData({ ...regData, heightInches: e.target.value })}
                      style={{ flex: 1, padding: '8px 4px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#ffffff' }}
                    >
                      {[...Array(12).keys()].map(i => (
                        <option key={i} value={i}>{i} in</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'ওজন (কেজি)' : 'Weight (kg)'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Weight size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="68"
                      value={regData.weight_kg}
                      onChange={(e) => setRegData({ ...regData, weight_kg: e.target.value })}
                      style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                    {isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}
                  </label>
                  <select
                    value={regData.blood_group}
                    onChange={(e) => setRegData({ ...regData, blood_group: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#ffffff', fontWeight: 700, color: '#be123c' }}
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Chronic Diseases Checklist */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ background: '#0284c7', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: '6px' }}>3</span>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a', fontWeight: 700 }}>
                    {isBn ? 'পূর্ববর্তী বা দীর্ঘমেয়াদী রোগসমূহ (সংশ্লিষ্টটিতে টিক দিন)' : 'Chronic Diseases & Existing Conditions'}
                  </h4>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                {COMMON_DISEASES.map(disease => {
                  const isSelected = regData.chronic_diseases.includes(disease.en);
                  return (
                    <button
                      key={disease.id}
                      type="button"
                      onClick={() => handleDiseaseToggle(disease.en)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: isSelected ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                        background: isSelected ? '#f0f9ff' : '#ffffff',
                        color: isSelected ? '#0369a1' : '#334155',
                        fontSize: '0.78rem',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{disease.icon}</span>
                        <span>{isBn ? disease.bn : disease.en}</span>
                      </span>
                      {isSelected && <CheckCircle2 size={14} color="#0284c7" />}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder={isBn ? 'অন্য কোনো রোগ থাকলে লিখুন...' : 'Other condition (e.g. Thyroid, Migraine)...'}
                  value={regData.customDisease}
                  onChange={(e) => setRegData({ ...regData, customDisease: e.target.value })}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem' }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomDisease}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#0284c7',
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

            {/* Step 4: Emergency Contact & Allergies */}
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
                  {isBn ? 'জরুরি যোগাযোগ নম্বর' : 'Emergency Contact Phone'}
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

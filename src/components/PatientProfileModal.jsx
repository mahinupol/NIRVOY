import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  HeartPulse, 
  Calendar, 
  Ruler, 
  Weight, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  LogOut,
  Database,
  Tag
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

export default function PatientProfileModal() {
  const { isProfileModalOpen, closeProfileModal, user, patientProfile, updateProfile, logout } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight_kg: '',
    gender: 'Male',
    blood_group: 'B+',
    chronic_diseases: [],
    customDisease: '',
    allergies: '',
    emergency_contact: ''
  });

  useEffect(() => {
    if (user || patientProfile) {
      const diseases = Array.isArray(patientProfile?.chronic_diseases) 
        ? patientProfile.chronic_diseases 
        : [];
      const allergiesStr = Array.isArray(patientProfile?.allergies)
        ? patientProfile.allergies.join(', ')
        : (typeof patientProfile?.allergies === 'string' ? patientProfile.allergies : '');

      setFormData({
        name: user?.name || '',
        age: patientProfile?.age || '',
        height: patientProfile?.height || '5 ft 6 in',
        weight_kg: patientProfile?.weight_kg || '',
        gender: patientProfile?.gender || 'Male',
        blood_group: patientProfile?.blood_group || 'B+',
        chronic_diseases: diseases,
        customDisease: '',
        allergies: allergiesStr,
        emergency_contact: patientProfile?.emergency_contact || ''
      });
    }
  }, [user, patientProfile, isProfileModalOpen]);

  if (!isProfileModalOpen || !user) return null;

  const handleDiseaseToggle = (diseaseName) => {
    setFormData(prev => {
      const currentList = Array.isArray(prev.chronic_diseases) ? prev.chronic_diseases : [];
      const exists = currentList.includes(diseaseName);
      if (exists) {
        return { ...prev, chronic_diseases: currentList.filter(d => d !== diseaseName) };
      } else {
        return { ...prev, chronic_diseases: [...currentList, diseaseName] };
      }
    });
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const currentList = Array.isArray(formData.chronic_diseases) ? formData.chronic_diseases : [];
    if (formData.customDisease.trim() && !currentList.includes(formData.customDisease.trim())) {
      setFormData(prev => ({
        ...prev,
        chronic_diseases: [...currentList, prev.customDisease.trim()],
        customDisease: ''
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const allergiesList = formData.allergies ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean) : [];
      await updateProfile({
        name: formData.name,
        age: formData.age ? parseInt(formData.age, 10) : null,
        height: formData.height,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        gender: formData.gender,
        blood_group: formData.blood_group,
        chronic_diseases: Array.isArray(formData.chronic_diseases) ? formData.chronic_diseases : [],
        allergies: allergiesList,
        emergency_contact: formData.emergency_contact
      });
      setSuccess(isBn ? 'ডাটাবেজে তথ্য সফলভাবে আপডেট হয়েছে!' : 'Health profile successfully updated in PostgreSQL!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
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
        maxWidth: '680px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 800
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {user?.name || 'Patient'}
                </h3>
                <span style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Database size={11} /> Neon DB Synced
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                {user?.email || ''} • {isBn ? 'রোগী প্রোফাইল ও মেডিকেল হিস্ট্রি' : 'Patient Health Profile'}
              </p>
            </div>
          </div>

          <button
            onClick={closeProfileModal}
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
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Feedback Messages */}
        <div style={{ padding: '0 24px' }}>
          {error && (
            <div style={{
              marginTop: '14px',
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
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              marginTop: '14px',
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
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: '20px 24px 24px' }}>
          
          {/* Vitals Grid */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '0.88rem', color: '#0f172a', fontWeight: 700 }}>
              {isBn ? 'শারীরিক পরিমাপ ও প্রাথমিক তথ্য' : 'Personal & Health Metrics'}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                  {isBn ? 'নাম (Full Name)' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                  {isBn ? 'বয়স (Age)' : 'Age (Years)'}
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                  {isBn ? 'উচ্চতা (Height)' : 'Height'}
                </label>
                <input
                  type="text"
                  placeholder="5 ft 8 in"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                  {isBn ? 'ওজন (Weight kg)' : 'Weight (kg)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.weight_kg}
                  onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                  {isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}
                </label>
                <select
                  value={formData.blood_group}
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                  {isBn ? 'লিঙ্গ (Gender)' : 'Gender'}
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Chronic Diseases Selection */}
          <div style={{
            background: '#fef3c7',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '16px',
            border: '1px solid #fde68a'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#92400e', fontWeight: 700 }}>
                {isBn ? 'বিদ্যমান রোগ ও শারীরিক অবস্থা (Medical Conditions)' : 'Known Medical Conditions'}
              </h4>
              <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 600 }}>
                {formData.chronic_diseases.length} {isBn ? 'টি নির্বাচিত' : 'selected'}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {COMMON_DISEASES.map(disease => {
                const isSelected = formData.chronic_diseases.includes(disease.en);
                return (
                  <button
                    key={disease.id}
                    type="button"
                    onClick={() => handleDiseaseToggle(disease.en)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isSelected ? `2px solid ${disease.color}` : '1px solid #e5e7eb',
                      background: isSelected ? `${disease.color}15` : '#ffffff',
                      color: isSelected ? disease.color : '#4b5563',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>{disease.icon}</span>
                    <span>{isBn ? disease.bn : disease.en}</span>
                    {isSelected && <CheckCircle2 size={13} style={{ strokeWidth: 3 }} />}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder={isBn ? 'অন্য কোনো রোগ যুক্ত করুন...' : 'Add other condition...'}
                value={formData.customDisease}
                onChange={(e) => setFormData({ ...formData, customDisease: e.target.value })}
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
                onClick={handleAddCustom}
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

          {/* Allergies & Emergency Contact */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '14px',
            padding: '14px 16px',
            marginBottom: '20px',
            border: '1px solid #e2e8f0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                {isBn ? 'ওষুধের অ্যালার্জি (Allergies)' : 'Drug Allergies'}
              </label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '3px' }}>
                {isBn ? 'জরুরি যোগাযোগ নম্বর' : 'Emergency Contact'}
              </label>
              <input
                type="text"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          {/* Buttons: Update Profile + Log Out */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => {
                logout();
                closeProfileModal();
              }}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid #fecaca',
                background: '#fef2f2',
                color: '#dc2626',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={16} />
              <span>{isBn ? 'লগআউট' : 'Log Out'}</span>
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={closeProfileModal}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0284c7 0%, #059669 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                }}
              >
                <ShieldCheck size={16} />
                <span>{loading ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'তথ্য আপডেট করুন' : 'Save Changes')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

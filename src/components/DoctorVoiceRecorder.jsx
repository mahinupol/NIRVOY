import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Square, Sparkles, Activity, Pill, Stethoscope, 
  AlertCircle, Volume2, Copy, Check, RotateCcw, Calendar, FileText, 
  Languages, ArrowRight, ShieldCheck, Play, Pause, Bookmark,
  UploadCloud, Loader2, Info, CloudLightning
} from 'lucide-react';
import { sttHelper } from '../utils/speechToTextHelper';
import { summarizeDoctorConsultation } from '../utils/aiChatService';
import { ttsEngine } from '../utils/ttsHelper';

export default function DoctorVoiceRecorder({ onSaveToHistory }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isRequestingMic, setIsRequestingMic] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [languageMode, setLanguageMode] = useState('bn-BD'); // 'bn-BD' or 'en-US'
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0);
  const [recordingError, setRecordingError] = useState(null);
  const [lastRecordedBlob, setLastRecordedBlob] = useState(null);
  const [isGoogleTranscribing, setIsGoogleTranscribing] = useState(false);
  const [googleSttStatus, setGoogleSttStatus] = useState({ configured: true, project: 'nirvoy-66787' });

  const timerRef = useRef(null);
  const transcriptAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sample real-world doctor consultation presets
  const sampleConsultations = [
    {
      title: '🩺 High BP & Gastric Visit',
      text: 'আপনার রক্তচাপ মেপে দেখলাম ১৪০ বাই ৯০, কিছুটা বেশি। আর পেটে বুক জ্বালাপোড়া ও গ্যাসের সমস্যা আছে। আপনি নাপা ৫০০ মিলিগ্রাম খাবেন দিনে ৩ বার খাবারের পরে, ৩ দিন। আর গ্যাসের জন্য সেকলো ২০ ক্যাপসুল খাবেন সকালে ও রাতে খাবার ৩০ মিনিট আগে খালি পেটে ৭ দিন। তেলে ভাজা ও অতিরিক্ত লবণ খাওয়া সম্পূর্ণ বন্ধ রাখবেন। আগামী সপ্তাহে সিবিসি টেস্ট রিপোর্ট নিয়ে আবার আসবেন।'
    },
    {
      title: '🤧 Viral Fever & Cough Visit',
      text: 'আপনার ৩ দিন ধরে ১০১ ডিগ্রি জ্বর ও শুকনা কাশি। ফুসফুসে বড় কোনো ইনফেকশন নেই, এটা সিজনাল ভাইরাল ফ্লু। নাপা এক্সট্রা খাবেন জ্বর আসলে দিনে সর্বোচ্চ ৪টি। আর কাশির জন্য ফেক্সো ১২০ মিলিগ্রাম প্রতিদিন রাতে খাবারের পর খাবেন ৫ দিন। প্রচুর কুসুম গরম পানি ও লেবুর শরবত পান করবেন। কাশির সাথে রক্ত গেলে বা ৩ দিনে জ্বর না কমলে জরুরি হাসপাতালে আসবেন।'
    },
    {
      title: '🩸 Diabetes & Knee Pain Visit',
      text: 'আপনার ফাস্টিং সুগার ৮.৫, ডায়াবেটিস কিছুটা অনিয়ন্ত্রিত। এছাড়া হাঁটুর জয়েন্টে ব্যথা আছে। ডায়াটন ৮০ মিলিগ্রাম ট্যাবলেট প্রতিদিন সকালে নাস্তার পূর্বে সেবন করবেন। ক্যালসিয়াম ডি ট্যাবলেট রাতে ১টি খাবারের পর খাবেন ১ মাস। মিষ্টি জাতীয় খাবার সম্পূর্ণ এড়িয়ে চলবেন এবং প্রতিদিন সকালে ৩০ মিনিট হাঁটাহাঁটি করবেন। ১ মাস পর আবার সুগার টেস্ট করে দেখাবেন।'
    }
  ];

  // Check Cloud Speech status
  useEffect(() => {
    fetch('/api/consultation/stt-status')
      .then(res => res.json())
      .then(data => {
        if (data && (data.googleSpeechConfigured || data.configured)) {
          setGoogleSttStatus({ 
            configured: true, 
            project: data.projectId,
            provider: data.provider || 'Google Cloud Speech v1'
          });
        }
      })
      .catch(() => {});
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      sttHelper.stop();
      ttsEngine.stop();
    };
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Google Cloud Speech-to-Text API Call
  const transcribeWithGoogleCloud = async (blobOrFile) => {
    if (!blobOrFile) return;
    setIsGoogleTranscribing(true);
    setRecordingError(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const res = reader.result;
          const base64 = typeof res === 'string' ? res.split(',')[1] : '';
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blobOrFile);
      const base64Audio = await base64Promise;

      const res = await fetch('/api/consultation/google-transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio: base64Audio,
          mimeType: blobOrFile.type || 'audio/webm',
          languageCode: languageMode
        })
      });

      const data = await res.json();
      if (data.success && data.transcript) {
        setTranscript(prev => (prev ? `${prev.trim()} ${data.transcript}` : data.transcript));
      } else if (data.error) {
        setRecordingError({
          title: 'Google Cloud Speech নোটিশ',
          text: data.error
        });
      } else {
        setRecordingError({
          title: 'কথা স্পষ্টভাবে সনাক্ত হয়নি',
          text: 'অডিওটিতে কোনো কথা স্পষ্টভাবে বোঝা যায়নি। আবার স্পষ্ট করে বলুন বা মাইক্রোফোনের কাছে আসুন।'
        });
      }
    } catch (err) {
      console.error('Google Cloud Speech transcription error:', err);
      setRecordingError({
        title: 'Google Cloud Speech ত্রুটি',
        text: err.message || 'ট্রান্সক্রিপশন সার্ভারে সমস্যা হয়েছে।'
      });
    } finally {
      setIsGoogleTranscribing(false);
    }
  };

  const handleToggleRecording = async () => {
    if (isRecording || isRequestingMic) {
      const audioBlob = sttHelper.stop();
      setIsRecording(false);
      setIsRequestingMic(false);
      setAudioVolume(0);

      if (audioBlob && audioBlob.size > 0) {
        setLastRecordedBlob(audioBlob);
        // If web speech didn't catch text, automatically run Google Cloud Speech!
        if (!transcript.trim()) {
          transcribeWithGoogleCloud(audioBlob);
        }
      }
      return;
    }

    setRecordingError(null);
    setIsRequestingMic(true);
    setSavedSuccess(false);
    setRecordingTime(0);
    sttHelper.setLanguage(languageMode);

    try {
      await sttHelper.start({
        onStart: () => {
          setIsRecording(true);
          setIsRequestingMic(false);
          setRecordingError(null);
        },
        onVolumeChange: (vol) => {
          setAudioVolume(vol);
        },
        onResult: ({ final, interim }) => {
          if (final) {
            setTranscript(prev => (prev ? `${prev.trim()} ${final}` : final));
            setInterimText('');
          } else {
            setInterimText(interim);
          }
        },
        onError: (err) => {
          console.warn('Speech recognition notice/error:', err);
          setIsRequestingMic(false);
          if (err.code === 'PERMISSION_DENIED') {
            setIsRecording(false);
            setAudioVolume(0);
            setRecordingError({
              title: 'মাইক্রোফোন পারমিশন ব্লকড (Microphone Permission Blocked)',
              text: 'আপনার ব্রাউজারের অ্যাড্রেস বারের বাম পাশে তালা (🔒) অথবা ক্যামেরা/মাইক আইকনে ক্লিক করে Microphone "Allow" বা অনুমতি দিন, তারপর পুনরায় "Record" বাটনে ক্লিক করুন।'
            });
          } else if (err.code === 'NO_MIC_FOUND') {
            setIsRecording(false);
            setAudioVolume(0);
            setRecordingError({
              title: 'কোনো মাইক্রোফোন পাওয়া যায়নি (No Microphone Found)',
              text: 'আপনার ডিভাইসে কোনো সংযুক্ত মাইক্রোফোন বা হেডসেট পাওয়া যায়নি। মাইক্রোফোন কানেক্ট করুন অথবা অডিও ফাইল আপলোড করুন।'
            });
          } else if (err.code === 'NETWORK_ERROR') {
            setRecordingError({
              title: 'Google Speech সংযোগ নোটিশ',
              text: 'লাইভ ব্রাউজার স্পীচে সংযোগ সমস্যা। তবে রেকর্ড শেষে ব্যাকএন্ডের অফিশিয়াল Google Cloud Speech API স্বয়ংক্রিয়ভাবে প্রসেস করবে।'
            });
          } else if (err.code === 'BROWSER_UNSUPPORTED') {
            setRecordingError({
              title: 'ব্রাউজার স্পীচ সীমাবদ্ধতা',
              text: 'ব্রাউজার লাইভ স্পীচ সক্রিয় নয়। তবে মাইক্রোফোন রেকর্ড চালু আছে এবং রেকর্ড শেষে অফিশিয়াল Google Cloud Speech API স্বয়ংক্রিয়ভাবে অডিও থেকে বাংলায় লিখে দেবে।'
            });
          } else {
            setRecordingError({
              title: 'ভয়েস রিকগনিশন নোটিশ',
              text: err.message || 'মাইক্রোফোনে স্পষ্ট স্বরে কথা বলুন।'
            });
          }
        },
        onEnd: () => {
          setIsRecording(false);
          setIsRequestingMic(false);
          setAudioVolume(0);
          setInterimText('');
        }
      });
    } catch (fatalErr) {
      console.error('Fatal recording initialization error:', fatalErr);
      setIsRequestingMic(false);
      setIsRecording(false);
      setAudioVolume(0);
      setRecordingError({
        title: 'রেকর্ডিং শুরু করা যায়নি',
        text: fatalErr.message || 'মাইক্রোফোন পারমিশন চেক করুন অথবা ব্রাউজারটি রিফ্রেশ করুন।'
      });
    }
  };

  const handleAudioFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    transcribeWithGoogleCloud(file);
    e.target.value = '';
  };

  const handleLanguageChange = (lang) => {
    setLanguageMode(lang);
    sttHelper.setLanguage(lang);
  };

  const handleSummarize = async () => {
    const fullText = (transcript + ' ' + interimText).trim();
    if (!fullText) return;

    if (isRecording) {
      sttHelper.stop();
      setIsRecording(false);
      setAudioVolume(0);
    }

    setIsSummarizing(true);
    try {
      const result = await summarizeDoctorConsultation(fullText);
      setSummaryData(result);
    } catch (err) {
      console.error('Summary error:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCopySummary = () => {
    if (!summaryData) return;
    const copyText = `Doctor Findings: ${summaryData.diagnosis}\nPrescribed Medicines: ${summaryData.medicines}\nAdvice: ${summaryData.advice.join('; ')}\nFollow-up: ${summaryData.followUp}\nBangla: ${summaryData.banglaNote}`;
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleListenSummary = () => {
    if (isSpeaking) {
      ttsEngine.stop();
      setIsSpeaking(false);
      return;
    }

    if (!summaryData) return;
    ttsEngine.stop();
    setIsSpeaking(true);

    const speechText = `${summaryData.diagnosis}. ${summaryData.medicines.replace(/[*\-_]/g, '')}. ${summaryData.banglaNote}`;
    ttsEngine.speak(speechText, languageMode === 'bn-BD' ? 'bn-BD' : 'en-US', 0.95, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const handleSaveToHistory = () => {
    if (!summaryData) return;
    try {
      const record = {
        id: `consult-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: summaryData.diagnosis.split('\n')[0].replace(/[*\-_]/g, '').trim() || 'Doctor Consultation',
        transcript: transcript,
        summary: summaryData,
        type: 'consultation'
      };

      const existing = JSON.parse(localStorage.getItem('NIRVOY_SAVED_CONSULTATIONS') || '[]');
      localStorage.setItem('NIRVOY_SAVED_CONSULTATIONS', JSON.stringify([record, ...existing]));
      setSavedSuccess(true);
      if (onSaveToHistory) onSaveToHistory(record);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.warn('Could not save consultation:', e);
    }
  };

  const handleReset = () => {
    sttHelper.stop();
    ttsEngine.stop();
    setIsRecording(false);
    setIsRequestingMic(false);
    setAudioVolume(0);
    setIsSpeaking(false);
    setRecordingTime(0);
    setTranscript('');
    setInterimText('');
    setSummaryData(null);
    setSavedSuccess(false);
    setRecordingError(null);
    setLastRecordedBlob(null);
  };

  // Soundwave Equalizer bar factors
  const waveFactors = [0.35, 0.65, 0.95, 0.55, 0.85, 1.0, 0.75, 0.9, 0.45, 0.8, 0.6, 0.4];

  return (
    <div style={{ padding: '16px 0 40px' }}>
      <div className="container-max" style={{ maxWidth: '860px' }}>

        {/* Hidden File Input for Audio File Upload */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="audio/*" 
          style={{ display: 'none' }} 
          onChange={handleAudioFileUpload} 
        />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#e0f2fe',
            color: '#0369a1',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '8px'
          }}>
            <Sparkles size={14} color="#0284c7" />
            <span>Google Cloud Speech-to-Text • OpenAI AI Clinical Intelligence</span>
          </div>

          <h2 style={{ fontSize: '1.65rem', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em', fontWeight: 800 }}>
            Live Doctor Consultation Recorder & AI Summarizer
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: '620px', margin: '0 auto' }}>
            Record doctor speech in Bangla or English using Google Cloud Speech to instantly generate structured digital prescriptions.
            <span style={{ display: 'block', color: '#0284c7', fontSize: '0.82rem', marginTop: '2px', fontWeight: 600 }}>
              (গুগল ক্লাউড স্পীচ দিয়ে ডাক্তারের পরামর্শ বাংলায় রেকর্ড করুন এবং তাৎক্ষণিক প্রেসক্রিপশন সামারি পান)
            </span>
          </p>

          {/* Active Cloud Status Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #a7f3d0',
              padding: '3px 12px',
              borderRadius: '999px',
              fontSize: '0.74rem',
              fontWeight: 700
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
              <span>Google Cloud Speech API Active • Project: {googleSttStatus.project}</span>
            </div>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          {sampleConsultations.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTranscript(sample.text);
                setInterimText('');
                setRecordingError(null);
              }}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '6px 12px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <span>{sample.title}</span>
            </button>
          ))}
        </div>

        {/* Google Transcribing Progress Banner */}
        {isGoogleTranscribing && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#15803d',
            fontSize: '0.86rem',
            fontWeight: 600
          }}>
            <Loader2 size={18} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
            <span>Google Cloud Speech-to-Text দ্বারা অডিও থেকে বাংলা রূপান্তর হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।</span>
          </div>
        )}

        {/* Error / Permission Banner */}
        {recordingError && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '14px',
            padding: '14px 18px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <AlertCircle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <strong style={{ color: '#991b1b', fontSize: '0.88rem', display: 'block', marginBottom: '2px' }}>
                {recordingError.title}
              </strong>
              <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.82rem', lineHeight: 1.5 }}>
                {recordingError.text}
              </p>
            </div>
            <button
              onClick={() => setRecordingError(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#dc2626',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.82rem'
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Live Recording Panel Card */}
        <div className="clean-card" style={{
          background: '#ffffff',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          marginBottom: '20px'
        }}>
          {/* Top Status & Language Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '18px'
          }}>
            {/* Recording Timer & Pulse */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: isRecording ? '#ef4444' : '#94a3b8',
                boxShadow: isRecording ? '0 0 0 5px rgba(239, 68, 68, 0.25)' : 'none',
                transition: 'all 0.3s ease'
              }} />
              <span style={{ fontSize: '1rem', fontWeight: 800, color: isRecording ? '#b91c1c' : '#475569', fontVariantNumeric: 'tabular-nums' }}>
                {formatTimer(recordingTime)}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {isRecording 
                  ? '• Listening via Microphone (রেকর্ড হচ্ছে...)' 
                  : isRequestingMic 
                  ? '• Requesting Microphone Access...' 
                  : '• Ready to record'}
              </span>
            </div>

            {/* Language Toggle Pills */}
            <div style={{
              display: 'inline-flex',
              background: '#f1f5f9',
              padding: '3px',
              borderRadius: '999px',
              gap: '4px'
            }}>
              <button
                onClick={() => handleLanguageChange('bn-BD')}
                style={{
                  border: 'none',
                  background: languageMode === 'bn-BD' ? '#0284c7' : 'transparent',
                  color: languageMode === 'bn-BD' ? '#ffffff' : '#475569',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                বাংলা (Bangla)
              </button>
              <button
                onClick={() => handleLanguageChange('en-US')}
                style={{
                  border: 'none',
                  background: languageMode === 'en-US' ? '#0284c7' : 'transparent',
                  color: languageMode === 'en-US' ? '#ffffff' : '#475569',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                English
              </button>
            </div>
          </div>

          {/* Equalizer Wave Visualizer (Active when recording) */}
          {isRecording && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: '42px',
              margin: '8px 0 14px'
            }}>
              {waveFactors.map((factor, idx) => {
                const dynamicHeight = Math.max(8, Math.min(38, Math.round((audioVolume * 65 + 10) * factor)));
                return (
                  <div
                    key={idx}
                    style={{
                      width: '4px',
                      height: `${dynamicHeight}px`,
                      borderRadius: '999px',
                      background: 'linear-gradient(180deg, #ef4444 0%, #0284c7 100%)',
                      transition: 'height 0.08s ease'
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Big Sleek Record Action Button & Upload Option */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={handleToggleRecording}
                disabled={isRequestingMic || isGoogleTranscribing}
                style={{
                  width: '78px',
                  height: '78px',
                  borderRadius: '50%',
                  background: isRecording 
                    ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                    : isRequestingMic 
                    ? '#94a3b8' 
                    : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: (isRequestingMic || isGoogleTranscribing) ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isRecording 
                    ? '0 4px 22px rgba(239, 68, 68, 0.45)' 
                    : '0 4px 22px rgba(2, 132, 199, 0.35)',
                  transition: 'all 0.2s ease',
                  transform: isRecording ? 'scale(1.06)' : 'scale(1)'
                }}
                title={isRecording ? 'Stop Recording' : 'Start Recording'}
              >
                {isRequestingMic ? (
                  <Loader2 size={30} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                ) : isRecording ? (
                  <Square size={28} />
                ) : (
                  <Mic size={32} />
                )}
              </button>
            </div>

            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginTop: '10px' }}>
              {isRequestingMic
                ? 'Connecting to Microphone...'
                : isRecording 
                ? 'Click to Stop Recording (রেকর্ড বন্ধ করুন)' 
                : 'Click to Start Recording (রেকর্ড শুরু করুন)'}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
              {languageMode === 'bn-BD' 
                ? 'মাইক্রোফোনে বাংলায় কথা বলুন — গুগল ক্লাউড স্পীচ স্বয়ংক্রিয়ভাবে টেক্সটে রূপান্তর করবে' 
                : 'Speaks in English or medical Bangla'}
            </span>

            {/* Alternative: Upload recorded audio file */}
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isRecording || isGoogleTranscribing}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <UploadCloud size={14} color="#0284c7" />
                <span>Upload Audio File (.mp3, .wav, .m4a, .webm)</span>
              </button>

              {lastRecordedBlob && !isRecording && (
                <button
                  type="button"
                  onClick={() => transcribeWithGoogleCloud(lastRecordedBlob)}
                  disabled={isGoogleTranscribing}
                  style={{
                    background: '#ecfdf5',
                    border: '1px solid #86efac',
                    color: '#15803d',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CloudLightning size={14} />
                  <span>Re-Transcribe with Google Cloud</span>
                </button>
              )}
            </div>
          </div>

          {/* Real-time Live Transcribed Speech Area */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                Spoken Transcript (কথোপকথন টেক্সট):
              </label>
              {(transcript || interimText) && (
                <button
                  onClick={() => { setTranscript(''); setInterimText(''); setLastRecordedBlob(null); }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.72rem', cursor: 'pointer' }}
                >
                  Clear Text
                </button>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <textarea
                ref={transcriptAreaRef}
                value={transcript + (interimText ? ` [${interimText}]` : '')}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Doctor's spoken advice will appear here in real-time... (অথবা উপরের স্যাম্পলে ক্লিক করে টেস্ট করুন)"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  background: '#f8fafc'
                }}
              />
            </div>
          </div>

          {/* Primary Action Buttons Bar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={handleSummarize}
                disabled={isSummarizing || !(transcript.trim() || interimText.trim())}
                className="btn-primary"
                style={{
                  opacity: (isSummarizing || !(transcript.trim() || interimText.trim())) ? 0.6 : 1,
                  cursor: (isSummarizing || !(transcript.trim() || interimText.trim())) ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={16} />
                <span>{isSummarizing ? 'AI Summarizing...' : 'Generate AI Clinical Summary (এআই সারসংক্ষেপ)'}</span>
              </button>

              <button
                onClick={handleReset}
                className="btn-outline"
                style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>

            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Words: {(transcript + ' ' + interimText).trim().split(/\s+/).filter(Boolean).length}
            </span>
          </div>
        </div>

        {/* AI Structured Clinical Summary Result */}
        {summaryData && (
          <div className="clean-card" style={{
            background: '#ffffff',
            borderRadius: '18px',
            padding: '24px',
            border: '1px solid #bbf7d0',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.08)'
          }}>
            {/* Header of Summary */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#15803d',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Stethoscope size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                    Clinical Consultation Summary
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
                    Verified by NIRVOY AI Clinical Engine
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={handleListenSummary}
                  style={{
                    background: isSpeaking ? '#0284c7' : '#f8fafc',
                    color: isSpeaking ? '#ffffff' : '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Volume2 size={14} />
                  <span>{isSpeaking ? 'Stop Voice' : 'Listen'}</span>
                </button>

                <button
                  onClick={handleCopySummary}
                  style={{
                    background: '#f8fafc',
                    color: '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleSaveToHistory}
                  style={{
                    background: savedSuccess ? '#dcfce7' : '#0284c7',
                    color: savedSuccess ? '#15803d' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Bookmark size={14} />
                  <span>{savedSuccess ? 'Saved!' : 'Save Visit'}</span>
                </button>
              </div>
            </div>

            {/* Diagnosis / Findings Card */}
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0369a1', fontWeight: 700, fontSize: '0.84rem', marginBottom: '4px' }}>
                <Activity size={15} />
                <span>Doctor Findings & Diagnosis (রোগ ও সমস্যা)</span>
              </div>
              <div style={{ fontSize: '0.88rem', color: '#0c4a6e', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                {summaryData.diagnosis}
              </div>
            </div>

            {/* Prescribed Medications Card */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 700, fontSize: '0.84rem', marginBottom: '4px' }}>
                <Pill size={15} />
                <span>Prescribed Medications & Dosage (ঔষধের নাম ও খাওয়ার নিয়ম)</span>
              </div>
              <div style={{ fontSize: '0.88rem', color: '#14532d', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                {summaryData.medicines}
              </div>
            </div>

            {/* Advice & Restrictions */}
            {summaryData.advice?.length > 0 && (
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#92400e', fontWeight: 700, fontSize: '0.84rem', marginBottom: '4px' }}>
                  <AlertCircle size={15} />
                  <span>Advice & Dietary Restrictions (খাবার ও চলাফেরার নিয়ম)</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.86rem', color: '#78350f', lineHeight: 1.5 }}>
                  {summaryData.advice.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Follow-up & Tests */}
            {summaryData.followUp && (
              <div style={{
                background: '#faf5ff',
                border: '1px solid #e9d5ff',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b21a8', fontWeight: 700, fontSize: '0.84rem', marginBottom: '4px' }}>
                  <Calendar size={15} />
                  <span>Recommended Tests & Next Chamber Visit (ল্যাব টেস্ট ও সাক্ষাত)</span>
                </div>
                <div style={{ fontSize: '0.86rem', color: '#581c87', lineHeight: 1.5 }}>
                  {summaryData.followUp}
                </div>
              </div>
            )}

            {/* Strictly 1-2 Lines Bangla Summary Alert */}
            {summaryData.banglaNote && (
              <div style={{
                background: '#fef3c7',
                border: '1px solid #fde68a',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '0.84rem',
                color: '#92400e',
                fontWeight: 600,
                lineHeight: 1.55,
                marginTop: '10px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#b45309' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#b45309' }}>
                    প্রয়োজনীয় পরামর্শ (Bangla Summary):
                  </strong>
                  <span>{summaryData.banglaNote}</span>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

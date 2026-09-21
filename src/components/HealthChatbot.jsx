import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Sparkles, Activity, Pill, Stethoscope, 
  AlertCircle, Volume2, Copy, Check, RotateCcw, ShieldCheck 
} from 'lucide-react';
import { askNirvoyHealthAI } from '../utils/aiChatService';
import { ttsEngine } from '../utils/ttsHelper';

export default function HealthChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      isGreeting: true,
      text: 'Hello! I am NIRVOY AI Clinical Assistant. Describe your symptoms to identify the condition and predict the most suitable medicine.\n\n(আপনার শারীরিক সমস্যা বা লক্ষণ জানান, আমি সম্ভাব্য রোগ ও প্রয়োজনীয় ওষুধের পরামর্শ দিব।)'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickSymptoms = [
    { label: '🤒 Fever & Chills', query: 'I have fever with body ache and mild shivering for 2 days.' },
    { label: '🫄 Gastric & Acidity', query: 'Severe burning sensation in chest and sour stomach acidity.' },
    { label: '🤧 Dry Cough & Cold', query: 'Continuous dry cough, runny nose and throat irritation.' },
    { label: '⚡ Severe Headache', query: 'Throbbing headache and dizziness since this morning.' },
    { label: '🌸 Skin Allergy / Itch', query: 'Red itchy skin rash and allergic irritation on arms.' },
    { label: '💧 Loose Motion / Diarrhea', query: 'Watery loose stool with abdominal cramps and dehydration.' }
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsgId = Date.now();
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: text.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const parsedData = await askNirvoyHealthAI(text, messages);

      const botMsgId = Date.now() + 1;
      const botMsg = {
        id: botMsgId,
        sender: 'bot',
        structured: parsedData,
        text: parsedData.raw || `${parsedData.condition}\n${parsedData.medicine}\n${parsedData.banglaNote}`
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat AI query error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Temporary network interruption. Please try again or consult a registered doctor.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (msg) => {
    const content = msg.structured 
      ? `Condition: ${msg.structured.condition}\nMedicine: ${msg.structured.medicine}\nAdvice: ${msg.structured.advice.join('; ')}\nBangla: ${msg.structured.banglaNote}`
      : msg.text;
    navigator.clipboard.writeText(content);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (msg) => {
    if (speakingId === msg.id) {
      ttsEngine.stop();
      setSpeakingId(null);
      return;
    }

    ttsEngine.stop();
    setSpeakingId(msg.id);

    let textToRead = '';
    if (msg.structured) {
      textToRead = `Identified condition: ${msg.structured.condition}. Predicted medicine: ${msg.structured.medicine.replace(/[*\-_]/g, '')}. ${msg.structured.banglaNote}`;
    } else {
      textToRead = msg.text;
    }

    ttsEngine.speak(textToRead, 'en-US', 0.95, {
      onEnd: () => setSpeakingId(null),
      onError: () => setSpeakingId(null)
    });
  };

  const handleClear = () => {
    ttsEngine.stop();
    setSpeakingId(null);
    setMessages([
      {
        id: 1,
        sender: 'bot',
        isGreeting: true,
        text: 'Hello! I am NIRVOY AI Clinical Assistant. Describe your symptoms to identify the condition and predict the most suitable medicine.\n\n(আপনার শারীরিক সমস্যা বা লক্ষণ জানান, আমি সম্ভাব্য রোগ ও প্রয়োজনীয় ওষুধের পরামর্শ দিব।)'
      }
    ]);
  };

  return (
    <div style={{ padding: '16px 0 40px' }}>
      <div className="container-max" style={{ maxWidth: '860px' }}>
        
        {/* Minimalist Header */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
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
            marginBottom: '8px'
          }}>
            <Sparkles size={14} color="#0284c7" />
            <span>OpenAI gpt-5.6-luna • Disease & Medicine Predictor</span>
          </div>
          
          <h2 style={{ fontSize: '1.65rem', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em', fontWeight: 800 }}>
            AI Health & Medicine Predictor
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: '580px', margin: '0 auto' }}>
            Describe your symptoms to detect condition & predict suitable Bangladeshi medicine.
            <span style={{ display: 'block', color: '#0284c7', fontSize: '0.82rem', marginTop: '2px', fontWeight: 600 }}>
              (লক্ষণ বলুন, সম্ভাব্য রোগ, সঠিক ঔষধ ও প্রয়োজনীয় পরামর্শ জানুন)
            </span>
          </p>
        </div>

        {/* Minimal Quick Symptom Buttons */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          {quickSymptoms.map((qs, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qs.query)}
              disabled={isLoading}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#334155',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0284c7';
                e.currentTarget.style.background = '#f0f9ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.background = '#ffffff';
              }}
            >
              <span>{qs.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Container */}
        <div className="clean-card" style={{
          background: '#ffffff',
          borderRadius: '18px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '580px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
        }}>
          {/* Header Bar */}
          <div style={{
            padding: '12px 18px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={16} />
              </div>
              <div>
                <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block', lineHeight: 1.2 }}>
                  NIRVOY Assistant
                </strong>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                  ● Active (gpt-5.6-luna)
                </span>
              </div>
            </div>

            <button
              onClick={handleClear}
              title="Clear conversation"
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '0.75rem',
                color: '#64748b',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 600
              }}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div style={{
            flex: 1,
            padding: '18px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            background: '#f8fafc'
          }}>
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    alignSelf: isBot ? 'flex-start' : 'flex-end',
                    maxWidth: isBot ? '92%' : '80%'
                  }}
                >
                  {isBot && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#0284c7',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <Stethoscope size={16} />
                    </div>
                  )}

                  <div style={{ flex: 1 }}>
                    {/* Bot Structured Diagnosis Card */}
                    {isBot && msg.structured ? (
                      <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                      }}>
                        {/* Condition Badge */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#e0f2fe',
                          color: '#0369a1',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          marginBottom: '10px'
                        }}>
                          <Activity size={15} />
                          <span>Identified: {msg.structured.condition}</span>
                        </div>

                        {/* Medicine Prediction Card */}
                        <div style={{
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          marginBottom: '12px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 700, fontSize: '0.84rem', marginBottom: '4px' }}>
                            <Pill size={15} />
                            <span>Predicted Suitable Medicine</span>
                          </div>
                          <div style={{ fontSize: '0.88rem', color: '#14532d', whiteSpace: 'pre-line', lineHeight: 1.45 }}>
                            {msg.structured.medicine}
                          </div>
                        </div>

                        {/* Clinical Advice List */}
                        {msg.structured.advice?.length > 0 && (
                          <div style={{ marginBottom: '10px' }}>
                            <strong style={{ fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
                              Clinical Advice (পরামর্শ):
                            </strong>
                            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
                              {msg.structured.advice.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 1-2 Lines of Bangla Guidance */}
                        {msg.structured.banglaNote && (
                          <div style={{
                            background: '#fef3c7',
                            border: '1px solid #fde68a',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '0.82rem',
                            color: '#92400e',
                            fontWeight: 600,
                            lineHeight: 1.5,
                            marginTop: '10px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '6px'
                          }}>
                            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{msg.structured.banglaNote}</span>
                          </div>
                        )}

                        {/* Card Action Buttons */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '12px',
                          paddingTop: '8px',
                          borderTop: '1px solid #f1f5f9'
                        }}>
                          <button
                            onClick={() => handleSpeak(msg)}
                            style={{
                              background: speakingId === msg.id ? '#0284c7' : '#f8fafc',
                              color: speakingId === msg.id ? '#ffffff' : '#475569',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '4px 10px',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Volume2 size={13} />
                            <span>{speakingId === msg.id ? 'Stop Voice' : 'Listen'}</span>
                          </button>

                          <button
                            onClick={() => handleCopy(msg)}
                            style={{
                              background: '#f8fafc',
                              color: '#475569',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '4px 10px',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {copiedId === msg.id ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Standard Text Bubble */
                      <div style={{
                        background: isBot ? '#ffffff' : '#0284c7',
                        color: isBot ? '#1e293b' : '#ffffff',
                        padding: '12px 16px',
                        borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                        fontSize: '0.88rem',
                        lineHeight: 1.5,
                        border: isBot ? '1px solid #e2e8f0' : 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        whiteSpace: 'pre-line'
                      }}>
                        {msg.text}
                      </div>
                    )}
                  </div>

                  {!isBot && (
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#334155',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <User size={15} />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontSize: '0.82rem', padding: '8px 12px' }}>
                <Activity size={16} className="pulse-icon" />
                <span>AI is analyzing symptoms & predicting medicine (gpt-5.6-luna)...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Minimalist Input Bar */}
          <div style={{
            padding: '12px 16px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe symptoms (e.g. fever for 2 days, gastric acidity)..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '11px 16px',
                borderRadius: '999px',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none',
                background: '#ffffff'
              }}
            />

            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputText.trim()}
              className="btn-primary"
              style={{
                padding: '10px 20px',
                opacity: (isLoading || !inputText.trim()) ? 0.6 : 1,
                cursor: (isLoading || !inputText.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              <Send size={15} />
              <span>Predict</span>
            </button>
          </div>
        </div>

        {/* Minimal Disclaimer (Strictly 1-2 lines) */}
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <p style={{ fontSize: '0.76rem', color: '#64748b' }}>
            NIRVOY AI suggestions are for informational purposes. Consult a registered physician before taking medication.
            <span style={{ display: 'block', color: '#94a3b8' }}>
              (জরুরি পরিস্থিতিতে অবিলম্বে নিকটস্থ হাসপাতাল অথবা রেজিস্টার্ড ডাক্তারের সাথে যোগাযোগ করুন।)
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}

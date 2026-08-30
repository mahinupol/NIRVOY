import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, HeartPulse, HelpCircle, CornerDownLeft } from 'lucide-react';
import { BANGLADESHI_MEDICINES } from '../data/medicinesData';

export default function HealthChatbot({ lang }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      textBn: 'আসসালামু আলাইকুম! আমি নির্ভয় AI হেলথ অ্যাসিস্ট্যান্ট। প্রেসক্রিপশন, ঔষধের নিয়মাবলী, পার্শ্বপ্রতিক্রিয়া বা স্বাস্থ্য বিষয়ক যেকোনো প্রশ্ন করতে পারেন।',
      textEn: 'Hello! I am Nirvoy AI Health Assistant. Ask me anything about your prescription, Bangladeshi medicines, dosage instructions, or side-effects.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    { labelBn: '💊 নাপা এক্সট্রা কখন খাওয়া উচিত?', labelEn: 'When to take Napa Extra?', query: 'নাপা এক্সট্রা কখন খাওয়া উচিত?' },
    { labelBn: '🥛 সেকলো ২০ কি খালি পেটে খেতে হয়?', labelEn: 'Should Seclo 20 be taken empty stomach?', query: 'সেকলো ২০ কি খালি পেটে খেতে হয়?' },
    { labelBn: '⚠️ এন্টিবায়োটিকের কোর্স মাঝপথে বন্ধ করা যায়?', labelEn: 'Can I stop antibiotics midway?', query: 'এন্টিবায়োটিকের কোর্স মাঝপথে বন্ধ করা যায়?' },
    { labelBn: '🛡️ নকল ঔষধ চেনার উপায় কি?', labelEn: 'How to identify fake medicine?', query: 'নকল ঔষধ চেনার উপায় কি?' }
  ];

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      textBn: text,
      textEn: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // AI response simulation
    setTimeout(() => {
      let botResponseBn = '';
      let botResponseEn = '';
      const lower = text.toLowerCase();

      if (lower.includes('নাপা') || lower.includes('napa') || lower.includes('fever') || lower.includes('জ্বর')) {
        botResponseBn = 'নাপা এক্সট্রা (প্যারাসিটামল ৫০০ মি.গ্রা. + ক্যাফেইন ৬৫ মি.গ্রা.) সাধারণত তীব্র জ্বর এবং শরীর বা মাথাব্যথা উপশমে খাওয়া হয়। এটি সবসময় খাবারের পরে পর্যাপ্ত পানি দিয়ে খাবেন। ২৪ ঘণ্টায় ৪ টির বেশি ট্যাবলেট খাওয়া উচিত নয়।';
        botResponseEn = 'Napa Extra is taken for fever and pain relief. Always take after meals with plenty of water. Do not exceed 4 tablets in 24 hours.';
      } else if (lower.includes('সেকলো') || lower.includes('seclo') || lower.includes('গ্যাস') || lower.includes('gastric') || lower.includes('maxpro')) {
        botResponseBn = 'সেকলো ২০ বা ম্যাক্সপ্রো (ওমিপ্রাজল/ইসোমিপ্রাজল) গ্যাস্ট্রিক ও বুক জ্বালাপোড়া নিয়ন্ত্রণে কাজ করে। এটি সবচেয়ে ভালো কাজ করে সকাল বা রাতে প্রধান খাবার গ্রহণের ২০-৩০ মিনিট পূর্বে খালি পেটে সেবন করলে।';
        botResponseEn = 'Seclo 20 / Maxpro works best when taken 20-30 minutes before meals on an empty stomach.';
      } else if (lower.includes('এন্টিবায়োটিক') || lower.includes('antibiotic') || lower.includes('কোর্স')) {
        botResponseBn = 'কখনই চিকিৎসকের পরামর্শ ছাড়া এন্টিবায়োটিকের কোর্স মাঝপথে বন্ধ করবেন না। উপসর্গ কমে গেলেও পুরো কোর্স শেষ করা বাধ্যতামূলক, অন্যথায় ব্যাকটেরিয়া ওষুধ-প্রতিরোধী (Antibiotic Resistance) হয়ে উঠতে পারে।';
        botResponseEn = 'Never stop antibiotic courses prematurely, even if symptoms subside, to prevent antimicrobial resistance.';
      } else if (lower.includes('নকল') || lower.includes('fake') || lower.includes('dgda')) {
        botResponseBn = 'নকল ঔষধ শনাক্ত করতে প্যাকেটের ডিজিডিএ (DGDA) রেজিস্ট্রেশন নম্বর, কিউআর কোড এবং প্রস্তুতকারকের আসল সিকিউরিটি হলোগ্রাম সিল পরীক্ষা করুন। নির্ভয়ের "নকল ঔষধ যাচাই" ট্যাবে বারকোড দিয়ে যাচাই করতে পারেন।';
        botResponseEn = 'To identify counterfeit medicine, check the DGDA registration DAR number, barcode, and manufacturer security hologram seal.';
      } else {
        botResponseBn = `আপনার প্রশ্নের জন্য ধন্যবাদ। প্রেসক্রিপশন অনুযায়ী ওষুধ নিয়মিত সেবন করুন। যেকোনো জটিল শারীরিক অসুস্থতায় দ্রুত বিশেষজ্ঞ চিকিৎসকের শরণাপন্ন হওয়া জরুরি। নির্ভয় আপনার পাশে রয়েছে।`;
        botResponseEn = `Thank you for asking. Please strictly adhere to your prescribed regimen. Consult a certified physician for specialized clinical advice.`;
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        textBn: botResponseBn,
        textEn: botResponseEn
      }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div style={{ padding: '10px 0 40px' }}>
      <div className="container-custom" style={{ maxWidth: '840px' }}>
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f3e8ff',
            color: '#7e22ce',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            AI HEALTHCARE CHATBOT • NIRVOY ASSISTANT
          </div>
          <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '8px' }}>
            {lang === 'bn' ? 'বাংলা এআই হেলথ ও প্রেসক্রিপশন সহকারী' : 'AI Health & Medication Assistant'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            {lang === 'bn' ? 'ঔষধের পার্শ্বপ্রতিক্রিয়া, খাওয়ার সঠিক নিয়ম ও সতর্কতা সম্পর্কে জানুন।' : 'Ask questions about medicine dosages, food interactions, and precautions.'}
          </p>
        </div>

        {/* Quick Suggestion Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px', justifyContent: 'center' }}>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.query)}
              style={{
                background: 'white',
                border: '1.5px solid #cbd5e1',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {lang === 'bn' ? q.labelBn : q.labelEn}
            </button>
          ))}
        </div>

        {/* Chat Card Box */}
        <div className="playful-card" style={{
          background: 'white',
          borderRadius: '24px',
          border: '1.5px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '460px',
          boxShadow: '0 12px 36px rgba(15, 23, 42, 0.06)'
        }}>
          {/* Chat Messages Container */}
          <div style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: '#f8fafc'
          }}>
            {messages.map(msg => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    alignSelf: isBot ? 'flex-start' : 'flex-end',
                    maxWidth: '85%'
                  }}
                >
                  {isBot && (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Bot size={20} />
                    </div>
                  )}

                  <div style={{
                    background: isBot ? 'white' : '#0ea5e9',
                    color: isBot ? '#1e293b' : 'white',
                    padding: '14px 18px',
                    borderRadius: isBot ? '4px 20px 20px 20px' : '20px 4px 20px 20px',
                    fontSize: '0.92rem',
                    lineHeight: 1.5,
                    border: isBot ? '1.5px solid #e2e8f0' : 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    {lang === 'bn' ? msg.textBn : msg.textEn}
                  </div>

                  {!isBot && (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#334155',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <User size={18} />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                <Bot size={18} color="#0ea5e9" />
                <span>নির্ভয় টাইপ করছে...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div style={{
            padding: '16px 20px',
            background: 'white',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={lang === 'bn' ? 'প্রেসক্রিপশন বা ওষুধ সম্পর্কে জিজ্ঞাসা করুন...' : 'Type health question...'}
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '999px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.92rem',
                outline: 'none'
              }}
            />

            <button
              onClick={() => handleSendMessage()}
              className="playful-btn playful-btn-primary"
              style={{ padding: '12px 20px' }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

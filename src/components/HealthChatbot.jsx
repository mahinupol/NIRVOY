import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function HealthChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'আসসালামু আলাইকুম! আমি নির্ভয় AI হেলথ অ্যাসিস্ট্যান্ট। প্রেসক্রিপশন, ঔষধের নিয়মাবলী, পার্শ্বপ্রতিক্রিয়া বা স্বাস্থ্য বিষয়ক যেকোনো প্রশ্ন করতে পারেন।'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    { label: '💊 নাপা এক্সট্রা কখন খাওয়া উচিত?', query: 'নাপা এক্সট্রা কখন খাওয়া উচিত?' },
    { label: '🥛 সেকলো ২০ কি খালি পেটে খেতে হয়?', query: 'সেকলো ২০ কি খালি পেটে খেতে হয়?' },
    { label: '⚠️ এন্টিবায়োটিকের কোর্স মাঝপথে বন্ধ করা যায়?', query: 'এন্টিবায়োটিকের কোর্স মাঝপথে বন্ধ করা যায়?' },
    { label: '🛡️ নকল ঔষধ চেনার উপায় কি?', query: 'নকল ঔষধ চেনার উপায় কি?' }
  ];

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      const lower = text.toLowerCase();

      if (lower.includes('নাপা') || lower.includes('napa') || lower.includes('fever') || lower.includes('জ্বর')) {
        botResponse = 'নাপা এক্সট্রা (Paracetamol 500mg + Caffeine 65mg) তীব্র জ্বর এবং মাথাব্যথা বা শরীর ব্যথায় নির্দেশিত। এটি সবসময় খাবারের পর পর্যাপ্ত পানি দিয়ে সেবন করবেন। দিনে ৪টির বেশি ট্যাবলেট খাবেন না।';
      } else if (lower.includes('সেকলো') || lower.includes('seclo') || lower.includes('গ্যাস') || lower.includes('gastric') || lower.includes('maxpro')) {
        botResponse = 'সেকলো ২০ বা ম্যাক্সপ্রো (Omeprazole / Esomeprazole) গ্যাস্ট্রিক ও বুক জ্বালাপোড়ায় নির্দেশিত। এটি সকাল বা রাতে খাবার গ্রহণের ২০-৩০ মিনিট পূর্বে খালি পেটে খেতে হয়।';
      } else if (lower.includes('এন্টিবায়োটিক') || lower.includes('antibiotic') || lower.includes('কোর্স')) {
        botResponse = 'এন্টিবায়োটিকের কোর্স কখনোই মাঝপথে বন্ধ করা উচিত নয়। লক্ষণ ভালো হয়ে গেলেও চিকিৎসক নির্দেশিত সম্পূর্ণ মেয়াদ (যেমন: ৫ বা ৭ দিন) শেষ করা বাধ্যতামূলক, অন্যথায় এন্টিবায়োটিক রেজিস্ট্যান্সের ঝুঁকি থাকে।';
      } else if (lower.includes('নকল') || lower.includes('fake') || lower.includes('dgda')) {
        botResponse = 'নকল ওষুধ শনাক্ত করতে প্যাকেটের ডিজিডিএ (DGDA) রেজিস্ট্রেশন DAR নম্বর ও প্রস্তুতকারক কোম্পানির সিকিউরিটি হলোগ্রাম সিল পরীক্ষা করুন। নির্ভয়ের "DGDA Verifier" ট্যাবে বারকোড দিয়ে যাচাই করতে পারেন।';
      } else {
        botResponse = 'আপনার প্রশ্নের জন্য ধন্যবাদ। প্রেসক্রিপশন অনুযায়ী সঠিক সময়ে নিয়মিত ওষুধ সেবন করুন। যেকোনো বিশেষ শারীরিক সমস্যায় একজন রেজিস্টার্ড চিকিৎসকের পরামর্শ নিন।';
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse
      }]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div style={{ padding: '8px 0 36px' }}>
      <div className="container-max" style={{ maxWidth: '800px' }}>
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#f3e8ff',
            color: '#7e22ce',
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '6px'
          }}>
            AI HEALTHCARE CHATBOT • NIRVOY ASSISTANT
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            AI Medication & Health Assistant (স্বাস্থ্য সহকারী)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            ওষুধের পার্শ্বপ্রতিক্রিয়া, খাওয়ার সঠিক নিয়ম ও স্বাস্থ্য বিষয়ক সাধারণ তথ্যের জন্য প্রশ্ন করুন।
          </p>
        </div>

        {/* Quick Question Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px', justifyContent: 'center' }}>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.query)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Chat Box */}
        <div className="clean-card" style={{
          background: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '420px'
        }}>
          {/* Chat Messages */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
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
                    gap: '10px',
                    alignSelf: isBot ? 'flex-start' : 'flex-end',
                    maxWidth: '85%'
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
                      flexShrink: 0
                    }}>
                      <Bot size={18} />
                    </div>
                  )}

                  <div style={{
                    background: isBot ? '#ffffff' : '#0284c7',
                    color: isBot ? '#1e293b' : '#ffffff',
                    padding: '10px 14px',
                    borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    border: isBot ? '1px solid #e2e8f0' : 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}>
                    {msg.text}
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
                      flexShrink: 0
                    }}>
                      <User size={16} />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem' }}>
                <Bot size={16} color="#0284c7" />
                <span>Nirvoy is typing...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
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
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a health question (যেমন: নাপা খাওয়ার নিয়ম কি?)..."
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '999px',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />

            <button
              onClick={() => handleSendMessage()}
              className="btn-primary"
              style={{ padding: '10px 18px' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

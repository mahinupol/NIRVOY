import React from 'react';
import { Award, Code2, Heart, Sparkles, Users, Cpu, Shield, Database, Stethoscope } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TeamShowcase({ lang }) {
  const teamMembers = [
    {
      name: "Mahin Hasan Upol",
      id: "0112230520",
      roleBn: "AI & ফুল-স্ট্যাক লিড ডেভেলপার",
      roleEn: "AI & Full-Stack Lead Developer",
      tag: "TrOCR & Bangla NLP Architect",
      icon: "⚡",
      color: "#0ea5e9"
    },
    {
      name: "Bijoy Sen",
      id: "0112230404",
      roleBn: "সফটওয়্যার ইঞ্জিনিয়ার ও সিস্টেম আর্কিটেক্ট",
      roleEn: "Software Engineer & System Architect",
      tag: "Backend & Database Lead",
      icon: "🚀",
      color: "#10b981"
    },
    {
      name: "Mst. Walina Tanjim",
      id: "0112230422",
      roleBn: "UI/UX ও স্পিচ সিন্থেসিস গবেষক",
      roleEn: "UI/UX & Speech Synthesis Researcher",
      tag: "Accessibility & Bangla TTS",
      icon: "🎨",
      color: "#ec4899"
    },
    {
      name: "MD. Mostafijur Rahman Joy",
      id: "0112231004",
      roleBn: "মেডিকেল ডাটাবেস ও সিকিউরিটি অ্যানালিস্ট",
      roleEn: "Medical Database & Security Analyst",
      tag: "DGDA Registry & Fake Drug AI",
      icon: "🛡️",
      color: "#f59e0b"
    },
    {
      name: "Shukla Ghosh",
      id: "0112230029",
      roleBn: "কোয়ালিটি অ্যাসুরেন্স ও হেলথকেয়ার কনসালট্যান্ট",
      roleEn: "QA & Healthcare Systems Consultant",
      tag: "OCR Evaluation & Field Testing",
      icon: "✨",
      color: "#8b5cf6"
    }
  ];

  const triggerTeamCheer = () => {
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  return (
    <div style={{ padding: '10px 0 40px' }}>
      <div className="container-custom">
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffedd5',
            color: '#c2410c',
            padding: '4px 16px',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            PROJECT ARCHITECTS • TEAM GOKU
          </div>
          <h2 style={{ fontSize: '2.2rem', color: '#0f172a', marginBottom: '8px' }}>
            {lang === 'bn' ? 'টিম পরিচিতি • টিম গোকু (Team_Goku)' : 'Meet The Creators • Team Goku'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '680px', margin: '0 auto' }}>
            {lang === 'bn' 
              ? 'বাংলাদেশের স্বাস্থ্যসেবাকে প্রযুক্তির মাধ্যমে সহজ ও নির্ভরযোগ্য করতে নিবেদিত টিম গোকু।'
              : 'Passionate innovators building NIRVOY to bridge healthcare barriers across Bangladesh.'}
          </p>
        </div>

        {/* Team Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '36px'
        }}>
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="playful-card"
              onClick={triggerTeamCheer}
              style={{
                padding: '28px 20px',
                background: 'white',
                borderRadius: '24px',
                border: '2px solid #f1f5f9',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: member.color
              }} />

              {/* Avatar Icon */}
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '22px',
                background: `${member.color}15`,
                color: member.color,
                fontSize: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: `2px solid ${member.color}40`,
                boxShadow: `0 8px 20px ${member.color}25`
              }}>
                {member.icon}
              </div>

              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: '0 0 4px' }}>
                {member.name}
              </h3>

              <div style={{
                display: 'inline-block',
                background: '#f1f5f9',
                color: '#475569',
                padding: '2px 10px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '10px'
              }}>
                ID: {member.id}
              </div>

              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: member.color, margin: '0 0 6px' }}>
                {lang === 'bn' ? member.roleBn : member.roleEn}
              </p>

              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontWeight: 600 }}>
                {member.tag}
              </p>
            </div>
          ))}
        </div>

        {/* Project Roadmap Banner (Week 1 to Week 6 Launch) from Slide 13 */}
        <div className="playful-card" style={{
          padding: '32px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
          borderRadius: '28px',
          border: '2px solid #bae6fd'
        }}>
          <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '20px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#0ea5e9" />
            <span>{lang === 'bn' ? 'নির্ভয় প্রজেক্ট রোডম্যাপ ও অগ্রগতি' : 'Nirvoy 6-Week Launch Roadmap'}</span>
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px'
          }}>
            {[
              { week: 'Week 1', title: 'Research & Datasets', status: 'Completed', color: '#0ea5e9' },
              { week: 'Week 2', title: 'OCR & TrOCR Engine', status: 'Completed', color: '#10b981' },
              { week: 'Week 3', title: 'Bangla NLP & TTS', status: 'Completed', color: '#0ea5e9' },
              { week: 'Week 4', title: 'Patient History Hub', status: 'Completed', color: '#10b981' },
              { week: 'Week 5', title: 'Doctor & Pharmacy', status: 'Completed', color: '#0ea5e9' },
              { week: 'Week 6', title: 'DGDA & Deployment', status: 'Completed', color: '#10b981' }
            ].map(step => (
              <div key={step.week} style={{
                background: 'white',
                padding: '16px',
                borderRadius: '16px',
                border: '1.5px solid #cbd5e1',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: step.color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  margin: '0 auto 8px'
                }}>
                  ✓
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: step.color }}>{step.week}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>{step.title}</div>
                <span style={{ fontSize: '0.68rem', background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, marginTop: '4px', display: 'inline-block' }}>
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

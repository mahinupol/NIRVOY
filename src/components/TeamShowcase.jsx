import React from 'react';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TeamShowcase() {
  const teamMembers = [
    {
      name: "Mahin Hasan Upol",
      id: "0112230520",
      role: "AI & Full-Stack Lead Developer",
      tag: "TrOCR & Bangla NLP Architect",
      icon: "⚡",
      color: "#0284c7"
    },
    {
      name: "Bijoy Sen",
      id: "0112230404",
      role: "Software Engineer & System Architect",
      tag: "Backend & Database Lead",
      icon: "🚀",
      color: "#059669"
    },
    {
      name: "Mst. Walina Tanjim",
      id: "0112230422",
      role: "UI/UX & Speech Synthesis Researcher",
      tag: "Accessibility & Bangla TTS",
      icon: "🎨",
      color: "#e11d48"
    },
    {
      name: "MD. Mostafijur Rahman Joy",
      id: "0112231004",
      role: "Medical Database & Security Analyst",
      tag: "DGDA Registry & Fake Drug AI",
      icon: "🛡️",
      color: "#d97706"
    },
    {
      name: "Shukla Ghosh",
      id: "0112230029",
      role: "QA & Healthcare Systems Consultant",
      tag: "OCR Evaluation & Field Testing",
      icon: "✨",
      color: "#7c3aed"
    }
  ];

  const triggerTeamCheer = () => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div style={{ padding: '8px 0 36px' }}>
      <div className="container-max">
        {/* Module Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            টিম পরিচিতি (Team Goku)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: '540px', margin: '0 auto' }}>
            নির্ভয় (NIRVOY) প্রজেক্টের নির্মাতাবৃন্দ।
          </p>
        </div>

        {/* Team Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="clean-card"
              onClick={triggerTeamCheer}
              style={{
                padding: '22px 16px',
                background: '#ffffff',
                borderRadius: '16px',
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
                height: '4px',
                background: member.color
              }} />

              {/* Avatar Icon */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: `${member.color}12`,
                color: member.color,
                fontSize: '1.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                border: `1px solid ${member.color}30`
              }}>
                {member.icon}
              </div>

              <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: '0 0 2px', fontWeight: 700 }}>
                {member.name}
              </h3>

              <div style={{
                display: 'inline-block',
                background: '#f1f5f9',
                color: '#475569',
                padding: '1px 8px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                marginBottom: '8px'
              }}>
                ID: {member.id}
              </div>

              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: member.color, margin: '0 0 4px' }}>
                {member.role}
              </p>

              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                {member.tag}
              </p>
            </div>
          ))}
        </div>

        {/* Project Roadmap Banner */}
        <div className="clean-card" style={{
          padding: '24px',
          background: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '16px', textAlign: 'center', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#0284c7" />
            <span>Nirvoy 6-Week Launch Roadmap (রোডম্যাপ)</span>
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px'
          }}>
            {[
              { week: 'Week 1', title: 'Research & Datasets', status: 'Completed', color: '#0284c7' },
              { week: 'Week 2', title: 'OCR & TrOCR Engine', status: 'Completed', color: '#059669' },
              { week: 'Week 3', title: 'Bangla NLP & TTS', status: 'Completed', color: '#0284c7' },
              { week: 'Week 4', title: 'Patient History Hub', status: 'Completed', color: '#059669' },
              { week: 'Week 5', title: 'Doctor & Pharmacy', status: 'Completed', color: '#0284c7' },
              { week: 'Week 6', title: 'DGDA & Deployment', status: 'Completed', color: '#059669' }
            ].map(step => (
              <div key={step.week} style={{
                background: '#ffffff',
                padding: '12px 10px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: step.color,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  margin: '0 auto 6px'
                }}>
                  ✓
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: step.color }}>{step.week}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e293b', marginTop: '1px' }}>{step.title}</div>
                <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#15803d', padding: '1px 5px', borderRadius: '4px', fontWeight: 700, marginTop: '3px', display: 'inline-block' }}>
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

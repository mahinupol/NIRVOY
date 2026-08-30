# 💊 NIRVOY (নির্ভয়)
### AI-Powered Bangla Prescription Intelligence System

NIRVOY is an intelligent, accessible healthcare web platform built to eliminate handwritten prescription confusion in Bangladesh. Powered by AI OCR (TrOCR + EasyOCR), Bangla NLP, Text-to-Speech (TTS), and DGDA counterfeit medicine verification, NIRVOY bridges the gap between doctors, patients, and pharmacies.

---

## 👥 Team Goku (Creators)
- **Mahin Hasan Upol** (0112230520) - AI & Full-Stack Lead Developer
- **Bijoy Sen** (0112230404) - Software Engineer & System Architect
- **Mst. Walina Tanjim** (0112230422) - UI/UX & Speech Synthesis Researcher
- **MD. Mostafijur Rahman Joy** (0112231004) - Medical Database & Security Analyst
- **Shukla Ghosh** (0112230029) - QA & Healthcare Systems Consultant

---

## 🚀 Key Modules & Features

1. **Module 1: Prescription Recognition (OCR & AI)**
   - Upload handwritten prescription images or select interactive presets.
   - TrOCR + EasyOCR bounding box detection with confidence scoring.
   - Bangladeshi drug dictionary auto-correction for 500+ local medicines.

2. **Module 2: Bangla Explanation & Voice (TTS)**
   - Medical shorthand decoder (`1+0+1`, `AC`, `PC`, `TDS`, `BD`) translated into native Bangla.
   - Text-to-Speech (TTS) audio narration with speed controls for elderly & rural patients.
   - Morning, noon, and night meal timing indicators.

3. **Module 3: Patient History & Archive**
   - Encrypted digital prescription record timeline.
   - Daily dosage reminder adherence tracker with celebratory completion rewards.
   - 1-click PDF prescription and summary export.

4. **Module 4: Doctor Dashboard & Digital Rx Builder**
   - Quick-add prescription creator with auto-complete for Bangladeshi medicines.
   - Instant PDF generation & printing to eliminate handwriting errors.

5. **Module 5: Pharmacy Availability & Substitute Radar**
   - Search stock availability across top Bangladeshi pharmacies (Lazz Pharma, Tamanna, Arogga).
   - Smart substitute recommendations for out-of-stock medications.
   - Home delivery booking simulator.

6. **Module 6: Fake Medicine Verification (DGDA Scanner)**
   - Barcode / QR / DAR registration number verification against DGDA database.
   - Counterfeit alert indicators, risk scoring, and manufacturer security hologram checks.

7. **Bonus: AI Health Assistant & Accessibility Mode**
   - Bilingual AI healthcare chatbot answering medication questions.
   - Senior / Rural Accessibility high-contrast mode.

---

## 🛠️ Technology Stack
- **Frontend**: React 19, Vite, Lucide Icons, Canvas Confetti
- **Export & Audio**: jsPDF, Web Speech API (Bengali Speech Synthesis)
- **Styling**: Vanilla CSS Design System with Glassmorphism & Responsive Layout

---

## 💻 Local Development Setup

```bash
# Clone the repository
git clone git@github.com:mahinupol/NIRVOY.git

# Navigate into directory
cd NIRVOY

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

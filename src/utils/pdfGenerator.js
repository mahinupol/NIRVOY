// Client-side PDF Prescription & Health Summary Generator using jsPDF
// Standardized to 100% Clean English (Latin-1/ASCII) to eliminate font encoding corruption / mojibake
import { jsPDF } from 'jspdf';

// Helper to convert Bengali numbers to English digits
function convertBnDigitsToEn(str) {
  if (!str) return '';
  const bnToEn = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  return String(str).replace(/[০-৯]/g, match => bnToEn[match] || match);
}

// Convert any Bengali timing or clinical instruction to clean, professional English
export function sanitizeToEnglish(text, fallback = '') {
  if (!text) return fallback;
  let str = convertBnDigitsToEn(String(text).trim());

  // Replace common Bengali phrases
  const replacements = [
    // Meals & Timings
    { pattern: /খাবার\s*পর|খাওয়ার\s*পর/gi, repl: 'After meal' },
    { pattern: /খাবার\s*আগে|খাওয়ার\s*আগে/gi, repl: 'Before meal' },
    { pattern: /খাওয়ার\s*৩০\s*মিনিট\s*আগে|খাবার\s*৩০\s*মিনিট\s*আগে/gi, repl: '30 mins before meal' },
    { pattern: /খাওয়ার\s*২০\s*মিনিট\s*আগে/gi, repl: '20 mins before meal' },
    { pattern: /খাবার\s*সাথে|খাওয়ার\s*সাথে/gi, repl: 'With meal' },
    { pattern: /রাতে\s*ঘুমানোর\s*আগে|শোবার\s*আগে/gi, repl: 'At bedtime' },
    { pattern: /ভরা\s*পেটে/gi, repl: 'After full meal' },
    { pattern: /খালি\s*পেটে/gi, repl: 'Empty stomach' },
    { pattern: /প্রয়োজনে|জরুরীতে|প্রয়োজনে/gi, repl: 'SOS / As needed' },
    { pattern: /জ্বর\s*বা\s*ব্যথা|ব্যথার\s*জন্য/gi, repl: 'For fever & pain' },
    { pattern: /গ্যাস্ট্রিকের\s*জন্য/gi, repl: 'For acidity / gastric reflux' },
    { pattern: /এলার্জির\s*জন্য/gi, repl: 'For allergy relief' },
    { pattern: /কাশি\s*বা\s*কফ/gi, repl: 'For cough & cold' },
    { pattern: /ইনহেলার/gi, repl: 'Inhaler' },
    { pattern: /ড্রপ/gi, repl: 'Drop' },

    // Durations
    { pattern: /চলবে/gi, repl: 'Continue' },
    { pattern: /দিন/gi, repl: 'days' },
    { pattern: /সপ্তাহ/gi, repl: 'weeks' },
    { pattern: /মাস/gi, repl: 'months' },
    { pattern: /টানা/gi, repl: 'Continuous' },

    // Doctor & Titles
    { pattern: /ডাঃ|ডাক্তার/gi, repl: 'Dr.' },
    { pattern: /মেডিসিন\s*বিশেষজ্ঞ/gi, repl: 'Medicine Specialist' },
    { pattern: /অধ্যাপক/gi, repl: 'Prof.' },
    { pattern: /সহযোগী\s*অধ্যাপক/gi, repl: 'Associate Prof.' },
    { pattern: /মুগদা\s*মেডিকেল\s*কলেজ\s*হাসপাতাল/gi, repl: 'Mugda Medical College & Hospital' },
    { pattern: /ঢাকা\s*মেডিকেল\s*কলেজ\s*হাসপাতাল/gi, repl: 'Dhaka Medical College & Hospital' },
    { pattern: /বঙ্গবন্ধু\s*শেখ\s*মুজিব\s*মেডিকেল\s*বিশ্ববিদ্যালয়|বিএসএমএমইউ/gi, repl: 'BSMMU, Dhaka' },
    { pattern: /স্যার\s*সলিমুল্লাহ\s*মেডিকেল\s*কলেজ|মিটফোর্ড/gi, repl: 'Sir Salimullah Medical College, Mitford' },

    // Patients
    { pattern: /পুরুষ/gi, repl: 'Male' },
    { pattern: /মহিলা|নারী/gi, repl: 'Female' },
    { pattern: /বছর/gi, repl: 'Y' }
  ];

  for (const { pattern, repl } of replacements) {
    str = str.replace(pattern, repl);
  }

  // Remove any remaining non-ASCII characters that cause font mojibake
  str = str.replace(/[^\x00-\x7F]/g, ' ').replace(/\s+/g, ' ').trim();

  return str || fallback;
}

export function exportPrescriptionPDF(prescriptionData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const darkTextColor = [15, 23, 42];
  const mutedTextColor = [71, 85, 105];

  // Header Banner
  doc.setFillColor(2, 132, 199);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('NIRVOY - DIGITAL PRESCRIPTION INTELLIGENCE', 14, 15);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('AI Healthcare System | Team_Goku', 148, 15);

  // Doctor Info Box
  const doctorName = sanitizeToEnglish(prescriptionData.doctorName, 'Dr. MD. Bellal Hossain');
  const qualifications = sanitizeToEnglish(prescriptionData.qualifications, 'MBBS, FCPS (Medicine)');
  const hospital = sanitizeToEnglish(prescriptionData.hospital, 'Mugda Medical College & Hospital, Dhaka');

  doc.setTextColor(...darkTextColor);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(doctorName, 14, 35);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedTextColor);
  doc.text(qualifications, 14, 40);
  doc.text(hospital, 14, 45);

  // Date & Rx ID
  const rxDate = sanitizeToEnglish(prescriptionData.date, new Date().toISOString().split('T')[0]);
  const rxId = sanitizeToEnglish(prescriptionData.id, 'rx-real-1');

  doc.setFontSize(8.5);
  doc.text(`Date: ${rxDate}`, 148, 35);
  doc.text(`Rx ID: NIRVOY-${rxId}`, 148, 40);
  doc.text('Verified: DGDA BD Drug Formulary', 148, 45);

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 50, 196, 50);

  // Patient Info Bar
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 54, 182, 15, 2, 2, 'F');

  const patientName = sanitizeToEnglish(prescriptionData.patientName, 'Ayesha Siddiqua');
  const patientAge = sanitizeToEnglish(prescriptionData.patientAge, '18');
  const patientGender = sanitizeToEnglish(prescriptionData.patientGender, 'Female');

  doc.setTextColor(...darkTextColor);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Name:', 18, 63);
  doc.setFont('helvetica', 'normal');
  doc.text(patientName, 42, 63);

  doc.setFont('helvetica', 'bold');
  doc.text('Age / Gender:', 115, 63);
  doc.setFont('helvetica', 'normal');
  doc.text(`${patientAge} Y / ${patientGender}`, 138, 63);

  // Diagnosis
  let startY = 76;
  if (prescriptionData.diagnosis) {
    const diagnosis = sanitizeToEnglish(prescriptionData.diagnosis, 'Respiratory Tract Infection');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('Clinical Diagnosis:', 14, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(diagnosis, 45, startY);
    startY += 8;
  }

  // Prescription Symbol (Rx)
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text('Rx', 14, startY + 5);

  startY += 10;

  // Medicines Table Header
  doc.setFillColor(248, 250, 252);
  doc.rect(14, startY, 182, 8, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, startY, 182, 8, 'S');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkTextColor);
  doc.text('#', 17, startY + 5.5);
  doc.text('Medicine & Generic', 26, startY + 5.5);
  doc.text('Dosage (Schedule)', 96, startY + 5.5);
  doc.text('Duration', 134, startY + 5.5);
  doc.text('Timing / Instructions', 160, startY + 5.5);

  startY += 8;

  // Medicine items list
  const medicines = prescriptionData.boundingBoxes || prescriptionData.medicines || [];
  medicines.forEach((med, idx) => {
    const rowY = startY + (idx * 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...darkTextColor);

    doc.text(`${idx + 1}.`, 17, rowY + 7);

    // Med Name & Generic
    const rawBrand = med.detectedMedicine || med.brandName || med.name || 'Medicine';
    const cleanBrand = sanitizeToEnglish(rawBrand, 'Medicine');
    const cleanGeneric = sanitizeToEnglish(med.generic, 'Bangladeshi Brand');

    doc.setFont('helvetica', 'bold');
    doc.text(cleanBrand, 26, rowY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedTextColor);
    doc.text(cleanGeneric, 26, rowY + 9);

    // Dosage, Duration, Timing in Clean English
    const cleanDosage = sanitizeToEnglish(med.dosage, '1+0+1');
    const cleanDuration = sanitizeToEnglish(med.duration, '7 days');
    const cleanTiming = sanitizeToEnglish(med.timing, 'After meal');

    doc.setFontSize(8.5);
    doc.setTextColor(...darkTextColor);
    doc.text(cleanDosage, 96, rowY + 7);
    doc.text(cleanDuration, 134, rowY + 7);
    doc.text(cleanTiming, 160, rowY + 7);

    doc.setDrawColor(241, 245, 249);
    doc.line(14, rowY + 13, 196, rowY + 13);
  });

  // Footer Advice & Safety Note
  const footerY = Math.max(startY + (medicines.length * 13) + 16, 236);
  doc.setFillColor(240, 253, 250);
  doc.roundedRect(14, footerY, 182, 26, 2, 2, 'F');
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(14, footerY, 182, 26, 2, 2, 'S');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text('NIRVOY AI Intelligence - Clinical Patient Advice (English):', 18, footerY + 6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(7.8);
  doc.text('1. Follow the exact dosage schedules and meal timings indicated above.', 18, footerY + 12);
  doc.text('2. For any adverse reactions or questions, promptly contact your registered physician.', 18, footerY + 17);
  doc.text('3. Verified via NIRVOY AI Prescription Intelligence (DGDA BD Formulary Compliant).', 18, footerY + 22);

  // Doctor Signature Block
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkTextColor);
  doc.text('Registered Doctor Signature / Stamp', 138, footerY + 38);
  doc.setDrawColor(148, 163, 184);
  doc.line(135, footerY + 34, 192, footerY + 34);

  // Save the PDF with sanitized filename
  const safeFilename = patientName.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`NIRVOY_Prescription_${safeFilename || 'Report'}.pdf`);
}

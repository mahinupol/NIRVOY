// Medical Shorthand Parser & Bangla Sentence Synthesizer
import { BANGLADESHI_MEDICINES, MEDICAL_SHORTHAND_DICTIONARY } from '../data/medicinesData';

export function parseDosageInstruction(dosageCode, customTiming = '') {
  const code = (dosageCode || '').trim();
  if (MEDICAL_SHORTHAND_DICTIONARY[code]) {
    return MEDICAL_SHORTHAND_DICTIONARY[code];
  }

  // Handle patterns like 1+0+1, 1+1+1, 0+0+1, 1/2+0+1/2, etc.
  const parts = code.split('+');
  if (parts.length === 3) {
    const morning = parts[0].trim();
    const noon = parts[1].trim();
    const night = parts[2].trim();

    let times = [];
    if (morning !== '0') times.push(`সকালে ${morning}টি`);
    if (noon !== '0') times.push(`দুপুরে ${noon}টি`);
    if (night !== '0') times.push(`রাতে ${night}টি`);

    const timingStr = customTiming ? customTiming : 'খাবার পর';
    const bnText = `${times.join(' ও ')} করে ${timingStr} সেবন করবেন।`;
    const enText = `Take ${morning} in morning, ${noon} at noon, ${night} at night (${timingStr}).`;

    return {
      bn: bnText,
      en: enText,
      timesPerDay: (morning !== '0' ? 1 : 0) + (noon !== '0' ? 1 : 0) + (night !== '0' ? 1 : 0),
      timing: timingStr
    };
  }

  return {
    bn: `চিকিৎসকের নির্দেশ অনুযায়ী: ${code} ${customTiming}`,
    en: `As directed: ${code} ${customTiming}`,
    timesPerDay: 1,
    timing: customTiming || 'খাবার পর'
  };
}

export function generateBanglaVoiceScript(patientName, items = []) {
  if (!items || items.length === 0) {
    return 'কোনো ওষুধের তথ্য পাওয়া যায়নি। অনুগ্রহ করে প্রেসক্রিপশনটি আবার স্ক্যান করুন।';
  }

  const greeting = patientName ? `শ্রদ্ধেয় ${patientName}, আপনার প্রেসক্রিপশনের নিয়মাবলী শুনুন। ` : 'আপনার প্রেসক্রিপশনের বিস্তারিত নির্দেশাবলী শুনুন। ';
  
  const medicineSpeeches = items.map((item, index) => {
    const medName = item.detectedMedicine || item.brandName || item.rawText;
    const dosageInfo = parseDosageInstruction(item.dosage, item.timing);
    const duration = item.duration ? `টানা ${item.duration}` : '';
    const medData = BANGLADESHI_MEDICINES.find(m => m.brandName.toLowerCase().includes((medName || '').toLowerCase()));
    const purpose = medData ? `এটি ${medData.purposeBn}` : '';

    return `ওষুধ নম্বর ${index + 1}: ${medName}। ${dosageInfo.bn} ${duration} পর্যন্ত চলবে। ${purpose}`;
  });

  const footer = '। কোনো পার্শ্বপ্রতিক্রিয়া বা সমস্যা দেখা দিলে দ্রুত রেজিস্টার্ড চিকিৎসকের সাথে যোগাযোগ করুন। ধন্যবাদ।';
  return greeting + medicineSpeeches.join('। ') + footer;
}

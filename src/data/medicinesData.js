// Master Database of 21,700+ Bangladeshi Medicines & Formulations
// Auto-generated & Standardized from Dataset/medicine.csv
import COMPACT_MEDICINES from './allMedicinesDataset.json' with { type: 'json' };

// Expand compact records into full standardized objects with null-safety
export const BANGLADESHI_MEDICINES = (COMPACT_MEDICINES || []).map((m, idx) => {
  const brand = m?.b || 'Medicine';
  const base = m?.base || brand;
  const gen = m?.g || '';
  return {
    id: m?.id || `med-${idx}`,
    brandName: brand,
    baseBrand: base,
    generic: gen,
    strength: m?.s || '',
    dosageForm: m?.f || 'Tablet',
    manufacturer: m?.m || 'Pharmaceuticals Ltd.',
    category: m?.c || 'Prescription Drug',
    unitPrice: m?.p || '10.00',
    purposeBn: m?.pb || 'চিকিৎসকের পরামর্শ অনুযায়ী সেব্য।',
    purposeEn: m?.pe || 'As directed by physician.',
    commonDosage: m?.cd || '1+0+1',
    defaultTiming: m?.dt || 'খাবার পর',
    defaultDuration: m?.dd || '৭ দিন (7 days)',
    dgdaRegNo: m?.dg || '',
    inStockCount: 250,
    aliases: [
      base.toLowerCase(),
      brand.toLowerCase(),
      base.toLowerCase().replace(/[^a-z0-9]/g, ''),
      gen ? gen.toLowerCase() : '',
      gen ? gen.toLowerCase().split('+')[0].trim() : ''
    ].filter(Boolean)
  };
});

// Quick Indexed Maps for O(1) & O(log N) lookup
export const MEDICINE_BRAND_INDEX = new Map();
export const MEDICINE_CLEAN_INDEX = new Map();

for (const med of BANGLADESHI_MEDICINES) {
  const cleanBrand = (med.baseBrand || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanFull = (med.brandName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (cleanBrand && !MEDICINE_BRAND_INDEX.has(cleanBrand)) {
    MEDICINE_BRAND_INDEX.set(cleanBrand, med);
  }
  if (cleanFull && !MEDICINE_CLEAN_INDEX.has(cleanFull)) {
    MEDICINE_CLEAN_INDEX.set(cleanFull, med);
  }
}

export const MEDICAL_SHORTHAND_DICTIONARY = {
  "1+1+1": { bn: "সকাল, দুপুর ও রাতে খাবার পর", en: "Three times a day after meals", timesPerDay: 3, timing: "পোস্ট-মিল (খাবার পর)" },
  "1+0+1": { bn: "সকাল ও রাতে খাবার পর", en: "Twice daily (Morning & Night) after meals", timesPerDay: 2, timing: "পোস্ট-মিল (খাবার পর)" },
  "0+0+1": { bn: "প্রতিদিন রাতে খাবার পর (ঘুমানোর আগে)", en: "Once daily at bedtime after meal", timesPerDay: 1, timing: "রাতে" },
  "1+0+0": { bn: "প্রতিদিন সকালে খাবার পর", en: "Once daily in the morning after breakfast", timesPerDay: 1, timing: "সকালে" },
  "0+1+0": { bn: "প্রতিদিন দুপুরে খাবার পর", en: "Once daily at noon after lunch", timesPerDay: 1, timing: "দুপুরে" },
  "1+1+1+1": { bn: "দিনে চারবার ৬ ঘণ্টা পর পর", en: "Four times daily every 6 hours", timesPerDay: 4, timing: "নিয়মিত সময়মতো" },
  "P/R - SOS": { bn: "তীব্র জ্বর (১০২° ফারেনহাইটের বেশি) হলে পায়ুপথে প্রয়োগ করবেন", en: "Per rectum as needed for high fever", timesPerDay: 1, timing: "জরুরি হলে" },
  "AC": { bn: "খাওয়ার ৩০ মিনিট আগে (খালি পেটে)", en: "Before meals (Ante Cibum)", timesPerDay: null, timing: "খালি পেটে" },
  "PC": { bn: "খাবার গ্রহণের পর (ভরা পেটে)", en: "After meals (Post Cibum)", timesPerDay: null, timing: "ভরা পেটে" },
  "OD": { bn: "দিনে একবার নির্দিষ্ট সময়ে", en: "Once daily (Omni Die)", timesPerDay: 1, timing: "দিনে ১ বার" },
  "BD": { bn: "দিনে দুইবার ১২ ঘণ্টা পর পর", en: "Twice daily (Bis in Die)", timesPerDay: 2, timing: "দিনে ২ বার" },
  "TDS": { bn: "দিনে তিনবার ৮ ঘণ্টা পর পর", en: "Three times daily (Ter Die Sumendum)", timesPerDay: 3, timing: "দিনে ৩ বার" },
  "HS": { bn: "ঘুমানোর আগে", en: "At bedtime (Hora Somni)", timesPerDay: 1, timing: "রাতে ঘুমানোর আগে" },
  "SOS": { bn: "শুধুমাত্র প্রয়োজন হলে", en: "As needed / if required (Si Opus Sit)", timesPerDay: null, timing: "প্রয়োজনে" },
  "STAT": { bn: "অবিলম্বে এক ডোজ সেব্য", en: "Immediately / Single stat dose", timesPerDay: 1, timing: "এখনই" }
};

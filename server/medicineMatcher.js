import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load 21,714+ Bangladeshi Medicines Dataset
let medicines = [];
try {
  const datasetPath = path.join(__dirname, '..', 'src', 'data', 'allMedicinesDataset.json');
  if (fs.existsSync(datasetPath)) {
    const raw = fs.readFileSync(datasetPath, 'utf8');
    medicines = JSON.parse(raw);
    console.log(`📦 Loaded ${medicines.length} Bangladeshi medicines into backend search engine.`);
  }
} catch (e) {
  console.error('Error loading allMedicinesDataset.json:', e);
}

// Clean medicine tokens
export function cleanMedicineToken(token) {
  if (!token) return '';
  return String(token)
    .replace(/^[\s\d\-•*#.)(:]+/, '')
    .replace(/\b(tab|cap|syp|inj|drop|susp|tablet|capsule|syrup|injection|drops|ointment|cream|gel|lotion|rx|rx:)\b/gi, '')
    .replace(/(\d+\s*mg|\d+\s*ml|\d+\/\d+|\d+\s*iu|\d+\s*mcg|\d+\s*gm)/gi, '')
    .replace(/(\d+(?:\/\d+)?\s*\+\s*\d+(?:\/\d+)?\s*\+\s*\d+(?:\/\d+)?)/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .trim()
    .toLowerCase();
}

/**
 * Search candidates from 21,714 dataset even if only 1-2 characters match
 * @param {string} query 
 * @param {number} limit 
 * @returns {Array}
 */
export function findMedicineCandidates(query, limit = 5) {
  if (!query || medicines.length === 0) return [];
  const cleanQ = cleanMedicineToken(query);
  if (!cleanQ || cleanQ.length < 2) return [];

  const firstTwo = cleanQ.slice(0, 2);
  const candidates = [];
  const seenBrands = new Set();

  for (const med of medicines) {
    const brandName = (med.b || '').trim();
    if (!brandName || seenBrands.has(brandName)) continue;

    const baseBrand = (med.base || '').toLowerCase();
    const brandLower = brandName.toLowerCase();
    const genericLower = (med.g || '').toLowerCase();

    let score = 0;
    if (baseBrand === cleanQ || brandLower === cleanQ) {
      score = 1.0;
    } else if (baseBrand.startsWith(cleanQ)) {
      score = 0.85;
    } else if (brandLower.includes(cleanQ)) {
      score = 0.75;
    } else if (genericLower.includes(cleanQ)) {
      score = 0.70;
    } else if (baseBrand.startsWith(firstTwo)) {
      // 2-letter prefix match (e.g. 'np' -> 'Napa', 'sc' -> 'Seclo', 'fx' -> 'Fexo')
      score = 0.50;
    } else if (genericLower.startsWith(firstTwo)) {
      score = 0.40;
    }

    if (score > 0) {
      seenBrands.add(brandName);
      candidates.push({
        brandName: med.b,
        baseBrand: med.base,
        generic: med.g,
        strength: med.s,
        dosageForm: med.f,
        manufacturer: med.m,
        category: med.c,
        price: med.p,
        commonDosage: med.cd || '1+0+1',
        defaultTiming: med.dt || 'খাবার পর',
        defaultDuration: med.dd || '৭ দিন',
        dgdaReg: med.dg,
        score
      });
    }

    if (candidates.length >= 80) break; // Limit search pool
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, limit);
}

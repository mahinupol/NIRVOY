import { predictMedicinesWithChatGPT } from '../server/aiPrescriptionPredictor.js';

const testOcrText = `Dr. K. M. Rahman, MBBS, FCPS
Popular Diagnostic Centre
Patient: Rafiqul Islam, Age: 42
Rx:
1. Tab Np 500 mg - 1+0+1 (After meal) 3 days
2. Cap Sclo 20 - 1+0+1 (Before meal) 7 days
3. Tab Fxo 120 - 0+0+1 (At bedtime) 5 days`;

async function run() {
  const result = await predictMedicinesWithChatGPT(testOcrText);
  console.log('Result title:', result.title);
  console.log('Detected medicines count:', result.boundingBoxes.length);
  result.boundingBoxes.forEach((b, i) => {
    console.log(`[${i+1}] ${b.detectedMedicine} (${b.generic}) - ${b.dosage} - ${b.timing} - Mfr: ${b.manufacturer}`);
  });
  console.log('Bangla Summary:', result.banglaSummary);
}

run().catch(console.error);

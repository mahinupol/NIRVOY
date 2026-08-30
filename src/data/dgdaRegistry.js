// DGDA (Directorate General of Drug Administration) Verification Database

export const DGDA_REGISTRY = [
  {
    barcode: "8941100230182",
    dgdaRegNo: "DAR-023-0182-054",
    batchNumber: "BEX-NP-9942",
    brandName: "Napa Extra",
    generic: "Paracetamol 500mg + Caffeine 65mg",
    manufacturer: "Beximco Pharmaceuticals Ltd.",
    licenseNo: "ML-012/1986",
    mfgDate: "2025-11-15",
    expDate: "2028-10-31",
    status: "AUTHENTIC",
    verificationMessageBn: "অভিনন্দন! ঔষধটি গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের ঔষধ প্রশাসন অধিদপ্তর (DGDA) দ্বারা অনুমোদিত ও আসল।",
    verificationMessageEn: "Verified Authentic. Registered and authorized by Directorate General of Drug Administration (DGDA), Bangladesh.",
    hologramMatched: true,
    dgdaSealVerified: true,
    riskScore: 0
  },
  {
    barcode: "8941100010421",
    dgdaRegNo: "DAR-001-0421-088",
    batchNumber: "SQR-SC-7731",
    brandName: "Seclo 20",
    generic: "Omeprazole 20mg",
    manufacturer: "Square Pharmaceuticals PLC",
    licenseNo: "ML-003/1980",
    mfgDate: "2026-01-10",
    expDate: "2028-12-31",
    status: "AUTHENTIC",
    verificationMessageBn: "ঔষধটি সম্পূর্ণ আসল এবং স্কয়ার ফার্মাসিউটিক্যালসের অনুমোদিত উৎপাদন কেন্দ্র থেকে তৈরিকৃত।",
    verificationMessageEn: "Authentic Product verified from Square Pharmaceuticals PLC certified batch.",
    hologramMatched: true,
    dgdaSealVerified: true,
    riskScore: 0
  },
  {
    barcode: "8941100120941",
    dgdaRegNo: "DAR-012-0941-011",
    batchNumber: "ACM-MN-5120",
    brandName: "Monas 10",
    generic: "Montelukast 10mg",
    manufacturer: "Acme Laboratories Ltd.",
    licenseNo: "ML-022/1990",
    mfgDate: "2025-08-01",
    expDate: "2027-07-31",
    status: "AUTHENTIC",
    verificationMessageBn: "ঔষধটি ডিজিডিএ নিবন্ধিত ও আসল। মেয়াদোত্তীর্ণ হওয়ার পূর্বে নিশ্চিন্তে সেবনযোগ্য।",
    verificationMessageEn: "DGDA verified authentic medicine.",
    hologramMatched: true,
    dgdaSealVerified: true,
    riskScore: 0
  },
  {
    barcode: "8949999000111",
    dgdaRegNo: "DAR-FAKE-992-00",
    batchNumber: "FAKE-BATCH-660",
    brandName: "Napa Extra (Counterfeit)",
    generic: "Unknown / Low Potency Filler",
    manufacturer: "Unlicensed Illegal Unit (Mitford/Keraniganj)",
    licenseNo: "INVALID",
    mfgDate: "2024-01-01",
    expDate: "2026-01-01",
    status: "COUNTERFEIT_ALERT",
    verificationMessageBn: "সতর্কতা! এই ব্যাচ নাম্বারটি ডিজিডিএ ডেটাবেসে অবৈধ হিসেবে চিহ্নিত। এটি নকল বা মেয়াদোত্তীর্ণ ঔষধ হওয়ার সর্বোচ্চ ঝুঁকি রয়েছে। এটি সেবন করবেন না!",
    verificationMessageEn: "CRITICAL ALERT: Counterfeit / illegal batch detected. Not registered with DGDA. Do NOT consume this medicine.",
    hologramMatched: false,
    dgdaSealVerified: false,
    riskScore: 98
  }
];

export const DGDA_VERIFY_SAMPLE_PRESETS = [
  { label: "Valid Napa Extra (Beximco)", code: "8941100230182" },
  { label: "Valid Seclo 20 (Square)", code: "8941100010421" },
  { label: "Valid Monas 10 (Acme)", code: "8941100120941" },
  { label: "⚠️ Fake / Illegal Batch (Test Alert)", code: "8949999000111" }
];

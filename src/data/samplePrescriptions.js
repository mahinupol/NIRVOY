// Sample Real-world handwritten prescriptions for instant 1-click test drive

export const SAMPLE_PRESCRIPTIONS = [
  {
    id: "rx-demo-1",
    title: "Seasonal Flu & Acidity Rx",
    doctorName: "Prof. Dr. M. A. Rahman",
    qualifications: "MBBS, FCPS (Medicine), MACP (USA)",
    hospital: "Dhaka Medical College & Hospital",
    date: "2026-08-28",
    patientName: "Md. Rafiqul Islam",
    patientAge: 48,
    patientGender: "Male",
    diagnosis: "Acute viral URI with hyperacidity & body ache",
    sampleImageSvg: "rx_fever",
    ocrConfidence: 94.8,
    boundingBoxes: [
      { id: "box-1", label: "Tab. Napa Extra 500+65", rawText: "Napa Ext 500", detectedMedicine: "Napa Extra", dosage: "1+0+1", duration: "5 days", confidence: 97, timing: "খাবার পর", box: { top: 28, left: 10, width: 80, height: 12 } },
      { id: "box-2", label: "Cap. Seclo 20mg", rawText: "Cap Seclo 20", detectedMedicine: "Seclo 20", dosage: "1+0+1", duration: "14 days", confidence: 96, timing: "খাওয়ার ৩০ মিনিট আগে", box: { top: 44, left: 10, width: 80, height: 12 } },
      { id: "box-3", label: "Tab. Fexo 120mg", rawText: "Tab Fex 120", detectedMedicine: "Fexo 120", dosage: "0+0+1", duration: "7 days", confidence: 91, timing: "রাতে খাবার পর", box: { top: 60, left: 10, width: 80, height: 12 } }
    ],
    banglaSummary: "এই ব্যবস্থাপত্রে মোট ৩টি ওষুধ রয়েছে। ১) নাপা এক্সট্রা: সকাল ও রাতে খাবার পর ৫ দিন জ্বর ও শরীর ব্যথার জন্য। ২) সেকলো ২০: সকাল ও রাতে খাবার ৩০ মিনিট আগে গ্যাস্ট্রিকের জন্য। ৩) ফেক্সো ১২০: রাতে শোয়ার আগে এলার্জি ও সর্দির জন্য।"
  },
  {
    id: "rx-demo-2",
    title: "Bronchial Asthma & Infection Rx",
    doctorName: "Dr. Farzana Yasmin",
    qualifications: "MBBS, MD (Chest & Pulmonology)",
    hospital: "National Institute of Diseases of the Chest and Hospital (NIDCH)",
    date: "2026-08-25",
    patientName: "Mrs. Anowara Begum",
    patientAge: 62,
    patientGender: "Female",
    diagnosis: "Chronic Bronchitis flare-up with bacterial superinfection",
    sampleImageSvg: "rx_chest",
    ocrConfidence: 89.2,
    boundingBoxes: [
      { id: "box-21", label: "Tab. Azithrocin 500mg", rawText: "Azithro 500mg", detectedMedicine: "Azithrocin 500", dosage: "1+0+0", duration: "5 days", confidence: 88, timing: "খাবার ১ ঘন্টা পূর্বে", box: { top: 30, left: 10, width: 80, height: 12 } },
      { id: "box-22", label: "Tab. Monas 10mg", rawText: "Monas 10 mg", detectedMedicine: "Monas 10", dosage: "0+0+1", duration: "30 days", confidence: 94, timing: "রাতে ঘুমানোর আগে", box: { top: 48, left: 10, width: 80, height: 12 } },
      { id: "box-23", label: "Tab. Ceevit 250mg", rawText: "C-vit chewable", detectedMedicine: "Ceevit", dosage: "1+0+1", duration: "15 days", confidence: 86, timing: "খাবার পর চিবিয়ে", box: { top: 66, left: 10, width: 80, height: 12 } }
    ],
    banglaSummary: "রোগীর শ্বাসতন্ত্রের সংক্রমণের জন্য ৩টি ওষুধ দেওয়া হয়েছে: ১) অ্যাজিথ্রোসিন ৫০০: প্রতিদিন ১টি করে খালি পেটে ৫ দিন এন্টিবায়োটিক হিসেবে। ২) মোনাস ১০: শ্বাসকষ্ট নিয়ন্ত্রণে রাতে ১টি করে ১ মাস। ৩) সিভিট: ভিটামিন সি সম্পূরক হিসেবে চুষে খাওয়ার জন্য।"
  },
  {
    id: "rx-demo-3",
    title: "Hypertension & Diabetes Follow-up",
    doctorName: "Dr. Kazi Tanvir Ahmed",
    qualifications: "MBBS, MD (Cardiology), CCD (BIRDEM)",
    hospital: "BIRDEM General Hospital, Shahbag",
    date: "2026-08-20",
    patientName: "Alhaj Nurul Islam",
    patientAge: 55,
    patientGender: "Male",
    diagnosis: "Essential Hypertension & T2DM (Controlled)",
    sampleImageSvg: "rx_cardio",
    ocrConfidence: 96.1,
    boundingBoxes: [
      { id: "box-31", label: "Tab. Bizoran 5/20", rawText: "Bizoran 5/20", detectedMedicine: "Bizoran 5/20", dosage: "1+0+0", duration: "চলবে (Continue)", confidence: 98, timing: "সকালে নাস্তার পর", box: { top: 32, left: 10, width: 80, height: 12 } },
      { id: "box-32", label: "Tab. Compathik 500", rawText: "Compathik 500mg", detectedMedicine: "Compathik 500", dosage: "1+0+1", duration: "চলবে (Continue)", confidence: 95, timing: "ভারী খাবারের সাথে", box: { top: 50, left: 10, width: 80, height: 12 } },
      { id: "box-33", label: "Cap. Maxpro 20mg", rawText: "Maxpro 20", detectedMedicine: "Maxpro 20", dosage: "1+0+1", duration: "30 days", confidence: 96, timing: "খাওয়ার ৩০ মিনিট আগে", box: { top: 68, left: 10, width: 80, height: 12 } }
    ],
    banglaSummary: "উচ্চ রক্তচাপ ও ডায়াবেটিস নিয়মিত নিয়ন্ত্রণের জন্য: ১) বিজোরান ৫/২০ সকালে ১টি। ২) কম্পাথিক ৫০০ সকাল ও রাতে খাওয়ার সাথে। ৩) ম্যাক্সপ্রো ২০ সকালে ও রাতে খালি পেটে।"
  }
];

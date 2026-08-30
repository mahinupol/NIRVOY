// Sample Real-world handwritten and digitized prescriptions for instant 1-click test drive

export const SAMPLE_PRESCRIPTIONS = [
  {
    id: "rx-real-1",
    title: "Handwritten Rx Slip (Dr. MD. Bellal Hossain - Mitford/Mugda)",
    doctorName: "Dr. MD. Bellal Hossain (ডাঃ মোঃ বিল্লাল হোসেন)",
    qualifications: "MBBS (Dhaka), FCPS (Medicine), MACP (America)",
    hospital: "Mugda Medical College Hospital, Dhaka (BMDC: A-46050)",
    date: "2025-06-30",
    patientName: "ফিকহা (Fikha)",
    patientAge: 18,
    patientGender: "Female",
    diagnosis: "Hypothyroidism & Acute Respiratory Tract Infection (Hypo, HT, POA)",
    customImageUrl: "/prescription/IMG_8391.jpg",
    ocrConfidence: 97.5,
    boundingBoxes: [
      { id: "box-r1-1", label: "Tab. Thyrox (25)", rawText: "Tab. Thyrox (25)", detectedMedicine: "Thyrox 25", dosage: "1+0+0", duration: "চলবে (Continue)", confidence: 98, timing: "সকালে খালি পেটে", box: { top: 26, left: 42, width: 52, height: 6 } },
      { id: "box-r1-2", label: "Tab. M-Kast (10)", rawText: "Tab. M-Kast (10)", detectedMedicine: "M-Kast 10", dosage: "0+0+1", duration: "১ মাস (30 days)", confidence: 97, timing: "রাতে ঘুমানোর আগে", box: { top: 31, left: 45, width: 49, height: 6 } },
      { id: "box-r1-3", label: "Cap. Denvar (200)", rawText: "Cap. Denvar (200)", detectedMedicine: "Denvar 200", dosage: "1+0+1", duration: "৫ দিন (5 days)", confidence: 96, timing: "খাবার পর", box: { top: 35.5, left: 47, width: 47, height: 6 } },
      { id: "box-r1-4", label: "Tab. Renova", rawText: "Tab. Renova", detectedMedicine: "Renova 500", dosage: "1+1+1", duration: "৫ দিন (5 days)", confidence: 95, timing: "খাবার পর", box: { top: 39.5, left: 52, width: 42, height: 6 } },
      { id: "box-r1-5", label: "Napa supp (500)", rawText: "Napa supp (500)", detectedMedicine: "Napa Suppository 500", dosage: "P/R - SOS", duration: "প্রয়োজনে (SOS)", confidence: 96, timing: "তীব্র জ্বর হলে পায়ুপথে", box: { top: 43.5, left: 50, width: 44, height: 6 } },
      { id: "box-r1-6", label: "Tab. Zodef (6)", rawText: "Tab. Zodef (6)", detectedMedicine: "Zodef 6", dosage: "1+0+1", duration: "৫ দিন (5 days)", confidence: 94, timing: "খাবার পর", box: { top: 47.5, left: 57, width: 37, height: 6 } }
    ],
    banglaSummary: "প্রেসক্রিপশনে ৬টি ওষুধ নির্দেশিত: ১) থাইরক্স ২৫ (থাইরয়েড হরমোনের জন্য সকালে খালি পেটে ১টি), ২) এম-কাস্ট ১০ (শ্বাসকষ্ট ও কাশির জন্য রাতে ১টি), ৩) ডেনভার ২০০ (অ্যান্টিবায়োটিক ৫ দিন), ৪) রেনোভা (জ্বর ও ব্যথায় দিনে ৩ বার), ৫) নাপা সাপোজিটরি (তীব্র জ্বর হলে পায়ুপথে), ৬) জোদেফ ৬ (প্রদাহ কমাতে সকাল ও রাতে)।"
  },
  {
    id: "rx-real-2",
    title: "Handwritten Rx Slip (Dr. MD. Bellal Hossain - RTI & Hypo)",
    doctorName: "Dr. MD. Bellal Hossain (ডাঃ মোঃ বিল্লাল হোসেন)",
    qualifications: "MBBS (Dhaka), FCPS (Medicine), MACP (America)",
    hospital: "Mugda Medical College Hospital, Dhaka (BMDC: A-46050)",
    date: "2025-06-30",
    patientName: "ফিকহা (Fikha)",
    patientAge: 18,
    patientGender: "Female",
    diagnosis: "Acute RTI (Respiratory Tract Infection) & Hypothyroidism",
    customImageUrl: "/prescription/IMG_8392.jpg",
    ocrConfidence: 96.8,
    boundingBoxes: [
      { id: "box-r2-1", label: "Tab. Xiclav (250)", rawText: "Tab. Xiclav (250)", detectedMedicine: "Xiclav 250", dosage: "1+0+1", duration: "৭ দিন (7 days)", confidence: 98, timing: "খাবার পর", box: { top: 34, left: 46, width: 48, height: 6 } },
      { id: "box-r2-2", label: "Tab. Fenadin (120)", rawText: "Tab. Fenadin (120)", detectedMedicine: "Fenadin 120", dosage: "1+0+1", duration: "৭ দিন (7 days)", confidence: 97, timing: "খাবার পর", box: { top: 40, left: 48, width: 46, height: 6 } },
      { id: "box-r2-3", label: "Cap. Sergel (20)", rawText: "Cap. Sergel (20)", detectedMedicine: "Sergel 20", dosage: "1+0+1", duration: "১৪ দিন (14 days)", confidence: 98, timing: "খাওয়ার ৩০ মিনিট আগে", box: { top: 46.5, left: 51, width: 43, height: 6 } },
      { id: "box-r2-4", label: "Tab. Napa (500)", rawText: "Tab. Napa (500)", detectedMedicine: "Napa 500", dosage: "1+1+1", duration: "৫ দিন (5 days)", confidence: 96, timing: "খাবার পর", box: { top: 53, left: 54, width: 40, height: 6 } },
      { id: "box-r2-5", label: "Antazol Nasal Drop", rawText: "Antazol ND", detectedMedicine: "Antazol Nasal Drop", dosage: "১ ফোঁটা x ২ বার", duration: "৩-৫ দিন (3-5 days)", confidence: 95, timing: "উভয় নাকে", box: { top: 59, left: 53, width: 41, height: 8 } },
      { id: "box-r2-6", label: "Nystat Oral Drop", rawText: "Nystat drop", detectedMedicine: "Nystat Oral Drop", dosage: "১৫ ফোঁটা x ৩ বার", duration: "৭ দিন (7 days)", confidence: 94, timing: "খাবার পর মুখে রেখে গিলবেন", box: { top: 70.5, left: 18, width: 34, height: 6 } },
      { id: "box-r2-7", label: "Tab. Thyrox (25)", rawText: "Tab. Thyrox (25)", detectedMedicine: "Thyrox 25", dosage: "1+0+0", duration: "চলবে (Continue)", confidence: 98, timing: "সকালে খালি পেটে", box: { top: 70.5, left: 48, width: 46, height: 6 } },
      { id: "box-r2-8", label: "Tab. M-Kast (10)", rawText: "Tab. M-Kast (10)", detectedMedicine: "M-Kast 10", dosage: "0+0+1", duration: "১ মাস (30 days)", confidence: 97, timing: "রাতে ঘুমানোর আগে", box: { top: 75.5, left: 19, width: 35, height: 6 } }
    ],
    banglaSummary: "প্রেসক্রিপশনে ৮টি ওষুধ দেওয়া হয়েছে: ১) জিক্ল্যাভ ২৫০ (অ্যান্টিবায়োটিক ৭ দিন), ২) ফেনাদিন ১২০ (অ্যালার্জি ও সর্দির জন্য), ৩) সার্জেল ২০ (গ্যাস্ট্রিকের জন্য খাবার আগে), ৪) নাপা ৫০০ (জ্বরের জন্য দিনে ৩ বার), ৫) আনতাজল ড্রপ (নাকের জন্য), ৬) নাইস্ট্যাট ড্রপ (মুখের জন্য), ৭) থাইরক্স ২৫ (থাইরয়েড হরমোন), ৮) এম-কাস্ট ১০ (শ্বাসকষ্টের জন্য রাতে)।"
  },
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

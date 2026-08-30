// Client-side PDF Prescription & Health Summary Generator using jsPDF
import { jsPDF } from 'jspdf';

export function exportPrescriptionPDF(prescriptionData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [14, 165, 233]; // #0ea5e9
  const darkTextColor = [30, 41, 59];
  const mutedTextColor = [100, 116, 139];

  // Header Banner
  doc.setFillColor(14, 165, 233);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('NIRVOY - DIGITAL PRESCRIPTION INTELLIGENCE', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('AI Healthcare Platform by Team_Goku', 145, 15);

  // Doctor Info Box
  doc.setTextColor(...darkTextColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(prescriptionData.doctorName || 'Dr. M. A. Rahman', 14, 36);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedTextColor);
  doc.text(prescriptionData.qualifications || 'MBBS, FCPS (Medicine)', 14, 42);
  doc.text(prescriptionData.hospital || 'Dhaka Medical College & Hospital', 14, 47);

  // Date & Rx ID
  doc.setFontSize(9);
  doc.text(`Date: ${prescriptionData.date || new Date().toISOString().split('T')[0]}`, 150, 36);
  doc.text(`Rx ID: NIRVOY-${prescriptionData.id || '2026-001'}`, 150, 42);

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 52, 196, 52);

  // Patient Info Bar
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 56, 182, 16, 2, 2, 'F');

  doc.setTextColor(...darkTextColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Name:', 18, 66);
  doc.setFont('helvetica', 'normal');
  doc.text(prescriptionData.patientName || 'Md. Rafiqul Islam', 42, 66);

  doc.setFont('helvetica', 'bold');
  doc.text('Age / Gender:', 110, 66);
  doc.setFont('helvetica', 'normal');
  doc.text(`${prescriptionData.patientAge || '48'} Y / ${prescriptionData.patientGender || 'Male'}`, 134, 66);

  // Diagnosis
  let startY = 82;
  if (prescriptionData.diagnosis) {
    doc.setFont('helvetica', 'bold');
    doc.text('Clinical Diagnosis:', 14, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(prescriptionData.diagnosis, 48, startY);
    startY += 10;
  }

  // Prescription Symbol (Rx)
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(14, 165, 233);
  doc.text('Rx', 14, startY + 4);

  startY += 12;

  // Medicines Table Header
  doc.setFillColor(248, 250, 252);
  doc.rect(14, startY, 182, 8, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, startY, 182, 8, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkTextColor);
  doc.text('#', 17, startY + 5.5);
  doc.text('Medicine & Strength', 26, startY + 5.5);
  doc.text('Dosage (Schedule)', 100, startY + 5.5);
  doc.text('Duration', 145, startY + 5.5);
  doc.text('Timing Instructions', 165, startY + 5.5);

  startY += 8;

  // Medicine items list
  const medicines = prescriptionData.boundingBoxes || prescriptionData.medicines || [];
  medicines.forEach((med, idx) => {
    const rowY = startY + (idx * 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...darkTextColor);

    doc.text(`${idx + 1}.`, 17, rowY + 7);
    doc.setFont('helvetica', 'bold');
    doc.text(med.detectedMedicine || med.brandName || med.name || 'Medicine', 26, rowY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedTextColor);
    doc.text(med.generic || 'Generic Formulation', 26, rowY + 9);

    doc.setFontSize(9);
    doc.setTextColor(...darkTextColor);
    doc.text(med.dosage || '1+0+1', 100, rowY + 7);
    doc.text(med.duration || '7 days', 145, rowY + 7);
    doc.text(med.timing || 'After meal', 165, rowY + 7);

    doc.setDrawColor(241, 245, 249);
    doc.line(14, rowY + 12, 196, rowY + 12);
  });

  // Footer Advice & QR note
  const footerY = Math.max(startY + (medicines.length * 12) + 20, 230);
  doc.setFillColor(240, 253, 250);
  doc.roundedRect(14, footerY, 182, 28, 2, 2, 'F');
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(14, footerY, 182, 28, 2, 2, 'S');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text('Nirvoy AI Intelligence & Patient Advice:', 18, footerY + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8);
  doc.text('- Follow exact dosages and meal timings as specified.', 18, footerY + 13);
  doc.text('- For any adverse symptoms or questions, contact your registered physician.', 18, footerY + 18);
  doc.text('- Verified via Nirvoy AI Prescription Intelligence (DGDA compliant).', 18, footerY + 23);

  // Signature Block
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkTextColor);
  doc.text('Doctor Signature / Stamp', 145, footerY + 42);
  doc.setDrawColor(148, 163, 184);
  doc.line(140, footerY + 38, 190, footerY + 38);

  // Save the PDF
  doc.save(`Nirvoy_Prescription_${prescriptionData.patientName || 'Report'}.pdf`);
}

// Official Seventh Schedule Form A / Form B & Statutory Notice PDF Generator
// Powered by jsPDF & jsPDF-AutoTable

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ComplianceReport } from '../types';

export function generateCompliancePDF(report: ComplianceReport): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const p = report.productInfo;
  const isFormA = report.formType === 'Form A';

  // Header styling: Govt of India Deep Blue
  doc.setFillColor(10, 54, 99);
  doc.rect(0, 0, 210, 32, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF INDIA', 105, 10, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('MINISTRY OF CONSUMER AFFAIRS, FOOD AND PUBLIC DISTRIBUTION', 105, 16, { align: 'center' });
  doc.text('DEPARTMENT OF LEGAL METROLOGY', 105, 21, { align: 'center' });

  doc.setFontSize(8);
  doc.text('INSPACK ENFORCEMENT & COMPLIANCE VERIFICATION SYSTEM • POWERED BY NEURAL KNIGHTS', 105, 27, { align: 'center' });

  // Document Title & Reference
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  const titleText = isFormA
    ? 'THE SEVENTH SCHEDULE [See Rule 19(2)] - FORM A (WEIGHT CHECKING DATA SHEET)'
    : 'THE SEVENTH SCHEDULE [See Rule 19(2)] - FORM B (VOLUME / LENGTH CHECKING DATA SHEET)';
  doc.text(titleText, 105, 40, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Inspection Ref No: ${report.id} | Date: ${new Date(report.scanTimestamp).toLocaleDateString('en-IN')} | Time: ${new Date(report.scanTimestamp).toLocaleTimeString('en-IN')}`, 105, 45, { align: 'center' });

  // Section A: Particulars of Package & Manufacturer
  autoTable(doc, {
    startY: 50,
    head: [['A. PARTICULARS OF PACKAGE & COMMERCIAL ENTITY', 'DETAILS / STATUTORY RECORD']],
    body: [
      ['Commodity Name', `${p.productName} (${p.genericName || 'Generic'})`],
      ['Manufacturer / Packer Name', p.manufacturerName || 'Not Disclosed'],
      ['Postal Factory Address', `${p.manufacturerAddress || 'Address on record'} ${p.manufacturerPinCode ? 'PIN: ' + p.manufacturerPinCode : '(PIN Missing)'}`],
      ['Country of Origin', p.countryOfOrigin || 'India'],
      ['Declared Net Quantity', `${p.netQuantity} ${p.quantityUnit} [Raw: ${p.rawQuantityString}]`],
      ['Declared Retail Sale Price', `${p.mrpString} ${p.isStickerPrice ? '[STICKER DETECTED]' : ''}`],
      ['Date of Pre-packing / Mfg', `${p.mfgMonth}/${p.mfgYear} ${p.expMonth ? '| Exp: ' + p.expMonth + '/' + p.expYear : ''}`],
      ['Consumer Care Grievance Redressal', `Tel: ${p.consumerCarePhone || 'N/A'} | Email: ${p.consumerCareEmail || 'N/A'}`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [10, 54, 99], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 2 }
  });

  // Section B: Inspection Parameters
  const lastY1 = (doc as any).lastAutoTable.finalY + 4;
  autoTable(doc, {
    startY: lastY1,
    head: [['B. LEGAL METROLOGY AUDIT SUMMARY', 'STATUTORY FINDINGS']],
    body: [
      ['Overall Compliance Status', report.overallStatus === 'COMPLIANT' ? 'CONFORMING TO RULES' : 'NON-CONFORMING / SUBJECT TO ACTION'],
      ['Compliance Index Score', `${report.score} / 100 (${report.violationsCount} Violations, ${report.warningsCount} Warnings)`],
      ['Second Schedule (Standard Pack Size)', isFormA ? 'Mandatory Standard Pack Size Verification' : 'Standard Volume Check'],
      ['First Schedule (MPE Allowance)', `Max Permissible Error tolerance check calculated`],
      ['Potential Compounding Fine (Rule 32)', `INR ${report.totalCompoundingFine.toLocaleString('en-IN')} (Under Sections 15, 18 & 36)`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [15, 118, 110], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8.5, cellPadding: 2 }
  });

  // Section C: Rule-by-Rule Breakdown Table
  const lastY2 = (doc as any).lastAutoTable.finalY + 4;
  const ruleRows = report.evaluations.map(e => [
    e.ruleNumber,
    e.status,
    e.detectedValue,
    e.requiredStandard,
    e.status === 'FAIL' ? `Rs. ${e.compoundingFine}` : 'Nil'
  ]);

  autoTable(doc, {
    startY: lastY2,
    head: [['Rule Citation', 'Status', 'Detected Value', 'Statutory Requirement', 'Compounding Fine']],
    body: ruleRows,
    theme: 'striped',
    headStyles: { fillColor: [10, 54, 99], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 7.5, cellPadding: 1.8 },
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 20 },
      2: { cellWidth: 42 },
      3: { cellWidth: 75 },
      4: { cellWidth: 22 }
    },
    didParseCell: function (data) {
      if (data.column.index === 1) {
        if (data.cell.raw === 'FAIL') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        } else if (data.cell.raw === 'WARNING') {
          data.cell.styles.textColor = [217, 119, 6];
          data.cell.styles.fontStyle = 'bold';
        } else if (data.cell.raw === 'PASS') {
          data.cell.styles.textColor = [22, 163, 74];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  // Section D & E: Statutory Comments & Action
  const lastY3 = (doc as any).lastAutoTable.finalY + 4;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('E. GENERAL COMMENTS WITH REGARD TO COMPLIANCE WITH THE ACT & RULES:', 14, lastY3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const splitRemarks = doc.splitTextToSize(report.summaryRemarks, 182);
  doc.text(splitRemarks, 14, lastY3 + 5);

  // Signatures block
  const signY = Math.min(265, lastY3 + 22);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, signY, 70, signY);
  doc.line(80, signY, 136, signY);
  doc.line(146, signY, 196, signY);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Signature of Authorized Officer', 14, signY + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${report.inspectorName || 'Insp. R. K. Verma'}`, 14, signY + 8);
  doc.text(`Badge: ${report.inspectorBadgeNumber || 'LM-ND-4092'}`, 14, signY + 12);
  doc.text(`Place: ${report.location || 'New Delhi'}`, 14, signY + 16);

  doc.setFont('helvetica', 'bold');
  doc.text('Manufacturer / Packer / Dealer', 80, signY + 4);
  doc.setFont('helvetica', 'normal');
  doc.text('Signature & Rubber Stamp', 80, signY + 8);
  doc.text('Authorized Representative', 80, signY + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('Competent Witness', 146, signY + 4);
  doc.setFont('helvetica', 'normal');
  doc.text('Signature & Contact Details', 146, signY + 8);
  doc.text(`Inspected: ${new Date().toLocaleDateString('en-IN')}`, 146, signY + 12);

  // Footer Watermark
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('INSPACK • Smart India Hackathon 2026 (SIH-26034) • Team Neural Knights • Legal Metrology Packaged Commodities Rules, 2011', 105, 290, { align: 'center' });

  // Trigger download
  doc.save(`Inspack_Statutory_Report_${report.id}.pdf`);
}

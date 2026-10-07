import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import fs from 'fs';
import path from 'path';

async function generatePDF() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Colors
  const cNavy = [10, 54, 99];
  const cTeal = [15, 118, 110];
  const cDark = [15, 23, 42];
  const cGray = [71, 85, 105];
  const cLightBg = [248, 250, 252];
  const cBorder = [203, 213, 225];
  const cRed = [220, 38, 38];
  const cGreen = [22, 163, 74];

  let y = margin;

  function checkY(needed) {
    if (y + needed > pageHeight - 18) {
      doc.addPage();
      y = margin + 12; // leave room for running header
    }
  }

  function addRunningHeaderFooter() {
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Header (Pages 2+)
      if (i > 1) {
        doc.setFillColor(...cNavy);
        doc.rect(0, 0, pageWidth, 9, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.text('INSPACK • SIH-26034 • Ministry of Consumer Affairs, Food & Public Distribution', margin, 6.2);
        doc.setFont('helvetica', 'normal');
        doc.text('Legal Metrology Inspection Blueprint', pageWidth - margin, 6.2, { align: 'right' });
      }

      // Footer (All pages)
      doc.setDrawColor(...cBorder);
      doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);
      doc.setTextColor(...cGray);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('SMART INDIA HACKATHON 2026 • Problem Statement ID: SIH-26034 • Team Neural Knights', margin, pageHeight - 6.5);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6.5, { align: 'right' });
    }
  }

  function renderSectionHeader(letter, title) {
    checkY(16);
    y += 4;
    doc.setFillColor(...cNavy);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${letter}. ${title.toUpperCase()}`, margin + 3.5, y + 5.5);
    y += 11;
  }

  function renderSubHeader(title) {
    checkY(10);
    y += 2;
    doc.setTextColor(...cTeal);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, y + 4);
    doc.setDrawColor(...cTeal);
    doc.line(margin, y + 5.5, margin + doc.getTextWidth(title) + 2, y + 5.5);
    y += 8;
  }

  function renderParagraph(text, isBold = false) {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...cDark);
    const lines = doc.splitTextToSize(text, contentWidth);
    checkY(lines.length * 4.2 + 2);
    doc.text(lines, margin, y);
    y += lines.length * 4.2 + 2;
  }

  function renderCleanBullet(boldPrefix, normalText) {
    doc.setFontSize(8);
    checkY(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cNavy);
    const pfx = `• ${boldPrefix}: `;
    const pfxW = doc.getTextWidth(pfx);
    
    doc.text(pfx, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cDark);

    const firstLineAvail = contentWidth - pfxW;
    const words = normalText.split(' ');
    let currentLine = '';
    let isFirstLine = true;

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
      const maxW = isFirstLine ? firstLineAvail : (contentWidth - 6);
      if (doc.getTextWidth(testLine) > maxW) {
        if (isFirstLine) {
          doc.text(currentLine, margin + pfxW, y);
          y += 4;
          checkY(5);
          isFirstLine = false;
        } else {
          doc.text(currentLine, margin + 6, y);
          y += 4;
          checkY(5);
        }
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      if (isFirstLine) {
        doc.text(currentLine, margin + pfxW, y);
        y += 4.5;
      } else {
        doc.text(currentLine, margin + 6, y);
        y += 4.5;
      }
    }
  }

  function renderCardBox(title, linesArray, borderColor = cNavy, bgColor = cLightBg) {
    checkY(linesArray.length * 4.5 + 12);
    const boxHeight = linesArray.length * 4.5 + 10;
    doc.setDrawColor(...borderColor);
    doc.setFillColor(...bgColor);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...borderColor);
    doc.text(title, margin + 4, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...cDark);
    let lineY = y + 10;
    for (const l of linesArray) {
      doc.text(l, margin + 4, lineY);
      lineY += 4.2;
    }
    y += boxHeight + 4;
  }

  // =========================================================================
  // COVER / DOCUMENT HEADER
  // =========================================================================
  doc.setFillColor(...cNavy);
  doc.rect(0, 0, pageWidth, 42, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SMART INDIA HACKATHON 2026', 105, 11, { align: 'center' });

  doc.setFontSize(18);
  doc.text('INSPACK', 105, 19, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('AI-Based Inspection & Compliance System for Packaged Commodities', 105, 25, { align: 'center' });
  doc.text('Legal Metrology (Packaged Commodities) Rules, 2011 • SIH-26034', 105, 30, { align: 'center' });

  doc.setFontSize(7.5);
  doc.text('Ministry of Consumer Affairs, Food & Public Distribution • Department of Consumer Affairs', 105, 36, { align: 'center' });

  y = 48;

  // Metadata Banner Box
  doc.setDrawColor(...cBorder);
  doc.setFillColor(...cLightBg);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cNavy);
  doc.text('PROBLEM STATEMENT ID:', margin + 4, y + 6);
  doc.text('THEME & CATEGORY:', margin + 4, y + 11);
  doc.text('TEAM / PROTOTYPE URL:', margin + 4, y + 16);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...cDark);
  doc.text('SIH-26034 (Software System to check compliance of Packaged Commodities)', margin + 46, y + 6);
  doc.text('Agriculture, FoodTech & Rural Development / Governance • Category: Software', margin + 46, y + 11);
  doc.text('Team Neural Knights • Live Demo: https://inspacknksih2026.vercel.app/', margin + 46, y + 16);

  y += 25;

  // =========================================================================
  // SECTION A: PROJECT UNDERSTANDING
  // =========================================================================
  renderSectionHeader('A', 'Project Understanding');
  renderParagraph(
    'INSPACK is a specialized, AI-assisted decision-support system developed for the Legal Metrology Division, Department of Consumer Affairs (Ministry of Consumer Affairs, Food & Public Distribution) under Problem Statement ID SIH-26034. Pre-packaged commodities sold across Indian retail outlets, supermarkets, and rapid e-commerce dark stores are legally governed by the Legal Metrology Act, 2009 and the Legal Metrology (Packaged Commodities) Rules, 2011 (LMPC Rules, 2011).'
  );
  renderParagraph(
    'Currently, enforcement officers conduct packaging compliance inspections manually. This requires visually verifying over twenty mandatory declarations with magnifying glasses and physical rulers, checking numeral heights against Principal Display Panel (PDP) area tables, cross-referencing multi-page gazette schedules for allowed standard pack sizes, and drafting handwritten Form A (Weight) or Form B (Volume) inspection sheets. This manual workflow takes 20 to 30 minutes per packaged commodity, creating severe enforcement bottlenecks across millions of retail SKUs.'
  );
  renderParagraph(
    'INSPACK resolves this bottleneck by converting multi-view physical packaging photographs (Front, Back, Side) into structured legal data. It evaluates this data through a 100% deterministic statutory rules engine, highlights non-compliant declarations with color-coded on-image bounding boxes, and automatically compiles court-admissible Seventh Schedule Form A & Form B inspection dossiers with photographic evidence and Section 65B electronic evidence certification in under 60 seconds.'
  );

  // =========================================================================
  // SECTION B: CURRENT PROTOTYPE INVENTORY
  // =========================================================================
  renderSectionHeader('B', 'Current Prototype Inventory');
  renderParagraph('Verified against the live INSPACK codebase (React 19 / TypeScript / Vite / LocalStorage / Cloud Firestore):', true);

  const inventoryRows = [
    ['Multi-View Image Intake', 'DEMONSTRATED IN PROTOTYPE', 'Captures Front PDP, Back declarations, and Side panel via camera or file upload with guided viewfinder overlay.', 'LiveCameraScanner.tsx\nApp.tsx:L264', 'High\n(Slide 2 & 3)'],
    ['Sharpness / Blur Pre-Check', 'DEMONSTRATED IN PROTOTYPE', 'Measures 2D grayscale gradient variance (Laplacian proxy). Warns inspector if image is blurry (<10.5) before OCR.', 'ocrService.ts:L12\nCanvas 2D filter', 'High\n(Slide 4)'],
    ['Multimodal Vision Extraction', 'DEMONSTRATED IN PROTOTYPE (AI-Assisted)', 'Multimodal Gemini Vision API extracts 20+ statutory entities and 2D bounding boxes using a strict legal prompt.', 'ocrService.ts:L220\ngenerativeLanguage API', 'High\n(Slide 3)'],
    ['100% Offline Edge OCR', 'DEMONSTRATED IN PROTOTYPE', 'Client-side Tesseract.js worker executes offline text extraction on contrast-stretched canvas with regex parser fallback.', 'ocrService.ts:L194\nparseLabelDeclarations', 'Critical\n(Slide 4)'],
    ['Deterministic Rules Engine', 'DEMONSTRATED IN PROTOTYPE', 'Codifies Rules 6(1)(a-g), 6(2), 6(10), 6(11), 7, 8, 9, 10, 13, 18, and 22 into pure deterministic validation logic.', 'complianceEngine.ts:L246\n11 core rules', 'Core\n(Slide 2 & 3)'],
    ['Second Schedule Pack Sizes', 'DEMONSTRATED IN PROTOTYPE', 'Validates net quantity against prescribed standard package sizes across 19 commodity classes (Item 1 to 19).', 'standardPackSizes.ts\ncomplianceEngine.ts:L848', 'High\n(Slide 2 & 3)'],
    ['First Schedule MPE Limits', 'DEMONSTRATED IN PROTOTYPE', 'Computes Maximum Permissible Error tolerance shortfall based on declared net mass/volume (Table I Sl. No. i–ix).', 'mpeLimits.ts:L14\ncomplianceEngine.ts:L911', 'High\n(Slide 3)'],
    ['Evidence Visualizer & Pins', 'DEMONSTRATED IN PROTOTYPE', 'Renders interactive colored bounding boxes directly over package artwork with status tags (PASS, FAIL, WARN).', 'EvidenceVisualizer.tsx\nApp.tsx:L359', 'Primary Visual\n(Slide 2 & 5)'],
    ['Seventh Schedule Form A/B', 'DEMONSTRATED IN PROTOTYPE', 'Dynamic jsPDF engine compiles official 2-page statutory dossier: Page 1 Form A/B sheet; Page 2 Photographic Evidence.', 'pdfReportGenerator.ts:L85\njspdf-autotable', 'Primary Visual\n(Slide 3 & 5)'],
    ['Rule 32 Compounding Fines', 'DEMONSTRATED IN PROTOTYPE', 'Calculates compounding penalties under Sections 15, 18, and 36(1) of the Legal Metrology Act (Rs. 2,000 to Rs. 25,000).', 'complianceEngine.ts:L1153\ncustomRulesService.ts', 'High\n(Slide 2 & 5)'],
    ['E-Commerce Listing Auditor', 'DEMONSTRATED IN PROTOTYPE', 'Audits online product listing URLs (Amazon, Blinkit, Flipkart) for mandatory digital Rule 10 PDP declarations.', 'EcommerceAuditTab.tsx\nocrService.ts:L650', 'High\n(Slide 5)'],
    ['Brand Pre-Check Portal', 'DEMONSTRATED IN PROTOTYPE', 'Packaging artwork pre-printing simulator for FMCG manufacturers to verify labels before mass printing.', 'ManufacturerSelfAudit.tsx\nRole: MANUFACTURER', 'High\n(Slide 5)'],
    ['National Surveillance Hub', 'DEMONSTRATED IN PROTOTYPE', 'Directorate-level intelligence dashboard displaying national compliance heatmaps, high-violation categories, repeat offenders.', 'NationalSurveillanceHub.tsx\nRole: SURVEILLANCE', 'Medium\n(Slide 5)'],
    ['Admin Gazette Rule Editor', 'DEMONSTRATED IN PROTOTYPE', 'Allows departmental administrators to configure compounding fines and toggle rules dynamically without redeployment.', 'customRulesService.ts\nAdminControlCenter.tsx', 'High\n(Slide 4)'],
    ['Local-First Vault & Sync', 'DEMONSTRATED IN PROTOTYPE', 'LocalStorage and IndexedDB local storage with BroadcastChannel cross-tab sync and optional cloud backup.', 'dbService.ts\ncloudService.ts', 'Medium\n(Slide 3 & 4)'],
    ['Multi-Language Support', 'DEMONSTRATED IN PROTOTYPE', 'Full UI localization into English, Hindi, and Telugu, including localized rule explanations and quantity units.', 'i18nService.ts\n(en, hi, te)', 'Medium\n(Slide 4)'],
    ['Bluetooth Weighing Scales', 'PROPOSED / FUTURE', 'Direct Web Bluetooth / USB serial gateway to capture gross, tare, and net sample weights directly from certified scales.', 'Architecture Roadmap\nNot in current code', 'Future Work\n(Slide 4)']
  ];

  autoTable(doc, {
    startY: y,
    head: [['Feature / Capability', 'Implementation Status', 'How It Works', 'Evidence in Code / UI', 'PPT Relevance']],
    body: inventoryRows,
    theme: 'grid',
    headStyles: { fillColor: cNavy, textColor: [255, 255, 255], fontSize: 7, fontStyle: 'bold' },
    styles: { fontSize: 6.5, cellPadding: 1.5, overflow: 'linebreak' },
    columnStyles: {
      0: { cellWidth: 31 },
      1: { cellWidth: 29 },
      2: { cellWidth: 58 },
      3: { cellWidth: 38 },
      4: { cellWidth: 24 }
    },
    didParseCell: function (data) {
      if (data.column.index === 1) {
        if (data.cell.raw.includes('DEMONSTRATED')) {
          data.cell.styles.textColor = cGreen;
          data.cell.styles.fontStyle = 'bold';
        } else if (data.cell.raw.includes('PROPOSED')) {
          data.cell.styles.textColor = cRed;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  y = doc.lastAutoTable.finalY + 6;

  // =========================================================================
  // SECTION C: PROTOTYPE TECH STACK
  // =========================================================================
  renderSectionHeader('C', 'Prototype Tech Stack');
  renderParagraph('The technologies currently active in the demonstrator prototype:', true);

  const stackRows = [
    ['React 19 + TypeScript + Vite', 'Frontend framework, single-page application router, type-safe state machine, and reactive UI.', 'Delivers instant client-side rendering, zero build lag, and robust typing for complex legal rules.'],
    ['Tailwind CSS v4', 'Government-grade responsive interface, high-contrast badges, and mobile-optimized inspection cards.', 'Ensures accessible, clean UI adhering to national government portal design standards.'],
    ['Google Gemini Vision API', 'Cloud multimodal vision engine extracting 20+ statutory fields and 2D bounding boxes.', 'Enables rapid validation of end-to-end multimodal packaging inspection without local GPU infrastructure during hackathon prototyping.'],
    ['Tesseract.js (Web Worker)', '100% offline optical character recognition running client-side inside a browser Web Worker.', 'Guarantees the inspector can extract text and run rule checks in remote rural markets without Internet connectivity.'],
    ['HTML5 Canvas API', 'Luminance grayscaling, contrast stretching, and 2D gradient-variance sharpness calculation.', 'Pre-processes images on-device to maximize character recognition clarity before ingestion.'],
    ['jsPDF & jsPDF-AutoTable', 'Dynamic client-side compilation of official 2-page Seventh Schedule Form A & B inspection dossiers.', 'Generates pixel-perfect, court-ready PDF documents client-side with zero server roundtrips.'],
    ['LocalStorage & BroadcastChannel', 'Local-first persistence of inspection vaults and zero-latency cross-tab event synchronization.', 'Provides instant offline data access without requiring an active database server.'],
    ['Google Cloud Firestore REST', 'Cloud document backup and cross-device inspection record synchronization.', 'Lightweight document persistence requiring zero dedicated backend maintenance.'],
    ['Cloudinary Unsigned Media', 'Secure cloud storage of uploaded packaging exhibit photos and PDF evidence documents.', 'Provides instant media URLs for digital inspection dossiers and remote review.']
  ];

  autoTable(doc, {
    startY: y,
    head: [['Technology', 'Actual Usage in Prototype', 'Why Used in Prototype']],
    body: stackRows,
    theme: 'grid',
    headStyles: { fillColor: cNavy, textColor: [255, 255, 255], fontSize: 7, fontStyle: 'bold' },
    styles: { fontSize: 6.8, cellPadding: 1.6 },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 70 },
      2: { cellWidth: 70 }
    }
  });

  y = doc.lastAutoTable.finalY + 6;

  // =========================================================================
  // SECTION D: FINAL / PRODUCTION ARCHITECTURE
  // =========================================================================
  renderSectionHeader('D', 'Final / Production Architecture (Government Deployment)');
  renderParagraph('A realistic, secure, maintainable architecture suitable for sovereign national deployment (NIC / MeghRaj Cloud):', true);

  const prodRows = [
    ['Client Presentation Layer', 'Progressive Web App (PWA) & Native Mobile App (Flutter / React Native)', 'Field inspection app for officers with offline support, camera integration, and desktop portal for directors.', 'Works across low-cost government Android tablets, smartphones, and departmental desktop workstations.'],
    ['Sovereign Vision Pipeline', 'Sovereign Document AI / Fine-Tuned OCR (TrOCR, PaddleOCR, LayoutLMv3, YOLOv8)', 'Replaces third-party commercial APIs (like Gemini) with a locally hosted, sovereign open-source model running on NIC / MeghRaj GPUs.', 'Data Sovereignty & Security: Zero packaging or manufacturer data leaves Indian sovereign cloud infrastructure. Fully air-gapped capable.'],
    ['Statutory Rules Engine', 'Deterministic Python / Rust Rule Service with Rule Versioning Engine', 'Executes statutory logic (LMPC 2011, amendments, MPE tables) with effective-date tagging and audit trails.', 'Guarantees 100% deterministic, explainable, and legally defensible outputs with zero LLM hallucination risk in court.'],
    ['Hardware Interop Service', 'Web Bluetooth & Serial API Gateway', 'Direct interface to Class II & III verified electronic weighing balances in field testing vans and laboratories.', 'Automates net weight capture into Form A data sheets, eliminating manual data tampering or transcription errors.'],
    ['Database & Evidence Vault', 'PostgreSQL + TimescaleDB + MinIO / S3 Object Store', 'Stores structured inspection records, audit trails, and high-resolution packaging exhibits with SHA-256 digital hashes.', 'Delivers ACID compliance, long-term legal evidence preservation, and fast historical trend queries.'],
    ['Statutory Integration Layer', 'REST APIs connecting to National Consumer Helpline (NCH 1915), e-Daakhil, and MCA21', 'Auto-routes confirmed non-compliance notices to manufacturers and auto-populates corporate CIN/address data.', 'Unifies consumer affairs enforcement across state departments and national consumer courts.'],
    ['Security & Legal Signing', 'Section 65B Bharatiya Sakshya Adhiniyam (BSA) Cryptographic Signing & PKI', 'Signs every inspection sheet with the officer\'s digital token/DSC and time-stamps image hashes.', 'Ensures electronic evidence is admissible in court without risk of evidentiary challenge.']
  ];

  autoTable(doc, {
    startY: y,
    head: [['Architecture Layer', 'Proposed Production Technology', 'Purpose in Final System', 'Why Appropriate for Government Deployment']],
    body: prodRows,
    theme: 'grid',
    headStyles: { fillColor: cTeal, textColor: [255, 255, 255], fontSize: 7, fontStyle: 'bold' },
    styles: { fontSize: 6.5, cellPadding: 1.5 },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 46 },
      2: { cellWidth: 51 },
      3: { cellWidth: 51 }
    }
  });

  y = doc.lastAutoTable.finalY + 6;

  // =========================================================================
  // SECTION E: CORE INNOVATION
  // =========================================================================
  renderSectionHeader('E', 'Core Innovation');
  renderParagraph(
    'Current Gap: Enforcement officers manually inspect packaging with plastic rulers and magnifying glasses, cross-referencing complex gazette schedules across hundreds of pages. Existing public OCR tools merely extract raw text into a box—they do not understand legal metrology, cannot determine whether a font size is 1mm too small for a given package area, do not know that 120g biscuits violate the Second Schedule, and cannot produce statutory court-ready inspection sheets.'
  );
  renderParagraph(
    'INSPACK Contribution: Bridges computer vision with a deterministic statutory legal metrology engine. Instead of merely displaying detected text, INSPACK maps visual elements directly to the gazette clauses of the Legal Metrology (Packaged Commodities) Rules, 2011. It automatically validates: (1) Presence of all mandatory declarations (Rule 6); (2) Conspicuous numeral height compliance based on package area (Rule 7 & Table I); (3) SI unit correctness (Rule 13); (4) Unauthorized price-hike sticker detection and dual pricing (Rule 18); (5) Mandatory standard packaging sizes (Second Schedule); and (6) Maximum Permissible Error tolerance shortfall (First Schedule).'
  );
  renderParagraph(
    'Practical Benefit: An inspection that previously took an officer 20 to 30 minutes of manual measurement and handwritten form-filling is structured in seconds into an evidence-backed finding, generating an official Seventh Schedule Form A / Form B inspection sheet with cryptographic legal integrity.'
  );

  // =========================================================================
  // SECTION F: SIX-SLIDE CONTENT PLAN
  // =========================================================================
  renderSectionHeader('F', 'Six-Slide Content Plan (SIH 2026 Format)');

  const slides = [
    {
      num: 1,
      title: 'TITLE PAGE',
      purpose: 'Establish project identity, problem statement alignment, and institutional ownership under the Ministry of Consumer Affairs.',
      message: 'AI-powered decision-support system to automate packaged commodity legal metrology compliance under SIH-26034.',
      content: [
        'Project Name: INSPACK (AI Legal Metrology Compliance Inspection System)',
        'Problem Statement ID: SIH-26034 | Ministry: Consumer Affairs, Food & Public Distribution',
        'Theme: Agriculture, FoodTech & Rural Development / Governance | Category: Software',
        'Team: Neural Knights (Ideas • Intelligence • Impact — Tech for a Fairer Market)',
        'Live Demonstration Prototype: https://inspacknksih2026.vercel.app/'
      ],
      visual: 'Central INSPACK shield emblem co-branded with Government of India and SIH 2026 emblems. Background preview tag of an inspected retail package with bounding boxes alongside a Seventh Schedule Form A sheet.',
      structure: 'Three-pill header bar: [SIH-26034] | [Ministry of Consumer Affairs] | [LMPC Rules 2011]. Main title centered in Deep Navy. Two sub-cards at bottom: Enforcement Challenge vs INSPACK Solution.',
      example: 'Thumbnail mockup of multi-view scan (Front PDP, Back declarations) showing green and red compliance pins.',
      speaker: 'Respected evaluators, pre-packaged commodities dominate Indian retail. Under the Legal Metrology Act, 2009 and Packaged Commodities Rules, 2011, every package must carry accurate declarations—from standard pack sizes to legible font heights and un-tampered MRPs. Enforcement officers inspect millions of packages manually. We present INSPACK—an AI-assisted inspection-support system built for the Department of Consumer Affairs that reads multi-view packaging labels, verifies them against deterministic legal rules, and produces official, court-ready Seventh Schedule Form A and Form B inspection sheets in seconds.',
      avoid: 'Avoid dense paragraphs, unnecessary team member bios, generic buzzwords, or unrelated themes. Do NOT reference PyroVision, NTRO, or fire monitoring.',
      protoVsFinal: 'Demonstrated: Live web prototype running multi-role inspection workflows. Final Product: Nationwide departmental deployment integrated with National Consumer Helpline and state enforcement directories.',
      status: 'Problem Statement & Ministry: [IMPLEMENTED / VERIFIED] | Prototype URL: [DEMONSTRATED]'
    },
    {
      num: 2,
      title: 'PROPOSED SOLUTION',
      purpose: 'Clearly explain how INSPACK works end-to-end and demonstrate its core innovation: connecting physical package pixels to statutory legal rules.',
      message: 'INSPACK transforms packaging photos into structured, rule-checked compliance findings and official inspection dossiers.',
      content: [
        'Core Problem: Manual inspection of mandatory declarations is slow, prone to visual fatigue, and produces non-standardized paperwork.',
        'Capture: Multi-view photo acquisition of Front, Back, and Side panels via mobile/web.',
        'Extract: Automated extraction of mandatory declarations (Name, MRP, Date, Net Qty, PIN, Care).',
        'Verify: Deterministic checking against LMPC 2011 Rules, Second Schedule sizes, and Table-I font heights.',
        'Report: Instant generation of official Seventh Schedule Form A/B data sheets with photographic evidence.',
        'Decision Statuses: 🟢 COMPLIANT (Conforms to all rules) | 🟡 NEEDS REVIEW (Borderline font or missing PIN) | 🔴 VIOLATION (Illegal unit, tampered price sticker, non-standard pack size).'
      ],
      visual: 'Horizontal 5-stage sequential process flow diagram (Capture → Extract → Evaluate → Evidence → Action) alongside a split visual showcase comparing an inspected package with on-image bounding boxes next to the generated Form A report.',
      structure: '[1. PACKAGE CAPTURE] ➔ [2. AI EXTRACTION] ➔ [3. RULES ENGINE] ➔ [4. EVIDENCE OVERLAY] ➔ [5. STATUTORY REPORT]',
      example: 'Amul Taaza Toned Milk (1 L): Detected Numeral Height: 2.2 mm (Table I mandates minimum 4.0 mm for > 500ml) ➔ Rule 7 Violation. Customer Care: Helpline phone present, but email missing ➔ Rule 6(2) Warning. Compounding Fine: Rs. 2,000.',
      speaker: 'On Slide 2, we present our end-to-end solution. An officer captures the package panels using our guided viewfinder. The system extracts the declarations—such as net quantity, MRP, and manufacturing details. Then, our deterministic rules engine steps in. Unlike generic AI that simply reads text, INSPACK checks legal validity: Is the quantity in valid SI units? Does a 1-liter milk pack have numerals at least 4mm tall? Was the MRP altered using a sticker? If an infraction occurs, the officer sees exact bounding boxes with gazette citations and can generate an official Form A or Form B report with one click.',
      avoid: 'Do not claim INSPACK "replaces" enforcement officers or "certifies" products autonomously. Do not use generic OCR jargon without connecting it to legal metrology requirements.',
      protoVsFinal: 'Demonstrated: Multi-view inspection, on-image bounding box overlay, Form A/B generation, and compounding fee calculation. Planned: Automatic camera edge-detection and hardware-assisted dimension calibration.',
      status: 'Rule checks & bounding box overlay: [DEMONSTRATED IN PROTOTYPE] | Test Case (Amul Milk): [DEMONSTRATED IN PROTOTYPE]'
    },
    {
      num: 3,
      title: 'TECHNICAL APPROACH',
      purpose: 'Present a clear, government-appropriate technical architecture separating the field client, processing pipeline, rules engine, and evidence storage.',
      message: 'A modular, local-first architecture combining sovereign computer vision with a deterministic statutory legal engine.',
      content: [
        'Client Layer: Responsive Progressive Web App (PWA) with live camera viewfinder and offline cache.',
        'Vision & Extraction: Grayscale contrast enhancement, blur detection, and multi-view label extraction.',
        'LMPC Rules Engine: Deterministic rule evaluator covering Rules 6, 7, 8, 9, 10, 13, 18, and Schedules I & II.',
        'Evidence & Dossier: Form A & Form B PDF generator with Section 65B Bharatiya Sakshya Adhiniyam certification.',
        'Persistence & Sync: Local-first offline vault with secure cloud backup.',
        'Rule Engine Coverage: Rule 6(1) Declarations • Rule 7 Table I Font Height • Rule 13 SI Units • Rule 18 Price Tampering • Second Schedule Pack Sizes • First Schedule MPE Deficiency.'
      ],
      visual: 'Clean 5-tier technical architecture block diagram with a callout box comparing Current Prototype Stack vs Proposed Sovereign Government Architecture.',
      structure: 'Tier 1: Client Layer ➔ Tier 2: Pre-Processing & Vision ➔ Tier 3: Deterministic Rules Engine ➔ Tier 4: Evidence & Dossier Engine ➔ Tier 5: Departmental Integration Repository.',
      example: 'Snippet of the generated Seventh Schedule Form A (Weight Checking Data Sheet) highlighting the statutory signature block (Authorized Officer, Manufacturer, Independent Witness).',
      speaker: 'Slide 3 outlines our technical architecture. We designed INSPACK with a modular, local-first philosophy. In the field, an officer needs the tool to work even without reliable 5G connectivity. Our pipeline first checks image sharpness, normalizes contrast, and extracts text. That data feeds into our deterministic legal rules engine—which never guesses. It evaluates against codified statutory tables: Rule 7 numeral heights, Second Schedule pack sizes, and First Schedule error margins. Finally, our dossier engine compiles an official Seventh Schedule Form A or B report complete with Section 65B evidentiary certification.',
      avoid: 'Avoid throwing 25 random open-source logos onto the slide. Do NOT hide the fact that the prototype uses Gemini Vision, but explain clearly that the production version will use a sovereign NIC-hosted open-source model for national data security.',
      protoVsFinal: 'Prototype: Uses Gemini Vision API for multimodal extraction + Tesseract.js offline fallback. Final System: Sovereign on-premise NIC deployment with fine-tuned OCR/LayoutLM, Bluetooth scale integration, and e-Daakhil API links.',
      status: 'Local OCR + Rules Engine + PDF Engine: [IMPLEMENTED IN CODE] | Sovereign NIC Cloud Roadmap: [PLANNED / ARCHITECTURAL TARGET]'
    },
    {
      num: 4,
      title: 'FEASIBILITY AND VIABILITY',
      purpose: 'Prove that INSPACK is technically feasible to build, operationally usable by field inspectors, and viable for nationwide rollout across India.',
      message: 'A low-cost, offline-resilient, and explainable decision-support tool tailored to real-world enforcement constraints.',
      content: [
        'Technical Feasibility: Runs on standard smartphones/tablets—no proprietary optical hardware needed. Dual-engine: cloud multimodal + 100% offline edge OCR.',
        'Operational Feasibility: Simple 3-step officer workflow (Aim ➔ Inspect ➔ Generate Sheet). Eliminates 20+ minutes of manual measuring and handwritten paperwork.',
        'Economic Viability: Zero field hardware CapEx—officers use existing government mobile devices. Scalable across millions of retail SKUs.',
        'Challenge 1 (Blur / Lighting): Mitigated via automated Laplacian gradient sharpness pre-check.',
        'Challenge 2 (No Internet in Field): Mitigated via client-side Tesseract.js worker + local offline vault.',
        'Challenge 3 (Curved / Crinkled Pouches): Mitigated via multi-view (Front/Back/Side) panel segmentation.',
        'Challenge 4 (Changing Legal Rules): Mitigated via dynamic Gazette Amendment Configuration Engine.'
      ],
      visual: '3 Feasibility Pillar Cards (Technical, Operational, Economic) + Bottom 2x2 "Challenge vs Mitigation" grid.',
      structure: 'Top: [Technical Feasibility] | [Operational Feasibility] | [Economic Viability]. Bottom: 4-cell matrix of Field Challenges and Engineered Mitigations.',
      example: 'Badges: 100% Offline Capable, Zero New Hardware, Court-Ready Dossiers.',
      speaker: 'Feasibility and viability are at the core of INSPACK. An inspection system is useless if it fails in a rural mandi without mobile coverage. We engineered INSPACK to be local-first: if the network drops, client-side OCR and local rules take over. Officers don\'t need special measuring gadgets—their existing phone camera is enough. Our blur-detection filter ensures photos are clear before processing. When rules or compounding fines change through new gazette notifications, administrators update the rule engine without rewriting software. It is practical, resilient, and ready for departmental adoption.',
      avoid: 'Avoid claiming "100% accuracy" or "zero false positives." Acknowledge that packaging variations require officer verification. Do not invent non-existent government MOUs or pilot partnerships.',
      protoVsFinal: 'Demonstrated: Offline fallback, blur detection, and dynamic rule management. Planned: Direct integration with Bluetooth-enabled electronic weighing balances.',
      status: 'Technical Feasibility & Mitigations: [DEMONSTRATED IN PROTOTYPE] | Pilot Deployment: [PLANNED / TARGET FOR SIH FINALS]'
    },
    {
      num: 5,
      title: 'IMPACT AND BENEFITS',
      purpose: 'Highlight tangible, multi-stakeholder benefits for enforcement officers, consumers, ethical manufacturers, and the Department of Consumer Affairs.',
      message: 'Standardized digital enforcement protecting consumer rights, reducing inspection overhead, and encouraging fair market compliance.',
      content: [
        'Enforcement Officers: Replaces tedious manual measurements and handwritten data sheets with instant, evidence-backed inspection records (25 mins ➔ < 60 secs).',
        'Consumers & Citizens: Ensures genuine price declarations, accurate net quantities, legible consumer-care contacts, and 1-tap grievance filing via NCH 1915.',
        'FMCG Manufacturers: Brand Pre-Check Portal allows companies to audit wrapper artworks before printing runs—preventing accidental violations and costly recalls.',
        'Ministry & Directorate: National Surveillance Hub provides real-time heatmaps, tracking high-violation commodity sectors and repeat offenders.',
        'E-Commerce Protection: Audits digital dark store listings on Amazon, Blinkit, and Flipkart for missing Rule 10 PDP declarations.'
      ],
      visual: '4-Box Stakeholder Impact Grid (Officers, Consumers, Industry, Ministry) alongside a compact before-and-after comparison table.',
      structure: '2x2 grid of Stakeholder Impacts paired with the 6-row Workflow Transformation comparison table.',
      example: 'Visual snippet of the Consumer Grievance Redressal Card showing 1-click filing to National Consumer Helpline (NCH 1915) with auto-attached Form A inspection exhibits.',
      speaker: 'The impact of INSPACK extends across the entire consumer ecosystem. For enforcement officers, it turns a cumbersome 25-minute manual inspection into a 60-second digital workflow, generating official Form A data sheets instantly. For Indian consumers, it protects against hidden shrinkflation, illegal price stickers, and missing helpline contacts. For honest manufacturers, our pre-check simulator prevents accidental non-compliance before millions of wrappers are printed. And for the Ministry, our surveillance hub transforms scattered paperwork into actionable national intelligence.',
      avoid: 'Do not invent unverified percentages (e.g., do NOT claim "reduces false alarms by 85%" without empirical field benchmark data). Focus on qualitative, workflow-proven operational speedups.',
      protoVsFinal: 'Demonstrated: Officer dashboard, brand self-audit portal, consumer grievance modal, and e-commerce auditor. Planned: Direct nationwide API hook into the national e-Daakhil consumer court registry.',
      status: 'Multi-portal capabilities: [DEMONSTRATED IN PROTOTYPE] | Workflow Speedup: [DEMONSTRATED IN LOCAL SIMULATION / QUALITATIVE]'
    },
    {
      num: 6,
      title: 'RESEARCH AND REFERENCES',
      purpose: 'Ground the entire solution in official statutory gazettes, technical standards, and departmental guidance.',
      message: 'Built on authentic Indian statutory frameworks, official gazette amendments, and open geospatial/web standards.',
      content: [
        'Legal Metrology Act, 2009 (Act No. 1 of 2010): Statutory basis for inspection, seizure (Sec 15), and compounding penalties (Sec 48).',
        'Legal Metrology (Packaged Commodities) Rules, 2011: Core rules—Rule 6 (Declarations), Rule 7 (Font size), Rule 18 (MRP), Rule 22 (MPE).',
        'Seventh Schedule [Rule 19(2)]: Prescribed statutory templates for Form A (Weight) and Form B (Volume) inspection data sheets.',
        'Second Schedule [Rule 5]: Mandatory standard pack sizes across 19 commodity classes.',
        'First Schedule [Rule 2(e) & 22]: Maximum Permissible Error (MPE) allowable deficiency tables.',
        'GSR 779(E) & 2021 Amendments: Mandatory Unit Sale Price (USP) and e-commerce digital declaration guidelines.',
        'Section 65B Indian Evidence Act / Bharatiya Sakshya Adhiniyam, 2023: Legal admissibility of electronic evidence and hash integrity.',
        'Ministry of Consumer Affairs Problem Statement: Smart India Hackathon 2026 Problem Statement ID SIH-26034.'
      ],
      visual: '4-Quadrant Reference Architecture (Statutory Gazettes, Schedules & Forms, Evidence Standards, SIH Alignment) with a high-contrast QR code linking to the live prototype.',
      structure: 'Top-Left: Statutory Acts & Rules | Top-Right: Schedules & Form Templates | Bottom-Left: Legal Admissibility & Evidence Standards | Bottom-Right: Hackathon Alignment & Live QR Code.',
      example: 'QR code pointing to live prototype URL + clickable link: https://inspacknksih2026.vercel.app/',
      speaker: 'To conclude, INSPACK is not an abstract concept; it is strictly grounded in Indian law. Every single rule check in our system—from the 4mm numeral height requirement to the Second Schedule standard sizes and First Schedule MPE margins—cites the exact rule and gazette page. Our PDF reports strictly replicate the Seventh Schedule Form A and Form B formats prescribed under Rule 19(2), and our electronic evidence capture adheres to Section 65B standards. We invite the jury to scan the QR code and test the live prototype on their own devices.',
      avoid: 'Do not list long, unreadable raw URLs. Do not cite unrelated research papers or fire monitoring references.',
      protoVsFinal: 'Demonstrated: Full gazette-aligned rule citations and Form A/B formatting implemented. Final System: Dynamic gazette sync with the central e-Gazette repository.',
      status: 'Gazette Rules & Citations: [VERIFIED AGAINST OFFICIAL ACT & RULES] | Live Link: [DEMONSTRATED]'
    }
  ];

  for (const s of slides) {
    checkY(35);
    renderSubHeader(`SLIDE ${s.num}: ${s.title}`);
    renderCleanBullet('Purpose', s.purpose);
    renderCleanBullet('Main Message', s.message);
    
    // Exact Content Box
    renderCardBox(`EXACT SLIDE CONTENT (SLIDE ${s.num})`, s.content, cNavy, cLightBg);

    renderCleanBullet('Primary Visual', s.visual);
    renderCleanBullet('Diagram Structure', s.structure);
    renderCleanBullet('Data / Example', s.example);
    renderCleanBullet('Speaker Explanation', s.speaker);
    renderCleanBullet('What to Remove / Avoid', s.avoid);
    renderCleanBullet('Prototype vs Final Product', s.protoVsFinal);
    renderCleanBullet('Fact-Check Status', s.status);
    y += 4;
  }

  // =========================================================================
  // SECTION G: THREE CORE DIAGRAMS
  // =========================================================================
  renderSectionHeader('G', 'Three Core Diagrams (Text & Box Specifications)');

  renderSubHeader('DIAGRAM 1 — END-TO-END USER WORKFLOW');
  const d1Lines = [
    '[1. MULTI-VIEW ACQUISITION] ──► Front PDP (Title/Name) • Back Panel (Address/Dates/Care) • Side Panel (Net Qty/Batch)',
    '             ▼',
    '[2. PRE-PROCESSING & QUALITY] ──► Contrast stretch • Grayscale • Laplacian blur detection (Warn if blurry <10.5)',
    '             ▼',
    '[3. ENTITY EXTRACTION] ───────► Extracts 20+ fields (Net mass, SI unit, MRP, PIN, Dates) via Cloud AI or Offline Tesseract',
    '             ▼',
    '[4. LMPC 2011 RULES ENGINE] ──► Deterministic check of Rule 6, Rule 7 (Height), Rule 13 (SI), Rule 18 (Sticker), Sched I & II',
    '             ▼',
    '[5. FORENSIC EVIDENCE OVERLAY] ─► Renders color-coded bounding boxes on packaging photo with exact gazette rule citations',
    '             ▼',
    '[6. STATUTORY DOSSIER] ───────► 1-Click Form A / Form B PDF generation with Section 65B Electronic Evidence Certificate'
  ];
  renderCardBox('DIAGRAM 1: END-TO-END USER WORKFLOW FLOWCHART', d1Lines, cNavy, [255, 255, 255]);

  renderSubHeader('DIAGRAM 2 — SYSTEM ARCHITECTURE');
  const d2Lines = [
    '┌──────────────────────────────────────────────────────────────────────────────────────────────────┐',
    '│ 1. FIELD OFFICER INTERFACE: Mobile/Tablet PWA • Guided Camera Viewfinder • Offline Vault Storage  │',
    '└────────────────────────────────────────────────┬─────────────────────────────────────────────────┘',
    '                                                 ▼',
    '┌──────────────────────────────────────────────────────────────────────────────────────────────────┐',
    '│ 2. INPUT PROCESSING & EDGE OCR: HTML5 Canvas Filters • Laplacian Sharpness • Offline Tesseract   │',
    '└───────────────────────┬──────────────────────────────────────────┬───────────────────────────────┘',
    '                        ▼                                          ▼',
    '┌──────────────────────────────────────────────┐  ┌────────────────────────────────────────────────┐',
    '│ CLOUD MULTIMODAL VISION ENGINE               │  │ DETERMINISTIC STATUTORY RULES ENGINE           │',
    '│ Prototype: Gemini API / Prod: Sovereign NIC  │  │ Rule 6, 7 Table I, 13 SI, 18 Sticker,         │',
    '│ Extracts 20+ Legal Entities & Bounding Boxes │  │ Second Schedule Pack Sizes, First Sched MPE   │',
    '└───────────────────────┬──────────────────────┘  └────────────────────────┬───────────────────────┘',
    '                        └──────────────────────┬───────────────────┘',
    '                                               ▼',
    '┌──────────────────────────────────────────────────────────────────────────────────────────────────┐',
    '│ 3. EVIDENCE & DECISION LAYER: On-Image Visual Bounding Boxes • Form A & B PDF Engine             │',
    '│    Compounding Penalty Calculator • Section 65B Bharatiya Sakshya Adhiniyam Certificate         │',
    '└──────────────────────────────────────────────┬───────────────────────────────────────────────────┘',
    '                                               ▼',
    '┌──────────────────────────────────────────────────────────────────────────────────────────────────┐',
    '│ 4. REPOSITORY & INTEGRATION: Local-First Vault • Firestore Backup • National Consumer Helpline    │',
    '└──────────────────────────────────────────────────────────────────────────────────────────────────┘'
  ];
  renderCardBox('DIAGRAM 2: FIVE-TIER MODULAR SYSTEM ARCHITECTURE', d2Lines, cTeal, [255, 255, 255]);

  renderSubHeader('DIAGRAM 3 — COMPLIANCE DECISION FLOW');
  const d3Lines = [
    '[Physical Package Photo] ──► [Are Mandatory Declarations Present?]',
    '                                  │                     │',
    '                                 YES                    NO ──► [Rule 6 Violation: Flag FAIL + Rs. 2,000 Fine]',
    '                                  ▼',
    '                  [Evaluate Extracted Values]',
    '       ┌──────────────────┬─────────────────┬──────────────────┐',
    '       ▼                  ▼                 ▼                  ▼',
    '[Rule 13: SI Unit]  [Rule 7: Font]    [Rule 18: Price]  [Schedule II: Sizes]',
    '  Valid SI unit?      Height >= min?    Sticker altered?  Prescribed size?',
    '  YES: PASS           YES: PASS         YES: FAIL (Tamper) YES: PASS',
    '  NO:  FAIL (gm/gms)  NO:  FAIL (2.2mm) NO:  PASS (Printed) NO: FAIL (120g)',
    '       └──────────────────┴─────────────────┴──────────────────┘',
    '                                  │',
    '                                  ▼',
    '          [First Schedule: Sample Net Weight Check vs MPE Limit]',
    '                 ├── Actual >= (Declared - MPE)? ──► PASS',
    '                 └── Actual < (Declared - MPE)?  ──► FAIL (Shortfall Violation)',
    '                                  │',
    '                                  ▼',
    '    [Compile Compliance Index Score & Generate Seventh Schedule Form A/B Dossier]'
  ];
  renderCardBox('DIAGRAM 3: DETERMINISTIC STATUTORY DECISION TREE', d3Lines, cNavy, [255, 255, 255]);

  // =========================================================================
  // SECTION H: COMPARISON TABLE
  // =========================================================================
  renderSectionHeader('H', 'Comparison Table: Manual vs. INSPACK-Supported Inspection');

  const compRows = [
    ['Information Capture', 'Officer manually inspects tiny print across all package panels using magnifying glass and ruler.', 'Guided multi-panel photo capture (Front, Back, Side) with automatic contrast enhancement.', 'Reduces officer visual strain; captures digital record of all package sides simultaneously.'],
    ['Rule Verification', 'Officer cross-references multiple gazette schedules, numeral height tables, and pack size lists manually.', 'Deterministic rules engine validates extracted data against Rules 6, 7, 10, 13, 18, and Schedules I & II.', 'Eliminates human calculation errors; ensures 100% objective, standardized enforcement.'],
    ['Numeral Height Check', 'Officer manually measures letter/numeral height with physical calipers or plastic scales.', 'Automated comparison of measured numeral height against Table I minimums based on package volume/mass.', 'Eliminates subjective visual estimates; flags borderline font violations instantly.'],
    ['Tampered Price Check', 'Visual detection of glued stickers; easy to miss subtle overprinting in dimly lit retail stores.', 'Automated pattern recognition for overprinted stickers, dual pricing, and missing tax clauses (Rule 18).', 'Protects consumers against illicit retail price hikes and GST overcharging.'],
    ['Standard Pack Size Audit', 'Officer must memorize or look up allowed weights across 19 separate commodity categories in Schedule II.', 'Instant validation against Second Schedule items (e.g., flags 120g biscuits or 900ml oils immediately).', 'Catches deceptive packaging downsizing and non-standard quantities.'],
    ['Evidence Recording', 'Handwritten notes and loose smartphone photos without formal chain of custody or timestamps.', 'Photographic exhibits embedded in inspection data sheet with digital hash and Section 65B certification.', 'Legally defensible electronic evidence that stands up in consumer and judicial courts.'],
    ['Report Preparation', 'Filling out handwritten Form A / Form B sheets, compounding notices, and seizure memos (20–30 mins).', 'Instant 1-click generation of official Seventh Schedule Form A/B PDF complete with signature blocks (< 60 secs).', 'Multi-fold speedup in field turnaround, enabling officers to cover more retail premises daily.'],
    ['Role of Officer', 'Burdened with repetitive manual measurement, legal cross-referencing, and clerical paperwork.', 'Empowered decision-maker: Reviews flagged findings, validates evidence, and exercises statutory judgment.', 'Positions technology strictly as an inspection-support system, preserving official judicial discretion.']
  ];

  autoTable(doc, {
    startY: y,
    head: [['Workflow Characteristic', 'Manual Field Inspection', 'INSPACK-Supported Inspection', 'Impact / Benefit to Department']],
    body: compRows,
    theme: 'grid',
    headStyles: { fillColor: cNavy, textColor: [255, 255, 255], fontSize: 7, fontStyle: 'bold' },
    styles: { fontSize: 6.5, cellPadding: 1.5 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 48 },
      2: { cellWidth: 51 },
      3: { cellWidth: 49 }
    }
  });

  y = doc.lastAutoTable.finalY + 6;

  // =========================================================================
  // SECTION I: VISUAL ASSET CHECKLIST
  // =========================================================================
  renderSectionHeader('I', 'Visual Asset Checklist (For Slide Deck Designer)');
  renderParagraph('Hand this exact checklist to the team member assembling slides in PowerPoint, Canva, or Figma:', true);

  const assetRows = [
    ['Slide 1\nTitle Page', 'Central INSPACK emblem with magnifying glass over a package; Government of India and SIH 2026 logos.', 'ShieldCheck, Scale, FileText, Cpu.', 'High-contrast mockup of INSPACK UI running on an Android tablet.', 'Largest: Title & Subtitle (50%). Medium: Metadata (30%). Small: Team & Links (20%).'],
    ['Slide 2\nProposed Solution', '5-stage sequential process flowchart (Capture ➔ Extract ➔ Verify ➔ Evidence ➔ Report).', 'Camera, ScanText, Scale, CheckCircle, FileDown.', 'EvidenceVisualizer showing green/red bounding boxes on Amul Milk pack.', 'Largest: 5-Stage Process Flow (45%). Medium: Evidence screenshot (35%). Small: Innovation points (20%).'],
    ['Slide 3\nTechnical Approach', '5-tier layered system architecture diagram (Client ➔ Vision ➔ Rules ➔ Dossier ➔ Repository).', 'Layers, Cpu, Server, Lock, Database.', 'Thumbnail of the generated Seventh Schedule Form A PDF sheet.', 'Largest: 5-Tier Architecture (55%). Medium: Statutory rule badges (30%). Small: Tech badges (15%).'],
    ['Slide 4\nFeasibility & Viability', '3 Feasibility Pillar Cards (Technical, Operational, Economic) + Bottom 2x2 Challenge-Mitigation matrix.', 'Cpu, UserCheck, TrendingUp, WifiOff, Sun, Sliders.', 'Sharpness score indicator badge (Sharpness: 85/100 • Clean).', 'Largest: 3 Feasibility Cards (50%). Medium: Challenge-Mitigation grid (40%). Small: Badges (10%).'],
    ['Slide 5\nImpact & Benefits', '4-quadrant Stakeholder Ecosystem (Officers, Consumers, Industry, Ministry).', 'Shield, Users, Building2, Landmark.', 'Consumer Grievance Modal showing 1-click filing to National Consumer Helpline 1915.', 'Largest: Before vs After Comparison Table (50%). Medium: Stakeholders (40%). Small: NCH badge (10%).'],
    ['Slide 6\nResearch & References', '4-quadrant legal authority matrix (Acts, Schedules, Evidence Admissibility, SIH Alignment).', 'BookOpen, Award, FileCode, ExternalLink.', 'High-contrast QR code linking to https://inspacknksih2026.vercel.app/.', 'Largest: Gazette Acts & Rules (60%). Medium: QR code & URL (25%). Small: Problem metadata (15%).']
  ];

  autoTable(doc, {
    startY: y,
    head: [['Slide', 'Diagrams to Draw', 'Icons Required', 'Screenshots / Assets', 'Visual Hierarchy']],
    body: assetRows,
    theme: 'grid',
    headStyles: { fillColor: cTeal, textColor: [255, 255, 255], fontSize: 7, fontStyle: 'bold' },
    styles: { fontSize: 6.5, cellPadding: 1.5 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 46 },
      2: { cellWidth: 28 },
      3: { cellWidth: 41 },
      4: { cellWidth: 38 }
    }
  });

  y = doc.lastAutoTable.finalY + 6;

  // =========================================================================
  // SECTION J: CLAIMS THAT MUST NOT BE USED
  // =========================================================================
  renderSectionHeader('J', 'Claims That Must Not Be Used (Factual Integrity)');
  renderParagraph('To preserve strict factual integrity before Ministry evaluators, never use these unsupported claims:', true);

  renderCleanBullet('Do NOT say "INSPACK certifies products as compliant"', 'INSPACK is an inspection-support and decision-support tool. The authorized enforcement officer certifies and issues statutory orders.');
  renderCleanBullet('Do NOT invent accuracy percentages', 'Never claim "99.8% accuracy" or "zero false alarms" without measured empirical test sets. Emphasize deterministic legal checks.');
  renderCleanBullet('Do NOT claim it replaces officers', 'The system eliminates manual measuring and paperwork; it does not replace official judicial enforcement discretion.');
  renderCleanBullet('Do NOT invent deployments or MOUs', 'Never claim "deployed in 500+ mandis" or "officially approved by government." State clearly that it is a working functional prototype ready for field piloting.');
  renderCleanBullet('Do NOT use PyroVision / NTRO content', 'That was from an unrelated fire-monitoring presentation (SIH26162) and must never appear in this submission.');

  // =========================================================================
  // SECTION K: INFORMATION STILL NEEDED FROM TEAM
  // =========================================================================
  renderSectionHeader('K', 'Information Still Needed From Our Team');
  renderCleanBullet('Registered Team ID', 'Exact Team ID assigned on the official SIH portal for problem statement SIH-26034.');
  renderCleanBullet('Team Members & Institution', 'Final list of 6 registered team members and their designated college/university name.');
  renderCleanBullet('Official Portal Theme', 'Confirm whether the team registered under Agriculture, FoodTech & Rural Development or Clean & Green Technology / Governance.');
  renderCleanBullet('Target Pilot District', 'Proposed district or state consumer affairs office for the initial field trial (e.g., Delhi NCR Retail Hub or Telangana).');

  // =========================================================================
  // SECTION L: FINAL 30-SECOND ELEVATOR PITCH
  // =========================================================================
  renderSectionHeader('L', 'Final 30-Second Elevator Pitch');
  const pitchText = [
    '"Respected evaluators, India\'s packaged goods market sees millions of products sold daily across retail stores and dark stores. Today, Legal Metrology officers still inspect tiny font sizes and mandatory declarations manually using plastic scales and handwritten forms—a process that takes 25 minutes per product.',
    '',
    'We built INSPACK—an AI-assisted inspection-support system designed specifically for the Department of Consumer Affairs under SIH-26034. An officer takes photos of a package\'s front, back, and sides. INSPACK instantly reads the declarations, evaluates them against the exact clauses of the Legal Metrology Rules, 2011, and compiles an official Seventh Schedule Form A or Form B inspection sheet with court-ready photographic evidence in under 60 seconds. It works 100% offline, requires zero new hardware, and puts an end to manual packaging inspection bottlenecks."'
  ];
  renderCardBox('OFFICIAL 30-SECOND ELEVATOR PITCH SCRIPT', pitchText, cNavy, [255, 255, 255]);

  // =========================================================================
  // SECTION M: FINAL 2-MINUTE STORY
  // =========================================================================
  renderSectionHeader('M', 'Final 2-Minute Presentation Story');
  const storyText = [
    '[Slide 1 — Title Page]: "Good morning, respected judges. We are Team Neural Knights, presenting INSPACK for Problem Statement SIH-26034 under the Ministry of Consumer Affairs, Food & Public Distribution. Our mission is to modernize packaged commodity compliance under the Legal Metrology Rules, 2011 through practical, explainable technology."',
    '',
    '[Slide 2 — Proposed Solution]: "When an enforcement officer walks into a supermarket or dark store today, verifying whether a package complies with the law requires checking over twenty statutory declarations—from SI unit abbreviations and manufacturer PIN codes to font heights and un-tampered MRPs. Doing this manually is exhausting and slow. INSPACK transforms this workflow: an officer snaps multi-view photos of the package. Our system extracts the declared entities, cross-checks them against deterministic legal rules, and overlays clear green, yellow, or red bounding boxes directly on the package image with exact gazette rule citations."',
    '',
    '[Slide 3 — Technical Approach]: "We deliberately chose a robust, modular architecture. In the field, an officer cannot rely on continuous cloud connectivity. INSPACK features a local-first design: it pre-processes images on the device, tests for blur, and uses edge OCR when offline. In our cloud setup, multimodal vision models parse multi-panel declarations. These extracted fields feed into our deterministic rules engine. It checks Rule 7 Table I font heights against net quantity, Rule 13 for illegal units like \'gm\', Rule 18 for unauthorized price stickers, and Second Schedule standard pack sizes. Crucially, INSPACK automatically formats these findings into the official Seventh Schedule Form A and Form B inspection data sheets, complete with Section 65B electronic admissibility certificates and signature blocks."',
    '',
    '[Slide 4 — Feasibility & Viability]: "We engineered INSPACK for real-world Indian conditions. It requires zero expensive hardware—running directly on the smartphone or tablet an officer already carries. If the lighting is poor, our automated sharpness filter prompts for a better angle. If network connectivity drops in a remote mandi, the local offline engine takes over. And when the Ministry amends rules or compounding penalties via new gazette notifications, administrators update the rule engine dynamically without redeploying software."',
    '',
    '[Slide 5 — Impact & Benefits]: "The benefits span the entire consumer ecosystem. Enforcement officers cut inspection paperwork from twenty minutes to under a minute, multiplying their daily inspection capacity. Consumers are protected against hidden shrinkflation, illegal price stickers, and missing helpline contacts. And reputable FMCG manufacturers can use our Brand Pre-Check Portal to audit packaging artwork before printing millions of wrappers, preventing accidental non-compliance."',
    '',
    '[Slide 6 — Research & References]: "Everything in INSPACK is strictly anchored in Indian statutory law: the Legal Metrology Act, 2009, the Packaged Commodities Rules, 2011, and the Seventh Schedule statutory forms. We invite you to scan the QR code on Slide 6 to test our live, functional prototype on your own phones right now. Thank you, and we welcome your questions."'
  ];
  renderCardBox('OFFICIAL 2-MINUTE SLIDE DECK STORY SCRIPT', storyText, cTeal, [255, 255, 255]);

  // Finalize running headers and footers across all pages
  addRunningHeaderFooter();

  // Save to file
  const outputPath = path.resolve('INSPACK_SIH2026_Idea_Presentation_Blueprint.pdf');
  const buffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(outputPath, buffer);

  console.log(`Successfully generated PDF: ${outputPath}`);
  console.log(`Total Pages: ${doc.internal.getNumberOfPages()}`);
  console.log(`File Size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});

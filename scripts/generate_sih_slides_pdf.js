import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import fs from 'fs';
import path from 'path';

async function generateSlideDeckPDF() {
  // 16:9 Widescreen Landscape (297mm x 167.06mm)
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [297, 167.06] });
  const pW = 297;
  const pH = 167.06;

  // Colors
  const cNavy = [10, 54, 99];
  const cSihBlue = [0, 79, 158];
  const cTeal = [15, 118, 110];
  const cDark = [15, 23, 42];
  const cGray = [100, 116, 139];
  const cLightBg = [248, 250, 252];
  const cWhite = [255, 255, 255];
  const cBorder = [226, 232, 240];
  const cGold = [217, 119, 6];
  const cRed = [220, 38, 38];
  const cGreen = [22, 163, 74];

  function drawCommonHeaderFooter(slideTitle, pointerSubtitle, slideNum) {
    // Top Bar
    doc.setFillColor(...cNavy);
    doc.rect(0, 0, pW, 23, 'F');

    // Team Pill Left
    doc.setFillColor(...cWhite);
    doc.setDrawColor(...cGold);
    doc.roundedRect(6, 3.5, 45, 16, 1.5, 1.5, 'FD');
    doc.setTextColor(...cNavy);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Team: Neural Knights', 28.5, 9.5, { align: 'center' });
    doc.setTextColor(...cGray);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text('CBIT, Hyderabad', 28.5, 15, { align: 'center' });

    // Center Title
    doc.setTextColor(...cWhite);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(slideTitle, 55, 11);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(190, 220, 255);
    doc.text(pointerSubtitle, 55, 18);

    // SIH Pill Right
    doc.setFillColor(...cWhite);
    doc.setDrawColor(...cSihBlue);
    doc.roundedRect(pW - 47, 3.5, 41, 16, 1.5, 1.5, 'FD');
    doc.setTextColor(...cSihBlue);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('SMART INDIA', pW - 26.5, 9.5, { align: 'center' });
    doc.setTextColor(...cNavy);
    doc.setFontSize(7);
    doc.text('HACKATHON 2026', pW - 26.5, 15, { align: 'center' });

    // Bottom Footer Strip
    doc.setFillColor(...cSihBlue);
    doc.rect(0, pH - 8, pW, 8, 'F');
    doc.setTextColor(...cWhite);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `@SIH Idea submission - Template ${slideNum}  |  INSPACK: Software System to check compliance of Packaged Commodities under LMPC Rules, 2011  |  Problem Statement ID: SIH-26034`,
      pW / 2,
      pH - 3,
      { align: 'center' }
    );
  }

  function drawCard(x, y, w, h, bgColor = cWhite, borderColor = cBorder) {
    doc.setFillColor(...bgColor);
    doc.setDrawColor(...borderColor);
    doc.roundedRect(x, y, w, h, 2, 2, 'FD');
  }

  // =========================================================================
  // SLIDE 1: TITLE PAGE
  // =========================================================================
  // Header
  doc.setFillColor(...cNavy);
  doc.rect(0, 0, pW, 26, 'F');

  doc.setTextColor(...cWhite);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SMART INDIA HACKATHON 2026', pW / 2, 9, { align: 'center' });
  doc.setFontSize(10);
  doc.text('TITLE PAGE', pW / 2, 16, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(190, 220, 255);
  doc.setFont('helvetica', 'normal');
  doc.text('Ministry of Consumer Affairs, Food & Public Distribution • Department of Consumer Affairs', pW / 2, 22, { align: 'center' });

  // Left Card: Project Metadata
  drawCard(8, 30, 165, 125, cWhite, cNavy);
  doc.setTextColor(...cNavy);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INSPACK 🛡️📦', 14, 41);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cTeal);
  doc.text('AI-Based Legal Metrology Packaged Commodities Compliance & Inspection System', 14, 47);

  const s1Items = [
    ['Problem Statement ID:', 'SIH-26034'],
    ['Problem Statement Title:', 'Software System to check compliance of Packaged Commodities under the Legal Metrology (Packaged Commodities) Rules, 2011 by scanning products, images and labels'],
    ['Theme:', 'Agriculture, FoodTech & Rural Development / Governance'],
    ['PS Category:', 'Software (AI Multimodal Computer Vision + Deterministic Rules Engine)'],
    ['Ministry / Organization:', 'Ministry of Consumer Affairs, Food & Public Distribution — Legal Metrology Division'],
    ['Team Name (Registered):', 'Neural Knights (Ideas • Intelligence • Impact — Tech for a Fairer Market)'],
    ['Institution / College:', 'Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad (AICTE: 1-44641605560)'],
    ['Live Demonstration Prototype:', 'https://inspacknksih2026.vercel.app/']
  ];

  let curY = 54;
  for (const [lbl, val] of s1Items) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cNavy);
    doc.text(`• ${lbl}`, 14, curY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cDark);
    const splitVal = doc.splitTextToSize(val, 155);
    doc.text(splitVal, 18, curY + 3.8);
    curY += 3.8 + splitVal.length * 3.6;
  }

  // Right Card: Official Team Roster
  drawCard(178, 30, 111, 125, cLightBg, cSihBlue);
  doc.setTextColor(...cSihBlue);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL TEAM ROSTER', 184, 40);

  doc.setFontSize(7.5);
  doc.setTextColor(...cGray);
  doc.setFont('helvetica', 'normal');
  doc.text('Chaitanya Bharathi Institute of Technology (CBIT)', 184, 46);
  doc.text('Nominated by Principal CBIT (Prof. C.V. Narasimhulu)', 184, 51);

  const teamList = [
    ['Shaik Saleem (Team Leader)', '160124771129', 'B.E AIDS-2, III Year'],
    ['D. Rishwanth Reddy', '160124771105', 'B.E AIDS-2, III Year'],
    ['Dasari Hitharth', '160124771106', 'B.E AIDS-2, III Year'],
    ['Pachimatla Hasini', '160124771084', 'B.E AIDS-2, III Year'],
    ['B. Venkat Sai Ram', '160125733151', 'B.E CSE-3, II Year'],
    ['G. Rohith Nandhan', '160125733158', 'B.E CSE-3, II Year']
  ];

  let tY = 59;
  for (const [name, roll, dept] of teamList) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cDark);
    doc.text(`👤 ${name}`, 184, tY);

    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cGray);
    doc.text(`    Roll: ${roll} | ${dept}`, 184, tY + 4);
    tY += 9.5;
  }

  // Footer Slide 1
  doc.setFillColor(...cSihBlue);
  doc.rect(0, pH - 8, pW, 8, 'F');
  doc.setTextColor(...cWhite);
  doc.setFontSize(6.5);
  doc.text('@SIH Idea submission - Template 1 | Title Page | Problem Statement ID: SIH-26034', pW / 2, pH - 3, { align: 'center' });

  // =========================================================================
  // SLIDE 2: PROPOSED SOLUTION
  // =========================================================================
  doc.addPage([297, 167.06], 'landscape');
  drawCommonHeaderFooter('IDEA TITLE: INSPACK — PROPOSED SOLUTION', 'Proposed Solution (Describe your Idea / Solution / Prototype)', 2);

  // Sub-pointer bar
  doc.setTextColor(...cSihBlue);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('❖ Detailed explanation of proposed solution   •   How it addresses the problem   •   Innovation and uniqueness of the solution', 8, 28.5);

  // Left Card: 5-Stage Process Flow
  drawCard(8, 32, 175, 68, cWhite, cNavy);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cNavy);
  doc.text('AUTOMATED 5-STAGE STATUTORY INSPECTION WORKFLOW', 13, 39);

  const flowStages = [
    ['1. Multi-View Capture:', 'Captures Front PDP, Back declarations, and Side batch panels via smartphone camera with guided viewfinder.'],
    ['2. Legal Extraction:', 'Extracts 20+ statutory entities: Trade/generic name, declared quantity, SI units, MRP, dates, factory address, PIN.'],
    ['3. Deterministic Rules:', 'Evaluates against LMPC Rules 6, 7 Table I, 10, 13, 18, 22, and Second Schedule standard pack sizes without AI hallucination.'],
    ['4. Evidence Overlay:', 'Overlays interactive color-coded bounding boxes directly on package photos with exact gazette legal citations.'],
    ['5. Statutory Dossier:', '1-Click compilation of official Seventh Schedule Form A & Form B sheets with Section 65B electronic admissibility certificate.']
  ];

  let sY = 46;
  for (const [st, sd] of flowStages) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cTeal);
    doc.text(st, 13, sY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cDark);
    const sp = doc.splitTextToSize(sd, 135);
    doc.text(sp, 46, sY);
    sY += 4.5 + (sp.length - 1) * 3.5;
  }

  // Bottom-Left Card: Innovation & Uniqueness
  drawCard(8, 103, 175, 52, cLightBg, cTeal);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cTeal);
  doc.text('CORE INNOVATION: EXPLAINABLE STATUTORY DECISION SUPPORT', 13, 110);

  const innovItems = [
    ['Beyond Plain OCR:', 'Existing OCR only extracts raw text into a box. INSPACK connects what is printed on the package to the exact legal requirement the inspector must verify.'],
    ['Deterministic Law:', 'AI reads pixels, but statutory compliance is 100% deterministic. Rules, font heights, and compounding penalties are evaluated against gazette tables with zero hallucination.'],
    ['Inspection-Support System:', 'INSPACK does NOT replace the enforcement officer. It eliminates 20+ minutes of manual measuring and handwritten paperwork, giving the officer court-ready findings.']
  ];

  let iY = 117;
  for (const [it, id] of innovItems) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cNavy);
    doc.text(`★ ${it}`, 13, iY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cDark);
    const sp = doc.splitTextToSize(id, 130);
    doc.text(sp, 48, iY);
    iY += 4.5 + (sp.length - 1) * 3.5;
  }

  // Right Card: Real Test Case Evidence (Amul Milk / Fortune Oil)
  drawCard(187, 32, 102, 123, cWhite, cBorder);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cNavy);
  doc.text('PROTOTYPE TEST SHOWCASE', 193, 39);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cRed);
  doc.text('Amul Taaza Toned Milk (1 L Pouch)', 193, 45);

  const testFindings = [
    ['Overall Status:', 'NON-COMPLIANT (Score: 72/100)', cRed],
    ['Rule 7 Violation:', 'MRP numeral height is 2.2mm. Mandated minimum under Table I for >500ml is 4.0mm.', cRed],
    ['Rule 6(2) Warning:', 'Toll-free helpline present, but mandatory consumer care email address is missing.', cGold],
    ['Rule 32 Penalty:', 'Compounding penalty calculated: Rs. 2,000.', cNavy],
    ['Form Generated:', 'Seventh Schedule Form B (Volume Checking Data Sheet) ready with 1-click download.', cGreen],
    ['Evidence Standard:', 'Photographic exhibit recorded with SHA-256 digital verification hash under Section 65B.', cTeal]
  ];

  let fY = 53;
  for (const [flbl, ftxt, fcol] of testFindings) {
    doc.setFontSize(7.2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...fcol);
    doc.text(`• ${flbl}`, 193, fY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cDark);
    const sp = doc.splitTextToSize(ftxt, 88);
    doc.text(sp, 197, fY + 4);
    fY += 4.5 + sp.length * 3.6;
  }

  // =========================================================================
  // SLIDE 3: TECHNICAL APPROACH
  // =========================================================================
  doc.addPage([297, 167.06], 'landscape');
  drawCommonHeaderFooter('TECHNICAL APPROACH', 'Technologies to be Used • Methodology & Architecture • Working Prototype', 3);

  doc.setTextColor(...cSihBlue);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('❖ Technologies to be used (programming languages, frameworks, hardware)   •   Methodology and process for implementation', 8, 28.5);

  // Left Card: 5-Tier Architecture
  drawCard(8, 32, 175, 123, cWhite, cNavy);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cNavy);
  doc.text('5-TIER LAYERED SYSTEM ARCHITECTURE', 13, 39);

  const archTiers = [
    ['Tier 1: Field Client Layer', 'Responsive Progressive Web App (PWA) & Mobile App with on-screen Principal Display Panel (PDP) viewfinder guides, torch toggle, and local offline cache.'],
    ['Tier 2: Pre-Processing & Quality', 'HTML5 Canvas luminance leveling, contrast stretching, and Laplacian blur gradient variance test (warns inspector before OCR if image sharpness is low).'],
    ['Tier 3: Vision & Entity Extraction', 'Dual Engine: (1) Prototype uses Google Gemini Multimodal Vision API; (2) Sovereign Production uses on-premise Document AI / OCR (TrOCR/LayoutLM) on NIC MeghRaj.'],
    ['Tier 4: Deterministic Rules Engine', 'Pure deterministic service evaluating Rules 6, 7 Table I, 10, 13, 18, 22, Second Schedule standard pack sizes, and First Schedule MPE error margins.'],
    ['Tier 5: Evidence & Dossier Layer', 'Client-side jsPDF compiles Seventh Schedule Form A (Weight) and Form B (Volume) data sheets with Section 65B electronic evidence certification and signature blocks.']
  ];

  let aY = 46;
  for (const [at, ad] of archTiers) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cTeal);
    doc.text(`■ ${at}`, 13, aY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cDark);
    const sp = doc.splitTextToSize(ad, 160);
    doc.text(sp, 17, aY + 4);
    aY += 4.5 + sp.length * 3.6;
  }

  // Right Top Card: Tech Stack Matrix
  drawCard(187, 32, 102, 58, cLightBg, cSihBlue);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cSihBlue);
  doc.text('TECHNOLOGY STACK MAPPING', 193, 39);

  const tStacks = [
    ['Frontend Client:', 'React 19, TypeScript, Vite, Tailwind CSS v4'],
    ['Edge / Offline OCR:', 'Tesseract.js Worker + HTML5 Canvas Pre-processing'],
    ['Multimodal Vision:', 'Gemini Vision (Prototype) ➔ Sovereign NIC AI (Final)'],
    ['Statutory Dossier:', 'jsPDF + jsPDF-AutoTable (Official Form A & B)'],
    ['Data Persistence:', 'IndexedDB / LocalStorage (Local-First) + Firestore']
  ];

  let tsY = 45;
  for (const [tsl, tsv] of tStacks) {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cNavy);
    doc.text(`• ${tsl}`, 193, tsY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cDark);
    doc.text(tsv, 195, tsY + 3.6);
    tsY += 7.5;
  }

  // Right Bottom Card: Statutory Rule Coverage
  drawCard(187, 94, 102, 61, cWhite, cTeal);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cTeal);
  doc.text('STATUTORY LEGAL RULES CODIFIED', 193, 101);

  const ruleList = [
    ['Rule 6(1)(a-g):', 'Mandatory Name, Address, Net Qty, Dates, MRP, Batch'],
    ['Rule 7 Table I:', 'Minimum numeral height based on net quantity & PDP area'],
    ['Rule 13(4-5):', 'Strict SI units: g, kg, ml, l. Blocks "gm", "gms", "dozen"'],
    ['Rule 18(5):', 'Detects unauthorized price stickers, smudging & dual pricing'],
    ['Second Schedule:', 'Validates mandatory standard pack sizes across 19 categories'],
    ['First Schedule:', 'Calculates Maximum Permissible Error (MPE) allowable deficiency']
  ];

  let rlY = 107;
  for (const [rl, rv] of ruleList) {
    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cNavy);
    doc.text(`✔ ${rl}`, 193, rlY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cDark);
    doc.text(rv, 195, rlY + 3.4);
    rlY += 7.2;
  }

  // =========================================================================
  // SLIDE 4: FEASIBILITY AND VIABILITY
  // =========================================================================
  doc.addPage([297, 167.06], 'landscape');
  drawCommonHeaderFooter('FEASIBILITY AND VIABILITY', 'Feasibility Analysis • Field Challenges & Risks • Engineered Mitigations', 4);

  doc.setTextColor(...cSihBlue);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('❖ Analysis of the feasibility of the idea   •   Potential challenges and risks   •   Strategies for overcoming these challenges', 8, 28.5);

  // 3 Feasibility Pillar Cards (Top)
  const fPillars = [
    ['TECHNICAL FEASIBILITY', [
      'Runs on standard smartphones & tablets.',
      'Zero proprietary optical or laser hardware needed.',
      'Dual-engine: Cloud Vision + 100% offline edge OCR.',
      'Deterministic rule engine prevents AI hallucinations.'
    ], cNavy],
    ['OPERATIONAL FEASIBILITY', [
      'Simple 3-step officer workflow: Aim ➔ Scan ➔ Dossier.',
      'On-screen bounding boxes enable instant visual review.',
      'Eliminates 20+ mins of manual measuring & paperwork.',
      'Outputs official Seventh Schedule Form A/B sheets.'
    ], cTeal],
    ['ECONOMIC & DEPLOYMENT VIABILITY', [
      'Zero new field hardware expenditure (CapEx).',
      'Officers use existing government mobile devices.',
      'Phased rollout: State retail pilot ➔ Pan-India scale.',
      'Massive cost & time savings across inspection zones.'
    ], cSihBlue]
  ];

  for (let idx = 0; idx < fPillars.length; idx++) {
    const [title, points, color] = fPillars[idx];
    const px = 8 + idx * 95;
    drawCard(px, 32, 91, 56, cWhite, color);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...color);
    doc.text(title, px + 5, 39);

    let py = 45;
    for (const p of points) {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...cDark);
      doc.text(`• ${p}`, px + 5, py);
      py += 5.5;
    }
  }

  // 4 Field Challenges & Mitigations (Bottom)
  drawCard(8, 92, 281, 63, cLightBg, cNavy);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cNavy);
  doc.text('REAL-WORLD FIELD CHALLENGES & DEMONSTRATED MITIGATIONS', 13, 99);

  const cMit = [
    ['Poor Lighting & Blurry Photos:', 'Low retail lighting or shaky hands cause OCR failure.', 'Laplacian gradient sharpness filter tests image clarity on HTML5 canvas before running extraction. Warns officer if blurry.'],
    ['Zero Network in Rural Mandis:', 'Field inspections occur in remote godowns without 4G/5G.', 'Client-side Tesseract.js Web Worker + LocalStorage vault enables 100% offline inspection and queue-based cloud sync.'],
    ['Curved & Crinkled Packaging:', 'Labels on pouches and bottles wrap around packaging edges.', 'Multi-view panel acquisition (Front, Back, Side) segments text across multiple views, preserving label integrity.'],
    ['Changing Gazette Rules & Fines:', 'Legal metrology rules and compounding fines evolve over time.', 'Dynamic Rule Configuration Engine allows departmental administrators to update fines, rules, and schedules without rewriting software.']
  ];

  let cmY = 106;
  for (const [ct, cp, cs] of cMit) {
    doc.setFontSize(7.2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cRed);
    doc.text(`⚠ ${ct}`, 13, cmY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cDark);
    doc.text(`    Problem: ${cp}  |  Solution: ${cs}`, 15, cmY + 4);
    cmY += 9.5;
  }

  // =========================================================================
  // SLIDE 5: IMPACT AND BENEFITS
  // =========================================================================
  doc.addPage([297, 167.06], 'landscape');
  drawCommonHeaderFooter('IMPACT AND BENEFITS', 'Potential Impact on Target Audience • Multi-Stakeholder Benefits • Workflow Transformation', 5);

  doc.setTextColor(...cSihBlue);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('❖ Potential impact on the target audience   •   Benefits of the solution (social, economic, environmental, etc.)', 8, 28.5);

  // Left Card: 4-Quadrant Stakeholder Impact
  drawCard(8, 32, 135, 123, cWhite, cNavy);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cNavy);
  doc.text('MULTI-STAKEHOLDER IMPACT ECOSYSTEM', 13, 39);

  const sImpacts = [
    ['👮 FOR LEGAL METROLOGY OFFICERS', [
      'Reduces inspection time from 25 mins to under 60 seconds.',
      'Eliminates manual letter-height calipers & handwritten forms.',
      'Provides court-ready Seventh Schedule Form A & B dossiers.'
    ], cSihBlue],
    ['🛒 FOR CONSUMERS & CITIZENS', [
      'Protects against stealth shrinkflation & non-standard pack sizes.',
      'Eliminates unauthorized sticker price hikes & hidden dual pricing.',
      '1-tap grievance filing to National Consumer Helpline (NCH 1915).'
    ], cTeal],
    ['🏭 FOR FMCG BRANDS & PACKERS', [
      'Brand Pre-Check Portal audits artwork before printing wrappers.',
      'Prevents expensive market product seizures and packaging recalls.',
      'Promotes transparent, standardized compliance across the supply chain.'
    ], cGold],
    ['🏛️ FOR MINISTRY & DIRECTORATE', [
      'National Surveillance Hub aggregates state-wise violation trends.',
      'Identifies repeat offender brands and high-risk commodity classes.',
      'Empowers data-driven policy amendments with empirical evidence.'
    ], cNavy]
  ];

  let siY = 46;
  for (const [st, sps, sc] of sImpacts) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...sc);
    doc.text(st, 13, siY);

    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cDark);
    for (const p of sps) {
      doc.text(`  • ${p}`, 13, siY + 3.8);
      siY += 3.8;
    }
    siY += 5;
  }

  // Right Card: Workflow Comparison Table
  drawCard(147, 32, 142, 123, cLightBg, cSihBlue);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...cSihBlue);
  doc.text('WORKFLOW COMPARISON: MANUAL VS. INSPACK', 152, 39);

  const cmpItems = [
    ['Information Capture', 'Manual measurement with magnifying glass & ruler', 'Automated multi-panel photo capture (Front, Back, Side)'],
    ['Rule Verification', 'Cross-referencing multiple gazette books & tables manually', 'Instant deterministic rule validation across all LMPC clauses'],
    ['Numeral Height Check', 'Manual measurement with plastic calipers (Subjective)', 'Automated comparison against Table I minimum standards'],
    ['Tampered Price Check', 'Hard to detect subtle sticker alterations in dim lighting', 'Automated detection of glued price stickers & dual pricing (Rule 18)'],
    ['Pack Size Audit', 'Officer memorizes allowed sizes across 19 categories', 'Instant validation against Second Schedule standard pack sizes'],
    ['Report Preparation', 'Handwritten Form A/B sheets & seizure memos (20-30 mins)', 'Instant 1-click Seventh Schedule Form A/B PDF (< 60 secs)']
  ];

  let cY = 46;
  for (const [param, manual, inspack] of cmpItems) {
    doc.setFontSize(7.2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cNavy);
    doc.text(`◈ ${param}:`, 152, cY);

    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cRed);
    doc.text(`   Manual: ${manual}`, 152, cY + 3.6);

    doc.setTextColor(...cGreen);
    doc.text(`   INSPACK: ${inspack}`, 152, cY + 7.2);

    cY += 12;
  }

  // =========================================================================
  // SLIDE 6: RESEARCH AND REFERENCES
  // =========================================================================
  doc.addPage([297, 167.06], 'landscape');
  drawCommonHeaderFooter('RESEARCH AND REFERENCES', 'Statutory Frameworks • Schedules & Forms • Evidence Standards • Live Prototype', 6);

  doc.setTextColor(...cSihBlue);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('❖ Details / Links of the reference and research work   •   Authentic Statutory Foundations', 8, 28.5);

  const rQuads = [
    ['📜 STATUTORY ACTS & LEGISLATION', [
      ['The Legal Metrology Act, 2009 (Act No. 1 of 2010):', 'Statutory authority for powers of inspection, search & seizure (Sec 15), non-standard package penalties (Sec 36), and compounding of offences (Sec 48).'],
      ['LMPC Rules, 2011 (Gazette of India):', 'Comprehensive statutory code prescribing mandatory package declarations, Principal Display Panel geometry, and enforcement schedules.'],
      ['GSR 779(E) & 2021 Amendments:', 'Mandated statutory Unit Sale Price (USP) declarations and e-commerce digital display requirements on dark store platforms.']
    ], cNavy],
    ['📑 SCHEDULES & PRESCRIBED FORMS', [
      ['Seventh Schedule [Rule 19(2)] - Form A:', 'Official statutory format for Weight Checking Data Sheet, tare calculation, and tripartite signatures.'],
      ['Seventh Schedule [Rule 19(2)] - Form B:', 'Official statutory format for Volume and Measure Checking Data Sheet for liquid/fluid commodities.'],
      ['Second Schedule [Rule 5]:', 'Mandatory standard packaging quantities across 19 commodity classes (Biscuits, Edible Oils, Tea, Rice, etc.).'],
      ['First Schedule [Rules 2(e) & 22]:', 'Maximum Permissible Error (MPE) allowable deficiency tolerance tables.']
    ], cTeal],
    ['⚖️ ELECTRONIC EVIDENCE & ADMISSIBILITY', [
      ['Section 65B Indian Evidence Act / BSA 2023:', 'Prescribes statutory certification for electronic records, cryptographic SHA-256 hash preservation, and tamper-evident image logs.'],
      ['W3C Canvas & Web Worker Standards:', 'Authoritative open web standards powering 100% offline, on-device image contrast optimization and edge OCR processing.'],
      ['FSSAI Packaging Regulations, 2018:', 'Cross-referenced for front-of-pack synthetic color and artificial sweetener statutory warnings.']
    ], cSihBlue],
    ['🌐 HACKATHON ALIGNMENT & LIVE PROTOTYPE', [
      ['SIH 2026 Problem Statement ID:', 'SIH-26034 (Ministry of Consumer Affairs, Food & Public Distribution — Legal Metrology Division).'],
      ['Functional Live Web Prototype:', 'https://inspacknksih2026.vercel.app/ (Tested with benchmark retail commodities).'],
      ['SIH Implementation Guidelines:', 'Grounded in government deployment maturity, open-source compliance, and sovereign data privacy standards.']
    ], cGold]
  ];

  for (let qIdx = 0; qIdx < rQuads.length; qIdx++) {
    const [qTitle, qItems, qColor] = rQuads[qIdx];
    const row = Math.floor(qIdx / 2);
    const col = qIdx % 2;
    const qx = 8 + col * 142;
    const qy = 32 + row * 62;

    drawCard(qx, qy, 139, 59, cWhite, qColor);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...qColor);
    doc.text(qTitle, qx + 5, qy + 7);

    let qiY = qy + 13;
    for (const [ilbl, idsc] of qItems) {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...cNavy);
      doc.text(`• ${ilbl}`, qx + 5, qiY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...cDark);
      const sp = doc.splitTextToSize(idsc, 128);
      doc.text(sp, qx + 7, qiY + 3.6);
      qiY += 3.6 + sp.length * 3.4;
    }
  }

  // Save the PDF
  const outputPath = path.resolve('INSPACK_SIH2026_Official_Submission_Slides.pdf');
  const buffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(outputPath, buffer);

  console.log(`Successfully generated Presentation PDF: ${outputPath}`);
  console.log(`Total Pages: ${doc.internal.getNumberOfPages()}`);
  console.log(`File Size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

generateSlideDeckPDF().catch(err => {
  console.error('Error generating slide deck PDF:', err);
  process.exit(1);
});

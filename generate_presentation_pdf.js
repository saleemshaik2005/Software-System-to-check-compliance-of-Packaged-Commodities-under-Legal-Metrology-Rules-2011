import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import fs from 'fs';
import path from 'path';

// Define scenes with concise speech and the tri-pillar comparison
const scenes = [
  {
    num: 1,
    title: 'Project Title & Team Introduction',
    screen: 'Home Page Hero / Landing Banner',
    duration: '20-25s',
    action: 'Show the top Hero banner on inspacknksih2026.vercel.app with Inspack logo, SIH-26034 badge, and Ministry banner.',
    speech: '"Respected judges, we are Team Neural Knights from CBIT presenting Inspack for Problem Statement SIH-26034 under the Ministry of Consumer Affairs. Inspack is an AI-powered, sovereign compliance inspection system that automates the Legal Metrology (Packaged Commodities) Rules, 2011."',
    limitation: 'Over 10 billion packages are sold annually in India, but manual inspection covers less than 5% due to severe officer shortages.',
    solution: 'Inspack provides automated, instant verification of all packaging declarations in under 2 seconds using sovereign edge OCR.',
    impact: 'Scales enforcement capacity by 100x and protects 1.4 billion consumers from deceptive packaging and unfair trade practices.'
  },
  {
    num: 2,
    title: 'Multi-Role Access Control & Architecture',
    screen: 'Login Screen / Navbar Role Switcher',
    duration: '20s',
    action: 'Click the Profile / Role switcher on the top right. Show the 5 roles: Field Inspector, Citizen, Manufacturer, Surveillance, and Admin.',
    speech: '"Inspack provides 5 dedicated persona portals: Field Inspectors get statutory sampling tools; Citizens can verify packages and file 1-tap NCH 1915 grievances; Manufacturers get pre-printing simulation; and the Ministry gets national surveillance."',
    limitation: 'Government enforcement, citizen complaints, and brand manufacturing currently operate in disconnected silos with zero data sharing.',
    solution: 'A unified compliance platform connecting consumers, inspectors, and ministry directors onto a single verifiable ledger.',
    impact: 'Bridges citizen grievances directly into field inspections, ensuring transparent accountability and faster resolution.'
  },
  {
    num: 3,
    title: 'Executive Command Center & Multilingual PWA',
    screen: 'Unified Home Portal',
    duration: '20s',
    action: 'Show the Home dashboard cards. Toggle the language dropdown from English to Hindi (हिन्दी) and Telugu (తెలుగు), then back.',
    speech: '"Here is our Unified Command Center. Inspack is engineered as a Local-First Progressive Web App supporting English, Hindi, and Telugu. It runs 100% offline inside rural mandis and warehouse basements with zero cloud latency or data leakage."',
    limitation: 'Cloud-dependent apps fail in rural agricultural mandis and underground warehouses due to erratic cellular network.',
    solution: '100% offline execution via client-side Web Workers and IndexedDB local storage, requiring zero cloud API calls.',
    impact: 'Guarantees uninterrupted field operations anywhere in India with complete data sovereignty and zero recurring cloud costs.'
  },
  {
    num: 4,
    title: 'Package Scan Studio & Guided Viewfinder',
    screen: 'Scan Studio (Upload & Live Camera)',
    duration: '25s',
    action: 'Click "Package Scan Studio". Switch between Front (PDP), Back, and Side tabs. Toggle the camera viewfinder and torch.',
    speech: '"In the Package Scan Studio, officers capture multi-view images of Front, Back, and Side panels. Our intelligent viewfinder guides proper alignment of the Principal Display Panel, while adaptive contrast stretching eliminates camera glare and blur."',
    limitation: 'Inspectors take inconsistent, blurry, or angled photos in the field, making evidentiary proof contestable in court.',
    solution: 'Automated on-screen viewfinder guides with real-time perspective correction and image contrast enhancement.',
    impact: 'Standardizes photographic evidence collection across all 28 States and 8 UTs for court-admissible documentation.'
  },
  {
    num: 5,
    title: 'Evidence Visualizer & Compliance Scorecard',
    screen: 'Compliance Audit Sheet (Demo Preset: Amul Milk)',
    duration: '30s',
    action: 'Select the Amul Taaza Milk preset (Slide 2 Demo). Point to the red bounding boxes on the packaging visual and the 72/100 score.',
    speech: '"Here is our real-time audit for Amul Taaza Milk. Inspack overlays red bounding boxes on detected violations. Our scorecard instantly flags two critical failures: the MRP numeral height is only 2.2 mm against the mandatory 4.0 mm under Table I, and the customer care email is missing under Rule 6(2)."',
    limitation: 'Inspectors cannot accurately measure sub-millimeter font heights on curved packs with physical rulers, leading to legal disputes.',
    solution: 'Automated pixel-to-millimeter geometric scaling that deterministically verifies numeral heights against container surface area.',
    impact: 'Eliminates human measurement bias and provides irrefutable mathematical proof that stands up in magistrate courts.'
  },
  {
    num: 6,
    title: 'Statutory Rules Breakdown & Additive Safety',
    screen: 'Rule Breakdown Section & Health Audit',
    duration: '25s',
    action: 'Scroll down to the 13 rule evaluation cards. Expand Rule 6, Rule 10 (PIN), Rule 13 (SI units), Second Schedule, and Food Additives.',
    speech: '"Inspack cross-examines 13 statutory clauses: Rule 10 manufacturer PIN code, Rule 13 SI unit syntax, Second Schedule standard pack sizes, and First Schedule MPE deficiency limits. It even audits food safety additives, alerting consumers to synthetic dyes and preservatives."',
    limitation: 'The LMPC Rulebook spans 43 pages and 19 commodity tables; manual cross-checking in the field is slow and prone to oversight.',
    solution: 'Deterministic legal rules engine that executes all 13 statutory checks simultaneously in under 2 seconds without AI hallucination.',
    impact: 'Protects citizens from illegal shrinkflation, incorrect metric units, and concealed synthetic food additives.'
  },
  {
    num: 7,
    title: 'Official Seventh Schedule Form A & B PDF Generator',
    screen: 'PDF Inspection Sheet Modal',
    duration: '25s',
    action: 'Click "Preview Official Form A / Form B". Scroll through the generated certificate showing legal sections and signature blocks.',
    speech: '"With one click, Inspack generates the official Seventh Schedule Form B Statutory Inspection Sheet in PDF format. It includes sample lot statistics, exact Gazette citations, and official signature blocks for the Inspecting Officer, Manufacturer, and Witness."',
    limitation: 'Drafting statutory inspection sheets and seizure memos manually takes 45 to 60 minutes per sample with high clerical error rates.',
    solution: '1-click automated PDF generation strictly conforming to the Ministry of Consumer Affairs official Seventh Schedule gazette format.',
    impact: 'Reduces field paperwork time by 90% and ensures 100% legal conviction during Section 15 seizure proceedings.'
  },
  {
    num: 8,
    title: 'Industrial Batch Catalog & Shelf Auto-Crop',
    screen: 'Batch Catalog Tab',
    duration: '25s',
    action: 'Open Batch Catalog tab, click "Load Factory Demo Catalog", and click "Run Automated Batch Vetting". Watch items turn green/red.',
    speech: '"For packaging plants and retail supermarkets, our Industrial Batch Inspector automatically crops individual products from a single shelf or conveyor photo. One tap audits 20 products in parallel, allowing officers to quarantine defective manufacturing lots immediately."',
    limitation: 'Inspectors can only test 2-3 random items during factory audits; entire defective batch runs easily escape undetected.',
    solution: 'Multi-product computer vision auto-cropping that audits bulk inventory runs in parallel.',
    impact: 'Enables high-throughput factory inspections and rapid retail market sweep operations for state directorates.'
  },
  {
    num: 9,
    title: 'Dark Store & Quick-Commerce Audit Hub',
    screen: 'E-Commerce Audit Tab',
    duration: '25s',
    action: 'Open E-Commerce Audit tab. Highlight Zepto, Blinkit, and Amazon test cases. Show Unit Sale Price (USP) and digital PDP checks.',
    speech: '"Under the 2021 amendments, e-commerce platforms and quick-commerce dark stores like Zepto and Blinkit must display Unit Sale Price and mandatory packaging panels. Inspack audits live product URLs to detect hidden unit prices and missing declarations."',
    limitation: 'Quick-commerce apps often show generic product images online while dispatching older stock or tampered sticker prices from dark stores.',
    solution: 'Automated digital scraping and cross-validation between web listings and physical packaging requirements.',
    impact: 'Enforces digital transparency, protects online shoppers from hidden price inflation, and holds dark stores accountable.'
  },
  {
    num: 10,
    title: 'Brand Pre-Check Portal / Artwork Simulator',
    screen: 'Brand Pre-Check Tab',
    duration: '25s',
    action: 'Open Brand Pre-Check tab. Show packaging artwork upload, container selection, and the real-time pre-printing validation feedback.',
    speech: '"Compliance should be proactive. Our Brand Pre-Check Portal allows FMCG packaging designers to upload wrapper artwork before mass printing. Inspack validates font sizes and standard pack sizes upfront, preventing costly factory recalls and compounding penalties."',
    limitation: 'Brands only discover packaging defects after products hit market shelves, resulting in massive product recalls and litigation.',
    solution: 'Pre-printing self-audit simulator that verifies label artwork against LMPC 2011 regulations during graphic design.',
    impact: 'Dramatically improves Ease of Doing Business (EoDB), reduces corporate litigation, and fosters proactive legal compliance.'
  },
  {
    num: 11,
    title: 'Officer Enforcement Hub & Statutory Notices',
    screen: 'Officer Analytics Dashboard',
    duration: '25s',
    action: 'Open Enforcement Hub. Show the Fifth Schedule Sampling Calculator (5000 lot = 80 sample size) and click "Legal Notice".',
    speech: '"In the Officer Enforcement Hub, our built-in Fifth Schedule Calculator computes statistical sample sizes and defect allowances. Furthermore, Inspack auto-generates Section 36 Show-Cause Notices and Rule 32 Compounding Orders with statutory compounding fees."',
    limitation: 'Mathematical errors in sampling formulas and improper legal wording in notices cause cases to collapse in magistrate courts.',
    solution: 'Automated Fifth Schedule statistical math and pre-formatted legal notices directly mapped to Legal Metrology Act sections.',
    impact: 'Standardizes enforcement notices nationwide, speeds up non-litigious compounding collections, and prevents legal loopholes.'
  },
  {
    num: 12,
    title: 'National Surveillance Hub & Dynamic Admin Center',
    screen: 'Surveillance Hub & Admin Control Center',
    duration: '25s',
    action: 'Show state compliance rankings and repeat offender tracking. Switch to Admin Center to show the Gazette amendment parser.',
    speech: '"The National Surveillance Hub provides real-time state compliance rankings and repeat offender tracking for Ministry leadership. Through the Admin Center, the Ministry can upload new Gazette amendments to update validation rules nationwide without touching code."',
    limitation: 'Gazette amendments take years to roll out to field staff, and legacy inspection software requires expensive code rewrites.',
    solution: 'Central macro-surveillance analytics combined with a dynamic rule configuration engine that ingests new Gazette notices.',
    impact: 'Gives the Ministry real-time market oversight and future-proof adaptability for upcoming parliamentary amendments.'
  },
  {
    num: 13,
    title: 'Tech Stack Summary & Winning Conclusion',
    screen: 'Rulebook Tab / Final Slide',
    duration: '20s',
    action: 'Show the Official Rulebook tab or presentation slide with team logo and contact details. Conclude with confident body language.',
    speech: '"To conclude: built with React 18, Vite, sovereign Tesseract.js edge OCR, jsPDF, and local-first architecture, Inspack replaces manual guesswork with deterministic legal precision. We are Team Neural Knights, empowering a transparent and fair Indian marketplace!"',
    limitation: 'Manual inspection is outdated, subjective, slow, and cannot scale to meet India\'s booming retail economy.',
    solution: 'Inspack provides an intelligent, sovereign, end-to-end Legal Metrology inspection platform for all stakeholders.',
    impact: 'Protects 1.4 billion consumers, empowers field officers, and modernizes Indian digital governance.'
  }
];

async function generatePDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const totalPagesExp = '{total_pages_count_string}';
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const cNavy = [10, 37, 64];       // #0A2540
  const cGold = [217, 119, 6];      // #D97706
  const cBlue = [37, 99, 235];      // #2563EB
  const cDark = [30, 41, 59];       // #1E293B
  const cLightBg = [248, 250, 252]; // #F8FAFC
  const cBorder = [226, 232, 240];  // #E2E8F0
  const cRed = [220, 38, 38];       // #DC2626
  const cGreen = [22, 163, 74];     // #16A34A

  let y = margin;

  function checkPageBreak(requiredHeight) {
    if (y + requiredHeight > pageHeight - 18) {
      doc.addPage();
      y = margin;
      drawHeader();
    }
  }

  function drawHeader() {
    doc.setFillColor(cNavy[0], cNavy[1], cNavy[2]);
    doc.rect(0, 0, pageWidth, 12, 'F');
    doc.setFillColor(cGold[0], cGold[1], cGold[2]);
    doc.rect(0, 11.5, pageWidth, 0.8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('INSPACK (SIH-26034) • OFFICIAL PROTOTYPE VIDEO PRESENTATION SCRIPT', margin, 7.5);
    doc.setTextColor(252, 211, 77);
    doc.text('Ministry of Consumer Affairs', pageWidth - margin - 42, 7.5);
    y = 16;
  }

  // Cover / Header Banner on Page 1
  drawHeader();

  // Title Box
  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text('INSPACK — Quick-Fire Video Presentation Script', margin + 6, y + 8);

  doc.setFontSize(9);
  doc.setTextColor(cGold[0], cGold[1], cGold[2]);
  doc.text('SMART INDIA HACKATHON 2026 | PROBLEM STATEMENT ID: SIH-26034', margin + 6, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(cDark[0], cDark[1], cDark[2]);
  doc.text('Software System to Check Compliance of Packaged Commodities under Legal Metrology Rules, 2011', margin + 6, y + 19);
  doc.text('Team: Neural Knights (Chaitanya Bharathi Institute of Technology) • Slogan: Ideas • Intelligence • Impact', margin + 6, y + 24);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cBlue[0], cBlue[1], cBlue[2]);
  doc.text('Live Prototype URL: https://inspacknksih2026.vercel.app/  |  Est. Video Duration: 4.5 to 5.5 Mins', margin + 6, y + 29);

  y += 38;

  // Instructions & Tri-Pillar Formula Guide
  doc.setFillColor(254, 243, 199); // light amber
  doc.setDrawColor(252, 211, 77);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14);
  doc.text('HOW TO DELIVER THIS SCRIPT DURING YOUR SCREEN RECORDING:', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 53, 15);
  doc.text('For every screen: (1) Perform the Screen Action -> (2) Speak the Concise Script -> (3) Highlight the Tri-Pillar Impact Formula.', margin + 4, y + 9.5);
  y += 18;

  // Render each Scene
  scenes.forEach((scene, index) => {
    // Estimate card height:
    // Header (8) + Action (10) + Speech (18) + Tri-pillar table (24) ~ 60mm
    checkPageBreak(58);

    const cardStartY = y;
    const cardPadding = 4;

    // Card Header Bar
    doc.setFillColor(cNavy[0], cNavy[1], cNavy[2]);
    doc.roundedRect(margin, y, contentWidth, 7, 2, 2, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`SCENE ${scene.num}: ${scene.title.toUpperCase()}`, margin + 4, y + 4.8);

    // Duration pill
    doc.setFillColor(cGold[0], cGold[1], cGold[2]);
    doc.roundedRect(margin + contentWidth - 36, y + 1.2, 32, 4.6, 2, 2, 'F');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(`Target: ${scene.duration}`, margin + contentWidth - 34, y + 4.4);

    y += 9;

    // Screen / Action Box
    doc.setFillColor(239, 246, 255); // light blue
    doc.setDrawColor(191, 219, 254);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 64, 175);
    doc.text('SCREEN & ACTION:', margin + 3, y + 5.2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const splitAction = doc.splitTextToSize(`[${scene.screen}] ${scene.action}`, contentWidth - 34);
    doc.text(splitAction[0], margin + 30, y + 5.2);
    y += 10;

    // Speech Bubble Box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(cBlue[0], cBlue[1], cBlue[2]);
    doc.setLineWidth(0.4);
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    const splitSpeech = doc.splitTextToSize(scene.speech, contentWidth - 10);
    const speechHeight = Math.max(12, splitSpeech.length * 3.8 + 6);
    
    doc.roundedRect(margin, y, contentWidth, speechHeight, 2, 2, 'FD');
    
    // Left blue accent stripe
    doc.setFillColor(cBlue[0], cBlue[1], cBlue[2]);
    doc.rect(margin, y, 2.5, speechHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(cBlue[0], cBlue[1], cBlue[2]);
    doc.text('SPOKEN SPEECH:', margin + 5, y + 4.5);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.8);
    doc.setTextColor(15, 23, 42);
    doc.text(splitSpeech, margin + 5, y + 8.5);
    y += speechHeight + 2;

    // Tri-Pillar Table using autoTable
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: 'grid',
      styles: {
        fontSize: 7.2,
        cellPadding: 2,
        lineColor: [226, 232, 240],
        lineWidth: 0.3,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [51, 65, 85],
        fontStyle: 'bold',
        fontSize: 7
      },
      columns: [
        { header: 'CURRENT LIMITATION', dataKey: 'limitation' },
        { header: 'INSPACK INNOVATION', dataKey: 'solution' },
        { header: 'GOVERNMENT / CITIZEN IMPACT', dataKey: 'impact' }
      ],
      body: [
        {
          limitation: scene.limitation,
          solution: scene.solution,
          impact: scene.impact
        }
      ],
      columnStyles: {
        limitation: { cellWidth: 58, textColor: [185, 28, 28] },
        solution: { cellWidth: 62, textColor: [21, 128, 61], fontStyle: 'bold' },
        impact: { cellWidth: 62, textColor: [30, 64, 175] }
      }
    });

    y = doc.lastAutoTable.finalY + 4;
  });

  // Appendix: Tech Stack & Architecture Quick Table
  checkPageBreak(50);
  doc.setFillColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.roundedRect(margin, y, contentWidth, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('APPENDIX: TECHNICAL ARCHITECTURE & STACK BREAKDOWN', margin + 4, y + 4.8);
  y += 9;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { fontSize: 7.2, cellPadding: 2.2, lineColor: [226, 232, 240], lineWidth: 0.3 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    columns: [
      { header: 'System Layer', dataKey: 'layer' },
      { header: 'Component & Technology', dataKey: 'tech' },
      { header: 'Governance & Metrology Benefit', dataKey: 'benefit' }
    ],
    body: [
      { layer: 'Layer 1: Field / User', tech: 'React 18 + TypeScript + Vite + Tailwind v4 (PWA)', benefit: 'Responsive, lightweight PWA installable on officer smartphones.' },
      { layer: 'Layer 2: Image Processing', tech: 'Adaptive thresholding, Laplacian blur estimation, Canvas filters', benefit: 'Cleans field photos, removes glare, crops Principal Display Panel.' },
      { layer: 'Layer 3: Document AI & OCR', tech: 'Client-side Tesseract.js sovereign Web Worker', benefit: 'Zero data leakage; zero cloud API cost; 100% offline capability.' },
      { layer: 'Layer 4: Compliance Engine', tech: 'Deterministic Rules Engine (Rules 6, 7, 10, 13, 18, Sched I & II)', benefit: 'Pure mathematical rules; zero AI hallucination; legally unassailable.' },
      { layer: 'Layer 5: Evidence & Decisions', tech: 'Dynamic bounding box visualizer & SHA-256 seal', benefit: 'Pinpoints violations on raw photos for court-admissible proof.' },
      { layer: 'Layer 6: Statutory Reports', tech: 'jsPDF + jsPDF-AutoTable (Seventh Schedule Form A/B)', benefit: 'Automated 1-click legal certificates with officer signature blocks.' },
      { layer: 'Storage & Sync', tech: 'IndexedDB Local-First + Firebase Firestore Sync', benefit: 'Seamless offline storage in mandis with central ministry cloud sync.' }
    ],
    columnStyles: {
      layer: { cellWidth: 40, fontStyle: 'bold', textColor: [10, 37, 64] },
      tech: { cellWidth: 62, textColor: [30, 41, 59] },
      benefit: { cellWidth: 80, textColor: [21, 128, 61] }
    }
  });

  // Footer for all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Inspack 🛡️ • Team Neural Knights (CBIT) • Smart India Hackathon 2026', margin, pageHeight - 6);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 18, pageHeight - 6);
  }

  // Save PDF to project directory
  const outputPath = path.resolve('INSPACK_SIH2026_Quick_Video_Presentation_Script.pdf');
  const pdfBytes = doc.output('arraybuffer');
  fs.writeFileSync(outputPath, Buffer.from(pdfBytes));
  console.log(`PDF successfully created at: ${outputPath}`);

  // Also copy to artifact directory if available
  const artifactDir = 'C:\\Users\\SHAIK SALEEM\\.gemini\\antigravity\\brain\\dce779db-d9d3-4cef-a542-d81126912c64';
  if (fs.existsSync(artifactDir)) {
    const artifactPath = path.join(artifactDir, 'INSPACK_SIH2026_Quick_Video_Presentation_Script.pdf');
    fs.writeFileSync(artifactPath, Buffer.from(pdfBytes));
    console.log(`PDF copied to artifact dir: ${artifactPath}`);
  }
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});

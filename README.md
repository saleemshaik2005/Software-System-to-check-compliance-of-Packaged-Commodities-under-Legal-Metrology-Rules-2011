# Inspack 🛡️📦 — AI-Powered Legal Metrology Compliance Inspection System

> **Smart India Hackathon 2026** | **Problem Statement ID**: `SIH-26034`  
> **Ministry / Organization**: Ministry of Consumer Affairs, Food and Public Distribution  
> **Team**: **Neural Knights** (*Ideas • Intelligence • Impact — Tech for a Fairer Market*)  
> **Theme**: Agriculture, FoodTech & Rural Development  
> **Category**: Software

---

## 🎯 Problem Statement Overview
Packaged commodities are sold extensively through retail stores, supermarkets, and e-commerce dark stores across India. Under the **Legal Metrology Act, 2009** and the **Legal Metrology (Packaged Commodities) Rules, 2011**, every pre-packaged commodity is mandated to carry standard declarations including manufacturer details, net quantity in SI units, Maximum Retail Price (MRP), date of manufacture/packing, and consumer care redressal details.

Enforcement agencies face massive logistical bottlenecks when manually verifying millions of packaging designs. **Inspack** automates this verification pipeline through real-time computer vision, OCR, and a deterministic Legal Metrology rules engine.

---

## 🚀 Key Features

1. **Multi-View Packaging Analysis (Front, Back, Side)**
   - Live camera with on-screen Principal Display Panel (PDP) viewfinder guides and torch toggle.
   - High-resolution multi-view image upload and automated ROI extraction.
2. **Deterministic Legal Metrology (Packaged Commodities) Rules, 2011 Engine**
   - **Rule 6(1)(a) & Rule 10**: Manufacturer / Packer complete postal address & PIN code verification.
   - **Rule 6(1)(b)**: Generic and common commodity name identification.
   - **Rule 6(1)(c) & Rule 13**: Net quantity verification in SI units (`g`, `kg`, `ml`, `l`, `m`, `cm`, `N/U`), banning archaic terms like `dozen`, `gross`, or illegal symbols like `gm/gms`.
   - **Rule 6(1)(d)**: Month and year of packing/manufacturing.
   - **Rule 6(1)(e) & Rule 18**: Statutory MRP formatting (`MRP Rs. XX.XX incl. of all taxes`), dual pricing, and sticker tampering detection.
   - **Rule 6(2)**: Consumer grievance contacts (Helpline phone and email verification).
   - **Rule 7 & Tables I & II**: Principal Display Panel numeral and letter minimum height compliance.
   - **Rule 8**: Surrounding clear area free from printed clutter around quantity declaration.
   - **Rule 9**: Conspicuous contrast ratio check & Hindi/English script verification.
   - **Second Schedule**: Mandatory standard pack size validation across 19 commodity classes (Biscuits, Edible Oils, Tea, Soaps, Atta, etc.).
   - **First Schedule**: Maximum Permissible Error (MPE) allowable deficiency margin calculations.
   - **Rule 32**: Compounding penalty calculator (₹4,000 / ₹2,000).
3. **Evidence-First Visualizer**
   - Direct on-image bounding boxes and status pins highlighting exact rule violations with gazette citations.
4. **Official Seventh Schedule Statutory PDF Generator**
   - 1-click download of the official **Form A (Weight Checking Data Sheet)** and **Form B (Volume/Length Checking Data Sheet)** complete with signature blocks for Authorized Officer, Manufacturer, and Witness.
5. **Multi-Portal Experience**
   - **Legal Metrology Inspector Portal**: Comprehensive inspection tools and enforcement dossier.
   - **Citizen / Consumer Portal**: 1-tap grievance filing to National Consumer Helpline (NCH / 1915).
   - **Brand Pre-Check Portal**: Interactive packaging label simulator for FMCG brands before printing wrappers.
   - **E-Commerce Listing Auditor**: Audits online product listings (Blinkit, Amazon, Flipkart) for mandatory digital PDP declarations.
6. **1-Click Hackathon Presentation Presets**
   - Pre-loaded real-world test cases matching project PPT slides:
     - **Amul Taaza Toned Milk** (Slide 2: 72/100 score, MRP font size violation & obscured customer care).
     - **Tata Agro Basmati Rice** (Slide 3: 100/100 score, fully compliant 1kg pack).
     - **Britannia Biscuits** (Second Schedule 120g non-standard pack size violation).
     - **Fortune Sunflower Oil** (Rule 18 price tampering sticker & missing PIN).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti
- **Computer Vision & OCR**: Client-side Tesseract.js worker + Canvas adaptive thresholding, luminance grayscale, contrast stretching
- **Statutory Document Engine**: jsPDF & jsPDF-AutoTable (official Seventh Schedule Form A & B generator)
- **Local-First Database**: IndexedDB / LocalStorage persistence (100% offline-capable with zero cloud API dependencies or downtime)
- **Mobile & PWA**: Fully responsive mobile PWA (runs as an installable app on smartphones and full dashboard on desktop)

---

## 💻 Quick Start & Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# 1. Clone repository
git clone <repo-url>
cd "SIH 2026 Project"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 👥 Team: Neural Knights

- **Ideas • Intelligence • Impact — Tech for a Fairer Market**
- Smart India Hackathon 2026
- Problem Statement: **SIH-26034**

import React, { useState, useEffect } from 'react';
import { ComplianceReport } from '../types';
import { getScanReports, getInspectionStats, deleteScanReport, DB_CHANGE_EVENT } from '../services/dbService';
import { generateCompliancePDF } from '../services/pdfReportGenerator';
import { PDFPreviewModal } from './PDFPreviewModal';
import {
  BarChart3,
  Search,
  Download,
  Trash2,
  AlertOctagon,
  IndianRupee,
  ShieldCheck,
  Layers,
  Calculator,
  FileText,
  Eye,
  AlertTriangle,
  Scale,
  Printer,
  Copy,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Play,
  RotateCcw
} from 'lucide-react';

interface OfficerAnalyticsDashboardProps {
  onSelectReport: (report: ComplianceReport) => void;
  onPreviewReport?: (report: ComplianceReport) => void;
}

export const OfficerAnalyticsDashboard: React.FC<OfficerAnalyticsDashboardProps> = ({
  onSelectReport,
  onPreviewReport,
}) => {
  const [reports, setReports] = useState<ComplianceReport[]>(() => getScanReports());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_REVIEW'>('ALL');

  // Preview modal state
  const [previewReport, setPreviewReport] = useState<ComplianceReport | null>(null);

  // Statutory Notice Modal state
  const [noticeReport, setNoticeReport] = useState<ComplianceReport | null>(null);
  const [noticeType, setNoticeType] = useState<'SHOW_CAUSE' | 'SEIZURE_MEMO' | 'COMPOUNDING'>('SHOW_CAUSE');
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Fifth Schedule Calculator state - OPEN BY DEFAULT as requested
  const [isCalcOpen, setIsCalcOpen] = useState(true);
  const [lotSize, setLotSize] = useState<number>(1000);
  const [declaredQty, setDeclaredQty] = useState<number>(350);
  const [qtyUnit, setQtyUnit] = useState<string>('g');

  // Interactive Batch Sampling Test State
  const [simulatedWeights, setSimulatedWeights] = useState<number[]>([]);
  const [testMode, setTestMode] = useState<'standard' | 'defective'>('standard');
  const [batchVerdict, setBatchVerdict] = useState<{
    avg: number;
    stdDev: number;
    defectiveCount: number;
    minAvgRequired: number;
    passedAvg: boolean;
    passedDefectives: boolean;
    passedOverall: boolean;
  } | null>(null);

  // Real-time synchronization across all tabs and deletes
  useEffect(() => {
    const handleDbChange = () => {
      setReports(getScanReports());
    };
    window.addEventListener(DB_CHANGE_EVENT, handleDbChange);
    return () => {
      window.removeEventListener(DB_CHANGE_EVENT, handleDbChange);
    };
  }, []);

  const stats = getInspectionStats();

  // Fifth Schedule Table 1 logic (Official Rule 24)
  const getSamplingPlan = (N: number) => {
    if (N <= 500) return { sampleSize: 32, maxDefective: 1, tFactor: 0.379 };
    if (N <= 3200) return { sampleSize: 50, maxDefective: 2, tFactor: 0.328 };
    if (N <= 35000) return { sampleSize: 80, maxDefective: 3, tFactor: 0.283 };
    return { sampleSize: 125, maxDefective: 5, tFactor: 0.252 };
  };

  // Fourth Schedule MPE calculation with rigorous unit conversion (g, kg, ml, L)
  const getMpeForQuantity = (qty: number, unit: string) => {
    let baseQty = qty;
    const isKg = unit.toLowerCase() === 'kg';
    const isL = unit.toLowerCase() === 'l' || unit.toLowerCase() === 'litre';
    if (isKg || isL) {
      baseQty = qty * 1000;
    }

    let mpeBase = 0;
    let mpePercentageText = '';

    if (baseQty <= 50) {
      mpeBase = baseQty * 0.09;
      mpePercentageText = '9%';
    } else if (baseQty <= 100) {
      mpeBase = 4.5;
      mpePercentageText = isL ? '4.5 ml' : '4.5 g';
    } else if (baseQty <= 200) {
      mpeBase = baseQty * 0.045;
      mpePercentageText = '4.5%';
    } else if (baseQty <= 300) {
      mpeBase = 9;
      mpePercentageText = isL ? '9 ml' : '9 g';
    } else if (baseQty <= 500) {
      mpeBase = baseQty * 0.03;
      mpePercentageText = '3%';
    } else if (baseQty <= 1000) {
      mpeBase = 15;
      mpePercentageText = isL ? '15 ml' : '15 g';
    } else if (baseQty <= 10000) {
      mpeBase = baseQty * 0.015;
      mpePercentageText = '1.5%';
    } else if (baseQty <= 15000) {
      mpeBase = 150;
      mpePercentageText = isL ? '150 ml' : '150 g';
    } else {
      mpeBase = baseQty * 0.01;
      mpePercentageText = '1%';
    }

    const displayMpeVal = (isKg || isL) ? mpeBase / 1000 : mpeBase;
    const baseUnit = isL ? 'ml' : 'g';

    return {
      mpeText: mpePercentageText,
      mpeVal: displayMpeVal,
      mpeBaseVal: mpeBase,
      baseUnit
    };
  };

  const sampling = getSamplingPlan(lotSize);
  const mpe = getMpeForQuantity(declaredQty, qtyUnit);
  const minPermittedDefectiveBoundary = Math.max(0, declaredQty - mpe.mpeVal);

  // Run statistical batch simulation
  const handleRunBatchSimulation = (defectType: 'compliant' | 'violating' = 'compliant') => {
    const n = sampling.sampleSize;
    const weights: number[] = [];
    const target = declaredQty;
    const errorLimit = mpe.mpeVal;

    for (let i = 0; i < n; i++) {
      let w = 0;
      if (defectType === 'violating' && i < sampling.maxDefective + 2) {
        // Intentionally create defective units violating MPE boundary
        w = target - errorLimit - (Math.random() * errorLimit * 0.8 + 0.5);
      } else {
        // Normal distribution around declared quantity
        const variance = (Math.random() - 0.45) * errorLimit * 0.9;
        w = target + variance;
      }
      weights.push(Number(w.toFixed(2)));
    }

    const sum = weights.reduce((a, b) => a + b, 0);
    const avg = sum / n;
    const variance = weights.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / (n - 1);
    const stdDev = Math.sqrt(variance);

    const minAvgRequired = target - (sampling.tFactor * stdDev);
    const defectiveCount = weights.filter(w => w < minPermittedDefectiveBoundary).length;

    const passedAvg = avg >= minAvgRequired;
    const passedDefectives = defectiveCount <= sampling.maxDefective;
    const passedOverall = passedAvg && passedDefectives;

    setSimulatedWeights(weights);
    setBatchVerdict({
      avg: Number(avg.toFixed(2)),
      stdDev: Number(stdDev.toFixed(2)),
      defectiveCount,
      minAvgRequired: Number(minAvgRequired.toFixed(2)),
      passedAvg,
      passedDefectives,
      passedOverall
    });
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.productInfo.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.productInfo.manufacturerName && r.productInfo.manufacturerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.overallStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Repeat offender calculation
  const mfgViolationsMap: { [key: string]: { count: number; name: string; lastViolation: string } } = {};
  reports.forEach((r) => {
    if (r.overallStatus !== 'COMPLIANT' && r.productInfo.manufacturerName) {
      const name = r.productInfo.manufacturerName.trim();
      if (!mfgViolationsMap[name]) {
        mfgViolationsMap[name] = { count: 0, name, lastViolation: r.productInfo.productName };
      }
      mfgViolationsMap[name].count += 1;
    }
  });
  const repeatOffenders = Object.values(mfgViolationsMap).filter((item) => item.count >= 2);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this inspection record from the enforcement dossier?')) {
      deleteScanReport(id);
    }
  };

  const handleDownloadPDF = (report: ComplianceReport, e: React.MouseEvent) => {
    e.stopPropagation();
    generateCompliancePDF(report);
  };

  const handleOpenPreview = (report: ComplianceReport, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPreviewReport) {
      onPreviewReport(report);
    } else {
      setPreviewReport(report);
    }
  };

  const handleOpenNotice = (report: ComplianceReport, e: React.MouseEvent) => {
    e.stopPropagation();
    setNoticeReport(report);
    setNoticeType('SHOW_CAUSE');
    setCopiedNotice(false);
  };

  const copyNoticeText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  const generateStatutoryNoticeText = () => {
    if (!noticeReport) return '';
    const p = noticeReport.productInfo;
    const dateStr = new Date(noticeReport.scanTimestamp).toLocaleDateString('en-IN');
    const failedRules = noticeReport.evaluations
      .filter((e) => e.status === 'FAIL')
      .map((e) => `• ${e.ruleNumber} (${e.ruleTitle}): ${e.explanation}`)
      .join('\n');

    if (noticeType === 'SEIZURE_MEMO') {
      return `GOVERNMENT OF INDIA
MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION
DIRECTORATE OF LEGAL METROLOGY

FORM B: SEIZURE RECEIPT & DETENTION ORDER
[Under Section 15(1)(d) of Legal Metrology Act, 2009 read with Rule 21(3) of LMPC Rules, 2011]

Seizure Memo ID: SEZ-${noticeReport.id.replace('INSP-', '')}
Date of Seizure: ${dateStr}
Place of Seizure: Supermarket Retail Premises / Dark Store Hub
Inspecting Officer: ${noticeReport.inspectorName || 'Legal Metrology Inspector'} (Badge: ${noticeReport.inspectorBadgeNumber || 'LM-ND-4092'})

1. PARTICULARS OF PACKAGED COMMODITIES SEIZED:
Commodity Name: ${p.productName}
Generic Name: ${p.genericName || 'Packaged Goods'}
Brand: ${p.brandName || 'N/A'}
Declared Net Quantity: ${p.netQuantity} ${p.quantityUnit}
Declared MRP: ${p.mrpString}
Batch / Packing Date: ${p.mfgMonth}/${p.mfgYear}
Manufacturer / Packer: ${p.manufacturerName || 'Unknown Manufacturer'}
Address: ${p.manufacturerAddress || 'Address not declared'}

2. GROUNDS OF SEIZURE (NON-COMPLIANCE DETECTED):
${failedRules || '• Violations of mandatory declarations under Rule 6 and packaging dimensions under Rule 7.'}

3. ORDER:
The undersigned has seized and taken custody of the aforesaid lots under Section 15 of the Act. The dealer/custodian is directed not to dispose, alter, or remove the packages until further orders from the Controller of Legal Metrology.

Total Statutory Compounding Fine Assessed: ₹${noticeReport.totalCompoundingFine.toLocaleString('en-IN')}

Seal & Signature of Inspecting Officer
Legal Metrology Inspectorate`;
    }

    if (noticeType === 'COMPOUNDING') {
      return `GOVERNMENT OF INDIA
DIRECTORATE OF LEGAL METROLOGY

NOTICE FOR COMPOUNDING OF OFFENSE
[Under Section 48 of Legal Metrology Act, 2009]

Notice ID: CMP-${noticeReport.id.replace('INSP-', '')}
Date: ${dateStr}

To,
${p.manufacturerName || 'The Manufacturer / Packer / Retailer'}
${p.manufacturerAddress || 'Address on Record'}

Subject: Offer for Compounding of Offense under Section 48 for commodity "${p.productName}"

Sir/Madam,
Whereas an inspection conducted on ${dateStr} of the packaged commodity "${p.productName}" revealed the following violations under Legal Metrology (Packaged Commodities) Rules, 2011:
${failedRules}

Under Section 48 of the Act, you are hereby offered the opportunity to compound the offense by paying a compounding sum of:
TOTAL COMPOUNDING AMOUNT: ₹${noticeReport.totalCompoundingFine.toLocaleString('en-IN')}

Failure to accept compounding within 15 (fifteen) days from receipt of this notice will result in initiation of prosecution under Section 36 in the Court of Metropolitan Magistrate.

Controller / Authorized Officer
Department of Legal Metrology`;
    }

    return `GOVERNMENT OF INDIA
MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION
DIRECTORATE OF LEGAL METROLOGY

FORM C: STATUTORY SHOW CAUSE NOTICE
[Under Section 18 & Section 36 of Legal Metrology Act, 2009 read with Rule 20 of LMPC Rules, 2011]

Notice Ref No: SCN-${noticeReport.id.replace('INSP-', '')}/2026
Date of Issue: ${dateStr}

To,
M/s ${p.manufacturerName || 'Concerned Packer / Manufacturer'}
${p.manufacturerAddress || 'Principal Place of Business'}

Subject: Show Cause Notice for non-compliance with Packaged Commodities Rules on "${p.productName}"

WHEREAS an authorized inspection conducted under Section 15 on ${dateStr} revealed that the packaged commodity "${p.productName}" manufactured/packed/distributed by you violates statutory declarations:

STATUTORY INFRACTIONS RECORDED:
${failedRules}

YOU ARE HEREBY DIRECTED TO SHOW CAUSE within 15 (fifteen) days of receipt of this notice as to why penal action under Section 36(1) (Penalty up to ₹25,000 for first offense) should not be initiated against your establishment, or why your product stock should not be detained under Rule 21(3).

If you fail to submit a written explanation within the stipulated period, it will be presumed that you have no defense to offer and proceedings will be initiated ex-parte.

Issued By:
${noticeReport.inspectorName || 'Legal Metrology Inspector'}
Legal Metrology Inspector, Central Enforcement Division
Government of India`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Stat KPI Cards - Matte Black & Neutral Gray */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs mb-1 font-bold uppercase tracking-wider">
            <span>Total Inspected</span>
            <Layers className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-zinc-100">{stats.total} Packages</div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Across retail & dark stores</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs mb-1 font-bold uppercase tracking-wider">
            <span>Compliance Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.complianceRate}%</div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">{stats.compliant} fully conforming</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs mb-1 font-bold uppercase tracking-wider">
            <span>Flagged for Seizure</span>
            <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-600 dark:text-red-400">{stats.nonCompliant} Packages</div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Under Rule 20(1) & 21(3)</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs mb-1 font-bold uppercase tracking-wider">
            <span>Compounding Fines</span>
            <IndianRupee className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            ₹{stats.totalFines.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Under Section 32 & 48</div>
        </div>
      </div>

      {/* FIFTH SCHEDULE STATISTICAL SAMPLING & MPE CALCULATOR ACCORDION */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
        <button
          onClick={() => setIsCalcOpen(!isCalcOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
              <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100">
                  Fifth Schedule Statistical Sampling & Fourth Schedule MPE Calculator
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Official Rule 24 Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Calculate required statistical sample size $n$, acceptable defect limit $c$, Maximum Permissible Error (MPE), and run batch tests
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-zinc-400">
            <span>{isCalcOpen ? 'Hide Tool' : 'Open Field Tool'}</span>
            {isCalcOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isCalcOpen && (
          <div className="p-5 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/60 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Lot Size ($N$) on Shop Floor / Warehouse
                </label>
                <input
                  type="number"
                  min="1"
                  value={lotSize}
                  onChange={(e) => setLotSize(parseInt(e.target.value) || 1)}
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 p-2.5 rounded-xl text-xs font-bold text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-[#00A651]"
                />
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 block">
                  Fifth Schedule Table 1: Tiered 32, 50, 80, 125 packs
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Declared Net Quantity ($Q_n$)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    value={declaredQty}
                    onChange={(e) => setDeclaredQty(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 p-2.5 rounded-xl text-xs font-bold text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-[#00A651]"
                  />
                  <select
                    value={qtyUnit}
                    onChange={(e) => setQtyUnit(e.target.value)}
                    className="bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 p-2.5 rounded-xl text-xs font-bold text-slate-900 dark:text-zinc-100"
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">L</option>
                  </select>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 block">
                  Fourth Schedule MPE standard
                </span>
              </div>

              <div className="sm:col-span-1 flex flex-col justify-end">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs">
                  <div className="font-bold text-slate-900 dark:text-zinc-200">Legal Acceptance Condition:</div>
                  <div className="text-[11px] font-mono text-[#00A651] dark:text-emerald-400 mt-0.5 font-bold">
                    Avg Net Wt ≥ Qn - ({sampling.tFactor} × s)
                  </div>
                </div>
              </div>
            </div>

            {/* Calculator Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white dark:bg-zinc-800 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-400 block">Required Sample Size ($n$)</span>
                <span className="text-xl font-black text-slate-900 dark:text-zinc-100 mt-0.5 block">
                  {sampling.sampleSize} Packs
                </span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400">Rule 24 Table 1 Mandate</span>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-400 block">Max Defective Units ($c$)</span>
                <span className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5 block">
                  ≤ {sampling.maxDefective} Packs
                </span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400">Allowed exceeding MPE</span>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-400 block">Max Permissible Error (MPE)</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {mpe.mpeText} ({mpe.mpeVal} {qtyUnit})
                </span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400">Fourth Schedule Table</span>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-400 block">Single Unit Defect Limit</span>
                <span className="text-xl font-black text-red-600 dark:text-red-400 mt-0.5 block">
                  &lt; {minPermittedDefectiveBoundary.toFixed(2)} {qtyUnit}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400">Classified as short-weight</span>
              </div>
            </div>

            {/* INTERACTIVE BATCH VERIFICATION TESTER */}
            <div className="mt-3 p-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Live Batch Net Weight Sampling Test</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Test a sample of {sampling.sampleSize} packages drawn randomly from lot size {lotSize}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunBatchSimulation('compliant')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Simulate Conforming Lot</span>
                  </button>

                  <button
                    onClick={() => handleRunBatchSimulation('violating')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Simulate Short-Weight Lot</span>
                  </button>
                </div>
              </div>

              {batchVerdict && (
                <div className={`p-4 rounded-xl border ${
                  batchVerdict.passedOverall
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800'
                } space-y-2 animate-in fade-in duration-150`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                      batchVerdict.passedOverall
                        ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                        : 'bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-200'
                    }`}>
                      {batchVerdict.passedOverall ? '✓ BATCH STATUTORILY COMPLIANT' : '⚠ BATCH FAILED — SEIZURE ACTION REQUIRED'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-300">
                      Sample: {sampling.sampleSize} Packs
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold pt-1">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">Sample Average (x̄)</span>
                      <span className="font-mono font-black text-slate-900 dark:text-zinc-100">{batchVerdict.avg} {qtyUnit}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">Min Required Average</span>
                      <span className="font-mono font-black text-slate-900 dark:text-zinc-100">{batchVerdict.minAvgRequired} {qtyUnit}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">Defective Units Count</span>
                      <span className={`font-mono font-black ${batchVerdict.passedDefectives ? 'text-emerald-600' : 'text-red-600'}`}>
                        {batchVerdict.defectiveCount} (Max Allowed: {sampling.maxDefective})
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">Standard Deviation (s)</span>
                      <span className="font-mono font-black text-slate-900 dark:text-zinc-100">{batchVerdict.stdDev}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* REPEAT OFFENDER ESCALATION TRACKER */}
      {repeatOffenders.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-black text-sm mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Repeat Offender Escalation Tracker — Section 36(2) Enhanced Penalty</span>
          </div>
          <p className="text-xs text-red-700 dark:text-red-400 mb-3">
            Establishments with multiple recorded violations face statutory enhancement from ₹25,000 to ₹50,000 compounding or 1-year imprisonment.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {repeatOffenders.map((offender, idx) => (
              <div key={idx} className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-zinc-800 p-3.5 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-zinc-100 truncate">{offender.name}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                    {offender.count} Violations
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                  Last commodity: <span className="text-slate-700 dark:text-zinc-200 font-semibold">{offender.lastViolation}</span>
                </div>
                <div className="text-[10px] font-mono text-red-600 dark:text-red-400 font-bold mt-1">
                  Mandatory Action: Section 36(2) Escalation
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Risk Breakdown */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-2xl shadow-xs transition-colors">
        <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          <span>Category Risk Heatmap (LMPC Enforcement Hotspots)</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-slate-200 dark:border-zinc-700">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-800 dark:text-zinc-200">Edible Oils</span>
              <span className="text-[10px] text-red-600 font-bold">High Risk</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-red-500 h-full w-[72%]"></div>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400">Sticker tampering & Dual unit issues</span>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-slate-200 dark:border-zinc-700">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-800 dark:text-zinc-200">Biscuits & Bakery</span>
              <span className="text-[10px] text-amber-600 font-bold">Medium Risk</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-amber-500 h-full w-[45%]"></div>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400">Second Schedule size non-compliance</span>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-slate-200 dark:border-zinc-700">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-800 dark:text-zinc-200">Dairy & Milk</span>
              <span className="text-[10px] text-amber-600 font-bold">Medium Risk</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-amber-500 h-full w-[38%]"></div>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400">Font size on PDP below Table-I</span>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-slate-200 dark:border-zinc-700">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-800 dark:text-zinc-200">Foodgrains / Atta</span>
              <span className="text-[10px] text-emerald-600 font-bold">Low Risk</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-emerald-500 h-full w-[15%]"></div>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400">Standard 1kg/5kg packs conforming</span>
          </div>
        </div>
      </div>

      {/* Inspection History & Case Repository */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-zinc-100 tracking-tight">
              Inspection Dossier & Seizure Log
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Click any record to load in inspection view, preview PDF sheet, or generate Section 18/36 statutory notices
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search product, manufacturer..."
                className="bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs pl-8 pr-3 py-1.5 rounded-xl w-48 sm:w-64 focus:outline-none focus:border-[#00A651]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#00A651]"
            >
              <option value="ALL">All Status</option>
              <option value="COMPLIANT">Compliant Only</option>
              <option value="NON_COMPLIANT">Violations Only</option>
              <option value="NEEDS_REVIEW">Needs Review</option>
            </select>
          </div>
        </div>

        {/* Table of Scans */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
          <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
            <thead className="bg-slate-50 dark:bg-zinc-800/80 text-[11px] uppercase font-bold text-slate-600 dark:text-zinc-400 border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4">Inspection ID</th>
                <th className="py-3 px-4">Commodity / Manufacturer</th>
                <th className="py-3 px-4">Net Qty & MRP</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4">Penalty</th>
                <th className="py-3 px-4 text-right">Statutory Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredReports.map((report) => {
                const isPass = report.overallStatus === 'COMPLIANT';
                const isWarn = report.overallStatus === 'NEEDS_REVIEW';

                return (
                  <tr
                    key={report.id}
                    onClick={() => onSelectReport(report)}
                    className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-zinc-100">
                      {report.id}
                      <span className="block text-[10px] text-slate-500 dark:text-zinc-400 font-normal">
                        {new Date(report.scanTimestamp).toLocaleDateString('en-IN')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-black text-slate-900 dark:text-zinc-100">{report.productInfo.productName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate max-w-xs">
                        {report.productInfo.manufacturerName}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-zinc-100">
                        {report.productInfo.netQuantity} {report.productInfo.quantityUnit}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                        {report.productInfo.mrpString}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isPass
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : isWarn
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
                        }`}
                      >
                        {isPass ? 'COMPLIANT' : isWarn ? 'WARNINGS' : 'NON-COMPLIANT'}
                        <span className="ml-1">({report.score}%)</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-red-600 dark:text-red-400">
                      {report.totalCompoundingFine > 0
                        ? `₹${report.totalCompoundingFine.toLocaleString('en-IN')}`
                        : 'Nil'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Interactive In-Website PDF Preview */}
                        <button
                          onClick={(e) => handleOpenPreview(report, e)}
                          className="p-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-emerald-600 rounded-lg text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer"
                          title="Preview Inspection Sheet in Website"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Statutory Notice Generator (if non-compliant) */}
                        {!isPass && (
                          <button
                            onClick={(e) => handleOpenNotice(report, e)}
                            className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white dark:bg-red-950/50 dark:hover:bg-red-600 rounded-lg text-red-600 dark:text-red-400 transition-colors cursor-pointer border border-red-200 dark:border-red-800"
                            title="Generate Statutory Notice / Seizure Memo"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Direct PDF Download */}
                        <button
                          onClick={(e) => handleDownloadPDF(report, e)}
                          className="p-1.5 bg-slate-100 hover:bg-zinc-800 hover:text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer"
                          title="Download Form A/B PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Record */}
                        <button
                          onClick={(e) => handleDelete(report.id, e)}
                          className="p-1.5 bg-slate-100 hover:bg-red-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-red-600 rounded-lg text-slate-500 transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 dark:text-zinc-500">
                    No inspection records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* IN-WEBSITE PDF PREVIEW MODAL */}
      {previewReport && (
        <PDFPreviewModal
          isOpen={true}
          onClose={() => setPreviewReport(null)}
          report={previewReport}
        />
      )}

      {/* STATUTORY NOTICE GENERATOR MODAL */}
      {noticeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Top Bar */}
            <div className="px-6 py-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-red-400" />
                <div>
                  <h3 className="text-sm font-black tracking-tight">Statutory Legal Metrology Notice Generator</h3>
                  <p className="text-[11px] text-zinc-400 font-mono">Case: {noticeReport.id} • {noticeReport.productInfo.productName}</p>
                </div>
              </div>
              <button
                onClick={() => setNoticeReport(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notice Selector Tabs */}
            <div className="flex border-b border-slate-200 dark:border-zinc-800 px-6 pt-3 gap-2 bg-slate-50 dark:bg-zinc-950">
              <button
                onClick={() => setNoticeType('SHOW_CAUSE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
                  noticeType === 'SHOW_CAUSE'
                    ? 'bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 border-t border-x border-slate-200 dark:border-zinc-800'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                Section 18/36 Show Cause Notice
              </button>
              <button
                onClick={() => setNoticeType('SEIZURE_MEMO')}
                className={`px-3 py-1.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
                  noticeType === 'SEIZURE_MEMO'
                    ? 'bg-white dark:bg-zinc-900 text-red-600 dark:text-red-400 border-t border-x border-slate-200 dark:border-zinc-800'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                Form B: Seizure & Detention Order
              </button>
              <button
                onClick={() => setNoticeType('COMPOUNDING')}
                className={`px-3 py-1.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer ${
                  noticeType === 'COMPOUNDING'
                    ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 border-t border-x border-slate-200 dark:border-zinc-800'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                Section 48 Compounding Offer
              </button>
            </div>

            {/* Generated Notice Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-zinc-950">
              <pre className="whitespace-pre-wrap font-mono text-xs bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 leading-relaxed shadow-inner">
                {generateStatutoryNoticeText()}
              </pre>
            </div>

            {/* Notice Footer Actions */}
            <div className="px-6 py-3.5 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                Official document ready for service under Section 18 of LM Act, 2009
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => copyNoticeText(generateStatutoryNoticeText())}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#00A651] hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  {copiedNotice ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNotice ? 'Copied!' : 'Copy Notice Text'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

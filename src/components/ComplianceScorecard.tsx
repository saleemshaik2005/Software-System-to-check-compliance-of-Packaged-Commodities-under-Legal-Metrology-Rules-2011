import React from 'react';
import { ComplianceReport } from '../types';
import { generateCompliancePDF } from '../services/pdfReportGenerator';
import {
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Download,
  FileText,
  ShieldAlert,
  IndianRupee,
  Share2,
  MessageSquareWarning,
  Building2,
  MapPin,
  Calendar,
  Layers,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ComplianceScorecardProps {
  report: ComplianceReport;
  onOpenGrievanceModal?: () => void;
}

export const ComplianceScorecard: React.FC<ComplianceScorecardProps> = ({
  report,
  onOpenGrievanceModal,
}) => {
  const isCompliant = report.overallStatus === 'COMPLIANT';
  const isWarning = report.overallStatus === 'NEEDS_REVIEW';
  const p = report.productInfo;

  const handleDownloadPDF = () => {
    generateCompliancePDF(report);
  };

  const handleCelebrate = () => {
    if (isCompliant) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
      <div>
        {/* Top Header & Ref */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              {report.id} • {report.formType}
            </div>
            <h2 className="text-lg font-black text-white tracking-tight">
              Legal Metrology Compliance Audit
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              title="Download Seventh Schedule Form A/B Official Data Sheet"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Form {report.formType === 'Form A' ? 'A' : 'B'} PDF</span>
            </button>
          </div>
        </div>

        {/* Big Status Banner & Score Wheel */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mb-5">
          {/* Circular Score Dial */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * report.score) / 100}
                  className={`transition-all duration-1000 ${
                    isCompliant
                      ? 'text-emerald-500'
                      : isWarning
                      ? 'text-amber-500'
                      : 'text-red-500'
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white leading-none">
                  {report.score}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                  / 100 Score
                </span>
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-400 mt-2">
              Compliance Index
            </span>
          </div>

          {/* Status Verdict Details */}
          <div className="sm:col-span-8 flex flex-col gap-2.5">
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                isCompliant
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                  : isWarning
                  ? 'bg-amber-950/40 border-amber-800/80 text-amber-300'
                  : 'bg-red-950/40 border-red-800/80 text-red-300'
              }`}
            >
              {isCompliant && <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />}
              {isWarning && <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />}
              {!isCompliant && !isWarning && <AlertOctagon className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />}
              <div>
                <div className="text-sm font-black uppercase tracking-wide">
                  {isCompliant
                    ? 'CONFORMING TO LEGAL METROLOGY RULES'
                    : isWarning
                    ? 'STATUTORY WARNINGS / NEEDS REVIEW'
                    : 'NON-CONFORMING • VIOLATIONS DETECTED'}
                </div>
                <div className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {report.summaryRemarks}
                </div>
              </div>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="block text-red-400 font-black text-lg leading-none">
                  {report.violationsCount}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Violations</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="block text-amber-400 font-black text-lg leading-none">
                  {report.warningsCount}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Warnings</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="block text-emerald-400 font-black text-lg leading-none">
                  {report.passedCount}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Extracted Statutory Product Summary Card */}
        <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 mb-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Detected Declarations on Package</span>
            <span className="text-[10px] font-normal text-cyan-400 font-mono">OCR + Vision AI Verified</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Product / Generic</span>
              <span className="font-bold text-white truncate block" title={p.productName}>
                {p.productName}
              </span>
            </div>

            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Net Quantity</span>
              <span className="font-bold text-cyan-300 truncate block">
                {p.netQuantity} {p.quantityUnit}
              </span>
            </div>

            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Maximum Retail Price</span>
              <span className={`font-bold truncate block ${p.isStickerPrice ? 'text-red-400' : 'text-emerald-400'}`}>
                {p.mrpString}
              </span>
            </div>

            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Mfg / Packing Date</span>
              <span className="font-bold text-white truncate block">
                {p.mfgMonth}/{p.mfgYear}
              </span>
            </div>

            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Origin / Importer</span>
              <span className="font-bold text-white truncate block">
                {p.countryOfOrigin || 'India'}
              </span>
            </div>

            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Consumer Care Helpline</span>
              <span className="font-bold text-white truncate block">
                {p.consumerCarePhone || 'Missing Helpline'}
              </span>
            </div>
          </div>
        </div>

        {/* Compounding Penalty / Statutory Notice Callout */}
        {report.totalCompoundingFine > 0 && (
          <div className="bg-red-950/30 border border-red-900/60 rounded-xl p-3 flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-red-300">
                  Statutory Compounding Penalty under Rule 32
                </div>
                <div className="text-[11px] text-slate-400">
                  Liable for seizure under Rule 20(1) and compounding fine
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-red-400">
                ₹{report.totalCompoundingFine.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
        <button
          onClick={handleDownloadPDF}
          className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Official {report.formType} Inspection Sheet</span>
        </button>

        {onOpenGrievanceModal && (
          <button
            onClick={onOpenGrievanceModal}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <MessageSquareWarning className="w-4 h-4 text-amber-400" />
            <span>File NCH Grievance</span>
          </button>
        )}
      </div>
    </div>
  );
};

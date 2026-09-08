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
  MessageSquareWarning,
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
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const p = report.productInfo;

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateCompliancePDF(report);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCelebrate = () => {
    if (isCompliant) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <div>
        {/* Top Header & Ref */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
          <div>
            <div className="text-[11px] font-mono font-bold text-[#0A3663] uppercase tracking-wider">
              {report.id} • {report.formType}
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Legal Metrology Compliance Audit
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 bg-[#00A651] hover:bg-emerald-600 disabled:bg-slate-400 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all cursor-pointer"
              title="Download Seventh Schedule Form A/B Official Data Sheet with Photographic Evidence"
            >
              <Download className={`w-3.5 h-3.5 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
              <span>{isGeneratingPdf ? 'Generating Official PDF...' : `Download Form ${report.formType === 'Form A' ? 'A' : 'B'} PDF`}</span>
            </button>
          </div>
        </div>

        {/* Big Status Banner & Score Wheel */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mb-5">
          {/* Circular Score Dial */}
          <div
            onClick={handleCelebrate}
            className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-200"
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
                <span className="text-3xl font-black text-slate-900 leading-none">
                  {report.score}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">
                  / 100 Score
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-600 mt-2">
              Compliance Index
            </span>
          </div>

          {/* Status Verdict Details */}
          <div className="sm:col-span-8 flex flex-col gap-2.5">
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                isCompliant
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : isWarning
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-red-50 border-red-300 text-red-950'
              }`}
            >
              {isCompliant && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />}
              {isWarning && <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />}
              {!isCompliant && !isWarning && <AlertOctagon className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />}
              <div>
                <div className="text-sm font-black uppercase tracking-wide">
                  {isCompliant
                    ? 'CONFORMING TO LEGAL METROLOGY RULES'
                    : isWarning
                    ? 'STATUTORY WARNINGS / NEEDS REVIEW'
                    : 'NON-CONFORMING • VIOLATIONS DETECTED'}
                </div>
                <div className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {report.summaryRemarks}
                </div>
              </div>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="block text-red-600 font-black text-lg leading-none">
                  {report.violationsCount}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Violations</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="block text-amber-600 font-black text-lg leading-none">
                  {report.warningsCount}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Warnings</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="block text-emerald-600 font-black text-lg leading-none">
                  {report.passedCount}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Extracted Statutory Product Summary Card */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 mb-4">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Detected Declarations on Package</span>
            <span className="text-[10px] font-bold text-[#0A3663] font-mono">OCR + Vision AI Verified</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">Product / Generic</span>
              <span className="font-bold text-slate-900 truncate block" title={p.productName}>
                {p.productName}
              </span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">Net Quantity</span>
              <span className="font-black text-[#0A3663] truncate block">
                {p.netQuantity} {p.quantityUnit}
              </span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">Maximum Retail Price</span>
              <span className={`font-bold truncate block ${p.isStickerPrice ? 'text-red-600' : 'text-emerald-700'}`}>
                {p.mrpString}
              </span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">Mfg / Packing Date</span>
              <span className="font-bold text-slate-900 truncate block">
                {p.mfgMonth}/{p.mfgYear}
              </span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">Origin / Importer</span>
              <span className="font-bold text-slate-900 truncate block">
                {p.countryOfOrigin || 'India'}
              </span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">Consumer Care Helpline</span>
              <span className="font-bold text-slate-900 truncate block">
                {p.consumerCarePhone || 'Missing Helpline'}
              </span>
            </div>
          </div>
        </div>

        {/* Compounding Penalty / Statutory Notice Callout */}
        {report.totalCompoundingFine > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-red-900">
                  Statutory Compounding Penalty under Rule 32
                </div>
                <div className="text-[11px] text-red-700">
                  Liable for seizure under Rule 20(1) and compounding fine
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-red-700">
                ₹{report.totalCompoundingFine.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200">
        <button
          onClick={handleDownloadPDF}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#0A3663] hover:bg-blue-900 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Official {report.formType} Inspection Sheet</span>
        </button>

        {onOpenGrievanceModal && (
          <button
            onClick={onOpenGrievanceModal}
            className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 transition-all cursor-pointer"
          >
            <MessageSquareWarning className="w-4 h-4 text-amber-600" />
            <span>File NCH Grievance</span>
          </button>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { ComplianceReport, Language } from '../types';
import { getTranslation, translateProductText, formatNetQuantityVernacular } from '../services/i18nService';
import { generateCompliancePDF } from '../services/pdfReportGenerator';
import {
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Download,
  FileText,
  ShieldAlert,
  MessageSquareWarning,
  Archive,
  Eye,
  Clock,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveScanReport } from '../services/dbService';

interface ComplianceScorecardProps {
  report: ComplianceReport;
  onOpenGrievanceModal?: () => void;
  onPreviewPDF?: () => void;
  currentLang?: Language;
}

export const ComplianceScorecard: React.FC<ComplianceScorecardProps> = ({
  report,
  onOpenGrievanceModal,
  onPreviewPDF,
  currentLang = 'en',
}) => {
  const isCompliant = report.overallStatus === 'COMPLIANT';
  const isWarning = report.overallStatus === 'NEEDS_REVIEW';
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const p = report.productInfo;

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateCompliancePDF(report);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSaveToDatabase = async () => {
    try {
      setIsSaving(true);
      saveScanReport(report);
      setIsSaved(true);
    } finally {
      setIsSaving(false);
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
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-colors">
      <div>
        {/* Top Header & Ref */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-4">
          <div>
            <div className="text-[11px] font-mono font-bold text-blue-900 uppercase tracking-wider">
              {report.id} • {report.formType}
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {getTranslation('legal_compliance_audit', currentLang)}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSaveToDatabase}
              disabled={isSaving}
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer ${
                isSaved
                  ? 'bg-blue-900 text-white border border-blue-800'
                  : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}
              title="Store this inspection record in central metrology database and local vault"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{getTranslation('btn_stored_in_db', currentLang)}</span>
                </>
              ) : (
                <>
                  <Archive className="w-3.5 h-3.5" />
                  <span>{isSaving ? getTranslation('btn_storing', currentLang) : getTranslation('btn_store_in_db', currentLang)}</span>
                </>
              )}
            </button>

            {onPreviewPDF && (
              <button
                onClick={onPreviewPDF}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                title="Preview Official Seventh Schedule Form A/B Sheet in browser"
              >
                <FileText className="w-3.5 h-3.5 text-blue-700" />
                <span>{getTranslation('btn_preview_pdf', currentLang)}</span>
              </button>
            )}

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
              title="Download Seventh Schedule Form A/B Official Data Sheet with Photographic Evidence"
            >
              <Download className={`w-3.5 h-3.5 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
              <span>{isGeneratingPdf ? 'Generating...' : getTranslation('btn_download_pdf', currentLang)}</span>
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
            <span className="text-[10px] font-bold text-blue-900 font-mono">OCR + Vision AI Verified</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">{getTranslation('stat_product_name', currentLang)}</span>
              <span className="font-bold text-slate-900 truncate block" title={p.productName}>
                {currentLang !== 'en' ? translateProductText(p.productName, currentLang) : p.productName}
              </span>
              {currentLang !== 'en' && (
                <span className="text-[9px] text-slate-400 block truncate font-normal">EN: {p.productName}</span>
              )}
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">{getTranslation('stat_net_qty', currentLang)}</span>
              <span className="font-black text-blue-900 truncate block">
                {currentLang !== 'en'
                  ? formatNetQuantityVernacular(p.netQuantity, p.quantityUnit, currentLang)
                  : (p.rawQuantityString || `${p.netQuantity} ${p.quantityUnit}`)}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">{getTranslation('stat_mrp', currentLang)}</span>
              <span className={`font-bold truncate block ${p.isStickerPrice ? 'text-red-600' : 'text-emerald-700'}`}>
                {p.mrpString}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">{getTranslation('stat_mfg_date', currentLang)}</span>
              <span className="font-bold text-slate-900 truncate block">
                {p.mfgMonth}/{p.mfgYear}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">{getTranslation('stat_origin', currentLang)}</span>
              <span className="font-bold text-slate-900 truncate block">
                {currentLang !== 'en' ? translateProductText(p.countryOfOrigin || 'India', currentLang) : (p.countryOfOrigin || 'India')}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold">{getTranslation('stat_consumer_care', currentLang)}</span>
              <span className="font-bold text-slate-900 truncate block">
                {p.consumerCarePhone || 'Missing Helpline'}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Shelf-Life & Expiry Status Widget */}
        {report.expiryAudit && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Product Shelf-Life & Expiry Verification</span>
              </span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                report.expiryAudit.status === 'EXPIRED'
                  ? 'bg-red-600 text-white'
                  : report.expiryAudit.status === 'NEAR_EXPIRY'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {report.expiryAudit.status === 'EXPIRED' ? 'EXPIRED' : report.expiryAudit.status === 'NEAR_EXPIRY' ? 'NEAR EXPIRY' : 'ACTIVE / FRESH'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Mfg: <strong className="text-slate-900">{report.expiryAudit.mfgDateFormatted}</strong> • Expiry: <strong className="text-slate-900">{report.expiryAudit.expiryDateFormatted}</strong>
                </span>
                <span className="font-mono font-bold text-slate-900 text-xs">
                  {report.expiryAudit.status === 'EXPIRED'
                    ? `${Math.abs(report.expiryAudit.remainingDays)} days overdue`
                    : `${report.expiryAudit.remainingDays} days remaining (${report.expiryAudit.shelfLifeRemainingPercent}%)`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    report.expiryAudit.status === 'EXPIRED'
                      ? 'bg-red-600'
                      : report.expiryAudit.status === 'NEAR_EXPIRY'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${report.expiryAudit.status === 'EXPIRED' ? 100 : report.expiryAudit.shelfLifeRemainingPercent}%` }}
                />
              </div>

              <div className={`p-2.5 rounded-xl text-[11px] font-medium ${
                report.expiryAudit.status === 'EXPIRED'
                  ? 'bg-red-50 text-red-900 border border-red-200'
                  : report.expiryAudit.status === 'NEAR_EXPIRY'
                  ? 'bg-amber-50 text-amber-900 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              }`}>
                {report.expiryAudit.advisoryText}
              </div>
            </div>
          </div>
        )}

        {/* Additives, Preservatives & Health Safety Audit Card */}
        {report.healthSafety && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{getTranslation('health_safety_title', currentLang)}</span>
              </span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                report.healthSafety.safetyVerdict === 'CLEAN'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : report.healthSafety.safetyVerdict === 'CONTAINS_ADDITIVES'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {report.healthSafety.safetyVerdict === 'CLEAN' ? 'Clean Formulation' : 'Contains Additives'}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
              {report.healthSafety.summaryText}
            </p>

            {report.healthSafety.additivesList.length > 0 ? (
              <div className="space-y-1.5 pt-1">
                {report.healthSafety.additivesList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.category === 'COLOR'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : item.category === 'PRESERVATIVE'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {item.insNumber || item.category}
                      </span>
                      <span className="font-bold text-slate-900">{item.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{item.healthAdvisory}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 font-medium">
                ✓ 100% All-Natural Ingredients: No synthetic food colors (INS 102/110/129), artificial preservatives (INS 211/202), or chemical sweeteners detected.
              </div>
            )}
          </div>
        )}

        {/* Compounding Penalty / Statutory Notice Callout */}
        {report.totalCompoundingFine > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 mb-4">
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
        {onPreviewPDF && (
          <button
            onClick={onPreviewPDF}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 px-3 rounded-xl shadow-xs transition-all cursor-pointer"
            title="Preview official PDF sheet directly in the website before downloading"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Official PDF</span>
          </button>
        )}

        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPdf}
          className="flex items-center justify-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:bg-slate-400"
          title="Download statutory inspection PDF"
        >
          <Download className="w-4 h-4" />
          <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
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

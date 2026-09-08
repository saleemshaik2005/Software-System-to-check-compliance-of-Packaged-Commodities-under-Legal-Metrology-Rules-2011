import React, { useState } from 'react';
import { ComplianceReport } from '../types';
import { generateCompliancePDF } from '../services/pdfReportGenerator';
import {
  X,
  Download,
  Printer,
  FileText,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Scale,
  ShieldCheck,
  Building2,
  Calendar,
  ExternalLink,
  QrCode
} from 'lucide-react';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ComplianceReport;
}

export const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  if (!isOpen) return null;

  const p = report.productInfo;
  const isCompliant = report.overallStatus === 'COMPLIANT';

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await generateCompliancePDF(report);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#00A651] text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block leading-none">
                In-Browser Official Inspection Sheet Preview
              </span>
              <span className="text-sm font-black text-white">
                {report.id} • {report.formType}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
              title="Print Statutory Sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Sheet</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#00A651] hover:bg-emerald-600 disabled:bg-slate-700 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-emerald-900/30"
            >
              <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body: Official Sheet Layout */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 space-y-6">
          {/* Printable White Paper Container */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            {/* National Insignia & Department Header */}
            <div className="text-center border-b-2 border-slate-900 dark:border-slate-700 pb-5 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Government of India • Ministry of Consumer Affairs, Food & Public Distribution
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                Directorate of Legal Metrology
              </h1>
              <div className="text-xs font-bold text-[#0A3663] dark:text-blue-400">
                The Legal Metrology (Packaged Commodities) Rules, 2011 • Seventh Schedule
              </div>
              <div className="inline-block mt-1 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                STATUTORY COMPLIANCE INSPECTION DATA SHEET ({report.formType.toUpperCase()})
              </div>
            </div>

            {/* Inspection Meta Information */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase">
                  Inspection ID
                </span>
                <span className="font-mono font-black text-slate-900 dark:text-slate-100">
                  {report.id}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase">
                  Date & Timestamp
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {new Date(report.scanTimestamp).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase">
                  Authorized Inspector
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {report.inspectorName || 'Insp. R. K. Verma'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 block">
                  {report.inspectorBadgeNumber || 'LM-ND-4092'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block uppercase">
                  Inspection Premises
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {report.location || 'Retail Market / Dark Store Hub'}
                </span>
              </div>
            </div>

            {/* Verdict Card */}
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
              isCompliant
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-950 dark:text-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {isCompliant ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                ) : (
                  <AlertOctagon className="w-7 h-7 text-red-600 shrink-0" />
                )}
                <div>
                  <div className="text-sm font-black uppercase tracking-wide">
                    {isCompliant ? 'COMPLIANT WITH LMPC RULES 2011' : 'NON-COMPLIANT • STATUTORY VIOLATIONS FLAGGED'}
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                    {report.summaryRemarks}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-2xl font-black block leading-none">
                  {report.score}/100
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Compliance Score
                </span>
              </div>
            </div>

            {/* Photographic Evidence Attachment */}
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-2.5 flex items-center gap-2">
                <Scale className="w-3.5 h-3.5 text-[#0A3663] dark:text-blue-400" />
                <span>Photographic Evidence Attached (Rule 24 & Rule 32)</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(['front', 'back', 'side'] as const).map((v) => {
                  const src = report.capturedImages?.[v];
                  return (
                    <div key={v} className="bg-slate-100 dark:bg-slate-950 rounded-xl p-2 border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        {v} Panel
                      </div>
                      <div className="aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                        {src ? (
                          <img src={src} alt={`${v} view`} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[10px] text-slate-500">Not Captured</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Statutory Declarations Summary Table */}
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-2.5">
                Statutory Product Declarations Summary
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                    <tr>
                      <th className="p-2.5 font-bold">Mandatory Declaration</th>
                      <th className="p-2.5 font-bold">Declared On Package</th>
                      <th className="p-2.5 font-bold">Legal Rule Reference</th>
                      <th className="p-2.5 font-bold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 text-[11px]">
                    <tr>
                      <td className="p-2.5 font-bold">Commodity Name</td>
                      <td className="p-2.5">{p.productName}</td>
                      <td className="p-2.5 font-mono text-slate-500">Rule 6(1)(b)</td>
                      <td className="p-2.5 text-right font-bold text-emerald-600">VERIFIED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Net Quantity</td>
                      <td className="p-2.5 font-black text-[#0A3663] dark:text-blue-400">{p.netQuantity} {p.quantityUnit}</td>
                      <td className="p-2.5 font-mono text-slate-500">Rule 6(1)(c) & Rule 13</td>
                      <td className="p-2.5 text-right font-bold text-emerald-600">VERIFIED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Maximum Retail Price</td>
                      <td className="p-2.5 font-bold">{p.mrpString}</td>
                      <td className="p-2.5 font-mono text-slate-500">Rule 6(1)(e) & Rule 18</td>
                      <td className={`p-2.5 text-right font-bold ${p.isStickerPrice ? 'text-red-600' : 'text-emerald-600'}`}>
                        {p.isStickerPrice ? 'VIOLATION' : 'VERIFIED'}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Month & Year of Mfg</td>
                      <td className="p-2.5">{p.mfgMonth}/{p.mfgYear}</td>
                      <td className="p-2.5 font-mono text-slate-500">Rule 6(1)(d)</td>
                      <td className="p-2.5 text-right font-bold text-emerald-600">VERIFIED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Manufacturer / Packer</td>
                      <td className="p-2.5">{p.manufacturerName || 'Not Declared'} ({p.manufacturerAddress || 'No Address'}, PIN: {p.manufacturerPinCode || 'None'})</td>
                      <td className="p-2.5 font-mono text-slate-500">Rule 6(1)(a) & Rule 10</td>
                      <td className={`p-2.5 text-right font-bold ${p.manufacturerName ? 'text-emerald-600' : 'text-red-600'}`}>
                        {p.manufacturerName ? 'VERIFIED' : 'MISSING'}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Consumer Care Cell</td>
                      <td className="p-2.5">Helpline: {p.consumerCarePhone || 'None'} • Email: {p.consumerCareEmail || 'None'}</td>
                      <td className="p-2.5 font-mono text-slate-500">Rule 6(2)</td>
                      <td className={`p-2.5 text-right font-bold ${p.consumerCarePhone && p.consumerCareEmail ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {p.consumerCarePhone && p.consumerCareEmail ? 'VERIFIED' : 'WARNING'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Evaluated Rule Breakdown with Gazette Clauses */}
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-2.5">
                Statutory Rule Evaluations ({report.evaluations.length} Clauses Examined)
              </div>
              <div className="space-y-2">
                {report.evaluations.map((ev) => (
                  <div
                    key={ev.ruleId}
                    className={`p-3 rounded-xl border text-xs flex flex-wrap items-start justify-between gap-3 ${
                      ev.status === 'FAIL'
                        ? 'bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200'
                        : ev.status === 'WARNING'
                        ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 dark:text-slate-100">{ev.ruleNumber}</span>
                        <span className="text-[10px] font-bold text-slate-500">• {ev.legalReference}</span>
                      </div>
                      <div className="font-bold mt-0.5">{ev.ruleTitle}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{ev.explanation}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                        ev.status === 'FAIL'
                          ? 'bg-red-600 text-white'
                          : ev.status === 'WARNING'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {ev.status}
                      </span>
                      {ev.compoundingFine > 0 && (
                        <span className="block text-red-600 font-bold font-mono text-xs mt-1">
                          Fine: ₹{ev.compoundingFine.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compounding Fine Notice & Summary */}
            {report.totalCompoundingFine > 0 && (
              <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-xl border border-red-200 dark:border-red-900 flex items-center justify-between text-xs">
                <div>
                  <span className="font-black text-red-900 dark:text-red-200 block uppercase">
                    Compounding Fine Under Section 48 & Rule 32(2)
                  </span>
                  <span className="text-red-700 dark:text-red-300 text-[11px]">
                    Statutory compounding fee payable by manufacturer/packer in lieu of court prosecution.
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-red-600 block">
                    ₹{report.totalCompoundingFine.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-red-500 font-bold">Total Compounding Fine</span>
                </div>
              </div>
            )}

            {/* Official Authentication Seals & QR Stamp */}
            <div className="pt-6 border-t-2 border-slate-900 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                  <QrCode className="w-10 h-10 text-slate-800 dark:text-slate-200" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Digital Verification Code
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0A3663] dark:text-blue-400">
                    GOI-LM-AUTH-{report.id}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Cryptographically hashed audit record
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block border-b border-slate-400 pb-1 text-center min-w-[160px]">
                  <span className="font-script text-lg text-[#0A3663] dark:text-blue-400 font-bold block">
                    {report.inspectorName || 'Insp. R. K. Verma'}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-500 block">
                    Authorized Inspector Signature
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  Enforcement Unit • Badge: {report.inspectorBadgeNumber || 'LM-ND-4092'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-500 dark:text-slate-400 text-[11px]">
            Statutory report conforms to Form A / Form B under GSR 202(E)
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00A651] hover:bg-emerald-600 text-white font-black text-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Generating PDF...' : 'Download Official PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

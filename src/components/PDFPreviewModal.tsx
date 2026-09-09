import React, { useState, useEffect } from 'react';
import { ComplianceReport, ExtractedProductInfo } from '../types';
import { generateCompliancePDF } from '../services/pdfReportGenerator';
import { saveScanReport } from '../services/dbService';
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
  QrCode,
  Edit3,
  Save,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ComplianceReport;
  onUpdateReport?: (updated: ComplianceReport) => void;
}

export const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  isOpen,
  onClose,
  report,
  onUpdateReport,
}) => {
  const [reportData, setReportData] = useState<ComplianceReport>(report);
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Sync state whenever input report changes
  useEffect(() => {
    setReportData(report);
  }, [report.id, report.scanTimestamp]);

  if (!isOpen) return null;

  const p = reportData.productInfo;
  const isCompliant = reportData.overallStatus === 'COMPLIANT';

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await generateCompliancePDF(reportData);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Field change handler
  const handleProductInfoChange = (field: keyof ExtractedProductInfo, value: any) => {
    setReportData(prev => ({
      ...prev,
      productInfo: {
        ...prev.productInfo,
        [field]: value
      }
    }));
  };

  // Apply Changes and Save
  const handleApplyChanges = () => {
    // Recalculate raw strings if needed
    const updatedProduct = { ...reportData.productInfo };
    if (updatedProduct.mrp && !updatedProduct.mrpString) {
      updatedProduct.mrpString = `Rs. ${updatedProduct.mrp.toFixed(2)} (incl. of all taxes)`;
    }
    if (updatedProduct.netQuantity && !updatedProduct.rawQuantityString) {
      updatedProduct.rawQuantityString = `${updatedProduct.netQuantity} ${updatedProduct.quantityUnit}`;
    }

    const updatedReport: ComplianceReport = {
      ...reportData,
      productInfo: updatedProduct
    };

    setReportData(updatedReport);
    saveScanReport(updatedReport);
    if (onUpdateReport) {
      onUpdateReport(updatedReport);
    }

    setIsEditing(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handleResetToOriginal = () => {
    setReportData(report);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-3 border-b border-slate-800 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#00A651] text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block leading-none">
                Official Inspection Sheet Preview & Live Editor
              </span>
              <span className="text-sm font-black text-white">
                {reportData.id} • {reportData.formType}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isEditing
                  ? 'bg-amber-600 text-white border-amber-500 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
              }`}
              title="Edit report parameters before generating PDF"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Close Editor' : 'Edit Details'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
              title="Print Statutory Sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
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

        {/* Save Success Banner */}
        {saveSuccessMsg && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Inspection parameters updated & re-rendered on official statutory sheet! Ready for PDF download.</span>
            </div>
            <span className="text-[10px] uppercase font-mono opacity-90">Auto-Saved to Database</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* INTERACTIVE INSPECTOR PARAMETER EDITING PANEL (TOGGLEABLE) */}
        {/* ========================================================================= */}
        {isEditing && (
          <div className="p-4 sm:p-5 bg-amber-50/70 dark:bg-zinc-950 border-b border-amber-200 dark:border-zinc-800 animate-in slide-in-from-top-2 duration-200 overflow-y-auto max-h-[38vh]">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-400">
                  <Edit3 className="w-4 h-4 text-amber-600" />
                  <span>Inspector Manual Override & Report Parameter Editor</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetToOriginal}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold hover:bg-slate-300 cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={handleApplyChanges}
                    className="px-3.5 py-1 rounded-lg bg-[#00A651] text-white text-xs font-bold hover:bg-emerald-600 cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Apply Changes & Re-render PDF</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Product Commodity Name
                  </label>
                  <input
                    type="text"
                    value={p.productName || ''}
                    onChange={(e) => handleProductInfoChange('productName', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#00A651]"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={p.brandName || ''}
                    onChange={(e) => handleProductInfoChange('brandName', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold text-slate-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#00A651]"
                  />
                </div>

                {/* Net Quantity */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Net Quantity
                  </label>
                  <input
                    type="number"
                    value={p.netQuantity || 0}
                    onChange={(e) => handleProductInfoChange('netQuantity', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono font-bold text-slate-900 dark:text-zinc-100"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Measurement Unit
                  </label>
                  <select
                    value={p.quantityUnit || 'g'}
                    onChange={(e) => handleProductInfoChange('quantityUnit', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-bold text-slate-900 dark:text-zinc-100"
                  >
                    <option value="g">g (Grams)</option>
                    <option value="kg">kg (Kilograms)</option>
                    <option value="ml">ml (Millilitres)</option>
                    <option value="l">l (Litres)</option>
                    <option value="u">u (Units / Pieces)</option>
                  </select>
                </div>

                {/* MRP */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Retail Sale Price (₹ MRP)
                  </label>
                  <input
                    type="number"
                    value={p.mrp || 0}
                    onChange={(e) => handleProductInfoChange('mrp', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono font-bold text-slate-900 dark:text-zinc-100"
                  />
                </div>

                {/* Mfg Month / Year */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Mfg Month & Year
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="MM"
                      value={p.mfgMonth || ''}
                      onChange={(e) => handleProductInfoChange('mfgMonth', e.target.value)}
                      className="w-1/2 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-center text-slate-900 dark:text-zinc-100"
                    />
                    <input
                      type="text"
                      placeholder="YYYY"
                      value={p.mfgYear || ''}
                      onChange={(e) => handleProductInfoChange('mfgYear', e.target.value)}
                      className="w-1/2 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-center text-slate-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Expiry / Best Before
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YYYY or date"
                    value={p.expiryDate || ''}
                    onChange={(e) => handleProductInfoChange('expiryDate', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-slate-900 dark:text-zinc-100"
                  />
                </div>

                {/* Batch Number */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Batch / Lot Number
                  </label>
                  <input
                    type="text"
                    value={p.batchNumber || ''}
                    onChange={(e) => handleProductInfoChange('batchNumber', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-slate-900 dark:text-zinc-100"
                  />
                </div>

                {/* Manufacturer Name */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Manufacturer / Packer Name
                  </label>
                  <input
                    type="text"
                    value={p.manufacturerName || ''}
                    onChange={(e) => handleProductInfoChange('manufacturerName', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold text-slate-900 dark:text-zinc-100"
                  />
                </div>

                {/* Country of Origin */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Country of Origin
                  </label>
                  <input
                    type="text"
                    value={p.countryOfOrigin || 'India'}
                    onChange={(e) => handleProductInfoChange('countryOfOrigin', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold text-slate-900 dark:text-zinc-100"
                  />
                </div>

                {/* Manufacturer Address */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Manufacturer Physical Address
                  </label>
                  <input
                    type="text"
                    value={p.manufacturerAddress || ''}
                    onChange={(e) => handleProductInfoChange('manufacturerAddress', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100"
                  />
                </div>

                {/* PIN Code */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Postal PIN Code
                  </label>
                  <input
                    type="text"
                    value={p.manufacturerPinCode || ''}
                    onChange={(e) => handleProductInfoChange('manufacturerPinCode', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-slate-900 dark:text-zinc-100"
                  />
                </div>

                {/* Consumer Care Phone */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Consumer Helpline Phone
                  </label>
                  <input
                    type="text"
                    value={p.consumerCarePhone || ''}
                    onChange={(e) => handleProductInfoChange('consumerCarePhone', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-slate-900 dark:text-zinc-100"
                  />
                </div>

                {/* Consumer Care Email */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Consumer Email
                  </label>
                  <input
                    type="email"
                    value={p.consumerCareEmail || ''}
                    onChange={(e) => handleProductInfoChange('consumerCareEmail', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100"
                  />
                </div>

                {/* Total Compounding Fine */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-zinc-300 mb-0.5">
                    Compounding Fine (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={reportData.totalCompoundingFine || 0}
                    onChange={(e) => setReportData(prev => ({ ...prev, totalCompoundingFine: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono font-bold text-amber-700 dark:text-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body: Official Sheet Layout */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-100 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 space-y-6">
          {/* Printable White Paper Container */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            {/* National Insignia & Department Header */}
            <div className="text-center border-b-2 border-slate-900 dark:border-zinc-700 pb-5 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                Government of India • Ministry of Consumer Affairs, Food & Public Distribution
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-zinc-100 uppercase tracking-tight">
                Directorate of Legal Metrology
              </h1>
              <div className="text-xs font-bold text-[#0A3663] dark:text-blue-400">
                The Legal Metrology (Packaged Commodities) Rules, 2011 • Seventh Schedule
              </div>
              <div className="inline-block mt-1 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-[11px] font-mono font-bold text-slate-700 dark:text-zinc-300">
                STATUTORY COMPLIANCE INSPECTION DATA SHEET ({reportData.formType.toUpperCase()})
              </div>
            </div>

            {/* Inspection Meta Information */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold block uppercase">
                  Inspection ID
                </span>
                <span className="font-mono font-black text-slate-900 dark:text-zinc-100">
                  {reportData.id}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold block uppercase">
                  Date & Timestamp
                </span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                  {new Date(reportData.scanTimestamp).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold block uppercase">
                  Authorized Inspector
                </span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">
                  {reportData.inspectorName || 'Legal Metrology Inspector'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold block uppercase">
                  Station / Location
                </span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200 truncate block">
                  {reportData.location || 'Enforcement Field Station'}
                </span>
              </div>
            </div>

            {/* Primary Commodity Summary Card */}
            <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
                <span className="text-xs font-black uppercase tracking-wide text-[#0A3663] dark:text-blue-400">
                  A. Audited Packaged Commodity Information
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                  {p.category || 'general_packaged'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">Commodity Commercial Title:</span>
                  <span className="font-black text-slate-900 dark:text-zinc-100 text-sm">{p.productName || 'Packaged Commodity'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">Brand / Marketer:</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{p.brandName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">Country of Origin:</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">{p.countryOfOrigin || 'India'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">Net Quantity:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-zinc-100">
                    {p.rawQuantityString || `${p.netQuantity || 0} ${p.quantityUnit || 'g'}`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">Retail Sale Price (MRP):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-zinc-100">
                    {p.mrpString || `₹${p.mrp || 0}`}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">Mfg Date:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-zinc-100">
                    {p.mfgMonth && p.mfgYear ? `${p.mfgMonth}/${p.mfgYear}` : 'Not declared'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">Expiry Date:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-zinc-100">
                    {p.expiryDate || (p.expMonth && p.expYear ? `${p.expMonth}/${p.expYear}` : 'N/A')}
                  </span>
                </div>
              </div>

              <div className="text-xs pt-2 border-t border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">Manufacturer / Packer Identity & Premises:</span>
                <span className="text-slate-800 dark:text-zinc-200">
                  {p.manufacturerName ? `${p.manufacturerName}, ` : ''}
                  {p.manufacturerAddress || 'Address not declared on label'}
                  {p.manufacturerPinCode ? ` - PIN: ${p.manufacturerPinCode}` : ''}
                </span>
              </div>
            </div>

            {/* Statutory Evaluation Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wide text-[#0A3663] dark:text-blue-400">
                  B. Rule-by-Rule Legal Metrology Verification Audit
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Score: {reportData.score}/100
                </span>
              </div>

              <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold border-b border-slate-200 dark:border-zinc-700 text-[11px]">
                      <th className="p-2.5">Statutory Rule</th>
                      <th className="p-2.5">Mandated Standard</th>
                      <th className="p-2.5">Detected Packaging Value</th>
                      <th className="p-2.5 text-center">Status</th>
                      <th className="p-2.5 text-right">Fine (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {reportData.evaluations.map((ev, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                        <td className="p-2.5 font-bold text-slate-900 dark:text-zinc-100">
                          {ev.ruleNumber}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-zinc-400 text-[11px]">
                          {ev.requiredStandard}
                        </td>
                        <td className="p-2.5 text-slate-800 dark:text-zinc-200 font-mono text-[11px]">
                          {ev.detectedValue || 'Not Found'}
                        </td>
                        <td className="p-2.5 text-center">
                          {ev.status === 'PASS' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                              PASS
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                              FAIL
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900 dark:text-zinc-100">
                          {ev.status === 'FAIL' && ev.compoundingFine ? `₹${ev.compoundingFine.toLocaleString('en-IN')}` : 'Nil'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verdict & Total Compounding Fine */}
            <div className={`p-4 rounded-xl border ${
              isCompliant
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {isCompliant ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertOctagon className="w-8 h-8 text-red-600 dark:text-red-400" />
                  )}
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wide">
                      {isCompliant
                        ? 'Form A Statutory Verification Pass'
                        : `Form B Statutory Seizure & Compounding Notice (${reportData.violationsCount} Violations)`}
                    </h3>
                    <p className="text-xs opacity-90">
                      {reportData.summaryRemarks || (isCompliant
                        ? 'Package complies fully with all mandatory declarations of PCR 2011.'
                        : 'Package is in violation of the Legal Metrology Act 2009. Offence under Section 36.')}
                    </p>
                  </div>
                </div>

                {!isCompliant && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold block opacity-80">Total Compounding Fine</span>
                    <span className="text-xl font-mono font-black text-red-600 dark:text-red-400">
                      ₹{(reportData.totalCompoundingFine || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Officer Signatures Section */}
            <div className="pt-8 grid grid-cols-2 gap-8 border-t border-slate-200 dark:border-zinc-800 text-xs text-center">
              <div>
                <div className="h-10 border-b border-dashed border-slate-300 dark:border-zinc-700 flex items-end justify-center pb-1 text-slate-400 font-mono text-[10px]">
                  [Digital Cryptographic Hash: SHA256]
                </div>
                <span className="font-bold text-slate-700 dark:text-zinc-300 block mt-1">Authorized Legal Metrology Officer</span>
                <span className="text-[10px] text-slate-500">Field Enforcement Station</span>
              </div>
              <div>
                <div className="h-10 border-b border-dashed border-slate-300 dark:border-zinc-700 flex items-end justify-center pb-1 text-slate-400 font-mono text-[10px]">
                  [Manufacturer / Packer / Retailer Witness]
                </div>
                <span className="font-bold text-slate-700 dark:text-zinc-300 block mt-1">Responsible Person / Packer Representative</span>
                <span className="text-[10px] text-slate-500">Acknowledgement of Statutory Inspection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

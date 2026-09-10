import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Upload,
  Camera,
  Layers,
  FileCheck,
  Scale,
  Hash,
  IndianRupee,
  ShieldCheck,
  Tag,
  Info
} from 'lucide-react';
import { ExtractedProductInfo, ComplianceReport } from '../types';
import { evaluateCompliance } from '../services/complianceEngine';
import { saveScanReport } from '../services/dbService';
import { STANDARD_PACK_RULES } from '../data/standardPackSizes';

interface ManufacturerSelfAuditProps {
  onLoadAudit: (report: ComplianceReport) => void;
}

export const ManufacturerSelfAudit: React.FC<ManufacturerSelfAuditProps> = ({ onLoadAudit }) => {
  const [activeMode, setActiveMode] = useState<'simulator' | 'upload'>('simulator');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState<ExtractedProductInfo>({
    productName: 'Pintola All Natural Peanut Butter (Crunchy)',
    genericName: 'Peanut Butter & Roasted Peanuts',
    brandName: 'Pintola',
    category: 'general_fmcg',
    netQuantity: 350,
    quantityUnit: 'g',
    rawQuantityString: '350 g',
    mrp: 180.0,
    currency: 'INR',
    mrpString: 'MRP: Rs. 180.00 (Incl. of all taxes)',
    hasInclAllTaxes: true,
    isStickerPrice: false,
    isDualPrice: false,
    mfgMonth: '08',
    mfgYear: '2026',
    manufacturerName: 'Das Superfoods Private Limited',
    manufacturerAddress: 'G. No. 381-382, Sonasan, Ta. Prantij, Sabarkantha, Gujarat',
    manufacturerPinCode: '383210',
    countryOfOrigin: 'India',
    consumerCarePhone: '78080 58080',
    consumerCareEmail: 'care@pintola.in',
    measuredNumeralHeightMm: 3.5,
    pdpAreaCm2: 260
  });

  const [activeReport, setActiveReport] = useState<ComplianceReport>(() =>
    evaluateCompliance(formData, 'front', {
      front: '/demo/pintola-front.png',
      back: '/demo/pintola-back.png',
      side: '/demo/pintola-side.png'
    }, {
      name: 'Brand Manufacturer QA Division',
      badge: 'QA-PRE-CHECK',
      location: 'Pre-Market Artwork Validation Station'
    })
  );

  const [isSavedToCloud, setIsSavedToCloud] = useState(false);

  // Recalculate compliance on form change
  const handleChange = (field: keyof ExtractedProductInfo, value: any) => {
    setIsSavedToCloud(false);
    const updated = { ...formData, [field]: value };
    if (field === 'netQuantity' || field === 'quantityUnit') {
      updated.rawQuantityString = `${updated.netQuantity} ${updated.quantityUnit}`;
    }
    if (field === 'mrp' || field === 'hasInclAllTaxes') {
      updated.mrpString = `Rs. ${Number(updated.mrp || 0).toFixed(2)} ${updated.hasInclAllTaxes ? '(incl. of all taxes)' : ''}`;
    }
    setFormData(updated);

    const rep = evaluateCompliance(updated, 'front', {
      front: uploadedImage || '/demo/pintola-front.png',
      back: '/demo/pintola-back.png',
      side: '/demo/pintola-side.png'
    }, {
      name: 'Brand Manufacturer QA Division',
      badge: 'QA-PRE-CHECK',
      location: 'Pre-Market Artwork Validation Station'
    });
    setActiveReport(rep);
  };

  // Find standard pack sizes for chosen category
  const selectedScheduleRule = STANDARD_PACK_RULES.find(r => r.category === formData.category);

  // Calculate Rule 7 Table I mandated numeral height
  const getRequiredNumeralHeight = () => {
    let q = formData.netQuantity;
    const u = (formData.quantityUnit || '').toLowerCase();
    if (u === 'kg' || u === 'l' || u === 'litre') q *= 1000;
    if (q > 500) return 4.0;
    if (q > 200) return 2.0;
    return 1.0;
  };

  const minRequiredHeight = getRequiredNumeralHeight();
  const isFontHeightCompliant = (formData.measuredNumeralHeightMm || 0) >= minRequiredHeight;

  // Handle artwork image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setUploadedImage(dataUrl);
      const rep = evaluateCompliance(formData, 'front', {
        front: dataUrl,
        back: '/demo/pintola-back.png',
        side: '/demo/pintola-side.png'
      }, {
        name: 'Brand Manufacturer QA Division',
        badge: 'QA-PRE-CHECK',
        location: 'Pre-Market Artwork Validation Station'
      });
      setActiveReport(rep);
    };
    reader.readAsDataURL(file);
  };

  // Save audit to database and view certificate
  const handleSaveAndCertify = () => {
    saveScanReport(activeReport);
    setIsSavedToCloud(true);
    onLoadAudit(activeReport);
  };

  const isPass = activeReport.overallStatus === 'COMPLIANT';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Regulatory Context */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>Brand Packaging Pre-Printing & QA Compliance Simulator</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Pre-Market Packaging Artwork & Die-Line Verification Lab
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Verify commodity specifications before ordering cylinder engraving or commercial batch printing runs. Automatically check <strong>The Second Schedule (Rule 5)</strong> standard pack sizes, <strong>Rule 7 Table I</strong> font heights, and <strong>Rule 6/10/18</strong> mandatory declarations to prevent market seizures and recall losses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMode('simulator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'simulator'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Die-Line Spec Configurator</span>
            </button>
            <button
              onClick={() => setActiveMode('upload')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'upload'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Artwork Proof</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs (Left) and Live Digital Proof (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Specifications Form & Second Schedule Rules */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-5 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-600" />
              <span>Statutory Packaging Declarations (Rule 6, 7 & 10)</span>
            </h3>
            <span className="text-[11px] font-mono text-[#00A651] font-bold">
              Real-time LMPC Rules 2011 Engine
            </span>
          </div>

          {/* Mode Upload: File Selector */}
          {activeMode === 'upload' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Upload Packaging Label Artwork Proof (PDF / PNG / JPG)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Select your print-ready die-line or artwork export to inspect statutory placements
                </p>
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleImageUpload}
                className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-600 file:text-white hover:file:bg-amber-500 cursor-pointer"
              />
              {uploadedImage && (
                <div className="text-[11px] font-bold text-emerald-600">
                  ✓ Artwork Proof Loaded Successfully
                </div>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Commodity Category */}
            <div>
              <label className="block text-zinc-700 mb-1 font-bold">
                Commodity Category (Second Schedule)
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
              >
                <option value="general_fmcg">General FMCG (Any Standard SI Size)</option>
                <option value="baby_food">Baby Food (Item #1)</option>
                <option value="weaning_food">Weaning Food (Item #2)</option>
                <option value="biscuits">Biscuits (Item #3)</option>
                <option value="bread">Bread & Brown Bread (Item #4)</option>
                <option value="butter_margarine">Butter & Margarine (Item #5)</option>
                <option value="cereals_pulses">Cereals & Pulses (Item #6)</option>
                <option value="coffee">Coffee (Item #7)</option>
                <option value="tea">Tea (Item #8)</option>
                <option value="edible_oils">Edible Oils / Vanaspati / Ghee (Item #10)</option>
                <option value="milk_powder">Milk Powder (Item #11)</option>
                <option value="rice_flour_atta_suji">Atta / Rice / Rawa / Suji (Item #13)</option>
                <option value="toilet_soap">Toilet Soaps (Item #15)</option>
                <option value="aerated_soft_drinks">Soft Drinks / Beverages (Item #16)</option>
              </select>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-zinc-700 mb-1 font-bold">
                Product Commercial Name (Rule 6(1)(b))
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Net Quantity & Unit */}
            <div>
              <label className="block text-zinc-700 mb-1 font-bold">
                Net Quantity & Unit (Rule 6(1)(c) & 13)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.netQuantity}
                  onChange={(e) => handleChange('netQuantity', parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none font-bold"
                />
                <select
                  value={formData.quantityUnit}
                  onChange={(e) => handleChange('quantityUnit', e.target.value)}
                  className="bg-zinc-50 border border-zinc-300 text-zinc-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none font-bold"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">L</option>
                  <option value="m">m</option>
                  <option value="N">N</option>
                  <option value="gm">gm (Illegal Non-SI)</option>
                  <option value="dozen">dozen (Prohibited)</option>
                </select>
              </div>
            </div>

            {/* MRP */}
            <div>
              <label className="block text-zinc-700 mb-1 font-bold">
                Maximum Retail Price (₹) (Rule 6(1)(e))
              </label>
              <input
                type="number"
                value={formData.mrp}
                onChange={(e) => handleChange('mrp', parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none font-bold"
              />
            </div>

            {/* Second Schedule Permissible Sizes Pill Showcase */}
            {selectedScheduleRule && selectedScheduleRule.allowedSizes?.exactValues && selectedScheduleRule.allowedSizes.exactValues.length > 0 && (
              <div className="sm:col-span-2 bg-amber-50/60 p-3 rounded-2xl border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-black text-amber-800">
                    The Second Schedule (Item #{selectedScheduleRule.scheduleItemNo}): Permissible Sizes for {selectedScheduleRule.name}
                  </span>
                  <span className="text-zinc-500 font-mono">
                    Unit: {selectedScheduleRule.allowedSizes.unit}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedScheduleRule.allowedSizes.exactValues.map((size) => {
                    const isCurrent = formData.netQuantity === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleChange('netQuantity', size)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white text-zinc-700 border border-zinc-200 hover:border-amber-400'
                        }`}
                      >
                        {size}{selectedScheduleRule.allowedSizes.unit}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tax clause & Sticker price checkboxes */}
            <div className="sm:col-span-2 flex flex-wrap items-center gap-4 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-zinc-800">
                <input
                  type="checkbox"
                  checked={formData.hasInclAllTaxes}
                  onChange={(e) => handleChange('hasInclAllTaxes', e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Include "incl. of all taxes" clause (Rule 18)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-red-600">
                <input
                  type="checkbox"
                  checked={formData.isStickerPrice}
                  onChange={(e) => handleChange('isStickerPrice', e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span>Simulate Price Sticker (Rule 18(5) Violation)</span>
              </label>
            </div>

            {/* Manufacturer Name */}
            <div className="sm:col-span-2">
              <label className="block text-zinc-700 mb-1 font-bold">
                Manufacturer / Packer Legal Name (Rule 6(1)(a))
              </label>
              <input
                type="text"
                value={formData.manufacturerName}
                onChange={(e) => handleChange('manufacturerName', e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Factory Address */}
            <div>
              <label className="block text-zinc-700 mb-1 font-bold">
                Factory / Premises Address (Rule 10)
              </label>
              <input
                type="text"
                value={formData.manufacturerAddress}
                onChange={(e) => handleChange('manufacturerAddress', e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* PIN Code */}
            <div>
              <label className="block text-zinc-700 mb-1 font-bold">
                Postal PIN Code (Rule 10(1) Explanation)
              </label>
              <input
                type="text"
                maxLength={6}
                value={formData.manufacturerPinCode}
                onChange={(e) => handleChange('manufacturerPinCode', e.target.value)}
                placeholder="6-digit PIN code"
                className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>

            {/* Customer Care Phone */}
            <div>
              <label className="block text-zinc-700 mb-1 font-bold">
                Consumer Care Helpline Phone (Rule 6(2))
              </label>
              <input
                type="text"
                value={formData.consumerCarePhone}
                onChange={(e) => handleChange('consumerCarePhone', e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Customer Care Email */}
            <div>
              <label className="block text-zinc-700 mb-1 font-bold">
                Consumer Care Email (Rule 6(2))
              </label>
              <input
                type="email"
                value={formData.consumerCareEmail}
                onChange={(e) => handleChange('consumerCareEmail', e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>

            {/* Numeral Height Verification (Rule 7 Table I) */}
            <div className="sm:col-span-2 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-800">
                  Rule 7 Table I Numeral Height Verification
                </span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isFontHeightCompliant
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {isFontHeightCompliant ? 'Compliant Height' : `Height Violation (< ${minRequiredHeight}mm)`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] text-zinc-500 mb-1 font-semibold">
                    Intended Cylinder / Plate Print Height (mm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.measuredNumeralHeightMm}
                    onChange={(e) => handleChange('measuredNumeralHeightMm', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-zinc-300 text-zinc-900 p-2 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-zinc-400 block uppercase font-bold">Mandated Minimum</span>
                  <span className="text-sm font-mono font-black text-amber-600">
                    {minRequiredHeight} mm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Simulated Die-Line Carton & Pre-Market Certificate */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-3xl shadow-xs flex flex-col justify-between space-y-4 transition-colors">
          <div>
            {/* Header Status */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">
                Pre-Printing Artwork Verdict
              </h3>
              <span
                className={`text-xs font-black px-3 py-1 rounded-full uppercase ${
                  isPass
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {activeReport.overallStatus} ({activeReport.score}%)
              </span>
            </div>

            {/* Digital Die-Line Carton / Pouch Label Mockup */}
            <div className="my-4 bg-amber-50/60 text-slate-900 p-4 rounded-2xl border-2 border-dashed border-amber-300 font-sans space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div>
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-widest block">
                    Die-Line Proof Simulation
                  </span>
                  <h4 className="font-black text-sm uppercase tracking-wide text-slate-900">
                    {formData.productName || 'PRODUCT NAME'}
                  </h4>
                </div>
                <span className="text-[9px] bg-emerald-700 text-white px-2 py-0.5 rounded font-bold uppercase">
                  {formData.countryOfOrigin || 'India'}
                </span>
              </div>

              {/* PDP Highlight Region */}
              <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-xl border border-amber-200 text-[11px] shadow-2xs">
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Declared Net Mass / Vol</span>
                  <span className="font-black text-slate-900 text-xs font-mono">
                    {formData.netQuantity} {formData.quantityUnit}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Statutory MRP (Incl. Taxes)</span>
                  <span className="font-black text-emerald-700 text-xs font-mono">
                    Rs. {Number(formData.mrp || 0).toFixed(2)}
                  </span>
                  <span className="text-[9px] text-slate-500 block">
                    {formData.hasInclAllTaxes ? '(incl. of all taxes)' : '(NO TAX CLAUSE)'}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-700 leading-relaxed space-y-1">
                <div>
                  <strong className="text-slate-500">Mfg / Packer:</strong> {formData.manufacturerName}, {formData.manufacturerAddress}
                  {formData.manufacturerPinCode ? ` - PIN: ${formData.manufacturerPinCode}` : ' [NO PIN CODE]'}
                </div>
                <div>
                  <strong className="text-slate-500">Mfg Month/Year:</strong> {formData.mfgMonth}/{formData.mfgYear}
                </div>
                <div>
                  <strong className="text-slate-500">Consumer Care:</strong> Tel: {formData.consumerCarePhone || 'N/A'} | Email: {formData.consumerCareEmail || 'N/A'}
                </div>
              </div>
            </div>

            {/* Active Violations and Warnings list */}
            <div className="space-y-2 text-xs">
              {activeReport.evaluations
                .filter((e) => e.status !== 'PASS')
                .map((err, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-[11px] font-semibold space-y-0.5"
                  >
                    <div className="flex items-center gap-1.5 font-black text-red-700">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>{err.ruleNumber}: {err.ruleTitle}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-normal">
                      {err.explanation}
                    </p>
                  </div>
                ))}

              {activeReport.evaluations.filter((e) => e.status !== 'PASS').length === 0 && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Artwork conforms to all LMPC Rules 2011! Approved for print run.</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons: Save & View Certificate */}
          <div className="pt-3 border-t border-zinc-200 space-y-2">
            <button
              onClick={handleSaveAndCertify}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Issue Pre-Printing Compliance Certificate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {isSavedToCloud && (
              <p className="text-center text-[10px] text-emerald-600 font-bold">
                ✓ Synced to Google Cloud Firestore & Available Across All Devices
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

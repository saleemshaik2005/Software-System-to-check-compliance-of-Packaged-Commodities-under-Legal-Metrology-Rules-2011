import React, { useState } from 'react';
import { Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { ExtractedProductInfo, ComplianceReport } from '../types';
import { evaluateCompliance } from '../services/complianceEngine';

interface ManufacturerSelfAuditProps {
  onLoadAudit: (report: ComplianceReport) => void;
}

export const ManufacturerSelfAudit: React.FC<ManufacturerSelfAuditProps> = ({ onLoadAudit }) => {
  const [formData, setFormData] = useState<ExtractedProductInfo>({
    productName: 'Himalayan Pure Organic Honey',
    genericName: 'Pure Natural Honey',
    brandName: 'Himalayan Organics',
    category: 'general_fmcg',
    netQuantity: 500,
    quantityUnit: 'g',
    rawQuantityString: '500 g',
    mrp: 320.0,
    currency: 'INR',
    mrpString: 'Rs. 320.00 (incl. of all taxes)',
    hasInclAllTaxes: true,
    isStickerPrice: false,
    isDualPrice: false,
    mfgMonth: '09',
    mfgYear: '2024',
    manufacturerName: 'Himalayan Agro Naturals Pvt Ltd',
    manufacturerAddress: 'Plot 44, Industrial Area, Solan, Himachal Pradesh',
    manufacturerPinCode: '173212',
    countryOfOrigin: 'India',
    consumerCarePhone: '1800 120 4400',
    consumerCareEmail: 'support@himalayanagro.in',
    measuredNumeralHeightMm: 4.2,
    pdpAreaCm2: 320
  });

  const [activeReport, setActiveReport] = useState<ComplianceReport>(() =>
    evaluateCompliance(formData, 'front')
  );

  const handleChange = (field: keyof ExtractedProductInfo, value: any) => {
    const updated = { ...formData, [field]: value };
    if (field === 'netQuantity' || field === 'quantityUnit') {
      updated.rawQuantityString = `${updated.netQuantity} ${updated.quantityUnit}`;
    }
    if (field === 'mrp' || field === 'hasInclAllTaxes') {
      updated.mrpString = `Rs. ${updated.mrp.toFixed(2)} ${updated.hasInclAllTaxes ? '(incl. of all taxes)' : ''}`;
    }
    setFormData(updated);
    setActiveReport(evaluateCompliance(updated, 'front'));
  };

  const handleTestNow = () => {
    onLoadAudit(activeReport);
  };

  const isPass = activeReport.overallStatus === 'COMPLIANT';

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>FMCG Brand & Packer Pre-Printing Simulator</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Manufacturer Pre-Pack Packaging Label Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Test your artwork and packaging declarations before ordering batch printing or packaging runs. Avoid costly product recalls, stock seizures under Rule 20, and compounding fines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 mb-2 flex items-center justify-between">
            <span>Packaging Specifications</span>
            <span className="text-xs text-slate-500 font-semibold">Real-time Rule Checking</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-bold">Commodity Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
              >
                <option value="general_fmcg">General FMCG</option>
                <option value="biscuits">Biscuits (Item #3)</option>
                <option value="edible_oils">Edible Oils / Ghee (Item #10)</option>
                <option value="rice_flour_atta_suji">Atta / Rice / Rawa (Item #13)</option>
                <option value="tea">Tea (Item #8)</option>
                <option value="coffee">Coffee (Item #7)</option>
                <option value="toilet_soap">Toilet Soaps (Item #15)</option>
                <option value="aerated_soft_drinks">Soft Drinks / Beverages (Item #16)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">Product Name</label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">Net Quantity</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.netQuantity}
                  onChange={(e) => handleChange('netQuantity', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
                />
                <select
                  value={formData.quantityUnit}
                  onChange={(e) => handleChange('quantityUnit', e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">L</option>
                  <option value="m">m</option>
                  <option value="N">N</option>
                  <option value="gm">gm (Non-SI Illegal)</option>
                  <option value="dozen">dozen (Prohibited)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">Maximum Retail Price (₹)</label>
              <input
                type="number"
                value={formData.mrp}
                onChange={(e) => handleChange('mrp', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.hasInclAllTaxes}
                  onChange={(e) => handleChange('hasInclAllTaxes', e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Include "incl. of all taxes" clause</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.isStickerPrice}
                  onChange={(e) => handleChange('isStickerPrice', e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span>Apply price change via Sticker (Rule 18 violation)</span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 mb-1 font-bold">Manufacturer Name</label>
              <input
                type="text"
                value={formData.manufacturerName}
                onChange={(e) => handleChange('manufacturerName', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">Factory Address</label>
              <input
                type="text"
                value={formData.manufacturerAddress}
                onChange={(e) => handleChange('manufacturerAddress', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">Postal PIN Code (Rule 10)</label>
              <input
                type="text"
                maxLength={6}
                value={formData.manufacturerPinCode}
                onChange={(e) => handleChange('manufacturerPinCode', e.target.value)}
                placeholder="e.g. 110001"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">Customer Care Phone</label>
              <input
                type="text"
                value={formData.consumerCarePhone}
                onChange={(e) => handleChange('consumerCarePhone', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">Customer Care Email</label>
              <input
                type="email"
                value={formData.consumerCareEmail}
                onChange={(e) => handleChange('consumerCareEmail', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-bold">Printed Numeral Height (mm)</label>
              <input
                type="number"
                step="0.1"
                value={formData.measuredNumeralHeightMm}
                onChange={(e) => handleChange('measuredNumeralHeightMm', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Live Simulation Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-3">
              <h3 className="text-sm font-black text-slate-900">
                Pre-Audit Certification Verdict
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

            <div className="bg-amber-50/70 text-slate-950 p-4 rounded-xl shadow-xs border border-amber-200 font-sans space-y-2 select-none mb-4">
              <div className="border-b border-amber-300 pb-1 flex justify-between items-start">
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wide text-slate-900">
                    {formData.productName || 'PRODUCT NAME'}
                  </h4>
                  <p className="text-[10px] text-slate-600 uppercase font-bold">
                    {formData.genericName}
                  </p>
                </div>
                <span className="text-[9px] bg-[#00A651] text-white px-1.5 py-0.5 rounded font-bold">
                  {formData.countryOfOrigin || 'India'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] py-1 border-b border-amber-300">
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Net Quantity</span>
                  <span className="font-black text-slate-900 text-xs">
                    {formData.netQuantity} {formData.quantityUnit}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Max Retail Price</span>
                  <span className="font-black text-slate-900 text-xs">
                    Rs. {formData.mrp.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-slate-600 block">
                    {formData.hasInclAllTaxes ? '(incl. of all taxes)' : ''}
                  </span>
                </div>
              </div>

              <div className="text-[9px] text-slate-700 leading-tight space-y-1">
                <div>
                  <strong>Mfd by:</strong> {formData.manufacturerName}, {formData.manufacturerAddress}
                  {formData.manufacturerPinCode ? ` - ${formData.manufacturerPinCode}` : ''}
                </div>
                <div>
                  <strong>Pkd Date:</strong> {formData.mfgMonth}/{formData.mfgYear}
                </div>
                <div>
                  <strong>Consumer Care:</strong> Tel: {formData.consumerCarePhone || 'N/A'} | Email: {formData.consumerCareEmail || 'N/A'}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {activeReport.evaluations
                .filter((e) => e.status !== 'PASS')
                .map((err, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-900 text-[11px] font-semibold"
                  >
                    <strong>{err.ruleNumber}:</strong> {err.ruleTitle}
                  </div>
                ))}

              {activeReport.evaluations.filter((e) => e.status !== 'PASS').length === 0 && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Packaging specifications conform to all Legal Metrology Rules, 2011!</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <button
              onClick={handleTestNow}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Pre-Compliance Audit Sheet & Certificate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

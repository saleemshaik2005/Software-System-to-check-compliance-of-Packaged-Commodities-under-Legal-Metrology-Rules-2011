import React, { useState } from 'react';
import { Globe, Search, AlertOctagon, CheckCircle2, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';
import { ComplianceReport } from '../types';
import { evaluateCompliance } from '../services/complianceEngine';

interface EcommerceAuditTabProps {
  onAuditSelected: (report: ComplianceReport) => void;
}

export const EcommerceAuditTab: React.FC<EcommerceAuditTabProps> = ({ onAuditSelected }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);

  const ecomSamples = [
    {
      title: 'Amazon India: Imported Dark Chocolate 100g',
      platform: 'Amazon.in',
      issue: 'Missing Indian Importer Name & FSSAI/LMPC registration on listing specifications',
      status: 'VIOLATION',
      productInfo: {
        productName: 'Lindt Excellence 85% Cocoa Dark Chocolate 100g',
        genericName: 'Dark Chocolate Bar',
        brandName: 'Lindt',
        category: 'general_packaged' as any,
        netQuantity: 100,
        quantityUnit: 'g',
        rawQuantityString: '100g',
        mrp: 350.0,
        currency: 'INR',
        mrpString: 'Rs. 350.00 (incl. of all taxes)',
        hasInclAllTaxes: true,
        isStickerPrice: false,
        isDualPrice: false,
        mfgMonth: '03',
        mfgYear: '2024',
        manufacturerName: 'Lindt & Sprüngli AG',
        manufacturerAddress: 'Kilchberg, Zurich, Switzerland',
        manufacturerPinCode: '',
        countryOfOrigin: 'Switzerland',
        importerName: '', // Missing Indian importer!
        importerAddress: '',
        consumerCarePhone: '',
        consumerCareEmail: '',
        batchNumber: 'LND-883'
      }
    },
    {
      title: 'Blinkit Instant Grocery: Aashirvaad Shudh Chakki Atta (5 kg)',
      platform: 'Blinkit',
      issue: 'Full statutory compliance - Standard pack size item #13 and clear manufacturer declaration',
      status: 'COMPLIANT',
      productInfo: {
        productName: 'Aashirvaad Shudh Chakki Whole Wheat Atta 5kg',
        genericName: 'Whole Wheat Atta',
        brandName: 'Aashirvaad',
        category: 'rice_flour_atta_suji' as any,
        netQuantity: 5,
        quantityUnit: 'kg',
        rawQuantityString: '5 kg',
        mrp: 265.0,
        currency: 'INR',
        mrpString: 'Rs. 265.00 (incl. of all taxes)',
        hasInclAllTaxes: true,
        isStickerPrice: false,
        isDualPrice: false,
        mfgMonth: '08',
        mfgYear: '2024',
        manufacturerName: 'ITC Limited',
        manufacturerAddress: '37, J.L. Nehru Road, Kolkata, West Bengal',
        manufacturerPinCode: '700071',
        countryOfOrigin: 'India',
        consumerCarePhone: '1800 345 0088',
        consumerCareEmail: 'itccares@itc.in',
        batchNumber: 'ITC-ATT-992'
      }
    },
    {
      title: 'Flipkart Quick: Multi-Grain Digestive Biscuits (175g)',
      platform: 'Flipkart',
      issue: 'Non-standard pack size under Second Schedule Item #3 (Prescribes 150g or 200g, 175g is illegal without disclaimer)',
      status: 'VIOLATION',
      productInfo: {
        productName: 'Sunfeast Farmlite Digestive High Fiber Biscuits (175g)',
        genericName: 'Digestive Biscuits',
        brandName: 'Sunfeast',
        category: 'biscuits' as any,
        netQuantity: 175,
        quantityUnit: 'g',
        rawQuantityString: '175 g',
        mrp: 45.0,
        currency: 'INR',
        mrpString: 'Rs. 45.00',
        hasInclAllTaxes: false, // missing taxes!
        isStickerPrice: false,
        isDualPrice: false,
        mfgMonth: '06',
        mfgYear: '2024',
        manufacturerName: 'ITC Limited',
        manufacturerAddress: '37, J.L. Nehru Road, Kolkata',
        manufacturerPinCode: '700071',
        countryOfOrigin: 'India',
        consumerCarePhone: '1800 345 0088',
        consumerCareEmail: 'itccares@itc.in',
        batchNumber: 'SF-175G',
        hasStandardPackDisclaimer: false
      }
    }
  ];

  const handleAuditSample = (sample: typeof ecomSamples[0]) => {
    setIsAuditing(true);
    setTimeout(() => {
      const report = evaluateCompliance(
        sample.productInfo,
        'front',
        {},
        {
          name: 'Insp. R. K. Verma',
          badge: 'LM-ECOM-01',
          location: `Digital Marketplace Audit: ${sample.platform}`
        }
      );
      setIsAuditing(false);
      onAuditSelected(report);
    }, 600);
  };

  const handleCustomAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    // Simulate automated URL scraping & compliance check
    handleAuditSample(ecomSamples[0]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-bold mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>Digital Marketplace Enforcement • E-Commerce Rules 2017 Amendment</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Automated E-Commerce Product Listing Auditor
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            Under the Legal Metrology (Packaged Commodities) Amendment Rules 2017, all e-commerce platforms (Amazon, Flipkart, Blinkit, Zepto, Swiggy Instamart) must display mandatory declarations: Manufacturer, Country of Origin, Net Qty, and MRP on the digital product display page.
          </p>
        </div>

        {/* URL Input Form */}
        <form onSubmit={handleCustomAudit} className="mt-5 flex flex-wrap sm:flex-nowrap gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste product URL (e.g., https://www.amazon.in/dp/B08X42YZ or Blinkit link)..."
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isAuditing}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <span>{isAuditing ? 'Auditing Listing...' : 'Audit E-Commerce Listing'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Preset E-Commerce Listings to Test */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h3 className="text-sm font-bold text-white mb-1">
          Live Tested Marketplace Listings
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Click any product listing below to run immediate compliance verification
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ecomSamples.map((sample, idx) => {
            const isViolation = sample.status === 'VIOLATION';
            return (
              <div
                key={idx}
                onClick={() => handleAuditSample(sample)}
                className="bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-xl cursor-pointer transition-all hover:bg-slate-800/40 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {sample.platform}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 ${
                        isViolation
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {isViolation ? <AlertOctagon className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      <span>{sample.status}</span>
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors mb-1.5 line-clamp-2">
                    {sample.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {sample.issue}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-indigo-400 font-semibold">
                  <span>Inspect Audit Score →</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

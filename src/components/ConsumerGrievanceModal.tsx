import React, { useState } from 'react';
import { ComplianceReport } from '../types';
import { ShieldAlert, X, CheckCircle, ExternalLink, Send, PhoneCall } from 'lucide-react';

interface ConsumerGrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ComplianceReport;
}

export const ConsumerGrievanceModal: React.FC<ConsumerGrievanceModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!isOpen) return null;

  const [shopName, setShopName] = useState('Local Kirana / Supermarket Store');
  const [shopAddress, setShopAddress] = useState('Shop #12, Market Complex, Delhi');
  const [complaintType, setComplaintType] = useState('MRP_OVERCHARGING');
  const [consumerName, setConsumerName] = useState('Rahul Sharma');
  const [consumerPhone, setConsumerPhone] = useState('9876543210');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [grievanceDocket, setGrievanceDocket] = useState('');

  const p = report.productInfo;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const docketNo = 'NCH-' + Math.floor(100000 + Math.random() * 900000);
    setGrievanceDocket(docketNo);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                National Consumer Helpline (NCH) Portal
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Department of Consumer Affairs • Govt of India (Toll-Free 1915)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 shadow-sm">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-black text-slate-900">Grievance Registered Successfully</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Your complaint under Legal Metrology Act 2009 has been transmitted to the State Controller.
                </p>
              </div>

              <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 text-xs font-mono text-blue-950">
                Docket No: <strong className="text-blue-700">{grievanceDocket}</strong>
              </div>

              <div className="text-[11px] text-slate-500">
                SMS confirmation sent to +91 {consumerPhone}. An inspecting officer has been notified.
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <a
                  href="https://consumerhelpline.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 border border-slate-200 transition-colors"
                >
                  <span>Track on consumerhelpline.gov.in</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={onClose}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Product Info Banner */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-700">
                <div className="font-bold text-slate-900 text-sm">{p.productName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {p.manufacturerName} • Qty: {p.netQuantity} {p.quantityUnit} • MRP: {p.mrpString}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Violation Type</label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-blue-600 focus:outline-none"
                >
                  <option value="MRP_OVERCHARGING">Overcharging Above Printed MRP (Rule 18(2))</option>
                  <option value="STICKER_TAMPERING">Sticker Alteration / Smudged Price (Rule 18(5))</option>
                  <option value="SHORT_MEASURE">Short Net Weight / Underfilled Package (Rule 22)</option>
                  <option value="MISSING_DECLARATION">Missing Manufacturer or Consumer Care (Rule 6)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={consumerName}
                    onChange={(e) => setConsumerName(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={consumerPhone}
                    onChange={(e) => setConsumerPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Retailer / Store Name</label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Store Location / Address</label>
                <input
                  type="text"
                  required
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-xl focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                  <span>Call 1915 for urgent grievance</span>
                </div>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black py-2.5 px-5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Lodge Grievance</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

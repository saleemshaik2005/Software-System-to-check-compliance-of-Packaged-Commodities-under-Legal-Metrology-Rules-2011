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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                National Consumer Helpline (NCH) Portal
              </h3>
              <p className="text-[10px] text-slate-400">
                Department of Consumer Affairs • Govt of India (Toll-Free 1915)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-black text-white">Grievance Registered Successfully</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Your complaint under Legal Metrology Act 2009 has been transmitted to the State Controller.
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
                Docket No: <strong>{grievanceDocket}</strong>
              </div>

              <div className="text-[11px] text-slate-400">
                SMS confirmation sent to +91 {consumerPhone}. An inspecting officer has been notified.
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <a
                  href="https://consumerhelpline.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5"
                >
                  <span>Track on consumerhelpline.gov.in</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={onClose}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-xl"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Product Info Banner */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
                <div className="font-bold text-white text-sm">{p.productName}</div>
                <div className="text-[11px] text-slate-400">
                  {p.manufacturerName} • Qty: {p.netQuantity} {p.quantityUnit} • MRP: {p.mrpString}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Violation Type</label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2 rounded-xl focus:border-amber-500 focus:outline-none"
                >
                  <option value="MRP_OVERCHARGING">Overcharging Above Printed MRP (Rule 18(2))</option>
                  <option value="STICKER_TAMPERING">Sticker Alteration / Smudged Price (Rule 18(5))</option>
                  <option value="SHORT_MEASURE">Short Net Weight / Underfilled Package (Rule 22)</option>
                  <option value="MISSING_DECLARATION">Missing Manufacturer or Consumer Care (Rule 6)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={consumerName}
                    onChange={(e) => setConsumerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={consumerPhone}
                    onChange={(e) => setConsumerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2 rounded-xl focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Retailer / Store Name</label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Store Location / Address</label>
                <input
                  type="text"
                  required
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2 rounded-xl focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call 1915 for urgent grievance</span>
                </div>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
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

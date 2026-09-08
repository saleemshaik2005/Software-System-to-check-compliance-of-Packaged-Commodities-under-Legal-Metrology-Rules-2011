import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 py-8 px-4 text-xs mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-black tracking-tight text-[#0A3663]">
              in<span className="text-[#00A651]">spack</span>
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
              SIH-26034
            </span>
          </div>
          <p className="text-slate-500 leading-relaxed text-[11px]">
            AI-Powered Legal Metrology Packaged Commodities (LMPC) Rules, 2011 Compliance Verification System. Developed for Ministry of Consumer Affairs, Food and Public Distribution.
          </p>
        </div>

        <div className="text-left md:text-center">
          <div className="text-[#0B192C] font-black uppercase tracking-wider text-xs">
            Team Neural Knights
          </div>
          <div className="text-[11px] text-[#088395] font-bold mt-0.5">
            Ideas • Intelligence • Impact — Tech for a Fairer Market
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Smart India Hackathon 2026 • Theme: Agriculture, FoodTech & Rural Development
          </div>
        </div>

        <div className="text-left md:text-right text-[10px] text-slate-500 space-y-1">
          <div>Conforms to Legal Metrology Act, 2009 (Act No. 1 of 2010)</div>
          <div>Gazette Notification GSR 202(E) & GSR 748(E)</div>
          <div className="text-slate-600 font-semibold">100% Free Open-Source Architecture</div>
        </div>
      </div>
    </footer>
  );
};

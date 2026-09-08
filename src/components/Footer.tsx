import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 py-8 px-4 text-xs mt-12 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-between">
        {/* Brand & Mission */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl font-black tracking-tight text-[#0A3663] dark:text-white">
              in<span className="text-[#00A651]">spack</span>
            </span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold">
              SIH-26034
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
            AI-Powered Legal Metrology Packaged Commodities (LMPC) Rules, 2011 Compliance Verification System. Developed for Ministry of Consumer Affairs, Food and Public Distribution.
          </p>
        </div>

        {/* Team & Social Connections */}
        <div className="text-left md:text-center space-y-2">
          <div className="text-slate-900 dark:text-slate-100 font-black uppercase tracking-wider text-xs flex items-center justify-start md:justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00A651]" />
            <span>Team Neural Knights</span>
          </div>
          <div className="text-[11px] text-[#0A3663] dark:text-blue-400 font-bold">
            Ideas • Intelligence • Impact — Tech for a Fairer Market
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Smart India Hackathon 2026 • Theme: Agriculture, FoodTech & Rural Development
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-start md:justify-center gap-3 pt-1">
            <a
              href="https://github.com/saleemshaik2005/Software-System-to-check-compliance-of-Packaged-Commodities-under-Legal-Metrology-Rules-2011"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span>GitHub Repo</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>

            <a
              href="https://www.linkedin.com/in/saleemshaik2005"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] dark:text-blue-400 font-bold text-xs transition-colors border border-[#0077B5]/30 cursor-pointer shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              <span>LinkedIn Profile</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          </div>
        </div>

        {/* Regulatory & Open Source */}
        <div className="text-left md:text-right text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
          <div>Conforms to Legal Metrology Act, 2009 (Act No. 1 of 2010)</div>
          <div>Gazette Notification GSR 202(E) & GSR 748(E)</div>
          <div className="text-slate-700 dark:text-slate-300 font-semibold">100% Free Open-Source Architecture</div>
        </div>
      </div>
    </footer>
  );
};

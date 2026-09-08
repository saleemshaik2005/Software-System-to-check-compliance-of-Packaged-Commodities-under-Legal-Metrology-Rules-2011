import React from 'react';
import { Shield, Sparkles, Smartphone, CheckCircle, Scale, Building2, ShoppingBag, BarChart3, Globe } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: 'scanner' | 'analytics' | 'ecommerce' | 'manufacturer';
  setCurrentTab: (tab: 'scanner' | 'analytics' | 'ecommerce' | 'manufacturer') => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-xl border-b border-slate-800">
      {/* Top Govt of India & SIH Bar */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-amber-400">SMART INDIA HACKATHON 2026</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-mono font-medium">PS ID: SIH-26034</span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">Ministry of Consumer Affairs, Food & Public Distribution</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>LMPC Rules 2011 Active</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-cyan-400 font-mono">Team: Neural Knights</div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Team Logos */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('scanner')}>
          <div className="relative flex items-center bg-white p-1 rounded-lg shadow-sm border border-slate-200">
            <img
              src="/logos/inspack-logo.jpg"
              alt="Inspack Logo"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                // Fallback text if image loading
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="hidden sm:flex flex-col ml-1">
              <span className="text-xl font-black tracking-tight text-blue-900 leading-none">
                in<span className="text-emerald-600">spack</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">
                Inspect Packages • Ensure Compliance
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-700 hidden md:block"></div>

          {/* Team Neural Knights Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-cyan-900/50">
            <img
              src="/logos/neural-knights-logo.jpg"
              alt="Neural Knights"
              className="h-7 w-7 rounded-full object-cover border border-cyan-400"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="text-left">
              <div className="text-xs font-bold tracking-wide text-cyan-300 leading-none">NEURAL KNIGHTS</div>
              <div className="text-[9px] text-slate-400 leading-tight">Tech for a Fairer Market</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setCurrentTab('scanner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              currentTab === 'scanner'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Package Inspector</span>
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              currentTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Officer Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('ecommerce')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              currentTab === 'ecommerce'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>E-Commerce Audit</span>
          </button>

          <button
            onClick={() => setCurrentTab('manufacturer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              currentTab === 'manufacturer'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Brand Pre-Check</span>
          </button>
        </nav>

        {/* Role Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-1 hidden sm:inline">Role:</span>
          <button
            onClick={() => setUserRole('OFFICER')}
            className={`px-2 py-1 rounded font-semibold transition-all ${
              userRole === 'OFFICER' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Inspector
          </button>
          <button
            onClick={() => setUserRole('CITIZEN')}
            className={`px-2 py-1 rounded font-semibold transition-all ${
              userRole === 'CITIZEN' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Consumer
          </button>
          <button
            onClick={() => setUserRole('MANUFACTURER')}
            className={`px-2 py-1 rounded font-semibold transition-all ${
              userRole === 'MANUFACTURER' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Brand
          </button>
        </div>
      </div>
    </header>
  );
};

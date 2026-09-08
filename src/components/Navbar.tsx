import React from 'react';
import { Scale, CheckCircle, Building2, BarChart3, Globe, Sun, Moon } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: 'scanner' | 'analytics' | 'ecommerce' | 'manufacturer';
  setCurrentTab: (tab: 'scanner' | 'analytics' | 'ecommerce' | 'manufacturer') => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  isDarkMode,
  setIsDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Govt of India & SIH Banner */}
      <div className="bg-[#0A2540] text-white px-4 py-1.5 text-xs border-b border-blue-950 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-amber-300">SMART INDIA HACKATHON 2026</span>
          <span className="text-blue-300">•</span>
          <span className="text-white font-mono font-bold">PS ID: SIH-26034</span>
          <span className="hidden sm:inline text-blue-300">•</span>
          <span className="hidden sm:inline text-slate-200">Ministry of Consumer Affairs, Food & Public Distribution</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-emerald-300 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>LMPC Rules 2011 Active</span>
          </div>
          <span className="text-blue-400">|</span>
          <div className="text-cyan-300 font-mono font-bold">Team: Neural Knights</div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Team Logos */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('scanner')}>
          <div className="flex items-center gap-2">
            <img
              src="/logos/inspack-logo.jpg"
              alt="Inspack Logo"
              className="h-11 w-auto object-contain rounded-md"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#0A3663] leading-none">
                in<span className="text-[#00A651]">spack</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-600 font-extrabold mt-0.5">
                Inspect Packages • Ensure Compliance
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

          {/* Team Neural Knights Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 shadow-sm">
            <img
              src="/logos/neural-knights-logo.jpg"
              alt="Neural Knights"
              className="h-8 w-8 rounded-full object-cover border border-cyan-500 shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="text-left">
              <div className="text-xs font-black tracking-wide text-[#0B192C] leading-none">NEURAL KNIGHTS</div>
              <div className="text-[9px] text-[#088395] font-bold leading-tight">Tech for a Fairer Market</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setCurrentTab('scanner')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              currentTab === 'scanner'
                ? 'bg-[#00A651] text-white shadow-md shadow-emerald-700/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Package Inspector</span>
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              currentTab === 'analytics'
                ? 'bg-[#0A3663] text-white shadow-md shadow-blue-950/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Officer Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('ecommerce')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              currentTab === 'ecommerce'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-700/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>E-Commerce Audit</span>
          </button>

          <button
            onClick={() => setCurrentTab('manufacturer')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              currentTab === 'manufacturer'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-700/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Brand Pre-Check</span>
          </button>
        </nav>

        {/* Role Toggle & Theme Switch */}
        <div className="flex items-center gap-2">
          {/* Role Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setUserRole('OFFICER')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                userRole === 'OFFICER' ? 'bg-white text-[#0A3663] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inspector
            </button>
            <button
              onClick={() => setUserRole('CITIZEN')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                userRole === 'CITIZEN' ? 'bg-white text-[#00A651] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Consumer
            </button>
            <button
              onClick={() => setUserRole('MANUFACTURER')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                userRole === 'MANUFACTURER' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Brand
            </button>
          </div>

          {/* Theme Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};

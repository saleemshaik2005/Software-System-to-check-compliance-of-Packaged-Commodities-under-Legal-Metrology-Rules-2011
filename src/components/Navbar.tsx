import React from 'react';
import {
  Scale,
  CheckCircle,
  Building2,
  BarChart3,
  Globe,
  Sun,
  Moon,
  Cloud,
  Menu,
  KeyRound,
  Shield,
  ShoppingBag,
  Sliders,
  Settings
} from 'lucide-react';
import { UserRole, AuthUser } from '../types';
import { getAdminConfig } from '../services/adminService';

interface NavbarProps {
  currentTab: 'scanner' | 'analytics' | 'ecommerce' | 'manufacturer' | 'admin';
  setCurrentTab: (tab: 'scanner' | 'analytics' | 'ecommerce' | 'manufacturer' | 'admin') => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: AuthUser;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenCloudModal?: () => void;
  onOpenRulebook?: () => void;
  onOpenLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  currentUser,
  isDarkMode,
  setIsDarkMode,
  onOpenCloudModal,
  onOpenRulebook,
  onOpenLogin,
}) => {
  const adminConfig = getAdminConfig();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Govt of India & SIH Banner */}
      <div className="bg-[#0A2540] text-white px-4 py-1.5 text-xs border-b border-blue-950 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-amber-300">SMART INDIA HACKATHON 2026</span>
          <span className="text-blue-300">•</span>
          <span className="text-white font-mono font-bold">PS ID: SIH-26034</span>
          <span className="hidden md:inline text-blue-300">•</span>
          <span className="hidden md:inline text-slate-200">
            {adminConfig.specialDriveBanner || 'Ministry of Consumer Affairs, Food & Public Distribution'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-emerald-300 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>LMPC Rules 2011</span>
          </div>
          <span className="text-blue-400">|</span>
          <div className="text-cyan-300 font-mono font-bold">Team: Neural Knights</div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left Section: 3-Bars Hamburger Button + Brand Logo */}
        <div className="flex items-center gap-3">
          {/* Top Left 3-Bars Hamburger Button */}
          <button
            onClick={onOpenRulebook}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer border border-slate-200 shadow-2xs flex items-center justify-center"
            title="Open Legal Metrology Act & Rulebook (3 Bars)"
          >
            <Menu className="w-5 h-5 text-[#0A3663]" />
          </button>

          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setCurrentTab('scanner')}
          >
            <img
              src="/logos/inspack-logo.jpg"
              alt="Inspack Logo"
              className="h-10 w-auto object-contain rounded-md"
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
        </div>

        {/* Navigation Tabs - Dynamically adapted to active user role */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-1">
          {/* 1. Package Inspector (All Roles) */}
          <button
            onClick={() => setCurrentTab('scanner')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              currentTab === 'scanner'
                ? 'bg-[#00A651] text-white shadow-md shadow-emerald-700/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{userRole === 'CITIZEN' ? 'Consumer Check' : 'Package Inspector'}</span>
          </button>

          {/* 2. Officer Dashboard (Officer & Admin) */}
          {(userRole === 'OFFICER' || userRole === 'ADMIN') && (
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
          )}

          {/* 3. E-Commerce Audit */}
          <button
            onClick={() => setCurrentTab('ecommerce')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
              currentTab === 'ecommerce'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-700/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{userRole === 'CITIZEN' ? 'Dark Store Deals' : 'E-Commerce Audit'}</span>
          </button>

          {/* 4. Brand Pre-Check Simulator (Brand, Officer, Admin) */}
          {(userRole === 'MANUFACTURER' || userRole === 'OFFICER' || userRole === 'ADMIN') && (
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
          )}

          {/* 5. Administrator Control Center (Admin Only) */}
          {userRole === 'ADMIN' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-900/20'
                  : 'text-purple-900 bg-purple-50 hover:bg-purple-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin Center</span>
            </button>
          )}
        </nav>

        {/* Right Section: Cloud DB, User Profile Chip, Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Cloud Database Status */}
          {onOpenCloudModal && (
            <button
              onClick={onOpenCloudModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              title="Cloud Database (Firestore) & Image CDN (Cloudinary) - Connected"
            >
              <Cloud className="w-3.5 h-3.5 text-[#0A3663]" />
              <span className="hidden lg:inline text-[11px]">Cloud DB</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
          )}

          {/* User Account Login / Switch Chip */}
          {onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title={`Logged in as ${currentUser.name} (${userRole}). Click to switch.`}
            >
              <div className="w-6 h-6 rounded-full bg-[#0A3663] text-white flex items-center justify-center text-xs font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-black text-slate-900 leading-none truncate max-w-[100px]">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-bold text-[#00A651] uppercase mt-0.5">
                  {userRole}
                </span>
              </div>
            </button>
          )}

          {/* Theme Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import {
  Scale,
  CheckCircle,
  Building2,
  BarChart3,
  Globe,
  Sun,
  Moon,
  Menu,
  KeyRound,
  Shield,
  ShoppingBag,
  Sliders,
  Settings,
  BookOpen,
  Archive,
  PhoneCall,
  LogOut,
  Camera,
  Upload,
  Radio,
  X
} from 'lucide-react';
import { UserRole, AuthUser, ActiveTab } from '../types';
import { getAdminConfig } from '../services/adminService';

interface NavbarProps {
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: AuthUser | null;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenRulebook?: () => void;
  onOpenVault?: () => void;
  onOpenGrievance?: () => void;
  onOpenLogin?: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  currentUser,
  isDarkMode,
  setIsDarkMode,
  onOpenRulebook,
  onOpenVault,
  onOpenGrievance,
  onOpenLogin,
  onSignOut,
}) => {
  const adminConfig = getAdminConfig();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getRoleSubtitle = () => {
    switch (userRole) {
      case 'MANUFACTURER':
        return 'Brand Packaging Pre-Compliance Portal';
      case 'CITIZEN':
        return 'Consumer Protection • Fair Pack & Pricing';
      case 'OFFICER':
        return 'Legal Metrology Enforcement Field Station';
      case 'SURVEILLANCE':
        return 'National Legal Metrology Directorate';
      case 'ADMIN':
        return 'Platform Administration Console';
      default:
        return 'Inspect Packages • Ensure Compliance';
    }
  };

  const handleLogoClick = () => {
    switch (userRole) {
      case 'MANUFACTURER':
        setCurrentTab('manufacturer');
        break;
      case 'SURVEILLANCE':
        setCurrentTab('surveillance');
        break;
      case 'ADMIN':
        setCurrentTab('admin');
        break;
      default:
        setCurrentTab('scanner');
        break;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
      {/* Sleek Top Govt of India & SIH Strip */}
      <div className="bg-[#0A2540] dark:bg-slate-950 text-white px-4 py-1 text-[11px] border-b border-blue-950 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-amber-300">SMART INDIA HACKATHON 2026</span>
          <span className="text-blue-300">•</span>
          <span className="font-mono font-bold text-white">PS ID: SIH-26034</span>
          <span className="hidden md:inline text-blue-300">•</span>
          <span className="hidden md:inline text-slate-300">
            {adminConfig.specialDriveBanner || 'Ministry of Consumer Affairs, Food & Public Distribution'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-emerald-300 font-semibold">
            <CheckCircle className="w-3 h-3" />
            <span>LMPC Rules 2011</span>
          </div>
          <span className="text-blue-400">|</span>
          <div className="text-cyan-300 font-mono font-bold">Team: Neural Knights</div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left Section: 3-Bars Hamburger Dropdown + Brand Logo */}
        <div className="flex items-center gap-2.5">
          {/* Top Left 3-Bars Hamburger Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center"
              title="Quick Menu"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4 text-[#0A3663] dark:text-blue-400" />
              ) : (
                <Menu className="w-4 h-4 text-[#0A3663] dark:text-blue-400" />
              )}
            </button>

            {/* Role-tailored Dropdown Menu */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Current User Header */}
                  {currentUser ? (
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/70 dark:bg-slate-950/50">
                      <div className="w-8 h-8 rounded-full bg-[#0A3663] text-white flex items-center justify-center font-bold text-xs">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[10px] font-bold text-[#00A651] uppercase">
                          {userRole} • Active Session
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Signed Out (Guest Mode)
                      </div>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenLogin?.();
                        }}
                        className="text-[11px] font-bold text-[#00A651] hover:underline cursor-pointer mt-0.5 block"
                      >
                        Sign in with test account →
                      </button>
                    </div>
                  )}

                  {/* Menu Items strictly filtered by Role */}
                  <div className="py-1">
                    {/* Manufacturer Menu Options */}
                    {userRole === 'MANUFACTURER' && (
                      <>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setCurrentTab('manufacturer');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <div>Artwork Pre-Check Simulator</div>
                            <div className="text-[10px] font-normal text-slate-400">Validate packaging prior to printing</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            onOpenRulebook?.();
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4 text-[#0A3663] dark:text-blue-400 shrink-0" />
                          <div>
                            <div>Packaging Rules & Font Height Table</div>
                            <div className="text-[10px] font-normal text-slate-400">Rule 6, 7 Table I, Rule 10, Rule 18</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            onOpenVault?.();
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <Archive className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <div>Pre-Compliance Archive</div>
                            <div className="text-[10px] font-normal text-slate-400">Saved artwork audit certificates</div>
                          </div>
                        </button>
                      </>
                    )}

                    {/* Citizen Menu Options */}
                    {userRole === 'CITIZEN' && (
                      <>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setCurrentTab('upload');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <Camera className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <div>Check Any Package</div>
                            <div className="text-[10px] font-normal text-slate-400">Snap photos of front/back</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setCurrentTab('ecommerce');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
                          <div>
                            <div>Dark Store Price Checker</div>
                            <div className="text-[10px] font-normal text-slate-400">Blinkit, Zepto, Instamart deals</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            onOpenGrievance?.();
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <PhoneCall className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <div>National Consumer Helpline (1915)</div>
                            <div className="text-[10px] font-normal text-slate-400">Direct 1-tap grievance filing</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            onOpenRulebook?.();
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4 text-[#0A3663] dark:text-blue-400 shrink-0" />
                          <div>
                            <div>Consumer Rights Guide</div>
                            <div className="text-[10px] font-normal text-slate-400">Know your packaging protections</div>
                          </div>
                        </button>
                      </>
                    )}

                    {/* Officer Menu Options */}
                    {userRole === 'OFFICER' && (
                      <>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setCurrentTab('upload');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <Camera className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <div>Field Scan Studio</div>
                            <div className="text-[10px] font-normal text-slate-400">Multi-panel physical inspection</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setCurrentTab('analytics');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <BarChart3 className="w-4 h-4 text-[#0A3663] dark:text-blue-400 shrink-0" />
                          <div>
                            <div>Enforcement Dashboard & Notices</div>
                            <div className="text-[10px] font-normal text-slate-400">Fifth Schedule sampling & Sec 36 notices</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            onOpenRulebook?.();
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4 text-[#0A3663] dark:text-blue-400 shrink-0" />
                          <div>
                            <div>Legal Metrology Gazette Rulebook</div>
                            <div className="text-[10px] font-normal text-slate-400">Rules 5-32 & Fifth Schedule tables</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            onOpenVault?.();
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <Archive className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <div>Inspection Dossier Vault</div>
                            <div className="text-[10px] font-normal text-slate-400">Saved Form A/B reports & evidence</div>
                          </div>
                        </button>
                      </>
                    )}

                    {/* Surveillance (Ministry Directorate) Options */}
                    {userRole === 'SURVEILLANCE' && (
                      <>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setCurrentTab('surveillance');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <Radio className="w-4 h-4 text-cyan-500 shrink-0" />
                          <div>
                            <div>National Surveillance Hub</div>
                            <div className="text-[10px] font-normal text-slate-400">State rankings, seizures & repeat offenders</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setCurrentTab('analytics');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <Archive className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <div>Macro Seizure Dossier</div>
                            <div className="text-[10px] font-normal text-slate-400">Nationwide inspection audit logs</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setCurrentTab('ecommerce');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
                          <div>
                            <div>Quick Commerce Compliance</div>
                            <div className="text-[10px] font-normal text-slate-400">Dark store platform rankings</div>
                          </div>
                        </button>
                      </>
                    )}

                    {/* Platform Admin Options */}
                    {userRole === 'ADMIN' && (
                      <>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setCurrentTab('admin');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-purple-600 shrink-0" />
                          <div>
                            <div>Platform Control Center</div>
                            <div className="text-[10px] font-normal text-slate-400">Tune fines, thresholds & announcements</div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setCurrentTab('analytics');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-3 transition-colors cursor-pointer"
                        >
                          <BarChart3 className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                            <div>All Scans & JSON Export</div>
                            <div className="text-[10px] font-normal text-slate-400">Full audit repository & database dump</div>
                          </div>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Sign Out / Sign In Action */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                    {currentUser ? (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onSignOut();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500 shrink-0" />
                        <div>
                          <div>Sign Out</div>
                          <div className="text-[10px] font-normal text-red-400">Return to role login selector</div>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenLogin?.();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-[#00A651] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4 text-[#00A651] shrink-0" />
                        <div>
                          <div>Sign In to Inspack</div>
                          <div className="text-[10px] font-normal text-slate-400">Choose role profile</div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Logo & Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={handleLogoClick}
          >
            <img
              src="/logos/inspack-logo.jpg"
              alt="Inspack Logo"
              className="h-9 w-auto object-contain rounded-md"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#0A3663] dark:text-white leading-none">
                in<span className="text-[#00A651]">spack</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-extrabold mt-0.5">
                {getRoleSubtitle()}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Strictly Role-Specific */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1">
          {/* 1. MANUFACTURER: ONLY Brand Artwork Pre-Check & Pre-Compliance Sheet */}
          {userRole === 'MANUFACTURER' && (
            <>
              <button
                onClick={() => setCurrentTab('manufacturer')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'manufacturer'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Artwork Pre-Check Simulator</span>
              </button>

              <button
                onClick={() => setCurrentTab('scanner')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'scanner'
                    ? 'bg-[#00A651] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Pre-Compliance Audit Sheet</span>
              </button>
            </>
          )}

          {/* 2. CITIZEN: Scan/Snap Package, Fair Pack Report, Dark Store Deals */}
          {userRole === 'CITIZEN' && (
            <>
              <button
                onClick={() => setCurrentTab('upload')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'upload'
                    ? 'bg-[#00A651] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan / Snap Package</span>
              </button>

              <button
                onClick={() => setCurrentTab('scanner')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'scanner'
                    ? 'bg-[#0A3663] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Fair Pack & MRP Report</span>
              </button>

              <button
                onClick={() => setCurrentTab('ecommerce')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'ecommerce'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Dark Store Deals Audit</span>
              </button>
            </>
          )}

          {/* 3. LEGAL METROLOGY INSPECTOR (OFFICER): Field Scan, Inspection Report, Officer Hub, E-Comm Audit */}
          {userRole === 'OFFICER' && (
            <>
              <button
                onClick={() => setCurrentTab('upload')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'upload'
                    ? 'bg-[#0A3663] dark:bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Field Scan Studio</span>
              </button>

              <button
                onClick={() => setCurrentTab('scanner')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'scanner'
                    ? 'bg-[#00A651] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Official Inspection Report</span>
              </button>

              <button
                onClick={() => setCurrentTab('analytics')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'analytics'
                    ? 'bg-[#0A3663] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Officer Enforcement Hub</span>
              </button>

              <button
                onClick={() => setCurrentTab('ecommerce')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'ecommerce'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>E-Commerce Audit</span>
              </button>
            </>
          )}

          {/* 4. NATIONAL SURVEILLANCE DIRECTORATE: Surveillance Hub, Central Archive, Quick Commerce */}
          {userRole === 'SURVEILLANCE' && (
            <>
              <button
                onClick={() => setCurrentTab('surveillance')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'surveillance'
                    ? 'bg-[#0A3663] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>National Surveillance Hub</span>
              </button>

              <button
                onClick={() => setCurrentTab('analytics')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'analytics'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Central Dossier</span>
              </button>

              <button
                onClick={() => setCurrentTab('ecommerce')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'ecommerce'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Platform Surveillance</span>
              </button>
            </>
          )}

          {/* 5. PLATFORM ADMINISTRATOR (SOFTWARE/TECH ADMIN) */}
          {userRole === 'ADMIN' && (
            <>
              <button
                onClick={() => setCurrentTab('admin')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Platform Control Center</span>
              </button>

              <button
                onClick={() => setCurrentTab('analytics')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'analytics'
                    ? 'bg-[#0A3663] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>All Scans & Audit Logs</span>
              </button>

              <button
                onClick={() => setCurrentTab('upload')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'upload'
                    ? 'bg-[#00A651] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan Studio</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Section: User Profile Chip / Sign-In & Theme Toggle */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title={`Logged in as ${currentUser.name} (${userRole}). Click to switch or sign out.`}
            >
              <div className="w-6 h-6 rounded-full bg-[#0A3663] text-white flex items-center justify-center text-xs font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 leading-none truncate max-w-[100px]">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-bold text-[#00A651] uppercase mt-0.5">
                  {userRole}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00A651] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Theme Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};

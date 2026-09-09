import React, { useState } from 'react';
import { AuthUser, UserRole, Language } from '../types';
import { getTranslation, SUPPORTED_LANGUAGES, setStoredLanguage } from '../services/i18nService';
import { TEST_ACCOUNTS, loginWithEmail } from '../services/authService';
import {
  Scale,
  ShieldCheck,
  ShoppingBag,
  Building2,
  Radio,
  Sliders,
  Lock,
  ArrowRight,
  Sun,
  Moon,
  Globe,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  isDarkMode,
  setIsDarkMode,
  currentLang = 'en',
  onLanguageChange,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('OFFICER');
  const [nameInput, setNameInput] = useState('Legal Metrology Inspector');
  const [emailInput, setEmailInput] = useState('inspector@lm.gov.in');
  const [passwordInput, setPasswordInput] = useState('••••••••');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    const template = TEST_ACCOUNTS[role];
    setNameInput(template.name);
    setEmailInput(template.email);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const user = loginWithEmail(emailInput.trim(), selectedRole);
    if (nameInput.trim()) {
      user.name = nameInput.trim();
    }
    onLoginSuccess(user);
  };

  const handle1ClickRoom = (role: UserRole) => {
    const user = TEST_ACCOUNTS[role];
    onLoginSuccess(user);
  };

  const testRooms = [
    {
      role: 'OFFICER' as UserRole,
      title: 'Legal Metrology Inspector',
      badge: 'Enforcement Field Station',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      desc: 'Conduct statutory packaging inspections, calculate Fourth/Fifth Schedule MPE sampling, and issue Form B seizure & compounding notices under LM Act 2009.',
      targetPage: 'Inspector Dashboard'
    },
    {
      role: 'CITIZEN' as UserRole,
      title: 'Consumer / Citizen',
      badge: 'Public Verification',
      badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      icon: ShoppingBag,
      iconColor: 'text-blue-600 dark:text-blue-400',
      desc: 'Instant camera photo upload, verify printed MRP & net weight against statutory regulations, and file 1-click consumer grievances directly to NCH 1915.',
      targetPage: 'Package Scanner & Check Studio'
    },
    {
      role: 'MANUFACTURER' as UserRole,
      title: 'Brand Manufacturer',
      badge: 'Pre-Printing QA Simulator',
      badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      icon: Building2,
      iconColor: 'text-amber-600 dark:text-amber-400',
      desc: 'Pre-market packaging artwork compliance simulator. Validate mandatory declarations, font heights (Table I), and Second Schedule standard pack sizes.',
      targetPage: 'Artwork Pre-Check Simulator'
    },
    {
      role: 'SURVEILLANCE' as UserRole,
      title: 'National Surveillance Director',
      badge: 'Ministry Directorate',
      badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      icon: Radio,
      iconColor: 'text-purple-600 dark:text-purple-400',
      desc: 'Pan-India compliance intelligence, dark store sweeps (Blinkit, Zepto, Swiggy Instamart), regional violation heatmaps, and high-risk brand profiling.',
      targetPage: 'National Surveillance Hub'
    },
    {
      role: 'ADMIN' as UserRole,
      title: 'System Administrator',
      badge: 'Platform Engineering',
      badgeColor: 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700',
      icon: Sliders,
      iconColor: 'text-zinc-700 dark:text-zinc-300',
      desc: 'Central configuration console: edit PCR 2011 rule parameters, manage multi-cloud synchronization (Firestore/Cloudinary), and inspect audit trail logs.',
      targetPage: 'Platform Control Center'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Top Govt of India Strip */}
      <div className="bg-[#18181b] dark:bg-black text-white px-4 py-1.5 text-xs border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-amber-300">SMART INDIA HACKATHON 2026</span>
          <span className="text-zinc-500">•</span>
          <span className="font-mono text-zinc-300">PS ID: SIH-26034</span>
          <span className="hidden sm:inline text-zinc-500">•</span>
          <span className="hidden sm:inline text-zinc-400">
            Ministry of Consumer Affairs, Food & Public Distribution
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Legal Metrology (Packaged Commodities) Rules, 2011</span>
          </div>
          <span className="text-zinc-700">|</span>
          <span className="text-cyan-400 font-mono font-bold text-[11px]">Team Neural Knights</span>
        </div>
      </div>

      {/* Main Header / Branding */}
      <header className="max-w-6xl w-full mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logos/inspack-logo.jpg"
            alt="Inspack Logo"
            className="h-11 w-auto object-contain rounded-xl shadow-xs border border-zinc-200 dark:border-zinc-800"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                in<span className="text-[#00A651]">spack</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#00A651]/15 text-[#00A651] border border-[#00A651]/30">
                Official Portal
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Packaged Commodities Compliance Verification System (PCR 2011)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector Pill */}
          <div className="flex items-center rounded-xl bg-white dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800 text-xs font-bold shadow-xs">
            <Globe className="w-3.5 h-3.5 text-cyan-500 ml-1.5 mr-1" />
            {SUPPORTED_LANGUAGES.map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => {
                  setStoredLanguage(opt.code);
                  onLanguageChange?.(opt.code);
                }}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer text-[11px] ${
                  currentLang === opt.code
                    ? 'bg-[#00A651] text-white shadow-xs font-black'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {opt.nativeLabel}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Matte Black Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>
        </div>
      </header>

      {/* Center Body: Login Card & Test Rooms */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 space-y-10 flex-1 flex flex-col justify-center">
        {/* Sign In Card */}
        <div className="max-w-xl w-full mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00A651] mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Portal Sign In
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Select your regulatory jurisdiction or sign in with official credentials
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Authorized Role / Jurisdiction
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-xs">
                {(['OFFICER', 'CITIZEN', 'MANUFACTURER', 'SURVEILLANCE', 'ADMIN'] as UserRole[]).map((r) => {
                  const labels: Record<UserRole, string> = {
                    OFFICER: 'Inspector',
                    CITIZEN: 'Consumer',
                    MANUFACTURER: 'Brand Mfg',
                    SURVEILLANCE: 'Surveillance',
                    ADMIN: 'Admin'
                  };
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`py-2 px-2.5 rounded-xl font-bold transition-all text-center cursor-pointer ${
                        selectedRole === r
                          ? 'bg-[#00A651] text-white shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {labels[r]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Official Designation / Name */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Official Designation / Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#00A651]"
                placeholder="Enter designation or name"
              />
            </div>

            {/* Official Email / Govt ID */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Official Email / Govt ID
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#00A651] font-mono"
                placeholder="e.g. inspector@lm.gov.in"
              />
            </div>

            {/* Passcode / PIN */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Security Passcode / Token
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#00A651] font-mono"
                placeholder="••••••••"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#00A651] hover:bg-emerald-600 text-white text-xs font-black py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Sign In to Official Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 1-Click Demonstration Test Rooms */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div>
              <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                <span>Authorized Demonstration Access (1-Click Test Rooms)</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Click any regulatory role below to enter directly into its dedicated operational workflow
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              5 Role Environments
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testRooms.map((room) => {
              const IconComp = room.icon;
              return (
                <div
                  key={room.role}
                  onClick={() => handle1ClickRoom(room.role)}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[#00A651] dark:hover:border-[#00A651] p-5 rounded-2xl cursor-pointer transition-all hover:shadow-lg flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 ${room.iconColor}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${room.badgeColor}`}>
                        {room.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 group-hover:text-[#00A651] transition-colors">
                        {room.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                        {room.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-[#00A651]">
                    <span>Enter {room.targetPage}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-4 px-4 text-center text-xs text-zinc-500 dark:text-zinc-500 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>
            SIH 2026 • Problem Statement SIH-26034 • Government of India Legal Metrology Portal
          </span>
          <a
            href="https://www.linkedin.com/in/saleemshaikatcbit/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 dark:text-zinc-400 hover:text-[#00A651] dark:hover:text-[#00A651] font-bold inline-flex items-center gap-1"
          >
            <span>Developer Profile</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};

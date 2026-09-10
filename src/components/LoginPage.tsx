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
  Globe,
  CheckCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  isDarkMode?: boolean;
  setIsDarkMode?: (val: boolean) => void;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
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
      title: getTranslation('login_room_officer_title', currentLang),
      badge: getTranslation('login_room_officer_badge', currentLang),
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: ShieldCheck,
      iconColor: 'text-blue-600',
      desc: getTranslation('login_room_officer_desc', currentLang),
      targetPage: currentLang === 'hi' ? 'निरीक्षक कार्यक्षेत्र' : currentLang === 'te' ? 'ఇన్‌స్పెక్టర్ డాష్‌బోర్డ్' : 'Inspector Dashboard'
    },
    {
      role: 'CITIZEN' as UserRole,
      title: getTranslation('login_room_citizen_title', currentLang),
      badge: getTranslation('login_room_citizen_badge', currentLang),
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: ShoppingBag,
      iconColor: 'text-emerald-600',
      desc: getTranslation('login_room_citizen_desc', currentLang),
      targetPage: currentLang === 'hi' ? 'उपभोक्ता जांच केंद्र' : currentLang === 'te' ? 'వినియోగదారుల చెక్ స్టూడియో' : 'Package Scanner Studio'
    },
    {
      role: 'MANUFACTURER' as UserRole,
      title: getTranslation('login_room_mfg_title', currentLang),
      badge: getTranslation('login_room_mfg_badge', currentLang),
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: Building2,
      iconColor: 'text-purple-600',
      desc: getTranslation('login_room_mfg_desc', currentLang),
      targetPage: currentLang === 'hi' ? 'आर्टवर्क सिम्युलेटर' : currentLang === 'te' ? 'ఆర్ట్‌వర్క్ సిమ్యులేటర్' : 'Artwork Pre-Check Simulator'
    },
    {
      role: 'SURVEILLANCE' as UserRole,
      title: getTranslation('login_room_surv_title', currentLang),
      badge: getTranslation('login_room_surv_badge', currentLang),
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Radio,
      iconColor: 'text-amber-600',
      desc: getTranslation('login_room_surv_desc', currentLang),
      targetPage: currentLang === 'hi' ? 'राष्ट्रीय निगरानी हब' : currentLang === 'te' ? 'జాతీయ నిఘా హబ్' : 'National Surveillance Hub'
    },
    {
      role: 'ADMIN' as UserRole,
      title: getTranslation('login_room_admin_title', currentLang),
      badge: getTranslation('login_room_admin_badge', currentLang),
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: Sliders,
      iconColor: 'text-slate-700',
      desc: getTranslation('login_room_admin_desc', currentLang),
      targetPage: currentLang === 'hi' ? 'प्रशासन नियंत्रण केंद्र' : currentLang === 'te' ? 'అడ్మిన్ కంట్రోల్ సెంటర్' : 'Platform Control Center'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 transition-colors selection:bg-blue-600 selection:text-white">
      {/* Top Govt of India Strip */}
      <div className="bg-slate-100 text-slate-700 px-4 py-1.5 text-xs border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="font-extrabold text-slate-900">SMART INDIA HACKATHON 2026</span>
          <span className="text-slate-400">•</span>
          <span className="font-mono bg-white px-2 py-0.5 rounded text-slate-800 border border-slate-200 font-bold">PS ID: SIH-26034</span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline font-semibold text-slate-700">
            Ministry of Consumer Affairs, Food & Public Distribution
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-700 font-bold text-[11px]">
            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Legal Metrology (Packaged Commodities) Rules, 2011</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-800 font-mono font-bold text-[11px]">Team Neural Knights</span>
        </div>
      </div>

      {/* Main Header / Branding */}
      <header className="max-w-6xl w-full mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logos/inspack-logo.jpg"
            alt="Inspack Logo"
            className="h-11 w-auto object-contain rounded-xl shadow-xs border border-slate-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                in<span className="text-blue-600">spack</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-50 text-blue-700 border border-blue-200">
                Official Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Packaged Commodities Compliance Verification System (PCR 2011)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector Pill */}
          <div className="flex items-center rounded-xl bg-white p-1 border border-slate-200 text-xs font-bold shadow-xs">
            <Globe className="w-3.5 h-3.5 text-blue-600 ml-1.5 mr-1" />
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
                    ? 'bg-blue-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.nativeLabel}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Center Body: Login Card & Test Rooms */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 space-y-10 flex-1 flex flex-col justify-center">
        {/* Sign In Card */}
        <div className="max-w-xl w-full mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 border border-blue-100 shadow-2xs">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {getTranslation('login_portal_sign_in', currentLang)}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {getTranslation('login_select_role', currentLang)}
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {getTranslation('login_role_label', currentLang)}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs">
                {(['OFFICER', 'CITIZEN', 'MANUFACTURER', 'SURVEILLANCE', 'ADMIN'] as UserRole[]).map((r) => {
                  const labels: Record<UserRole, string> = {
                    OFFICER: getTranslation('login_role_officer', currentLang),
                    CITIZEN: getTranslation('login_role_citizen', currentLang),
                    MANUFACTURER: getTranslation('login_role_manufacturer', currentLang),
                    SURVEILLANCE: getTranslation('login_role_surveillance', currentLang),
                    ADMIN: getTranslation('login_role_admin', currentLang)
                  };
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`py-2 px-2.5 rounded-xl font-bold transition-all text-center cursor-pointer ${
                        selectedRole === r
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-white'
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
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {getTranslation('login_official_name', currentLang)}
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-600 font-medium"
                placeholder="Enter designation or name"
              />
            </div>

            {/* Official Email / Govt ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {getTranslation('login_official_email', currentLang)}
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-600 font-mono"
                placeholder="e.g. inspector@lm.gov.in"
              />
            </div>

            {/* Passcode / PIN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {getTranslation('login_security_token', currentLang)}
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-blue-600 font-mono"
                placeholder="••••••••"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{getTranslation('login_submit_btn', currentLang)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 1-Click Demonstration Test Rooms */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{getTranslation('login_test_rooms', currentLang)}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {getTranslation('login_test_rooms_desc', currentLang)}
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
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
                  className="bg-white border border-slate-200 hover:border-blue-400 p-5 rounded-2xl cursor-pointer transition-all hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-blue-50 transition-colors">
                        <IconComp className={`w-5 h-5 ${room.iconColor}`} />
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${room.badgeColor}`}>
                        {room.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {room.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {room.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
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
      <footer className="border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500 bg-white">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>
            SIH 2026 • Problem Statement SIH-26034 • Government of India Legal Metrology Portal
          </span>
          <a
            href="https://www.linkedin.com/in/saleemshaikatcbit/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-700 hover:text-blue-600 font-bold inline-flex items-center gap-1"
          >
            <span>Developer Profile</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};

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
      badgeColor: 'bg-[#283618] text-[#FEFAE0] border-[#606C38]',
      icon: ShieldCheck,
      iconColor: 'text-[#283618]',
      desc: getTranslation('login_room_officer_desc', currentLang),
      targetPage: currentLang === 'hi' ? 'निरीक्षक कार्यक्षेत्र' : currentLang === 'te' ? 'ఇన్‌స్పెక్టర్ డాష్‌బోర్డ్' : 'Inspector Dashboard'
    },
    {
      role: 'CITIZEN' as UserRole,
      title: getTranslation('login_room_citizen_title', currentLang),
      badge: getTranslation('login_room_citizen_badge', currentLang),
      badgeColor: 'bg-[#606C38] text-[#FEFAE0] border-[#283618]',
      icon: ShoppingBag,
      iconColor: 'text-[#606C38]',
      desc: getTranslation('login_room_citizen_desc', currentLang),
      targetPage: currentLang === 'hi' ? 'उपभोक्ता जांच केंद्र' : currentLang === 'te' ? 'వినియోగదారుల చెక్ స్టూడియో' : 'Package Scanner Studio'
    },
    {
      role: 'MANUFACTURER' as UserRole,
      title: getTranslation('login_room_mfg_title', currentLang),
      badge: getTranslation('login_room_mfg_badge', currentLang),
      badgeColor: 'bg-[#BC6C25] text-white border-[#DDA15E]',
      icon: Building2,
      iconColor: 'text-[#BC6C25]',
      desc: getTranslation('login_room_mfg_desc', currentLang),
      targetPage: currentLang === 'hi' ? 'आर्टवर्क सिम्युलेटर' : currentLang === 'te' ? 'ఆర్ట్‌వర్క్ సిమ్యులేటర్' : 'Artwork Pre-Check Simulator'
    },
    {
      role: 'SURVEILLANCE' as UserRole,
      title: getTranslation('login_room_surv_title', currentLang),
      badge: getTranslation('login_room_surv_badge', currentLang),
      badgeColor: 'bg-[#283618] text-[#DDA15E] border-[#606C38]',
      icon: Radio,
      iconColor: 'text-[#283618]',
      desc: getTranslation('login_room_surv_desc', currentLang),
      targetPage: currentLang === 'hi' ? 'राष्ट्रीय निगरानी हब' : currentLang === 'te' ? 'జాతీయ నిఘా హబ్' : 'National Surveillance Hub'
    },
    {
      role: 'ADMIN' as UserRole,
      title: getTranslation('login_room_admin_title', currentLang),
      badge: getTranslation('login_room_admin_badge', currentLang),
      badgeColor: 'bg-[#606C38] text-white border-[#283618]',
      icon: Sliders,
      iconColor: 'text-[#606C38]',
      desc: getTranslation('login_room_admin_desc', currentLang),
      targetPage: currentLang === 'hi' ? 'प्रशासन नियंत्रण केंद्र' : currentLang === 'te' ? 'అడ్మిన్ కంట్రోల్ సెంటర్' : 'Platform Control Center'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FEFAE0] text-[#1F2416] transition-colors selection:bg-[#606C38] selection:text-white">
      {/* Top Govt of India Strip in Deep Forest Olive (#283618) */}
      <div className="bg-[#283618] text-[#FEFAE0] px-4 py-1.5 text-xs border-b border-[#606C38]/40 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#DDA15E] animate-pulse"></span>
          <span className="font-bold text-[#DDA15E]">SMART INDIA HACKATHON 2026</span>
          <span className="text-[#DDA15E]/60">•</span>
          <span className="font-mono text-[#FEFAE0]/90">PS ID: SIH-26034</span>
          <span className="hidden sm:inline text-[#DDA15E]/60">•</span>
          <span className="hidden sm:inline text-[#FEFAE0]/80">
            Ministry of Consumer Affairs, Food & Public Distribution
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[#DDA15E] font-semibold text-[11px]">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Legal Metrology (Packaged Commodities) Rules, 2011</span>
          </div>
          <span className="text-[#606C38]">|</span>
          <span className="text-[#FEFAE0] font-mono font-bold text-[11px]">Team Neural Knights</span>
        </div>
      </div>

      {/* Main Header / Branding */}
      <header className="max-w-6xl w-full mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logos/inspack-logo.jpg"
            alt="Inspack Logo"
            className="h-11 w-auto object-contain rounded-xl shadow-xs border border-[#DDA15E]/40"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#283618] tracking-tight">
                in<span className="text-[#606C38]">spack</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#606C38]/15 text-[#283618] border border-[#606C38]/30">
                Official Portal
              </span>
            </div>
            <p className="text-xs text-[#606C38] font-medium">
              Packaged Commodities Compliance Verification System (PCR 2011)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector Pill */}
          <div className="flex items-center rounded-xl bg-white p-1 border border-[#DDA15E]/50 text-xs font-bold shadow-xs">
            <Globe className="w-3.5 h-3.5 text-[#BC6C25] ml-1.5 mr-1" />
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
                    ? 'bg-[#283618] text-[#FEFAE0] shadow-xs font-black'
                    : 'text-[#283618] hover:text-[#606C38]'
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
        <div className="max-w-xl w-full mx-auto bg-white border border-[#DDA15E]/50 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F4EED4] text-[#283618] mb-3 border border-[#DDA15E]/40 shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#283618] tracking-tight">
              {getTranslation('login_portal_sign_in', currentLang)}
            </h1>
            <p className="text-xs text-[#606C38] mt-1 font-medium">
              {getTranslation('login_select_role', currentLang)}
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-bold text-[#283618] mb-1.5">
                {getTranslation('login_role_label', currentLang)}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-[#F4EED4]/60 p-1.5 rounded-2xl border border-[#DDA15E]/40 text-xs">
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
                          ? 'bg-[#283618] text-[#FEFAE0] shadow-sm'
                          : 'text-[#283618] hover:bg-[#EAE2C2]'
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
              <label className="block text-xs font-bold text-[#283618] mb-1">
                {getTranslation('login_official_name', currentLang)}
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
                className="w-full bg-[#FEFAE0]/40 border border-[#DDA15E]/60 text-[#1F2416] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#283618] font-medium"
                placeholder="Enter designation or name"
              />
            </div>

            {/* Official Email / Govt ID */}
            <div>
              <label className="block text-xs font-bold text-[#283618] mb-1">
                {getTranslation('login_official_email', currentLang)}
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full bg-[#FEFAE0]/40 border border-[#DDA15E]/60 text-[#1F2416] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#283618] font-mono"
                placeholder="e.g. inspector@lm.gov.in"
              />
            </div>

            {/* Passcode / PIN */}
            <div>
              <label className="block text-xs font-bold text-[#283618] mb-1">
                {getTranslation('login_security_token', currentLang)}
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#FEFAE0]/40 border border-[#DDA15E]/60 text-[#1F2416] text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#283618] font-mono"
                placeholder="••••••••"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#283618] hover:bg-[#1c2610] text-[#FEFAE0] text-xs font-black py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{getTranslation('login_submit_btn', currentLang)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 1-Click Demonstration Test Rooms */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#DDA15E]/40 pb-3">
            <div>
              <h2 className="text-base font-black text-[#283618] tracking-tight flex items-center gap-2">
                <span>{getTranslation('login_test_rooms', currentLang)}</span>
              </h2>
              <p className="text-xs text-[#606C38]">
                {getTranslation('login_test_rooms_desc', currentLang)}
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F4EED4] text-[#283618] border border-[#DDA15E]/40">
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
                  className="bg-white border border-[#DDA15E]/50 hover:border-[#283618] p-5 rounded-2xl cursor-pointer transition-all hover:shadow-lg flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl bg-[#F4EED4] ${room.iconColor}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${room.badgeColor}`}>
                        {room.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-[#283618] group-hover:text-[#BC6C25] transition-colors">
                        {room.title}
                      </h3>
                      <p className="text-xs text-[#606C38] mt-1.5 leading-relaxed">
                        {room.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#DDA15E]/30 flex items-center justify-between text-xs font-bold text-[#BC6C25]">
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
      <footer className="border-t border-[#DDA15E]/40 py-4 px-4 text-center text-xs text-[#606C38] bg-[#F4EED4]/50">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>
            SIH 2026 • Problem Statement SIH-26034 • Government of India Legal Metrology Portal
          </span>
          <a
            href="https://www.linkedin.com/in/saleemshaikatcbit/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#283618] hover:text-[#BC6C25] font-bold inline-flex items-center gap-1"
          >
            <span>Developer Profile</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};

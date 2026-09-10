import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Scale,
  RefreshCw,
  CheckCircle,
  Building2,
  BarChart3,
  Globe,
  Menu,
  KeyRound,
  Shield,
  BookOpen,
  Archive,
  PhoneCall,
  LogOut,
  Camera,
  Radio,
  Settings,
  X,
  User as UserIcon,
  ChevronDown,
  Layers
} from 'lucide-react';
import { UserRole, AuthUser, ActiveTab, Language } from '../types';
import { getTranslation, SUPPORTED_LANGUAGES, setStoredLanguage } from '../services/i18nService';
import { triggerImmediateCloudSync, SYNC_STATUS_EVENT } from '../services/dbService';
import { getAdminConfig } from '../services/adminService';

interface NavbarProps {
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: AuthUser | null;
  isDarkMode?: boolean;
  setIsDarkMode?: (val: boolean) => void;
  onOpenRulebook?: () => void;
  onOpenVault?: () => void;
  onOpenGrievance?: () => void;
  onOpenLogin?: () => void;
  onSignOut: () => void;
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  currentUser,
  onOpenRulebook,
  onOpenVault,
  onOpenGrievance,
  onOpenLogin,
  onSignOut,
  currentLang = 'en',
  onLanguageChange,
}) => {
  const adminConfig = getAdminConfig();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Real-time Cloud Sync Listener
  useEffect(() => {
    const handleSyncStatus = (e: Event) => {
      const customEvent = e as CustomEvent<{ isSyncing: boolean; lastSynced: Date }>;
      setIsSyncing(customEvent.detail?.isSyncing ?? false);
      if (customEvent.detail?.lastSynced) {
        setLastSyncedTime(new Date(customEvent.detail.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    };
    window.addEventListener(SYNC_STATUS_EVENT, handleSyncStatus);
    return () => window.removeEventListener(SYNC_STATUS_EVENT, handleSyncStatus);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await triggerImmediateCloudSync();
  };

  const getRoleSubtitle = () => {
    switch (userRole) {
      case 'MANUFACTURER':
        return getTranslation('role_manufacturer_sub', currentLang);
      case 'CITIZEN':
        return getTranslation('role_citizen_sub', currentLang);
      case 'OFFICER':
        return getTranslation('role_officer_sub', currentLang);
      case 'SURVEILLANCE':
        return getTranslation('role_surveillance_sub', currentLang);
      case 'ADMIN':
        return getTranslation('role_admin_sub', currentLang);
      default:
        return getTranslation('rule_title', currentLang);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FEFAE0] border-b border-[#DDA15E]/40 shadow-xs transition-colors">
      {/* Top Govt of India & SIH Strip in Deep Forest Olive (#283618) */}
      <div className="bg-[#283618] text-[#FEFAE0] px-4 py-1 text-[11px] border-b border-[#606C38]/40 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#DDA15E] animate-pulse"></span>
          <span className="font-bold text-[#DDA15E] tracking-wide">SMART INDIA HACKATHON 2026</span>
          <span className="text-[#DDA15E]/60">•</span>
          <span className="font-mono font-bold text-white">PS ID: SIH-26034</span>
          <span className="hidden md:inline text-[#DDA15E]/60">•</span>
          <span className="hidden md:inline text-[#FEFAE0]/80">
            {adminConfig.specialDriveBanner || 'Ministry of Consumer Affairs, Food & Public Distribution'}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Real-time Cloud Sync Trigger */}
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1c2610] border border-[#606C38] text-[#DDA15E] hover:bg-[#283618] font-medium text-[10px] transition-all cursor-pointer shadow-2xs"
            title={`Google Cloud Firestore Synced. Click to refresh. Last Synced: ${lastSyncedTime}`}
          >
            <RefreshCw className={`w-3 h-3 text-[#DDA15E] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? getTranslation('syncing', currentLang) : (currentLang === 'hi' ? 'क्लाउड सिंक' : currentLang === 'te' ? 'క్లౌడ్ సింక్' : '☁️ Synced')}</span>
            <span className="text-[9px] text-[#FEFAE0]/70">({lastSyncedTime})</span>
          </button>

          {/* Language Switcher Pill */}
          <div className="flex items-center rounded-lg bg-[#1c2610] p-0.5 border border-[#606C38] text-[10px] font-bold">
            <Globe className="w-3 h-3 text-[#DDA15E] ml-1 mr-1" />
            {SUPPORTED_LANGUAGES.map((opt) => (
              <button
                key={opt.code}
                onClick={() => {
                  setStoredLanguage(opt.code);
                  onLanguageChange?.(opt.code);
                }}
                className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                  currentLang === opt.code
                    ? 'bg-[#606C38] text-[#FEFAE0] font-black shadow-xs'
                    : 'text-[#FEFAE0]/70 hover:text-white'
                }`}
                title={opt.nativeLabel}
              >
                {opt.code === 'en' ? 'EN' : opt.code === 'hi' ? 'हिन्दी' : 'తెలుగు'}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[#DDA15E] font-semibold">
            <CheckCircle className="w-3 h-3" />
            <span>LMPC Rules 2011</span>
          </div>
          <span className="hidden lg:inline text-[#606C38]">|</span>
          <div className="hidden lg:block text-[#FEFAE0] font-mono font-bold">Team: Neural Knights</div>
        </div>
      </div>

      {/* Main Navbar - Guaranteed Single Minimal Line Layout */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        {/* Left Section: Hamburger Menu + Inspack Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* 3-Bars Hamburger Button */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-[#F4EED4] hover:bg-[#EAE2C2] text-[#283618] transition-all cursor-pointer border border-[#DDA15E]/40 shadow-xs flex items-center justify-center"
              title="Quick Menu"
            >
              {isMenuOpen ? (
                <X className="w-4 h-4 text-[#283618]" />
              ) : (
                <Menu className="w-4 h-4 text-[#283618]" />
              )}
            </button>

            {/* Curated Non-Duplicate Hamburger Dropdown */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-72 bg-[#FEFAE0] rounded-2xl shadow-2xl border border-[#DDA15E]/60 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Current User Header */}
                  {currentUser ? (
                    <div className="px-4 py-2.5 border-b border-[#DDA15E]/30 flex items-center gap-3 bg-[#F4EED4]/60">
                      <div className="w-8 h-8 rounded-full bg-[#283618] text-[#FEFAE0] flex items-center justify-center font-bold text-xs">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-black text-[#283618] truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[10px] font-bold text-[#BC6C25] uppercase">
                          {userRole} • Active Session
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-2.5 border-b border-[#DDA15E]/30 bg-[#F4EED4]/60">
                      <div className="text-xs font-bold text-[#283618]">
                        Guest Mode
                      </div>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenLogin?.();
                        }}
                        className="text-[11px] font-bold text-[#283618] hover:underline cursor-pointer mt-0.5 block"
                      >
                        Sign in to select role
                      </button>
                    </div>
                  )}

                  {/* Clean Non-Duplicate Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setCurrentTab('home');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-[#283618] hover:bg-[#EAE2C2] flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <Home className="w-4 h-4 text-[#283618] shrink-0" />
                      <div>
                        <div>{getTranslation('tab_home', currentLang)}</div>
                        <div className="text-[10px] font-normal text-[#606C38]">Main welcome and gateway dashboard</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setCurrentTab('profile');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-[#283618] hover:bg-[#EAE2C2] flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-[#BC6C25] shrink-0" />
                      <div>
                        <div>{getTranslation('tab_profile', currentLang)}</div>
                        <div className="text-[10px] font-normal text-[#606C38]">Official credentials, jurisdiction & powers</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setCurrentTab('catalog');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-[#283618] hover:bg-[#EAE2C2] flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-[#606C38] shrink-0" />
                      <div>
                        <div>{getTranslation('tab_catalog', currentLang)}</div>
                        <div className="text-[10px] font-normal text-[#606C38]">Multi-image factory batch auto-clustering</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenVault?.();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-[#283618] hover:bg-[#EAE2C2] flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <Archive className="w-4 h-4 text-[#283618] shrink-0" />
                      <div>
                        <div>Inspection Vault & Dossier</div>
                        <div className="text-[10px] font-normal text-[#606C38]">Locally cached & cloud-synced reports</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenGrievance?.();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-[#283618] hover:bg-[#EAE2C2] flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4 text-[#BC6C25] shrink-0" />
                      <div>
                        <div>National Consumer Helpline (1915)</div>
                        <div className="text-[10px] font-normal text-[#606C38]">Direct statutory grievance submission</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setCurrentTab('rulebook');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-[#283618] hover:bg-[#EAE2C2] flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-[#606C38] shrink-0" />
                      <div>
                        <div>Official LMPC Gazette (43 Pages)</div>
                        <div className="text-[10px] font-normal text-[#606C38]">Complete Schedules, Rules & Font Heights</div>
                      </div>
                    </button>
                  </div>

                  {/* Sign Out Action */}
                  <div className="border-t border-[#DDA15E]/30 pt-1 mt-1">
                    {currentUser ? (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onSignOut();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-[#BC6C25] hover:bg-[#F4EED4] flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-[#BC6C25] shrink-0" />
                        <div>
                          <div>Sign Out</div>
                          <div className="text-[10px] font-normal text-[#BC6C25]/80">Return to role login portal</div>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenLogin?.();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-[#283618] hover:bg-[#F4EED4] flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4 text-[#283618] shrink-0" />
                        <div>
                          <div>Sign In / Select Role</div>
                          <div className="text-[10px] font-normal text-[#606C38]">Switch to Officer, Citizen, Brand</div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Logo & Brand Name (Clicking always takes to Home) */}
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setCurrentTab('home')}
            title="Go to Home Page"
          >
            <img
              src="/logos/inspack-logo.jpg"
              alt="Inspack Logo"
              className="h-8 w-auto object-contain rounded-md"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-[#283618] leading-none">
                in<span className="text-[#606C38]">spack</span>
              </span>
              <span className="text-[8.5px] uppercase tracking-wider text-[#BC6C25] font-extrabold mt-0.5 truncate max-w-[150px]">
                {getRoleSubtitle()}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Navigation Tabs - Single Row with Horizontal Scroll on Small Displays */}
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-nowrap">
          {/* Universal Home Button */}
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              currentTab === 'home'
                ? 'bg-[#283618] text-[#FEFAE0] shadow-md'
                : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{getTranslation('tab_home', currentLang)}</span>
          </button>

          {/* 1. MANUFACTURER TABS */}
          {userRole === 'MANUFACTURER' && (
            <>
              <button
                onClick={() => setCurrentTab('manufacturer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'manufacturer'
                    ? 'bg-[#BC6C25] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_artwork_precheck', currentLang)}</span>
              </button>

              <button
                onClick={() => setCurrentTab('scanner')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'scanner'
                    ? 'bg-[#606C38] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_precompliance', currentLang)}</span>
              </button>

              <button
                onClick={() => setCurrentTab('catalog')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'catalog'
                    ? 'bg-[#283618] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_catalog', currentLang)}</span>
              </button>
            </>
          )}

          {/* 2. CITIZEN TABS */}
          {userRole === 'CITIZEN' && (
            <>
              <button
                onClick={() => setCurrentTab('upload')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'upload'
                    ? 'bg-[#606C38] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_scan_package', currentLang)}</span>
              </button>

              <button
                onClick={() => setCurrentTab('scanner')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'scanner'
                    ? 'bg-[#283618] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_fair_pack', currentLang)}</span>
              </button>

              <button
                onClick={() => setCurrentTab('ecommerce')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'ecommerce'
                    ? 'bg-[#BC6C25] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_dark_store', currentLang)}</span>
              </button>
            </>
          )}

          {/* 3. OFFICER (LEGAL METROLOGY INSPECTOR) TABS */}
          {userRole === 'OFFICER' && (
            <>
              <button
                onClick={() => setCurrentTab('upload')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'upload'
                    ? 'bg-[#283618] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_field_scan', currentLang)}</span>
              </button>

              <button
                onClick={() => setCurrentTab('scanner')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'scanner'
                    ? 'bg-[#606C38] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_official_inspection', currentLang)}</span>
              </button>

              <button
                onClick={() => setCurrentTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'analytics'
                    ? 'bg-[#283618] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_officer_hub', currentLang)}</span>
              </button>

              <button
                onClick={() => setCurrentTab('ecommerce')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'ecommerce'
                    ? 'bg-[#BC6C25] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_ecommerce', currentLang)}</span>
              </button>

              <button
                onClick={() => setCurrentTab('catalog')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'catalog'
                    ? 'bg-[#606C38] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_catalog', currentLang)}</span>
              </button>
            </>
          )}

          {/* 4. SURVEILLANCE TABS */}
          {userRole === 'SURVEILLANCE' && (
            <>
              <button
                onClick={() => setCurrentTab('surveillance')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'surveillance'
                    ? 'bg-[#283618] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-[#DDA15E] animate-pulse" />
                <span>{getTranslation('tab_surveillance_hub', currentLang)}</span>
              </button>

              <button
                onClick={() => setCurrentTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'analytics'
                    ? 'bg-[#606C38] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_central_dossier', currentLang)}</span>
              </button>

              <button
                onClick={() => setCurrentTab('ecommerce')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'ecommerce'
                    ? 'bg-[#BC6C25] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_platform_surveillance', currentLang)}</span>
              </button>
            </>
          )}

          {/* 5. ADMIN TABS */}
          {userRole === 'ADMIN' && (
            <>
              <button
                onClick={() => setCurrentTab('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'admin'
                    ? 'bg-[#283618] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_admin', currentLang)}</span>
              </button>

              <button
                onClick={() => setCurrentTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'analytics'
                    ? 'bg-[#606C38] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_audit_logs', currentLang)}</span>
              </button>

              <button
                onClick={() => setCurrentTab('upload')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  currentTab === 'upload'
                    ? 'bg-[#BC6C25] text-white shadow-md'
                    : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{getTranslation('tab_scan_studio', currentLang)}</span>
              </button>
            </>
          )}

          {/* Concise Rulebook Button */}
          <button
            onClick={() => setCurrentTab('rulebook')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              currentTab === 'rulebook'
                ? 'bg-[#283618] text-[#FEFAE0] shadow-md'
                : 'text-[#283618] hover:bg-[#F4EED4] bg-white/70 border border-[#DDA15E]/30'
            }`}
            title="Gazette of India: Legal Metrology (Packaged Commodities) Rules, 2011"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#BC6C25]" />
            <span>{getTranslation('rulebook_concise', currentLang) || 'Rulebook'}</span>
          </button>
        </nav>

        {/* Right Section: Compact Officer / Role Dropdown (Zero-Wrap, Minimal) */}
        <div className="flex items-center gap-2 shrink-0 relative" ref={userMenuRef}>
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#F4EED4] hover:bg-[#EAE2C2] border border-[#DDA15E]/60 rounded-xl text-xs font-black text-[#283618] transition-all cursor-pointer shadow-2xs"
                title={`${currentUser.name} (${userRole}) - Click for Profile, Switch Role & Sign Out`}
              >
                <div className="w-5 h-5 rounded-full bg-[#283618] text-[#FEFAE0] flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[11px] font-black text-[#283618] truncate max-w-[85px] sm:max-w-[110px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[8.5px] font-extrabold text-[#BC6C25] uppercase tracking-wider">
                    {userRole}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[#283618] transition-transform duration-150 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Sleek Small Dropdown for Officer/User Details */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#FEFAE0] rounded-2xl shadow-2xl border border-[#DDA15E]/70 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Overview */}
                  <div className="px-4 py-2.5 border-b border-[#DDA15E]/30 bg-[#F4EED4]/60">
                    <div className="text-xs font-black text-[#283618] truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] font-mono text-[#606C38] truncate">
                      {currentUser.email}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#283618] text-[#FEFAE0] uppercase">
                        {userRole}
                      </span>
                      {currentUser.badgeNumber && (
                        <span className="text-[9px] font-mono text-[#BC6C25] font-bold">
                          {currentUser.badgeNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dropdown Options */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setCurrentTab('profile');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-[#283618] hover:bg-[#EAE2C2] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-[#BC6C25]" />
                      <span>{getTranslation('tab_profile', currentLang)}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onOpenLogin?.();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-[#283618] hover:bg-[#EAE2C2] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-[#606C38]" />
                      <span>Switch Role / Re-Authenticate</span>
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className="border-t border-[#DDA15E]/30 pt-1 mt-1">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-[#BC6C25] hover:bg-[#F4EED4] flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-[#BC6C25]" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#283618] hover:bg-[#1c2610] text-[#FEFAE0] rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{getTranslation('sign_in_btn', currentLang)}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

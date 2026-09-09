import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { DemoPresetSelector } from './components/DemoPresetSelector';
import { LiveCameraScanner } from './components/LiveCameraScanner';
import { EvidenceVisualizer } from './components/EvidenceVisualizer';
import { ComplianceScorecard } from './components/ComplianceScorecard';
import { RuleBreakdownCard } from './components/RuleBreakdownCard';
import { OfficerAnalyticsDashboard } from './components/OfficerAnalyticsDashboard';
import { EcommerceAuditTab } from './components/EcommerceAuditTab';
import { ManufacturerSelfAudit } from './components/ManufacturerSelfAudit';
import { NationalSurveillanceHub } from './components/NationalSurveillanceHub';
import { AdminControlCenter } from './components/AdminControlCenter';
import { PDFPreviewModal } from './components/PDFPreviewModal';
import { ConsumerGrievanceModal } from './components/ConsumerGrievanceModal';
import { CloudConfigModal } from './components/CloudConfigModal';
import { RulebookDrawer } from './components/RulebookDrawer';
import { RulebookPage } from './components/RulebookPage';
import { LoginModal } from './components/LoginModal';
import { InspectionVaultModal } from './components/InspectionVaultModal';
import { Footer } from './components/Footer';
import { DEMO_PRESETS, DemoProductPreset } from './data/demoProducts';
import { evaluateCompliance } from './services/complianceEngine';
import { saveScanReport, getScanReports, syncWithCloudDatabase, DB_CHANGE_EVENT } from './services/dbService';
import { getCurrentUser, switchRole, logoutUser } from './services/authService';
import { ComplianceReport, UserRole, AuthUser, ActiveTab, Language } from './types';
import { getStoredLanguage, setStoredLanguage, LANG_CHANGE_EVENT } from './services/i18nService';
import { Camera, Archive, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, Sparkles, Building2, Radio } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [userRole, setUserRole] = useState<UserRole>(() => currentUser?.role || 'OFFICER');

  const getTabForRole = (role: UserRole): ActiveTab => {
    switch (role) {
      case 'OFFICER':
        return 'analytics'; // Inspector lands directly in Dashboard
      case 'CITIZEN':
        return 'upload'; // Consumer lands directly in Upload / Scanner
      case 'MANUFACTURER':
        return 'manufacturer'; // Brand lands in Artwork Simulator
      case 'SURVEILLANCE':
        return 'surveillance'; // Surveillance lands in Hub
      case 'ADMIN':
        return 'admin'; // Admin lands in Control Center
      default:
        return 'analytics';
    }
  };

  const [currentTab, setCurrentTab] = useState<ActiveTab>(() => {
    const role = currentUser?.role || 'OFFICER';
    return getTabForRole(role);
  });

  // Default preset is Pintola All Natural Peanut Butter (350g)
  const [activePresetId, setActivePresetId] = useState<string>('demo-pintola-peanut-butter');
  const [activeView, setActiveView] = useState<'front' | 'back' | 'side'>('front');
  const [isPDFPreviewOpen, setIsPDFPreviewOpen] = useState(false);
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isRulebookOpen, setIsRulebookOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(() => getStoredLanguage());

  // Listen for language change events
  useEffect(() => {
    const handleLang = (e: Event) => {
      const ce = e as CustomEvent<{ lang: Language }>;
      if (ce.detail?.lang) {
        setCurrentLang(ce.detail.lang);
      }
    };
    window.addEventListener(LANG_CHANGE_EVENT, handleLang);
    return () => window.removeEventListener(LANG_CHANGE_EVENT, handleLang);
  }, []);

  // Sync dark mode class with root html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Initialize with verified benchmark Pintola All Natural Peanut Butter
  const [currentReport, setCurrentReport] = useState<ComplianceReport>(() => {
    const initialPreset = DEMO_PRESETS[0];
    const rep = evaluateCompliance(
      initialPreset.productInfo,
      'front',
      initialPreset.imageVisual,
      {
        name: currentUser?.name || 'Legal Metrology Inspector',
        badge: currentUser?.badgeNumber || 'LM-ND-4092',
        location: 'Department of Legal Metrology, New Delhi Zone'
      }
    );
    rep.id = 'INSP-261001';
    return rep;
  });

  // Real-Time Two-Way Google Cloud Firestore Synchronization across all devices
  useEffect(() => {
    // 1. Initial hydration from Firestore on mount
    syncWithCloudDatabase();

    // 2. Refresh from Firestore whenever user returns to or focuses the window
    const handleFocus = () => {
      syncWithCloudDatabase();
    };
    window.addEventListener('focus', handleFocus);

    // 3. Ultra-Fast Periodic cloud poll every 3.5 seconds (Real-time synchronization across all devices)
    const interval = setInterval(() => {
      syncWithCloudDatabase();
    }, 3500);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // Listen to DB changes (deletes & uploads) across all tabs and components
  useEffect(() => {
    const handleDbChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ deletedId?: string }>;
      const deletedId = customEvent.detail?.deletedId;
      const allReports = getScanReports();
      if (deletedId && currentReport.id === deletedId) {
        if (allReports.length > 0) {
          setCurrentReport(allReports[0]);
        }
      }
    };
    window.addEventListener(DB_CHANGE_EVENT, handleDbChange);
    return () => window.removeEventListener(DB_CHANGE_EVENT, handleDbChange);
  }, [currentReport]);

  const handleSelectPreset = (preset: DemoProductPreset) => {
    setActivePresetId(preset.id);
    setActiveView('front');
    const rep = evaluateCompliance(
      preset.productInfo,
      'front',
      preset.imageVisual,
      {
        name: currentUser?.name || 'Legal Metrology Inspector',
        badge: currentUser?.badgeNumber || 'LM-ND-4092',
        location: 'Department of Legal Metrology, New Delhi Zone'
      }
    );
    rep.id = 'INSP-' + Math.floor(100000 + Math.random() * 900000);
    setCurrentReport(rep);
    saveScanReport(rep);
    setCurrentTab('scanner');
  };

  const handleScanComplete = (report: ComplianceReport) => {
    setActivePresetId('');
    setCurrentReport(report);
    saveScanReport(report);
    setCurrentTab('scanner');
  };

  const handleSelectReportFromDossier = (report: ComplianceReport) => {
    setCurrentReport(report);
    setCurrentTab('scanner');
  };

  const handleSwitchRole = (newRole: UserRole) => {
    const user = switchRole(newRole);
    setCurrentUser(user);
    setUserRole(newRole);
    setCurrentTab(getTabForRole(newRole));
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setUserRole(user.role);
    setCurrentTab(getTabForRole(user.role));
  };

  const handleSignOut = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleLanguageChange = (lang: Language) => {
    setStoredLanguage(lang);
    setCurrentLang(lang);
  };

  // If user signed out, display the dedicated full-page LoginPage outside the website chrome
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  const currentImageSrc =
    currentReport.capturedImages?.[activeView] ||
    currentReport.capturedImages?.front ||
    DEMO_PRESETS[0].imageVisual.front;

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-[#00A651] selection:text-white ${
      isDarkMode ? 'dark bg-[#09090b] text-zinc-100' : 'bg-zinc-50 text-zinc-900'
    }`}>
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={handleSwitchRole}
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenRulebook={() => setIsRulebookOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenGrievance={() => setIsGrievanceOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onSignOut={handleSignOut}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* ========================================================================= */}
        {/* TAB 1: DEDICATED UPLOAD & SCAN STUDIO */}
        {/* ========================================================================= */}
        {currentTab === 'upload' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Studio Header */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-2 rounded-2xl bg-[#0A3663] dark:bg-zinc-800 text-white">
                    <Camera className="w-5 h-5" />
                  </span>
                  <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {userRole === 'CITIZEN' ? 'Consumer Package Compliance Scanner' : 'Field Inspection Scan Studio'}
                  </h1>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {userRole === 'CITIZEN'
                    ? 'Upload front and back photos of any packaged product to check if the MRP, weight, and manufacturer details follow the law.'
                    : 'Upload multi-view photos or capture live camera images of Front, Back, and Side panels for automated LMPC 2011 compliance verification.'}
                </p>
              </div>

              {/* Quick Jump to latest audit report */}
              <button
                onClick={() => setCurrentTab('scanner')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
              >
                <span>View Latest Audit Sheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Live Camera Scanner Uploader Studio */}
            <LiveCameraScanner
              onScanComplete={handleScanComplete}
              activeView={activeView}
              setActiveView={setActiveView}
              currentLang={currentLang}
            />

            {/* Benchmark Demo Presets */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#00A651]" />
                <span className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                  Or Test With Verified Benchmark Packaging Presets
                </span>
              </div>
              <DemoPresetSelector
                onSelectPreset={handleSelectPreset}
                activePresetId={activePresetId}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CLEAN COMPLIANCE AUDIT REPORT VIEW */}
        {/* ========================================================================= */}
        {currentTab === 'scanner' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Report Header & Action Bar */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${
                  currentReport.overallStatus === 'COMPLIANT'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-950/50 text-red-600 border border-red-200 dark:border-red-800'
                }`}>
                  {currentReport.overallStatus === 'COMPLIANT' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500">
                      ID: {currentReport.id}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${
                      currentReport.overallStatus === 'COMPLIANT'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
                    }`}>
                      {currentReport.overallStatus === 'COMPLIANT' ? 'Statutory Compliant' : 'Non-Compliant (Violations Detected)'}
                    </span>
                  </div>
                  <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {currentReport.productInfo.productName || 'Inspected Packaged Commodity'}
                  </h2>
                </div>
              </div>

              {/* Action Buttons: New Scan / Upload & View Vault */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVaultOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs transition-colors border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stored Vault</span>
                </button>

                {userRole === 'MANUFACTURER' ? (
                  <button
                    onClick={() => setCurrentTab('manufacturer')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>+ Test Another Artwork</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentTab('upload')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs transition-all cursor-pointer shadow-xs shadow-emerald-700/20"
                  >
                    <Camera className="w-4 h-4" />
                    <span>+ Start New Scan / Upload</span>
                  </button>
                )}
              </div>
            </div>

            {/* Two Column Layout: Evidence Visualizer (Left) and Scorecard (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Visual Evidence Overlay */}
              <div className="lg:col-span-6 space-y-6">
                <EvidenceVisualizer
                  imageSrc={currentImageSrc}
                  boundingBoxes={currentReport.boundingBoxes}
                  activeView={activeView}
                  setActiveView={setActiveView}
                  availableImages={currentReport.capturedImages}
                  currentLang={currentLang}
                />

                {/* Statutory Regulatory Context Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-xs text-zinc-600 dark:text-zinc-400 shadow-xs space-y-2 transition-colors">
                  <div className="font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px] flex items-center justify-between">
                    <span>
                      {userRole === 'MANUFACTURER'
                        ? 'Manufacturer Pre-Pack Verification Protocol'
                        : 'Statutory Inspection Protocol'}
                    </span>
                    <span className="text-[#00A651] font-mono font-bold">
                      {userRole === 'MANUFACTURER' ? 'Pre-Printing Validation' : 'Fifth Schedule Sampling'}
                    </span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    {userRole === 'MANUFACTURER'
                      ? 'Pre-pack validation confirms all mandatory declarations under Rule 6, numeral heights under Rule 7 Table I, and Second Schedule standard sizes before printing runs to prevent market recalls.'
                      : 'Inspection conducted under Section 15 of Legal Metrology Act, 2009. Sample size determined per Fifth Schedule Table (32 samples for lot < 4000; 80 samples for lot > 4000). Tare weight deducted per Sixth Schedule Part-II.'}
                  </p>
                </div>
              </div>

              {/* Right Column: Scorecard & Actions */}
              <div className="lg:col-span-6 space-y-6">
                <ComplianceScorecard
                  report={currentReport}
                  onOpenGrievanceModal={() => setIsGrievanceOpen(true)}
                  onPreviewPDF={() => setIsPDFPreviewOpen(true)}
                  currentLang={currentLang}
                />
              </div>
            </div>

            {/* Full Width: Comprehensive Rule Breakdown Card */}
            <RuleBreakdownCard evaluations={currentReport.evaluations} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: OFFICER ENFORCEMENT & ANALYTICS DASHBOARD */}
        {/* ========================================================================= */}
        {currentTab === 'analytics' && (
          <OfficerAnalyticsDashboard
            onSelectReport={handleSelectReportFromDossier}
            onPreviewReport={(rep) => {
              setCurrentReport(rep);
              setIsPDFPreviewOpen(true);
            }}
            currentLang={currentLang}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 4: E-COMMERCE / DARK STORE AUDIT */}
        {/* ========================================================================= */}
        {currentTab === 'ecommerce' && (
          <EcommerceAuditTab onAuditSelected={handleSelectReportFromDossier} />
        )}

        {/* ========================================================================= */}
        {/* TAB 5: BRAND PRE-CHECK PORTAL (MANUFACTURER) */}
        {/* ========================================================================= */}
        {currentTab === 'manufacturer' && (
          <ManufacturerSelfAudit onLoadAudit={handleSelectReportFromDossier} />
        )}

        {/* ========================================================================= */}
        {/* TAB 6: NATIONAL SURVEILLANCE HUB (MINISTRY DIRECTORATE) */}
        {/* ========================================================================= */}
        {currentTab === 'surveillance' && (
          <NationalSurveillanceHub />
        )}

        {/* ========================================================================= */}
        {/* TAB 7: ADMINISTRATOR CONTROL CENTER (SOFTWARE/PLATFORM ADMIN) */}
        {/* ========================================================================= */}
        {currentTab === 'admin' && (
          <AdminControlCenter />
        )}

        {/* ========================================================================= */}
        {/* TAB 8: FULL-PAGE OFFICIAL LMPC 2011 RULEBOOK (43 PAGES) */}
        {/* ========================================================================= */}
        {currentTab === 'rulebook' && (
          <RulebookPage onBack={() => setCurrentTab(getTabForRole(userRole))} />
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODALS & OVERLAYS */}
      {/* ========================================================================= */}
      {/* 1. Interactive In-Website PDF Inspection Sheet Preview */}
      <PDFPreviewModal
        isOpen={isPDFPreviewOpen}
        onClose={() => setIsPDFPreviewOpen(false)}
        report={currentReport}
        onUpdateReport={(updated) => setCurrentReport(updated)}
      />

      {/* 2. Consumer Grievance / NCH 1915 Modal */}
      <ConsumerGrievanceModal
        isOpen={isGrievanceOpen}
        onClose={() => setIsGrievanceOpen(false)}
        report={currentReport}
      />

      {/* 3. Cloud Database Configuration Modal */}
      <CloudConfigModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
      />

      {/* 4. Legal Metrology Rulebook Drawer */}
      <RulebookDrawer
        isOpen={isRulebookOpen}
        onClose={() => setIsRulebookOpen(false)}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenAdmin={() => setCurrentTab('admin')}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* 5. Stored Inspections Vault */}
      <InspectionVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        onSelectReport={handleSelectReportFromDossier}
      />

      {/* 6. Multi-Role Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleSignOut}
      />

      <Footer />
    </div>
  );
}

export default App;

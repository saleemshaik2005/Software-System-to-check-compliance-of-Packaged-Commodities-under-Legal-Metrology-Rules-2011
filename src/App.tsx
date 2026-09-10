import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { ProfilePage } from './components/ProfilePage';
import { CatalogBatchInspector } from './components/CatalogBatchInspector';
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

  // User explicitly requested: default landing page is 'home' for all users after choosing role
  const [currentTab, setCurrentTab] = useState<ActiveTab>('home');

  // Default preset is Pintola All Natural Peanut Butter (350g)
  const [activePresetId, setActivePresetId] = useState<string>('demo-pintola-peanut-butter');
  const [activeView, setActiveView] = useState<'front' | 'back' | 'side'>('front');
  const [isPDFPreviewOpen, setIsPDFPreviewOpen] = useState(false);
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isRulebookOpen, setIsRulebookOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
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

    // 3. Periodic cloud poll every 3.5 seconds
    const interval = setInterval(() => {
      syncWithCloudDatabase();
    }, 3500);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // Listen to DB changes across all tabs and components
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
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setUserRole(user.role);
    setCurrentTab('home'); // Home page first for all visitors!
  };

  const handleSignOut = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const handleLanguageChange = (lang: Language) => {
    setStoredLanguage(lang);
    setCurrentLang(lang);
  };

  // If user signed out or visiting for the first time, show LoginPage first
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
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
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#606C38] selection:text-white bg-[#FEFAE0] text-[#1F2416]">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={handleSwitchRole}
        currentUser={currentUser}
        onOpenRulebook={() => setCurrentTab('rulebook')}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenGrievance={() => setIsGrievanceOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onSignOut={handleSignOut}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* ========================================================================= */}
        {/* TAB 0: DEDICATED HOME PAGE FOR ALL USERS */}
        {/* ========================================================================= */}
        {currentTab === 'home' && (
          <HomePage
            currentUser={currentUser}
            userRole={userRole}
            setCurrentTab={setCurrentTab}
            onOpenVault={() => setIsVaultOpen(true)}
            onOpenRulebook={() => setCurrentTab('rulebook')}
            onOpenGrievance={() => setIsGrievanceOpen(true)}
            currentLang={currentLang}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 1: DEDICATED USER PROFILE & JURISDICTION POWERS */}
        {/* ========================================================================= */}
        {currentTab === 'profile' && (
          <ProfilePage
            onBack={() => setCurrentTab('home')}
            onSwitchRole={handleSwitchRole}
            onSignOut={handleSignOut}
            currentLang={currentLang}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INDUSTRIAL BATCH CATALOG & SHELF AUTO-CROP INSPECTOR */}
        {/* ========================================================================= */}
        {currentTab === 'catalog' && (
          <CatalogBatchInspector
            onBack={() => setCurrentTab('home')}
            onSelectReport={(report: ComplianceReport) => {
              setCurrentReport(report);
              setCurrentTab('scanner');
            }}
            currentLang={currentLang}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 3: DEDICATED UPLOAD & SCAN STUDIO */}
        {/* ========================================================================= */}
        {currentTab === 'upload' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Studio Header */}
            <div className="bg-white border border-[#DDA15E]/50 rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-2 rounded-2xl bg-[#283618] text-[#FEFAE0]">
                    <Camera className="w-5 h-5" />
                  </span>
                  <h1 className="text-xl font-black text-[#283618] tracking-tight">
                    {userRole === 'CITIZEN' ? 'Consumer Package Compliance Scanner' : 'Field Inspection Scan Studio'}
                  </h1>
                </div>
                <p className="text-xs text-[#606C38]">
                  {userRole === 'CITIZEN'
                    ? 'Upload front and back photos of any packaged product to check if the MRP, weight, and manufacturer details follow the law.'
                    : 'Upload multi-view photos or capture live camera images of Front, Back, and Side panels for automated LMPC 2011 compliance verification.'}
                </p>
              </div>

              {/* Quick Jump to latest audit report */}
              <button
                onClick={() => setCurrentTab('scanner')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F4EED4] hover:bg-[#EAE2C2] text-[#283618] font-bold text-xs transition-colors cursor-pointer border border-[#DDA15E]/50"
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
                <Sparkles className="w-4 h-4 text-[#BC6C25]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#283618]">
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
        {/* TAB 4: CLEAN COMPLIANCE AUDIT REPORT VIEW */}
        {/* ========================================================================= */}
        {currentTab === 'scanner' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Report Header & Action Bar */}
            <div className="bg-white border border-[#DDA15E]/50 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${
                  currentReport.overallStatus === 'COMPLIANT'
                    ? 'bg-[#F4EED4] text-[#283618] border border-[#606C38]'
                    : 'bg-red-50 text-red-700 border border-red-300'
                }`}>
                  {currentReport.overallStatus === 'COMPLIANT' ? (
                    <CheckCircle className="w-5 h-5 text-[#283618]" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#606C38]">
                      ID: {currentReport.id}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${
                      currentReport.overallStatus === 'COMPLIANT'
                        ? 'bg-[#283618] text-[#FEFAE0]'
                        : 'bg-red-600 text-white'
                    }`}>
                      {currentReport.overallStatus === 'COMPLIANT' ? 'Statutory Compliant' : 'Non-Compliant (Violations Detected)'}
                    </span>
                  </div>
                  <h2 className="text-base font-black text-[#283618] mt-0.5">
                    {currentReport.productInfo.productName || 'Inspected Packaged Commodity'}
                  </h2>
                </div>
              </div>

              {/* Action Buttons: New Scan / Upload & View Vault */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVaultOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F4EED4] hover:bg-[#EAE2C2] text-[#283618] font-bold text-xs transition-colors border border-[#DDA15E]/50 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5 text-[#283618]" />
                  <span>Stored Vault</span>
                </button>

                {userRole === 'MANUFACTURER' ? (
                  <button
                    onClick={() => setCurrentTab('manufacturer')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#BC6C25] hover:bg-[#96551d] text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>+ Test Another Artwork</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentTab('upload')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#283618] hover:bg-[#1c2610] text-[#FEFAE0] font-bold text-xs transition-all cursor-pointer shadow-xs"
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
                <div className="bg-white border border-[#DDA15E]/50 rounded-2xl p-4 text-xs text-[#606C38] shadow-xs space-y-2 transition-colors">
                  <div className="font-black text-[#283618] uppercase tracking-wider text-[11px] flex items-center justify-between">
                    <span>
                      {userRole === 'MANUFACTURER'
                        ? 'Manufacturer Pre-Pack Verification Protocol'
                        : 'Statutory Inspection Protocol'}
                    </span>
                    <span className="text-[#BC6C25] font-mono font-bold">
                      {userRole === 'MANUFACTURER' ? 'Pre-Printing Validation' : 'Fifth Schedule Sampling'}
                    </span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-[#1F2416]">
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
        {/* TAB 5: OFFICER ENFORCEMENT & ANALYTICS DASHBOARD */}
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
        {/* TAB 6: E-COMMERCE / DARK STORE AUDIT */}
        {/* ========================================================================= */}
        {currentTab === 'ecommerce' && (
          <EcommerceAuditTab onAuditSelected={handleSelectReportFromDossier} />
        )}

        {/* ========================================================================= */}
        {/* TAB 7: BRAND PRE-CHECK PORTAL (MANUFACTURER) */}
        {/* ========================================================================= */}
        {currentTab === 'manufacturer' && (
          <ManufacturerSelfAudit onLoadAudit={handleSelectReportFromDossier} />
        )}

        {/* ========================================================================= */}
        {/* TAB 8: NATIONAL SURVEILLANCE HUB (MINISTRY DIRECTORATE) */}
        {/* ========================================================================= */}
        {currentTab === 'surveillance' && (
          <NationalSurveillanceHub />
        )}

        {/* ========================================================================= */}
        {/* TAB 9: ADMINISTRATOR CONTROL CENTER (SOFTWARE/PLATFORM ADMIN) */}
        {/* ========================================================================= */}
        {currentTab === 'admin' && (
          <AdminControlCenter />
        )}

        {/* ========================================================================= */}
        {/* TAB 10: FULL-PAGE OFFICIAL LMPC 2011 RULEBOOK (43 PAGES) */}
        {/* ========================================================================= */}
        {currentTab === 'rulebook' && (
          <RulebookPage onBack={() => setCurrentTab('home')} />
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

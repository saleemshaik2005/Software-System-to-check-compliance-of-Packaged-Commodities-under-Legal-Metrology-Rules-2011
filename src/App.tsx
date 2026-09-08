import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DemoPresetSelector } from './components/DemoPresetSelector';
import { LiveCameraScanner } from './components/LiveCameraScanner';
import { EvidenceVisualizer } from './components/EvidenceVisualizer';
import { ComplianceScorecard } from './components/ComplianceScorecard';
import { RuleBreakdownCard } from './components/RuleBreakdownCard';
import { OfficerAnalyticsDashboard } from './components/OfficerAnalyticsDashboard';
import { EcommerceAuditTab } from './components/EcommerceAuditTab';
import { ManufacturerSelfAudit } from './components/ManufacturerSelfAudit';
import { AdminControlCenter } from './components/AdminControlCenter';
import { ConsumerGrievanceModal } from './components/ConsumerGrievanceModal';
import { CloudConfigModal } from './components/CloudConfigModal';
import { RulebookDrawer } from './components/RulebookDrawer';
import { LoginModal } from './components/LoginModal';
import { InspectionVaultModal } from './components/InspectionVaultModal';
import { Footer } from './components/Footer';
import { DEMO_PRESETS, DemoProductPreset } from './data/demoProducts';
import { evaluateCompliance } from './services/complianceEngine';
import { saveScanReport } from './services/dbService';
import { getCurrentUser, switchRole, logoutUser } from './services/authService';
import { ComplianceReport, UserRole, AuthUser } from './types';
import { Camera, Archive, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [userRole, setUserRole] = useState<UserRole>(() => currentUser?.role || 'CITIZEN');
  const [currentTab, setCurrentTab] = useState<'scanner' | 'upload' | 'analytics' | 'ecommerce' | 'manufacturer' | 'admin'>('scanner');
  const [activePresetId, setActivePresetId] = useState<string>('demo-amul-milk');
  const [activeView, setActiveView] = useState<'front' | 'back' | 'side'>('front');
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isRulebookOpen, setIsRulebookOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync dark mode class with root html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Initialize with the Slide 2 demo (Amul Taaza Milk)
  const [currentReport, setCurrentReport] = useState<ComplianceReport>(() => {
    const initialPreset = DEMO_PRESETS[0];
    const rep = evaluateCompliance(
      initialPreset.productInfo,
      'front',
      initialPreset.imageVisual,
      {
        name: currentUser?.name || 'Authorized Inspector',
        badge: currentUser?.badgeNumber || 'LM-ND-4092',
        location: 'Reliance Smart Bazaar, Connaught Place'
      }
    );
    rep.id = 'INSP-261001';
    return rep;
  });

  const handleSelectPreset = (preset: DemoProductPreset) => {
    setActivePresetId(preset.id);
    setActiveView('front');
    const rep = evaluateCompliance(
      preset.productInfo,
      'front',
      preset.imageVisual,
      {
        name: currentUser?.name || 'Authorized Inspector',
        badge: currentUser?.badgeNumber || 'LM-ND-4092',
        location: 'Supermarket Hub'
      }
    );
    rep.id = 'INSP-' + Math.floor(100000 + Math.random() * 900000);
    setCurrentReport(rep);
    saveScanReport(rep);
    // Transition to the clean audit report view
    setCurrentTab('scanner');
  };

  const handleScanComplete = (report: ComplianceReport) => {
    setActivePresetId('');
    setCurrentReport(report);
    saveScanReport(report);
    // Transition to the clean audit report view
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
    if (newRole === 'ADMIN') {
      setCurrentTab('admin');
    } else if (newRole === 'MANUFACTURER') {
      setCurrentTab('manufacturer');
    } else {
      setCurrentTab('scanner');
    }
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setUserRole(user.role);
    if (user.role === 'ADMIN') {
      setCurrentTab('admin');
    } else if (user.role === 'MANUFACTURER') {
      setCurrentTab('manufacturer');
    } else {
      setCurrentTab('scanner');
    }
  };

  const handleSignOut = () => {
    logoutUser();
    setCurrentUser(null);
    setUserRole('CITIZEN');
    setIsLoginOpen(true);
  };

  const currentImageSrc =
    currentReport.capturedImages?.[activeView] ||
    currentReport.capturedImages?.front ||
    DEMO_PRESETS[0].imageVisual.front;

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-[#00A651] selection:text-white ${
      isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
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
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* ========================================================================= */}
        {/* TAB 1: DEDICATED UPLOAD & SCAN STUDIO */}
        {/* ========================================================================= */}
        {currentTab === 'upload' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Studio Header */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-2 rounded-2xl bg-[#0A3663] text-white">
                    <Camera className="w-5 h-5" />
                  </span>
                  <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    Package Compliance Scan Studio
                  </h1>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload photos or snap live camera shots of Front, Back, and Side panels to perform automated LMPC 2011 compliance verification.
                </p>
              </div>

              {/* Quick Jump back to current report if exists */}
              <button
                onClick={() => setCurrentTab('scanner')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <span>View Latest Audit Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Live Camera Scanner Uploader Studio */}
            <LiveCameraScanner
              onScanComplete={handleScanComplete}
              activeView={activeView}
              setActiveView={setActiveView}
            />

            {/* FMCG Benchmark Demo Presets */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#00A651]" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
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
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
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
                  <h2 className="text-base font-black text-slate-900 dark:text-slate-100 mt-0.5">
                    {currentReport.productInfo.productName || 'Inspected Packaged Commodity'}
                  </h2>
                </div>
              </div>

              {/* Action Buttons: New Scan / Upload & View Vault */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVaultOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stored Vault</span>
                </button>

                <button
                  onClick={() => setCurrentTab('upload')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs transition-all cursor-pointer shadow-xs shadow-emerald-700/20"
                >
                  <Camera className="w-4 h-4" />
                  <span>+ Start New Scan / Upload</span>
                </button>
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
                />

                {/* Statutory Regulatory Context Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs text-slate-600 dark:text-slate-400 shadow-xs space-y-2 transition-colors">
                  <div className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] flex items-center justify-between">
                    <span>Statutory Inspection Protocol</span>
                    <span className="text-[#00A651] font-mono font-bold">Fifth Schedule Sampling</span>
                  </div>
                  <p className="leading-relaxed text-[11px]">
                    Inspection conducted under Section 15 of Legal Metrology Act, 2009. Sample size determined per Fifth Schedule Table (32 samples for lot &lt; 4000; 80 samples for lot &gt; 4000). Tare weight deducted per Sixth Schedule Part-II.
                  </p>
                </div>
              </div>

              {/* Right Column: Scorecard & Actions */}
              <div className="lg:col-span-6 space-y-6">
                <ComplianceScorecard
                  report={currentReport}
                  onOpenGrievanceModal={() => setIsGrievanceOpen(true)}
                />
              </div>
            </div>

            {/* Full Width: Comprehensive Rule Breakdown Card */}
            <RuleBreakdownCard evaluations={currentReport.evaluations} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: OFFICER ANALYTICS DASHBOARD */}
        {/* ========================================================================= */}
        {currentTab === 'analytics' && (
          <OfficerAnalyticsDashboard onSelectReport={handleSelectReportFromDossier} />
        )}

        {/* ========================================================================= */}
        {/* TAB 4: E-COMMERCE AUDIT */}
        {/* ========================================================================= */}
        {currentTab === 'ecommerce' && (
          <EcommerceAuditTab onAuditSelected={handleSelectReportFromDossier} />
        )}

        {/* ========================================================================= */}
        {/* TAB 5: BRAND PRE-CHECK PORTAL */}
        {/* ========================================================================= */}
        {currentTab === 'manufacturer' && (
          <ManufacturerSelfAudit onLoadAudit={handleSelectReportFromDossier} />
        )}

        {/* ========================================================================= */}
        {/* TAB 6: ADMINISTRATOR CONTROL CENTER */}
        {/* ========================================================================= */}
        {currentTab === 'admin' && (
          <AdminControlCenter />
        )}
      </main>

      {/* Modals & Overlays */}
      <ConsumerGrievanceModal
        isOpen={isGrievanceOpen}
        onClose={() => setIsGrievanceOpen(false)}
        report={currentReport}
      />

      <CloudConfigModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
      />

      <RulebookDrawer
        isOpen={isRulebookOpen}
        onClose={() => setIsRulebookOpen(false)}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenAdmin={() => setCurrentTab('admin')}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      <InspectionVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        onSelectReport={handleSelectReportFromDossier}
      />

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

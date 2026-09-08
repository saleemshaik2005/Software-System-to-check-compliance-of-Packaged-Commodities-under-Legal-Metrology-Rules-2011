import React, { useState } from 'react';
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
import { getCurrentUser, switchRole, logoutUser, TEST_ACCOUNTS } from './services/authService';
import { ComplianceReport, UserRole, AuthUser } from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser>(() => getCurrentUser());
  const [userRole, setUserRole] = useState<UserRole>(() => currentUser.role);
  const [currentTab, setCurrentTab] = useState<'scanner' | 'analytics' | 'ecommerce' | 'manufacturer' | 'admin'>('scanner');
  const [activePresetId, setActivePresetId] = useState<string>('demo-amul-milk');
  const [activeView, setActiveView] = useState<'front' | 'back' | 'side'>('front');
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isRulebookOpen, setIsRulebookOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize with the Slide 2 demo (Amul Taaza Milk)
  const [currentReport, setCurrentReport] = useState<ComplianceReport>(() => {
    const initialPreset = DEMO_PRESETS[0];
    const rep = evaluateCompliance(
      initialPreset.productInfo,
      'front',
      initialPreset.imageVisual,
      {
        name: currentUser.name,
        badge: currentUser.badgeNumber || 'LM-ND-4092',
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
        name: currentUser.name,
        badge: currentUser.badgeNumber || 'LM-ND-4092',
        location: 'Supermarket Hub'
      }
    );
    rep.id = 'INSP-' + Math.floor(100000 + Math.random() * 900000);
    setCurrentReport(rep);
    saveScanReport(rep);
  };

  const handleScanComplete = (report: ComplianceReport) => {
    setActivePresetId('');
    setCurrentReport(report);
    saveScanReport(report);
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
    setCurrentUser(TEST_ACCOUNTS.CITIZEN);
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
        {/* Presets bar always accessible at top of scanner view */}
        {currentTab === 'scanner' && (
          <DemoPresetSelector
            onSelectPreset={handleSelectPreset}
            activePresetId={activePresetId}
          />
        )}

        {/* Tab 1: Scanner View */}
        {currentTab === 'scanner' && (
          <div className="space-y-6">
            {/* Live Camera & Image Input Trigger */}
            <LiveCameraScanner
              onScanComplete={handleScanComplete}
              activeView={activeView}
              setActiveView={setActiveView}
            />

            {/* Two Column Layout: Evidence Visualizer (Left) and Scorecard/Breakdown (Right) */}
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
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 shadow-sm space-y-2">
                  <div className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center justify-between">
                    <span>Inspection Protocol Reference</span>
                    <span className="text-[#00A651] font-mono font-bold">Fifth Schedule Sampling</span>
                  </div>
                  <p className="leading-relaxed">
                    Inspection conducted under Section 15 of Legal Metrology Act, 2009. Sample size determined per Fifth Schedule Table (32 samples for lot &lt; 4000; 80 samples for lot &gt; 4000). Tare weight deducted per Sixth Schedule Part-II.
                  </p>
                </div>
              </div>

              {/* Right Column: Scorecard & Legal Metrology Breakdown */}
              <div className="lg:col-span-6 space-y-6">
                <ComplianceScorecard
                  report={currentReport}
                  onOpenGrievanceModal={() => setIsGrievanceOpen(true)}
                />

                <RuleBreakdownCard evaluations={currentReport.evaluations} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Officer Analytics Dashboard */}
        {currentTab === 'analytics' && (
          <OfficerAnalyticsDashboard onSelectReport={handleSelectReportFromDossier} />
        )}

        {/* Tab 3: E-Commerce Audit */}
        {currentTab === 'ecommerce' && (
          <EcommerceAuditTab onAuditSelected={handleSelectReportFromDossier} />
        )}

        {/* Tab 4: Manufacturer Pre-Audit */}
        {currentTab === 'manufacturer' && (
          <ManufacturerSelfAudit onLoadAudit={handleSelectReportFromDossier} />
        )}

        {/* Tab 5: Administrator Control Center */}
        {currentTab === 'admin' && (
          <AdminControlCenter />
        )}
      </main>

      {/* Consumer Grievance Modal */}
      <ConsumerGrievanceModal
        isOpen={isGrievanceOpen}
        onClose={() => setIsGrievanceOpen(false)}
        report={currentReport}
      />

      {/* Cloud Database & CDN Status Modal */}
      <CloudConfigModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
      />

      {/* Legal Metrology Rulebook Reference */}
      <RulebookDrawer
        isOpen={isRulebookOpen}
        onClose={() => setIsRulebookOpen(false)}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenAdmin={() => setCurrentTab('admin')}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Stored Regulatory Inspection Vault Modal */}
      <InspectionVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        onSelectReport={handleSelectReportFromDossier}
      />

      {/* Authentication & 1-Click Test Accounts Modal */}
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

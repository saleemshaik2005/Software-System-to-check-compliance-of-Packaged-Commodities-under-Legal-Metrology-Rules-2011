import React, { useState } from 'react';
import {
  Shield,
  User,
  KeyRound,
  Trash2,
  LogOut,
  Building2,
  ShoppingBag,
  Radio,
  Sliders,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { UserRole, AuthUser, Language } from '../types';
import { getCurrentUser, switchRole } from '../services/authService';
import { purgeAllDatabaseData, getScanReports } from '../services/dbService';
import { getTranslation } from '../services/i18nService';

interface ProfilePageProps {
  onBack: () => void;
  onSwitchRole: (role: UserRole) => void;
  onSignOut: () => void;
  currentLang?: Language;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onBack,
  onSwitchRole,
  onSignOut,
  currentLang = 'en',
}) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [purgeStatus, setPurgeStatus] = useState<string | null>(null);
  const [isPurging, setIsPurging] = useState(false);

  const role = currentUser?.role || 'OFFICER';

  const handleRoleChange = (newRole: UserRole) => {
    const updated = switchRole(newRole);
    setCurrentUser(updated);
    onSwitchRole(newRole);
  };

  const handlePurgeAll = async () => {
    if (!window.confirm('Are you sure you want to completely purge all local and cloud database records? This action cannot be undone.')) {
      return;
    }
    setIsPurging(true);
    setPurgeStatus('Purging all local & Firestore cloud data...');
    try {
      await purgeAllDatabaseData();
      setPurgeStatus('Database successfully wiped! Total items: 0');
    } catch (err) {
      setPurgeStatus('Error purging database.');
    } finally {
      setIsPurging(false);
      setTimeout(() => setPurgeStatus(null), 4000);
    }
  };

  const getRoleSpecificDetails = () => {
    switch (role) {
      case 'OFFICER':
        return {
          designation: 'Legal Metrology Inspector (Senior Grade)',
          jurisdiction: 'Zone 4, New Delhi Central & NCR Retail Corridors',
          gazetteAuthority: 'Section 15, Legal Metrology Act 2009',
          statutoryPowers: [
            'Search, seizure, and sampling of packaged commodities in commercial premises (Section 15)',
            'Inspection of warehouse pallets, dark stores, and retail display shelves (Fifth Schedule)',
            'Issuance of statutory compounding notices and compounding fee imposition (Section 36 & 48)',
            'Seizure of non-conforming lots with counterfeit declarations or missing MRP / Expiry'
          ],
          samplingStandard: 'Fifth Schedule Table (32 samples for lot < 4000; 80 samples for lot > 4000)',
          badgeColor: 'bg-[#283618] text-[#FEFAE0]',
        };
      case 'CITIZEN':
        return {
          designation: 'Consumer / Citizen Verifier',
          jurisdiction: 'All India Retail & E-Commerce Purchases',
          gazetteAuthority: 'Consumer Protection Act, 2019 & Rule 6 of LMPC Rules, 2011',
          statutoryPowers: [
            'Right to accurate Net Quantity and standard unit sale price (USP)',
            'Direct electronic grievance filing with National Consumer Helpline (NCH 1915)',
            'Verification of authentic packaging declarations and dark store price surge checks',
            'Reporting unfair trade practices and dual MRP violations directly to authorities'
          ],
          samplingStandard: 'Instant single-product verification or receipt reconciliation',
          badgeColor: 'bg-[#606C38] text-[#FEFAE0]',
        };
      case 'MANUFACTURER':
        return {
          designation: 'Packer / Brand Quality Assurance Director',
          jurisdiction: 'Plant Operations, Packaging Production & Distribution',
          gazetteAuthority: 'Legal Metrology (Packaged Commodities) Rules, 2011 (Chapter II)',
          statutoryPowers: [
            'Pre-market artwork compliance validation prior to printing packaging runs',
            'Verification of minimum numeral height per Table I under Rule 7',
            'Compliance with mandatory standard sizes prescribed under Second Schedule',
            'Verification of packer declarations, customer care contact details, and QR codes'
          ],
          samplingStandard: 'Sixth Schedule Maximum Permissible Error (MPE) tolerances',
          badgeColor: 'bg-[#BC6C25] text-white',
        };
      case 'SURVEILLANCE':
        return {
          designation: 'National Metrology Surveillance Officer',
          jurisdiction: 'Nationwide Surveillance Directorate, Ministry of Consumer Affairs',
          gazetteAuthority: 'Central Enforcement Directorate & GSR 748(E)',
          statutoryPowers: [
            'State-wide seizure tracking and macro compliance indexing',
            'Automated quick-commerce platform scanning (Zepto, Blinkit, Instamart)',
            'Repeat offender tracking and nationwide gazette enforcement coordination',
            'Central repository oversight and cross-state prosecution reporting'
          ],
          samplingStandard: 'Algorithmic dark store sampling and nationwide statistical audit',
          badgeColor: 'bg-[#283618] text-[#DDA15E]',
        };
      case 'ADMIN':
        return {
          designation: 'Platform Administrator & Technical Controller',
          jurisdiction: 'System-Wide Infrastructure, Rules Tuning & Security',
          gazetteAuthority: 'Ministry IT Operations & Smart India Hackathon 2026 Admin Portal',
          statutoryPowers: [
            'Platform-wide fine tuning, compounding slabs, and gazette amendment updates',
            'Cloud Firestore sync oversight and full JSON database dump extraction',
            'OCR accuracy calibration and Table I numeral threshold adjustment',
            'Complete database purge and fresh environment seeding'
          ],
          samplingStandard: '100% Platform logging & distributed transaction audit',
          badgeColor: 'bg-[#606C38] text-white',
        };
    }
  };

  const details = getRoleSpecificDetails();
  const currentTotalScans = getScanReports().length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white border border-[#DDA15E]/50 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#283618] text-[#FEFAE0] flex items-center justify-center font-black text-2xl shadow-md border border-[#606C38]">
            {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-[#283618] tracking-tight">
                {currentUser?.name || 'Official User'}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${details.badgeColor}`}>
                {role}
              </span>
            </div>
            <p className="text-xs font-mono text-[#606C38] mt-0.5">
              {currentUser?.email || 'officer@lm.gov.in'}
            </p>
            <p className="text-xs text-[#BC6C25] font-bold mt-1">
              Badge / ID: {currentUser?.badgeNumber || 'LM-2026-IND-01'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-[#F4EED4] hover:bg-[#EAE2C2] text-[#283618] text-xs font-black transition-colors cursor-pointer border border-[#DDA15E]/50"
          >
            ← Back to Home
          </button>
          <button
            onClick={onSignOut}
            className="px-4 py-2 rounded-xl bg-[#BC6C25] hover:bg-[#96551d] text-white text-xs font-black transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Grid: Credentials & Statutory Powers */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Official Profile Details */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white border border-[#DDA15E]/50 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#DDA15E]/30 pb-3">
              <Shield className="w-5 h-5 text-[#283618]" />
              <h2 className="text-base font-black text-[#283618]">
                Official Credentials & Legal Jurisdiction
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-[#606C38] block uppercase text-[10px]">Official Designation</span>
                <span className="font-black text-[#283618] text-sm">{details.designation}</span>
              </div>

              <div>
                <span className="font-bold text-[#606C38] block uppercase text-[10px]">Operating Jurisdiction</span>
                <span className="font-bold text-[#283618]">{details.jurisdiction}</span>
              </div>

              <div>
                <span className="font-bold text-[#606C38] block uppercase text-[10px]">Legal Empowering Act</span>
                <span className="font-mono font-bold text-[#BC6C25]">{details.gazetteAuthority}</span>
              </div>

              <div>
                <span className="font-bold text-[#606C38] block uppercase text-[10px]">Sampling & Verification Standard</span>
                <span className="font-medium text-[#1F2416]">{details.samplingStandard}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDA15E]/30">
              <span className="font-bold text-[#606C38] block uppercase text-[10px] mb-2">
                Statutory Authorities & Operational Scope
              </span>
              <ul className="space-y-1.5">
                {details.statutoryPowers.map((power, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#1F2416]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#606C38] shrink-0 mt-0.5" />
                    <span>{power}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Fast Role Switcher & Database Reset */}
        <div className="md:col-span-5 space-y-6">
          {/* Quick Role Switcher Card */}
          <div className="bg-white border border-[#DDA15E]/50 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#DDA15E]/30 pb-3">
              <KeyRound className="w-5 h-5 text-[#BC6C25]" />
              <h2 className="text-base font-black text-[#283618]">
                Switch Active Role
              </h2>
            </div>

            <p className="text-xs text-[#606C38]">
              Switch into any of the 5 functional role portals to test role-specific workflows and access privileges.
            </p>

            <div className="space-y-2">
              {(['OFFICER', 'CITIZEN', 'MANUFACTURER', 'SURVEILLANCE', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`w-full p-2.5 rounded-xl text-xs font-black text-left flex items-center justify-between transition-all cursor-pointer ${
                    role === r
                      ? 'bg-[#283618] text-[#FEFAE0] shadow-sm'
                      : 'bg-[#F4EED4]/60 hover:bg-[#EAE2C2] text-[#283618] border border-[#DDA15E]/40'
                  }`}
                >
                  <span className="capitalize">{r}</span>
                  {role === r ? (
                    <span className="text-[10px] bg-[#606C38] text-[#FEFAE0] px-2 py-0.5 rounded-full">ACTIVE</span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Database & Storage Management */}
          <div className="bg-white border border-[#DDA15E]/50 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-[#DDA15E]/30 pb-3">
              <Trash2 className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-black text-red-700">
                Database & Cache Management
              </h2>
            </div>

            <p className="text-xs text-[#606C38] leading-relaxed">
              Currently stored scan certificates: <span className="font-bold text-[#283618]">{currentTotalScans}</span>.
              Use this option to clear all local inspection records and synchronize with a 100% clean, empty database.
            </p>

            {purgeStatus && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold animate-pulse">
                {purgeStatus}
              </div>
            )}

            <button
              onClick={handlePurgeAll}
              disabled={isPurging}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isPurging ? 'Purging...' : 'Purge All Database Records'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

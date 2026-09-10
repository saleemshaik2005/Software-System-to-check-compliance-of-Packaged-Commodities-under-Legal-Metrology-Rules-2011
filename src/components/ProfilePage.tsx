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
    setPurgeStatus('Purging all local records...');
    try {
      await purgeAllDatabaseData();
      setPurgeStatus('Database successfully reset to a clean state! Total items: 0');
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
          badgeColor: 'bg-[#CCD5AE] text-[#6B705C] border-[#B7B7A4]',
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
          badgeColor: 'bg-[#E9EDC9] text-[#6B705C] border-[#CCD5AE]',
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
          badgeColor: 'bg-[#CB997E] text-white border-[#DDBEA9]',
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
          badgeColor: 'bg-[#D4A373] text-white border-[#DDBEA9]',
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
          badgeColor: 'bg-[#B7B7A4] text-[#6B705C] border-[#A5A58D]',
        };
    }
  };

  const details = getRoleSpecificDetails();
  const currentTotalScans = getScanReports().length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Header Card in Warm Sand & White */}
      <div className="bg-[#FFFFFF] border border-[#DDBEA9] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FAEDCD] text-[#D4A373] flex items-center justify-center font-black text-2xl shadow-2xs border border-[#DDBEA9]">
            {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-[#6B705C] tracking-tight">
                {currentUser?.name || 'Official User'}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${details.badgeColor}`}>
                {role}
              </span>
            </div>
            <p className="text-xs font-mono text-[#A5A58D] mt-0.5">
              {currentUser?.email || 'officer@lm.gov.in'}
            </p>
            <p className="text-xs text-[#CB997E] font-bold mt-1">
              Badge / ID: {currentUser?.badgeNumber || 'LM-2026-IND-01'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-[#FAEDCD] hover:bg-[#E9EDC9] text-[#6B705C] text-xs font-black transition-colors cursor-pointer border border-[#DDBEA9]"
          >
            ← Back to Home
          </button>
          <button
            onClick={onSignOut}
            className="px-4 py-2 rounded-xl bg-[#CB997E] hover:bg-[#D4A373] text-white text-xs font-black transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
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
          <div className="bg-[#FFFFFF] border border-[#DDBEA9] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#DDBEA9]/40 pb-3">
              <Shield className="w-5 h-5 text-[#D4A373]" />
              <h2 className="text-base font-black text-[#6B705C]">
                Official Credentials & Legal Jurisdiction
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-[#A5A58D] block uppercase text-[10px]">Official Designation</span>
                <span className="font-black text-[#6B705C] text-sm">{details.designation}</span>
              </div>

              <div>
                <span className="font-bold text-[#A5A58D] block uppercase text-[10px]">Operating Jurisdiction</span>
                <span className="font-bold text-[#6B705C]">{details.jurisdiction}</span>
              </div>

              <div>
                <span className="font-bold text-[#A5A58D] block uppercase text-[10px]">Legal Empowering Act</span>
                <span className="font-mono font-bold text-[#CB997E]">{details.gazetteAuthority}</span>
              </div>

              <div>
                <span className="font-bold text-[#A5A58D] block uppercase text-[10px]">Sampling & Verification Standard</span>
                <span className="font-medium text-[#6B705C]">{details.samplingStandard}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDBEA9]/40">
              <span className="font-bold text-[#A5A58D] block uppercase text-[10px] mb-2">
                Statutory Authorities & Operational Scope
              </span>
              <ul className="space-y-1.5">
                {details.statutoryPowers.map((power, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#6B705C]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#D4A373] shrink-0 mt-0.5" />
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
          <div className="bg-[#FFFFFF] border border-[#DDBEA9] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#DDBEA9]/40 pb-3">
              <KeyRound className="w-5 h-5 text-[#CB997E]" />
              <h2 className="text-base font-black text-[#6B705C]">
                Switch Active Role
              </h2>
            </div>

            <p className="text-xs text-[#A5A58D]">
              Switch into any of the 5 functional role portals to test role-specific workflows and access privileges.
            </p>

            <div className="space-y-2">
              {(['OFFICER', 'CITIZEN', 'MANUFACTURER', 'SURVEILLANCE', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`w-full p-2.5 rounded-xl text-xs font-black text-left flex items-center justify-between transition-all cursor-pointer ${
                    role === r
                      ? 'bg-[#D4A373] text-white shadow-2xs'
                      : 'bg-[#FAEDCD]/50 hover:bg-[#E9EDC9] text-[#6B705C] border border-[#DDBEA9]'
                  }`}
                >
                  <span className="capitalize">{r}</span>
                  {role === r ? (
                    <span className="text-[10px] bg-[#CCD5AE] text-[#6B705C] px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-60 text-[#A5A58D]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Database & Storage Management */}
          <div className="bg-[#FFFFFF] border border-[#DDBEA9] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-[#DDBEA9]/40 pb-3">
              <Trash2 className="w-5 h-5 text-[#CB997E]" />
              <h2 className="text-base font-black text-[#CB997E]">
                Database & Cache Management
              </h2>
            </div>

            <p className="text-xs text-[#A5A58D] leading-relaxed">
              Currently stored scan certificates: <span className="font-bold text-[#6B705C]">{currentTotalScans}</span>.
              Use this option to clear all local inspection records and synchronize with a 100% clean, empty database.
            </p>

            {purgeStatus && (
              <div className="p-2.5 rounded-xl bg-[#FAEDCD] border border-[#DDBEA9] text-[#6B705C] text-xs font-bold animate-pulse">
                {purgeStatus}
              </div>
            )}

            <button
              onClick={handlePurgeAll}
              disabled={isPurging}
              className="w-full py-2.5 px-4 rounded-xl bg-[#CB997E] hover:bg-[#D4A373] text-white font-black text-xs transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2"
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

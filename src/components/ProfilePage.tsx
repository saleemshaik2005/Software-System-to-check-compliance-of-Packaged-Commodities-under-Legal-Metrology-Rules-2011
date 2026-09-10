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
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
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
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
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
          badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
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
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
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
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
        };
    }
  };

  const details = getRoleSpecificDetails();
  const currentTotalScans = getScanReports().length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl shadow-2xs border border-blue-100">
            {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {currentUser?.name || 'Official User'}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${details.badgeColor}`}>
                {role}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              {currentUser?.email || 'officer@lm.gov.in'}
            </p>
            <p className="text-xs text-blue-600 font-medium mt-1">
              Badge / ID: {currentUser?.badgeNumber || 'LM-2026-IND-01'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
          >
            ← Back to Home
          </button>
          <button
            onClick={onSignOut}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                Official Credentials & Legal Jurisdiction
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-400 block uppercase text-[10px]">Official Designation</span>
                <span className="font-bold text-slate-800 text-sm">{details.designation}</span>
              </div>

              <div>
                <span className="font-semibold text-slate-400 block uppercase text-[10px]">Operating Jurisdiction</span>
                <span className="font-medium text-slate-700">{details.jurisdiction}</span>
              </div>

              <div>
                <span className="font-semibold text-slate-400 block uppercase text-[10px]">Legal Empowering Act</span>
                <span className="font-mono font-medium text-blue-600">{details.gazetteAuthority}</span>
              </div>

              <div>
                <span className="font-semibold text-slate-400 block uppercase text-[10px]">Sampling & Verification Standard</span>
                <span className="font-medium text-slate-700">{details.samplingStandard}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="font-semibold text-slate-400 block uppercase text-[10px] mb-2">
                Statutory Authorities & Operational Scope
              </span>
              <ul className="space-y-1.5">
                {details.statutoryPowers.map((power, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <KeyRound className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                Switch Active Role
              </h2>
            </div>

            <p className="text-xs text-slate-500">
              Switch into any of the 5 functional role portals to test role-specific workflows and access privileges.
            </p>

            <div className="space-y-2">
              {(['OFFICER', 'CITIZEN', 'MANUFACTURER', 'SURVEILLANCE', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between transition-all cursor-pointer ${
                    role === r
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span className="capitalize">{r}</span>
                  {role === r ? (
                    <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-60 text-slate-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Database & Storage Management */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Trash2 className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-bold text-rose-600">
                Database & Cache Management
              </h2>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Currently stored scan certificates: <span className="font-bold text-slate-800">{currentTotalScans}</span>.
              Use this option to clear all local inspection records and synchronize with a 100% clean, empty database.
            </p>

            {purgeStatus && (
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium animate-pulse">
                {purgeStatus}
              </div>
            )}

            <button
              onClick={handlePurgeAll}
              disabled={isPurging}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2"
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

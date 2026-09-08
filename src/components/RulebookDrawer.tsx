import React, { useState } from 'react';
import { AuthUser, UserRole } from '../types';
import { LMPC_RULES, LMPCRuleDefinition } from '../data/lmpcRules2011';
import { STANDARD_PACK_RULES } from '../data/standardPackSizes';
import {
  X,
  BookOpen,
  Scale,
  Shield,
  Search,
  ExternalLink,
  ChevronRight,
  User,
  Settings,
  Cloud,
  CheckCircle2,
  AlertOctagon,
  LogOut,
  PhoneCall,
  Lock
} from 'lucide-react';

interface RulebookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onSwitchRole: (role: UserRole) => void;
  onOpenAdmin?: () => void;
  onOpenCloudModal?: () => void;
  onOpenLogin?: () => void;
}

export const RulebookDrawer: React.FC<RulebookDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchRole,
  onOpenAdmin,
  onOpenCloudModal,
  onOpenLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'packs' | 'contacts'>('rules');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRule, setExpandedRule] = useState<string | null>('RULE_6_1_A');

  if (!isOpen) return null;

  const filteredRules: LMPCRuleDefinition[] = LMPC_RULES.filter(
    (r: LMPCRuleDefinition) =>
      r.ruleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md md:max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#0A2540] text-white p-4 border-b border-blue-950 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#00A651] text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                  <span>LMPC 2011 Rulebook</span>
                  <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                    Gazette
                  </span>
                </h2>
                <p className="text-[11px] text-blue-200">
                  Legal Metrology (Packaged Commodities) Rules, 2011 Reference
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current User & Role Quick Switcher Strip */}
          <div className="bg-blue-950/60 p-2.5 rounded-xl border border-blue-900/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#00A651] text-white font-bold flex items-center justify-center text-xs">
                {currentUser?.name ? currentUser.name.charAt(0) : 'G'}
              </div>
              <div>
                <div className="font-bold text-white leading-none">
                  {currentUser?.name || 'Guest User'}
                </div>
                <div className="text-[10px] text-emerald-300 mt-0.5 font-mono">
                  Role: {currentUser?.role || 'CITIZEN'} {currentUser?.badgeNumber ? `• ${currentUser.badgeNumber}` : ''}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onOpenLogin && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="px-2 py-1 bg-blue-900 hover:bg-blue-800 text-blue-100 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                >
                  Switch Account
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('rules')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'border-[#00A651] text-[#00A651]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Statutory Rules ({LMPC_RULES.length})
          </button>
          <button
            onClick={() => setActiveTab('packs')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'packs'
                ? 'border-[#00A651] text-[#00A651]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Standard Pack Sizes
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'contacts'
                ? 'border-[#00A651] text-[#00A651]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Acts & Helplines
          </button>
        </div>

        {/* Tab 1: Rules Directory */}
        {activeTab === 'rules' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search rules, PIN code, MRP, units, fines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                />
              </div>
            </div>

            {/* Rules List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredRules.map((rule) => {
                const isExpanded = expandedRule === rule.id;
                return (
                  <div
                    key={rule.id}
                    className="border border-slate-200 rounded-2xl p-3 bg-white shadow-xs hover:border-slate-300 transition-all"
                  >
                    <div
                      onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                      className="flex items-start justify-between gap-2 cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[11px] text-[#0A3663] bg-blue-50 px-2 py-0.5 rounded-md">
                            {rule.ruleNumber}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            Gazette p.{rule.gazettePage}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 mt-1">
                          {rule.title}
                        </h4>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-slate-400 shrink-0 transform transition-transform mt-1 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-2 text-slate-600 animate-in fade-in duration-150">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            Statutory Requirement:
                          </span>
                          <p className="text-slate-800 font-medium leading-relaxed">
                            {rule.description}
                          </p>
                        </div>

                        {rule.mandatoryFields && rule.mandatoryFields.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                              Required Declarations:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rule.mandatoryFields.map(f => (
                                <span key={f} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <span className="font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                            Penalty: {rule.legalSection}
                          </span>
                          <span className="font-bold text-red-600">
                            ₹{rule.statutoryFine.toLocaleString('en-IN')} Fine
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Standard Pack Sizes */}
        {activeTab === 'packs' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
              <span className="font-bold block">The Second Schedule (Rule 5)</span>
              <span>
                Mandates standardized packaging quantities for 19 designated commodities to prevent non-standard fractional shrinkage cheating.
              </span>
            </div>

            <div className="space-y-2">
              {STANDARD_PACK_RULES.map((sp) => (
                <div key={sp.category} className="border border-slate-200 rounded-xl p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      {sp.scheduleItemNo}. {sp.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      Unit: {sp.allowedSizes.unit}
                    </span>
                  </div>

                  {sp.allowedSizes.exactValues && (
                    <div className="mt-2 text-xs text-slate-600">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Permissible Sizes:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {sp.allowedSizes.exactValues.map((val) => (
                          <span key={val} className="px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-mono text-slate-800">
                            {val}{sp.allowedSizes.unit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {sp.allowedSizes.specialRules && (
                    <div className="mt-2 text-[11px] text-slate-500 italic">
                      {sp.allowedSizes.specialRules}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Helplines & Acts */}
        {activeTab === 'contacts' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
              <div className="flex items-center gap-2 font-black text-slate-900">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>National Consumer Helpline (NCH)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Toll-free consumer grievance registration under Department of Consumer Affairs.
              </p>
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 font-mono font-bold">
                <span>Toll Free Number:</span>
                <span className="text-[#00A651] text-sm">1915</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
              <span className="font-bold text-slate-900 block">The Legal Metrology Act, 2009</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed text-[11px]">
                <li><strong>Section 15</strong>: Power of inspection, search and seizure of non-compliant packaged commodities.</li>
                <li><strong>Section 18</strong>: Mandatory packaging, marking, and labeling provisions.</li>
                <li><strong>Section 36</strong>: Penalty for manufacture, packaging, or sale of non-standard commodities (up to ₹25,000 for first offence).</li>
                <li><strong>Section 48</strong>: Compounding of offences by Authorized Officers without court prosecution.</li>
              </ul>
            </div>

            {/* Admin Access Button for authorized users */}
            {currentUser?.role === 'ADMIN' && onOpenAdmin && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#0A3663] text-white py-2.5 rounded-xl font-bold hover:bg-blue-900 transition-all cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Open Administrator Control Center</span>
              </button>
            )}

          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            Inspack v2.6 • PS ID: SIH-26034
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

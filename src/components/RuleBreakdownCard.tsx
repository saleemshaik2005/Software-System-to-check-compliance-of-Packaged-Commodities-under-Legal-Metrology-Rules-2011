import React, { useState } from 'react';
import { RuleEvaluation, RuleStatus } from '../types';
import {
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Scale,
  ShieldAlert,
  FileCheck,
  HelpCircle
} from 'lucide-react';

interface RuleBreakdownCardProps {
  evaluations: RuleEvaluation[];
}

export const RuleBreakdownCard: React.FC<RuleBreakdownCardProps> = ({ evaluations }) => {
  const [filter, setFilter] = useState<'ALL' | 'FAIL' | 'WARNING' | 'PASS'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(evaluations[0]?.ruleId || null);

  const filtered = evaluations.filter((e) => {
    if (filter === 'ALL') return true;
    return e.status === filter;
  });

  const failsCount = evaluations.filter(e => e.status === 'FAIL').length;
  const warningsCount = evaluations.filter(e => e.status === 'WARNING').length;
  const passCount = evaluations.filter(e => e.status === 'PASS').length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
      {/* Header & Category Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-cyan-400" />
            <span>Legal Metrology (Packaged Commodities) Rules 2011 Audit</span>
          </h3>
          <p className="text-xs text-slate-400">
            Rule-by-rule statutory compliance breakdown with gazette legal citations
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'ALL'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({evaluations.length})
          </button>
          <button
            onClick={() => setFilter('FAIL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              filter === 'FAIL'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-red-400 hover:bg-red-950/40'
            }`}
          >
            <AlertOctagon className="w-3 h-3" />
            <span>Violations ({failsCount})</span>
          </button>
          <button
            onClick={() => setFilter('WARNING')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              filter === 'WARNING'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-400 hover:bg-amber-950/40'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Warnings ({warningsCount})</span>
          </button>
          <button
            onClick={() => setFilter('PASS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              filter === 'PASS'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-400 hover:bg-emerald-950/40'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Compliant ({passCount})</span>
          </button>
        </div>
      </div>

      {/* Accordion Rule List */}
      <div className="space-y-2.5">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.ruleId;
          const isFail = item.status === 'FAIL';
          const isWarn = item.status === 'WARNING';
          const isPass = item.status === 'PASS';

          return (
            <div
              key={item.ruleId}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isFail
                  ? 'bg-red-950/15 border-red-900/60'
                  : isWarn
                  ? 'bg-amber-950/15 border-amber-900/60'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Header row */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.ruleId)}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">
                    {isPass && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {isWarn && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                    {isFail && <AlertOctagon className="w-5 h-5 text-red-500" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono font-bold text-cyan-300">
                        {item.ruleNumber}
                      </span>
                      <span className="text-[10px] text-slate-500">•</span>
                      <span className="text-[10px] text-slate-400">Gazette p. {item.gazettePage}</span>
                      {item.compoundingFine > 0 && (
                        <span className="text-[10px] font-bold text-red-400 bg-red-950 px-1.5 py-0.2 rounded border border-red-900">
                          Fine: ₹{item.compoundingFine.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white truncate">
                      {item.ruleTitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isPass
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : isWarn
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    {item.status}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 bg-slate-950/60 text-xs space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Detected on Scanned Package
                      </span>
                      <span className="text-slate-200 font-mono text-[11px] leading-relaxed">
                        {item.detectedValue}
                      </span>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                        Mandatory Legal Requirement
                      </span>
                      <span className="text-slate-200 text-[11px] leading-relaxed">
                        {item.requiredStandard}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-blue-400 block">
                          Legal Metrology Analysis & Explanation
                        </span>
                        <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>
                      Statutory Reference: <strong className="text-slate-300">{item.legalReference}</strong>
                    </span>
                    <span>
                      Enforcement: <strong className="text-amber-400">{item.penaltySection}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-xs">
            No rules matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};

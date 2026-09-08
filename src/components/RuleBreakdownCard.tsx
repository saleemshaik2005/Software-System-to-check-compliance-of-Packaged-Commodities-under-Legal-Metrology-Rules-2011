import React, { useState } from 'react';
import { RuleEvaluation } from '../types';
import {
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Scale,
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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      {/* Header & Category Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-4">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#0A3663]" />
            <span>Legal Metrology (Packaged Commodities) Rules 2011 Audit</span>
          </h3>
          <p className="text-xs text-slate-500">
            Rule-by-rule statutory compliance breakdown with gazette legal citations
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({evaluations.length})
          </button>
          <button
            onClick={() => setFilter('FAIL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
              filter === 'FAIL'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-red-700 hover:bg-red-100'
            }`}
          >
            <AlertOctagon className="w-3 h-3" />
            <span>Violations ({failsCount})</span>
          </button>
          <button
            onClick={() => setFilter('WARNING')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
              filter === 'WARNING'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Warnings ({warningsCount})</span>
          </button>
          <button
            onClick={() => setFilter('PASS')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
              filter === 'PASS'
                ? 'bg-[#00A651] text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-100'
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
                  ? 'bg-red-50/50 border-red-200'
                  : isWarn
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header row */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.ruleId)}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">
                    {isPass && <CheckCircle2 className="w-5 h-5 text-[#00A651]" />}
                    {isWarn && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                    {isFail && <AlertOctagon className="w-5 h-5 text-red-600" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono font-black text-[#0A3663]">
                        {item.ruleNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[10px] text-slate-500 font-medium">Gazette p. {item.gazettePage}</span>
                      {item.compoundingFine > 0 && (
                        <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded border border-red-300">
                          Fine: ₹{item.compoundingFine.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.ruleTitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isPass
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isWarn
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {item.status}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-200 bg-white text-xs space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                        Detected on Scanned Package
                      </span>
                      <span className="text-slate-800 font-mono text-[11px] leading-relaxed font-semibold">
                        {item.detectedValue}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-[#0A3663] block mb-1">
                        Mandatory Legal Requirement
                      </span>
                      <span className="text-slate-800 text-[11px] leading-relaxed">
                        {item.requiredStandard}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50/60 p-2.5 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-[#0A3663] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#0A3663] block">
                          Legal Metrology Analysis & Explanation
                        </span>
                        <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>
                      Statutory Reference: <strong className="text-slate-700">{item.legalReference}</strong>
                    </span>
                    <span>
                      Enforcement: <strong className="text-amber-800">{item.penaltySection}</strong>
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

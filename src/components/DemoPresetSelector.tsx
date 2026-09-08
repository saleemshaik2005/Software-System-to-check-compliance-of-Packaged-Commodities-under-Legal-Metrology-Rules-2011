import React from 'react';
import { DEMO_PRESETS, DemoProductPreset } from '../data/demoProducts';
import { Sparkles, CheckCircle2, AlertOctagon, Scale } from 'lucide-react';

interface DemoPresetSelectorProps {
  onSelectPreset: (preset: DemoProductPreset) => void;
  activePresetId?: string;
}

export const DemoPresetSelector: React.FC<DemoPresetSelectorProps> = ({
  onSelectPreset,
  activePresetId,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">
            Live Hackathon Evaluator Presets
          </h3>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
            1-Click Presentation Tests
          </span>
        </div>
        <div className="text-xs text-slate-400 hidden sm:block">
          Select pre-loaded package scans for instant live verification
        </div>
      </div>

      {/* Grid of Preset Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEMO_PRESETS.map((preset) => {
          const isSelected = activePresetId === preset.id;
          const isCompliant = preset.expectedResult === 'COMPLIANT';

          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    {preset.badge}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                      isCompliant
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {isCompliant ? (
                      <>
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Score: {preset.expectedScore}%</span>
                      </>
                    ) : (
                      <>
                        <AlertOctagon className="w-2.5 h-2.5" />
                        <span>Score: {preset.expectedScore}%</span>
                      </>
                    )}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white leading-tight mb-1 truncate">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {preset.subtitle}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span className="truncate">{preset.categoryDisplay}</span>
                <span className="text-cyan-400 font-semibold group-hover:underline">Test Demo →</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

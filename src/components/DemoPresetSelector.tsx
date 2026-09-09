import React from 'react';
import { DEMO_PRESETS, DemoProductPreset } from '../data/demoProducts';
import { Sparkles, CheckCircle2, AlertOctagon } from 'lucide-react';

interface DemoPresetSelectorProps {
  onSelectPreset: (preset: DemoProductPreset) => void;
  activePresetId?: string;
}

export const DemoPresetSelector: React.FC<DemoPresetSelectorProps> = ({
  onSelectPreset,
  activePresetId,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100 tracking-wide uppercase">
            Live Hackathon Presentation Presets
          </h3>
          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
            1-Click Presentation Tests
          </span>
        </div>
        <div className="text-xs text-slate-500 hidden sm:block">
          Pre-loaded actual package samples matching SIH presentation slides
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
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/70 border-[#0A3663] ring-2 ring-[#0A3663]/20 shadow-md'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-2xs">
                    {preset.badge}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isCompliant
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {isCompliant ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Score: {preset.expectedScore}%</span>
                      </>
                    ) : (
                      <>
                        <AlertOctagon className="w-3 h-3 text-red-600" />
                        <span>Score: {preset.expectedScore}%</span>
                      </>
                    )}
                  </span>
                </div>

                <h4 className="text-xs font-black text-slate-900 dark:text-zinc-100 leading-tight mb-1 truncate">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                  {preset.subtitle}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span className="truncate">{preset.categoryDisplay}</span>
                <span className="text-[#0A3663] font-bold group-hover:underline">Load Demo →</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

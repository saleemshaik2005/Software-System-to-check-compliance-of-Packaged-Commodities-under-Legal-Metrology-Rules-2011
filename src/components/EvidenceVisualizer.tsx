import React, { useState } from 'react';
import { BoundingBox, RuleStatus } from '../types';
import { AlertCircle, AlertTriangle, CheckCircle2, Eye, Info } from 'lucide-react';

interface EvidenceVisualizerProps {
  imageSrc: string;
  boundingBoxes: BoundingBox[];
  activeView: 'front' | 'back' | 'side';
  setActiveView: (view: 'front' | 'back' | 'side') => void;
  availableImages: {
    front?: string;
    back?: string;
    side?: string;
  };
}

export const EvidenceVisualizer: React.FC<EvidenceVisualizerProps> = ({
  imageSrc,
  boundingBoxes,
  activeView,
  setActiveView,
  availableImages,
}) => {
  const [selectedBox, setSelectedBox] = useState<BoundingBox | null>(null);
  const [showOverlays, setShowOverlays] = useState(true);

  // Strictly filter bounding boxes to the currently selected active image view!
  const visibleBoxes = boundingBoxes.filter((box) => {
    if (!box.view) return activeView === 'front';
    return box.view === activeView;
  });

  const getStatusColor = (status: RuleStatus) => {
    switch (status) {
      case 'FAIL':
        return {
          border: 'border-red-600',
          bg: 'bg-red-500/25',
          badge: 'bg-red-600 text-white',
          glow: 'shadow-[0_0_15px_rgba(220,38,38,0.5)]'
        };
      case 'WARNING':
        return {
          border: 'border-amber-600',
          bg: 'bg-amber-500/25',
          badge: 'bg-amber-600 text-white',
          glow: 'shadow-[0_0_15px_rgba(217,119,6,0.5)]'
        };
      case 'PASS':
        return {
          border: 'border-emerald-600',
          bg: 'bg-emerald-500/20',
          badge: 'bg-emerald-600 text-white',
          glow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]'
        };
      default:
        return {
          border: 'border-blue-600',
          bg: 'bg-blue-500/20',
          badge: 'bg-blue-600 text-white',
          glow: ''
        };
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-colors">
      {/* Visualizer Header */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#00A651]" />
          <span className="text-sm font-black text-slate-900 dark:text-zinc-100 tracking-wide">Evidence-First Visual Overlay</span>
          <span className="text-xs bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold px-2 py-0.5 rounded-full border border-slate-200 dark:border-zinc-700 shadow-2xs">
            {visibleBoxes.length} {visibleBoxes.length === 1 ? 'Region' : 'Regions'} on {activeView.toUpperCase()}
          </span>
        </div>

        {/* Multi-View Toggle (Front / Back / Side) */}
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 p-1 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs shadow-2xs">
          <button
            onClick={() => {
              setActiveView('front');
              setSelectedBox(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeView === 'front'
                ? 'bg-[#00A651] text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => {
              setActiveView('back');
              setSelectedBox(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeView === 'back'
                ? 'bg-[#00A651] text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Back
          </button>
          <button
            onClick={() => {
              setActiveView('side');
              setSelectedBox(null);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeView === 'side'
                ? 'bg-[#00A651] text-white shadow-xs'
                : 'text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Side
          </button>
        </div>

        {/* Overlay toggle */}
        <button
          onClick={() => setShowOverlays(!showOverlays)}
          className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
            showOverlays
              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-[#0A3663] dark:text-blue-300'
              : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {showOverlays ? 'Overlays ON' : 'Overlays OFF'}
        </button>
      </div>

      {/* Main Image Viewport with Bounding Box Overlay */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden select-none">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`Scanned Package ${activeView} View`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center p-8 text-slate-400">
            <p>No package image loaded for this view</p>
          </div>
        )}

        {/* Informative indicator when active view has no flagged declarations */}
        {imageSrc && visibleBoxes.length === 0 && (
          <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-slate-200 text-[11px] px-3 py-1.5 rounded-xl border border-slate-700/80 flex items-center gap-2 z-20 shadow-lg">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>No statutory declarations flagged on {activeView} view</span>
          </div>
        )}

        {/* View-Specific Bounding Box Highlights */}
        {showOverlays &&
          visibleBoxes.map((box) => {
            const colors = getStatusColor(box.status);
            const isSelected = selectedBox?.id === box.id;

            return (
              <div
                key={box.id}
                onClick={() => setSelectedBox(box)}
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                }}
                className={`absolute cursor-pointer border-2 transition-all duration-200 rounded-lg ${
                  colors.border
                } ${colors.bg} ${isSelected ? `${colors.glow} ring-2 ring-white z-20 scale-[1.02]` : 'hover:opacity-90 z-10'}`}
              >
                {/* Floating Tag Badge */}
                <div
                  className={`absolute -top-3.5 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight shadow-md flex items-center gap-1 ${
                    colors.badge
                  }`}
                >
                  {box.status === 'FAIL' && <AlertCircle className="w-2.5 h-2.5" />}
                  {box.status === 'WARNING' && <AlertTriangle className="w-2.5 h-2.5" />}
                  {box.status === 'PASS' && <CheckCircle2 className="w-2.5 h-2.5" />}
                  <span>{box.label}</span>
                </div>
              </div>
            );
          })}

        {/* Selected Box Interactive Tooltip Card */}
        {selectedBox && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-2xl z-30 text-left transition-colors">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    selectedBox.status === 'FAIL'
                      ? 'bg-red-500'
                      : selectedBox.status === 'WARNING'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">{selectedBox.ruleRef}</span>
              </div>
              <button
                onClick={() => setSelectedBox(null)}
                className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-zinc-100 mb-1">{selectedBox.label}</div>
            <div className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed mb-2">{selectedBox.message}</div>
            {selectedBox.detectedText && (
              <div className="text-[10px] font-mono bg-slate-100 dark:bg-zinc-800 p-1.5 rounded border border-slate-200 dark:border-zinc-700 text-[#0A3663] dark:text-blue-300 truncate">
                Text: "{selectedBox.detectedText}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Caption bar */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-zinc-950 text-[11px] text-slate-600 dark:text-zinc-400 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Violation
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Warning
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified Conforming
          </span>
        </div>
        <div className="text-slate-500 dark:text-zinc-400 text-[10px]">
          {visibleBoxes.length > 0 ? 'Click any bounding box on the image' : 'Select Front or Back to view declarations'}
        </div>
      </div>
    </div>
  );
};

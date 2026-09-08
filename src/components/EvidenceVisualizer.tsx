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

  const getStatusColor = (status: RuleStatus) => {
    switch (status) {
      case 'FAIL':
        return {
          border: 'border-red-500',
          bg: 'bg-red-500/20',
          badge: 'bg-red-600 text-white',
          pin: 'bg-red-600',
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.6)]'
        };
      case 'WARNING':
        return {
          border: 'border-amber-500',
          bg: 'bg-amber-500/20',
          badge: 'bg-amber-600 text-white',
          pin: 'bg-amber-500',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.6)]'
        };
      case 'PASS':
        return {
          border: 'border-emerald-500',
          bg: 'bg-emerald-500/15',
          badge: 'bg-emerald-600 text-white',
          pin: 'bg-emerald-500',
          glow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]'
        };
      default:
        return {
          border: 'border-blue-500',
          bg: 'bg-blue-500/20',
          badge: 'bg-blue-600 text-white',
          pin: 'bg-blue-500',
          glow: ''
        };
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Visualizer Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-bold text-white tracking-wide">Evidence-First Visual Overlay</span>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
            {boundingBoxes.length} Regions Inspected
          </span>
        </div>

        {/* Multi-View Toggle (Front / Back / Side as in Slide 2) */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveView('front')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              activeView === 'front' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setActiveView('back')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              activeView === 'back' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Back
          </button>
          <button
            onClick={() => setActiveView('side')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              activeView === 'side' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Side
          </button>
        </div>

        {/* Overlay toggle */}
        <button
          onClick={() => setShowOverlays(!showOverlays)}
          className={`text-xs px-2.5 py-1 rounded border transition-all ${
            showOverlays
              ? 'bg-cyan-950 border-cyan-700 text-cyan-300'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
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
            alt="Scanned Package Label"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center p-8 text-slate-500">
            <p>No package image loaded</p>
          </div>
        )}

        {/* Bounding Box Highlights & Callout Pins */}
        {showOverlays &&
          boundingBoxes.map((box) => {
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
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-80 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 shadow-2xl z-30 text-left">
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
                <span className="text-xs font-bold text-white">{selectedBox.ruleRef}</span>
              </div>
              <button
                onClick={() => setSelectedBox(null)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="text-xs font-semibold text-slate-200 mb-1">{selectedBox.label}</div>
            <div className="text-[11px] text-slate-400 leading-relaxed mb-2">{selectedBox.message}</div>
            {selectedBox.detectedText && (
              <div className="text-[10px] font-mono bg-slate-950 p-1.5 rounded border border-slate-800 text-cyan-300 truncate">
                Text: "{selectedBox.detectedText}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Caption bar */}
      <div className="px-4 py-2 bg-slate-950 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Violation Detected
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Statutory Warning
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified Compliant
          </span>
        </div>
        <div className="text-slate-500">Click any box for rule explanation</div>
      </div>
    </div>
  );
};

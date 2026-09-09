import React, { useState } from 'react';
import { AdminSystemConfig } from '../types';
import { getAdminConfig, saveAdminConfig, resetAdminConfig } from '../services/adminService';
import { getScanReports } from '../services/dbService';
import {
  Settings,
  ShieldAlert,
  IndianRupee,
  Sliders,
  Database,
  Users,
  Megaphone,
  CheckCircle2,
  RefreshCw,
  Download,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface AdminControlCenterProps {
  onConfigChanged?: (cfg: AdminSystemConfig) => void;
}

export const AdminControlCenter: React.FC<AdminControlCenterProps> = ({ onConfigChanged }) => {
  const [config, setConfig] = useState<AdminSystemConfig>(getAdminConfig());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'rules' | 'banner' | 'database' | 'officers'>('rules');

  const handleSave = () => {
    const saved = saveAdminConfig(config);
    setConfig(saved);
    if (onConfigChanged) onConfigChanged(saved);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all parameters back to official Gazette defaults?')) {
      const def = resetAdminConfig();
      setConfig(def);
      if (onConfigChanged) onConfigChanged(def);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleExportAudits = () => {
    const reports = getScanReports();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Inspack_Full_Audit_Export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#0A2540] to-[#0A3663] text-white p-6 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>Platform Software & Configuration Control Center</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Administrator System Management Console
          </h1>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            Live configuration of Legal Metrology compounding penalties, numeral height thresholds, database backup exports, and UI announcements without modifying source code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700/50 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="Reset to official Gazette defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 bg-[#00A651] hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-bold flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All system parameters updated successfully! Real-time compliance scoring updated.</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700">Persisted locally & in active session</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 dark:border-zinc-800 bg-white rounded-2xl p-1.5 shadow-xs gap-1 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('rules')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'rules'
              ? 'bg-[#0A3663] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Fines & Rule Thresholds</span>
        </button>
        <button
          onClick={() => setActiveSubTab('banner')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'banner'
              ? 'bg-[#0A3663] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Enforcement Drive Banner</span>
        </button>
        <button
          onClick={() => setActiveSubTab('database')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'database'
              ? 'bg-[#0A3663] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Cloud Database & Export</span>
        </button>
        <button
          onClick={() => setActiveSubTab('officers')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'officers'
              ? 'bg-[#0A3663] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Field Inspectors</span>
        </button>
      </div>

      {/* Tab 1: Fines & Rule Thresholds */}
      {activeSubTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compounding Fines */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800 pb-3">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <span>Rule 32 Compounding Penalties (INR)</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  First Offence Penalty (Rule 32(1))
                </label>
                <input
                  type="number"
                  value={config.fineFirstOffense}
                  onChange={(e) => setConfig({ ...config, fineFirstOffense: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#00A651]"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Statutory gazette default: ₹2,000 per violation
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Subsequent Offence Penalty (Rule 32(2))
                </label>
                <input
                  type="number"
                  value={config.fineSecondOffense}
                  onChange={(e) => setConfig({ ...config, fineSecondOffense: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#00A651]"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Statutory gazette default: ₹5,000 per repeat violation
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Manufacturer / Packer Defect Fine
                </label>
                <input
                  type="number"
                  value={config.fineManufacturerViolation}
                  onChange={(e) => setConfig({ ...config, fineManufacturerViolation: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#00A651]"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  For missing postal address, PIN code, or country of origin
                </span>
              </div>
            </div>
          </div>

          {/* Numeral Height & Scoring Thresholds */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800 pb-3">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Table I Numeral Heights & Score Thresholds</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Compliance Pass Threshold (0–100 Score)
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={config.passScoreThreshold}
                  onChange={(e) => setConfig({ ...config, passScoreThreshold: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#00A651]"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Packages scoring below this are flagged as Non-Compliant
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Minimum Numeral Height for Medium PDP (mm)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={config.minNumeralHeightMedium}
                  onChange={(e) => setConfig({ ...config, minNumeralHeightMedium: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#00A651]"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Rule 7 Table-I mandates 4.0mm for net weight 200g–1kg
                </span>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={config.strictSecondSchedule}
                    onChange={(e) => setConfig({ ...config, strictSecondSchedule: e.target.checked })}
                    className="w-4 h-4 text-[#00A651] rounded"
                  />
                  <span>Strict Second Schedule Pack Size Enforcement</span>
                </label>
                <span className="text-[10px] text-slate-500 ml-6 block">
                  Enforce strict standard packaging sizes for Biscuits, Edible Oils, Tea, Soaps, Atta
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Banner Announcement */}
      {activeSubTab === 'banner' && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-zinc-100 border-b border-slate-100 dark:border-zinc-800 pb-3">
            <Megaphone className="w-4 h-4 text-amber-600" />
            <span>Ministry Special Drive Announcement Banner</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            This announcement displays on the top navigation bar across all roles to broadcast special enforcement drives, seasonal inspections, or legal circulars.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Banner Announcement Text
            </label>
            <textarea
              rows={3}
              value={config.specialDriveBanner}
              onChange={(e) => setConfig({ ...config, specialDriveBanner: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#00A651]"
              placeholder="e.g. Special Crackdown on Non-Standard Pack Sizes in Festive Season..."
            />
          </div>

          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Live Preview:</span>
            <div className="bg-[#0A2540] text-amber-300 p-2 rounded-lg text-xs font-bold">
              📢 {config.specialDriveBanner || 'No announcement set'}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cloud Database & Export */}
      {activeSubTab === 'database' && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-zinc-100">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Inspection Dossiers & Cloud Sync Operations</span>
            </div>

            <button
              onClick={handleExportAudits}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0A3663] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Full Audit JSON</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Local Dossiers</span>
              <span className="text-xl font-black text-slate-900 dark:text-zinc-100">{getScanReports().length} Records</span>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">IndexedDB Persistent</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Cloud Firestore</span>
              <span className="text-xl font-black text-amber-900">Live Active</span>
              <span className="text-[11px] text-slate-500 block mt-1">sih-2026-project-229ad</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200 dark:border-zinc-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Cloudinary Media</span>
              <span className="text-xl font-black text-sky-900">CDN Connected</span>
              <span className="text-[11px] text-slate-500 block mt-1">dq17ske9m • Preset Ready</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Field Inspectors */}
      {activeSubTab === 'officers' && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-zinc-100">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Authorized Legal Metrology Officers Registry</span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Legal Metrology Inspector', badge: 'LM-ND-4092', zone: 'New Delhi North Hub', status: 'ACTIVE ON FIELD' },
              { name: 'Insp. Sunita Deshmukh', badge: 'LM-MH-8812', zone: 'Mumbai Port & Dark Stores', status: 'ACTIVE ON FIELD' },
              { name: 'Insp. Arvind Swaminathan', badge: 'LM-TN-3104', zone: 'Chennai Industrial Area', status: 'ACTIVE ON FIELD' },
            ].map((o) => (
              <div key={o.badge} className="p-3 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50 text-xs">
                <div>
                  <span className="font-black text-slate-900 dark:text-zinc-100 block">{o.name}</span>
                  <span className="text-slate-500 text-[11px]">Badge: {o.badge} • Jurisdiction: {o.zone}</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { AdminSystemConfig, CustomRuleDefinition, GazetteAmendmentNotification } from '../types';
import { getAdminConfig, saveAdminConfig, resetAdminConfig } from '../services/adminService';
import { getScanReports } from '../services/dbService';
import {
  getCustomRules,
  saveCustomRule,
  resetCustomRules,
  parseGazetteAmendment,
  applyGazetteAmendment,
  getAppliedAmendments
} from '../services/customRulesService';
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
  RotateCcw,
  Upload,
  FileText,
  Edit3,
  Save,
  Check,
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface AdminControlCenterProps {
  onConfigChanged?: (cfg: AdminSystemConfig) => void;
}

export const AdminControlCenter: React.FC<AdminControlCenterProps> = ({ onConfigChanged }) => {
  const [config, setConfig] = useState<AdminSystemConfig>(getAdminConfig());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'rules' | 'amendment' | 'banner' | 'database' | 'officers'>('rules');

  // Custom Statutory Rules
  const [rulesList, setRulesList] = useState<CustomRuleDefinition[]>(() => getCustomRules());
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [ruleDraft, setRuleDraft] = useState<CustomRuleDefinition | null>(null);

  // Gazette Amendment Uploader state
  const gazetteFileRef = useRef<HTMLInputElement>(null);
  const [gazetteFileName, setGazetteFileName] = useState('');
  const [gazetteRawText, setGazetteRawText] = useState('');
  const [parsedAmendment, setParsedAmendment] = useState<GazetteAmendmentNotification | null>(null);
  const [appliedAmendments, setAppliedAmendments] = useState<GazetteAmendmentNotification[]>(() => getAppliedAmendments());
  const [isParsingGazette, setIsParsingGazette] = useState(false);
  const [amendmentSuccess, setAmendmentSuccess] = useState(false);

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
      const defRules = resetCustomRules();
      setRulesList(defRules);
      if (onConfigChanged) onConfigChanged(def);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleEditRule = (rule: CustomRuleDefinition) => {
    setEditingRuleId(rule.id);
    setRuleDraft({ ...rule });
  };

  const handleSaveRuleDraft = () => {
    if (!ruleDraft) return;
    saveCustomRule(ruleDraft);
    setRulesList(getCustomRules());
    setEditingRuleId(null);
    setRuleDraft(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGazetteFileName(file.name);
    setIsParsingGazette(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      setGazetteRawText(text);
      const parsed = parseGazetteAmendment(file.name, text);
      setParsedAmendment(parsed);
      setIsParsingGazette(false);
    };
    reader.readAsText(file);
  };

  const handleParseManualText = () => {
    if (!gazetteRawText.trim()) return;
    setIsParsingGazette(true);
    setTimeout(() => {
      const parsed = parseGazetteAmendment(gazetteFileName || 'Gazette_Notification_2026.pdf', gazetteRawText);
      setParsedAmendment(parsed);
      setIsParsingGazette(false);
    }, 400);
  };

  const handleApplyGazette = () => {
    if (!parsedAmendment) return;
    applyGazetteAmendment(parsedAmendment);
    setRulesList(getCustomRules());
    setAppliedAmendments(getAppliedAmendments());
    setAmendmentSuccess(true);
    setTimeout(() => setAmendmentSuccess(false), 3500);
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
            Live management of Legal Metrology compounding penalties, statutory rule parameters, gazette amendment PDF ingestion, and UI announcements without modifying source code.
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
            <span>All system parameters and custom rules updated successfully! Real-time compliance scoring updated.</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700">Persisted locally & across all active sessions</span>
        </div>
      )}

      {amendmentSuccess && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-900 font-bold flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Official Gazette Amendment successfully adopted and applied to the Inspack evaluation engine!</span>
          </div>
          <span className="text-[10px] font-mono text-purple-700">Enforcement Active</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-1.5 shadow-xs gap-1 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('rules')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'rules'
              ? 'bg-[#0A3663] text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Statutory Rules & Fines</span>
        </button>
        <button
          onClick={() => setActiveSubTab('amendment')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'amendment'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>Gazette Amendment PDF Upload</span>
        </button>
        <button
          onClick={() => setActiveSubTab('banner')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'banner'
              ? 'bg-[#0A3663] text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Enforcement Drive Banner</span>
        </button>
        <button
          onClick={() => setActiveSubTab('database')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'database'
              ? 'bg-[#0A3663] text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Cloud Database & Export</span>
        </button>
        <button
          onClick={() => setActiveSubTab('officers')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'officers'
              ? 'bg-[#0A3663] text-white shadow-xs'
              : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Field Inspectors</span>
        </button>
      </div>

      {/* Tab 1: Statutory Rules & Fines */}
      {activeSubTab === 'rules' && (
        <div className="space-y-6">
          {/* Statutory Rule Registry Table with Inline Edit */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3 flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-zinc-100">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  <span>Statutory Rule Registry & Compounding Penalties Editor</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Click the edit icon on any rule to customize the compounding fine (INR), statutory legal section, or rule title.
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold">
                {rulesList.length} Active Rules
              </span>
            </div>

            <div className="space-y-3">
              {rulesList.map((rule) => {
                const isCurrentEditing = editingRuleId === rule.id;

                if (isCurrentEditing && ruleDraft) {
                  return (
                    <div key={rule.id} className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-3 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-zinc-100">
                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                          Editing Rule: {ruleDraft.ruleNumber}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingRuleId(null);
                              setRuleDraft(null);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveRuleDraft}
                            className="px-3.5 py-1 rounded-lg bg-[#00A651] text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Rule</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block font-bold mb-1">Rule Title</label>
                          <input
                            type="text"
                            value={ruleDraft.ruleTitle}
                            onChange={(e) => setRuleDraft({ ...ruleDraft, ruleTitle: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Compounding Fine (₹ INR)</label>
                          <input
                            type="number"
                            value={ruleDraft.compoundingFine}
                            onChange={(e) => setRuleDraft({ ...ruleDraft, compoundingFine: Number(e.target.value) })}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono font-bold text-emerald-700"
                          />
                        </div>

                        <div>
                          <label className="block font-bold mb-1">Legal Section Reference</label>
                          <input
                            type="text"
                            value={ruleDraft.section}
                            onChange={(e) => setRuleDraft({ ...ruleDraft, section: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block font-bold mb-1">Statutory Standard Description</label>
                          <input
                            type="text"
                            value={ruleDraft.description}
                            onChange={(e) => setRuleDraft({ ...ruleDraft, description: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                          />
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={rule.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950 flex flex-wrap items-center justify-between gap-3 text-xs transition-colors hover:border-slate-300 dark:hover:border-zinc-700"
                  >
                    <div className="flex-1 min-w-[240px]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0A3663] dark:text-blue-400">
                          {rule.ruleNumber}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="font-bold text-slate-900 dark:text-zinc-100">
                          {rule.ruleTitle}
                        </span>
                        {rule.isAmended && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            Amended ({rule.amendmentRef || '2026'})
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                        {rule.description}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                        Statutory Penal Provision: {rule.section}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Compounding Fine</span>
                        <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-400">
                          ₹{rule.compoundingFine.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        onClick={() => handleEditRule(rule)}
                        className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                        title="Edit rule parameters"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Gazette Amendment PDF / Document Upload */}
      {activeSubTab === 'amendment' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2 text-sm font-black text-purple-700 dark:text-purple-400 mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Official Gazette Notification Amendment Uploader</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-2xl">
                Upload new Gazette Notifications (GSR circulars) or legislative amendments enacted by the Ministry. The platform's AI parser reads the amendment clauses, identifies revised compounding fines or new statutory rules, and updates the compliance engine automatically.
              </p>
            </div>

            {/* Dropzone */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-800 bg-purple-50/40 dark:bg-zinc-950 text-center hover:border-purple-500 transition-colors">
              <input
                ref={gazetteFileRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                className="hidden"
                onChange={handleFileUpload}
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                    {gazetteFileName ? gazetteFileName : 'Upload Gazette Notification PDF or Document'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Supports .pdf, .txt, .doc (e.g. GSR_782_E_Legal_Metrology_Amendment_2026.pdf)
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => gazetteFileRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Select Gazette PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGazetteFileName('GSR_782_E_Legal_Metrology_Amendment_2026.pdf');
                      const sampleText = 'MINISTRY OF CONSUMER AFFAIRS, FOOD AND PUBLIC DISTRIBUTION\nNOTIFICATION\nNew Delhi, September 2026\nG.S.R. 782(E).—In exercise of the powers conferred by section 52 read with section 18 of the Legal Metrology Act, 2009, the Central Government hereby amends the Legal Metrology (Packaged Commodities) Rules, 2011.\n1. Short title and commencement: These rules may be called the Legal Metrology (Packaged Commodities) Amendment Rules, 2026.\n2. Enhanced compounding penalties under Section 36 for packaging non-declaration increased to Rs. 50,000 for corporations.\n3. Rule 10 Digital Commerce: Mandatory pre-sale display of Unit Sale Price, Expiry Date and Country of Origin on all quick-commerce platforms and dark stores before checkout.';
                      setGazetteRawText(sampleText);
                      const parsed = parseGazetteAmendment('GSR_782_E_Legal_Metrology_Amendment_2026.pdf', sampleText);
                      setParsedAmendment(parsed);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Load Sample 2026 Gazette
                  </button>
                </div>
              </div>
            </div>

            {/* Manual Gazette Notification Textarea */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                Or Paste Gazette Notification Text:
              </label>
              <textarea
                rows={4}
                value={gazetteRawText}
                onChange={(e) => setGazetteRawText(e.target.value)}
                placeholder="Paste Gazette Notification GSR text here..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-xs font-mono text-slate-800 dark:text-zinc-200 focus:ring-2 focus:ring-purple-600"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleParseManualText}
                  disabled={!gazetteRawText.trim() || isParsingGazette}
                  className="px-4 py-1.5 rounded-xl bg-[#0A3663] text-white text-xs font-bold hover:bg-blue-900 disabled:opacity-50 cursor-pointer"
                >
                  {isParsingGazette ? 'Analyzing Notification...' : 'Parse & Extract Rules'}
                </button>
              </div>
            </div>

            {/* Parsed Gazette Notification Impact Diff */}
            {parsedAmendment && (
              <div className="p-5 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-950/20 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                      Gazette Notification Extracted
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-zinc-100">
                      {parsedAmendment.gazetteNumber} • {parsedAmendment.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      {parsedAmendment.ministry} • Enacted: {parsedAmendment.effectiveDate}
                    </p>
                  </div>

                  <button
                    onClick={handleApplyGazette}
                    className="px-4 py-2 rounded-xl bg-[#00A651] hover:bg-emerald-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Adopt & Enforce Gazette Amendment</span>
                  </button>
                </div>

                {/* Rules Amended Diff Table */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                    Statutory Rule & Penalty Amendments to be Applied:
                  </span>

                  <div className="space-y-2">
                    {parsedAmendment.rulesAmended.map((r, i) => (
                      <div key={i} className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <span className="font-bold text-red-600 block mb-0.5">Prior Standard:</span>
                          <p className="text-slate-600 dark:text-zinc-400 line-through">{r.priorText}</p>
                        </div>
                        <div>
                          <span className="font-bold text-emerald-600 block mb-0.5">New Gazette Standard ({r.ruleNumber}):</span>
                          <p className="text-slate-900 dark:text-zinc-100 font-semibold">{r.amendedText}</p>
                          {r.revisedFine && (
                            <span className="inline-block mt-1 font-mono font-bold text-purple-700 dark:text-purple-400">
                              Revised Penalty: ₹{r.revisedFine.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Banner Announcement */}
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

      {/* Tab 4: Cloud Database & Export */}
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

      {/* Tab 5: Field Inspectors */}
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
              <div key={o.badge} className="p-3 border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-between bg-slate-50 dark:bg-zinc-950 text-xs">
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

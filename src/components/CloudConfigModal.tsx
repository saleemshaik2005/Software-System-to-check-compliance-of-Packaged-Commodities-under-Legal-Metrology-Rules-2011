import React, { useState } from 'react';
import { CloudConfig, getCloudConfig, saveCloudConfig, uploadToCloudinary, saveReportToFirestore } from '../services/cloudService';
import { getScanReports } from '../services/dbService';
import {
  Cloud,
  Database,
  Image as ImageIcon,
  CheckCircle2,
  X,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface CloudConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudConfigModal: React.FC<CloudConfigModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<CloudConfig>(getCloudConfig());
  const [testCloudinaryStatus, setTestCloudinaryStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [cloudinaryMsg, setCloudinaryMsg] = useState('');
  const [testFirestoreStatus, setTestFirestoreStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [firestoreMsg, setFirestoreMsg] = useState('');
  const [saveFeedback, setSaveFeedback] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveCloudConfig(config);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const handleTestCloudinary = async () => {
    setTestCloudinaryStatus('testing');
    setCloudinaryMsg('Testing Cloudinary direct upload...');
    const testPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const res = await uploadToCloudinary(testPixel, config.cloudinaryCloudName, config.cloudinaryUploadPreset);
    if (res.success) {
      setTestCloudinaryStatus('success');
      setCloudinaryMsg('Connected! Test image uploaded to Cloudinary successfully.');
    } else {
      setTestCloudinaryStatus('error');
      setCloudinaryMsg(res.error || 'Connection failed.');
    }
  };

  const handleTestFirestore = async () => {
    setTestFirestoreStatus('testing');
    setFirestoreMsg('Testing Firestore connection...');
    const dummyReport = getScanReports()[0];
    if (!dummyReport) {
      setTestFirestoreStatus('error');
      setFirestoreMsg('No inspection record available to sync.');
      return;
    }

    const res = await saveReportToFirestore(dummyReport, config.firestoreProjectId, config.firestoreApiKey);
    if (res.success) {
      setTestFirestoreStatus('success');
      setFirestoreMsg('Connected! Test record written to collection `inspack_audits`.');
    } else {
      setTestFirestoreStatus('error');
      setFirestoreMsg(res.error || 'Firestore write failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0A3663] text-white">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                Cloud Database & Storage Architecture
              </h3>
              <p className="text-xs text-slate-500">
                Live synchronization with Firestore NoSQL and Cloudinary Media CDN
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00A651] text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-2">
                <span>Google Gemini Multimodal AI</span>
                <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ACTIVE & CONFIGURED
                </span>
              </div>
              <div className="text-xs text-emerald-700 mt-0.5 font-mono">
                Model: gemini-flash-latest (Vision AI Extraction Operational)
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200">
              No Setup Required
            </span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
              <ImageIcon className="w-4 h-4 text-sky-600" />
              <span>1. Cloudinary (Packaging Evidence Image CDN)</span>
            </div>
            <a
              href="https://cloudinary.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-sky-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>Get Free Cloudinary (25GB)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Stores high-resolution front and back packaging photos on Cloudinary CDN for instant retrieval in audit reports.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Cloudinary Cloud Name
              </label>
              <input
                type="text"
                placeholder="e.g. your-cloud-name"
                value={config.cloudinaryCloudName}
                onChange={(e) => setConfig({ ...config, cloudinaryCloudName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Unsigned Upload Preset
              </label>
              <input
                type="text"
                placeholder="e.g. your-upload-preset"
                value={config.cloudinaryUploadPreset}
                onChange={(e) => setConfig({ ...config, cloudinaryUploadPreset: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleTestCloudinary}
              disabled={testCloudinaryStatus === 'testing'}
              className="px-3 py-1.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold hover:bg-sky-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${testCloudinaryStatus === 'testing' ? 'animate-spin' : ''}`} />
              <span>Test Cloudinary Upload</span>
            </button>

            {cloudinaryMsg && (
              <span className={`text-xs font-medium ${testCloudinaryStatus === 'success' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {cloudinaryMsg}
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
              <Database className="w-4 h-4 text-amber-600" />
              <span>2. Google Cloud Firestore (Audit Dossier Database)</span>
            </div>
            <a
              href="https://firebase.google.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-amber-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>Firebase Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Persists structured statutory reports, Rule 32 compounding fines, and inspection history in Firestore collection <code className="font-mono text-slate-700 bg-slate-200/60 px-1 py-0.5 rounded">inspack_audits</code>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Firebase Project ID
              </label>
              <input
                type="text"
                placeholder="e.g. inspack-sih-2026"
                value={config.firestoreProjectId}
                onChange={(e) => setConfig({ ...config, firestoreProjectId: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Web API Key (Optional)
              </label>
              <input
                type="password"
                placeholder="Optional for open rules"
                value={config.firestoreApiKey}
                onChange={(e) => setConfig({ ...config, firestoreApiKey: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleTestFirestore}
              disabled={testFirestoreStatus === 'testing'}
              className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${testFirestoreStatus === 'testing' ? 'animate-spin' : ''}`} />
              <span>Test Firestore Sync</span>
            </button>

            {firestoreMsg && (
              <span className={`text-xs font-medium ${testFirestoreStatus === 'success' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {firestoreMsg}
              </span>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Zero-Downtime Local-First Resilience</div>
            <div className="text-blue-700 mt-0.5 text-[11px] leading-relaxed">
              Even without cloud keys, Inspack works 100% offline via local IndexedDB storage and Edge Neural OCR. When you configure Firestore or Cloudinary, data automatically synchronizes in real time.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            {saveFeedback && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Configuration saved successfully!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#00A651] hover:bg-emerald-600 text-white shadow-md transition-all cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

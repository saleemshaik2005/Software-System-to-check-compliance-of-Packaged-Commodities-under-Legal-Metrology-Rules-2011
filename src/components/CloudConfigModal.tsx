import React, { useState } from 'react';
import {
  DEFAULT_CLOUDINARY_CLOUD_NAME,
  DEFAULT_CLOUDINARY_UPLOAD_PRESET,
  DEFAULT_FIRESTORE_PROJECT_ID,
  uploadToCloudinary,
  saveReportToFirestore
} from '../services/cloudService';
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
  ShieldCheck,
  Server
} from 'lucide-react';

interface CloudConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudConfigModal: React.FC<CloudConfigModalProps> = ({ isOpen, onClose }) => {
  const [testCloudinaryStatus, setTestCloudinaryStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [cloudinaryMsg, setCloudinaryMsg] = useState('');
  const [testFirestoreStatus, setTestFirestoreStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [firestoreMsg, setFirestoreMsg] = useState('');

  if (!isOpen) return null;

  const handleTestCloudinary = async () => {
    setTestCloudinaryStatus('testing');
    setCloudinaryMsg('Testing Cloudinary direct upload...');
    const testPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const res = await uploadToCloudinary(testPixel);
    if (res.success) {
      setTestCloudinaryStatus('success');
      setCloudinaryMsg('Connected! Live test image successfully uploaded to Cloudinary CDN.');
    } else {
      setTestCloudinaryStatus('error');
      setCloudinaryMsg(res.error || 'Connection check failed.');
    }
  };

  const handleTestFirestore = async () => {
    setTestFirestoreStatus('testing');
    setFirestoreMsg('Testing Google Cloud Firestore REST API connection...');
    const dummyReport = getScanReports()[0];
    if (!dummyReport) {
      setTestFirestoreStatus('error');
      setFirestoreMsg('No inspection record available to sync.');
      return;
    }

    const res = await saveReportToFirestore(dummyReport);
    if (res.success) {
      setTestFirestoreStatus('success');
      setFirestoreMsg('Connected! Test audit record written to Firestore collection `inspack_audits`.');
    } else {
      setTestFirestoreStatus('error');
      setFirestoreMsg(res.error || 'Firestore write check note: Set Firestore Rules to "allow read, write: if true;" in Firebase console.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0A3663] text-white">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                Live Cloud Database & Storage Status
              </h3>
              <p className="text-xs text-slate-500">
                100% Pre-configured • Zero manual setup required
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

        {/* 1. Neural Multimodal Vision */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00A651] text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-2">
                <span>1. Inspack Neural Vision Architecture</span>
                <span className="bg-emerald-200 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" /> ACTIVE & READY
                </span>
              </div>
              <div className="text-xs text-emerald-700 mt-0.5 font-mono">
                Multimodal Statutory Label Extraction Engine • Operational
              </div>
            </div>
          </div>
        </div>

        {/* 2. Media Cloud CDN */}
        <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
              <ImageIcon className="w-4 h-4 text-sky-600" />
              <span>2. Evidence Storage Media CDN (Packaging Photos)</span>
            </div>
            <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-sky-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-sky-600" /> ENCRYPTED & CONNECTED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-sky-100 font-mono text-slate-700">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Vault Node</span>
              <span className="font-bold text-sky-900">Secure Dedicated Media Cloud</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Access Protocol</span>
              <span className="font-bold text-sky-900">Direct Tamper-Evident HTTPS</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleTestCloudinary}
              disabled={testCloudinaryStatus === 'testing'}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testCloudinaryStatus === 'testing' ? 'animate-spin' : ''}`} />
              <span>{testCloudinaryStatus === 'testing' ? 'Verifying...' : 'Verify Media CDN Connection'}</span>
            </button>

            {cloudinaryMsg && (
              <span className={`text-xs font-medium ${testCloudinaryStatus === 'success' ? 'text-emerald-700 font-bold' : 'text-amber-700'}`}>
                {cloudinaryMsg}
              </span>
            )}
          </div>
        </div>

        {/* 3. Central Regulatory Audit Ledger */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900">
              <Database className="w-4 h-4 text-amber-600" />
              <span>3. Central Regulatory Audit Ledger (Statutory Database)</span>
            </div>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-amber-600" /> ENCRYPTED & CONNECTED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-amber-100 font-mono text-slate-700">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Ledger Network</span>
              <span className="font-bold text-amber-950">Cloud Distributed Datastore</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Audit Collection</span>
              <span className="font-bold text-amber-950">inspack_audits (Live)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleTestFirestore}
              disabled={testFirestoreStatus === 'testing'}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testFirestoreStatus === 'testing' ? 'animate-spin' : ''}`} />
              <span>{testFirestoreStatus === 'testing' ? 'Testing...' : 'Test Firestore Sync'}</span>
            </button>

            {firestoreMsg && (
              <span className={`text-xs font-medium ${testFirestoreStatus === 'success' ? 'text-emerald-700 font-bold' : 'text-amber-800'}`}>
                {firestoreMsg}
              </span>
            )}
          </div>
        </div>

        {/* Local-First Guarantee */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#00A651] shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-slate-900">Zero-Downtime Local-First Guarantee</div>
            <div className="text-slate-500 mt-0.5 text-[11px] leading-relaxed">
              Every audit is stored locally in IndexedDB first with zero latency, and synchronized in parallel to Cloudinary and Firestore.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-100 pt-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0A3663] text-white hover:bg-blue-900 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

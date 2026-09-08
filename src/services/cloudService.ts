// Inspack Cloud Integration Service
// 1. Cloudinary Direct Unsigned Media Storage
// 2. Google Cloud Firestore REST API Document Storage
// 3. Resilient Local-First IndexedDB / LocalStorage Fallback

import { ComplianceReport } from '../types';
import { DEFAULT_GEMINI_KEY } from './ocrService';

export interface CloudConfig {
  cloudinaryCloudName: string;
  cloudinaryUploadPreset: string;
  firestoreProjectId: string;
  firestoreApiKey: string;
  geminiApiKey: string;
  autoSyncToCloud: boolean;
}

const CONFIG_KEY = 'inspack_cloud_config_v1';

export const DEFAULT_CLOUD_CONFIG: CloudConfig = {
  cloudinaryCloudName: '',
  cloudinaryUploadPreset: '',
  firestoreProjectId: '',
  firestoreApiKey: '',
  geminiApiKey: DEFAULT_GEMINI_KEY,
  autoSyncToCloud: false,
};

export function getCloudConfig(): CloudConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      return { ...DEFAULT_CLOUD_CONFIG, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('Failed to read cloud config:', err);
  }
  return DEFAULT_CLOUD_CONFIG;
}

export function saveCloudConfig(cfg: Partial<CloudConfig>): CloudConfig {
  const current = getCloudConfig();
  const updated = { ...current, ...cfg };
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save cloud config:', err);
  }
  return updated;
}

// Convert JavaScript values to Google Cloud Firestore REST format
function toFirestoreValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: val.toString() } : { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = toFirestoreValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

// Parse Firestore REST document format back to JS
function fromFirestoreValue(val: any): any {
  if (!val) return null;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return parseInt(val.integerValue, 10);
  if ('doubleValue' in val) return val.doubleValue;
  if ('booleanValue' in val) return val.booleanValue;
  if ('nullValue' in val) return null;
  if ('arrayValue' in val) {
    return (val.arrayValue.values || []).map(fromFirestoreValue);
  }
  if ('mapValue' in val) {
    const res: Record<string, any> = {};
    const fields = val.mapValue.fields || {};
    for (const [k, v] of Object.entries(fields)) {
      res[k] = fromFirestoreValue(v);
    }
    return res;
  }
  return null;
}

/**
 * Upload an image (data URL or Blob) to Cloudinary
 */
export async function uploadToCloudinary(
  dataUrlOrBlob: string | Blob,
  customCloudName?: string,
  customPreset?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const cfg = getCloudConfig();
  const cloudName = (customCloudName || cfg.cloudinaryCloudName).trim();
  const uploadPreset = (customPreset || cfg.cloudinaryUploadPreset).trim();

  if (!cloudName || !uploadPreset) {
    return {
      success: false,
      error: 'Cloudinary Cloud Name or Upload Preset not configured.'
    };
  }

  try {
    const formData = new FormData();
    formData.append('file', dataUrlOrBlob);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'inspack_evidence');

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        error: errJson.error?.message || `Upload failed with HTTP ${res.status}`
      };
    }

    const data = await res.json();
    return {
      success: true,
      url: data.secure_url || data.url
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error during Cloudinary upload.'
    };
  }
}

/**
 * Save a Compliance Inspection Report to Google Cloud Firestore
 */
export async function saveReportToFirestore(
  report: ComplianceReport,
  customProjectId?: string,
  customApiKey?: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const cfg = getCloudConfig();
  const projectId = (customProjectId || cfg.firestoreProjectId).trim();
  const apiKey = (customApiKey || cfg.firestoreApiKey).trim();

  if (!projectId) {
    return {
      success: false,
      error: 'Firestore Project ID not configured.'
    };
  }

  try {
    const sanitizedReport = {
      ...report,
      capturedImages: {
        front: report.capturedImages?.front?.startsWith('http') ? report.capturedImages.front : 'STORED_LOCALLY',
        back: report.capturedImages?.back?.startsWith('http') ? report.capturedImages.back : 'STORED_LOCALLY',
        side: report.capturedImages?.side?.startsWith('http') ? report.capturedImages.side : 'STORED_LOCALLY',
      }
    };

    const firestoreBody = {
      fields: {
        id: toFirestoreValue(sanitizedReport.id),
        scanTimestamp: toFirestoreValue(sanitizedReport.scanTimestamp),
        inspectorName: toFirestoreValue(sanitizedReport.inspectorName || 'Insp. R. K. Verma'),
        inspectorBadgeNumber: toFirestoreValue(sanitizedReport.inspectorBadgeNumber || 'LM-ND-4092'),
        location: toFirestoreValue(sanitizedReport.location || 'Supermarket Hub'),
        score: toFirestoreValue(sanitizedReport.score),
        overallStatus: toFirestoreValue(sanitizedReport.overallStatus),
        violationsCount: toFirestoreValue(sanitizedReport.violationsCount),
        warningsCount: toFirestoreValue(sanitizedReport.warningsCount),
        passedCount: toFirestoreValue(sanitizedReport.passedCount),
        totalCompoundingFine: toFirestoreValue(sanitizedReport.totalCompoundingFine),
        formType: toFirestoreValue(sanitizedReport.formType),
        summaryRemarks: toFirestoreValue(sanitizedReport.summaryRemarks),
        productInfo: toFirestoreValue(sanitizedReport.productInfo),
        evaluations: toFirestoreValue(sanitizedReport.evaluations),
        syncedAt: toFirestoreValue(new Date().toISOString()),
      }
    };

    let url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/inspack_audits/${report.id}`;
    if (apiKey) {
      url += `?key=${apiKey}`;
    }

    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(firestoreBody)
    });

    if (res.ok) {
      return { success: true, message: `Report ${report.id} saved to Firestore!` };
    }

    const createUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/inspack_audits?documentId=${report.id}` + (apiKey ? `&key=${apiKey}` : '');
    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(firestoreBody)
    });

    if (createRes.ok) {
      return { success: true, message: `Report ${report.id} created in Firestore!` };
    }

    const errData = await createRes.json().catch(() => ({}));
    return {
      success: false,
      error: errData.error?.message || `Firestore HTTP ${createRes.status}`
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error syncing with Firestore.'
    };
  }
}

/**
 * Fetch all audits from Google Cloud Firestore
 */
export async function fetchReportsFromFirestore(): Promise<ComplianceReport[]> {
  const cfg = getCloudConfig();
  if (!cfg.firestoreProjectId) return [];

  try {
    let url = `https://firestore.googleapis.com/v1/projects/${cfg.firestoreProjectId}/databases/(default)/documents/inspack_audits`;
    if (cfg.firestoreApiKey) {
      url += `?key=${cfg.firestoreApiKey}`;
    }

    const res = await fetch(url);
    if (!res.ok) return [];

    const json = await res.json();
    if (!json.documents) return [];

    return json.documents.map((doc: any) => {
      const fields = doc.fields || {};
      const rep: any = {};
      for (const [k, v] of Object.entries(fields)) {
        rep[k] = fromFirestoreValue(v);
      }
      return rep as ComplianceReport;
    });
  } catch (err) {
    console.warn('Failed to fetch from Firestore:', err);
    return [];
  }
}

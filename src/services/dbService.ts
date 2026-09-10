// Local-First Offline & Cloud Resilient Storage Service for Inspack
// Persists inspection history, violation records & officer logs
// Synchronizes automatically with Google Cloud Firestore & Cloudinary CDN

import { ComplianceReport } from '../types';
import { DEMO_PRESETS } from '../data/demoProducts';
import { evaluateCompliance } from './complianceEngine';
import {
  saveReportToFirestore,
  fetchReportsFromFirestore,
  deleteReportFromFirestore,
  uploadToCloudinary,
  deleteImageFromCloudinary
} from './cloudService';

const STORAGE_KEY = 'inspack_inspection_history_v2';
const LEGACY_STORAGE_KEY = 'inspack_inspection_history_v1';

export const DB_CHANGE_EVENT = 'inspack_db_changed';
const DELETED_IDS_KEY = 'inspack_deleted_report_ids_v1';

export function getDeletedReportIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_IDS_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

export function recordDeletedReportId(id: string): void {
  try {
    const set = getDeletedReportIds();
    set.add(id);
    localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

export const SYNC_STATUS_EVENT = 'inspack_sync_status';

// Zero-latency cross-tab synchronization channel
const SYNC_CHANNEL = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('inspack_realtime_sync')
  : null;

if (SYNC_CHANNEL) {
  SYNC_CHANNEL.onmessage = (event) => {
    if (event.data?.type === 'DB_CHANGE') {
      window.dispatchEvent(new CustomEvent(DB_CHANGE_EVENT, { detail: { deletedId: event.data?.deletedId } }));
    } else if (event.data?.type === 'SYNC_REQUEST') {
      syncWithCloudDatabase();
    }
  };
}

export function notifyDbChange(deletedId?: string): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DB_CHANGE_EVENT, { detail: { deletedId } }));
    SYNC_CHANNEL?.postMessage({ type: 'DB_CHANGE', deletedId });
  }
}

export function notifySyncStatus(isSyncing: boolean, lastSynced?: Date): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SYNC_STATUS_EVENT, { detail: { isSyncing, lastSynced: lastSynced || new Date() } }));
  }
}

// Generate default benchmark reports
function getDefaultReports(): ComplianceReport[] {
  return DEMO_PRESETS.map((preset, idx) => {
    const report = evaluateCompliance(
      preset.productInfo,
      'front',
      preset.imageVisual,
      {
        name: 'Legal Metrology Inspector',
        badge: 'LM-ND-4092',
        location: idx % 2 === 0 ? 'Reliance Smart Bazaar, Connaught Place' : 'Blinkit Dark Store, Gurugram Hub'
      }
    );
    report.id = `INSP-26${(1000 + idx)}`;
    return report;
  });
}

/**
 * Get all cached inspection reports (local-first)
 * Returns empty array if no audits have been created (no sample data auto-seeded)
 */
export function getScanReports(): ComplianceReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: ComplianceReport[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch (err) {
    console.warn('Error accessing localStorage:', err);
    return [];
  }
}

/**
 * Synchronize local database with Google Cloud Firestore
 * Fetches all audits created across all devices and merges them in real time
 */
export async function syncWithCloudDatabase(isManual = false): Promise<ComplianceReport[]> {
  if (isManual) {
    notifySyncStatus(true);
  }
  try {
    const cloudReports = await fetchReportsFromFirestore();
    if (!cloudReports || cloudReports.length === 0) {
      notifySyncStatus(false, new Date());
      return getScanReports();
    }

    const localReports = getScanReports();
    const reportsMap = new Map<string, ComplianceReport>();

    // Add local reports first
    localReports.forEach(r => reportsMap.set(r.id, r));

    const deletedIds = getDeletedReportIds();

    // Merge in cloud reports (ignoring any deleted IDs)
    cloudReports.forEach(cr => {
      if (deletedIds.has(cr.id)) {
        deleteReportFromFirestore(cr.id).catch(() => {});
        return;
      }
      if (!reportsMap.has(cr.id)) {
        reportsMap.set(cr.id, cr);
      } else {
        const existing = reportsMap.get(cr.id)!;
        // Merge image slots if cloud has valid HTTP urls
        const mergedImages = { ...existing.capturedImages, ...cr.capturedImages };
        reportsMap.set(cr.id, {
          ...existing,
          ...cr,
          capturedImages: mergedImages
        });
      }
    });

    // Sort reports: Real scans first (by scan timestamp descending), default presets after
    const merged = Array.from(reportsMap.values()).sort((a, b) => {
      const isPresetA = a.id.startsWith('INSP-2610');
      const isPresetB = b.id.startsWith('INSP-2610');
      if (isPresetA && !isPresetB) return 1;
      if (!isPresetA && isPresetB) return -1;
      const timeA = new Date(a.scanTimestamp || 0).getTime();
      const timeB = new Date(b.scanTimestamp || 0).getTime();
      return timeB - timeA;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    notifyDbChange();
    notifySyncStatus(false, new Date());
    return merged;
  } catch (err) {
    console.warn('Cloud sync note:', err);
    notifySyncStatus(false, new Date());
    return getScanReports();
  }
}

/**
 * Trigger immediate manual cloud sync across all devices
 */
export async function triggerImmediateCloudSync(): Promise<ComplianceReport[]> {
  SYNC_CHANNEL?.postMessage({ type: 'SYNC_REQUEST' });
  return syncWithCloudDatabase(true);
}

/**
 * Save a scan report locally and sync to Google Cloud Firestore & Cloudinary
 */
export function saveScanReport(report: ComplianceReport, skipCloudSync = false): void {
  try {
    const existing = getScanReports();
    const updated = [report, ...existing.filter(r => r.id !== report.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifyDbChange();

    if (!skipCloudSync) {
      // 1. Immediately push to Firestore
      saveReportToFirestore(report).catch(err => {
        console.warn('Background Firestore sync note:', err);
      });

      // 2. Upload any local base64 images to Cloudinary CDN in background
      const hasBase64Images = ['front', 'back', 'side'].some(
        s => report.capturedImages?.[s as 'front' | 'back' | 'side']?.startsWith('data:image')
      );
      if (hasBase64Images) {
        uploadReportImagesAndSync(report).catch(err => {
          console.warn('Background Cloudinary upload note:', err);
        });
      }
    }
  } catch (err) {
    console.warn('Failed to save report:', err);
  }
}

/**
 * Upload base64 images to Cloudinary and update Firestore with public CDN URLs
 */
export async function uploadReportImagesAndSync(report: ComplianceReport): Promise<ComplianceReport> {
  const updatedImages = { ...report.capturedImages };

  const slots = ['front', 'back', 'side'] as const;
  let didUploadAny = false;

  for (const slot of slots) {
    const imgData = updatedImages[slot];
    if (imgData && imgData.startsWith('data:image')) {
      try {
        const uploadRes = await uploadToCloudinary(imgData);
        if (uploadRes.success && uploadRes.url) {
          updatedImages[slot] = uploadRes.url;
          didUploadAny = true;
        }
      } catch (e) {
        console.warn(`Failed to upload ${slot} to Cloudinary:`, e);
      }
    }
  }

  const updatedReport: ComplianceReport = {
    ...report,
    capturedImages: updatedImages
  };

  // Update local storage
  const existing = getScanReports();
  const updated = [updatedReport, ...existing.filter(r => r.id !== report.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  notifyDbChange();

  // If new Cloudinary URLs were generated, update Google Cloud Firestore
  if (didUploadAny) {
    saveReportToFirestore(updatedReport).catch(err => {
      console.warn('Firestore update after image upload note:', err);
    });
  }

  return updatedReport;
}

export function getScanReportById(id: string): ComplianceReport | null {
  const reports = getScanReports();
  return reports.find(r => r.id === id) || null;
}

/**
 * Delete a report from local storage and Google Cloud Firestore
 */
export function deleteScanReport(id: string): void {
  recordDeletedReportId(id);
  const existing = getScanReports();
  const reportToDelete = existing.find(r => r.id === id);
  const updated = existing.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  notifyDbChange(id);

  // 1. Permanently delete from Google Cloud Firestore
  deleteReportFromFirestore(id).catch(err => {
    console.warn('Failed to delete report from Firestore:', err);
  });

  // 2. Unlink and purge media assets from Cloudinary CDN
  if (reportToDelete?.capturedImages) {
    const imgUrls = [
      reportToDelete.capturedImages.front,
      reportToDelete.capturedImages.back,
      reportToDelete.capturedImages.side
    ].filter(Boolean) as string[];

    imgUrls.forEach(url => {
      deleteImageFromCloudinary(url).catch(err => {
        console.warn('Cloudinary image delete note:', err);
      });
    });
  }
}

export function getInspectionStats() {
  const reports = getScanReports();
  const total = reports.length;
  const compliant = reports.filter(r => r.overallStatus === 'COMPLIANT').length;
  const violations = reports.filter(r => r.overallStatus === 'NON_COMPLIANT').length;
  const warnings = reports.filter(r => r.overallStatus === 'NEEDS_REVIEW').length;
  const totalFines = reports.reduce((acc, curr) => acc + (curr.totalCompoundingFine || 0), 0);

  return {
    total,
    compliant,
    violations,
    nonCompliant: violations,
    warnings,
    totalFines,
    complianceRate: total > 0 ? Math.round((compliant / total) * 100) : 100
  };
}

/**
 * Purge all reports from local database and Google Cloud Firestore
 * Completely wipes past records for a 100% fresh slate
 */
export async function purgeAllDatabaseData(): Promise<{ success: boolean; count: number }> {
  try {
    const existing = getScanReports();
    const count = existing.length;

    // 1. Wipe local storage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));

    // 2. Fetch and purge all documents from Firestore
    try {
      const cloudReports = await fetchReportsFromFirestore();
      for (const cr of cloudReports) {
        if (cr.id) {
          await deleteReportFromFirestore(cr.id).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Error purging Firestore:', e);
    }

    // 3. Clear deleted IDs cache
    localStorage.removeItem(DELETED_IDS_KEY);
    localStorage.removeItem('inspack_deleted_cloudinary_media_v1');

    // 4. Notify across all open tabs and windows
    notifyDbChange();
    SYNC_CHANNEL?.postMessage({ type: 'DB_CHANGE' });

    return { success: true, count };
  } catch (err) {
    console.error('Failed to purge database:', err);
    return { success: false, count: 0 };
  }
}

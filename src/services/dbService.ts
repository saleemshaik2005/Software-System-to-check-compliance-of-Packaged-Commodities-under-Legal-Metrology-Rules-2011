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
  uploadToCloudinary
} from './cloudService';

const STORAGE_KEY = 'inspack_inspection_history_v2';
const LEGACY_STORAGE_KEY = 'inspack_inspection_history_v1';

export const DB_CHANGE_EVENT = 'inspack_db_changed';

export function notifyDbChange(deletedId?: string): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DB_CHANGE_EVENT, { detail: { deletedId } }));
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
 */
export function getScanReports(): ComplianceReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      const seededReports = getDefaultReports();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seededReports));
      return seededReports;
    }
    const parsed: ComplianceReport[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seededReports = getDefaultReports();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seededReports));
      return seededReports;
    }
    return parsed;
  } catch (err) {
    console.warn('Error accessing localStorage:', err);
    return getDefaultReports();
  }
}

/**
 * Synchronize local database with Google Cloud Firestore
 * Fetches all audits created across all devices and merges them in real time
 */
export async function syncWithCloudDatabase(): Promise<ComplianceReport[]> {
  try {
    const cloudReports = await fetchReportsFromFirestore();
    if (!cloudReports || cloudReports.length === 0) {
      return getScanReports();
    }

    const localReports = getScanReports();
    const reportsMap = new Map<string, ComplianceReport>();

    // Add local reports first
    localReports.forEach(r => reportsMap.set(r.id, r));

    // Merge in cloud reports (cloud data takes precedence for scans)
    cloudReports.forEach(cr => {
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
    return merged;
  } catch (err) {
    console.warn('Cloud sync note:', err);
    return getScanReports();
  }
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
  const existing = getScanReports();
  const updated = existing.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  notifyDbChange(id);

  // Permanently delete from Google Cloud Firestore
  deleteReportFromFirestore(id).catch(err => {
    console.warn('Failed to delete report from Firestore:', err);
  });
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

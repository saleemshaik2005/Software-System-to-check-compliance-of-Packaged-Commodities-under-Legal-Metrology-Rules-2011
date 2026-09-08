// Local-First Offline Storage Service for Inspack
// Persists inspection history, violation records & officer logs
// Seamlessly syncs with Google Cloud Firestore & Cloudinary automatically

import { ComplianceReport } from '../types';
import { DEMO_PRESETS } from '../data/demoProducts';
import { evaluateCompliance } from './complianceEngine';
import { saveReportToFirestore, uploadToCloudinary } from './cloudService';

const STORAGE_KEY = 'inspack_inspection_history_v1';

export function getScanReports(): ComplianceReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with demo reports on first launch
      const seededReports = DEMO_PRESETS.map((preset, idx) => {
        const report = evaluateCompliance(
          preset.productInfo,
          'front',
          preset.imageVisual,
          {
            name: 'Insp. R. K. Verma',
            badge: 'LM-ND-4092',
            location: idx % 2 === 0 ? 'Reliance Smart Bazaar, Connaught Place' : 'Blinkit Dark Store, Gurugram Hub'
          }
        );
        report.id = `INSP-26${(1000 + idx)}`;
        return report;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seededReports));
      return seededReports;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Error accessing localStorage:', err);
    return [];
  }
}

export function saveScanReport(report: ComplianceReport, skipCloudSync = false): void {
  try {
    const existing = getScanReports();
    const updated = [report, ...existing.filter(r => r.id !== report.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (!skipCloudSync) {
      // 1. Sync structured audit report to Google Cloud Firestore
      saveReportToFirestore(report).catch(err => {
        console.warn('Background Firestore sync note:', err);
      });

      // 2. Upload any local base64 images to Cloudinary CDN in the background
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

export async function uploadReportImagesAndSync(report: ComplianceReport): Promise<ComplianceReport> {
  const updatedImages = { ...report.capturedImages };

  const slots = ['front', 'back', 'side'] as const;
  for (const slot of slots) {
    const imgData = updatedImages[slot];
    if (imgData && imgData.startsWith('data:image')) {
      try {
        const uploadRes = await uploadToCloudinary(imgData);
        if (uploadRes.success && uploadRes.url) {
          updatedImages[slot] = uploadRes.url;
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

  saveScanReport(updatedReport, true);
  return updatedReport;
}

export function getScanReportById(id: string): ComplianceReport | null {
  const reports = getScanReports();
  return reports.find(r => r.id === id) || null;
}

export function deleteScanReport(id: string): void {
  const existing = getScanReports();
  const updated = existing.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getInspectionStats() {
  const reports = getScanReports();
  const total = reports.length;
  const compliant = reports.filter(r => r.overallStatus === 'COMPLIANT').length;
  const nonCompliant = reports.filter(r => r.overallStatus === 'NON_COMPLIANT').length;
  const needsReview = reports.filter(r => r.overallStatus === 'NEEDS_REVIEW').length;
  const totalFines = reports.reduce((acc, r) => acc + r.totalCompoundingFine, 0);
  const avgScore = total > 0 ? Math.round(reports.reduce((acc, r) => acc + r.score, 0) / total) : 0;

  return {
    total,
    compliant,
    nonCompliant,
    needsReview,
    complianceRate: total > 0 ? Math.round((compliant / total) * 100) : 100,
    totalFines,
    avgScore
  };
}

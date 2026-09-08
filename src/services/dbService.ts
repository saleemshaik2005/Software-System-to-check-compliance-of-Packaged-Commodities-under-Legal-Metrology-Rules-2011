// Local-First Offline Storage Service for Inspack
// Persists inspection history, violation records & officer logs

import { ComplianceReport } from '../types';
import { DEMO_PRESETS } from '../data/demoProducts';
import { evaluateCompliance } from './complianceEngine';

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

export function saveScanReport(report: ComplianceReport): void {
  try {
    const existing = getScanReports();
    const updated = [report, ...existing.filter(r => r.id !== report.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save report:', err);
  }
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

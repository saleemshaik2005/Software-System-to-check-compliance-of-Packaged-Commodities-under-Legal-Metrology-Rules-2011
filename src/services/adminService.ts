// Inspack Administrator Configuration & System Controls Service
// Allows runtime customization of Legal Metrology parameters, penalty rates, and enforcement banners

import { AdminSystemConfig } from '../types';

const ADMIN_STORAGE_KEY = 'inspack_admin_config_v1';

export const DEFAULT_ADMIN_CONFIG: AdminSystemConfig = {
  fineFirstOffense: 2000,
  fineSecondOffense: 5000,
  fineManufacturerViolation: 4000,
  minNumeralHeightSmall: 2.0,
  minNumeralHeightMedium: 4.0,
  minNumeralHeightLarge: 6.0,
  passScoreThreshold: 70,
  strictSecondSchedule: true,
  specialDriveBanner: 'Special Enforcement Drive • Legal Metrology Act, 2009 • National Packaged Commodity Verification',
  enableCloudSync: true,
};

export function getAdminConfig(): AdminSystemConfig {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_ADMIN_CONFIG, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('Failed to load admin config:', err);
  }
  return DEFAULT_ADMIN_CONFIG;
}

export function saveAdminConfig(cfg: Partial<AdminSystemConfig>): AdminSystemConfig {
  const current = getAdminConfig();
  const updated = { ...current, ...cfg };
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save admin config:', err);
  }
  return updated;
}

export function resetAdminConfig(): AdminSystemConfig {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_CONFIG));
  } catch (err) {
    console.warn('Failed to reset admin config:', err);
  }
  return DEFAULT_ADMIN_CONFIG;
}

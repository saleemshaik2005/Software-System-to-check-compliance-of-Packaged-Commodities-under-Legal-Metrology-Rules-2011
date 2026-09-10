// Inspack Authentication & Role Management Service
// Provides 1-Click Fast-Switch Test Accounts for Hackathon Demonstration

import { AuthUser, UserRole } from '../types';

export const TEST_ACCOUNTS: Record<UserRole, AuthUser> = {
  OFFICER: {
    id: 'user-officer-01',
    name: 'Legal Metrology Inspector',
    email: 'inspector@lm.gov.in',
    role: 'OFFICER',
    badgeNumber: 'LM-ND-4092',
    organization: 'Department of Legal Metrology, New Delhi Zone',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  CITIZEN: {
    id: 'user-citizen-01',
    name: 'Consumer / Citizen',
    email: 'consumer@citizen.nic.in',
    role: 'CITIZEN',
    organization: 'National Consumer Helpline (NCH 1915) • Public Verification',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
  },
  MANUFACTURER: {
    id: 'user-mfg-01',
    name: 'Brand Manufacturer',
    email: 'compliance@manufacturer.in',
    role: 'MANUFACTURER',
    organization: 'FMCG Packaged Commodities Pre-Printing & QA Compliance',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80'
  },
  SURVEILLANCE: {
    id: 'user-surv-01',
    name: 'National Surveillance Director',
    email: 'director.surveillance@consumeraffairs.nic.in',
    role: 'SURVEILLANCE',
    badgeNumber: 'MOCA-SURV-01',
    organization: 'National Legal Metrology Surveillance Directorate • Ministry Oversight',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  ADMIN: {
    id: 'user-admin-01',
    name: 'System Administrator',
    email: 'admin@inspack.gov.in',
    role: 'ADMIN',
    badgeNumber: 'SYS-ADMIN-01',
    organization: 'Inspack Platform Engineering & System Configuration',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
  }
};

const AUTH_STORAGE_KEY = 'inspack_current_user_v1';

export function getCurrentUser(): AuthUser | null {
  try {
    if (localStorage.getItem('inspack_signed_out') === 'true') {
      return null;
    }
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to load current user:', err);
  }
  return null; // Return null so every new visitor lands on the login page first
}

export function setCurrentUser(user: AuthUser): void {
  try {
    localStorage.removeItem('inspack_signed_out');
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('Failed to save current user:', err);
  }
}

export function switchRole(role: UserRole): AuthUser {
  const account = TEST_ACCOUNTS[role] || TEST_ACCOUNTS.OFFICER;
  setCurrentUser(account);
  return account;
}

export function loginWithEmail(email: string, role: UserRole): AuthUser {
  // Find matching test account or create dynamic session
  const matched = Object.values(TEST_ACCOUNTS).find(a => a.email.toLowerCase() === email.toLowerCase());
  if (matched) {
    setCurrentUser(matched);
    return matched;
  }

  const customUser: AuthUser = {
    id: 'user-' + Date.now().toString(36),
    name: email.split('@')[0],
    email,
    role,
    organization: role === 'OFFICER' ? 'Legal Metrology Enforcement Directorate' : 'Registered User'
  };
  setCurrentUser(customUser);
  return customUser;
}

export function logoutUser(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.setItem('inspack_signed_out', 'true');
  } catch (err) {
    console.warn('Logout error:', err);
  }
}

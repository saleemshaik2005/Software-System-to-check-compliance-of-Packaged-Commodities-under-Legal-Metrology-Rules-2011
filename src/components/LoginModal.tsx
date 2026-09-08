import React, { useState } from 'react';
import { AuthUser, UserRole } from '../types';
import { TEST_ACCOUNTS, loginWithEmail, logoutUser } from '../services/authService';
import {
  Shield,
  ShoppingBag,
  Building2,
  Lock,
  X,
  ArrowRight,
  LogOut,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLoginSuccess: (user: AuthUser) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState<UserRole>('OFFICER');

  if (!isOpen) return null;

  const handleQuickLogin = (role: UserRole) => {
    const user = TEST_ACCOUNTS[role];
    onLoginSuccess(user);
    onClose();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const user = loginWithEmail(customEmail.trim(), customRole);
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0A3663] text-white">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {currentUser ? 'Switch Active Role / Account' : 'Sign in to Inspack'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentUser
                  ? 'Switch between Legal Metrology roles or sign out'
                  : 'Select an authorized test profile or enter custom credentials'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Session Card (Only if logged in) */}
        {currentUser && (
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00A651] text-white font-black flex items-center justify-center text-sm shadow-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Active Session
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {currentUser.name}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                  {currentUser.email} • <span className="text-[#0A3663] dark:text-blue-400 font-bold">[{currentUser.role}]</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                logoutUser();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* 1-Click Role Accounts Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {currentUser ? 'Switch Role' : 'Select Account to Sign In'}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Instant 1-Click Access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Inspector */}
            <div
              onClick={() => handleQuickLogin('OFFICER')}
              className={`border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between ${
                currentUser?.role === 'OFFICER'
                  ? 'border-[#0A3663] dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-[#0A3663]/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0A3663] dark:text-blue-300">
                    <Shield className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold font-mono bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full">
                    Badge: LM-ND-4092
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                  Legal Metrology Inspector
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Statutory inspections, evidence overlays, compounding fines under Rule 32.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0A3663] dark:text-blue-300">
                <span>{TEST_ACCOUNTS.OFFICER.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 2. Consumer */}
            <div
              onClick={() => handleQuickLogin('CITIZEN')}
              className={`border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between ${
                currentUser?.role === 'CITIZEN'
                  ? 'border-[#00A651] dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-[#00A651]/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-emerald-300 dark:hover:border-emerald-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#00A651] dark:text-emerald-300">
                    <ShoppingBag className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold font-mono bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full">
                    Citizen
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                  Consumer / Citizen
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Package fairness verification, price sticker checks, NCH 1915 grievance dial.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#00A651] dark:text-emerald-300">
                <span>{TEST_ACCOUNTS.CITIZEN.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 3. Brand / Manufacturer */}
            <div
              onClick={() => handleQuickLogin('MANUFACTURER')}
              className={`border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between ${
                currentUser?.role === 'MANUFACTURER'
                  ? 'border-amber-600 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 ring-2 ring-amber-600/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-amber-300 dark:hover:border-amber-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold font-mono bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full">
                    Brand QA
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                  Brand / Manufacturer
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Pre-market artwork audit, Second Schedule pack size validator, label clearance.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300">
                <span>Tata Consumer Products QA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 4. Administrator */}
            <div
              onClick={() => handleQuickLogin('ADMIN')}
              className={`border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between ${
                currentUser?.role === 'ADMIN'
                  ? 'border-purple-600 dark:border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 ring-2 ring-purple-600/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    <Lock className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold font-mono bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                  Ministry Administrator
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  System parameters, compounding penalty rates tuner, cloud database controls.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-300">
                <span>{TEST_ACCOUNTS.ADMIN.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Custom Login Form */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Or Sign In with Custom Email & Role
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="email"
                placeholder="Enter official or personal email..."
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="sm:col-span-6 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              />
              <select
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value as UserRole)}
                className="sm:col-span-3 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              >
                <option value="OFFICER">Inspector</option>
                <option value="CITIZEN">Consumer</option>
                <option value="MANUFACTURER">Brand</option>
                <option value="ADMIN">Administrator</option>
              </select>
              <button
                type="submit"
                className="sm:col-span-3 px-4 py-2 bg-[#0A3663] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

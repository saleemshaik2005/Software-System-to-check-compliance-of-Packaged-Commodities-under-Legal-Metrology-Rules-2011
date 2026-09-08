import React, { useState } from 'react';
import { AuthUser, UserRole } from '../types';
import { TEST_ACCOUNTS, loginWithEmail, logoutUser } from '../services/authService';
import {
  Shield,
  User,
  ShoppingBag,
  Building2,
  Lock,
  CheckCircle2,
  X,
  ArrowRight,
  LogOut,
  Sparkles,
  KeyRound
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0A3663] text-white">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Inspack Role Access & Authentication</span>
              </h3>
              <p className="text-xs text-slate-500">
                Sign in with 1-click pre-loaded test accounts or custom credentials
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

        {/* Current Active Session Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00A651] text-white font-black flex items-center justify-center text-sm shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Current Active Session
              </div>
              <div className="text-sm font-black text-slate-900">
                {currentUser.name}
              </div>
              <div className="text-xs text-slate-600 font-mono">
                {currentUser.email} • <span className="text-[#0A3663] font-bold">[{currentUser.role}]</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onLogout();
              logoutUser();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* 1-Click Fast Switch Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00A651]" />
              <span>1-Click Test Accounts (Hackathon Presentation Ready)</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold">No passwords required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Inspector */}
            <div
              onClick={() => handleQuickLogin('OFFICER')}
              className={`border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between ${
                currentUser.role === 'OFFICER'
                  ? 'border-[#0A3663] bg-blue-50/50 ring-2 ring-[#0A3663]/20'
                  : 'border-slate-200 bg-white hover:border-blue-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-blue-100 text-[#0A3663]">
                    <Shield className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold font-mono bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                    Badge: LM-ND-4092
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900">
                  Legal Metrology Inspector
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Full enforcement tools, Form A/B data sheets, compounding fines under Rule 32.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0A3663]">
                <span>{TEST_ACCOUNTS.OFFICER.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 2. Consumer */}
            <div
              onClick={() => handleQuickLogin('CITIZEN')}
              className={`border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between ${
                currentUser.role === 'CITIZEN'
                  ? 'border-[#00A651] bg-emerald-50/50 ring-2 ring-[#00A651]/20'
                  : 'border-slate-200 bg-white hover:border-emerald-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-emerald-100 text-[#00A651]">
                    <ShoppingBag className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                    Citizen
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900">
                  Consumer / Citizen
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Plain-English "Is this fair?" check, MRP price sticker tampering, 1-tap NCH 1915 filing.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#00A651]">
                <span>{TEST_ACCOUNTS.CITIZEN.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 3. Brand / Manufacturer */}
            <div
              onClick={() => handleQuickLogin('MANUFACTURER')}
              className={`border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between ${
                currentUser.role === 'MANUFACTURER'
                  ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-600/20'
                  : 'border-slate-200 bg-white hover:border-amber-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    Brand QA
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900">
                  Brand / Manufacturer
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Artwork Pre-Check simulator, Second Schedule pack sizes matrix, font height rules.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>Tata Agro QA Division</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 4. Administrator */}
            <div
              onClick={() => handleQuickLogin('ADMIN')}
              className={`border rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between ${
                currentUser.role === 'ADMIN'
                  ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/20'
                  : 'border-slate-200 bg-white hover:border-purple-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <Lock className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
                    Ministry Admin
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900">
                  Ministry Chief Administrator
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Full website control, penalty rates tuner, cloud database logs, and announcement editor.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
                <span>{TEST_ACCOUNTS.ADMIN.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Custom Login Form */}
        <div className="pt-2 border-t border-slate-100">
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <span className="text-xs font-bold text-slate-700 block">
              Or Sign In with Custom Email & Role
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="email"
                placeholder="Enter official or personal email..."
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="sm:col-span-6 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              />
              <select
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value as UserRole)}
                className="sm:col-span-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00A651]"
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
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

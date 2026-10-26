import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck, Check } from 'lucide-react';
import { UserSession } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (session: UserSession) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState<'admin' | 'petugas'>('admin');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username tidak boleh kosong');
      return;
    }

    if (role === 'admin') {
      onLogin({
        id: 'usr-admin',
        username: username.trim(),
        name: 'Pengurus BUPDA Padangsambian',
        role: 'admin'
      });
    } else {
      onLogin({
        id: 'usr-petugas',
        username: username.trim(),
        name: 'Bpk. Ketut Sujana (Petugas RT)',
        role: 'petugas'
      });
    }

    onClose();
  };

  const handleQuickLogin = (selectedRole: 'admin' | 'petugas') => {
    if (selectedRole === 'admin') {
      onLogin({
        id: 'usr-admin',
        username: 'admin',
        name: 'Pengurus BUPDA Padangsambian',
        role: 'admin'
      });
    } else {
      onLogin({
        id: 'usr-petugas',
        username: 'petugas',
        name: 'Bpk. Ketut Sujana (Petugas RT)',
        role: 'petugas'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-emerald-100 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Masuk Sistem Pengurus
              </h3>
              <p className="text-[11px] text-emerald-800">
                BUPDA Padangsambian
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-2.5 bg-rose-50 text-rose-800 border border-rose-200 text-xs rounded-lg">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Peran Akun
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                  role === 'admin'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Admin Utama</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('petugas')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                  role === 'petugas'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Petugas RT</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            Masuk ke Aplikasi
          </button>

          {/* Quick Demo Switcher */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 text-center">
              Login Cepat untuk Pengujian (1-Klik)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] font-semibold text-slate-700 rounded-lg transition-colors border border-slate-200 text-center"
              >
                ✓ Mode Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('petugas')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] font-semibold text-slate-700 rounded-lg transition-colors border border-slate-200 text-center"
              >
                ✓ Mode Petugas RT
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

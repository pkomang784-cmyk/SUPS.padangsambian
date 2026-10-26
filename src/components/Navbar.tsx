import React from 'react';
import { User, LogIn, LogOut, Sparkles } from 'lucide-react';
import { UserSession } from '../types';

interface NavbarProps {
  currentSession: UserSession;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenWargaPortal: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSession,
  onOpenLogin,
  onLogout,
  onOpenWargaPortal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Single Brand Wordmark & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50 shrink-0 shadow-xs">
              <img
                src="/assets/aistudio/ChatGPT_Image_8_Jun_2026__11.31.32_c8c40564.png"
                alt="Logo BUPDA Padangsambian"
                className="h-full w-full object-cover object-left"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 tracking-tight leading-none whitespace-nowrap">
                BUPDA Padangsambian
              </span>
              <span className="text-xs text-emerald-700 font-medium whitespace-nowrap mt-0.5">
                Sistem Iuran & Pengelolaan Sampah
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation / Context Breadcrumb */}
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-mono tabular-nums bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-100">
              <span className="font-semibold">Periode Aktif:</span>
              <span>Oktober 2026</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Lingkungan Bersih, Hidup Lebih Sehat</span>
            </div>
          </div>

          {/* Zone 3: Account / Primary Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {currentSession.role !== 'warga' && (
              <button
                type="button"
                onClick={onOpenWargaPortal}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200 whitespace-nowrap shrink-0"
              >
                Cek Tagihan Warga
              </button>
            )}

            {currentSession.role === 'warga' ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-700 hidden sm:inline">
                  Mode Warga
                </span>
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-xs whitespace-nowrap shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login Petugas</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-semibold text-slate-800 leading-tight">
                      {currentSession.name}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium capitalize">
                      {currentSession.role} RT
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  title="Keluar"
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

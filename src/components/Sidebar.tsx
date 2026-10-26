import React from 'react';
import {
  LayoutDashboard,
  Users,
  ReceiptText,
  BellRing,
  Recycle,
  Search,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unpaidCount: number;
  onOpenAddCustomer: () => void;
  onOpenPaymentModal: () => void;
  isAdminOrPetugas: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unpaidCount,
  onOpenAddCustomer,
  onOpenPaymentModal,
  isAdminOrPetugas
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Ringkasan',
      icon: LayoutDashboard,
      description: 'Ikhtisar kas & iuran'
    },
    {
      id: 'customers',
      label: 'Data Pelanggan',
      icon: Users,
      description: 'Warga, edit & impor/ekspor'
    },
    {
      id: 'payments',
      label: 'Riwayat Pembayaran',
      icon: ReceiptText,
      description: 'Log transaksi & kuitansi'
    },
    {
      id: 'notifications',
      label: 'Notifikasi Tagihan',
      icon: BellRing,
      badge: unpaidCount > 0 ? unpaidCount : undefined,
      description: 'Kirim WhatsApp otomatis'
    },
    {
      id: 'schedule',
      label: 'Jadwal & Pilah Sampah',
      icon: Recycle,
      description: 'Edukasi 4 jenis tempat sampah'
    },
    {
      id: 'warga-portal',
      label: 'Portal Cek Tagihan',
      icon: Search,
      description: 'Pencarian tagihan mandiri'
    }
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-emerald-100 flex flex-col shrink-0">
      
      {/* Quick Action Buttons for Admin/Petugas */}
      {isAdminOrPetugas && (
        <div className="p-4 border-b border-emerald-50 space-y-2">
          <button
            type="button"
            onClick={onOpenPaymentModal}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <ReceiptText className="w-4 h-4" />
            <span>Catat Pembayaran</span>
          </button>
          
          <button
            type="button"
            onClick={onOpenAddCustomer}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Tambah Warga Baru</span>
          </button>
        </div>
      )}

      {/* Navigation List */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Menu Utama
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors text-left group ${
                isActive
                  ? 'bg-emerald-500 text-white font-semibold shadow-xs'
                  : 'text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-emerald-600 group-hover:text-emerald-700'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md tabular-nums ${
                    isActive
                      ? 'bg-white text-emerald-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Information Card */}
      <div className="p-4 border-t border-emerald-50 mt-auto">
        <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-100 text-[11px] text-slate-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bank Data Warga</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Data tersinkron otomatis. Dukung format Excel & CSV untuk kemudahan laporan pengurus.
          </p>
        </div>
      </div>

    </aside>
  );
};

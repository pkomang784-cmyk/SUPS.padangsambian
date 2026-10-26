import React, { useState } from 'react';
import { Search, Home, CheckCircle2, Clock, QrCode, Building2, Receipt, MessageCircle, AlertCircle } from 'lucide-react';
import { Customer, MonthlyBill, PaymentRecord } from '../types';

interface WargaPortalProps {
  customers: Customer[];
  monthlyBills: MonthlyBill[];
  payments: PaymentRecord[];
  activePeriod: string;
  onViewReceipt: (payment: PaymentRecord) => void;
  onAdminLoginRequested: () => void;
}

export const WargaPortal: React.FC<WargaPortalProps> = ({
  customers,
  monthlyBills,
  payments,
  activePeriod,
  onViewReceipt,
  onAdminLoginRequested
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Search matches
  const searchResults = searchQuery.trim()
    ? customers.filter(
        c =>
          c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.nomorRumah.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.noHp.includes(searchQuery) ||
          c.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectWarga = (c: Customer) => {
    setSelectedCustomer(c);
  };

  const currentBill = selectedCustomer
    ? monthlyBills.find(b => b.customerId === selectedCustomer.id && b.periode === activePeriod)
    : null;

  const residentPayments = selectedCustomer
    ? payments.filter(p => p.customerId === selectedCustomer.id)
    : [];

  const handleConfirmPaymentWA = () => {
    if (!selectedCustomer) return;
    const text = `Halo Admin BUPDA Padangsambian, saya warga atas nama ${selectedCustomer.nama} (${selectedCustomer.nomorRumah}, ${selectedCustomer.rt}). Saya ingin konfirmasi pembayaran iuran sampah periode ${activePeriod} sebesar Rp ${selectedCustomer.tarifBulanan.toLocaleString('id-ID')}. Mohon bantuannya untuk pengecekan. Terima kasih!`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto">
          <Home className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Portal Informasi & Cek Iuran Sampah Warga
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Ketahui status tagihan bulanan Anda, unduh kuitansi resmi, dan dapatkan informasi nomor rekening/QRIS untuk pembayaran iuran kebersihan lingkungan.
        </p>

        {/* Search Input Box */}
        <div className="max-w-lg mx-auto pt-2">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Ketik nama Anda, nomor rumah (cth: No. 12A), atau No. WA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs bg-slate-50/50"
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5">
            Contoh: coba ketik &quot;Sudarma&quot; atau &quot;No. 12A&quot;
          </div>
        </div>
      </div>

      {/* Search Candidates Dropdown */}
      {searchQuery.trim() && searchResults.length > 0 && !selectedCustomer && (
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-lg p-3 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
            Hasil Pencarian ({searchResults.length} Warga Ditemukan):
          </div>
          {searchResults.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelectWarga(c)}
              className="w-full text-left p-3 hover:bg-emerald-50 rounded-xl transition-colors flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                  {c.nama}
                </div>
                <div className="text-[11px] text-slate-500">
                  {c.nomorRumah} · {c.rt} / {c.rw} · {c.kategori}
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Pilih →
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Selected Customer Bill Details */}
      {selectedCustomer && (
        <div className="space-y-5">
          
          {/* Card Info Warga */}
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-emerald-700 font-semibold mb-0.5">
                Data Warga Terpilih:
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedCustomer.nama}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedCustomer.nomorRumah} · {selectedCustomer.rt} / {selectedCustomer.rw} · {selectedCustomer.kategori}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCustomer(null);
                setSearchQuery('');
              }}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cari Warga Lain
            </button>
          </div>

          {/* Current Bill Status Box */}
          <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tagihan Bulan Berjalan
                </span>
                <span className="text-sm font-bold text-slate-900">
                  Periode {activePeriod}
                </span>
              </div>

              {currentBill?.status === 'Lunas' ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>LUNAS</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span>BELUM LUNAS</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="text-xs text-slate-500 block">Total Iuran Sampah:</span>
                <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  Rp {selectedCustomer.tarifBulanan.toLocaleString('id-ID')}
                </span>
              </div>

              {currentBill?.status === 'Lunas' ? (
                <div className="text-xs text-slate-600 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                  <div>Terbayar pada: <strong className="font-mono">{currentBill.tanggalBayar}</strong></div>
                  <div>Terima kasih atas partisipasi aktif menjaga kebersihan lingkungan kita!</div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmPaymentWA}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konfirmasi Pembayaran via WhatsApp</span>
                </button>
              )}
            </div>

            {/* Payment instructions if unpaid */}
            {currentBill?.status !== 'Lunas' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                <span className="font-bold text-slate-800 block">
                  Cara Pembayaran Iuran Sampah:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>Transfer Bank (BPD Bali)</span>
                    </div>
                    <div className="font-mono text-slate-900 font-bold">010-02-00-12345</div>
                    <div className="text-[11px] text-slate-500">an. BUPDA Padangsambian</div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span>QRIS Seluruh Bank & Dompet Digital</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Scan QRIS pada pos penarikan sampah atau kuitansi petugas RT setempat
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment History for this customer */}
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-emerald-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Riwayat Pembayaran Anda ({residentPayments.length} Transaksi)
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {residentPayments.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Belum ada riwayat pembayaran yang tercatat dalam sistem.
                </div>
              ) : (
                residentPayments.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{p.periodeBulan}</div>
                      <div className="text-[11px] text-slate-500">
                        {p.tanggalBayar} · Metode: {p.metodePembayaran}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Kuitansi #{p.id}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-emerald-700">
                        Rp {p.nominal.toLocaleString('id-ID')}
                      </span>
                      <button
                        type="button"
                        onClick={() => onViewReceipt(p)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Unduh Kuitansi</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Switch to Admin Mode */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={onAdminLoginRequested}
          className="text-xs text-slate-500 hover:text-emerald-700 underline"
        >
          Masuk sebagai Petugas RT / Admin Pengelola
        </button>
      </div>

    </div>
  );
};

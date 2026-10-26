import React, { useState } from 'react';
import {
  Search,
  Plus,
  Receipt,
  Printer,
  Trash2,
  Calendar,
  Wallet
} from 'lucide-react';
import { PaymentRecord, PaymentMethod, Customer } from '../types';

interface PaymentHistoryProps {
  payments: PaymentRecord[];
  customers: Customer[];
  onOpenPaymentModal: () => void;
  onViewReceipt: (payment: PaymentRecord) => void;
  onDeletePayment: (paymentId: string) => void;
  isAdminOrPetugas: boolean;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  payments,
  customers,
  onOpenPaymentModal,
  onViewReceipt,
  onDeletePayment,
  isAdminOrPetugas
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [paymentToDelete, setPaymentToDelete] = useState<PaymentRecord | null>(null);

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const query = searchTerm.toLowerCase();
    const matchSearch =
      payment.customerName.toLowerCase().includes(query) ||
      payment.nomorRumah.toLowerCase().includes(query) ||
      payment.id.toLowerCase().includes(query) ||
      (payment.noReferensi && payment.noReferensi.toLowerCase().includes(query));

    if (!matchSearch) return false;

    if (selectedMonth !== 'ALL' && payment.periodeBulan !== selectedMonth) return false;

    if (selectedMethod !== 'ALL' && payment.metodePembayaran !== selectedMethod) return false;

    return true;
  });

  // Calculate total collected for the filtered set
  const totalFilteredNominal = filteredPayments.reduce((acc, curr) => acc + curr.nominal, 0);

  // Unique months in payments
  const uniqueMonths = Array.from(new Set(payments.map(p => p.periodeBulan))).sort().reverse();

  const customerMap = new Map<string, Customer>();
  customers.forEach(c => customerMap.set(c.id, c));

  const handleShareWhatsApp = (payment: PaymentRecord) => {
    const cust = customerMap.get(payment.customerId);
    const phone = cust?.noHp || '';
    const cleanPhone = phone.replace(/^0/, '62').replace(/[^0-9]/g, '');

    const message = `*BUKTI PEMBAYARAN IURAN SAMPAH LUNAS*
BUPDA Padangsambian
------------------------------------
No. Kuitansi : ${payment.id}
Nama Warga   : ${payment.customerName}
Nomor Rumah  : ${payment.nomorRumah} (${payment.rt})
Periode      : ${payment.periodeBulan}
Nominal      : Rp ${payment.nominal.toLocaleString('id-ID')}
Metode       : ${payment.metodePembayaran}
Tanggal      : ${payment.tanggalBayar}
Petugas      : ${payment.petugasPenerima}
------------------------------------
Terima kasih telah membayar iuran kebersihan tepat waktu!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-4">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Riwayat Pembayaran & Kuitansi
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>Total Transaksi: <strong className="font-mono text-slate-800">{payments.length}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Terkumpul: <strong className="font-mono text-emerald-700">Rp {payments.reduce((sum, p) => sum + p.nominal, 0).toLocaleString('id-ID')}</strong></span>
          </div>
        </div>

        {isAdminOrPetugas && (
          <button
            type="button"
            onClick={onOpenPaymentModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Pembayaran Baru</span>
          </button>
        )}
      </div>

      {/* Filter and Search Ribbon */}
      <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama warga, nomor kuitansi, atau referensi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* Month Filter */}
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="ALL">Semua Periode Bulan</option>
              {uniqueMonths.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Method Filter */}
          <div>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="ALL">Semua Metode Pembayaran</option>
              <option value="Tunai">Tunai</option>
              <option value="QRIS">QRIS</option>
              <option value="Transfer Bank">Transfer Bank</option>
            </select>
          </div>

        </div>

        {/* Live Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-600 bg-emerald-50/50 px-3 py-2 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2">
            <Wallet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Hasil Filter: <strong>{filteredPayments.length} transaksi</strong></span>
          </div>
          <div className="font-mono font-bold text-emerald-800">
            Total Masuk: Rp {totalFilteredNominal.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-50/70 border-b border-emerald-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">No. Kuitansi</th>
                <th className="py-3 px-4">Tanggal & Waktu</th>
                <th className="py-3 px-4">Nama Warga</th>
                <th className="py-3 px-4">Periode</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4">Metode & Petugas</th>
                <th className="py-3 px-4 text-center">Struk / Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-600" />
                    <p className="text-xs font-medium text-slate-600">Belum ada riwayat pembayaran yang cocok.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-emerald-50/30 transition-colors">
                      {/* ID */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {p.id}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{p.tanggalBayar}</span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{p.customerName}</div>
                        <div className="text-[11px] text-slate-500">
                          {p.nomorRumah} · {p.rt}
                        </div>
                      </td>

                      {/* Periode */}
                      <td className="py-3 px-4 font-medium text-slate-700">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-mono">
                          {p.periodeBulan}
                        </span>
                      </td>

                      {/* Nominal */}
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-emerald-700">
                        Rp {p.nominal.toLocaleString('id-ID')}
                      </td>

                      {/* Method & Officer */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{p.metodePembayaran}</div>
                        <div className="text-[11px] text-slate-500">Petugas: {p.petugasPenerima}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {/* View & Print Receipt */}
                          <button
                            type="button"
                            onClick={() => onViewReceipt(p)}
                            title="Buka Kuitansi Resmi"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                          >
                            <Printer className="w-3 h-3 text-emerald-600" />
                            <span>Kuitansi</span>
                          </button>

                          {/* Share WA */}
                          <button
                            type="button"
                            onClick={() => handleShareWhatsApp(p)}
                            title="Kirim Struk via WhatsApp"
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-slate-200"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete if admin */}
                          {isAdminOrPetugas && (
                            <button
                              type="button"
                              onClick={() => setPaymentToDelete(p)}
                              title="Hapus Transaksi"
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-4 py-3 bg-slate-50/70 border-t border-emerald-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Menampilkan <strong className="font-mono">{filteredPayments.length}</strong> transaksi pembayaran</span>
          <span className="text-[11px] text-slate-400">Tercatat secara transparan & akuntabel</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {paymentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Batalkan / Hapus Transaksi</h4>
            <p className="text-xs text-slate-600">
              Apakah Anda ingin menghapus pembayaran <strong>{paymentToDelete.id}</strong> ({paymentToDelete.customerName} - Rp {paymentToDelete.nominal.toLocaleString('id-ID')})? Status tagihan warga akan kembali menjadi Belum Lunas.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPaymentToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeletePayment(paymentToDelete.id);
                  setPaymentToDelete(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Hapus Transaksi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

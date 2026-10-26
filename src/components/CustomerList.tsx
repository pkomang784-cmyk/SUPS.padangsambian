import React, { useState } from 'react';
import {
  Search,
  Plus,
  FileSpreadsheet,
  Edit2,
  Trash2,
  Receipt,
  MessageCircle,
  CheckCircle2,
  Clock,
  Phone,
  Home
} from 'lucide-react';
import { Customer, MonthlyBill, CustomerCategory } from '../types';

interface CustomerListProps {
  customers: Customer[];
  monthlyBills: MonthlyBill[];
  activePeriod: string;
  onOpenAddModal: () => void;
  onOpenEditModal: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onOpenImportExport: () => void;
  onQuickPay: (customer: Customer) => void;
  isAdminOrPetugas: boolean;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  monthlyBills,
  activePeriod,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteCustomer,
  onOpenImportExport,
  onQuickPay,
  isAdminOrPetugas
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRt, setSelectedRt] = useState('ALL');
  const [selectedKategori, setSelectedKategori] = useState('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('ALL');
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  // Compute bill map for quick status lookup
  const billMap = new Map<string, MonthlyBill>();
  monthlyBills.forEach(b => billMap.set(b.customerId, b));

  // Filter customers
  const filteredCustomers = customers.filter(cust => {
    // Search
    const query = searchTerm.toLowerCase();
    const matchSearch =
      cust.nama.toLowerCase().includes(query) ||
      cust.nomorRumah.toLowerCase().includes(query) ||
      cust.id.toLowerCase().includes(query) ||
      cust.noHp.includes(query) ||
      (cust.nik && cust.nik.includes(query));

    if (!matchSearch) return false;

    // RT filter
    if (selectedRt !== 'ALL' && cust.rt !== selectedRt) return false;

    // Category filter
    if (selectedKategori !== 'ALL' && cust.kategori !== selectedKategori) return false;

    // Payment status filter
    if (selectedPaymentStatus !== 'ALL') {
      const bill = billMap.get(cust.id);
      const isPaid = bill?.status === 'Lunas';
      if (selectedPaymentStatus === 'LUNAS' && !isPaid) return false;
      if (selectedPaymentStatus === 'BELUM' && isPaid) return false;
    }

    return true;
  });

  const handleSendWhatsApp = (cust: Customer) => {
    const cleanPhone = cust.noHp.replace(/^0/, '62').replace(/[^0-9]/g, '');
    const bill = billMap.get(cust.id);
    const isPaid = bill?.status === 'Lunas';

    const text = isPaid
      ? `Halo Bapak/Ibu ${cust.nama} (${cust.nomorRumah}), terima kasih! Pembayaran iuran sampah BUPDA Padangsambian periode ${activePeriod} Anda sudah terverifikasi LUNAS.`
      : `Halo Bapak/Ibu ${cust.nama} (${cust.nomorRumah}), pemberitahuan iuran kebersihan dan pengangkutan sampah BUPDA Padangsambian periode ${activePeriod} sebesar Rp ${cust.tarifBulanan.toLocaleString('id-ID')} belum terlunasi. Mohon dapat diselesaikan melalui petugas RT atau transfer/QRIS BUPDA. Terima kasih!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      onDeleteCustomer(customerToDelete.id);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Data Pelanggan Warga
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>Total Terdaftar: <strong className="font-mono text-slate-800">{customers.length}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Aktif: <strong className="font-mono text-emerald-700">{customers.filter(c => c.status === 'Aktif').length}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Nonaktif: <strong className="font-mono text-slate-500">{customers.filter(c => c.status === 'Nonaktif').length}</strong></span>
          </div>
        </div>

        {isAdminOrPetugas && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenImportExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors shrink-0"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Impor / Ekspor</span>
            </button>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Warga</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Ribbon */}
      <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          
          {/* Search Bar */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama warga, no. rumah, atau no. WA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          {/* RT Filter */}
          <div>
            <select
              value={selectedRt}
              onChange={(e) => setSelectedRt(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="ALL">Semua RT (Padangsambian)</option>
              <option value="RT 01">RT 01</option>
              <option value="RT 02">RT 02</option>
              <option value="RT 03">RT 03</option>
              <option value="RT 04">RT 04</option>
              <option value="RT 05">RT 05</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="ALL">Status Iuran ({activePeriod})</option>
              <option value="LUNAS">Sudah Lunas</option>
              <option value="BELUM">Belum Lunas / Tunggakan</option>
            </select>
          </div>

        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 shrink-0">Kategori:</span>
          {['ALL', 'Rumah Tangga', 'Usaha / Toko', 'Kost / Kontrakan'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedKategori(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedKategori === cat
                  ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua Tipe' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-50/70 border-b border-emerald-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Warga / ID</th>
                <th className="py-3 px-4">Alamat & RT</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Tarif Bulanan</th>
                <th className="py-3 px-4 text-center">Status Iuran ({activePeriod})</th>
                <th className="py-3 px-4">No. WhatsApp</th>
                {isAdminOrPetugas && <th className="py-3 px-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={isAdminOrPetugas ? 7 : 6} className="py-12 text-center text-slate-400">
                    <Home className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-600" />
                    <p className="text-xs font-medium text-slate-600">Tidak ada data warga yang cocok dengan kriteria pencarian.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Coba sesuaikan kata kunci atau reset filter Anda.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const bill = billMap.get(cust.id);
                  const isPaid = bill?.status === 'Lunas';

                  return (
                    <tr key={cust.id} className="hover:bg-emerald-50/30 transition-colors">
                      {/* Name and ID */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{cust.nama}</div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {cust.id} {cust.nik && `· ${cust.nik}`}
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{cust.nomorRumah}</div>
                        <div className="text-[11px] text-slate-500">{cust.rt} / {cust.rw}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="text-slate-700">{cust.kategori}</span>
                        {cust.status === 'Nonaktif' && (
                          <span className="block text-[10px] text-rose-600 font-medium">Nonaktif</span>
                        )}
                      </td>

                      {/* Monthly Rate */}
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-800">
                        Rp {cust.tarifBulanan.toLocaleString('id-ID')}
                      </td>

                      {/* Billing Status for Active Period */}
                      <td className="py-3 px-4 text-center">
                        {cust.status === 'Nonaktif' ? (
                          <span className="text-[11px] text-slate-400 italic">Bebas Iuran</span>
                        ) : isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Lunas</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Belum Bayar</span>
                          </span>
                        )}
                      </td>

                      {/* WhatsApp / Phone */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{cust.noHp}</span>
                        </div>
                      </td>

                      {/* Action buttons */}
                      {isAdminOrPetugas && (
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            
                            {/* Quick Pay */}
                            {!isPaid && cust.status === 'Aktif' && (
                              <button
                                type="button"
                                onClick={() => onQuickPay(cust)}
                                title="Catat Pembayaran Iuran"
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-2xs"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* WhatsApp reminder / receipt */}
                            <button
                              type="button"
                              onClick={() => handleSendWhatsApp(cust)}
                              title="Kirim Pesan WhatsApp"
                              className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Customer */}
                            <button
                              type="button"
                              onClick={() => onOpenEditModal(cust)}
                              title="Edit Data Pelanggan"
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Customer */}
                            <button
                              type="button"
                              onClick={() => setCustomerToDelete(cust)}
                              title="Hapus Data Pelanggan"
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>
                      )}

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 bg-slate-50/70 border-t border-emerald-100 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Menampilkan <strong className="font-mono">{filteredCustomers.length}</strong> dari total {customers.length} warga</span>
          <span className="text-[11px] text-slate-400">Pembaruan iuran sampah real-time</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Konfirmasi Hapus Warga</h4>
            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menghapus data warga <strong>{customerToDelete.nama}</strong> ({customerToDelete.nomorRumah})? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

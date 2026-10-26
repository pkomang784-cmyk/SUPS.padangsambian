import React, { useState, useEffect } from 'react';
import { X, Check, QrCode, Banknote, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Customer, PaymentMethod, PaymentRecord } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  activePeriod: string;
  onSavePayment: (paymentData: Omit<PaymentRecord, 'id' | 'tanggalBayar'>) => PaymentRecord;
  preselectedCustomerId?: string;
  onViewReceipt: (payment: PaymentRecord) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  customers,
  activePeriod,
  onSavePayment,
  preselectedCustomerId,
  onViewReceipt
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [periodeBulan, setPeriodeBulan] = useState(activePeriod);
  const [nominal, setNominal] = useState(25000);
  const [metodePembayaran, setMetodePembayaran] = useState<PaymentMethod>('Tunai');
  const [petugasPenerima, setPetugasPenerima] = useState('Petugas BUPDA');
  const [catatan, setCatatan] = useState('');
  const [noReferensi, setNoReferensi] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoOpenReceipt, setAutoOpenReceipt] = useState(true);

  // Available billing months
  const months = [
    { value: '2026-08', label: 'Agustus 2026' },
    { value: '2026-09', label: 'September 2026' },
    { value: '2026-10', label: 'Oktober 2026 (Bulan Ini)' },
    { value: '2026-11', label: 'November 2026 (Maju 1 Bulan)' },
    { value: '2026-12', label: 'Desember 2026 (Maju 2 Bulan)' }
  ];

  useEffect(() => {
    if (preselectedCustomerId) {
      setSelectedCustomerId(preselectedCustomerId);
    } else if (customers.length > 0 && !selectedCustomerId) {
      setSelectedCustomerId(customers[0].id);
    }
  }, [preselectedCustomerId, customers, isOpen]);

  // Adjust tariff when customer changes
  useEffect(() => {
    const cust = customers.find(c => c.id === selectedCustomerId);
    if (cust) {
      setNominal(cust.tarifBulanan);
    }
  }, [selectedCustomerId, customers]);

  if (!isOpen) return null;

  const currentCustomer = customers.find(c => c.id === selectedCustomerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) return;

    const newPayment = onSavePayment({
      customerId: currentCustomer.id,
      customerName: currentCustomer.nama,
      nomorRumah: currentCustomer.nomorRumah,
      rt: currentCustomer.rt,
      periodeBulan,
      nominal: Number(nominal),
      metodePembayaran,
      petugasPenerima,
      catatan: catatan.trim() || undefined,
      noReferensi: noReferensi.trim() || undefined
    });

    // Confetti effect
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    onClose();

    if (autoOpenReceipt) {
      setTimeout(() => {
        onViewReceipt(newPayment);
      }, 150);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.status === 'Aktif' && (
      c.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nomorRumah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-100 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Catat Pembayaran Iuran Sampah
            </h3>
            <p className="text-xs text-emerald-800">
              Penerimaan iuran warga langsung terbit kuitansi digital
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Customer Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Warga / Pelanggan <span className="text-rose-500">*</span>
            </label>
            
            {/* Quick search input */}
            <input
              type="text"
              placeholder="Cari nama / no. rumah warga..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-2 bg-slate-50"
            />

            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 bg-white"
              required
            >
              {filteredCustomers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.nama} ({c.nomorRumah}, {c.rt}) - Rp {c.tarifBulanan.toLocaleString('id-ID')}
                </option>
              ))}
            </select>

            {currentCustomer && (
              <div className="mt-2 p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-[11px] text-slate-700 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-emerald-950">{currentCustomer.nama}</span>
                  <span className="text-slate-500 ml-1.5">({currentCustomer.kategori})</span>
                </div>
                <span className="font-mono font-bold text-emerald-700">
                  Tarif: Rp {currentCustomer.tarifBulanan.toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>

          {/* Billing Period & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Periode Tagihan <span className="text-rose-500">*</span>
              </label>
              <select
                value={periodeBulan}
                onChange={(e) => setPeriodeBulan(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                required
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nominal Iuran (Rp) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono">Rp</span>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={nominal}
                  onChange={(e) => setNominal(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono tabular-nums bg-white font-bold text-slate-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Metode Pembayaran <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMetodePembayaran('Tunai')}
                className={`p-2.5 rounded-xl border text-xs flex flex-col items-center justify-center gap-1 transition-colors ${
                  metodePembayaran === 'Tunai'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Tunai</span>
              </button>

              <button
                type="button"
                onClick={() => setMetodePembayaran('QRIS')}
                className={`p-2.5 rounded-xl border text-xs flex flex-col items-center justify-center gap-1 transition-colors ${
                  metodePembayaran === 'QRIS'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>QRIS</span>
              </button>

              <button
                type="button"
                onClick={() => setMetodePembayaran('Transfer Bank')}
                className={`p-2.5 rounded-xl border text-xs flex flex-col items-center justify-center gap-1 transition-colors ${
                  metodePembayaran === 'Transfer Bank'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Transfer</span>
              </button>
            </div>
          </div>

          {/* Petugas & No Referensi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Petugas Penerima
              </label>
              <input
                type="text"
                value={petugasPenerima}
                onChange={(e) => setPetugasPenerima(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. Referensi / Bukti Trf
              </label>
              <input
                type="text"
                placeholder="Contoh: QRIS-9921 atau CASH-01"
                value={noReferensi}
                onChange={(e) => setNoReferensi(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
              />
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Pembayaran (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Titip di pos ronda RT 01"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          {/* Checkbox Auto Open Receipt */}
          <label className="flex items-center gap-2 pt-1 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={autoOpenReceipt}
              onChange={(e) => setAutoOpenReceipt(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Langsung buka dan cetak kuitansi setelah disimpan</span>
          </label>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Konfirmasi & Simpan Pembayaran</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

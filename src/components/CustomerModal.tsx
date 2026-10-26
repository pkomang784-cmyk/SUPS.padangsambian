import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Customer, CustomerCategory, CustomerStatus } from '../types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: Omit<Customer, 'id' | 'tanggalDaftar'>, customerId?: string) => void;
  customerToEdit?: Customer | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customerToEdit
}) => {
  const [nama, setNama] = useState('');
  const [nomorRumah, setNomorRumah] = useState('');
  const [rt, setRt] = useState('RT 01');
  const [rw, setRw] = useState('RW 04');
  const [kategori, setKategori] = useState<CustomerCategory>('Rumah Tangga');
  const [tarifBulanan, setTarifBulanan] = useState(25000);
  const [noHp, setNoHp] = useState('');
  const [nik, setNik] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('Aktif');
  const [alamatLengkap, setAlamatLengkap] = useState('');
  const [catatan, setCatatan] = useState('');
  const [error, setError] = useState('');

  // Default rates based on category
  const categoryRates: Record<CustomerCategory, number> = {
    'Rumah Tangga': 25000,
    'Usaha / Toko': 50000,
    'Kost / Kontrakan': 100000,
    'Industri Kecil': 150000
  };

  useEffect(() => {
    if (customerToEdit) {
      setNama(customerToEdit.nama);
      setNomorRumah(customerToEdit.nomorRumah);
      setRt(customerToEdit.rt);
      setRw(customerToEdit.rw);
      setKategori(customerToEdit.kategori);
      setTarifBulanan(customerToEdit.tarifBulanan);
      setNoHp(customerToEdit.noHp);
      setNik(customerToEdit.nik || '');
      setStatus(customerToEdit.status);
      setAlamatLengkap(customerToEdit.alamatLengkap || '');
      setCatatan(customerToEdit.catatan || '');
    } else {
      // Reset form
      setNama('');
      setNomorRumah('');
      setRt('RT 01');
      setRw('RW 04');
      setKategori('Rumah Tangga');
      setTarifBulanan(25000);
      setNoHp('');
      setNik('');
      setStatus('Aktif');
      setAlamatLengkap('');
      setCatatan('');
    }
    setError('');
  }, [customerToEdit, isOpen]);

  const handleCategoryChange = (newCat: CustomerCategory) => {
    setKategori(newCat);
    // Suggest default tariff if not custom edited
    if (!customerToEdit) {
      setTarifBulanan(categoryRates[newCat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError('Nama pelanggan wajib diisi.');
      return;
    }
    if (!nomorRumah.trim()) {
      setError('Nomor rumah/blok wajib diisi.');
      return;
    }
    if (!noHp.trim()) {
      setError('Nomor WhatsApp wajib diisi untuk notifikasi tagihan otomatis.');
      return;
    }
    if (tarifBulanan <= 0) {
      setError('Tarif iuran bulanan harus lebih besar dari 0.');
      return;
    }

    onSave(
      {
        nama: nama.trim(),
        nomorRumah: nomorRumah.trim(),
        rt,
        rw,
        kategori,
        tarifBulanan,
        noHp: noHp.trim(),
        nik: nik.trim() || undefined,
        status,
        alamatLengkap: alamatLengkap.trim() || undefined,
        catatan: catatan.trim() || undefined
      },
      customerToEdit?.id
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-100 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {customerToEdit ? 'Edit Data Pelanggan Warga' : 'Tambah Pelanggan Baru'}
            </h3>
            <p className="text-xs text-emerald-800">
              {customerToEdit ? `Mengubah data ${customerToEdit.id}` : 'Registrasi warga untuk layanan pengangkutan sampah'}
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
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Nama & NIK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap / KK <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: I Wayan Sudarma"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIK (Opsional)
              </label>
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="16 digit NIK KTP"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* Nomor Rumah */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              No. Rumah <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={nomorRumah}
              onChange={(e) => setNomorRumah(e.target.value)}
              placeholder="No. 12A / B-05"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              required
            />
          </div>

          {/* Kategori & Tarif Bulanan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Pelanggan
              </label>
              <select
                value={kategori}
                onChange={(e) => handleCategoryChange(e.target.value as CustomerCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="Rumah Tangga">Rumah Tangga (Standar)</option>
                <option value="Usaha / Toko">Usaha / Toko / Warung</option>
                <option value="Kost / Kontrakan">Kost / Kontrakan</option>
                <option value="Industri Kecil">Industri Kecil / Workshop</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tarif Bulanan (Rp) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono">Rp</span>
                <input
                  type="number"
                  min="5000"
                  step="1000"
                  value={tarifBulanan}
                  onChange={(e) => setTarifBulanan(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono tabular-nums bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Nomor WhatsApp & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                placeholder="081234567890"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono bg-white"
                required
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Digunakan untuk notifikasi tagihan otomatis
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Keaktifan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CustomerStatus)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="Aktif">Aktif (Wajib Iuran)</option>
                <option value="Nonaktif">Nonaktif (Rumah Kosong / Pindah)</option>
              </select>
            </div>
          </div>

          {/* Alamat Lengkap & Catatan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Lengkap / Patokan Jalan
            </label>
            <input
              type="text"
              value={alamatLengkap}
              onChange={(e) => setAlamatLengkap(e.target.value)}
              placeholder="Contoh: Jl. Padangsambian Asri No. 12A"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Pengangkutan (Opsional)
            </label>
            <textarea
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Sampah ditaruh depan garasi, sudah pilah botol"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            />
          </div>

          {/* Action Buttons */}
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
              <Save className="w-3.5 h-3.5" />
              <span>{customerToEdit ? 'Simpan Perubahan' : 'Daftarkan Warga'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

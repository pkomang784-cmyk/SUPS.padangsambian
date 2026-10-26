import React, { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { Customer, MonthlyBill } from '../types';
import { storageService } from '../services/storageService';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  monthlyBills: MonthlyBill[];
  onImportSuccess: (importedCustomers: Customer[]) => void;
  activePeriod: string;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  customers,
  monthlyBills,
  onImportSuccess,
  activePeriod
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  
  // Import states
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedPreview, setImportedPreview] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccessMessage, setImportSuccessMessage] = useState('');
  
  // Export states
  const [exportFormat, setExportFormat] = useState<'xlsx' | 'csv'>('xlsx');
  const [exportFilter, setExportFilter] = useState<'all' | 'active' | 'unpaid'>('all');

  if (!isOpen) return null;

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportErrors([]);
    setImportSuccessMessage('');

    try {
      const rawRows = await storageService.parseFile(file);
      if (!rawRows || rawRows.length === 0) {
        setImportErrors(['File tidak berisi data atau format tidak sesuai.']);
        setIsProcessing(false);
        return;
      }

      // Map rows to Customer format
      const errors: string[] = [];
      const parsed: any[] = [];

      rawRows.forEach((row: any, idx: number) => {
        const rowNum = idx + 2; // header is row 1
        // Look for common column name variants
        const nama = row['Nama'] || row['nama'] || row['Nama Lengkap'] || row['Nama Warga'];
        const nomorRumah = row['Nomor Rumah'] || row['No Rumah'] || row['nomorRumah'] || row['Alamat'];
        const rt = row['RT'] || row['rt'] || 'RT 01';
        const rw = row['RW'] || row['rw'] || 'RW 04';
        const kategori = row['Kategori'] || row['kategori'] || 'Rumah Tangga';
        const tarifBulanan = Number(row['Tarif Bulanan'] || row['Tarif'] || row['tarifBulanan'] || 25000);
        const noHp = String(row['No WhatsApp'] || row['No HP'] || row['noHp'] || row['Telepon'] || '');
        const nik = row['NIK'] ? String(row['NIK']) : undefined;
        const catatan = row['Catatan'] || '';

        if (!nama) {
          errors.push(`Baris ${rowNum}: Kolom Nama kosong.`);
          return;
        }
        if (!nomorRumah) {
          errors.push(`Baris ${rowNum}: Kolom Nomor Rumah kosong.`);
          return;
        }

        parsed.push({
          nama: String(nama).trim(),
          nomorRumah: String(nomorRumah).trim(),
          rt: String(rt).trim(),
          rw: String(rw).trim(),
          kategori: kategori,
          tarifBulanan: isNaN(tarifBulanan) || tarifBulanan <= 0 ? 25000 : tarifBulanan,
          noHp: noHp ? noHp.replace(/[^0-9]/g, '') : '081200000000',
          nik,
          status: 'Aktif' as const,
          tanggalDaftar: new Date().toISOString().split('T')[0],
          catatan: catatan ? String(catatan).trim() : undefined
        });
      });

      setImportErrors(errors);
      setImportedPreview(parsed);
    } catch (err: any) {
      setImportErrors([`Gagal membaca file: ${err.message || 'Format tidak didukung'}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Commit imported rows
  const handleCommitImport = () => {
    if (importedPreview.length === 0) return;

    const existing = storageService.getCustomers();
    const existingNextNum = existing.length + 1;
    
    const newCustomers: Customer[] = importedPreview.map((item, index) => ({
      ...item,
      id: `PLG-${String(existingNextNum + index).padStart(3, '0')}`
    }));

    const combined = [...existing, ...newCustomers];
    storageService.saveCustomers(combined);
    setImportSuccessMessage(`Berhasil mengimpor ${newCustomers.length} data pelanggan baru!`);
    setImportedPreview([]);
    onImportSuccess(combined);
  };

  // Download Sample Template CSV
  const handleDownloadTemplate = () => {
    const sampleCsv = storageService.generateSampleDataCSV();
    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template-import-iuran-sampah.csv';
    link.click();
  };

  // Execute Export
  const handleExport = () => {
    let filtered = [...customers];
    
    if (exportFilter === 'active') {
      filtered = filtered.filter(c => c.status === 'Aktif');
    } else if (exportFilter === 'unpaid') {
      const unpaidCustomerIds = new Set(
        monthlyBills.filter(b => b.status === 'Belum Lunas').map(b => b.customerId)
      );
      filtered = filtered.filter(c => unpaidCustomerIds.has(c.id));
    }

    const exportRows = filtered.map(c => {
      const bill = monthlyBills.find(b => b.customerId === c.id);
      return {
        'ID Pelanggan': c.id,
        'Nama Kepala Keluarga': c.nama,
        'Nomor Rumah': c.nomorRumah,
        'RT': c.rt,
        'RW': c.rw,
        'Kategori': c.kategori,
        'Tarif Bulanan (Rp)': c.tarifBulanan,
        'No WhatsApp': c.noHp,
        'Status Warga': c.status,
        [`Status Iuran (${activePeriod})`]: bill ? bill.status : 'Belum Ditagih',
        'Tanggal Bayar': bill?.tanggalBayar || '-',
        'Catatan': c.catatan || ''
      };
    });

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Data_Pelanggan_Sampah_BUPDA_${activePeriod}_${timestamp}.${exportFormat}`;

    if (exportFormat === 'xlsx') {
      storageService.exportToExcel(exportRows, filename);
    } else {
      storageService.exportToCSV(exportRows, filename);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-emerald-100 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Impor & Ekspor Data Pelanggan Warga
              </h3>
              <p className="text-xs text-slate-500">
                Format spreadsheet kompatibel dengan Microsoft Excel dan Google Sheets
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-6 pt-3 gap-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'import'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Impor Data (Excel / CSV)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Data Pelanggan</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: IMPORT */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              
              {/* Instructions & Template Download */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <div className="text-xs text-slate-700">
                  <div className="font-semibold text-emerald-900 mb-0.5">Format Kolom yang Dibutuhkan:</div>
                  <div className="text-slate-600">
                    Nama, Nomor Rumah, RT, RW, Kategori, Tarif Bulanan, No WhatsApp, NIK
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-white hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors shrink-0 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Unduh Template CSV</span>
                </button>
              </div>

              {/* Upload Zone */}
              <div className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-emerald-50/30 rounded-2xl p-6 text-center transition-colors">
                <input
                  type="file"
                  id="excel-file-input"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="excel-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800">
                    Klik untuk pilih file Excel (.xlsx, .xls) atau CSV
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Maksimal 5.000 baris data sekaligus
                  </div>
                </label>
              </div>

              {/* Errors if any */}
              {importErrors.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5 text-rose-900">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Catatan Pemeriksaan Data ({importErrors.length} baris perlu dicek):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-700 max-h-24 overflow-y-auto">
                    {importErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success Message */}
              {importSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{importSuccessMessage}</span>
                </div>
              )}

              {/* Data Preview */}
              {importedPreview.length > 0 && (
                <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>Pratinjau Data Warga ({importedPreview.length} baris siap diimpor)</span>
                    <button
                      type="button"
                      onClick={() => setImportedPreview([])}
                      className="text-slate-400 hover:text-slate-600 text-[11px]"
                    >
                      Batal
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 text-slate-600 font-semibold sticky top-0">
                        <tr>
                          <th className="p-2">Nama</th>
                          <th className="p-2">No. Rumah</th>
                          <th className="p-2">RT</th>
                          <th className="p-2">Kategori</th>
                          <th className="p-2 text-right">Tarif</th>
                          <th className="p-2">No. WA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {importedPreview.slice(0, 10).map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 font-medium text-slate-800">{row.nama}</td>
                            <td className="p-2 text-slate-600">{row.nomorRumah}</td>
                            <td className="p-2 text-slate-600">{row.rt}</td>
                            <td className="p-2 text-slate-600">{row.kategori}</td>
                            <td className="p-2 text-right font-mono text-slate-700">Rp {row.tarifBulanan.toLocaleString('id-ID')}</td>
                            <td className="p-2 font-mono text-slate-600">{row.noHp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {importedPreview.length > 10 && (
                    <div className="text-[10px] text-slate-500 text-center">
                      + Menampilkan 10 dari total {importedPreview.length} baris
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleCommitImport}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Simpan Semua ke Database ({importedPreview.length} Warga)</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-slate-700 space-y-1">
                <div className="font-semibold text-emerald-900">Ringkasan Ekspor:</div>
                <div>Total data pelanggan saat ini: <strong className="font-mono">{customers.length} warga</strong></div>
                <div>Status tagihan akan disesuaikan dengan periode berjalan: <strong className="font-mono">{activePeriod}</strong></div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pilih Format File
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="exportFormat"
                        value="xlsx"
                        checked={exportFormat === 'xlsx'}
                        onChange={() => setExportFormat('xlsx')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-slate-800">Microsoft Excel (.xlsx)</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="exportFormat"
                        value="csv"
                        checked={exportFormat === 'csv'}
                        onChange={() => setExportFormat('csv')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span className="font-medium text-slate-800">File CSV Kompatibel (.csv)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Filter Data yang Diekspor
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="exportFilter"
                        value="all"
                        checked={exportFilter === 'all'}
                        onChange={() => setExportFilter('all')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-medium text-slate-800">Semua Warga ({customers.length})</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="exportFilter"
                        value="active"
                        checked={exportFilter === 'active'}
                        onChange={() => setExportFilter('active')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-medium text-slate-800">Hanya Warga Aktif ({customers.filter(c => c.status === 'Aktif').length})</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="exportFilter"
                        value="unpaid"
                        checked={exportFilter === 'unpaid'}
                        onChange={() => setExportFilter('unpaid')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-medium text-slate-800">Hanya Warga Belum Lunas ({monthlyBills.filter(b => b.status === 'Belum Lunas').length})</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File Sekarang ({exportFormat.toUpperCase()})</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};

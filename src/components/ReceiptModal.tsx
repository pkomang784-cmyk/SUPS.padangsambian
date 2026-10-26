import React from 'react';
import { X, Printer, Share2, CheckCircle2 } from 'lucide-react';
import { PaymentRecord, Customer } from '../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentRecord | null;
  customer?: Customer;
}

// Helper to convert number to Indonesian words
function terbilangRupiah(n: number): string {
  const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  
  function toWords(num: number): string {
    if (num < 12) return bilangan[num];
    if (num < 20) return `${toWords(num - 10)} Belas`;
    if (num < 100) return `${toWords(Math.floor(num / 10))} Puluh ${toWords(num % 10)}`.trim();
    if (num < 200) return `Seratus ${toWords(num - 100)}`.trim();
    if (num < 1000) return `${toWords(Math.floor(num / 100))} Ratus ${toWords(num % 100)}`.trim();
    if (num < 2000) return `Seribu ${toWords(num - 1000)}`.trim();
    if (num < 1000000) return `${toWords(Math.floor(num / 1000))} Ribu ${toWords(num % 1000)}`.trim();
    if (num < 1000000000) return `${toWords(Math.floor(num / 1000000))} Juta ${toWords(num % 1000000)}`.trim();
    return String(num);
  }

  return `${toWords(n)} Rupiah`;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
  customer
}) => {
  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const phone = customer?.noHp || '';
    const cleanPhone = phone.replace(/^0/, '62').replace(/[^0-9]/g, '');
    const message = `*BUKTI PEMBAYARAN IURAN SAMPAH*
BUPDA Padangsambian - Lingkungan Bersih & Sehat
----------------------------------------
No. Kuitansi : ${payment.id}
Nama Warga   : ${payment.customerName}
Alamat/Rumah : ${payment.nomorRumah} (${payment.rt})
Periode      : ${payment.periodeBulan}
Nominal      : Rp ${payment.nominal.toLocaleString('id-ID')}
Status       : LUNAS (${payment.metodePembayaran})
Tgl Bayar    : ${payment.tanggalBayar}
Petugas      : ${payment.petugasPenerima}
No. Referensi: ${payment.noReferensi || '-'}
----------------------------------------
_Terima kasih atas kontribusi Anda menjaga kebersihan dan kelestarian lingkungan kita!_`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-emerald-100 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header toolbar */}
        <div className="px-6 py-3 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">Kuitansi Pembayaran Resmi</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              title="Kirim ke WhatsApp Warga"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              title="Cetak Kuitansi"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Card Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          
          <div
            id="printable-receipt"
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs text-slate-900 space-y-5"
          >
            {/* Logo and Brand Header */}
            <div className="text-center pb-4 border-b border-slate-200 space-y-2">
              <div className="h-14 w-auto mx-auto inline-flex items-center justify-center">
                <img
                  src="/assets/aistudio/ChatGPT_Image_8_Jun_2026__11.31.32_c8c40564.png"
                  alt="Logo BUPDA Padangsambian"
                  className="h-14 object-contain rounded-md"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-tight text-emerald-950">
                  PENGELOLAAN SAMPAH BUPDA PADANGSAMBIAN
                </h2>
                <p className="text-[11px] text-slate-600">
                  Kecilkan Sampah, Jaga Bumi Kita · Bersama Kita Bisa Lingkungan Bersih
                </p>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Padangsambian, Denpasar Barat, Bali
                </div>
              </div>
            </div>

            {/* Receipt Identification */}
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">No. Kuitansi</span>
                <span className="font-mono font-bold text-slate-900">{payment.id}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Tanggal & Waktu</span>
                <span className="font-mono text-slate-800">{payment.tanggalBayar}</span>
              </div>
            </div>

            {/* Resident Details */}
            <div className="bg-emerald-50/50 rounded-lg p-3.5 border border-emerald-100 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Warga:</span>
                <span className="font-semibold text-slate-900">{payment.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Alamat / Rumah:</span>
                <span className="font-medium text-slate-800">{payment.nomorRumah} ({payment.rt})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Periode Tagihan:</span>
                <span className="font-semibold text-emerald-800">{payment.periodeBulan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Metode Pembayaran:</span>
                <span className="font-medium text-slate-800">{payment.metodePembayaran}</span>
              </div>
              {payment.noReferensi && (
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">No. Referensi:</span>
                  <span className="font-mono text-slate-700">{payment.noReferensi}</span>
                </div>
              )}
            </div>

            {/* Amount & Terbilang */}
            <div className="border-t border-b border-slate-200 py-3.5 space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase text-slate-600">Total Dibayar:</span>
                <span className="text-lg font-bold font-mono text-emerald-700 tabular-nums">
                  Rp {payment.nominal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 italic">
                Terbilang: &quot;{terbilangRupiah(payment.nominal)}&quot;
              </div>
            </div>

            {/* Notes if any */}
            {payment.catatan && (
              <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-md">
                <strong>Catatan:</strong> {payment.catatan}
              </div>
            )}

            {/* Signatures & Verification */}
            <div className="pt-2 flex items-end justify-between text-[11px] text-slate-600">
              <div className="space-y-1 text-center">
                <div className="text-[10px] text-slate-400">Penyetor / Warga</div>
                <div className="h-12 flex items-end justify-center font-semibold text-slate-800">
                  ( {payment.customerName.split(' ')[0]} )
                </div>
              </div>

              {/* Status Stamp */}
              <div className="border-2 border-dashed border-emerald-500 rounded-lg px-3 py-1 text-center rotate-[-4deg]">
                <span className="text-xs font-black tracking-widest text-emerald-600 uppercase">
                  ✓ LUNAS
                </span>
              </div>

              <div className="space-y-1 text-center">
                <div className="text-[10px] text-slate-400">Petugas Penerima</div>
                <div className="h-12 flex items-end justify-center font-semibold text-slate-800">
                  ( {payment.petugasPenerima} )
                </div>
              </div>
            </div>

            {/* Eco reminder footer */}
            <div className="text-[10px] text-center text-slate-400 pt-3 border-t border-slate-100">
              Pilah sampah Anda: Organik, Anorganik, Kertas, dan Berbahaya untuk mewujudkan lingkungan yang sehat.
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { Recycle, Calendar, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export const WasteSchedule: React.FC = () => {
  const collectionSchedules = [
    {
      day: 'Senin',
      type: 'Sampah Organik (Sisa Makanan, Sayur & Daun)',
      color: 'border-emerald-300 bg-emerald-50/50 text-emerald-900',
      badge: 'bg-emerald-600 text-white',
      time: '06:00 - 09:00 WITA',
      zones: 'RT 01, RT 02, RT 03, RT 04, RT 05'
    },
    {
      day: 'Selasa',
      type: 'Sampah Anorganik (Plastik, Botol & Kaleng)',
      color: 'border-amber-300 bg-amber-50/50 text-amber-900',
      badge: 'bg-amber-500 text-white',
      time: '07:00 - 10:00 WITA',
      zones: 'RT 01, RT 02, RT 03'
    },
    {
      day: 'Rabu',
      type: 'Kertas, Kardus & Bank Sampah Daur Ulang',
      color: 'border-blue-300 bg-blue-50/50 text-blue-900',
      badge: 'bg-blue-600 text-white',
      time: '08:00 - 12:00 WITA',
      zones: 'Semua RT (Penimbangan Bank Sampah)'
    },
    {
      day: 'Kamis',
      type: 'Sampah Organik (Sisa Makanan & Sampah Dapur)',
      color: 'border-emerald-300 bg-emerald-50/50 text-emerald-900',
      badge: 'bg-emerald-600 text-white',
      time: '06:00 - 09:00 WITA',
      zones: 'RT 01, RT 02, RT 03, RT 04, RT 05'
    },
    {
      day: 'Jumat',
      type: 'Sampah Anorganik & Residu Non-Organik',
      color: 'border-amber-300 bg-amber-50/50 text-amber-900',
      badge: 'bg-amber-500 text-white',
      time: '07:00 - 10:00 WITA',
      zones: 'RT 04 & RT 05'
    },
    {
      day: 'Sabtu',
      type: 'Sampah Berbahaya (B3) & Sampah Taman Besar',
      color: 'border-rose-300 bg-rose-50/50 text-rose-900',
      badge: 'bg-rose-600 text-white',
      time: '08:00 - 11:00 WITA',
      zones: 'Berdasarkan Pengajuan Khusus Petugas'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Recycle className="w-5 h-5 text-emerald-600" />
          <span>Jadwal Pengangkutan & Edukasi Pilah Sampah</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Program Swakelola Sampah Mandiri BUPDA Padangsambian
        </p>
      </div>

      {/* Visual Logo Banner */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2">
          <img
            src="/assets/aistudio/ChatGPT_Image_8_Jun_2026__11.31.32_c8c40564.png"
            alt="Infografis Pengelolaan Sampah BUPDA Padangsambian"
            className="w-full h-auto rounded-2xl shadow-sm border border-emerald-100 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kecilkan Sampah, Jaga Bumi Kita</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 leading-snug">
            3 Langkah Mudah Menjaga Lingkungan Bersih
          </h3>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold shrink-0">1</span>
              <div>
                <strong className="text-slate-900">PILAH:</strong> Pisahkan sampah sejak dari dapur sesuai 4 jenis wadah tempat sampah.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold shrink-0">2</span>
              <div>
                <strong className="text-slate-900">DAUR ULANG:</strong> Manfaatkan kembali sampah bernilai ekonomis (plastik, botol, kardus) ke Bank Sampah.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold shrink-0">3</span>
              <div>
                <strong className="text-slate-900">MANFAATKAN:</strong> Ubah sampah organik menjadi kompos tanaman untuk halaman hijau asri.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Bin Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Bin 1: Organik */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
            🌿
          </div>
          <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
            WADAH HIJAU · ORGANIK
          </h4>
          <p className="text-xs text-slate-600">
            Sisa makanan dapur, sayur mayur, kulit buah, nasi, daun kering, sisa upacara/canang bunga.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-emerald-700">
            ✓ Diolah menjadi pupuk kompos desa
          </div>
        </div>

        {/* Bin 2: Anorganik */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
            🥤
          </div>
          <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
            WADAH KUNING · ANORGANIK
          </h4>
          <p className="text-xs text-slate-600">
            Botol plastik kemasan, gelas air mineral, kaleng minuman, kemasan sachet, kresek bersih.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-amber-700">
            ✓ Dicacah & didaur ulang industri
          </div>
        </div>

        {/* Bin 3: Kertas */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            📰
          </div>
          <h4 className="text-xs font-extrabold text-blue-950 uppercase tracking-wide">
            WADAH BIRU · KERTAS
          </h4>
          <p className="text-xs text-slate-600">
            Kardus coklat, kertas berkas, majalah, koran lama, buku tulis bekas, karton telur.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-blue-700">
            ✓ Nilai jual tinggi di Bank Sampah
          </div>
        </div>

        {/* Bin 4: Berbahaya */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-sm">
            ⚠️
          </div>
          <h4 className="text-xs font-extrabold text-rose-950 uppercase tracking-wide">
            WADAH MERAH · BERBAHAYA (B3)
          </h4>
          <p className="text-xs text-slate-600">
            Baterai bekas, lampu neon, botol racun serangga, obat kadaluarsa, pecahan kaca tajam.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-rose-700">
            ✓ Pengelolaan khusus keamanan
          </div>
        </div>

      </div>

      {/* Weekly Schedule Table */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Jadwal Truk & Armada Pengangkutan Sampah Warga
            </h3>
          </div>
          <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Armada BUPDA Padangsambian
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {collectionSchedules.map((item, idx) => (
            <div
              key={idx}
              className="p-4 hover:bg-emerald-50/20 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${item.badge}`}>
                  {item.day}
                </span>
                <div>
                  <div className="font-semibold text-slate-900">{item.type}</div>
                  <div className="text-[11px] text-slate-500">Wilayah: {item.zones}</div>
                </div>
              </div>

              <div className="font-mono font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-lg self-end sm:self-auto">
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

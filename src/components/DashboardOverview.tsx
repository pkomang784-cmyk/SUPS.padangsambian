import React, { useMemo } from 'react';
import {
  Users,
  Wallet,
  Clock,
  CheckCircle2,
  Receipt,
  BellRing,
  ArrowRight,
  Sparkles,
  BarChart3,
  TrendingUp,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { Customer, MonthlyBill, PaymentRecord } from '../types';

interface DashboardOverviewProps {
  customers: Customer[];
  monthlyBills: MonthlyBill[];
  payments: PaymentRecord[];
  activePeriod: string;
  onNavigate: (tab: string) => void;
  onOpenPaymentModal: () => void;
  onViewReceipt: (payment: PaymentRecord) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  customers,
  monthlyBills,
  payments,
  activePeriod,
  onNavigate,
  onOpenPaymentModal,
  onViewReceipt
}) => {
  const activeCustomers = customers.filter(c => c.status === 'Aktif');
  
  // Calculate stats for active period
  const totalTargetNominal = activeCustomers.reduce((acc, c) => acc + c.tarifBulanan, 0);
  
  const currentMonthPayments = payments.filter(p => p.periodeBulan === activePeriod);
  const collectedNominal = currentMonthPayments.reduce((acc, p) => acc + p.nominal, 0);

  const paidBillsCount = monthlyBills.filter(b => b.status === 'Lunas').length;
  const unpaidBillsCount = monthlyBills.filter(b => {
    const cust = customers.find(c => c.id === b.customerId);
    return b.status === 'Belum Lunas' && cust?.status === 'Aktif';
  }).length;

  const percentageCollected = totalTargetNominal > 0
    ? Math.min(100, Math.round((collectedNominal / totalTargetNominal) * 100))
    : 0;

  const totalAllTimeRevenue = payments.reduce((acc, p) => acc + p.nominal, 0);

  // Compute 6-Month Historical Revenue for Recharts Bar Chart
  const sixMonthsData = useMemo(() => {
    const [currYear, currMonth] = activePeriod.split('-').map(Number);
    const monthsList = [];
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const fullMonthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    for (let i = 5; i >= 0; i--) {
      let m = currMonth - i;
      let y = currYear;
      while (m <= 0) {
        m += 12;
        y -= 1;
      }
      const periodKey = `${y}-${String(m).padStart(2, '0')}`;
      const monthPayments = payments.filter(p => p.periodeBulan === periodKey);
      const totalRevenue = monthPayments.reduce((sum, p) => sum + p.nominal, 0);
      const transactionCount = monthPayments.length;

      monthsList.push({
        periodKey,
        monthName: `${monthNames[m - 1]} '${String(y).slice(-2)}`,
        fullMonth: `${fullMonthNames[m - 1]} ${y}`,
        pendapatan: totalRevenue,
        transaksi: transactionCount
      });
    }
    return monthsList;
  }, [payments, activePeriod]);

  // Summary figures for 6 months
  const total6MonthsRevenue = sixMonthsData.reduce((acc, m) => acc + m.pendapatan, 0);
  const avgMonthlyRevenue = Math.round(total6MonthsRevenue / 6);
  const maxMonth = [...sixMonthsData].sort((a, b) => b.pendapatan - a.pendapatan)[0];

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-md text-xs space-y-1">
          <div className="font-bold text-slate-900">{data.fullMonth}</div>
          <div className="text-emerald-700 font-mono font-bold text-sm">
            Rp {Number(payload[0].value).toLocaleString('id-ID')}
          </div>
          <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{data.transaksi} transaksi tercatat</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Eco Banner featuring BUPDA Padangsambian Logo and Mission */}
      <div className="relative rounded-3xl bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-950 p-6 sm:p-8 text-white overflow-hidden shadow-lg border border-emerald-700">
        
        {/* Soft background glow & organic curves */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -top-10 w-60 h-60 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Pengelolaan Sampah Berbasis Komunitas Warga</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Kecilkan Sampah, Jaga Bumi Kita
            </h1>
            
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Selamat datang di Sistem Pencatatan Iuran dan Layanan Kebersihan Warga BUPDA Padangsambian. Pantau pemasukan kas kebersihan, riwayat pembayaran warga secara transparan, serta kirim tagihan bulanan otomatis via WhatsApp.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenPaymentModal}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Receipt className="w-4 h-4" />
                <span>+ Catat Pembayaran Baru</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('notifications')}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl transition-colors border border-white/20 inline-flex items-center gap-1.5"
              >
                <BellRing className="w-4 h-4" />
                <span>Kirim Notifikasi ({unpaidBillsCount} Belum Bayar)</span>
              </button>
            </div>
          </div>

          {/* Banner Logo Showcase */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="bg-white/95 p-3 rounded-2xl shadow-xl border border-white/40 max-w-[280px] w-full text-center">
              <img
                src="/assets/aistudio/ChatGPT_Image_8_Jun_2026__11.31.32_c8c40564.png"
                alt="Banner Pengelolaan Sampah"
                className="w-full h-auto object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div className="text-[11px] font-bold text-emerald-950 mt-2">
                BUPDA PADANGSAMBIAN
              </div>
              <div className="text-[10px] text-slate-500">
                Pilah · Daur Ulang · Manfaatkan
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Warga */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Warga Terdaftar</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {customers.length} <span className="text-xs font-normal text-slate-500">KK</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Aktif: <strong className="text-emerald-700">{activeCustomers.length}</strong></span>
            <span>Nonaktif: {customers.length - activeCustomers.length}</span>
          </div>
        </div>

        {/* Card 2: Terkumpul Bulan Ini */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Iuran Terkumpul ({activePeriod})</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            Rp {collectedNominal.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Target: Rp {totalTargetNominal.toLocaleString('id-ID')}</span>
            <span className="font-mono font-bold text-emerald-700">{percentageCollected}%</span>
          </div>
        </div>

        {/* Card 3: Warga Lunas vs Tunggakan */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Status Kelunasan</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {paidBillsCount} <span className="text-xs font-normal text-emerald-600 font-bold">Lunas</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span className="text-amber-700 font-medium">{unpaidBillsCount} Warga Belum Bayar</span>
            <button
              type="button"
              onClick={() => onNavigate('notifications')}
              className="text-emerald-700 hover:underline font-semibold"
            >
              Notif WA →
            </button>
          </div>
        </div>

        {/* Card 4: Total Kas Keseluruhan */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Total Kas Terkumpul</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            Rp {totalAllTimeRevenue.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Dari {payments.length} transaksi pembayaran
          </div>
        </div>

      </div>

      {/* NEW: Recharts Bar Chart - Total Monthly Revenue Collected Over Last 6 Months */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs space-y-4">
        
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Grafik Penerimaan Iuran 6 Bulan Terakhir
              </h3>
              <p className="text-xs text-slate-500">
                Tren pemasukan kas kebersihan dan pengelolaan sampah BUPDA Padangsambian
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-3 text-xs">
            <div className="bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-100 text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rata-rata: <strong className="font-mono text-emerald-900">Rp {avgMonthlyRevenue.toLocaleString('id-ID')}</strong>/bln</span>
            </div>
            {maxMonth && (
              <div className="hidden md:flex bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Puncak: <strong className="font-semibold text-slate-900">{maxMonth.fullMonth}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Recharts Bar Chart Container */}
        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sixMonthsData}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="mintBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.75} />
                </linearGradient>
                <linearGradient id="activeMonthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#047857" stopOpacity={1} />
                  <stop offset="100%" stopColor="#065f46" stopOpacity={0.9} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              
              <XAxis
                dataKey="monthName"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              />

              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(val: number) => `Rp ${(val / 1000).toFixed(0)}k`}
                width={70}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />

              <Bar
                dataKey="pendapatan"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              >
                {sixMonthsData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.periodKey === activePeriod ? 'url(#activeMonthGradient)' : 'url(#mintBarGradient)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend / Footnote */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
              <span>Bulan Sebelumnya</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-800 inline-block" />
              <span>Bulan Aktif ({activePeriod})</span>
            </div>
          </div>
          <div className="font-mono text-slate-600">
            Total 6 Bulan: <strong className="text-emerald-800">Rp {total6MonthsRevenue.toLocaleString('id-ID')}</strong>
          </div>
        </div>

      </div>

      {/* Monthly Collection Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900">Progres Pelunasan Iuran Sampah Periode {activePeriod}</span>
            <span className="text-slate-500 ml-2">({paidBillsCount} dari {activeCustomers.length} warga aktif)</span>
          </div>
          <span className="font-mono font-bold text-emerald-700">{percentageCollected}% Terkumpul</span>
        </div>
        
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentageCollected}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Terkumpul: <strong>Rp {collectedNominal.toLocaleString('id-ID')}</strong></span>
          <span>Tunggakan: <strong className="text-rose-600">Rp {(totalTargetNominal - collectedNominal > 0 ? totalTargetNominal - collectedNominal : 0).toLocaleString('id-ID')}</strong></span>
        </div>
      </div>

      {/* Waste Sorting Infographic (Directly Grounded in User's Logo) */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Panduan 4 Jenis Pemilahan Sampah Warga
            </h3>
            <p className="text-xs text-slate-500">
              Sesuai standar operasional BUPDA Padangsambian untuk menjaga lingkungan tetap sehat
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('schedule')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Lihat Jadwal Angkut</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Bin 1: Organik (Hijau) */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 shrink-0" />
              <h4 className="text-xs font-bold text-emerald-950 uppercase">ORGANIK</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Sisa makanan, daun gugur, sayuran, sisa canang/bunga upacara, sisa buah.
            </p>
            <div className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-1 rounded">
              Jadwal: Senin & Kamis
            </div>
          </div>

          {/* Bin 2: Anorganik (Kuning) */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0" />
              <h4 className="text-xs font-bold text-amber-950 uppercase">ANORGANIK</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Botol plastik, kaleng minuman, kemasan sachet, kresek bersih, kaca.
            </p>
            <div className="text-[10px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-1 rounded">
              Jadwal: Selasa & Jumat
            </div>
          </div>

          {/* Bin 3: Kertas (Biru) */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-600 shrink-0" />
              <h4 className="text-xs font-bold text-blue-950 uppercase">KERTAS & KARDUS</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Kardus paket, kertas koran, buku bekas, majalah, karton telur.
            </p>
            <div className="text-[10px] font-semibold text-blue-800 bg-blue-100/70 px-2 py-1 rounded">
              Jadwal: Rabu (Daur Ulang)
            </div>
          </div>

          {/* Bin 4: Berbahaya (Merah) */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-600 shrink-0" />
              <h4 className="text-xs font-bold text-rose-950 uppercase">BERBAHAYA (B3)</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Baterai bekas, lampu neon, botol racun serangga, obat kadaluarsa, elektronik.
            </p>
            <div className="text-[10px] font-semibold text-rose-800 bg-rose-100/70 px-2 py-1 rounded">
              Jadwal: Sabtu Pertama
            </div>
          </div>

        </div>
      </div>

      {/* Recent Payments Section */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Transaksi Pembayaran Terbaru
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('payments')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Semua Riwayat ({payments.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {payments.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="p-3.5 hover:bg-emerald-50/20 transition-colors flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-900">{p.customerName}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>{p.nomorRumah} ({p.rt})</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{p.periodeBulan}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">{p.tanggalBayar}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-700 tabular-nums">
                    Rp {p.nominal.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-slate-500">{p.metodePembayaran}</div>
                </div>

                <button
                  type="button"
                  onClick={() => onViewReceipt(p)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                >
                  Struk
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

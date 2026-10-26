import React, { useState } from 'react';
import {
  BellRing,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Phone,
  RotateCcw,
  History
} from 'lucide-react';
import { Customer, MonthlyBill, NotificationLog, NotificationTemplate } from '../types';
import { storageService } from '../services/storageService';

interface AutomaticBillingNotificationProps {
  customers: Customer[];
  monthlyBills: MonthlyBill[];
  activePeriod: string;
  setActivePeriod: (period: string) => void;
  notificationLogs: NotificationLog[];
  onRefreshLogs: () => void;
}

export const AutomaticBillingNotification: React.FC<AutomaticBillingNotificationProps> = ({
  customers,
  monthlyBills,
  activePeriod,
  setActivePeriod,
  notificationLogs,
  onRefreshLogs
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState('tpl-1');
  const [customMessage, setCustomMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [currentSendingName, setCurrentSendingName] = useState('');
  const [broadcastCompleteMessage, setBroadcastCompleteMessage] = useState('');

  const templates: NotificationTemplate[] = storageService.getTemplates();
  const currentTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  // Map customers
  const customerMap = new Map<string, Customer>();
  customers.forEach(c => customerMap.set(c.id, c));

  // Find all unpaid active residents for the current period
  const unpaidBills = monthlyBills.filter(b => {
    const cust = customerMap.get(b.customerId);
    return b.status === 'Belum Lunas' && cust?.status === 'Aktif';
  });

  const totalUnpaidNominal = unpaidBills.reduce((acc, curr) => acc + curr.nominal, 0);

  // Helper to interpolate message template
  const formatNotificationMessage = (bill: MonthlyBill, cust: Customer): string => {
    const rawTemplate = customMessage || currentTemplate.template;
    return rawTemplate
      .replace(/{nama_warga}/g, cust.nama)
      .replace(/{nomor_rumah}/g, cust.nomorRumah)
      .replace(/{rt_rw}/g, `${cust.rt}/${cust.rw}`)
      .replace(/{periode}/g, bill.periodeFormatted)
      .replace(/{nominal}/g, bill.nominal.toLocaleString('id-ID'))
      .replace(/{jatuh_tempo}/g, bill.jatuhTempo);
  };

  // Click-to-WhatsApp link for a single resident
  const handleSendSingleWhatsApp = (bill: MonthlyBill) => {
    const cust = customerMap.get(bill.customerId);
    if (!cust) return;

    const message = formatNotificationMessage(bill, cust);
    const cleanPhone = cust.noHp.replace(/^0/, '62').replace(/[^0-9]/g, '');

    // Record into log
    storageService.addNotificationLog({
      customerId: cust.id,
      customerName: cust.nama,
      noHp: cust.noHp,
      periode: bill.periodeFormatted,
      pesan: message.slice(0, 120) + '...',
      status: 'Terkirim',
      channel: 'WhatsApp'
    });

    onRefreshLogs();
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Automated Batch Broadcast Simulation
  const handleStartAutoBroadcast = async () => {
    if (unpaidBills.length === 0) return;

    setIsBroadcasting(true);
    setBroadcastProgress(0);
    setBroadcastCompleteMessage('');

    for (let i = 0; i < unpaidBills.length; i++) {
      const bill = unpaidBills[i];
      const cust = customerMap.get(bill.customerId);
      if (!cust) continue;

      setCurrentSendingName(`${cust.nama} (${cust.nomorRumah})`);
      
      // Delay simulation per resident
      await new Promise(resolve => setTimeout(resolve, 600));

      const message = formatNotificationMessage(bill, cust);

      storageService.addNotificationLog({
        customerId: cust.id,
        customerName: cust.nama,
        noHp: cust.noHp,
        periode: bill.periodeFormatted,
        pesan: message.slice(0, 120) + '...',
        status: 'Terkirim',
        channel: 'WhatsApp'
      });

      setBroadcastProgress(Math.round(((i + 1) / unpaidBills.length) * 100));
    }

    setIsBroadcasting(false);
    setCurrentSendingName('');
    setBroadcastCompleteMessage(`Notifikasi tagihan otomatis berhasil dikirimkan ke ${unpaidBills.length} nomor WhatsApp warga!`);
    onRefreshLogs();
  };

  // Preview message for first unpaid customer
  const sampleCustomer = unpaidBills.length > 0 ? customerMap.get(unpaidBills[0].customerId) : customers[0];
  const sampleBill = unpaidBills.length > 0 ? unpaidBills[0] : monthlyBills[0];
  const previewText = sampleCustomer && sampleBill ? formatNotificationMessage(sampleBill, sampleCustomer) : '';

  return (
    <div className="space-y-5">
      
      {/* Header and Period Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BellRing className="w-5 h-5 text-emerald-600" />
            <span>Pusat Notifikasi Tagihan Bulanan Otomatis</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kirimkan pengingat iuran sampah terjadwal ke WhatsApp warga secara otomatis
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Periode Tagihan:</span>
          <select
            value={activePeriod}
            onChange={(e) => setActivePeriod(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
          >
            <option value="2026-09">September 2026</option>
            <option value="2026-10">Oktober 2026 (Aktif)</option>
            <option value="2026-11">November 2026</option>
          </select>
        </div>
      </div>

      {/* KPI Cards: Unpaid Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Warga Belum Lunas
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
              {unpaidBills.length} <span className="text-xs font-normal text-slate-500">warga</span>
            </div>
            <div className="text-[11px] text-amber-700 font-medium">
              Perlu notifikasi pengingat
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Iuran Belum Masuk
            </div>
            <div className="text-xl font-bold font-mono text-rose-600 tabular-nums">
              Rp {totalUnpaidNominal.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-slate-500">
              Periode {activePeriod}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Otomasi WhatsApp
            </div>
            <div className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
              Aktif (100%)
            </div>
            <div className="text-[11px] text-emerald-700">
              Format wa.me auto-generate
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Template Config & Unpaid Residents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Template & Automated Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Pengaturan Pesan Otomatis
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                WhatsApp API Ready
              </span>
            </div>

            {/* Template Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Pola Kalimat / Template
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => {
                  setSelectedTemplateId(e.target.value);
                  setCustomMessage('');
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.nama}</option>
                ))}
              </select>
            </div>

            {/* Editable Template Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Draf Teks Notifikasi (Bisa diedit)
                </label>
                {customMessage && (
                  <button
                    type="button"
                    onClick={() => setCustomMessage('')}
                    className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset ke Asli</span>
                  </button>
                )}
              </div>
              <textarea
                rows={7}
                value={customMessage || currentTemplate.template}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed bg-slate-50/50"
              />
              <div className="text-[10px] text-slate-400 mt-1">
                Variabel otomatis: <code className="text-emerald-700">&#123;nama_warga&#125;</code>, <code className="text-emerald-700">&#123;nomor_rumah&#125;</code>, <code className="text-emerald-700">&#123;nominal&#125;</code>, <code className="text-emerald-700">&#123;periode&#125;</code>
              </div>
            </div>

            {/* Broadcast Action Box */}
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-emerald-600 text-white rounded-lg">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">
                    Kirim Notifikasi Otomatis Sekaligus
                  </h4>
                  <p className="text-[11px] text-emerald-800 leading-tight mt-0.5">
                    Sistem akan memproses pengiriman notifikasi pengingat ke {unpaidBills.length} warga yang belum bayar.
                  </p>
                </div>
              </div>

              {/* Progress bar when broadcasting */}
              {isBroadcasting && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                    <span>Sedang mengirim ke {currentSendingName}...</span>
                    <span className="font-mono">{broadcastProgress}%</span>
                  </div>
                  <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-300"
                      style={{ width: `${broadcastProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Success Alert */}
              {broadcastCompleteMessage && (
                <div className="p-2.5 bg-white border border-emerald-300 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{broadcastCompleteMessage}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleStartAutoBroadcast}
                disabled={isBroadcasting || unpaidBills.length === 0}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs ${
                  unpaidBills.length === 0
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isBroadcasting
                    ? 'Sedang Memproses Pengiriman...'
                    : unpaidBills.length === 0
                    ? 'Semua Warga Sudah Lunas!'
                    : `Jalankan Broadcast Otomatis (${unpaidBills.length} Warga)`}
                </span>
              </button>
            </div>

          </div>

          {/* Pratinjau Tampilan di Ponsel Warga */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pratinjau Pesan WhatsApp Warga
            </span>
            <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 text-[11px] text-slate-700 font-sans whitespace-pre-wrap leading-relaxed">
              {previewText}
            </div>
          </div>

        </div>

        {/* Right Column: Unpaid Residents List & Quick Direct Link (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/30">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Daftar Warga Menunggak Bulan Ini ({activePeriod})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Dapat dikirim manual per-warga atau sekali klik tombol broadcast
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                {unpaidBills.length} Warga Belum Lunas
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
              {unpaidBills.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                  <p className="text-xs font-bold text-emerald-900">Alhamdulillah! Semua Warga Telah Lunas</p>
                  <p className="text-[11px] text-slate-500">
                    Tidak ada tunggakan iuran sampah untuk periode {activePeriod}.
                  </p>
                </div>
              ) : (
                unpaidBills.map((bill) => {
                  const cust = customerMap.get(bill.customerId);
                  if (!cust) return null;

                  return (
                    <div
                      key={bill.id}
                      className="p-3.5 hover:bg-emerald-50/30 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900 truncate">
                            {cust.nama}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            {cust.kategori}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>{cust.nomorRumah} ({cust.rt})</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {cust.noHp}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-bold font-mono text-rose-600 tabular-nums">
                            Rp {bill.nominal.toLocaleString('id-ID')}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Tempo: {bill.jatuhTempo}
                          </div>
                        </div>

                        {/* Direct Send WA Button */}
                        <button
                          type="button"
                          onClick={() => handleSendSingleWhatsApp(bill)}
                          title="Buka WhatsApp & Kirim Tagihan"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Kirim WA</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
              <span>Batas toleransi penagihan RT: Setiap tanggal 20 tiap bulan</span>
              <span className="font-semibold text-slate-700">Bank Sampah & Iuran Lingkungan</span>
            </div>
          </div>

          {/* Log Riwayat Notifikasi Terkirim */}
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Log Riwayat Notifikasi Terkirim
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                {notificationLogs.length} pengiriman tercatat
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
              {notificationLogs.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  Belum ada log pengiriman notifikasi.
                </div>
              ) : (
                notificationLogs.slice(0, 15).map((log) => (
                  <div key={log.id} className="p-3 text-xs flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-800">
                        {log.customerName} <span className="font-mono text-slate-400 text-[11px]">({log.noHp})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-sm">
                        {log.pesan}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{log.status}</span>
                      </span>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {log.waktuKirim}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

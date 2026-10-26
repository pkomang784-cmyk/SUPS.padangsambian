import { Customer, PaymentRecord, NotificationLog, NotificationTemplate } from '../types';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'PLG-001',
    nik: '5171011204850001',
    nama: 'I Wayan Sudarma',
    nomorRumah: 'No. 12A',
    rt: 'RT 01',
    rw: 'RW 04',
    kategori: 'Rumah Tangga',
    tarifBulanan: 25000,
    noHp: '081234567890',
    status: 'Aktif',
    tanggalDaftar: '2025-01-10',
    alamatLengkap: 'Jl. Padangsambian Asri No. 12A',
    catatan: 'Rumah pribadi, tempat sampah depan pagar'
  },
  {
    id: 'PLG-002',
    nik: '5171012308900002',
    nama: 'Ni Made Ratnadi',
    nomorRumah: 'No. 15',
    rt: 'RT 01',
    rw: 'RW 04',
    kategori: 'Rumah Tangga',
    tarifBulanan: 25000,
    noHp: '081398765432',
    status: 'Aktif',
    tanggalDaftar: '2025-02-01',
    alamatLengkap: 'Jl. Padangsambian Asri No. 15',
    catatan: 'Sampah dipilah rutin organik & anorganik'
  },
  {
    id: 'PLG-003',
    nik: '5171011506780003',
    nama: 'Bambang Prasetyo',
    nomorRumah: 'No. 08',
    rt: 'RT 02',
    rw: 'RW 04',
    kategori: 'Rumah Tangga',
    tarifBulanan: 25000,
    noHp: '085712349876',
    status: 'Aktif',
    tanggalDaftar: '2025-01-15',
    alamatLengkap: 'Jl. Melati Hijau Blok B No. 08',
    catatan: ''
  },
  {
    id: 'PLG-004',
    nik: '5171010903820004',
    nama: 'Warung Bu Komang (Ni Nyoman Komang)',
    nomorRumah: 'No. 01 (Depan)',
    rt: 'RT 02',
    rw: 'RW 04',
    kategori: 'Usaha / Toko',
    tarifBulanan: 50000,
    noHp: '082145678901',
    status: 'Aktif',
    tanggalDaftar: '2025-01-20',
    alamatLengkap: 'Jl. Padangsambian Utama No. 01',
    catatan: 'Sampah warung makan diambil tiap pagi'
  },
  {
    id: 'PLG-005',
    nik: '5171012911950005',
    nama: 'I Ketut Darmawan',
    nomorRumah: 'No. 22B',
    rt: 'RT 03',
    rw: 'RW 04',
    kategori: 'Rumah Tangga',
    tarifBulanan: 25000,
    noHp: '087865432109',
    status: 'Aktif',
    tanggalDaftar: '2025-03-05',
    alamatLengkap: 'Gg. Cempaka Wangi No. 22B',
    catatan: ''
  },
  {
    id: 'PLG-006',
    nik: '5171010507880006',
    nama: 'Kost Griya Hijau (10 Pintu - Bpk. Hendra)',
    nomorRumah: 'No. 40',
    rt: 'RT 03',
    rw: 'RW 04',
    kategori: 'Kost / Kontrakan',
    tarifBulanan: 100000,
    noHp: '081298761234',
    status: 'Aktif',
    tanggalDaftar: '2025-02-14',
    alamatLengkap: 'Jl. Padangsambian Permai No. 40',
    catatan: 'Kost mahasiswa & karyawan'
  },
  {
    id: 'PLG-007',
    nik: '5171011802920007',
    nama: 'I Gede Suardika',
    nomorRumah: 'No. 07',
    rt: 'RT 04',
    rw: 'RW 04',
    kategori: 'Rumah Tangga',
    tarifBulanan: 25000,
    noHp: '085237890123',
    status: 'Aktif',
    tanggalDaftar: '2025-01-05',
    alamatLengkap: 'Jl. Padma Indah No. 07',
    catatan: ''
  },
  {
    id: 'PLG-008',
    nik: '5171012210810008',
    nama: 'Toko Kelontong Berkah (H. Syaiful)',
    nomorRumah: 'No. 33',
    rt: 'RT 04',
    rw: 'RW 04',
    kategori: 'Usaha / Toko',
    tarifBulanan: 40000,
    noHp: '081934567812',
    status: 'Aktif',
    tanggalDaftar: '2025-01-12',
    alamatLengkap: 'Jl. Padma Indah No. 33',
    catatan: 'Banyak kardus / kertas daur ulang'
  },
  {
    id: 'PLG-009',
    nik: '5171011109930009',
    nama: 'Agus Setiawan',
    nomorRumah: 'No. 18',
    rt: 'RT 05',
    rw: 'RW 04',
    kategori: 'Rumah Tangga',
    tarifBulanan: 25000,
    noHp: '087712345678',
    status: 'Aktif',
    tanggalDaftar: '2025-04-10',
    alamatLengkap: 'Jl. Taman Sari No. 18',
    catatan: ''
  },
  {
    id: 'PLG-010',
    nik: '5171010101800010',
    nama: 'Ida Bagus Putu Wijaya',
    nomorRumah: 'No. 05',
    rt: 'RT 05',
    rw: 'RW 04',
    kategori: 'Rumah Tangga',
    tarifBulanan: 25000,
    noHp: '081338901234',
    status: 'Nonaktif',
    tanggalDaftar: '2025-01-01',
    alamatLengkap: 'Jl. Taman Sari No. 05',
    catatan: 'Rumah kosong sementara, renovasi'
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'TRX-202610-001',
    customerId: 'PLG-001',
    customerName: 'I Wayan Sudarma',
    nomorRumah: 'No. 12A',
    rt: 'RT 01',
    periodeBulan: '2026-10',
    nominal: 25000,
    tanggalBayar: '2026-10-05 09:30:00',
    metodePembayaran: 'QRIS',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Bayar via QRIS BCA',
    noReferensi: 'QRIS-8934201'
  },
  {
    id: 'TRX-202610-002',
    customerId: 'PLG-002',
    customerName: 'Ni Made Ratnadi',
    nomorRumah: 'No. 15',
    rt: 'RT 01',
    periodeBulan: '2026-10',
    nominal: 25000,
    tanggalBayar: '2026-10-07 14:15:00',
    metodePembayaran: 'Tunai',
    petugasPenerima: 'Bpk. Ketut (Petugas RT)',
    catatan: 'Titip di pos ronda RT 01',
    noReferensi: 'CASH-002'
  },
  {
    id: 'TRX-202610-003',
    customerId: 'PLG-004',
    customerName: 'Warung Bu Komang (Ni Nyoman Komang)',
    nomorRumah: 'No. 01 (Depan)',
    rt: 'RT 02',
    periodeBulan: '2026-10',
    nominal: 50000,
    tanggalBayar: '2026-10-02 08:20:00',
    metodePembayaran: 'Tunai',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas awal bulan',
    noReferensi: 'CASH-004'
  },
  {
    id: 'TRX-202610-004',
    customerId: 'PLG-006',
    customerName: 'Kost Griya Hijau (10 Pintu - Bpk. Hendra)',
    nomorRumah: 'No. 40',
    rt: 'RT 03',
    periodeBulan: '2026-10',
    nominal: 100000,
    tanggalBayar: '2026-10-04 11:00:00',
    metodePembayaran: 'Transfer Bank',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Transfer via BPD Bali',
    noReferensi: 'TRF-BPD-5591'
  },
  {
    id: 'TRX-202610-005',
    customerId: 'PLG-008',
    customerName: 'Toko Kelontong Berkah (H. Syaiful)',
    nomorRumah: 'No. 33',
    rt: 'RT 04',
    periodeBulan: '2026-10',
    nominal: 40000,
    tanggalBayar: '2026-10-10 16:45:00',
    metodePembayaran: 'QRIS',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Pembayaran rutin via QRIS',
    noReferensi: 'QRIS-7712390'
  },
  // Previous month payments for history
  {
    id: 'TRX-202609-001',
    customerId: 'PLG-001',
    customerName: 'I Wayan Sudarma',
    nomorRumah: 'No. 12A',
    rt: 'RT 01',
    periodeBulan: '2026-09',
    nominal: 25000,
    tanggalBayar: '2026-09-06 10:00:00',
    metodePembayaran: 'Tunai',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'CASH-SEP-01'
  },
  {
    id: 'TRX-202609-002',
    customerId: 'PLG-003',
    customerName: 'Bambang Prasetyo',
    nomorRumah: 'No. 08',
    rt: 'RT 02',
    periodeBulan: '2026-09',
    nominal: 25000,
    tanggalBayar: '2026-09-12 17:30:00',
    metodePembayaran: 'Transfer Bank',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Transfer Mandiri',
    noReferensi: 'TRF-MDR-0902'
  },
  {
    id: 'TRX-202609-003',
    customerId: 'PLG-004',
    customerName: 'Warung Bu Komang (Ni Nyoman Komang)',
    nomorRumah: 'No. 01 (Depan)',
    rt: 'RT 02',
    periodeBulan: '2026-09',
    nominal: 50000,
    tanggalBayar: '2026-09-03 08:30:00',
    metodePembayaran: 'Tunai',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'CASH-SEP-03'
  },
  {
    id: 'TRX-202609-004',
    customerId: 'PLG-006',
    customerName: 'Kost Griya Hijau (10 Pintu - Bpk. Hendra)',
    nomorRumah: 'No. 40',
    rt: 'RT 03',
    periodeBulan: '2026-09',
    nominal: 100000,
    tanggalBayar: '2026-09-05 10:15:00',
    metodePembayaran: 'Transfer Bank',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Transfer BPD Bali',
    noReferensi: 'TRF-BPD-SEP04'
  },
  // Agustus 2026
  {
    id: 'TRX-202608-001',
    customerId: 'PLG-001',
    customerName: 'I Wayan Sudarma',
    nomorRumah: 'No. 12A',
    rt: 'RT 01',
    periodeBulan: '2026-08',
    nominal: 25000,
    tanggalBayar: '2026-08-06 09:10:00',
    metodePembayaran: 'QRIS',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'QRIS BCA',
    noReferensi: 'QRIS-AUG-01'
  },
  {
    id: 'TRX-202608-002',
    customerId: 'PLG-002',
    customerName: 'Ni Made Ratnadi',
    nomorRumah: 'No. 15',
    rt: 'RT 01',
    periodeBulan: '2026-08',
    nominal: 25000,
    tanggalBayar: '2026-08-08 14:00:00',
    metodePembayaran: 'Tunai',
    petugasPenerima: 'Bpk. Ketut (Petugas RT)',
    catatan: 'Lunas',
    noReferensi: 'CASH-AUG-02'
  },
  {
    id: 'TRX-202608-003',
    customerId: 'PLG-004',
    customerName: 'Warung Bu Komang (Ni Nyoman Komang)',
    nomorRumah: 'No. 01 (Depan)',
    rt: 'RT 02',
    periodeBulan: '2026-08',
    nominal: 50000,
    tanggalBayar: '2026-08-04 08:00:00',
    metodePembayaran: 'Tunai',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'CASH-AUG-03'
  },
  {
    id: 'TRX-202608-004',
    customerId: 'PLG-006',
    customerName: 'Kost Griya Hijau (10 Pintu - Bpk. Hendra)',
    nomorRumah: 'No. 40',
    rt: 'RT 03',
    periodeBulan: '2026-08',
    nominal: 100000,
    tanggalBayar: '2026-08-05 11:30:00',
    metodePembayaran: 'Transfer Bank',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Transfer BPD',
    noReferensi: 'TRF-AUG-04'
  },
  {
    id: 'TRX-202608-005',
    customerId: 'PLG-008',
    customerName: 'Toko Kelontong Berkah (H. Syaiful)',
    nomorRumah: 'No. 33',
    rt: 'RT 04',
    periodeBulan: '2026-08',
    nominal: 40000,
    tanggalBayar: '2026-08-11 16:00:00',
    metodePembayaran: 'QRIS',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'QRIS Lunas',
    noReferensi: 'QRIS-AUG-05'
  },
  // Juli 2026
  {
    id: 'TRX-202607-001',
    customerId: 'PLG-001',
    customerName: 'I Wayan Sudarma',
    nomorRumah: 'No. 12A',
    rt: 'RT 01',
    periodeBulan: '2026-07',
    nominal: 25000,
    tanggalBayar: '2026-07-05 10:20:00',
    metodePembayaran: 'QRIS',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'QRIS-JUL-01'
  },
  {
    id: 'TRX-202607-002',
    customerId: 'PLG-003',
    customerName: 'Bambang Prasetyo',
    nomorRumah: 'No. 08',
    rt: 'RT 02',
    periodeBulan: '2026-07',
    nominal: 25000,
    tanggalBayar: '2026-07-08 15:30:00',
    metodePembayaran: 'Transfer Bank',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'TRF-JUL-02'
  },
  {
    id: 'TRX-202607-003',
    customerId: 'PLG-004',
    customerName: 'Warung Bu Komang (Ni Nyoman Komang)',
    nomorRumah: 'No. 01 (Depan)',
    rt: 'RT 02',
    periodeBulan: '2026-07',
    nominal: 50000,
    tanggalBayar: '2026-07-03 09:00:00',
    metodePembayaran: 'Tunai',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'CASH-JUL-03'
  },
  {
    id: 'TRX-202607-004',
    customerId: 'PLG-006',
    customerName: 'Kost Griya Hijau (10 Pintu - Bpk. Hendra)',
    nomorRumah: 'No. 40',
    rt: 'RT 03',
    periodeBulan: '2026-07',
    nominal: 100000,
    tanggalBayar: '2026-07-07 10:00:00',
    metodePembayaran: 'Transfer Bank',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'TRF-JUL-04'
  },
  {
    id: 'TRX-202607-005',
    customerId: 'PLG-007',
    customerName: 'I Gede Suardika',
    nomorRumah: 'No. 07',
    rt: 'RT 04',
    periodeBulan: '2026-07',
    nominal: 25000,
    tanggalBayar: '2026-07-12 11:20:00',
    metodePembayaran: 'Tunai',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'CASH-JUL-05'
  },
  // Juni 2026
  {
    id: 'TRX-202606-001',
    customerId: 'PLG-001',
    customerName: 'I Wayan Sudarma',
    nomorRumah: 'No. 12A',
    rt: 'RT 01',
    periodeBulan: '2026-06',
    nominal: 25000,
    tanggalBayar: '2026-06-05 08:45:00',
    metodePembayaran: 'QRIS',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'QRIS-JUN-01'
  },
  {
    id: 'TRX-202606-002',
    customerId: 'PLG-004',
    customerName: 'Warung Bu Komang (Ni Nyoman Komang)',
    nomorRumah: 'No. 01 (Depan)',
    rt: 'RT 02',
    periodeBulan: '2026-06',
    nominal: 50000,
    tanggalBayar: '2026-06-04 09:15:00',
    metodePembayaran: 'Tunai',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'CASH-JUN-02'
  },
  {
    id: 'TRX-202606-003',
    customerId: 'PLG-006',
    customerName: 'Kost Griya Hijau (10 Pintu - Bpk. Hendra)',
    nomorRumah: 'No. 40',
    rt: 'RT 03',
    periodeBulan: '2026-06',
    nominal: 100000,
    tanggalBayar: '2026-06-06 13:00:00',
    metodePembayaran: 'Transfer Bank',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'TRF-JUN-03'
  },
  {
    id: 'TRX-202606-004',
    customerId: 'PLG-008',
    customerName: 'Toko Kelontong Berkah (H. Syaiful)',
    nomorRumah: 'No. 33',
    rt: 'RT 04',
    periodeBulan: '2026-06',
    nominal: 40000,
    tanggalBayar: '2026-06-09 15:40:00',
    metodePembayaran: 'QRIS',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'QRIS-JUN-04'
  },
  // Mei 2026
  {
    id: 'TRX-202605-001',
    customerId: 'PLG-001',
    customerName: 'I Wayan Sudarma',
    nomorRumah: 'No. 12A',
    rt: 'RT 01',
    periodeBulan: '2026-05',
    nominal: 25000,
    tanggalBayar: '2026-05-07 09:30:00',
    metodePembayaran: 'Tunai',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'CASH-MAY-01'
  },
  {
    id: 'TRX-202605-002',
    customerId: 'PLG-004',
    customerName: 'Warung Bu Komang (Ni Nyoman Komang)',
    nomorRumah: 'No. 01 (Depan)',
    rt: 'RT 02',
    periodeBulan: '2026-05',
    nominal: 50000,
    tanggalBayar: '2026-05-05 08:30:00',
    metodePembayaran: 'Tunai',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'CASH-MAY-02'
  },
  {
    id: 'TRX-202605-003',
    customerId: 'PLG-006',
    customerName: 'Kost Griya Hijau (10 Pintu - Bpk. Hendra)',
    nomorRumah: 'No. 40',
    rt: 'RT 03',
    periodeBulan: '2026-05',
    nominal: 100000,
    tanggalBayar: '2026-05-08 10:20:00',
    metodePembayaran: 'Transfer Bank',
    petugasPenerima: 'Admin BUPDA',
    catatan: 'Lunas',
    noReferensi: 'TRF-MAY-03'
  }
];

export const INITIAL_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl-1',
    nama: 'Pemberitahuan Tagihan Bulanan (Standar)',
    template: `Yth. Bapak/Ibu {nama_warga} ({nomor_rumah}, {rt_rw}),

Kami dari Pengelola Sampah BUPDA Padangsambian memberitahukan bahwa tagihan Iuran Kebersihan & Pengangkutan Sampah untuk periode {periode} sebesar Rp {nominal} telah terbit.

Batas waktu pembayaran: tanggal {jatuh_tempo}.
Pembayaran dapat dilakukan melalui:
- Tunai ke petugas penagih RT
- QRIS BUPDA Padangsambian / Transfer Bank BPD Bali: 010-02-00-12345 (an. BUPDA Padangsambian)

Mari bersama jaga lingkungan bersih & sehat. Terima kasih!`
  },
  {
    id: 'tpl-2',
    nama: 'Pengingat Jatuh Tempo (Hampir Terlambat)',
    template: `Halo Bapak/Ibu {nama_warga} di {nomor_rumah},

Mengingatkan kembali bahwa iuran sampah bulan {periode} sebesar Rp {nominal} belum terkonfirmasi lunas. Mohon untuk melakukan pelunasan sebelum akhir bulan agar layanan pengangkutan sampah lingkungan kita tetap berjalan lancar.

Konfirmasi pembayaran: wa.me/6281234567890. Terima kasih atas partisipasi aktifnya!`
  },
  {
    id: 'tpl-3',
    nama: 'Konfirmasi Penerimaan / Bukti Lunas',
    template: `Terima kasih Bapak/Ibu {nama_warga} ({nomor_rumah}).

Pembayaran Iuran Sampah periode {periode} sebesar Rp {nominal} telah berhasil diterima pada {tanggal_bayar} melalui metode {metode}. 

Nomor Kuitansi: {id_transaksi}.
Semoga lingkungan kita senantiasa bersih, asri, dan sehat! Salam BUPDA Padangsambian.`
  }
];

export const INITIAL_NOTIFICATION_LOGS: NotificationLog[] = [
  {
    id: 'NOTIF-001',
    customerId: 'PLG-003',
    customerName: 'Bambang Prasetyo',
    noHp: '085712349876',
    periode: 'Oktober 2026',
    pesan: 'Pemberitahuan tagihan iuran sampah bulan Oktober 2026 sebesar Rp 25.000',
    waktuKirim: '2026-10-15 09:00:00',
    status: 'Terkirim',
    channel: 'WhatsApp'
  },
  {
    id: 'NOTIF-002',
    customerId: 'PLG-005',
    customerName: 'I Ketut Darmawan',
    noHp: '087865432109',
    periode: 'Oktober 2026',
    pesan: 'Pemberitahuan tagihan iuran sampah bulan Oktober 2026 sebesar Rp 25.000',
    waktuKirim: '2026-10-15 09:02:00',
    status: 'Terkirim',
    channel: 'WhatsApp'
  }
];

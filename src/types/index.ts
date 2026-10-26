export type CustomerCategory = 'Rumah Tangga' | 'Usaha / Toko' | 'Kost / Kontrakan' | 'Industri Kecil';

export type CustomerStatus = 'Aktif' | 'Nonaktif';

export type PaymentMethod = 'Tunai' | 'Transfer Bank' | 'QRIS';

export type PaymentStatus = 'Lunas' | 'Belum Lunas' | 'Menunggak';

export interface Customer {
  id: string; // e.g., "PLG-001"
  nik?: string;
  nama: string;
  nomorRumah: string;
  rt: string;
  rw: string;
  kategori: CustomerCategory;
  tarifBulanan: number;
  noHp: string;
  status: CustomerStatus;
  tanggalDaftar: string;
  alamatLengkap?: string;
  catatan?: string;
}

export interface PaymentRecord {
  id: string; // e.g., "TRX-202610-001"
  customerId: string;
  customerName: string;
  nomorRumah: string;
  rt: string;
  periodeBulan: string; // e.g., "2026-10" or "Oktober 2026"
  nominal: number;
  tanggalBayar: string;
  metodePembayaran: PaymentMethod;
  petugasPenerima: string;
  catatan?: string;
  noReferensi?: string;
}

export interface MonthlyBill {
  id: string; // e.g., "BIL-202610-001"
  customerId: string;
  periode: string; // e.g., "2026-10"
  periodeFormatted: string; // "Oktober 2026"
  nominal: number;
  status: PaymentStatus;
  jatuhTempo: string;
  paymentRecordId?: string;
  tanggalBayar?: string;
  notifikasiTerkirim?: boolean;
  tanggalNotifikasiTerakhir?: string;
}

export interface UserSession {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'petugas' | 'warga';
  wargaCustomerId?: string;
}

export interface NotificationLog {
  id: string;
  customerId: string;
  customerName: string;
  noHp: string;
  periode: string;
  pesan: string;
  waktuKirim: string;
  status: 'Terkirim' | 'Gagal' | 'Pending';
  channel: 'WhatsApp' | 'SMS';
}

export interface NotificationTemplate {
  id: string;
  nama: string;
  template: string;
}

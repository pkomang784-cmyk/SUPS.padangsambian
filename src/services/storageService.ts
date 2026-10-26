import * as XLSX from 'xlsx';
import { Customer, PaymentRecord, MonthlyBill, NotificationLog, NotificationTemplate } from '../types';
import { INITIAL_CUSTOMERS, INITIAL_PAYMENTS, INITIAL_NOTIFICATION_LOGS, INITIAL_NOTIFICATION_TEMPLATES } from '../data/initialData';

const CUSTOMERS_KEY = 'bupda_sampah_customers';
const PAYMENTS_KEY = 'bupda_sampah_payments';
const NOTIF_LOGS_KEY = 'bupda_sampah_notif_logs';
const NOTIF_TEMPLATES_KEY = 'bupda_sampah_notif_templates';

export const storageService = {
  // --- CUSTOMERS ---
  getCustomers(): Customer[] {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CUSTOMERS;
    }
  },

  saveCustomers(customers: Customer[]): void {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  },

  addCustomer(customer: Omit<Customer, 'id' | 'tanggalDaftar'>): Customer {
    const customers = this.getCustomers();
    const nextNum = customers.length + 1;
    const id = `PLG-${String(nextNum).padStart(3, '0')}`;
    const newCustomer: Customer = {
      ...customer,
      id,
      tanggalDaftar: new Date().toISOString().split('T')[0]
    };
    customers.push(newCustomer);
    this.saveCustomers(customers);
    return newCustomer;
  },

  updateCustomer(id: string, updatedData: Partial<Customer>): Customer | null {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return null;

    customers[index] = { ...customers[index], ...updatedData };
    this.saveCustomers(customers);
    return customers[index];
  },

  deleteCustomer(id: string): boolean {
    const customers = this.getCustomers();
    const filtered = customers.filter(c => c.id !== id);
    if (filtered.length !== customers.length) {
      this.saveCustomers(filtered);
      return true;
    }
    return false;
  },

  // --- PAYMENTS ---
  getPayments(): PaymentRecord[] {
    const raw = localStorage.getItem(PAYMENTS_KEY);
    if (!raw) {
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(INITIAL_PAYMENTS));
      return INITIAL_PAYMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PAYMENTS;
    }
  },

  savePayments(payments: PaymentRecord[]): void {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
  },

  addPayment(data: Omit<PaymentRecord, 'id' | 'tanggalBayar'> & { tanggalBayar?: string }): PaymentRecord {
    const payments = this.getPayments();
    const now = new Date();
    const formattedDate = data.tanggalBayar || `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    const id = `TRX-${data.periodeBulan.replace('-', '')}-${String(payments.length + 1).padStart(3, '0')}`;

    const newPayment: PaymentRecord = {
      ...data,
      id,
      tanggalBayar: formattedDate,
      noReferensi: data.noReferensi || `REF-${Date.now().toString().slice(-6)}`
    };

    payments.unshift(newPayment);
    this.savePayments(payments);
    return newPayment;
  },

  deletePayment(id: string): boolean {
    const payments = this.getPayments();
    const filtered = payments.filter(p => p.id !== id);
    if (filtered.length !== payments.length) {
      this.savePayments(filtered);
      return true;
    }
    return false;
  },

  // --- BILLS CALCULATION FOR A GIVEN MONTH ---
  getMonthlyBills(targetPeriod: string = '2026-10'): MonthlyBill[] {
    const customers = this.getCustomers();
    const payments = this.getPayments();

    const [year, month] = targetPeriod.split('-');
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const monthIndex = parseInt(month, 10) - 1;
    const periodeFormatted = `${monthNames[monthIndex] || month} ${year}`;
    const jatuhTempo = `${targetPeriod}-20`;

    return customers.map(cust => {
      // Find if this customer has paid for this period
      const payment = payments.find(
        p => p.customerId === cust.id && p.periodeBulan === targetPeriod
      );

      let status: 'Lunas' | 'Belum Lunas' = payment ? 'Lunas' : 'Belum Lunas';
      
      return {
        id: `BIL-${targetPeriod}-${cust.id}`,
        customerId: cust.id,
        periode: targetPeriod,
        periodeFormatted,
        nominal: cust.tarifBulanan,
        status: cust.status === 'Nonaktif' ? 'Belum Lunas' : status,
        jatuhTempo,
        paymentRecordId: payment?.id,
        tanggalBayar: payment?.tanggalBayar
      };
    });
  },

  // --- NOTIFICATION LOGS ---
  getNotificationLogs(): NotificationLog[] {
    const raw = localStorage.getItem(NOTIF_LOGS_KEY);
    if (!raw) {
      localStorage.setItem(NOTIF_LOGS_KEY, JSON.stringify(INITIAL_NOTIFICATION_LOGS));
      return INITIAL_NOTIFICATION_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATION_LOGS;
    }
  },

  addNotificationLog(log: Omit<NotificationLog, 'id' | 'waktuKirim'>): NotificationLog {
    const logs = this.getNotificationLogs();
    const now = new Date();
    const formatted = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    const newLog: NotificationLog = {
      ...log,
      id: `NOTIF-${String(logs.length + 1).padStart(3, '0')}`,
      waktuKirim: formatted
    };
    logs.unshift(newLog);
    localStorage.setItem(NOTIF_LOGS_KEY, JSON.stringify(logs));
    return newLog;
  },

  // --- NOTIFICATION TEMPLATES ---
  getTemplates(): NotificationTemplate[] {
    const raw = localStorage.getItem(NOTIF_TEMPLATES_KEY);
    if (!raw) {
      localStorage.setItem(NOTIF_TEMPLATES_KEY, JSON.stringify(INITIAL_NOTIFICATION_TEMPLATES));
      return INITIAL_NOTIFICATION_TEMPLATES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATION_TEMPLATES;
    }
  },

  saveTemplates(templates: NotificationTemplate[]): void {
    localStorage.setItem(NOTIF_TEMPLATES_KEY, JSON.stringify(templates));
  },

  // --- IMPORT / EXPORT UTILITIES ---
  exportToExcel(data: Record<string, any>[], filename: string = 'data-pelanggan.xlsx') {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Warga');
    XLSX.writeFile(workbook, filename);
  },

  exportToCSV(data: Record<string, any>[], filename: string = 'data-pelanggan.csv') {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  parseFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  },

  generateSampleDataCSV(): string {
    const headers = ['Nama', 'Nomor Rumah', 'RT', 'RW', 'Kategori', 'Tarif Bulanan', 'No WhatsApp', 'NIK', 'Catatan'];
    const rows = [
      ['I Wayan Budiarta', 'No. 28', 'RT 01', 'RW 04', 'Rumah Tangga', '25000', '081234000111', '5171011002900011', 'Rumah tingkat dua'],
      ['Ni Kadek Sariani', 'No. 19B', 'RT 02', 'RW 04', 'Usaha / Toko', '50000', '081399887766', '5171012505880012', 'Usaha salon'],
      ['Bpk. Supriyadi', 'No. 31', 'RT 03', 'RW 04', 'Rumah Tangga', '25000', '087811223344', '5171010408850013', ''],
      ['Kost Dwijaya', 'No. 52', 'RT 04', 'RW 04', 'Kost / Kontrakan', '100000', '085233445566', '5171011910790014', 'Kost 8 kamar']
    ];
    return [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
  },

  // Reset to default sample data
  resetAllData(): void {
    localStorage.removeItem(CUSTOMERS_KEY);
    localStorage.removeItem(PAYMENTS_KEY);
    localStorage.removeItem(NOTIF_LOGS_KEY);
    localStorage.removeItem(NOTIF_TEMPLATES_KEY);
  }
};

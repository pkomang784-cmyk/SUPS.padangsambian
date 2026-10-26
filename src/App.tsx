import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { CustomerList } from './components/CustomerList';
import { CustomerModal } from './components/CustomerModal';
import { PaymentHistory } from './components/PaymentHistory';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { AutomaticBillingNotification } from './components/AutomaticBillingNotification';
import { WasteSchedule } from './components/WasteSchedule';
import { WargaPortal } from './components/WargaPortal';
import { LoginModal } from './components/LoginModal';
import { ImportExportModal } from './components/ImportExportModal';

import { Customer, PaymentRecord, UserSession, NotificationLog } from './types';
import { storageService } from './services/storageService';

export default function App() {
  // Authentication & session
  const [currentSession, setCurrentSession] = useState<UserSession>({
    id: 'usr-admin',
    username: 'admin',
    name: 'Pengurus BUPDA Padangsambian',
    role: 'admin'
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Active billing period (default: Oktober 2026)
  const [activePeriod, setActivePeriod] = useState<string>('2026-10');

  // Application Data States
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);

  // Modal States
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [preselectedCustomerId, setPreselectedCustomerId] = useState<string | undefined>(undefined);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<PaymentRecord | null>(null);

  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Load initial data on mount
  useEffect(() => {
    setCustomers(storageService.getCustomers());
    setPayments(storageService.getPayments());
    setNotificationLogs(storageService.getNotificationLogs());
  }, []);

  // Compute monthly bills whenever customers, payments or activePeriod change
  const monthlyBills = useMemo(() => {
    return storageService.getMonthlyBills(activePeriod);
  }, [customers, payments, activePeriod]);

  // Unpaid count for notifications badge
  const unpaidCount = useMemo(() => {
    const custMap = new Map(customers.map(c => [c.id, c]));
    return monthlyBills.filter(b => {
      const c = custMap.get(b.customerId);
      return b.status === 'Belum Lunas' && c?.status === 'Aktif';
    }).length;
  }, [monthlyBills, customers]);

  // --- CRUD HANDLERS ---
  const handleSaveCustomer = (data: Omit<Customer, 'id' | 'tanggalDaftar'>, customerId?: string) => {
    if (customerId) {
      storageService.updateCustomer(customerId, data);
    } else {
      storageService.addCustomer(data);
    }
    setCustomers(storageService.getCustomers());
  };

  const handleDeleteCustomer = (id: string) => {
    storageService.deleteCustomer(id);
    setCustomers(storageService.getCustomers());
  };

  const handleSavePayment = (paymentData: Omit<PaymentRecord, 'id' | 'tanggalBayar'>) => {
    const newPayment = storageService.addPayment(paymentData);
    setPayments(storageService.getPayments());
    return newPayment;
  };

  const handleDeletePayment = (paymentId: string) => {
    storageService.deletePayment(paymentId);
    setPayments(storageService.getPayments());
  };

  const handleViewReceipt = (payment: PaymentRecord) => {
    setReceiptPayment(payment);
    setIsReceiptModalOpen(true);
  };

  const handleQuickPay = (customer: Customer) => {
    setPreselectedCustomerId(customer.id);
    setIsPaymentModalOpen(true);
  };

  const handleImportSuccess = (importedList: Customer[]) => {
    setCustomers(importedList);
  };

  const handleRefreshLogs = () => {
    setNotificationLogs(storageService.getNotificationLogs());
  };

  const handleLogout = () => {
    setCurrentSession({
      id: 'usr-guest',
      username: 'warga',
      name: 'Warga Tamu',
      role: 'warga'
    });
    setActiveTab('warga-portal');
  };

  const handleLogin = (session: UserSession) => {
    setCurrentSession(session);
    setActiveTab('dashboard');
  };

  const isAdminOrPetugas = currentSession.role === 'admin' || currentSession.role === 'petugas';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Top Navbar */}
      <Navbar
        currentSession={currentSession}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenWargaPortal={() => setActiveTab('warga-portal')}
        activeTab={activeTab}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unpaidCount={unpaidCount}
          onOpenAddCustomer={() => {
            setCustomerToEdit(null);
            setIsCustomerModalOpen(true);
          }}
          onOpenPaymentModal={() => {
            setPreselectedCustomerId(undefined);
            setIsPaymentModalOpen(true);
          }}
          isAdminOrPetugas={isAdminOrPetugas}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <DashboardOverview
              customers={customers}
              monthlyBills={monthlyBills}
              payments={payments}
              activePeriod={activePeriod}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenPaymentModal={() => {
                setPreselectedCustomerId(undefined);
                setIsPaymentModalOpen(true);
              }}
              onViewReceipt={handleViewReceipt}
            />
          )}

          {/* Customers Tab */}
          {activeTab === 'customers' && (
            <CustomerList
              customers={customers}
              monthlyBills={monthlyBills}
              activePeriod={activePeriod}
              onOpenAddModal={() => {
                setCustomerToEdit(null);
                setIsCustomerModalOpen(true);
              }}
              onOpenEditModal={(cust) => {
                setCustomerToEdit(cust);
                setIsCustomerModalOpen(true);
              }}
              onDeleteCustomer={handleDeleteCustomer}
              onOpenImportExport={() => setIsImportExportModalOpen(true)}
              onQuickPay={handleQuickPay}
              isAdminOrPetugas={isAdminOrPetugas}
            />
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <PaymentHistory
              payments={payments}
              customers={customers}
              onOpenPaymentModal={() => {
                setPreselectedCustomerId(undefined);
                setIsPaymentModalOpen(true);
              }}
              onViewReceipt={handleViewReceipt}
              onDeletePayment={handleDeletePayment}
              isAdminOrPetugas={isAdminOrPetugas}
            />
          )}

          {/* Automated Billing Notifications Tab */}
          {activeTab === 'notifications' && (
            <AutomaticBillingNotification
              customers={customers}
              monthlyBills={monthlyBills}
              activePeriod={activePeriod}
              setActivePeriod={setActivePeriod}
              notificationLogs={notificationLogs}
              onRefreshLogs={handleRefreshLogs}
            />
          )}

          {/* Waste Sorting & Schedule Tab */}
          {activeTab === 'schedule' && <WasteSchedule />}

          {/* Citizen Self-Service Portal Tab */}
          {activeTab === 'warga-portal' && (
            <WargaPortal
              customers={customers}
              monthlyBills={monthlyBills}
              payments={payments}
              activePeriod={activePeriod}
              onViewReceipt={handleViewReceipt}
              onAdminLoginRequested={() => setIsLoginModalOpen(true)}
            />
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-emerald-100 py-4 px-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">BUPDA Padangsambian</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Sistem Pengelolaan Iuran Sampah Lingkungan</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Lingkungan Bersih, Hidup Lebih Sehat · Denpasar Barat, Bali
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* Customer Add/Edit Modal */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
        customerToEdit={customerToEdit}
      />

      {/* Payment Record Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        customers={customers}
        activePeriod={activePeriod}
        onSavePayment={handleSavePayment}
        preselectedCustomerId={preselectedCustomerId}
        onViewReceipt={handleViewReceipt}
      />

      {/* Official Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        payment={receiptPayment}
        customer={receiptPayment ? customers.find(c => c.id === receiptPayment.customerId) : undefined}
      />

      {/* Import / Export Modal */}
      <ImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        customers={customers}
        monthlyBills={monthlyBills}
        onImportSuccess={handleImportSuccess}
        activePeriod={activePeriod}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

    </div>
  );
}

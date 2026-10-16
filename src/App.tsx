/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/Dashboard/DashboardView';
import { PatientsListView } from './components/Patients/PatientsListView';
import { PatientDetailsView } from './components/Patients/PatientDetailsView';
import { ClinicalHistoryView } from './components/Clinical/ClinicalHistoryView';
import { OdontogramView } from './components/Clinical/OdontogramView';
import { ConsentsView } from './components/Clinical/ConsentsView';
import { CephalometryView } from './components/Clinical/CephalometryView';
import { EndodonticsView } from './components/Clinical/EndodonticsView';
import { AgendaView } from './components/Appointments/AgendaView';
import { TreatmentsView } from './components/Clinical/TreatmentsView';
import { BudgetsView } from './components/Finance/BudgetsView';
import { BillingView } from './components/Finance/BillingView';
import { InventoryView } from './components/Inventory/InventoryView';
import { ReportsView } from './components/Reports/ReportsView';
import { SettingsView } from './components/Settings/SettingsView';
import { NewAppointmentModal } from './components/Appointments/NewAppointmentModal';
import { NewPatientModal } from './components/Patients/NewPatientModal';
import { TVTurnosModal } from './components/Turnos/TVTurnosModal';
import { PatientPortalModal } from './components/Patients/PatientPortalModal';

const MainLayout: React.FC = () => {
  const { currentView, portalPatientId, setPortalPatientId } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showTVMode, setShowTVMode] = useState(false);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenNewAppointment={() => setShowNewAppointment(true)}
            onOpenNewPatient={() => setShowNewPatient(true)}
          />
        );
      case 'pacientes':
      case 'patients':
        return (
          <PatientsListView
            onOpenNewPatient={() => setShowNewPatient(true)}
          />
        );
      case 'patient_detail':
        return <PatientDetailsView />;
      case 'clinical_history':
      case 'historia-clinica':
        return <ClinicalHistoryView />;
      case 'odontogram':
      case 'odontograma':
        return <OdontogramView />;
      case 'consents':
      case 'consentimientos':
        return <ConsentsView />;
      case 'cephalometry':
      case 'cefalometria':
        return <CephalometryView />;
      case 'endodontics':
      case 'endodoncia':
        return <EndodonticsView />;
      case 'agenda':
      case 'google-calendar':
        return <AgendaView />;
      case 'treatments':
      case 'tratamientos':
        return <TreatmentsView />;
      case 'budgets':
        return <BudgetsView />;
      case 'billing':
      case 'facturacion':
        return <BillingView />;
      case 'inventory':
      case 'inventario':
        return <InventoryView />;
      case 'reports':
      case 'reportes':
        return <ReportsView />;
      case 'settings':
      case 'empresa':
      case 'reservas-online':
      case 'catalogo-cie10':
      case 'usuarios-roles':
      case 'satisfaccion':
      case 'whatsapp':
        return <SettingsView />;
      case 'pantalla-turnos':
        return (
          <TVTurnosModal
            isOpen={true}
            onClose={() => window.history.back()}
          />
        );
      default:
        return (
          <DashboardView
            onOpenNewAppointment={() => setShowNewAppointment(true)}
            onOpenNewPatient={() => setShowNewPatient(true)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 antialiased overflow-hidden font-sans select-none">
      {/* Navigation Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          onOpenNewAppointment={() => setShowNewAppointment(true)}
          onOpenNewPatient={() => setShowNewPatient(true)}
          onOpenTVMode={() => setShowTVMode(true)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto bg-slate-100/60 pb-12">
          {renderCurrentView()}
        </main>
      </div>

      {/* Modals */}
      <NewAppointmentModal
        isOpen={showNewAppointment}
        onClose={() => setShowNewAppointment(false)}
      />

      <NewPatientModal
        isOpen={showNewPatient}
        onClose={() => setShowNewPatient(false)}
      />

      <TVTurnosModal
        isOpen={showTVMode}
        onClose={() => setShowTVMode(false)}
      />

      <PatientPortalModal
        patientId={portalPatientId}
        onClose={() => setPortalPatientId(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Patient,
  Appointment,
  ClinicalHistory,
  CIE10Item,
  OdontogramRecord,
  ConsentForm,
  CephalometryRecord,
  EndodonticRecord,
  Budget,
  Invoice,
  Treatment,
  InventoryItem,
  ClinicConfig,
  UserAccount,
  Sede,
  SedeId,
  TurnQueueItem,
  SatisfactionSurvey,
} from '../types';
import {
  INITIAL_PATIENTS,
  INITIAL_HISTORIES,
  CIE10_CATALOG,
  INITIAL_USERS,
  INITIAL_SEDES,
  INITIAL_INVENTORY,
  INITIAL_TURNS,
  INITIAL_SURVEYS,
  INITIAL_CLINIC_CONFIG,
  INITIAL_WHATSAPP_TEMPLATES,
} from '../data/initialData';

// Initial treatments
const INITIAL_TREATMENTS: Treatment[] = [
  {
    id: 'tr-1',
    patientId: 'p-1',
    patientName: 'Manuel Hipólito Aguado Sierra',
    name: 'Curación con resina nanohíbrida 3M',
    tooth: 'Pieza 46',
    category: 'Operatoria Dental',
    startDate: '2026-08-20',
    totalSessions: 2,
    completedSessions: 1,
    cost: 140.0,
    status: 'en_progreso',
    dentistName: 'Dr. Alejandro Morales',
    notes: 'Preparación cavitaria clase I, colocación de base cavitaria de ionómero.',
  },
  {
    id: 'tr-2',
    patientId: 'p-1',
    patientName: 'Manuel Hipólito Aguado Sierra',
    name: 'Destartraje con ultrasonido y profilaxis',
    tooth: 'General',
    category: 'Periodoncia',
    startDate: '2026-08-15',
    totalSessions: 1,
    completedSessions: 1,
    cost: 120.0,
    status: 'completado',
    dentistName: 'Dra. Patricia Benavides',
    notes: 'Eliminación de sarro supragingival y pulido con pasta profiláctica.',
  },
  {
    id: 'tr-3',
    patientId: 'p-2',
    patientName: 'Carla Sofía Mendoza Ríos',
    name: 'Endodoncia unirradicular mecanizada',
    tooth: 'Pieza 21',
    category: 'Endodoncia',
    startDate: '2026-08-22',
    totalSessions: 2,
    completedSessions: 2,
    cost: 320.0,
    status: 'completado',
    dentistName: 'Dr. Alejandro Morales',
    notes: 'Conductometría 21.5 mm, obturación con cono único WaveOne Gold.',
  },
];

// Initial appointments
const INITIAL_APPOINTMENTS_DATA: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'p-1',
    patientName: 'Manuel Aguado Sierra',
    patientPhone: '+51 972781904',
    patientEmail: 'systemcft.pe@gmail.com',
    dentistId: 'user-doc-1',
    dentistName: 'Dr. Manuel Hipólito Aguado Sierra',
    sedeId: 'clinica-surco',
    date: '2026-08-27',
    time: '10:00',
    durationMinutes: 45,
    treatmentType: 'Curación con Resina Fotocurable',
    status: 'confirmada',
    notes: 'Pieza 46 cara oclusal.',
  },
  {
    id: 'apt-2',
    patientId: 'p-2',
    patientName: 'Susan Lady Coba',
    patientPhone: '+51 988234112',
    dentistId: 'user-doc-1',
    dentistName: 'Dr. Manuel Hipólito Aguado Sierra',
    sedeId: 'clinica-surco',
    date: '2026-08-27',
    time: '11:30',
    durationMinutes: 60,
    treatmentType: 'Control de Endodoncia y Corona',
    status: 'en_espera',
    notes: 'Prueba de muñón y toma de impresión.',
  },
  {
    id: 'apt-3',
    patientId: 'p-3',
    patientName: 'Yimena Soledad Aculqui',
    patientPhone: '+51 945112890',
    dentistId: 'user-doc-1',
    dentistName: 'Dr. Manuel Hipólito Aguado Sierra',
    sedeId: 'clinica-surco',
    date: '2026-08-27',
    time: '15:00',
    durationMinutes: 30,
    treatmentType: 'Evaluación y Diagnóstico Integral',
    status: 'confirmada',
    notes: 'Primera consulta.',
  },
  {
    id: 'apt-4',
    patientId: 'p-4',
    patientName: 'José Luis Medina',
    patientPhone: '+51 961778234',
    dentistId: 'user-doc-1',
    dentistName: 'Dr. Manuel Hipólito Aguado Sierra',
    sedeId: 'sede-principal',
    date: '2026-08-28',
    time: '09:00',
    durationMinutes: 45,
    treatmentType: 'Profilaxis y Destartraje',
    status: 'pendiente',
    notes: 'Confirmar por WhatsApp 24h antes.',
  },
];

// Initial invoices
const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    number: 'B001-00045',
    code: 'B001-00045',
    patientId: 'p-1',
    patientName: 'Manuel Aguado Sierra',
    patientDoc: '42789312',
    date: '2026-08-26',
    type: 'boleta',
    series: 'B001',
    items: [
      {
        description: 'Curación con resina nanohíbrida 3M',
        quantity: 1,
        unitPrice: 140.0,
        total: 140.0,
      },
    ],
    subtotal: 118.64,
    igv: 21.36,
    total: 140.0,
    amount: 140.0,
    paymentMethod: 'Yape',
    concept: 'Curación con resina nanohíbrida 3M',
    status: 'pagado',
    sedeId: 'clinica-surco',
  },
  {
    id: 'inv-2',
    number: 'B001-00046',
    code: 'B001-00046',
    patientId: 'p-2',
    patientName: 'Susan Lady Coba',
    patientDoc: '47891234',
    date: '2026-08-25',
    type: 'boleta',
    series: 'B001',
    items: [
      {
        description: 'Destartraje con ultrasonido y profilaxis',
        quantity: 1,
        unitPrice: 120.0,
        total: 120.0,
      },
    ],
    subtotal: 101.69,
    igv: 18.31,
    total: 120.0,
    amount: 120.0,
    paymentMethod: 'Tarjeta POS',
    concept: 'Destartraje con ultrasonido y profilaxis',
    status: 'pagado',
    sedeId: 'clinica-surco',
  },
  {
    id: 'inv-3',
    number: 'F001-00012',
    code: 'F001-00012',
    patientId: 'p-3',
    patientName: 'Yimena Soledad Aculqui',
    patientDoc: '71829304',
    date: '2026-08-18',
    type: 'factura',
    series: 'F001',
    items: [
      {
        description: 'Adelanto 50% Carillas de Porcelana E-Max',
        quantity: 1,
        unitPrice: 1800.0,
        total: 1800.0,
      },
    ],
    subtotal: 1525.42,
    igv: 274.58,
    total: 1800.0,
    amount: 1800.0,
    paymentMethod: 'Transferencia',
    concept: 'Adelanto 50% Carillas de Porcelana E-Max',
    status: 'pagado',
    sedeId: 'sede-principal',
  },
];

// Initial budgets
const INITIAL_BUDGETS_DATA: Budget[] = [
  {
    id: 'bgt-1',
    code: 'PRES-00001',
    patientId: 'p-1',
    patientName: 'Manuel Aguado Sierra',
    date: '2026-08-20',
    expirationDate: '2026-09-20',
    items: [
      {
        id: 'bi-1',
        tooth: 'Pieza 46',
        cieCode: 'D2391',
        description: 'Curación con Resina Fotocurable Nanohíbrida',
        quantity: 1,
        unitPrice: 140.0,
        discount: 0,
        total: 140.0,
        status: 'completado',
      },
      {
        id: 'bi-2',
        tooth: 'General',
        cieCode: 'D1110',
        description: 'Destartraje con Ultrasonido y Profilaxis Dental',
        quantity: 1,
        unitPrice: 120.0,
        discount: 20.0,
        total: 100.0,
        status: 'completado',
      },
    ],
    subtotal: 240.0,
    discount: 20.0,
    igv: 43.2,
    total: 240.0,
    status: 'aprobado',
    dentistName: 'Dr. Manuel Hipólito Aguado Sierra',
    sedeId: 'clinica-surco',
    notes: 'Presupuesto con 10% de descuento en profilaxis.',
  },
];

interface AppContextType {
  // Sede selection
  selectedSede: SedeId;
  setSelectedSede: (sede: SedeId) => void;
  sedes: Sede[];
  addSede: (sede: Omit<Sede, 'id'>) => Sede;

  // Navigation
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  portalPatientId: string | null;
  setPortalPatientId: (id: string | null) => void;

  // Main data collections
  patients: Patient[];
  appointments: Appointment[];
  histories: ClinicalHistory[];
  treatments: Treatment[];
  cie10Catalog: CIE10Item[];
  odontograms: OdontogramRecord[];
  consents: ConsentForm[];
  cephalometries: CephalometryRecord[];
  endodontics: EndodonticRecord[];
  budgets: Budget[];
  invoices: Invoice[];
  payments: Invoice[]; // alias for compatibility
  inventory: InventoryItem[];
  turns: TurnQueueItem[];
  surveys: SatisfactionSurvey[];
  users: UserAccount[];
  currentUser: UserAccount;
  clinicConfig: ClinicConfig;
  isWhatsAppConnected: boolean;
  setIsWhatsAppConnected: (val: boolean) => void;
  whatsappTemplates: Array<{ id: string; title: string; content: string }>;

  // Actions
  addPatient: (patient: Omit<Patient, 'id' | 'code' | 'createdAt'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  addAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;

  addClinicalHistory: (history: Omit<ClinicalHistory, 'id' | 'code'>) => ClinicalHistory;
  updateClinicalHistory: (id: string, updates: Partial<ClinicalHistory>) => void;

  addTreatment: (treatment: Omit<Treatment, 'id'>) => Treatment;
  updateTreatmentProgress: (id: string, completedSessions: number, status: Treatment['status']) => void;

  saveOdontogram: (record: Omit<OdontogramRecord, 'id'>) => OdontogramRecord;

  addConsent: (consent: Omit<ConsentForm, 'id'>) => ConsentForm;
  updateConsent: (id: string, updates: Partial<ConsentForm>) => void;

  saveCephalometry: (record: Omit<CephalometryRecord, 'id'>) => CephalometryRecord;

  addEndodonticRecord: (record: Omit<EndodonticRecord, 'id'>) => EndodonticRecord;
  saveEndodontic: (record: Omit<EndodonticRecord, 'id'>) => EndodonticRecord;

  addBudget: (budget: Omit<Budget, 'id' | 'code'>) => Budget;
  updateBudgetStatus: (id: string, status: Budget['status']) => void;

  addInvoice: (invoice: Omit<Invoice, 'id' | 'number'>) => Invoice;

  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => InventoryItem;
  updateInventoryStock: (id: string, newStock: number) => void;

  addTurn: (turn: Omit<TurnQueueItem, 'id'>) => TurnQueueItem;
  updateTurnStatus: (id: string, status: TurnQueueItem['status']) => void;
  callNextTurn: (chair?: string) => void;

  updateClinicConfig: (updates: Partial<ClinicConfig>) => void;
  addSurvey: (survey: Omit<SatisfactionSurvey, 'id'>) => SatisfactionSurvey;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSede, setSelectedSede] = useState<SedeId>('clinica-surco');
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [portalPatientId, setPortalPatientId] = useState<string | null>(null);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState<boolean>(true);

  // Safe loader from localStorage
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      return parsed && Array.isArray(fallback) && !Array.isArray(parsed) ? fallback : parsed ?? fallback;
    } catch {
      return fallback;
    }
  };

  const [sedes, setSedes] = useState<Sede[]>(() => loadState('dents_sedes', INITIAL_SEDES));
  const [patients, setPatients] = useState<Patient[]>(() => loadState('dents_patients', INITIAL_PATIENTS));
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadState('dents_appointments', INITIAL_APPOINTMENTS_DATA));
  const [histories, setHistories] = useState<ClinicalHistory[]>(() => loadState('dents_histories', INITIAL_HISTORIES));
  const [treatments, setTreatments] = useState<Treatment[]>(() => loadState('dents_treatments', INITIAL_TREATMENTS));
  const [odontograms, setOdontograms] = useState<OdontogramRecord[]>(() => loadState('dents_odontograms', []));
  const [consents, setConsents] = useState<ConsentForm[]>(() => loadState('dents_consents', []));
  const [cephalometries, setCephalometries] = useState<CephalometryRecord[]>(() => loadState('dents_cephalometries', []));
  const [endodontics, setEndodontics] = useState<EndodonticRecord[]>(() => loadState('dents_endodontics', []));
  const [budgets, setBudgets] = useState<Budget[]>(() => loadState('dents_budgets', INITIAL_BUDGETS_DATA));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadState('dents_invoices', INITIAL_INVOICES));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadState('dents_inventory', INITIAL_INVENTORY));
  const [turns, setTurns] = useState<TurnQueueItem[]>(() => loadState('dents_turns', INITIAL_TURNS));
  const [surveys, setSurveys] = useState<SatisfactionSurvey[]>(() => loadState('dents_surveys', INITIAL_SURVEYS));
  const [clinicConfig, setClinicConfig] = useState<ClinicConfig>(() => loadState('dents_config', INITIAL_CLINIC_CONFIG));

  const [users] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser] = useState<UserAccount>(INITIAL_USERS[1] || INITIAL_USERS[0]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('dents_sedes', JSON.stringify(sedes));
  }, [sedes]);

  useEffect(() => {
    localStorage.setItem('dents_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('dents_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('dents_histories', JSON.stringify(histories));
  }, [histories]);

  useEffect(() => {
    localStorage.setItem('dents_treatments', JSON.stringify(treatments));
  }, [treatments]);

  useEffect(() => {
    localStorage.setItem('dents_odontograms', JSON.stringify(odontograms));
  }, [odontograms]);

  useEffect(() => {
    localStorage.setItem('dents_consents', JSON.stringify(consents));
  }, [consents]);

  useEffect(() => {
    localStorage.setItem('dents_cephalometries', JSON.stringify(cephalometries));
  }, [cephalometries]);

  useEffect(() => {
    localStorage.setItem('dents_endodontics', JSON.stringify(endodontics));
  }, [endodontics]);

  useEffect(() => {
    localStorage.setItem('dents_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('dents_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('dents_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('dents_turns', JSON.stringify(turns));
  }, [turns]);

  useEffect(() => {
    localStorage.setItem('dents_surveys', JSON.stringify(surveys));
  }, [surveys]);

  useEffect(() => {
    localStorage.setItem('dents_config', JSON.stringify(clinicConfig));
  }, [clinicConfig]);

  // Actions
  const addSede = (sedeData: Omit<Sede, 'id'>): Sede => {
    const newSede: Sede = {
      ...sedeData,
      id: `sede-${Date.now()}`,
    };
    setSedes((prev) => [...(prev || []), newSede]);
    return newSede;
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'code' | 'createdAt'>): Patient => {
    const nextNum = (patients || []).length + 1;
    const code = `HCL-${String(nextNum).padStart(5, '0')}`;
    const newPatient: Patient = {
      ...patientData,
      id: `p-${Date.now()}`,
      code,
      createdAt: new Date().toISOString().split('T')[0],
      portalToken: `token-${Math.random().toString(36).substring(2, 12)}`,
    };
    setPatients((prev) => [newPatient, ...(prev || [])]);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) => (prev || []).map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePatient = (id: string) => {
    setPatients((prev) => (prev || []).filter((p) => p.id !== id));
    if (selectedPatientId === id) setSelectedPatientId(null);
  };

  const addAppointment = (aptData: Omit<Appointment, 'id'>): Appointment => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
    };
    setAppointments((prev) => [newApt, ...(prev || [])]);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) => (prev || []).map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) => (prev || []).map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => (prev || []).filter((a) => a.id !== id));
  };

  const addClinicalHistory = (histData: Omit<ClinicalHistory, 'id' | 'code'>): ClinicalHistory => {
    const nextNum = (histories || []).length + 1;
    const code = `HC-${String(nextNum).padStart(5, '0')}`;
    const newHist: ClinicalHistory = {
      ...histData,
      id: `hc-${Date.now()}`,
      code,
    };
    setHistories((prev) => [newHist, ...(prev || [])]);
    return newHist;
  };

  const updateClinicalHistory = (id: string, updates: Partial<ClinicalHistory>) => {
    setHistories((prev) => (prev || []).map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  const addTreatment = (treatData: Omit<Treatment, 'id'>): Treatment => {
    const newT: Treatment = {
      ...treatData,
      id: `tr-${Date.now()}`,
    };
    setTreatments((prev) => [newT, ...(prev || [])]);
    return newT;
  };

  const updateTreatmentProgress = (id: string, completedSessions: number, status: Treatment['status']) => {
    setTreatments((prev) =>
      (prev || []).map((t) => (t.id === id ? { ...t, completedSessions, status } : t))
    );
  };

  const saveOdontogram = (recordData: Omit<OdontogramRecord, 'id'>): OdontogramRecord => {
    const existingIndex = (odontograms || []).findIndex((o) => o.patientId === recordData.patientId);
    const newRecord: OdontogramRecord = {
      ...recordData,
      id: `odo-${Date.now()}`,
    };
    if (existingIndex >= 0) {
      setOdontograms((prev) => {
        const copy = [...(prev || [])];
        copy[existingIndex] = newRecord;
        return copy;
      });
    } else {
      setOdontograms((prev) => [newRecord, ...(prev || [])]);
    }
    return newRecord;
  };

  const addConsent = (consentData: Omit<ConsentForm, 'id'>): ConsentForm => {
    const newConsent: ConsentForm = {
      ...consentData,
      id: `cons-${Date.now()}`,
    };
    setConsents((prev) => [newConsent, ...(prev || [])]);
    return newConsent;
  };

  const updateConsent = (id: string, updates: Partial<ConsentForm>) => {
    setConsents((prev) => (prev || []).map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const saveCephalometry = (recordData: Omit<CephalometryRecord, 'id'>): CephalometryRecord => {
    const newRecord: CephalometryRecord = {
      ...recordData,
      id: `ceph-${Date.now()}`,
    };
    setCephalometries((prev) => [newRecord, ...(prev || [])]);
    return newRecord;
  };

  const addEndodonticRecord = (recordData: Omit<EndodonticRecord, 'id'>): EndodonticRecord => {
    const newRecord: EndodonticRecord = {
      ...recordData,
      id: `endo-${Date.now()}`,
    };
    setEndodontics((prev) => [newRecord, ...(prev || [])]);
    return newRecord;
  };

  const addBudget = (budgetData: Omit<Budget, 'id' | 'code'>): Budget => {
    const nextNum = (budgets || []).length + 1;
    const code = `PRES-${String(nextNum).padStart(5, '0')}`;
    const newBudget: Budget = {
      ...budgetData,
      id: `bgt-${Date.now()}`,
      code,
    };
    setBudgets((prev) => [newBudget, ...(prev || [])]);
    return newBudget;
  };

  const updateBudgetStatus = (id: string, status: Budget['status']) => {
    setBudgets((prev) => (prev || []).map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'number'>): Invoice => {
    const nextNum = (invoices || []).length + 1;
    const prefix = invoiceData.type === 'factura' ? 'F001' : 'B001';
    const number = `${prefix}-${String(nextNum).padStart(5, '0')}`;
    const newInv: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      number,
      code: number,
      amount: invoiceData.amount ?? invoiceData.total ?? 0,
      total: invoiceData.total ?? invoiceData.amount ?? 0,
    };
    setInvoices((prev) => [newInv, ...(prev || [])]);
    return newInv;
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>): InventoryItem => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-item-${Date.now()}`,
      stock: itemData.stock ?? itemData.currentStock ?? 0,
      currentStock: itemData.currentStock ?? itemData.stock ?? 0,
    };
    setInventory((prev) => [...(prev || []), newItem]);
    return newItem;
  };

  const updateInventoryStock = (id: string, newStock: number) => {
    setInventory((prev) =>
      (prev || []).map((it) =>
        it.id === id ? { ...it, currentStock: newStock, stock: newStock } : it
      )
    );
  };

  const addTurn = (turnData: Omit<TurnQueueItem, 'id'>): TurnQueueItem => {
    const newTurn: TurnQueueItem = {
      ...turnData,
      id: `turn-${Date.now()}`,
    };
    setTurns((prev) => [...(prev || []), newTurn]);
    return newTurn;
  };

  const updateTurnStatus = (id: string, status: TurnQueueItem['status']) => {
    setTurns((prev) =>
      (prev || []).map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              calledAt: status === 'llamando' ? new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : t.calledAt,
            }
          : t
      )
    );
  };

  const callNextTurn = (chair: string = 'Sillón 1') => {
    setTurns((prev) => {
      const waiting = (prev || []).find((t) => t.status === 'esperando');
      if (!waiting) return prev;
      return (prev || []).map((t) =>
        t.id === waiting.id
          ? {
              ...t,
              status: 'llamando',
              chair: chair || t.chair,
              calledAt: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
            }
          : t.status === 'llamando'
          ? { ...t, status: 'en_atencion' }
          : t
      );
    });
  };

  const updateClinicConfig = (updates: Partial<ClinicConfig>) => {
    setClinicConfig((prev) => ({ ...prev, ...updates }));
  };

  const addSurvey = (surveyData: Omit<SatisfactionSurvey, 'id'>): SatisfactionSurvey => {
    const newSurvey: SatisfactionSurvey = {
      ...surveyData,
      id: `surv-${Date.now()}`,
    };
    setSurveys((prev) => [newSurvey, ...(prev || [])]);
    return newSurvey;
  };

  return (
    <AppContext.Provider
      value={{
        selectedSede,
        setSelectedSede,
        sedes: sedes || [],
        addSede,
        currentView,
        setCurrentView,
        selectedPatientId,
        setSelectedPatientId,
        portalPatientId,
        setPortalPatientId,
        patients: patients || [],
        appointments: appointments || [],
        histories: histories || [],
        treatments: treatments || [],
        cie10Catalog: CIE10_CATALOG || [],
        odontograms: odontograms || [],
        consents: consents || [],
        cephalometries: cephalometries || [],
        endodontics: endodontics || [],
        budgets: budgets || [],
        invoices: invoices || [],
        payments: invoices || [],
        inventory: inventory || [],
        turns: turns || [],
        surveys: surveys || [],
        users: users || [],
        currentUser: currentUser || INITIAL_USERS[0],
        clinicConfig: clinicConfig || INITIAL_CLINIC_CONFIG,
        isWhatsAppConnected,
        setIsWhatsAppConnected,
        whatsappTemplates: INITIAL_WHATSAPP_TEMPLATES,
        addPatient,
        updatePatient,
        deletePatient,
        addAppointment,
        updateAppointmentStatus,
        updateAppointment,
        deleteAppointment,
        addClinicalHistory,
        updateClinicalHistory,
        addTreatment,
        updateTreatmentProgress,
        saveOdontogram,
        addConsent,
        updateConsent,
        saveCephalometry,
        addEndodonticRecord,
        saveEndodontic: addEndodonticRecord,
        addBudget,
        updateBudgetStatus,
        addInvoice,
        addInventoryItem,
        updateInventoryStock,
        addTurn,
        updateTurnStatus,
        callNextTurn,
        updateClinicConfig,
        addSurvey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

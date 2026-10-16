export type SedeId = string;

export interface Sede {
  id: string;
  name: string;
  address: string;
  phone: string;
  city?: string;
  isMain?: boolean;
}

export interface Patient {
  id: string;
  code: string; // HCL-00001
  fullName: string;
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  docType: 'DNI' | 'RUC' | 'CE' | 'PASAPORTE';
  docNumber: string;
  birthDate: string;
  age: number;
  gender: 'M' | 'F';
  civilStatus: 'soltero' | 'casado' | 'divorciado' | 'viudo';
  phone: string;
  email: string;
  address: string;
  district: string;
  department: string;
  occupation?: string;
  insuranceType?: string;
  insuranceNumber?: string;
  allergies: string[];
  baseConditions: string[]; // diabetes, hipertension, etc
  photoUrl?: string;
  createdAt: string;
  lastVisit?: string;
  sedeId: string;
  notes?: string;
  portalToken?: string;
}

export type AppointmentStatus = 'pendiente' | 'confirmada' | 'en_espera' | 'atendida' | 'cancelada';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  dentistId?: string;
  dentistName?: string;
  doctorId?: string;
  doctorName?: string;
  sedeId: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  startTime?: string;
  endTime?: string;
  chair?: string;
  specialty?: string;
  reason?: string;
  durationMinutes?: number;
  treatmentType?: string;
  type?: string;
  status: AppointmentStatus;
  notes?: string;
  internalNotes?: string;
  origin?: 'manual' | 'online';
  reminderSent?: boolean;
}

export interface CIE10Item {
  code: string;
  description: string;
  category?: string;
}

export interface ClinicalHistory {
  id: string;
  code: string; // HC-00001
  patientId: string;
  patientName: string;
  openingDate: string;
  bloodPressure: string; // 120/80
  weight: number; // kg
  height: number; // cm
  chiefComplaint: string; // Motivo de consulta
  currentIllness: string; // Enfermedad actual
  generalAssessment: string;
  intraoralExam: string;
  softTissues: string;
  cie10Codes: Array<{ code: string; desc: string }>;
  treatmentPlan: string;
  dentistId: string;
  dentistName: string;
  status: 'activa' | 'archivada';
}

export interface ToothCondition {
  surfaces: Record<string, string>; // e.g. { center: 'caries', top: 'resina' }
  generalState?: 'sano' | 'ausente' | 'corona' | 'endodoncia' | 'implante' | 'protesis' | 'fractura' | 'extraccion' | 'extraccion_indicada';
  notes?: string;
}

export interface OdontogramRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  teeth: Record<number, ToothCondition>;
  notes: string;
  dentistName: string;
}

export interface ConsentForm {
  id: string;
  patientId: string;
  patientName: string;
  docNumber: string;
  type: 'Cirugía Oral Menor' | 'Endodoncia' | 'Obturaciones' | 'Exodoncia de Tercer Molar' | 'Implantes' | 'Periodoncia';
  procedureName: string;
  risksList: string[];
  dentistName: string;
  copNumber: string;
  patientSignature?: string; // base64 or drawn marker
  dentistSignature?: string;
  date: string;
  city: string;
  status: 'firmado' | 'borrador';
  isMinor?: boolean;
  representativeName?: string;
  representativeDoc?: string;
}

export interface CephalometryRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  imageUrl: string;
  points: Record<string, { x: number; y: number }>;
  measurements: {
    sna: number; // Normal: 82°
    snb: number; // Normal: 80°
    anb: number; // Normal: 2° (SNA - SNB)
    fma: number; // Plano mandibular normal 25°
    wits: number; // mm
    classDiagnosis: 'Clase I' | 'Clase II' | 'Clase III';
  };
  notes: string;
}

export interface CanalMeasurement {
  name?: string;
  canalName?: string;
  referencePoint?: string;
  apparentLength?: number; // CAD mm
  realWorkLength?: number; // CRT mm
  workLength?: number;
  apicalFile?: string; // FMA / Lima memoria
  sealer?: string;
  obturationTechnique?: string;
  masterCone?: string;
  refPoint?: string;
}

export interface EndodonticRecord {
  id: string;
  patientId: string;
  patientName: string;
  toothNumber: number;
  date: string;
  dentistName: string;
  diagnosis: string;
  vitality?: any;
  vitalityTests?: {
    cold: 'positivo' | 'negativo' | 'hiperreactivo';
    percussion: 'positivo' | 'negativo';
    palpation: 'positivo' | 'negativo';
    mobility: 'grado 0' | 'grado 1' | 'grado 2' | 'grado 3';
  };
  canals: CanalMeasurement[];
  technique?: string;
  status: 'en_proceso' | 'concluido' | 'completado';
  notes: string;
}

export interface BudgetItem {
  id: string;
  tooth?: string;
  cieCode?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  status: 'pendiente' | 'en_progreso' | 'completado';
}

export interface Budget {
  id: string;
  code: string; // PRES-0001
  patientId: string;
  patientName: string;
  date: string;
  expirationDate: string;
  items: BudgetItem[];
  subtotal: number;
  discount: number;
  igv: number;
  total: number;
  status: 'borrador' | 'aprobado' | 'facturado' | 'rechazado';
  dentistName: string;
  sedeId: string;
  notes?: string;
}

export interface Treatment {
  id: string;
  patientId: string;
  patientName: string;
  name: string;
  tooth: string;
  category: string;
  startDate: string;
  totalSessions: number;
  completedSessions: number;
  cost: number;
  status: 'pendiente' | 'en_progreso' | 'completado';
  dentistName: string;
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  number?: string;
  code?: string;
  patientId: string;
  patientName: string;
  patientDoc: string;
  date: string;
  type: string;
  series?: string;
  items?: InvoiceItem[];
  subtotal?: number;
  igv?: number;
  total?: number;
  amount?: number;
  paymentMethod: string;
  concept?: string;
  status: string;
  sedeId: string;
  budgetId?: string;
}

export type PaymentInvoice = Invoice;

export interface InventoryItem {
  id: string;
  code?: string;
  name: string;
  category: string;
  currentStock?: number;
  stock?: number;
  minStock: number;
  unit: string;
  batchNumber?: string;
  expirationDate: string;
  costPrice?: number;
  unitCost?: number;
  sedeId: string;
}

export interface TurnQueueItem {
  id: string;
  turnNumber: string;
  patientName: string;
  doctorName: string;
  chair: string;
  time: string;
  status: 'esperando' | 'llamando' | 'en_atencion' | 'finalizado';
  calledAt?: string;
}

export interface SatisfactionSurvey {
  id: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  date: string;
  clinicRating: number;
  doctorRating: number;
  isSatisfied: boolean;
  comments: string;
  doctorName: string;
  sedeId: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'recepcion' | 'contador' | 'asistente' | 'paciente';
  specialty?: string;
  copNumber?: string;
  dni?: string;
  status: 'activo' | 'inactivo';
  lastAccess?: string;
  avatarUrl?: string;
}

export interface ClinicConfig {
  name: string;
  tradeName: string;
  ruc: string;
  address: string;
  district: string;
  department?: string;
  phone?: string;
  phone1?: string;
  phone2?: string;
  email: string;
  website?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  igvPercent?: number;
  solUser?: string;
  solPass?: string;
  hasCertificate?: boolean;
  receiptFooterText?: string;
  onlineBooking?: any;
  sedes?: Sede[];
}

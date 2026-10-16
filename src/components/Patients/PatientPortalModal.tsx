import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  Sparkles,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface PatientPortalModalProps {
  patientId: string | null;
  onClose: () => void;
}

export const PatientPortalModal: React.FC<PatientPortalModalProps> = ({
  patientId,
  onClose,
}) => {
  const {
    patients,
    appointments,
    invoices,
    histories,
    treatments,
    budgets,
    clinicConfig,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'resumen' | 'citas' | 'tratamientos' | 'pagos' | 'presupuestos'>('resumen');

  if (!patientId) return null;

  const patient = (patients || []).find((p) => p.id === patientId);
  if (!patient) return null;

  const patientAppts = (appointments || []).filter((a) => a.patientId === patient.id);
  const patientInvoices = (invoices || []).filter((i) => i.patientId === patient.id);
  const patientTreatments = (treatments || []).filter((t) => t.patientId === patient.id);
  const patientBudgets = (budgets || []).filter((b) => b.patientId === patient.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header brand */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Cerrar Portal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/30 border border-teal-400/40 flex items-center justify-center text-white text-xl font-bold shadow-inner">
                {patient.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-200 border border-teal-300/30 text-[10px] font-bold uppercase tracking-wider">
                    PORTAL DIGITAL DEL PACIENTE
                  </span>
                  <span className="text-xs text-teal-200 font-mono">N° {patient.code}</span>
                </div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1">
                  {patient.fullName}
                </h1>
                <p className="text-xs text-teal-100 flex items-center gap-3 mt-1">
                  <span>DNI: <strong>{patient.docNumber}</strong></span>
                  <span>•</span>
                  <span>Tel: <strong>{patient.phone}</strong></span>
                  <span>•</span>
                  <span>{patient.district}, Lima</span>
                </p>
              </div>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-3 text-right hidden sm:block">
              <div className="text-xs text-teal-200 font-medium">Clínica Odontológica</div>
              <div className="text-sm font-black text-white">{clinicConfig?.tradeName || 'DENTS DS'}</div>
              <div className="text-[11px] text-teal-300">Central: +51 972 781 904</div>
            </div>
          </div>

          {/* Nav tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
            {[
              { id: 'resumen', label: 'Mi Resumen' },
              { id: 'citas', label: `Mis Citas (${patientAppts.length})` },
              { id: 'tratamientos', label: `Tratamientos (${patientTreatments.length})` },
              { id: 'presupuestos', label: `Presupuestos (${patientBudgets.length})` },
              { id: 'pagos', label: `Comprobantes (${patientInvoices.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-white text-teal-900 shadow-md font-extrabold'
                    : 'bg-white/10 text-teal-100 hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 space-y-6 text-xs text-slate-700">
          {activeTab === 'resumen' && (
            <div className="space-y-6">
              {/* Status banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Citas Programadas
                  </span>
                  <div className="text-2xl font-black text-teal-700 mt-1">
                    {patientAppts.filter((a) => a.status === 'confirmada' || a.status === 'pendiente').length}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Próximas asistencias</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Tratamientos en Curso
                  </span>
                  <div className="text-2xl font-black text-sky-700 mt-1">
                    {patientTreatments.filter((t) => t.status === 'en_progreso').length}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Procedimientos activos</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Comprobantes Emitidos
                  </span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">
                    {patientInvoices.length}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Boletas / Facturas SUNAT</p>
                </div>
              </div>

              {/* Next appointment */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-5">
                <h3 className="text-sm font-extrabold text-teal-900 flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-teal-700" />
                  <span>Próxima Cita Dental Programada</span>
                </h3>
                {patientAppts.length > 0 ? (
                  <div className="bg-white p-4 rounded-xl border border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="text-xs font-bold text-teal-800 uppercase tracking-wide">
                        {patientAppts[0].treatmentType}
                      </div>
                      <div className="text-base font-extrabold text-slate-900 mt-0.5">
                        {patientAppts[0].date} a las {patientAppts[0].time} hrs
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Especialista: <strong>{patientAppts[0].dentistName || 'Dr. Alejandro Morales'}</strong>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 font-bold rounded-lg text-xs self-start sm:self-center capitalize">
                      Estado: {patientAppts[0].status}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No cuenta con citas pendientes por el momento.</p>
                )}
              </div>

              {/* Medical security alerts */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Información Médica Registrada en Historia Clínica</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
                    <span className="font-bold block text-[11px] uppercase tracking-wider text-rose-700">
                      Alergias Conocidas
                    </span>
                    <p className="font-semibold mt-1">
                      {patient.allergies && patient.allergies.length > 0
                        ? patient.allergies.join(', ')
                        : 'Ninguna registrada'}
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                    <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-700">
                      Condiciones de Base
                    </span>
                    <p className="font-semibold mt-1">
                      {patient.baseConditions && patient.baseConditions.length > 0
                        ? patient.baseConditions.join(', ')
                        : 'Ninguna'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'citas' && (
            <div className="space-y-3">
              {patientAppts.length > 0 ? (
                patientAppts.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900">{appt.treatmentType}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {appt.date} • {appt.time} hrs • Dr. {appt.dentistName}
                      </div>
                      {appt.notes && <div className="text-xs text-slate-600 italic mt-1">{appt.notes}</div>}
                    </div>
                    <span className="px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg font-bold text-xs capitalize">
                      {appt.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">No hay registros de citas.</div>
              )}
            </div>
          )}

          {activeTab === 'tratamientos' && (
            <div className="space-y-3">
              {patientTreatments.length > 0 ? (
                patientTreatments.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{tr.name}</h4>
                        <span className="text-xs text-teal-700 font-semibold">{tr.tooth} • {tr.category}</span>
                      </div>
                      <span className="text-sm font-black text-slate-800 font-mono">
                        S/ {tr.cost.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full"
                        style={{ width: `${(tr.completedSessions / tr.totalSessions) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Progreso: {tr.completedSessions} de {tr.totalSessions} sesiones</span>
                      <span className="capitalize font-bold text-teal-800">{(tr.status || '').replace('_', ' ')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">No hay tratamientos registrados.</div>
              )}
            </div>
          )}

          {activeTab === 'presupuestos' && (
            <div className="space-y-3">
              {patientBudgets.length > 0 ? (
                patientBudgets.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900">Presupuesto {b.code}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Emisión: {b.date} • Válido hasta: {b.expirationDate}
                      </div>
                      <div className="text-xs text-teal-700 font-semibold mt-1">
                        {b.items.length} procedimientos incluidos
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-slate-900 font-mono">
                        S/ {b.total.toFixed(2)}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">No hay presupuestos registrados.</div>
              )}
            </div>
          )}

          {activeTab === 'pagos' && (
            <div className="space-y-3">
              {patientInvoices.length > 0 ? (
                patientInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900">{inv.number || inv.code}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Fecha: {inv.date} • Medio: {inv.paymentMethod}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        {inv.concept || inv.items?.[0]?.description || 'Atención odontológica'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-emerald-700 font-mono">
                        S/ {(inv.total || inv.amount || 0).toFixed(2)}
                      </div>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        PAGADO / SUNAT
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">No hay comprobantes de pago registrados.</div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Portal seguro protegido con cifrado SSL</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl transition-colors"
          >
            Cerrar Portal
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Scale,
  Ruler,
  AlertCircle,
  Copy,
  MessageCircle,
  ExternalLink,
  Calendar,
  Grid3X3,
  FileText,
  FileSignature,
  DollarSign,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  Scissors,
  Check,
  Plus,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PatientDetailsView: React.FC = () => {
  const {
    selectedPatientId,
    setSelectedPatientId,
    patients,
    histories,
    appointments,
    payments,
    budgets,
    consents,
    endodontics,
    cephalometries,
    setCurrentView,
    setPortalPatientId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hc' | 'citas' | 'pagos' | 'presupuestos' | 'consentimientos'>('hc');
  const [copiedLink, setCopiedLink] = useState(false);

  const patient = patients.find((p) => p.id === selectedPatientId);

  if (!patient) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>No se ha seleccionado ningún paciente.</p>
        <button
          onClick={() => setSelectedPatientId(null)}
          className="mt-3 text-xs font-bold text-teal-600 hover:underline"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  const patientHistories = histories.filter((h) => h.patientId === patient.id);
  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);
  const patientPayments = payments.filter((p) => p.patientId === patient.id);
  const patientBudgets = budgets.filter((b) => b.patientId === patient.id);
  const patientConsents = consents.filter((c) => c.patientId === patient.id);

  const portalUrl = `${window.location.origin}/portal?token=${patient.portalToken || 'demo'}&id=${patient.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppPortal = () => {
    const cleanPhone = (patient.phone || '').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Estimad@ ${patient.fullName || ''}, acceda a su portal dental digital para revisar sus citas, tratamientos y pagos: ${portalUrl}`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleDirectWhatsApp = () => {
    const cleanPhone = (patient.phone || '').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hola ${patient.fullName || ''}, le contactamos desde la clínica DENTS DS.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div id="patient-details-view" className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedPatientId(null)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Volver a lista de pacientes"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black text-slate-900">{patient.fullName}</h1>
              <span className="text-xs font-mono font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                {patient.code}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              DNI: {patient.docNumber} • {patient.age} años • {patient.district}, {patient.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentView('agenda')}
            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agendar Cita</span>
          </button>
          <button
            onClick={() => setCurrentView('odontograma')}
            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Odontograma</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column Profile & Vitals + Right Column Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vitals Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span>P. ARTERIAL</span>
              </div>
              <p className="text-lg font-black text-slate-800 mt-1">120/80</p>
              <span className="text-[10px] text-slate-400">mmHg (Normal)</span>
            </div>

            <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <Scale className="w-4 h-4 text-teal-500" />
                <span>PESO</span>
              </div>
              <p className="text-lg font-black text-slate-800 mt-1">80.00</p>
              <span className="text-[10px] text-slate-400">kg</span>
            </div>

            <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <Ruler className="w-4 h-4 text-sky-500" />
                <span>TALLA</span>
              </div>
              <p className="text-lg font-black text-slate-800 mt-1">180.00</p>
              <span className="text-[10px] text-slate-400">cm</span>
            </div>

            <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>ALERTAS</span>
              </div>
              <p className="text-xs font-bold text-amber-700 mt-1 truncate">
                {patient.allergies.length > 0 ? patient.allergies.join(', ') : 'Ninguna'}
              </p>
              <span className="text-[10px] text-slate-400">Condición médica</span>
            </div>
          </div>

          {/* Portal del Paciente Share Card (Exact replication of video demo) */}
          <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 text-white p-5 rounded-2xl shadow-md border border-teal-800/40 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-white uppercase">
                      PORTAL DIGITAL DEL PACIENTE
                    </h3>
                    <p className="text-xs text-teal-200/80">
                      Comparte este enlace para que el paciente revise sus citas, recetas, presupuestos, pagos y evolución.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-teal-400/20 text-teal-300 px-2 py-0.5 rounded border border-teal-400/30">
                  Enlace Activo
                </span>
              </div>

              {/* URL Box */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
                <div className="flex-1 bg-slate-800/80 border border-slate-700 text-teal-300 font-mono text-xs px-3.5 py-2.5 rounded-xl truncate">
                  {portalUrl}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id="btn-copiar-portal-link"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors border border-slate-700"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
                  </button>

                  <button
                    id="btn-whatsapp-portal-link"
                    onClick={handleWhatsAppPortal}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    id="btn-abrir-portal-demo"
                    onClick={() => {
                      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                      setPortalPatientId(patient.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir Portal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Accesos Rápidos Panel (Video match) */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>ACCESOS RÁPIDOS</span>
              <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
                Clínico
              </span>
            </h3>

            <div className="grid grid-cols-1 gap-1.5 mt-3">
              <button
                onClick={() => setCurrentView('odontograma')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-teal-600" /> Odontograma
                </span>
                <span className="text-[10px] text-slate-400">Ver gráfico →</span>
              </button>

              <button
                onClick={() => setCurrentView('cefalometria')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-indigo-600" /> Cefalometría
                </span>
                <span className="text-[10px] text-slate-400">Trazado →</span>
              </button>

              <button
                onClick={() => setCurrentView('endodoncia')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-600" /> Endodoncia
                </span>
                <span className="text-[10px] text-slate-400">Conductos →</span>
              </button>

              <button
                onClick={() => setCurrentView('consentimientos')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-purple-600" /> Consentimientos
                </span>
                <span className="text-[10px] text-slate-400">Firmas →</span>
              </button>

              <button
                onClick={() => setCurrentView('tratamientos')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Presupuestos
                </span>
                <span className="text-[10px] text-slate-400">Cotización →</span>
              </button>

              <button
                onClick={() => setCurrentView('agenda')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" /> Nueva Cita
                </span>
                <span className="text-[10px] text-slate-400">Agendar →</span>
              </button>

              <button
                onClick={() => setCurrentView('facturacion')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Registrar Pago
                </span>
                <span className="text-[10px] text-slate-400">Cobro →</span>
              </button>

              <button
                onClick={handleDirectWhatsApp}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors text-left border border-emerald-200 mt-2"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Enviar WhatsApp
                </span>
                <span>Directo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Timeline Section (Matching video demo tabs) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <h2 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wide">
              LÍNEA DE TIEMPO • EVOLUCIÓN DEL PACIENTE
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('hc')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'hc'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HC ({patientHistories.length})
            </button>
            <button
              onClick={() => setActiveTab('citas')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'citas'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Citas ({patientAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('pagos')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'pagos'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pagos ({patientPayments.length})
            </button>
            <button
              onClick={() => setActiveTab('presupuestos')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'presupuestos'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Presupuestos ({patientBudgets.length})
            </button>
            <button
              onClick={() => setActiveTab('consentimientos')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'consentimientos'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Consentimientos ({patientConsents.length})
            </button>
          </div>
        </div>

        {/* Tab contents */}
        <div className="p-4 md:p-6">
          {activeTab === 'hc' && (
            <div className="space-y-4">
              {patientHistories.length > 0 ? (
                patientHistories.map((hist) => (
                  <div
                    key={hist.id}
                    className="border border-slate-200 rounded-xl p-4 hover:border-teal-300 transition-colors space-y-3 bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-teal-600 text-white px-2.5 py-0.5 rounded">
                          {hist.code}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Apertura: {hist.openingDate}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {hist.dentistName}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="font-bold text-slate-700">Motivo de Consulta:</p>
                        <p className="text-slate-600 mt-0.5">{hist.chiefComplaint}</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">Diagnóstico CIE-10:</p>
                        <div className="space-y-1 mt-0.5">
                          {hist.cie10Codes.map((c, i) => (
                            <p key={i} className="text-teal-900 font-semibold bg-teal-50/80 px-2 py-0.5 rounded">
                              • <strong>{c.code}</strong>: {c.desc}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs pt-2 border-t border-slate-200/60">
                      <p className="font-bold text-slate-700">Plan de Tratamiento:</p>
                      <p className="text-slate-600 mt-0.5">{hist.treatmentPlan}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No hay historias clínicas registradas aún.
                </div>
              )}
            </div>
          )}

          {activeTab === 'citas' && (
            <div className="divide-y divide-slate-100">
              {patientAppointments.length > 0 ? (
                patientAppointments.map((apt) => (
                  <div key={apt.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                      <div>
                        <p className="font-bold text-slate-800">
                          {apt.date} • {apt.startTime} - {apt.endTime} ({apt.chair})
                        </p>
                        <p className="text-slate-500">
                          {apt.reason} • {apt.doctorName}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        apt.status === 'confirmada'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'atendida'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No hay citas registradas para este paciente.
                </div>
              )}
            </div>
          )}

          {activeTab === 'pagos' && (
            <div className="divide-y divide-slate-100">
              {patientPayments.length > 0 ? (
                patientPayments.map((pay) => (
                  <div key={pay.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {pay.code}
                        </span>
                        <span className="font-bold text-slate-800">{pay.concept}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {pay.date} • Método: <strong>{pay.paymentMethod}</strong>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">
                        S/ {pay.amount.toFixed(2)}
                      </p>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {pay.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No hay pagos registrados para este paciente.
                </div>
              )}
            </div>
          )}

          {activeTab === 'presupuestos' && (
            <div className="space-y-3">
              {patientBudgets.map((bgt) => (
                <div key={bgt.id} className="border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                      {bgt.code}
                    </span>
                    <span className="text-sm font-black text-slate-900">
                      Total: S/ {bgt.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 pt-2">
                    {bgt.items.map((it) => (
                      <div key={it.id} className="py-1.5 flex items-center justify-between text-[11px]">
                        <span>• {it.description} ({it.tooth || 'Gral'})</span>
                        <span className="font-bold">S/ {it.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'consentimientos' && (
            <div className="space-y-3">
              {patientConsents.map((cons) => (
                <div key={cons.id} className="border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{cons.type}: {cons.procedureName}</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Firmado Digitalmente
                    </span>
                  </div>
                  <p className="text-slate-500">
                    Fecha: {cons.date} • Cirujano: {cons.dentistName} (COP: {cons.copNumber})
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

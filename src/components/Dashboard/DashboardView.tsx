import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  CalendarPlus,
  UserPlus,
  ArrowUpRight,
  Clock,
  Phone,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MessageCircle,
  Eye,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenNewAppointment: () => void;
  onOpenNewPatient: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewAppointment,
  onOpenNewPatient,
}) => {
  const {
    patients,
    appointments,
    payments,
    inventory,
    selectedSede,
    setCurrentView,
    setSelectedPatientId,
    updateAppointmentStatus,
  } = useApp();

  // Sede filtering
  const safePatients = patients || [];
  const safeAppointments = appointments || [];
  const safePayments = payments || [];
  const safeInventory = inventory || [];

  const filteredPatients = selectedSede === 'todas'
    ? safePatients
    : safePatients.filter((p) => p && p.sedeId === selectedSede);

  const todayStr = '2026-08-27'; // Current date context

  const todayAppointments = safeAppointments.filter((a) => {
    if (!a) return false;
    const matchSede = selectedSede === 'todas' || a.sedeId === selectedSede;
    return matchSede && (a.date === todayStr || (a.date && a.date.startsWith('2026-08-27')));
  });

  const totalMonthlyIncome = safePayments
    .filter((p) => p && (selectedSede === 'todas' || p.sedeId === selectedSede))
    .reduce((acc, curr) => acc + (curr && curr.status === 'pagado' ? (curr.amount ?? curr.total ?? 0) : 0), 0);

  const lowStockItems = safeInventory.filter(
    (item) =>
      item &&
      (item.stock ?? item.currentStock ?? 0) <= item.minStock &&
      (selectedSede === 'todas' || item.sedeId === selectedSede)
  );

  const recentPatients = [...filteredPatients].slice(0, 5);

  // 7-day income data
  const weekDays = [
    { day: 'Lun', amount: 450 },
    { day: 'Mar', amount: 620 },
    { day: 'Mié', amount: 890 },
    { day: 'Jue', amount: 1250 },
    { day: 'Vie', amount: 980 },
    { day: 'Sáb', amount: 1400 },
    { day: 'Dom', amount: 0 },
  ];
  const maxDayAmount = Math.max(...weekDays.map((d) => d.amount), 1);

  const handleOpenPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentView('pacientes');
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hola ${name || 'Estimado(a)'}, le saludamos de DENTS DS para coordinar su próxima atención odontológica.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div id="dashboard-view-container" className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome & Sede notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight">
              Panel de Control Odontológico
            </h1>
            <span className="bg-teal-400/20 text-teal-200 text-xs px-2.5 py-0.5 rounded-full border border-teal-300/30 font-medium">
              En Vivo
            </span>
          </div>
          <p className="text-xs md:text-sm text-teal-100/90 mt-1">
            Gestión de citas, historias clínicas, odontogramas y presupuestos en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="dash-btn-nueva-cita"
            onClick={onOpenNewAppointment}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-teal-900 hover:bg-teal-50 text-xs font-bold shadow-md transition-all hover:scale-105"
          >
            <CalendarPlus className="w-4 h-4 text-teal-700" />
            <span>+ Nueva Cita</span>
          </button>
          <button
            id="dash-btn-nuevo-paciente"
            onClick={onOpenNewPatient}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Nuevo Paciente</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards (Identical to video layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pacientes Activos */}
        <div
          onClick={() => setCurrentView('pacientes')}
          className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-xs hover:border-teal-400 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              Activos
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-800">{filteredPatients.length}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">PACIENTES ACTIVOS</p>
          </div>
        </div>

        {/* Card 2: Citas Hoy */}
        <div
          onClick={() => setCurrentView('agenda')}
          className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-xs hover:border-sky-400 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
              Hoy 27/08
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-800">{todayAppointments.length}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">CITAS HOY</p>
          </div>
        </div>

        {/* Card 3: Ingresos del Mes */}
        <div
          onClick={() => setCurrentView('facturacion')}
          className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-xs hover:border-emerald-400 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-800">
              S/ {totalMonthlyIncome.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">INGRESOS DEL MES</p>
          </div>
        </div>

        {/* Card 4: Stock Bajo */}
        <div
          onClick={() => setCurrentView('inventario')}
          className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-xs hover:border-rose-400 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full animate-pulse">
              Crítico
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold text-slate-800">{lowStockItems.length}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">STOCK BAJO ALERTA</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 2 Cols (Appointments & Patients) + Right 1 Col (7-Day Income & Low Stock) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2): Citas de Hoy & Últimos Pacientes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Citas de Hoy Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-500" />
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  CITAS DE HOY • 27/08/2026
                </h2>
              </div>
              <button
                id="btn-agenda-nueva-cita-table"
                onClick={onOpenNewAppointment}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors flex items-center gap-1"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>+ NUEVA CITA</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              {todayAppointments.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">HORA</th>
                      <th className="py-2.5 px-3">PACIENTE</th>
                      <th className="py-2.5 px-3">DOCTOR</th>
                      <th className="py-2.5 px-3">SILLÓN</th>
                      <th className="py-2.5 px-3">ESTADO</th>
                      <th className="py-2.5 px-3 text-right">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {todayAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          {apt.startTime || apt.time || '10:00'} {apt.endTime ? `- ${apt.endTime}` : ''}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleOpenPatient(apt.patientId)}
                            className="font-bold text-slate-900 hover:text-teal-700 text-left block"
                          >
                            {apt.patientName}
                          </button>
                          <span className="text-[10px] text-slate-500">{apt.specialty || apt.treatmentType || 'Odontología General'}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                          {(apt.doctorName || apt.dentistName || 'Dr. Odontólogo').replace('Dr. ', '')}
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                            {apt.chair || 'Sillón 1'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              apt.status === 'confirmada'
                                ? 'bg-emerald-100 text-emerald-800'
                                : apt.status === 'atendida'
                                ? 'bg-blue-100 text-blue-800'
                                : apt.status === 'pendiente'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                          {apt.status !== 'atendida' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'atendida')}
                              title="Marcar Atendida"
                              className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleWhatsApp(apt.patientPhone, apt.patientName)}
                            title="Enviar WhatsApp"
                            className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center">
                  <Calendar className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs font-semibold">No hay citas para hoy</p>
                  <button
                    onClick={onOpenNewAppointment}
                    className="mt-2 text-xs font-bold text-teal-600 hover:underline"
                  >
                    + Agendar la primera cita
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Últimos Pacientes Registrados Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  ÚLTIMOS PACIENTES REGISTRADOS
                </h2>
              </div>
              <button
                id="btn-dash-nuevo-paciente-table"
                onClick={onOpenNewPatient}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ NUEVO PACIENTE</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">N° HC</th>
                    <th className="py-2.5 px-3">PACIENTE</th>
                    <th className="py-2.5 px-3">TELÉFONO</th>
                    <th className="py-2.5 px-3">REGISTRO</th>
                    <th className="py-2.5 px-3 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-teal-700">
                        {p.code}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                            {p.firstName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{p.fullName}</p>
                            <p className="text-[10px] text-slate-500">
                              DNI: {p.docNumber} • {p.age} años
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono">
                        {p.phone || 'Sin teléfono'}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {p.createdAt}
                      </td>
                      <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenPatient(p.id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-teal-700 hover:bg-teal-50 rounded border border-teal-200 transition-colors"
                        >
                          Ver Ficha
                        </button>
                        <button
                          onClick={() => handleWhatsApp(p.phone, p.fullName)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Contactar WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Span 1): Ingresos 7 Días & Stock Bajo Widget */}
        <div className="space-y-6">
          {/* Ingresos Últimos 7 Días Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                INGRESOS ÚLTIMOS 7 DÍAS
              </h3>
              <span className="text-[11px] font-bold text-emerald-700">
                S/ {weekDays.reduce((a, b) => a + b.amount, 0).toLocaleString('es-PE')}
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="mt-4 flex items-end justify-between gap-2 h-44 pt-4 px-2 bg-slate-50/50 rounded-xl border border-slate-100">
              {weekDays.map((wd) => {
                const heightPercent = Math.round((wd.amount / maxDayAmount) * 100);
                return (
                  <div key={wd.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <span className="text-[9px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      S/{wd.amount}
                    </span>
                    <div
                      style={{ height: `${Math.max(heightPercent, 8)}%` }}
                      className={`w-full max-w-[28px] rounded-t-md transition-all duration-500 ${
                        wd.amount > 0
                          ? 'bg-gradient-to-t from-teal-600 to-cyan-400 group-hover:from-teal-500 group-hover:to-cyan-300 shadow-xs'
                          : 'bg-slate-200'
                      }`}
                    />
                    <span className="text-[10px] font-semibold text-slate-500 mt-1">{wd.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex justify-between text-[11px] text-slate-500">
              <span>Promedio diario: S/ 600.00</span>
              <button
                onClick={() => setCurrentView('reportes')}
                className="text-teal-700 hover:underline font-bold"
              >
                Ver Detalle →
              </button>
            </div>
          </div>

          {/* Stock Bajo Alert Widget (Identical to video layout) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                STOCK BAJO
              </h3>
              <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full">
                {lowStockItems.length} Alertas
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {lowStockItems.map((it) => (
                <div key={it.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{it.name}</p>
                    <p className="text-[10px] text-slate-500">{it.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {it.stock} {it.unit}
                    </span>
                    <p className="text-[9px] text-slate-400 mt-0.5">Mín: {it.minStock}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              id="btn-ver-inventario-dash"
              onClick={() => setCurrentView('inventario')}
              className="w-full mt-3 py-2 text-center text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors"
            >
              Ver Inventario Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

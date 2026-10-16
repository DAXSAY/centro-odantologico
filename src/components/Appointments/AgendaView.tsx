import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  MapPin,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  CalendarCheck,
  Filter,
  Search,
} from 'lucide-react';
import { Appointment } from '../../types';
import { NewAppointmentModal } from './NewAppointmentModal';
import confetti from 'canvas-confetti';

const STATUS_CONFIG: Record<Appointment['status'], { label: string; bg: string; text: string; border: string }> = {
  confirmada: { label: 'Confirmada', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  pendiente: { label: 'Pendiente', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  en_espera: { label: 'En Espera', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  atendida: { label: 'Atendida', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  cancelada: { label: 'Cancelada', bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
};

export const AgendaView: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    selectedSede,
    sedes,
    users,
    setCurrentView,
    setSelectedPatientId,
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date('2026-08-27'));
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [dentistFilter, setDentistFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApptForDetail, setSelectedApptForDetail] = useState<Appointment | null>(null);

  // Filter appointments
  const filteredAppointments = appointments.filter((a) => {
    const matchesSede = selectedSede === 'todas' || a.sedeId === selectedSede;
    const matchesDentist = dentistFilter === 'todos' || a.dentistId === dentistFilter;
    return matchesSede && matchesDentist;
  });

  const changeMonth = (delta: number) => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + delta);
      return d;
    });
  };

  const handleSendWhatsAppReminder = (appt: Appointment) => {
    const cleanPhone = (appt.patientPhone || '').replace(/\D/g, '');
    const timeStr = appt.time || appt.startTime || '10:00';
    const message = encodeURIComponent(
      `¡Hola ${appt.patientName || 'Estimado(a)'}! 👋 Le recordamos su cita odontológica en DENTS DS el día *${appt.date || ''}* a las *${timeStr}* con el Dr.(a) *${appt.dentistName || appt.doctorName || 'Especialista'}* para *${appt.treatmentType || 'Evaluación'}*. Por favor responda este mensaje para confirmar su asistencia. ¡Muchas gracias!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleGoogleCalendarSync = (appt: Appointment) => {
    const dateStr = (appt.date || new Date().toISOString().split('T')[0]).replace(/-/g, '');
    const timeStr = appt.time || appt.startTime || '10:00';
    const cleanTime = timeStr.replace(':', '');
    const startTimeStr = `${dateStr}T${cleanTime}00`;
    const hours = parseInt(timeStr.split(':')[0] || '10', 10);
    const mins = timeStr.split(':')[1] || '00';
    const endTimeHours = hours + 1;
    const endTimeStr = `${dateStr}T${endTimeHours.toString().padStart(2, '0')}${mins}00`;

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Cita Dental: ${appt.patientName || 'Paciente'} - ${appt.treatmentType || 'Consulta'}`
    )}&dates=${startTimeStr}/${endTimeStr}&details=${encodeURIComponent(
      `Odontólogo: ${appt.dentistName || appt.doctorName || 'Dr. DENTS DS'}\nNotas: ${appt.notes || 'Sin notas adicionales'}`
    )}&location=${encodeURIComponent('Clínica DENTS DS')}`;

    window.open(gcalUrl, '_blank');
  };

  const handleStatusChange = (id: string, newStatus: Appointment['status']) => {
    updateAppointmentStatus(id, newStatus);
    if (selectedApptForDetail && selectedApptForDetail.id === id) {
      setSelectedApptForDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Month grid helper
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div id="agenda-view" className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-900">
              Agenda y Gestión de Citas
            </h1>
            <p className="text-xs text-slate-500">
              Control de horarios por odontólogo, confirmaciones WhatsApp automáticas e integración Google Calendar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Dentist Filter */}
          <select
            value={dentistFilter}
            onChange={(e) => setDentistFilter(e.target.value)}
            className="text-xs font-bold p-2 bg-slate-50 border border-slate-300 rounded-xl"
          >
            <option value="todos">Todos los Odontólogos</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <button
            id="btn-nueva-cita-agenda"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nueva Cita</span>
          </button>
        </div>
      </div>

      {/* View Switcher & Month Navigation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-black text-slate-900 min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date('2026-08-27'))}
            className="px-2.5 py-1 text-xs font-bold text-teal-700 hover:bg-teal-50 border border-teal-200 rounded-lg ml-2"
          >
            Hoy
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {(['month', 'week', 'day', 'list'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                viewMode === mode
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {mode === 'month'
                ? 'Mes'
                : mode === 'week'
                ? 'Semana'
                : mode === 'day'
                ? 'Día'
                : 'Lista'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calendar View Modes */}
      {viewMode === 'month' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs overflow-x-auto">
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-slate-400 text-xs uppercase pb-2 border-b border-slate-100">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {/* Empty slots for start of month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px] bg-slate-50/50 rounded-xl p-1.5 opacity-40" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum
                .toString()
                .padStart(2, '0')}`;
              const dayAppointments = filteredAppointments.filter((a) => a.date === dateStr);
              const isToday = dateStr === '2026-08-27';

              return (
                <div
                  key={dayNum}
                  onClick={() => {
                    // Open new appt on this date
                    setIsModalOpen(true);
                  }}
                  className={`min-h-[110px] rounded-xl p-2 border transition-all flex flex-col justify-between cursor-pointer group hover:border-teal-400 ${
                    isToday
                      ? 'bg-teal-50/30 border-teal-400 ring-1 ring-teal-400'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-teal-600 text-white' : 'text-slate-700'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-1.5 py-0.2 rounded-full">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>

                  {/* Appointments list in cell */}
                  <div className="space-y-1 overflow-y-auto max-h-[80px]">
                    {dayAppointments.map((appt) => {
                      const cfg = STATUS_CONFIG[appt.status];
                      return (
                        <div
                          key={appt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApptForDetail(appt);
                          }}
                          className={`p-1 rounded text-[10px] font-semibold border truncate transition-all hover:scale-102 ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          title={`${appt.time} - ${appt.patientName} (${appt.treatmentType})`}
                        >
                          <span className="font-bold">{appt.time || appt.startTime || '10:00'}</span> • {(appt.patientName || 'Paciente').split(' ')[0]}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">FECHA Y HORA</th>
                  <th className="p-3.5">PACIENTE</th>
                  <th className="p-3.5">TRATAMIENTO</th>
                  <th className="p-3.5">ODONTÓLOGO</th>
                  <th className="p-3.5">ESTADO</th>
                  <th className="p-3.5 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((appt) => {
                  const cfg = STATUS_CONFIG[appt.status];
                  return (
                    <tr key={appt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono">
                        <span className="font-bold text-slate-900">{appt.date}</span>
                        <span className="block text-[11px] text-teal-700 font-bold">{appt.time} ({appt.durationMinutes} min)</span>
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{appt.patientName}</p>
                        <p className="text-[10px] text-slate-500">{appt.patientPhone}</p>
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">{appt.treatmentType}</td>
                      <td className="p-3.5 text-slate-800">{appt.dentistName}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleSendWhatsAppReminder(appt)}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold border border-emerald-200 text-[11px]"
                          title="Enviar Recordatorio WhatsApp"
                        >
                          WhatsApp
                        </button>
                        <button
                          onClick={() => handleGoogleCalendarSync(appt)}
                          className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg font-bold border border-sky-200 text-[11px]"
                          title="Sincronizar con Google Calendar"
                        >
                          G-Calendar
                        </button>
                        <button
                          onClick={() => setSelectedApptForDetail(appt)}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-[11px]"
                        >
                          Detalles
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Week and Day Views */}
      {(viewMode === 'week' || viewMode === 'day') && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center space-y-4">
          <div className="max-w-md mx-auto space-y-2">
            <CalendarCheck className="w-10 h-10 text-teal-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              Vista {viewMode === 'week' ? 'Semanal' : 'Diaria'} de Consultorios
            </h3>
            <p className="text-xs text-slate-500">
              Mostrando la distribución horaria para {filteredAppointments.length} citas programadas en la sede seleccionada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-left max-w-4xl mx-auto pt-2">
            {filteredAppointments.map((appt) => {
              const cfg = STATUS_CONFIG[appt.status];
              return (
                <div
                  key={appt.id}
                  onClick={() => setSelectedApptForDetail(appt)}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-teal-500 cursor-pointer space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                      {appt.time}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{appt.patientName}</h4>
                    <p className="text-[11px] text-slate-500">{appt.treatmentType}</p>
                  </div>
                  <div className="text-[10px] text-slate-600 flex items-center justify-between pt-1 border-t border-slate-200">
                    <span>{appt.dentistName}</span>
                    <span>{appt.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointment Detail & Status Management Modal */}
      {selectedApptForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-teal-700">
                  {selectedApptForDetail.date} • {selectedApptForDetail.time}
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {selectedApptForDetail.patientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApptForDetail(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                <p>
                  <strong className="text-slate-700">Tratamiento:</strong> {selectedApptForDetail.treatmentType}
                </p>
                <p>
                  <strong className="text-slate-700">Odontólogo:</strong> {selectedApptForDetail.dentistName}
                </p>
                <p>
                  <strong className="text-slate-700">Teléfono:</strong> {selectedApptForDetail.patientPhone}
                </p>
                {selectedApptForDetail.notes && (
                  <p>
                    <strong className="text-slate-700">Notas:</strong> {selectedApptForDetail.notes}
                  </p>
                )}
              </div>

              {/* Status Switcher Buttons */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Actualizar Estado de la Cita:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['confirmada', 'en_espera', 'atendida', 'cancelada'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedApptForDetail.id, st)}
                      className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                        selectedApptForDetail.status === st
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {(st || '').replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Integration Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleSendWhatsAppReminder(selectedApptForDetail)}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => handleGoogleCalendarSync(selectedApptForDetail)}
                  className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Google Calendar</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setSelectedPatientId(selectedApptForDetail.patientId);
                  setCurrentView('patient_detail');
                  setSelectedApptForDetail(null);
                }}
                className="w-full py-2 bg-teal-50 text-teal-800 hover:bg-teal-100 rounded-xl font-bold border border-teal-200 text-center"
              >
                Ver Ficha Médica Completa del Paciente →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

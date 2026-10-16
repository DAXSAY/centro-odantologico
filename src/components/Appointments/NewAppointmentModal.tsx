import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  User,
  MapPin,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  initialTime?: string;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  initialDate,
  initialTime,
}) => {
  const {
    patients,
    users,
    sedes,
    selectedSede,
    addAppointment,
    selectedPatientId,
  } = useApp();

  const [patientId, setPatientId] = useState(selectedPatientId || patients[0]?.id || '');
  const [dentistId, setDentistId] = useState(users[0]?.id || '');
  const [sedeId, setSedeId] = useState(
    selectedSede === 'todas' ? 'clinica-surco' : selectedSede
  );
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(initialTime || '10:00');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [treatmentType, setTreatmentType] = useState('Consulta y Diagnóstico');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    const dentist = users.find((u) => u.id === dentistId);

    if (!patient || !dentist) return;

    addAppointment({
      patientId: patient.id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      patientEmail: patient.email,
      dentistId: dentist.id,
      dentistName: dentist.name,
      sedeId,
      date,
      time,
      durationMinutes,
      treatmentType,
      status: 'confirmada',
      notes,
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-teal-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-300" />
            <h2 className="text-sm md:text-base font-bold">Agendar Nueva Cita</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Patient */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Paciente *</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} • {p.docNumber} ({p.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Sede & Dentist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Sede Clínica *</label>
              <select
                value={sedeId}
                onChange={(e) => setSedeId(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold"
                required
              >
                {sedes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Odontólogo / Especialista *</label>
              <select
                value={dentistId}
                onChange={(e) => setDentistId(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold"
                required
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.specialty || u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, Time, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Fecha *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Hora *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold font-mono"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Duración</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg"
              >
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min (1h)</option>
                <option value={90}>90 min (1.5h)</option>
                <option value={120}>120 min (2h)</option>
              </select>
            </div>
          </div>

          {/* Treatment Type */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Motivo / Tratamiento *</label>
            <select
              value={treatmentType}
              onChange={(e) => setTreatmentType(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
            >
              <option value="Consulta y Diagnóstico">Consulta y Diagnóstico Integral</option>
              <option value="Profilaxis y Limpieza Dental">Profilaxis y Limpieza con Ultrasonido</option>
              <option value="Curación con Resina">Curación / Obturación con Resina</option>
              <option value="Endodoncia Unirradicular/Multirradicular">Endodoncia (Tratamiento de Conducto)</option>
              <option value="Exodoncia Simple / Cirugía Tercer Molar">Exodoncia Simple / Tercer Molar</option>
              <option value="Control de Ortodoncia">Control y Ajuste de Ortodoncia</option>
              <option value="Blanqueamiento Dental">Blanqueamiento Dental Láser</option>
              <option value="Prótesis / Corona Dental">Prótesis fija / Corona Zirconio</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Notas / Indicaciones previas</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Paciente solicita cita primera hora, confirmar por WhatsApp..."
              className="w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              id="btn-confirmar-agendar-cita"
              type="submit"
              className="px-5 py-2.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              Confirmar y Agendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  User,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Treatment } from '../../types';
import confetti from 'canvas-confetti';

export const TreatmentsView: React.FC = () => {
  const {
    treatments,
    patients,
    addTreatment,
    updateTreatmentProgress,
    currentUser,
    selectedPatientId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [patientId, setPatientId] = useState(selectedPatientId || patients[0]?.id || '');
  const [name, setName] = useState('Curación con resina estética nanohíbrida');
  const [tooth, setTooth] = useState('Pieza 46');
  const [category, setCategory] = useState('Operatoria Dental');
  const [totalSessions, setTotalSessions] = useState(2);
  const [cost, setCost] = useState(140.0);
  const [notes, setNotes] = useState('Paciente refiere sensibilidad leve a alimentos fríos.');

  const selectedPatient = patients.find((p) => p.id === patientId);

  const handleCreateTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    addTreatment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      name,
      tooth,
      category,
      startDate: new Date().toISOString().split('T')[0],
      totalSessions,
      completedSessions: 1,
      cost,
      status: 'en_progreso',
      dentistName: currentUser.name,
      notes,
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setIsCreating(false);
  };

  const safeTreatments = treatments || [];
  const filteredTreatments = safeTreatments.filter((t) => {
    if (!t) return false;
    return (
      (t.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.tooth || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div id="treatments-view" className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-900">
              Tratamientos y Procedimientos Clínicos
            </h1>
            <p className="text-xs text-slate-500">
              Control del avance de procedimientos, evolución por sesiones y odontólogo a cargo
            </p>
          </div>
        </div>

        {!isCreating && (
          <button
            id="btn-nuevo-tratamiento"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nuevo Tratamiento</span>
          </button>
        )}
      </div>

      {isCreating ? (
        /* Create Treatment Form */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase">
              REGISTRAR NUEVO PROCEDIMIENTO CLÍNICO
            </h2>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              ← Volver
            </button>
          </div>

          <form onSubmit={handleCreateTreatment} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Paciente *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold"
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.docNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pieza Dentaria / Zona *</label>
                <input
                  type="text"
                  value={tooth}
                  onChange={(e) => setTooth(e.target.value)}
                  placeholder="Ej: Pieza 46, Arcada Superior..."
                  className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="Operatoria Dental">Operatoria Dental (Curaciones)</option>
                  <option value="Endodoncia">Endodoncia</option>
                  <option value="Ortodoncia">Ortodoncia</option>
                  <option value="Periodoncia">Periodoncia</option>
                  <option value="Cirugía Oral">Cirugía Oral</option>
                  <option value="Rehabilitación Oral">Rehabilitación Oral / Prótesis</option>
                  <option value="Estética Dental">Estética Dental / Blanqueamiento</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Procedimiento *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Total de Sesiones</label>
                <input
                  type="number"
                  min="1"
                  value={totalSessions}
                  onChange={(e) => setTotalSessions(parseInt(e.target.value, 10))}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Costo Total (S/)</label>
                <input
                  type="number"
                  step="0.5"
                  value={cost}
                  onChange={(e) => setCost(parseFloat(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-teal-800"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Notas de Evolución</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md"
              >
                Guardar Tratamiento
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Treatments list with progress bars */
        <div className="space-y-4">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar tratamiento o paciente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total: <strong>{filteredTreatments.length} procedimientos</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTreatments.map((t) => {
              const progressPct = Math.round((t.completedSessions / t.totalSessions) * 100);
              return (
                <div
                  key={t.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-teal-400 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {t.category} • {t.tooth}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{t.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">Paciente: {t.patientName}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.status === 'completado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'en_progreso'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {(t.status || '').replace('_', ' ')}
                    </span>
                  </div>

                  {/* Progress Bar & Sessions */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>
                        Sesiones: {t.completedSessions} de {t.totalSessions}
                      </span>
                      <span className="font-mono text-teal-700">{progressPct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-sky-500 transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Evolution notes & Quick Session Increment */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                      Dr.(a) {t.dentistName}
                    </span>

                    {t.status !== 'completado' && (
                      <button
                        onClick={() => {
                          const next = t.completedSessions + 1;
                          updateTreatmentProgress(t.id, next, next >= t.totalSessions ? 'completado' : 'en_progreso');
                        }}
                        className="px-3 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg font-bold border border-teal-200 transition-colors text-[11px]"
                      >
                        + Registrar Sesión
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

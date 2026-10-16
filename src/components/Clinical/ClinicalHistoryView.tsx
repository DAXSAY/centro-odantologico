import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  User,
  HeartPulse,
  Printer,
  ChevronRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { ClinicalHistory, CIE10Item } from '../../types';
import confetti from 'canvas-confetti';

export const ClinicalHistoryView: React.FC = () => {
  const {
    histories,
    patients,
    addClinicalHistory,
    cie10Catalog,
    currentUser,
    selectedPatientId,
    setSelectedPatientId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<ClinicalHistory | null>(null);

  // Form states for New Clinical History
  const [patientId, setPatientId] = useState(selectedPatientId || (patients[0]?.id ?? ''));
  const [openingDate, setOpeningDate] = useState(new Date().toISOString().split('T')[0]);
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [weight, setWeight] = useState(70.0);
  const [height, setHeight] = useState(170.0);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [currentIllness, setCurrentIllness] = useState('');
  const [generalAssessment, setGeneralAssessment] = useState('Paciente en aparente buen estado general, orientado en tiempo, espacio y persona.');
  const [intraoralExam, setIntraoralExam] = useState('');
  const [softTissues, setSoftTissues] = useState('Encías normocoloreadas, lengua y carrillos sin lesiones visibles.');
  const [treatmentPlan, setTreatmentPlan] = useState('');

  // CIE-10 autocomplete search state (matches video 05:25 - 06:05)
  const [cieSearch, setCieSearch] = useState('');
  const [selectedCieCodes, setSelectedCieCodes] = useState<Array<{ code: string; desc: string }>>([
    { code: 'K02.1', desc: 'Caries de la dentina' },
  ]);
  const [showCieDropdown, setShowCieDropdown] = useState(false);

  const safeHistories = histories || [];
  const filteredHistories = safeHistories.filter((h) => {
    if (!h) return false;
    return (
      (h.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (h.code || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const safeCie10 = cie10Catalog || [];
  const matchingCieItems = cieSearch.trim()
    ? safeCie10.filter(
        (c) =>
          c &&
          ((c.code || '').toLowerCase().includes(cieSearch.toLowerCase()) ||
            (c.description || '').toLowerCase().includes(cieSearch.toLowerCase()))
      )
    : [];

  const handleSelectCie = (item: CIE10Item) => {
    if (!selectedCieCodes.some((c) => c.code === item.code)) {
      setSelectedCieCodes((prev) => [...prev, { code: item.code, desc: item.description }]);
    }
    setCieSearch('');
    setShowCieDropdown(false);
  };

  const handleRemoveCie = (code: string) => {
    setSelectedCieCodes((prev) => prev.filter((c) => c.code !== code));
  };

  const handleSubmitHistory = (e: React.FormEvent) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === patientId);
    if (!selPatient) return;

    const newH = addClinicalHistory({
      patientId: selPatient.id,
      patientName: selPatient.fullName,
      openingDate,
      bloodPressure,
      weight,
      height,
      chiefComplaint,
      currentIllness,
      generalAssessment,
      intraoralExam,
      softTissues,
      cie10Codes: selectedCieCodes,
      treatmentPlan,
      dentistId: currentUser.id,
      dentistName: currentUser.name,
      status: 'activa',
    });

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setIsCreating(false);
    setSelectedHistory(newH);
  };

  return (
    <div id="clinical-history-view" className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-900">
              Historias Clínicas Odontológicas
            </h1>
            <p className="text-xs text-slate-500">
              Formato oficial conforme a la Norma Técnica de Salud N° 0153-MINSA y catálogo CIE-10
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isCreating && (
            <button
              id="btn-nueva-historia-clinica"
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nueva HC</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Form or List/Detail */}
      {isCreating ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-4 md:p-6 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase">
                HISTORIA CLÍNICA ODONTOLÓGICA (N° 0153 MINSA)
              </h2>
            </div>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              ← Cancelar y volver
            </button>
          </div>

          <form onSubmit={handleSubmitHistory} className="space-y-6 text-xs">
            {/* Patient & General info */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl items-end">
              <div className="sm:col-span-4">
                <label className="font-bold text-slate-700 block mb-1">Paciente *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.fullName} (DNI: {p.docNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Fecha Apertura</label>
                <input
                  type="date"
                  value={openingDate}
                  onChange={(e) => setOpeningDate(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Presión Arterial</label>
                <input
                  type="text"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  placeholder="120/80"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Peso (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Talla (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Motivo & Enfermedad Actual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Motivo de consulta *
                </label>
                <textarea
                  rows={3}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="Describe el motivo principal de consulta..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Enfermedad actual (tiempo, síntomas)
                </label>
                <textarea
                  rows={3}
                  value={currentIllness}
                  onChange={(e) => setCurrentIllness(e.target.value)}
                  placeholder="Cronología, síntomas referidos por el paciente..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Examen Clínico */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Anamnesis general
                </label>
                <textarea
                  rows={2}
                  value={generalAssessment}
                  onChange={(e) => setGeneralAssessment(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Examen intraoral (ATM, oclusión, ganglios)
                </label>
                <textarea
                  rows={2}
                  value={intraoralExam}
                  onChange={(e) => setIntraoralExam(e.target.value)}
                  placeholder="Higiene oral, sarro, placa, mordida..."
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tejidos blandos (encías, mucosa, lengua)
                </label>
                <textarea
                  rows={2}
                  value={softTissues}
                  onChange={(e) => setSoftTissues(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* CIE-10 Autocomplete Search (Exact Video Match 05:25 - 06:05) */}
            <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-teal-900 uppercase tracking-wide flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-teal-700" />
                  Diagnóstico Odontológico CIE-10
                </label>
                <span className="text-[11px] text-teal-700 font-semibold">
                  Escriba el código o descripción para autocompletar
                </span>
              </div>

              {/* Selected CIE-10 badges */}
              <div className="flex flex-wrap gap-2">
                {selectedCieCodes.map((item) => (
                  <span
                    key={item.code}
                    className="bg-white border border-teal-300 text-teal-900 px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <strong className="font-mono bg-teal-100 text-teal-800 px-1 rounded">
                      {item.code}
                    </strong>
                    <span>{item.desc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCie(item.code)}
                      className="text-rose-500 hover:text-rose-700 ml-1 font-black"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Autocomplete Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar código CIE-10 (ej: K02, K005, A505, K04, Caries...)"
                  value={cieSearch}
                  onChange={(e) => {
                    setCieSearch(e.target.value);
                    setShowCieDropdown(true);
                  }}
                  onFocus={() => setShowCieDropdown(true)}
                  className="w-full p-2.5 bg-white border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                />

                {showCieDropdown && matchingCieItems.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-300 rounded-xl shadow-xl max-h-56 overflow-y-auto z-50 divide-y divide-slate-100">
                    {matchingCieItems.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => handleSelectCie(item)}
                        className="w-full px-3 py-2 text-left hover:bg-teal-50 flex items-center justify-between text-xs"
                      >
                        <span className="font-mono font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                          {item.code}
                        </span>
                        <span className="flex-1 ml-3 text-slate-700 font-medium">
                          {item.description}
                        </span>
                        <span className="text-[10px] text-teal-600 font-semibold">
                          + Agregar
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Plan de Tratamiento */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Plan de Tratamiento (resumen) *
              </label>
              <textarea
                rows={3}
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                placeholder="1. Destartraje con ultrasonido. 2. Curación con resina en pieza 46. 3. Control..."
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>

            {/* Submit buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                id="btn-crear-historia-clinica"
                type="submit"
                className="px-5 py-2.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                Crear Historia Clínica
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Table of Clinical Histories */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar paciente o N° HC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total: <strong>{filteredHistories.length} historias clínicas</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">N° HC</th>
                  <th className="py-3 px-4">PACIENTE</th>
                  <th className="py-3 px-4">APERTURA</th>
                  <th className="py-3 px-4">MOTIVO</th>
                  <th className="py-3 px-4">ESTADO</th>
                  <th className="py-3 px-4 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistories.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-700">
                      {h.code}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{h.patientName}</p>
                      <p className="text-[10px] text-slate-500">{h.dentistName}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{h.openingDate}</td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">
                      {h.chiefComplaint}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {h.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedHistory(h)}
                        className="px-3 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg font-bold border border-teal-200 transition-colors"
                      >
                        Abrir HC
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected History Modal View */}
      {selectedHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold bg-teal-600 text-white px-2.5 py-0.5 rounded">
                  {selectedHistory.code}
                </span>
                <h2 className="text-base font-black text-slate-900 mt-1">
                  {selectedHistory.patientName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedHistory(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
              <div>
                <span className="text-slate-400">Fecha:</span>{' '}
                <strong>{selectedHistory.openingDate}</strong>
              </div>
              <div>
                <span className="text-slate-400">Presión:</span>{' '}
                <strong>{selectedHistory.bloodPressure}</strong>
              </div>
              <div>
                <span className="text-slate-400">Peso:</span>{' '}
                <strong>{selectedHistory.weight} kg</strong>
              </div>
              <div>
                <span className="text-slate-400">Talla:</span>{' '}
                <strong>{selectedHistory.height} cm</strong>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <p className="font-bold text-slate-800">Motivo de consulta:</p>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {selectedHistory.chiefComplaint}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800">Diagnóstico CIE-10:</p>
                <div className="space-y-1 mt-1">
                  {selectedHistory.cie10Codes.map((c, i) => (
                    <p
                      key={i}
                      className="bg-teal-50 text-teal-900 font-semibold p-2 rounded-lg border border-teal-200"
                    >
                      • <strong>{c.code}</strong>: {c.desc}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-800">Plan de Tratamiento:</p>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {selectedHistory.treatmentPlan}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Imprimir
              </button>
              <button
                onClick={() => setSelectedHistory(null)}
                className="px-4 py-1.5 text-xs font-bold bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

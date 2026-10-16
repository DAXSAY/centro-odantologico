import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Plus,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  Zap,
} from 'lucide-react';
import { EndodonticRecord, CanalMeasurement } from '../../types';
import confetti from 'canvas-confetti';

export const EndodonticsView: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    endodontics,
    addEndodonticRecord,
    currentUser,
  } = useApp();

  const [activePatientId, setActivePatientId] = useState(
    selectedPatientId || patients[0]?.id || ''
  );
  const [toothNumber, setToothNumber] = useState(46);
  const [diagnosis, setDiagnosis] = useState('Pulpitis irreversible sintomática con periodontitis apical sintomática');
  const [coldTest, setColdTest] = useState<'positivo' | 'negativo' | 'hiperreactivo'>('hiperreactivo');
  const [percussion, setPercussion] = useState<'positivo' | 'negativo'>('positivo');
  const [palpation, setPalpation] = useState<'positivo' | 'negativo'>('positivo');
  const [mobility, setMobility] = useState<'grado 0' | 'grado 1' | 'grado 2' | 'grado 3'>('grado 0');

  // Multi-canal measurements
  const [canals, setCanals] = useState<CanalMeasurement[]>([
    {
      canalName: 'Mesio-Vestibular (MV)',
      referencePoint: 'Cúspide MV',
      apparentLength: 21.0,
      realWorkLength: 20.5,
      apicalFile: '#30 (.04)',
      sealer: 'AH Plus',
      obturationTechnique: 'Cono único reciprocante',
    },
    {
      canalName: 'Mesio-Lingual (ML)',
      referencePoint: 'Cúspide ML',
      apparentLength: 21.0,
      realWorkLength: 20.5,
      apicalFile: '#30 (.04)',
      sealer: 'AH Plus',
      obturationTechnique: 'Cono único reciprocante',
    },
    {
      canalName: 'Distal (D)',
      referencePoint: 'Cúspide Distal',
      apparentLength: 22.0,
      realWorkLength: 21.5,
      apicalFile: '#35 (.04)',
      sealer: 'AH Plus',
      obturationTechnique: 'Cono único reciprocante',
    },
  ]);

  const [notes, setNotes] = useState('Irrigación abundante con NaOCl 5.25% y EDTA 17%. Activación sónica Ultra X. Sellado con Biodentine en cámara pulpar.');
  const [status, setStatus] = useState<'en_proceso' | 'concluido'>('concluido');

  const activePatient = patients.find((p) => p.id === activePatientId);

  const updateCanal = (index: number, field: keyof CanalMeasurement, value: any) => {
    setCanals((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddCanal = () => {
    setCanals((prev) => [
      ...prev,
      {
        canalName: `Canal ${prev.length + 1}`,
        referencePoint: 'Borde Incisal',
        apparentLength: 22.0,
        realWorkLength: 21.0,
        apicalFile: '#30 (.04)',
        sealer: 'AH Plus',
        obturationTechnique: 'Condensación lateral',
      },
    ]);
  };

  const handleRemoveCanal = (index: number) => {
    setCanals((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    addEndodonticRecord({
      patientId: activePatient.id,
      patientName: activePatient.fullName,
      toothNumber,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      vitalityTests: {
        cold: coldTest,
        percussion,
        palpation,
        mobility,
      },
      canals,
      notes,
      status,
      dentistName: currentUser.name,
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    alert('¡Ficha de Endodoncia guardada con éxito!');
  };

  return (
    <div id="endodontics-view" className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-900">
              Módulo de Endodoncia y Terapia Radicular
            </h1>
            <p className="text-xs text-slate-500">
              Pruebas de vitalidad pulpar, conductometría milimétrica y técnicas de obturación
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activePatientId}
            onChange={(e) => {
              setActivePatientId(e.target.value);
              setSelectedPatientId(e.target.value);
            }}
            className="text-xs font-bold p-2 bg-slate-50 border border-slate-300 rounded-xl"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Endodontics Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 text-xs">
        {/* Top bar: Tooth & Diagnosis */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 bg-purple-50/40 border border-purple-200 rounded-xl items-end">
          <div className="sm:col-span-3">
            <label className="font-bold text-slate-800 block mb-1">Pieza Dentaria a Tratar *</label>
            <select
              value={toothNumber}
              onChange={(e) => setToothNumber(parseInt(e.target.value, 10))}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-purple-900"
            >
              {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28, 48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map(
                (n) => (
                  <option key={n} value={n}>
                    Pieza {n} {n >= 14 && n <= 28 ? '(Superior)' : '(Inferior)'}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="sm:col-span-6">
            <label className="font-bold text-slate-800 block mb-1">Diagnóstico Pulpar / Periapical *</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold"
              required
            />
          </div>

          <div className="sm:col-span-3">
            <label className="font-bold text-slate-800 block mb-1">Estado de Tratamiento</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-teal-800"
            >
              <option value="en_proceso">En Proceso (Biopulpectomía / Medicación)</option>
              <option value="concluido">Concluido (Obturado)</option>
            </select>
          </div>
        </div>

        {/* Vitality & Clinical Tests */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Pruebas Diagnósticas de Sensibilidad y Periápice
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <label className="font-bold text-slate-700 block">Test Térmico (Frío)</label>
              <select
                value={coldTest}
                onChange={(e) => setColdTest(e.target.value as any)}
                className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="hiperreactivo">Hiperreactivo (Dolor prolongado)</option>
                <option value="positivo">Positivo normal</option>
                <option value="negativo">Negativo (Necrosis pulpar)</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <label className="font-bold text-slate-700 block">Percusión</label>
              <select
                value={percussion}
                onChange={(e) => setPercussion(e.target.value as any)}
                className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="positivo">Positivo (+) Dolor</option>
                <option value="negativo">Negativo (-) Asintomático</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <label className="font-bold text-slate-700 block">Palpación Apical</label>
              <select
                value={palpation}
                onChange={(e) => setPalpation(e.target.value as any)}
                className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="positivo">Positivo (+) Sensible</option>
                <option value="negativo">Negativo (-)</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <label className="font-bold text-slate-700 block">Movilidad Dental</label>
              <select
                value={mobility}
                onChange={(e) => setMobility(e.target.value as any)}
                className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="grado 0">Grado 0 (Fisiológica)</option>
                <option value="grado 1">Grado 1 (&lt; 1mm)</option>
                <option value="grado 2">Grado 2 (&gt; 1mm horizontal)</option>
                <option value="grado 3">Grado 3 (Vertical)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conductometry & Canals Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              CONDUCTOMETRÍA Y TRATAMIENTO DE CONDUCTOS
            </h3>
            <button
              type="button"
              onClick={handleAddCanal}
              className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> + Añadir Conducto
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Conducto</th>
                  <th className="p-3">Punto Referencia</th>
                  <th className="p-3">CAD (mm)</th>
                  <th className="p-3">CRT (mm)</th>
                  <th className="p-3">Lima Apical (FMA)</th>
                  <th className="p-3">Sellador / Técnica</th>
                  <th className="p-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {canals.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2">
                      <input
                        type="text"
                        value={c.canalName}
                        onChange={(e) => updateCanal(idx, 'canalName', e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded font-semibold text-purple-950"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={c.referencePoint}
                        onChange={(e) => updateCanal(idx, 'referencePoint', e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.5"
                        value={c.apparentLength}
                        onChange={(e) => updateCanal(idx, 'apparentLength', parseFloat(e.target.value))}
                        className="w-20 p-1.5 border border-slate-300 rounded font-mono text-center"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.5"
                        value={c.realWorkLength}
                        onChange={(e) => updateCanal(idx, 'realWorkLength', parseFloat(e.target.value))}
                        className="w-20 p-1.5 border border-teal-400 bg-teal-50 font-mono font-bold text-teal-900 text-center rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={c.apicalFile}
                        onChange={(e) => updateCanal(idx, 'apicalFile', e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded font-mono"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={c.obturationTechnique}
                        onChange={(e) => updateCanal(idx, 'obturationTechnique', e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveCanal(idx)}
                        className="text-rose-500 hover:text-rose-700 font-bold"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Observations */}
        <div className="space-y-1.5">
          <label className="font-bold text-slate-800 block">
            Protocolo de Irrigación, Medicación Intraconducto y Notas:
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            id="btn-guardar-endodoncia"
            type="submit"
            className="px-6 py-2.5 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-xl shadow-md transition-all hover:scale-[1.02] flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Registro de Endodoncia</span>
          </button>
        </div>
      </form>
    </div>
  );
};

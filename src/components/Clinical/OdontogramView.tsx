import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Grid3X3,
  Save,
  RotateCcw,
  Sparkles,
  Info,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { ToothCondition, OdontogramRecord } from '../../types';
import confetti from 'canvas-confetti';

// Surface color mapping
const CONDITION_COLORS: Record<string, { bg: string; label: string; border: string }> = {
  caries: { bg: '#ef4444', label: 'Caries Dental (Rojo)', border: '#b91c1c' },
  resina: { bg: '#0284c7', label: 'Resina / Curación (Azul)', border: '#0369a1' },
  amalgama: { bg: '#64748b', label: 'Amalgama (Gris)', border: '#475569' },
  sellante: { bg: '#10b981', label: 'Sellante (Verde)', border: '#059669' },
  corona: { bg: '#f59e0b', label: 'Corona Protésica (Amarillo)', border: '#d97706' },
  endodoncia: { bg: '#8b5cf6', label: 'Endodoncia (Púrpura)', border: '#6d28d9' },
  implante: { bg: '#06b6d4', label: 'Implante (Cian)', border: '#0891b2' },
  ausente: { bg: '#1e293b', label: 'Pieza Ausente (Cruz)', border: '#0f172a' },
  extraccion: { bg: '#dc2626', label: 'Extracción Indicada', border: '#991b1b' },
  sano: { bg: '#ffffff', label: 'Sano / Limpiar', border: '#cbd5e1' },
};

// Permanent teeth numbers
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];

// Deciduous teeth
const DECIDUOUS_UPPER_RIGHT = [55, 54, 53, 52, 51];
const DECIDUOUS_UPPER_LEFT = [61, 62, 63, 64, 65];
const DECIDUOUS_LOWER_RIGHT = [85, 84, 83, 82, 81];
const DECIDUOUS_LOWER_LEFT = [71, 72, 73, 74, 75];

export const OdontogramView: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    odontograms,
    saveOdontogram,
    currentUser,
    addBudget,
  } = useApp();

  const [activePatientId, setActivePatientId] = useState<string>(
    selectedPatientId || patients[0]?.id || ''
  );
  const [selectedTool, setSelectedTool] = useState<string>('caries');
  const [dentitionType, setDentitionType] = useState<'permanente' | 'temporal'>('permanente');

  // Load existing odontogram record if any
  const existingRecord = odontograms.find((o) => o.patientId === activePatientId);

  const [teethState, setTeethState] = useState<Record<number, ToothCondition>>(() => {
    return existingRecord ? existingRecord.teeth : {};
  });
  const [notes, setNotes] = useState<string>(existingRecord?.notes || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const activePatient = patients.find((p) => p.id === activePatientId);

  const handleToothSurfaceClick = (toothNumber: number, surface: string) => {
    setTeethState((prev) => {
      const currentTooth = prev[toothNumber] || { surfaces: {}, generalState: 'sano' };
      const surfaces = { ...currentTooth.surfaces };

      if (selectedTool === 'sano') {
        delete surfaces[surface];
      } else if (['ausente', 'extraccion', 'corona', 'endodoncia', 'implante'].includes(selectedTool)) {
        return {
          ...prev,
          [toothNumber]: {
            ...currentTooth,
            generalState: selectedTool as any,
          },
        };
      } else {
        surfaces[surface] = selectedTool;
      }

      return {
        ...prev,
        [toothNumber]: {
          ...currentTooth,
          surfaces,
        },
      };
    });
  };

  const handleGeneralStateChange = (toothNumber: number, state: any) => {
    setTeethState((prev) => {
      const currentTooth = prev[toothNumber] || { surfaces: {}, generalState: 'sano' };
      return {
        ...prev,
        [toothNumber]: {
          ...currentTooth,
          generalState: state,
        },
      };
    });
  };

  const handleSave = () => {
    if (!activePatient) return;
    saveOdontogram({
      patientId: activePatient.id,
      patientName: activePatient.fullName,
      date: new Date().toISOString().split('T')[0],
      dentistName: currentUser.name,
      notes,
      teeth: teethState,
    });
    setSaveSuccess(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Convert diagnosed odontogram findings into a ready treatment budget
  const handleGenerateBudget = () => {
    if (!activePatient) return;

    const items: any[] = [];
    Object.entries(teethState).forEach(([toothNum, cond]: [string, any]) => {
      if (cond.generalState === 'endodoncia') {
        items.push({
          id: `bi-${Date.now()}-${toothNum}`,
          tooth: `Pieza ${toothNum}`,
          cieCode: 'D3310',
          description: `Tratamiento de Endodoncia en Pieza ${toothNum}`,
          quantity: 1,
          unitPrice: 280.0,
          discount: 0,
          total: 280.0,
          status: 'pendiente',
        });
      }
      if (cond.generalState === 'corona') {
        items.push({
          id: `bi-${Date.now()}-${toothNum}-cor`,
          tooth: `Pieza ${toothNum}`,
          cieCode: 'D2740',
          description: `Corona de porcelana / zirconio Pieza ${toothNum}`,
          quantity: 1,
          unitPrice: 550.0,
          discount: 50.0,
          total: 500.0,
          status: 'pendiente',
        });
      }
      if (cond.generalState === 'extraccion') {
        items.push({
          id: `bi-${Date.now()}-${toothNum}-ext`,
          tooth: `Pieza ${toothNum}`,
          cieCode: 'D7140',
          description: `Exodoncia simple / quirúrgica Pieza ${toothNum}`,
          quantity: 1,
          unitPrice: 120.0,
          discount: 0,
          total: 120.0,
          status: 'pendiente',
        });
      }
      Object.entries(cond.surfaces || {}).forEach(([surf, type]) => {
        if (type === 'caries') {
          items.push({
            id: `bi-${Date.now()}-${toothNum}-${surf}`,
            tooth: `Pieza ${toothNum} (${surf})`,
            cieCode: 'D2391',
            description: `Curación con Resina Fotocurable Nanohíbrida Pieza ${toothNum}`,
            quantity: 1,
            unitPrice: 140.0,
            discount: 0,
            total: 140.0,
            status: 'pendiente',
          });
        }
      });
    });

    if (items.length === 0) {
      items.push({
        id: `bi-${Date.now()}-def`,
        tooth: 'General',
        cieCode: 'D1110',
        description: 'Profilaxis dental profunda y destartraje',
        quantity: 1,
        unitPrice: 120.0,
        discount: 0,
        total: 120.0,
        status: 'pendiente',
      });
    }

    const subtotal = items.reduce((acc, it) => acc + it.total, 0);
    const igv = subtotal * 0.18;

    addBudget({
      patientId: activePatient.id,
      patientName: activePatient.fullName,
      date: new Date().toISOString().split('T')[0],
      expirationDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      dentistName: currentUser.name,
      sedeId: activePatient.sedeId,
      status: 'borrador',
      items,
      subtotal,
      discount: 0,
      igv,
      total: subtotal,
      notes: 'Presupuesto generado automáticamente desde el Odontograma clínico.',
    });

    alert('¡Presupuesto generado exitosamente a partir del Odontograma!');
  };

  // Render a single interactive tooth with 5 geometric polygon facets
  const renderTooth = (num: number) => {
    const toothData = teethState[num] || { surfaces: {}, generalState: 'sano' };
    const { surfaces, generalState } = toothData;

    const getColor = (surf: string) => {
      const condition = surfaces[surf];
      if (!condition) return '#ffffff';
      return CONDITION_COLORS[condition]?.bg || '#ffffff';
    };

    const isAusente = generalState === 'ausente';
    const isExtraccion = generalState === 'extraccion';
    const isCorona = generalState === 'corona';
    const isEndo = generalState === 'endodoncia';
    const isImplante = generalState === 'implante';

    return (
      <div key={num} className="flex flex-col items-center gap-1 group">
        <span className="text-[11px] font-bold font-mono text-slate-700">{num}</span>

        {/* SVG Tooth Diagram */}
        <div className="relative w-11 h-11 bg-white rounded-lg border border-slate-300 shadow-2xs hover:border-teal-500 transition-all p-0.5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Top / Vestibular surface */}
            <polygon
              points="0,0 100,0 75,25 25,25"
              fill={getColor('top')}
              stroke="#64748b"
              strokeWidth="2"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleToothSurfaceClick(num, 'top')}
            />
            {/* Bottom / Lingual surface */}
            <polygon
              points="25,75 75,75 100,100 0,100"
              fill={getColor('bottom')}
              stroke="#64748b"
              strokeWidth="2"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleToothSurfaceClick(num, 'bottom')}
            />
            {/* Left / Mesial surface */}
            <polygon
              points="0,0 25,25 25,75 0,100"
              fill={getColor('left')}
              stroke="#64748b"
              strokeWidth="2"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleToothSurfaceClick(num, 'left')}
            />
            {/* Right / Distal surface */}
            <polygon
              points="100,0 100,100 75,75 75,25"
              fill={getColor('right')}
              stroke="#64748b"
              strokeWidth="2"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleToothSurfaceClick(num, 'right')}
            />
            {/* Center / Oclusal surface */}
            <polygon
              points="25,25 75,25 75,75 25,75"
              fill={getColor('center')}
              stroke="#64748b"
              strokeWidth="2"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleToothSurfaceClick(num, 'center')}
            />

            {/* Overlays for special conditions */}
            {isAusente && (
              <g stroke="#0f172a" strokeWidth="6" strokeLinecap="round">
                <line x1="10" y1="10" x2="90" y2="90" />
                <line x1="90" y1="10" x2="10" y2="90" />
              </g>
            )}
            {isExtraccion && (
              <g stroke="#dc2626" strokeWidth="6" strokeLinecap="round">
                <line x1="10" y1="10" x2="90" y2="90" />
                <line x1="90" y1="10" x2="10" y2="90" />
              </g>
            )}
            {isCorona && (
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="6"
                strokeDasharray="4,4"
              />
            )}
            {isEndo && (
              <path
                d="M 50 15 L 50 85 M 40 50 L 60 50"
                stroke="#8b5cf6"
                strokeWidth="5"
                strokeLinecap="round"
              />
            )}
            {isImplante && (
              <rect x="40" y="20" width="20" height="60" fill="#06b6d4" rx="4" />
            )}
          </svg>
        </div>

        {/* Quick status cycle button */}
        <button
          onClick={() => {
            const states = ['sano', 'corona', 'endodoncia', 'extraccion', 'ausente'];
            const currIdx = states.indexOf(generalState || 'sano');
            const next = states[(currIdx + 1) % states.length];
            handleGeneralStateChange(num, next);
          }}
          className="text-[9px] text-slate-400 hover:text-teal-600 font-bold"
          title="Cambiar estado general"
        >
          {generalState && generalState !== 'sano' ? generalState.slice(0, 4) : '•'}
        </button>
      </div>
    );
  };

  return (
    <div id="odontogram-view" className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <Grid3X3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-900">
              Odontograma Digital Interactivo
            </h1>
            <p className="text-xs text-slate-500">
              Marcado de caras vestibulares, linguales, oclusales y diagnósticos odontológicos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={activePatientId}
            onChange={(e) => {
              setActivePatientId(e.target.value);
              setSelectedPatientId(e.target.value);
            }}
            className="text-xs font-bold p-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.fullName}
              </option>
            ))}
          </select>

          <button
            id="btn-guardar-odontograma"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Guardar</span>
          </button>

          <button
            id="btn-presupuesto-desde-odontograma"
            onClick={handleGenerateBudget}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors"
            title="Convertir hallazgos en Presupuesto automático"
          >
            <DollarSign className="w-4 h-4" />
            <span>Crear Presupuesto</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Odontograma guardado correctamente en la ficha del paciente.</span>
        </div>
      )}

      {/* Palette Toolbar (Dental Diagnostic Tools) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Herramienta de Diagnóstico Activa:</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setDentitionType('permanente')}
              className={`px-3 py-1 rounded-lg transition-all ${
                dentitionType === 'permanente'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Dentición Adulto (Permanente)
            </button>
            <button
              onClick={() => setDentitionType('temporal')}
              className={`px-3 py-1 rounded-lg transition-all ${
                dentitionType === 'temporal'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Dentición Niños (Decidua)
            </button>
          </div>
        </div>

        {/* Diagnostic Buttons */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(CONDITION_COLORS).map(([key, info]) => {
            const isSelected = selectedTool === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedTool(key)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                  isSelected
                    ? 'ring-2 ring-teal-500 bg-slate-900 text-white border-slate-900 shadow-sm scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                  style={{ backgroundColor: info.bg }}
                />
                <span>{(info.label || '').split('(')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Odontogram Canvas (Arches) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-8 overflow-x-auto">
        {dentitionType === 'permanente' ? (
          <>
            {/* Upper Arch (Maxilar Superior) */}
            <div className="space-y-2">
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  ARCADA SUPERIOR (MAXILAR)
                </span>
              </div>
              <div className="flex items-center justify-center gap-1 sm:gap-2 pt-2">
                {/* Cuadrante 1 */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {UPPER_RIGHT.map((num) => renderTooth(num))}
                </div>
                <div className="w-0.5 h-14 bg-slate-300 mx-2" />
                {/* Cuadrante 2 */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {UPPER_LEFT.map((num) => renderTooth(num))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-slate-200" />

            {/* Lower Arch (Mandíbula) */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                {/* Cuadrante 4 */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {LOWER_RIGHT.map((num) => renderTooth(num))}
                </div>
                <div className="w-0.5 h-14 bg-slate-300 mx-2" />
                {/* Cuadrante 3 */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {LOWER_LEFT.map((num) => renderTooth(num))}
                </div>
              </div>
              <div className="text-center pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  ARCADA INFERIOR (MANDÍBULA)
                </span>
              </div>
            </div>
          </>
        ) : (
          /* Deciduous Dentition */
          <>
            <div className="space-y-2">
              <div className="text-center">
                <span className="text-xs font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                  ARCADA SUPERIOR TEMPORAL (NIÑOS)
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="flex items-center gap-2">
                  {DECIDUOUS_UPPER_RIGHT.map((num) => renderTooth(num))}
                </div>
                <div className="w-0.5 h-14 bg-slate-300 mx-2" />
                <div className="flex items-center gap-2">
                  {DECIDUOUS_UPPER_LEFT.map((num) => renderTooth(num))}
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200" />

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  {DECIDUOUS_LOWER_RIGHT.map((num) => renderTooth(num))}
                </div>
                <div className="w-0.5 h-14 bg-slate-300 mx-2" />
                <div className="flex items-center gap-2">
                  {DECIDUOUS_LOWER_LEFT.map((num) => renderTooth(num))}
                </div>
              </div>
              <div className="text-center pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                  ARCADA INFERIOR TEMPORAL (NIÑOS)
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Observations & Treatment Notes */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
          Observaciones Clínicas del Odontograma
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anotaciones de caries oclusales, necesidad de prótesis o aparatología..."
          className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setTeethState({})}
            className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Limpiar Odontograma
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

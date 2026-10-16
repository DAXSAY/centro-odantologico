import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ScanLine,
  Save,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { CephalometryRecord } from '../../types';
import confetti from 'canvas-confetti';

const LANDMARKS = [
  { id: 'S', name: 'Silla Turca (S)', desc: 'Centro geométrico de la fosa hipofisaria' },
  { id: 'N', name: 'Nasion (N)', desc: 'Punto más anterior de la sutura frontonasal' },
  { id: 'A', name: 'Punto A (Subespinal)', desc: 'Punto más profundo en la concavidad anterior del maxilar' },
  { id: 'B', name: 'Punto B (Supramentoniano)', desc: 'Punto más profundo en la concavidad anterior de la sínfisis' },
  { id: 'Go', name: 'Gonion (Go)', desc: 'Punto de unión entre rama y cuerpo mandibular' },
  { id: 'Me', name: 'Menton (Me)', desc: 'Punto más inferior de la sínfisis mandibular' },
  { id: 'Gn', name: 'Gnathion (Gn)', desc: 'Punto más anteroinferior de la sínfisis' },
  { id: 'Pog', name: 'Pogonion (Pog)', desc: 'Punto más anterior de la sínfisis mandibular' },
];

export const CephalometryView: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    cephalometries,
    saveCephalometry,
  } = useApp();

  const [activePatientId, setActivePatientId] = useState(
    selectedPatientId || patients[0]?.id || ''
  );

  const existingCeph = cephalometries.find((c) => c.patientId === activePatientId);

  const [points, setPoints] = useState<Record<string, { x: number; y: number }>>(() => {
    return existingCeph?.points || {
      S: { x: 320, y: 160 },
      N: { x: 440, y: 130 },
      A: { x: 430, y: 260 },
      B: { x: 410, y: 330 },
      Go: { x: 280, y: 320 },
      Me: { x: 400, y: 380 },
      Gn: { x: 405, y: 365 },
      Pog: { x: 420, y: 350 },
    };
  });

  const [selectedPointId, setSelectedPointId] = useState<string>('S');
  const [activeDragPoint, setActiveDragPoint] = useState<string | null>(null);
  const [notes, setNotes] = useState(existingCeph?.notes || 'Patrón esquelético y trazado cefalométrico normal.');

  // Calculate geometric angles in real time
  const calculateAngle = (p1: { x: number; y: number }, vertex: { x: number; y: number }, p2: { x: number; y: number }) => {
    const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
    const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    if (mag1 === 0 || mag2 === 0) return 0;
    const rad = Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2))));
    return parseFloat(((rad * 180) / Math.PI).toFixed(1));
  };

  const sna = points.S && points.N && points.A ? calculateAngle(points.S, points.N, points.A) : 82.0;
  const snb = points.S && points.N && points.B ? calculateAngle(points.S, points.N, points.B) : 80.0;
  const anb = parseFloat((sna - snb).toFixed(1));
  const fma = points.Go && points.Me && points.S && points.N ? calculateAngle(points.Go, points.Me, points.N) : 25.0;

  const skeletalClass: 'Clase I' | 'Clase II' | 'Clase III' =
    anb > 4 ? 'Clase II' : anb < 0 ? 'Clase III' : 'Clase I';

  const activePatient = patients.find((p) => p.id === activePatientId);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (selectedPointId) {
      setPoints((prev) => ({
        ...prev,
        [selectedPointId]: { x, y },
      }));
      // Advance to next landmark point automatically
      const currIdx = LANDMARKS.findIndex((l) => l.id === selectedPointId);
      if (currIdx < LANDMARKS.length - 1) {
        setSelectedPointId(LANDMARKS[currIdx + 1].id);
      }
    }
  };

  const handleSave = () => {
    if (!activePatient) return;
    saveCephalometry({
      patientId: activePatient.id,
      patientName: activePatient.fullName,
      date: new Date().toISOString().split('T')[0],
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
      points,
      measurements: {
        sna,
        snb,
        anb,
        fma,
        wits: 0.5,
        classDiagnosis: skeletalClass,
      },
      notes,
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    alert('¡Trazado cefalométrico guardado exitosamente!');
  };

  return (
    <div id="cephalometry-view" className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
            <ScanLine className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-900">
              Cefalometría Digital y Análisis Steiner / Tweed
            </h1>
            <p className="text-xs text-slate-500">
              Trazado cefalométrico lateral de cráneo, cálculo de ángulos SNA, SNB, ANB y diagnóstico esquelético
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

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Trazado</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column Interactive Stage + Right Column Measurements & Diagnosis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Span 8): Interactive Radiograph Tracer */}
        <div className="lg:col-span-8 space-y-4">
          {/* Landmark selector pills */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Seleccione punto a ubicar (o haga clic sobre la radiografía):
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {LANDMARKS.map((lm) => {
                const isSelected = selectedPointId === lm.id;
                const hasPos = !!points[lm.id];
                return (
                  <button
                    key={lm.id}
                    onClick={() => setSelectedPointId(lm.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : hasPos
                        ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                        : 'bg-white text-slate-400 border-dashed border-slate-300'
                    }`}
                  >
                    <span>{lm.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tracer Canvas Stage */}
          <div
            onClick={handleCanvasClick}
            className="relative w-full h-[480px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-lg cursor-crosshair group select-none"
          >
            {/* Background Anatomical Radiograph Image Simulation */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-65 group-hover:opacity-75 transition-opacity"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80')`,
                filter: 'contrast(130%) grayscale(100%)',
              }}
            />

            {/* SVG Geometric Lines Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* S-N Line (Base de cráneo anterior) */}
              {points.S && points.N && (
                <line
                  x1={points.S.x}
                  y1={points.S.y}
                  x2={points.N.x}
                  y2={points.N.y}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              )}
              {/* N-A Line */}
              {points.N && points.A && (
                <line
                  x1={points.N.x}
                  y1={points.N.y}
                  x2={points.A.x}
                  y2={points.A.y}
                  stroke="#34d399"
                  strokeWidth="2"
                />
              )}
              {/* N-B Line */}
              {points.N && points.B && (
                <line
                  x1={points.N.x}
                  y1={points.N.y}
                  x2={points.B.x}
                  y2={points.B.y}
                  stroke="#f472b6"
                  strokeWidth="2"
                />
              )}
              {/* Plano Mandibular (Go-Me) */}
              {points.Go && points.Me && (
                <line
                  x1={points.Go.x}
                  y1={points.Go.y}
                  x2={points.Me.x}
                  y2={points.Me.y}
                  stroke="#fbbf24"
                  strokeWidth="2"
                />
              )}
            </svg>

            {/* Render Landmark Pins */}
            {Object.entries(points).map(([key, pt]: [string, any]) => {
              const isSelected = selectedPointId === key;
              return (
                <div
                  key={key}
                  style={{ left: `${pt.x}px`, top: `${pt.y}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 group/pin cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPointId(key);
                  }}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'bg-white border-indigo-400 ring-4 ring-indigo-500/50 scale-125'
                        : 'bg-teal-400 border-white shadow-xs'
                    }`}
                  />
                  <span className="text-[10px] font-bold font-mono text-white bg-slate-900/80 px-1 rounded backdrop-blur-xs">
                    {key}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (Span 4): Measurements & Analysis Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2">
              VALORES CEFALOMÉTRICOS CALCULADOS
            </h3>

            <div className="space-y-3 text-xs">
              {/* SNA */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">Ángulo SNA</p>
                  <p className="text-[10px] text-slate-400">Posición Maxilar (Norma: 82° ± 2°)</p>
                </div>
                <span className="text-sm font-black font-mono text-teal-700">{sna}°</span>
              </div>

              {/* SNB */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">Ángulo SNB</p>
                  <p className="text-[10px] text-slate-400">Posición Mandibular (Norma: 80° ± 2°)</p>
                </div>
                <span className="text-sm font-black font-mono text-sky-700">{snb}°</span>
              </div>

              {/* ANB */}
              <div className="flex items-center justify-between p-2.5 bg-indigo-50 rounded-xl border border-indigo-200">
                <div>
                  <p className="font-bold text-indigo-950">Ángulo ANB (SNA - SNB)</p>
                  <p className="text-[10px] text-indigo-700">Relación Sagital (Norma: 2° ± 2°)</p>
                </div>
                <span className="text-base font-black font-mono text-indigo-900">{anb}°</span>
              </div>

              {/* FMA */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">Plano Mandibular (FMA)</p>
                  <p className="text-[10px] text-slate-400">Dirección de Crecimiento (25°)</p>
                </div>
                <span className="text-sm font-black font-mono text-amber-700">{fma}°</span>
              </div>
            </div>

            {/* Skeletal Class Result Badge */}
            <div className="p-4 bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-xl text-center space-y-1">
              <span className="text-[10px] text-teal-300 font-bold uppercase tracking-wider">
                DIAGNÓSTICO ESQUELÉTICO
              </span>
              <p className="text-xl font-black">{skeletalClass}</p>
              <p className="text-[10px] text-slate-300">
                {skeletalClass === 'Clase I'
                  ? 'Relación maxilomandibular armónica'
                  : skeletalClass === 'Clase II'
                  ? 'Convexidad facial aumentada / Retrusión mandibular'
                  : 'Prognatismo mandibular / Concavidad facial'}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2 text-xs">
            <label className="font-bold text-slate-800">Conclusiones del Ortodoncista:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

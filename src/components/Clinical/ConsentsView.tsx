import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSignature,
  Plus,
  Search,
  CheckCircle2,
  Printer,
  PenTool,
  RotateCcw,
  ShieldCheck,
  Building,
  Award,
  Eye,
} from 'lucide-react';
import { ConsentForm } from '../../types';
import confetti from 'canvas-confetti';

export const ConsentsView: React.FC = () => {
  const {
    consents,
    patients,
    addConsent,
    currentUser,
    selectedPatientId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [viewingConsent, setViewingConsent] = useState<ConsentForm | null>(null);

  // Form states
  const [patientId, setPatientId] = useState(selectedPatientId || patients[0]?.id || '');
  const [consentType, setConsentType] = useState<ConsentForm['type']>('Cirugía Oral Menor');
  const [procedureName, setProcedureName] = useState('Exodoncia de tercer molar inferior retenido');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [city, setCity] = useState('Lima');
  const [isMinor, setIsMinor] = useState(false);
  const [repName, setRepName] = useState('');
  const [repDoc, setRepDoc] = useState('');

  // Signature canvas refs
  const patientCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const doctorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawingPatient, setIsDrawingPatient] = useState(false);
  const [isDrawingDoctor, setIsDrawingDoctor] = useState(false);
  const [hasPatientSignature, setHasPatientSignature] = useState(false);
  const [hasDoctorSignature, setHasDoctorSignature] = useState(false);

  const selectedPatient = patients.find((p) => p.id === patientId);

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, type: 'patient' | 'doctor') => {
    const canvas = type === 'patient' ? patientCanvasRef.current : doctorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = type === 'patient' ? '#0f172a' : '#0d9488';

    if (type === 'patient') setIsDrawingPatient(true);
    else setIsDrawingDoctor(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, type: 'patient' | 'doctor') => {
    const isDrawing = type === 'patient' ? isDrawingPatient : isDrawingDoctor;
    if (!isDrawing) return;

    const canvas = type === 'patient' ? patientCanvasRef.current : doctorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();

    if (type === 'patient') setHasPatientSignature(true);
    else setHasDoctorSignature(true);
  };

  const stopDrawing = (type: 'patient' | 'doctor') => {
    if (type === 'patient') setIsDrawingPatient(false);
    else setIsDrawingDoctor(false);
  };

  const clearCanvas = (type: 'patient' | 'doctor') => {
    const canvas = type === 'patient' ? patientCanvasRef.current : doctorCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (type === 'patient') setHasPatientSignature(false);
    else setHasDoctorSignature(false);
  };

  const handleSaveConsent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const patientSig = patientCanvasRef.current?.toDataURL() || '';
    const docSig = doctorCanvasRef.current?.toDataURL() || '';

    const newC = addConsent({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      docNumber: selectedPatient.docNumber,
      type: consentType,
      procedureName,
      risksList: [
        'Hemorragia, hematoma o dolor posoperatorio controlado con fármacos',
        'Infección bacteriana secundaria o inflamación de tejidos',
        'Hipoestesia o parestesia temporal en zona mandibular',
        'Reacciones adversas a anestésicos locales o medicamentos recetados',
      ],
      dentistName: currentUser.name,
      copNumber: currentUser.copNumber || '42789312',
      date,
      city,
      status: 'firmado',
      isMinor,
      representativeName: isMinor ? repName : undefined,
      representativeDoc: isMinor ? repDoc : undefined,
      patientSignature: patientSig,
      dentistSignature: docSig,
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setIsCreating(false);
    setViewingConsent(newC);
  };

  const safeConsents = consents || [];
  const filteredConsents = safeConsents.filter((c) => {
    if (!c) return false;
    return (
      (c.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.docNumber || '').includes(searchQuery) ||
      (c.type || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div id="consents-view" className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
            <FileSignature className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-900">
              Consentimientos Informados Digitales
            </h1>
            <p className="text-xs text-slate-500">
              Documentos médicos con firma biométrica digital conforme a la normativa del Colegio Odontológico del Perú
            </p>
          </div>
        </div>

        {!isCreating && (
          <button
            id="btn-nuevo-consentimiento"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Consentimiento</span>
          </button>
        )}
      </div>

      {/* Mode 1: Create New Consent with Digital Signature Pads */}
      {isCreating ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-4 md:p-6 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              NUEVO CONSENTIMIENTO INFORMADO
            </h2>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              ← Volver
            </button>
          </div>

          <form onSubmit={handleSaveConsent} className="space-y-6 text-xs">
            {/* Document Information */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tipo de Consentimiento *</label>
                <select
                  value={consentType}
                  onChange={(e) => setConsentType(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
                >
                  <option value="Cirugía Oral Menor">Cirugía Oral Menor</option>
                  <option value="Endodoncia">Endodoncia / Tratamiento de Conductos</option>
                  <option value="Obturaciones">Obturaciones y Curaciones Dentales</option>
                  <option value="Exodoncia de Tercer Molar">Exodoncia de Tercer Molar</option>
                  <option value="Implantes">Implantes Dentales Osteointegrados</option>
                  <option value="Periodoncia">Tratamiento Periodontal y Raspado</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fecha</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ciudad</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Patient & Procedure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Buscar Paciente *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold"
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} (DNI: {p.docNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Procedimiento a Realizar *</label>
                <input
                  type="text"
                  value={procedureName}
                  onChange={(e) => setProcedureName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
                  required
                />
              </div>
            </div>

            {/* Representation */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={isMinor}
                  onChange={(e) => setIsMinor(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span>Firma en representación legal (Menor de edad o incapacidad)</span>
              </label>

              {isMinor && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <input
                    type="text"
                    placeholder="Nombre completo del Representante / Apoderado"
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                    className="p-2 bg-white border border-slate-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="DNI / Documento del Representante"
                    value={repDoc}
                    onChange={(e) => setRepDoc(e.target.value)}
                    className="p-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Signature Pads (Patient & Doctor) matching video demo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Patient Signature Pad */}
              <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-slate-600" />
                    FIRMA DEL PACIENTE / REPRESENTANTE
                  </span>
                  <button
                    type="button"
                    onClick={() => clearCanvas('patient')}
                    className="text-[11px] text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Limpiar
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">Firme aquí con el dedo o mouse</p>
                <div className="border-2 border-dashed border-slate-300 bg-white rounded-lg overflow-hidden h-36 relative">
                  <canvas
                    ref={patientCanvasRef}
                    width={400}
                    height={144}
                    onMouseDown={(e) => startDrawing(e, 'patient')}
                    onMouseMove={(e) => draw(e, 'patient')}
                    onMouseUp={() => stopDrawing('patient')}
                    onMouseLeave={() => stopDrawing('patient')}
                    onTouchStart={(e) => startDrawing(e, 'patient')}
                    onTouchMove={(e) => draw(e, 'patient')}
                    onTouchEnd={() => stopDrawing('patient')}
                    className="w-full h-full cursor-crosshair touch-none"
                  />
                </div>
              </div>

              {/* Doctor Signature Pad */}
              <div className="border border-teal-200 rounded-xl p-4 bg-teal-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-900 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-teal-700" />
                    FIRMA DEL CIRUJANO DENTISTA
                  </span>
                  <button
                    type="button"
                    onClick={() => clearCanvas('doctor')}
                    className="text-[11px] text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Limpiar
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  {currentUser.name} (COP: {currentUser.copNumber || '42789312'})
                </p>
                <div className="border-2 border-dashed border-teal-300 bg-white rounded-lg overflow-hidden h-36 relative">
                  <canvas
                    ref={doctorCanvasRef}
                    width={400}
                    height={144}
                    onMouseDown={(e) => startDrawing(e, 'doctor')}
                    onMouseMove={(e) => draw(e, 'doctor')}
                    onMouseUp={() => stopDrawing('doctor')}
                    onMouseLeave={() => stopDrawing('doctor')}
                    onTouchStart={(e) => startDrawing(e, 'doctor')}
                    onTouchMove={(e) => draw(e, 'doctor')}
                    onTouchEnd={() => stopDrawing('doctor')}
                    className="w-full h-full cursor-crosshair touch-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                id="btn-guardar-consentimiento"
                type="submit"
                className="px-5 py-2.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                Guardar Consentimiento
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Mode 2: Table of Consents */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por paciente, documento o tipo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total: <strong>{filteredConsents.length} documentos firmados</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">FECHA</th>
                  <th className="py-3 px-4">PACIENTE</th>
                  <th className="py-3 px-4">DOCUMENTO</th>
                  <th className="py-3 px-4">TIPO</th>
                  <th className="py-3 px-4">PROFESIONAL</th>
                  <th className="py-3 px-4">ESTADO</th>
                  <th className="py-3 px-4 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredConsents.map((cons) => (
                  <tr key={cons.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{cons.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{cons.patientName}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{cons.docNumber}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {cons.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{cons.dentistName}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        Firmado
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setViewingConsent(cons)}
                        className="px-3 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-bold border border-purple-200 transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official COP PDF Document Viewer Modal (Matches video timestamp 02:40 - 02:50) */}
      {viewingConsent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-6">
            {/* Top Toolbar */}
            <div className="p-3 bg-slate-800 text-white flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5">
                <FileSignature className="w-4 h-4 text-purple-400" />
                Documento Oficial de Consentimiento Informado
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
                </button>
                <button
                  onClick={() => setViewingConsent(null)}
                  className="p-1 hover:bg-white/10 rounded-lg font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Printable Sheet (Colegio Odontológico del Perú template) */}
            <div className="p-8 md:p-12 space-y-6 max-h-[80vh] overflow-y-auto text-slate-800 bg-white font-serif">
              {/* Header Logo */}
              <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 text-white font-bold mb-1">
                  COP
                </div>
                <h2 className="text-lg font-black tracking-wide text-slate-900 uppercase">
                  Colegio Odontológico del Perú
                </h2>
                <p className="text-xs text-slate-600 font-sans uppercase font-bold tracking-wider">
                  Consejo Administrativo Nacional • Comisión de Ética y Deontología
                </p>
              </div>

              <div className="text-center py-2">
                <h3 className="text-base font-black uppercase underline decoration-2 underline-offset-4">
                  CONSENTIMIENTO INFORMADO PARA: {(viewingConsent.type || '').toUpperCase()}
                </h3>
              </div>

              {/* Declarations */}
              <div className="text-xs space-y-3 leading-relaxed font-sans text-justify">
                <p>
                  Yo, <strong>{viewingConsent.patientName}</strong>, identificado con Documento de Identidad N°{' '}
                  <strong>{viewingConsent.docNumber}</strong>, en pleno uso de mis facultades mentales y en calidad de paciente (o representante legal),
                  <strong> DECLARO:</strong>
                </p>

                <p>
                  Que el Cirujano Dentista <strong>{viewingConsent.dentistName}</strong> (COP N°{' '}
                  <strong>{viewingConsent.copNumber}</strong>) me ha explicado detalladamente la naturaleza y propósito del procedimiento odontológico:{' '}
                  <strong>{viewingConsent.procedureName}</strong>, así como los beneficios esperados y las alternativas de tratamiento disponibles.
                </p>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 font-sans text-[11px]">
                  <p className="font-bold text-slate-900">
                    Riesgos y Posibles Complicaciones Explicadas y Aceptadas:
                  </p>
                  <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                    <li>Hemorragia, hematoma e inflamación (edema) en la zona intervenida.</li>
                    <li>Dolor y molestia posquirúrgica controlable con analgésicos recetados.</li>
                    <li>Riesgo de infección secundaria en caso de no seguir las pautas de higiene y cuidados.</li>
                    <li>Parestesia temporal o hipoestesia de ramas nerviosas dentarias según la complejidad anatómica.</li>
                  </ul>
                </div>

                <p>
                  He tenido la oportunidad de hacer todas las preguntas necesarias, las cuales han sido respondidas a mi entera satisfacción. Por tanto, libre y voluntariamente otorgo mi
                  <strong> CONSENTIMIENTO INFORMADO</strong> para la ejecución del procedimiento.
                </p>
              </div>

              {/* Dual Digital Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-300 font-sans text-center text-xs">
                {/* Patient */}
                <div className="flex flex-col items-center">
                  <div className="w-48 h-20 border-b border-slate-900 flex items-center justify-center mb-1">
                    {viewingConsent.patientSignature ? (
                      <img
                        src={viewingConsent.patientSignature}
                        alt="Firma Paciente"
                        className="max-h-16 object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Firma Registrada</span>
                    )}
                  </div>
                  <p className="font-bold text-slate-900">{viewingConsent.patientName}</p>
                  <p className="text-[10px] text-slate-500">DNI: {viewingConsent.docNumber}</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                    El Paciente / Representante
                  </span>
                </div>

                {/* Doctor */}
                <div className="flex flex-col items-center">
                  <div className="w-48 h-20 border-b border-slate-900 flex items-center justify-center mb-1">
                    {viewingConsent.dentistSignature ? (
                      <img
                        src={viewingConsent.dentistSignature}
                        alt="Firma Cirujano"
                        className="max-h-16 object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-teal-600 font-bold">Firma Digital Verificada</span>
                    )}
                  </div>
                  <p className="font-bold text-slate-900">{viewingConsent.dentistName}</p>
                  <p className="text-[10px] text-teal-700 font-bold">COP N° {viewingConsent.copNumber}</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                    El Cirujano Dentista
                  </span>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-400 font-sans pt-4 border-t border-slate-200">
                Emitido en la ciudad de {viewingConsent.city}, a los {viewingConsent.date}. Registro Nacional de Historias Clínicas Electrónicas.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

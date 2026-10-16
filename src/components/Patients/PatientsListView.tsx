import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  UserPlus,
  Phone,
  FileText,
  Grid3X3,
  Calendar,
  DollarSign,
  Activity,
  FileSignature,
  Scissors,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,
  Trash2,
  Edit,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { Patient } from '../../types';

interface PatientsListViewProps {
  onOpenNewPatient: () => void;
  onOpenNewAppointmentForPatient?: (patient: Patient) => void;
}

export const PatientsListView: React.FC<PatientsListViewProps> = ({
  onOpenNewPatient,
  onOpenNewAppointmentForPatient,
}) => {
  const {
    patients,
    selectedSede,
    setCurrentView,
    setSelectedPatientId,
    deletePatient,
    setPortalPatientId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  const safePatients = patients || [];
  const filteredPatients = safePatients.filter((p) => {
    if (!p) return false;
    const matchSede = selectedSede === 'todas' || p.sedeId === selectedSede;
    const matchSearch =
      (p.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.docNumber || '').includes(searchQuery) ||
      (p.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.phone || '').includes(searchQuery);
    return matchSede && matchSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedPatientId((prev) => (prev === id ? null : id));
  };

  const handleOpenFicha = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Hola ${name || 'Estimado(a)'}, le saludamos de la clínica dental DENTS DS.`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div id="patients-list-view" className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top action bar matching demo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="patients-search-input"
            type="text"
            placeholder="Nombre, DNI, código, teléfono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 px-3 py-1.5 bg-slate-100 rounded-lg">
            Código: 1 - último • <strong>{filteredPatients.length} pacientes</strong>
          </span>
          <button
            id="btn-list-nuevo-paciente"
            onClick={onOpenNewPatient}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Nuevo paciente</span>
          </button>
        </div>
      </div>

      {/* Patient Cards List */}
      <div className="space-y-3">
        {filteredPatients.map((patient) => {
          const isExpanded = expandedPatientId === patient.id;
          const hasAllergies = patient.allergies && patient.allergies.length > 0;

          return (
            <div
              key={patient.id}
              id={`patient-card-${patient.id}`}
              className={`bg-white border rounded-2xl transition-all shadow-xs overflow-hidden ${
                isExpanded ? 'border-teal-500 ring-2 ring-teal-500/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Main Card Header Row */}
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => handleOpenFicha(patient.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 font-black flex items-center justify-center text-sm shrink-0 border border-teal-200">
                    {patient.firstName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 hover:text-teal-700 transition-colors">
                        {patient.fullName}
                      </h3>
                      {hasAllergies && (
                        <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-rose-500" />
                          Alérgico ({patient.allergies.join(', ')})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      <strong className="text-teal-700 font-mono">{patient.code}</strong> •{' '}
                      {patient.docType}: {patient.docNumber} • {patient.baseConditions.join(', ') || 'NINGUNO'} •{' '}
                      {patient.age} años • {patient.gender === 'M' ? 'M' : 'F'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                  <span className="text-xs text-slate-400 font-medium">
                    {patient.lastVisit ? `Última: ${patient.lastVisit}` : 'Sin atenciones'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenFicha(patient.id)}
                      className="px-3 py-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors"
                    >
                      Ficha Completa
                    </button>
                    <button
                      onClick={() => toggleExpand(patient.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Ver accesos rápidos"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Collapsible Quick Actions Menu (Exact replication of video demo) */}
              {isExpanded && (
                <div className="bg-slate-50/80 border-t border-slate-100 p-4 space-y-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Accesos Directos del Paciente
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2 text-center text-xs">
                    <button
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setCurrentView('historia-clinica');
                      }}
                      className="p-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl flex flex-col items-center gap-1.5 transition-colors group"
                    >
                      <FileText className="w-4 h-4 text-teal-600 group-hover:scale-110" />
                      <span className="text-[11px] font-semibold text-slate-700">Historia Clínica</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setCurrentView('odontograma');
                      }}
                      className="p-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl flex flex-col items-center gap-1.5 transition-colors group"
                    >
                      <Grid3X3 className="w-4 h-4 text-teal-600 group-hover:scale-110" />
                      <span className="text-[11px] font-semibold text-slate-700">Odontograma</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setCurrentView('agenda');
                      }}
                      className="p-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl flex flex-col items-center gap-1.5 transition-colors group"
                    >
                      <Calendar className="w-4 h-4 text-sky-600 group-hover:scale-110" />
                      <span className="text-[11px] font-semibold text-slate-700">Agendar Cita</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setCurrentView('tratamientos');
                      }}
                      className="p-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl flex flex-col items-center gap-1.5 transition-colors group"
                    >
                      <DollarSign className="w-4 h-4 text-emerald-600 group-hover:scale-110" />
                      <span className="text-[11px] font-semibold text-slate-700">Planes / Presup.</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setCurrentView('cefalometria');
                      }}
                      className="p-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl flex flex-col items-center gap-1.5 transition-colors group"
                    >
                      <Scissors className="w-4 h-4 text-indigo-600 group-hover:scale-110" />
                      <span className="text-[11px] font-semibold text-slate-700">Ortodoncia</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setCurrentView('endodoncia');
                      }}
                      className="p-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl flex flex-col items-center gap-1.5 transition-colors group"
                    >
                      <Activity className="w-4 h-4 text-rose-600 group-hover:scale-110" />
                      <span className="text-[11px] font-semibold text-slate-700">Endodoncia</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setCurrentView('tratamientos');
                      }}
                      className="p-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl flex flex-col items-center gap-1.5 transition-colors group"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600 group-hover:scale-110" />
                      <span className="text-[11px] font-semibold text-slate-700">Destartraje</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setCurrentView('tratamientos');
                      }}
                      className="p-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl flex flex-col items-center gap-1.5 transition-colors group"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 group-hover:scale-110" />
                      <span className="text-[11px] font-semibold text-slate-700">Curaciones</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setCurrentView('tratamientos');
                      }}
                      className="p-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl flex flex-col items-center gap-1.5 transition-colors group"
                    >
                      <FileSignature className="w-4 h-4 text-purple-600 group-hover:scale-110" />
                      <span className="text-[11px] font-semibold text-slate-700">Prótesis Fija</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setCurrentView('facturacion');
                      }}
                      className="p-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl flex flex-col items-center gap-1.5 transition-colors group"
                    >
                      <DollarSign className="w-4 h-4 text-emerald-600 group-hover:scale-110" />
                      <span className="text-[11px] font-semibold text-slate-700">Facturación</span>
                    </button>

                    <button
                      onClick={() => handleOpenFicha(patient.id)}
                      className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex flex-col items-center gap-1.5 transition-colors group shadow-xs"
                    >
                      <ExternalLink className="w-4 h-4 group-hover:scale-110" />
                      <span className="text-[11px] font-bold">Ficha 360°</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleWhatsApp(patient.phone, patient.fullName)}
                        className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                      >
                        <MessageCircle className="w-4 h-4" /> Enviar WhatsApp
                      </button>
                      <button
                        onClick={() => setPortalPatientId(patient.id)}
                        className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" /> Ver Portal del Paciente
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`¿Está seguro de desactivar al paciente ${patient.fullName}?`)) {
                          deletePatient(patient.id);
                        }
                      }}
                      className="text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Desactivar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

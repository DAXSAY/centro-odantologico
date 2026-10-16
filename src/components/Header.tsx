import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarPlus,
  UserPlus,
  Building,
  Tv,
  MessageSquare,
  Search,
  Bell,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { SedeId } from '../types';

interface HeaderProps {
  onOpenNewAppointment: () => void;
  onOpenNewPatient: () => void;
  onOpenTVMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewAppointment,
  onOpenNewPatient,
  onOpenTVMode,
}) => {
  const {
    selectedSede,
    setSelectedSede,
    clinicConfig,
    currentUser,
    turns,
    isWhatsAppConnected,
    setCurrentView,
    setSelectedPatientId,
    patients,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showSedeMenu, setShowSedeMenu] = useState(false);

  const safePatients = patients || [];
  const filteredPatients = searchQuery.trim()
    ? safePatients.filter(
        (p) =>
          p &&
          ((p.fullName && p.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.docNumber && p.docNumber.includes(searchQuery)) ||
            (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : [];

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentView('pacientes');
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const callingTurn = (turns || []).find((t) => t && t.status === 'llamando');

  return (
    <header
      id="main-app-header"
      className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs"
    >
      {/* Sede selector pills (matching demo) */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200">
          <button
            id="sede-pill-todas"
            onClick={() => setSelectedSede('todas')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              selectedSede === 'todas'
                ? 'bg-white text-teal-700 font-bold shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900'
            }`}
          >
            Todas
          </button>
          <button
            id="sede-pill-principal"
            onClick={() => setSelectedSede('sede-principal')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              selectedSede === 'sede-principal'
                ? 'bg-white text-teal-700 font-bold shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900'
            }`}
          >
            Sede Principal
          </button>
          <button
            id="sede-pill-surco"
            onClick={() => setSelectedSede('clinica-surco')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              selectedSede === 'clinica-surco'
                ? 'bg-white text-teal-700 font-bold shadow-xs border border-slate-200/80'
                : 'hover:text-slate-900'
            }`}
          >
            CLINICA SURCO
          </button>
        </div>

        {/* Mobile Sede dropdown */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setShowSedeMenu(!showSedeMenu)}
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-teal-800 px-3 py-1.5 rounded-lg border border-slate-200"
          >
            <Building className="w-3.5 h-3.5" />
            <span className="capitalize">{(selectedSede || '').replace('-', ' ')}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showSedeMenu && (
            <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  setSelectedSede('todas');
                  setShowSedeMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 font-medium"
              >
                Todas las sedes
              </button>
              <button
                onClick={() => {
                  setSelectedSede('sede-principal');
                  setShowSedeMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 font-medium"
              >
                Sede Principal
              </button>
              <button
                onClick={() => {
                  setSelectedSede('clinica-surco');
                  setShowSedeMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 font-medium"
              >
                CLINICA SURCO
              </button>
            </div>
          )}
        </div>

        {callingTurn && (
          <div className="hidden lg:flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1 rounded-full text-xs animate-pulse">
            <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span>
              Llamando a: <strong>{callingTurn.patientName}</strong> ({callingTurn.chair})
            </span>
          </div>
        )}
      </div>

      {/* Center Search bar */}
      <div className="relative flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Buscar paciente por nombre, DNI o HCL..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
          />
        </div>

        {/* Live Search Dropdown */}
        {showSearchResults && searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl py-2 max-h-72 overflow-y-auto z-50">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPatient(p.id)}
                  className="w-full px-3 py-2 text-left hover:bg-teal-50 flex items-center justify-between border-b border-slate-100 last:border-0"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">{p.fullName}</p>
                    <p className="text-[11px] text-slate-500">
                      {p.code} • DNI: {p.docNumber} • Tel: {p.phone}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                    Ver Ficha
                  </span>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-xs text-slate-400">
                No se encontraron pacientes para "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick action: TV Turnos */}
        <button
          id="btn-tv-mode-header"
          onClick={onOpenTVMode}
          className="p-2 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Pantalla Completa TV (Sala de Espera)"
        >
          <Tv className="w-4 h-4" />
        </button>

        {/* Quick action: WhatsApp Status */}
        <button
          id="btn-whatsapp-header"
          onClick={() => setCurrentView('whatsapp')}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          title="Conexión de WhatsApp"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">WhatsApp</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5" />
        </button>

        {/* Button: + Nueva Cita */}
        <button
          id="btn-header-nueva-cita"
          onClick={onOpenNewAppointment}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs shadow-teal-600/30 transition-all hover:scale-[1.02]"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          <span>+ Cita</span>
        </button>

        {/* Button: + Nuevo Paciente */}
        <button
          id="btn-header-nuevo-paciente"
          onClick={onOpenNewPatient}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs shadow-sky-600/30 transition-all hover:scale-[1.02]"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ Paciente</span>
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {(currentUser?.name || 'Dr. Usuario').replace('Dr. ', '')}
            </p>
            <p className="text-[10px] text-teal-600 font-semibold uppercase">
              {currentUser.role} {currentUser.copNumber ? `• COP ${currentUser.copNumber}` : ''}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

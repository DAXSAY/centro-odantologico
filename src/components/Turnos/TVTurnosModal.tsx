import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Tv,
  X,
  Volume2,
  Bell,
  Clock,
  User,
  Sparkles,
  Maximize,
  Minimize,
  VolumeX,
} from 'lucide-react';

interface TVTurnosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TVTurnosModal: React.FC<TVTurnosModalProps> = ({ isOpen, onClose }) => {
  const { turns, updateTurnStatus, clinicConfig } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const callingTurn = (turns || []).find((t) => t.status === 'llamando');
  const inAttentionTurns = (turns || []).filter((t) => t.status === 'en_atencion');
  const waitingTurns = (turns || []).filter((t) => t.status === 'esperando');

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden select-none">
      {/* Top TV Bar */}
      <div className="h-20 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{clinicConfig?.name || 'DENTS DS'}</span>
              <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                PANTALLA DE LLAMADO DE PACIENTES
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Por favor espere a ser llamado en pantalla y acuda al consultorio indicado.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-black tracking-widest text-teal-400 font-mono">
              {currentTime.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-xs text-slate-400 capitalize">
              {currentTime.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2.5 rounded-xl border ${
                audioEnabled
                  ? 'bg-teal-950 text-teal-300 border-teal-700'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title={audioEnabled ? 'Sonido activado' : 'Silenciado'}
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="Pantalla completa"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800"
              title="Cerrar pantalla TV"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Screen Body */}
      <div className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* Left Col: Main Active Call Big Display (7 cols) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          {callingTurn ? (
            <div className="flex-1 bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 border-2 border-teal-400 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden animate-pulse">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-400 text-slate-950 font-black text-sm tracking-wider uppercase">
                  <Bell className="w-4 h-4 animate-bounce" />
                  <span>LLAMANDO AHORA</span>
                </div>
                <span className="text-3xl font-black text-teal-300 font-mono tracking-wider">
                  TURNO {callingTurn.turnNumber}
                </span>
              </div>

              <div className="my-auto text-center space-y-4">
                <p className="text-xs uppercase tracking-widest text-teal-300 font-bold">
                  PACIENTE
                </p>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  {callingTurn.patientName}
                </h2>
                <div className="inline-block mt-4 px-8 py-4 rounded-2xl bg-teal-500/20 border-2 border-teal-400 text-teal-200">
                  <p className="text-xs uppercase tracking-widest text-teal-300 font-bold mb-1">
                    PASAR A
                  </p>
                  <p className="text-3xl md:text-4xl font-extrabold text-white">
                    {callingTurn.chair}
                  </p>
                </div>
              </div>

              <div className="border-t border-teal-500/30 pt-4 flex items-center justify-between text-teal-200 text-sm">
                <span>Atiende: <strong>{callingTurn.doctorName}</strong></span>
                <span>Hora: <strong>{callingTurn.time}</strong></span>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
                <Tv className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-300">Sala de Espera Activa</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-md">
                No hay ningún paciente en llamado simultáneo. Cuando el doctor active el llamado desde su sillón, aparecerá aquí con aviso sonoro.
              </p>
            </div>
          )}

          {/* Banner bottom: Atendiendo actualmente */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>En Atención Clínica Actualmente</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inAttentionTurns.length > 0 ? (
                inAttentionTurns.map((turn) => (
                  <div
                    key={turn.id}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{turn.patientName}</div>
                      <div className="text-xs text-slate-400">{turn.doctorName}</div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-bold font-mono">
                      {turn.chair}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 col-span-2 py-2">
                  No hay pacientes en sillón en este momento.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Próximos Turnos en Espera (5 cols) */}
        <div className="col-span-12 lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-400" />
              <h2 className="text-base font-bold text-white">Próximos Turnos</h2>
            </div>
            <span className="px-3 py-1 bg-teal-950 text-teal-300 rounded-full text-xs font-bold border border-teal-800">
              {waitingTurns.length} en espera
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {waitingTurns.length > 0 ? (
              waitingTurns.map((turn, index) => (
                <div
                  key={turn.id}
                  className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-teal-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-teal-400 font-mono font-black text-sm">
                      {turn.turnNumber}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{turn.patientName}</p>
                      <p className="text-xs text-slate-400">{turn.doctorName}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-300 block">{turn.time}</span>
                    <span className="text-[10px] text-slate-500">{turn.chair}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p className="text-sm">No hay más pacientes en cola de espera para hoy.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              DENTS DS Cloud • Conexión con Pantalla en Vivo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building,
  Users,
  ShieldCheck,
  BookOpen,
  MessageSquare,
  Plus,
  Save,
  CheckCircle2,
  Lock,
  Globe,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SettingsView: React.FC = () => {
  const { sedes, addSede, users, cie10Catalog } = useApp();

  const [activeTab, setActiveTab] = useState<'sedes' | 'usuarios' | 'cie10' | 'whatsapp'>('sedes');

  // New Sede form
  const [newSedeName, setNewSedeName] = useState('');
  const [newSedeAddress, setNewSedeAddress] = useState('');
  const [newSedePhone, setNewSedePhone] = useState('');

  // WhatsApp templates
  const [waConfirmation, setWaConfirmation] = useState(
    '¡Hola {paciente}! Le recordamos su cita en DENTS DS el día {fecha} a las {hora} con el Dr.(a) {doctor} para {tratamiento}.'
  );
  const [waReminder24h, setWaReminder24h] = useState(
    'Estimado(a) {paciente}, mañana tiene programada su atención dental a las {hora}. Por favor confirme su asistencia respondiendo SI.'
  );

  const handleAddSedeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSedeName) return;

    addSede({
      name: newSedeName,
      address: newSedeAddress,
      phone: newSedePhone,
      city: 'Lima',
    });

    setNewSedeName('');
    setNewSedeAddress('');
    setNewSedePhone('');
    confetti({ particleCount: 40, spread: 50 });
  };

  return (
    <div id="settings-view" className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-900">
              Configuración del Sistema DENTS DS
            </h1>
            <p className="text-xs text-slate-500">
              Gestión de sedes múltiples, usuarios y roles, catálogo CIE-10 y plantillas de comunicación WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('sedes')}
          className={`px-4 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'sedes'
              ? 'border-teal-600 text-teal-800 bg-teal-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Sedes Clínicas ({sedes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('usuarios')}
          className={`px-4 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'usuarios'
              ? 'border-teal-600 text-teal-800 bg-teal-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Usuarios y Roles ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cie10')}
          className={`px-4 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'cie10'
              ? 'border-teal-600 text-teal-800 bg-teal-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Catálogo Odontológico CIE-10</span>
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`px-4 py-2 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'whatsapp'
              ? 'border-teal-600 text-teal-800 bg-teal-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Plantillas WhatsApp</span>
        </button>
      </div>

      {/* Tab 1: Sedes */}
      {activeTab === 'sedes' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Sedes Activas
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {sedes.map((s) => (
                <div
                  key={s.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                      <p className="text-xs text-slate-500">{s.address} • {s.city}</p>
                      <p className="text-[11px] text-teal-700 font-mono font-bold mt-0.5">{s.phone}</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Activa
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-teal-600" />
              Registrar Nueva Sede
            </h3>
            <form onSubmit={handleAddSedeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre de la Sede *</label>
                <input
                  type="text"
                  value={newSedeName}
                  onChange={(e) => setNewSedeName(e.target.value)}
                  placeholder="Ej: DENTS DS - La Molina"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Dirección</label>
                <input
                  type="text"
                  value={newSedeAddress}
                  onChange={(e) => setNewSedeAddress(e.target.value)}
                  placeholder="Av. Javier Prado Este 5600"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Teléfono de Contacto</label>
                <input
                  type="text"
                  value={newSedePhone}
                  onChange={(e) => setNewSedePhone(e.target.value)}
                  placeholder="+51 1 437 8899"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                + Crear Sede
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Users & Roles */}
      {activeTab === 'usuarios' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Personal Médico y Administrativo
            </h3>
            <span className="text-xs text-slate-500 font-semibold">{users.length} usuarios activos</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">USUARIO / DOCTOR</th>
                  <th className="p-3.5">CORREO DE ACCESO</th>
                  <th className="p-3.5">ROL DEL SISTEMA</th>
                  <th className="p-3.5">COP / COLEGIATURA</th>
                  <th className="p-3.5">ESPECIALIDAD</th>
                  <th className="p-3.5">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3.5 font-mono text-slate-600">{u.email}</td>
                    <td className="p-3.5">
                      <span className="bg-slate-900 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-teal-800">{u.copNumber || 'N/A'}</td>
                    <td className="p-3.5 text-slate-700">{u.specialty || 'Administración'}</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                        Activo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: CIE-10 */}
      {activeTab === 'cie10' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Catálogo Oficial de Diagnósticos Odontológicos CIE-10 (MINSA)
            </h3>
            <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              {cie10Catalog.length} códigos cargados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cie10Catalog.map((item) => (
              <div
                key={item.code}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 hover:border-teal-400 transition-colors text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded">
                    {item.code}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{item.category}</span>
                </div>
                <p className="text-slate-800 font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: WhatsApp automation */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase">
              Configuración de Notificaciones Automáticas por WhatsApp
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold text-slate-800 block">
                Plantilla 1: Confirmación Inmediata de Reserva de Cita
              </label>
              <textarea
                rows={4}
                value={waConfirmation}
                onChange={(e) => setWaConfirmation(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-sans"
              />
              <span className="text-[11px] text-slate-400 block">
                Variables: {'{paciente}'}, {'{fecha}'}, {'{hora}'}, {'{doctor}'}, {'{tratamiento}'}
              </span>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-800 block">
                Plantilla 2: Recordatorio Automático 24 horas antes
              </label>
              <textarea
                rows={4}
                value={waReminder24h}
                onChange={(e) => setWaReminder24h(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-sans"
              />
              <span className="text-[11px] text-slate-400 block">
                Variables: {'{paciente}'}, {'{hora}'}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                confetti({ particleCount: 30, spread: 50 });
                alert('¡Plantillas guardadas con éxito!');
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              Guardar Plantillas
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

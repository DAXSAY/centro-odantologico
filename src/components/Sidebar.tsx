import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  FileSignature,
  Grid3X3,
  ScanLine,
  Activity,
  CalendarClock,
  BriefcaseMedical,
  Receipt,
  Package,
  MessageSquareShare,
  Tv,
  BarChart3,
  Building2,
  Globe,
  ShieldCheck,
  BookOpen,
  SmilePlus,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{ collapsed: boolean; setCollapsed: (c: boolean) => void }> = ({
  collapsed,
  setCollapsed,
}) => {
  const { currentView, setCurrentView, turns, inventory, setPortalPatientId } = useApp();

  const lowStockCount = (inventory || []).filter((i) => (i.stock ?? i.currentStock ?? 0) <= i.minStock).length;
  const waitingTurns = (turns || []).filter((t) => t.status === 'esperando' || t.status === 'llamando').length;

  const sections: NavSection[] = [
    {
      title: 'PRINCIPAL',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'pacientes', label: 'Pacientes', icon: Users },
        { id: 'agenda', label: 'Agenda / Citas', icon: Calendar },
      ],
    },
    {
      title: 'CLÍNICA',
      items: [
        { id: 'historia-clinica', label: 'Historia Clínica', icon: FileText },
        { id: 'consentimientos', label: 'Consentimientos', icon: FileSignature },
        { id: 'odontograma', label: 'Odontograma', icon: Grid3X3 },
        { id: 'cefalometria', label: 'Cefalometría', icon: ScanLine },
        { id: 'endodoncia', label: 'Endodoncia', icon: Activity },
      ],
    },
    {
      title: 'ATENCIÓN & FINANZAS',
      items: [
        { id: 'google-calendar', label: 'Google Calendar', icon: CalendarClock },
        { id: 'tratamientos', label: 'Tratamientos / Presup.', icon: BriefcaseMedical },
        { id: 'facturacion', label: 'Facturación', icon: Receipt },
        {
          id: 'inventario',
          label: 'Inventario',
          icon: Package,
          badge: lowStockCount > 0 ? lowStockCount : undefined,
          badgeColor: 'bg-rose-500',
        },
        { id: 'whatsapp', label: 'WhatsApp / Notif.', icon: MessageSquareShare },
        {
          id: 'pantalla-turnos',
          label: 'Pantalla Turnos',
          icon: Tv,
          badge: waitingTurns > 0 ? waitingTurns : undefined,
          badgeColor: 'bg-teal-500',
        },
      ],
    },
    {
      title: 'REPORTES',
      items: [
        { id: 'reportes', label: 'Reportes & Analítica', icon: BarChart3 },
      ],
    },
    {
      title: 'EMPRESA & CONFIG.',
      items: [
        { id: 'empresa', label: 'Empresa & Sedes', icon: Building2 },
        { id: 'reservas-online', label: 'Reservas Online', icon: Globe },
        { id: 'catalogo-cie10', label: 'Catálogo CIE-10', icon: BookOpen },
        { id: 'usuarios-roles', label: 'Usuarios / Roles', icon: ShieldCheck },
        { id: 'satisfaccion', label: 'Satisfacción', icon: SmilePlus },
      ],
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 z-30 shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/60">
        <div
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
          onClick={() => setCurrentView('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-base">
                <span>DENTS</span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  DS
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Gestión Odontológica</span>
            </div>
          )}
        </div>

        <button
          id="toggle-sidebar-btn"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-200 ${
              collapsed ? '' : 'rotate-180'
            }`}
          />
        </button>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        {sections.map((sec) => (
          <div key={sec.title} className="space-y-1">
            {!collapsed && (
              <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {sec.title}
              </p>
            )}
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setCurrentView(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                    isActive
                      ? 'bg-teal-600/90 text-white shadow-md shadow-teal-900/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'
                    }`}
                  />
                  {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                  {!collapsed && item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full shrink-0 ${
                        item.badgeColor || 'bg-teal-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge !== undefined && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Patient Portal Shortcut */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <button
          id="open-patient-portal-btn"
          onClick={() => setPortalPatientId('p-1')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-teal-300 bg-teal-950/50 hover:bg-teal-900/60 border border-teal-800/40 transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Ver Portal del Paciente (Demostración Cliente)"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-teal-400" />
          {!collapsed && <span>Portal del Paciente</span>}
        </button>
      </div>
    </aside>
  );
};

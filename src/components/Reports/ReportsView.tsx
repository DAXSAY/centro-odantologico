import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  PieChart as PieIcon,
  Download,
  Filter,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { invoices, appointments, patients, treatments, selectedSede } = useApp();
  const [period, setPeriod] = useState<'mes' | 'anio'>('mes');

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalAppointments = appointments.length;
  const attendedAppointments = appointments.filter((a) => a.status === 'atendida').length;
  const attendanceRate = totalAppointments > 0 ? Math.round((attendedAppointments / totalAppointments) * 100) : 100;

  // Monthly revenue breakdown
  const monthlyData = [
    { month: 'Ene', revenue: 14200, appointments: 85 },
    { month: 'Feb', revenue: 16800, appointments: 94 },
    { month: 'Mar', revenue: 19500, appointments: 112 },
    { month: 'Abr', revenue: 18200, appointments: 105 },
    { month: 'May', revenue: 22400, appointments: 130 },
    { month: 'Jun', revenue: 21100, appointments: 124 },
    { month: 'Jul', revenue: 24800, appointments: 142 },
    { month: 'Ago', revenue: 26500, appointments: 156 },
  ];

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  // Top treatments breakdown
  const treatmentsData = [
    { name: 'Curación con Resina Fotocurable', percentage: 38, count: 142, color: 'bg-teal-500' },
    { name: 'Profilaxis y Destartraje Ultrasonido', percentage: 26, count: 98, color: 'bg-sky-500' },
    { name: 'Endodoncia y Tratamiento Conducto', percentage: 18, count: 68, color: 'bg-purple-500' },
    { name: 'Exodoncia y Cirugía Tercer Molar', percentage: 12, count: 45, color: 'bg-rose-500' },
    { name: 'Ortodoncia y Control Mensual', percentage: 6, count: 22, color: 'bg-amber-500' },
  ];

  return (
    <div id="reports-view" className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-900">
              Reportes Estadísticos y Financieros
            </h1>
            <p className="text-xs text-slate-500">
              Ingresos mensuales, tasa de asistencia a citas y procedimientos más solicitados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Reporte</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">Facturación Total</span>
          <p className="text-2xl font-black font-mono text-emerald-700 mt-1">S/ {totalRevenue.toFixed(2)}</p>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +14.2% vs mes anterior
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Pacientes</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{patients.length}</p>
          <span className="text-[10px] text-teal-600 font-bold mt-1 block">
            100% historias clínicas activas
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">Tasa de Asistencia</span>
          <p className="text-2xl font-black font-mono text-sky-700 mt-1">{attendanceRate}%</p>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {attendedAppointments} de {totalAppointments} citas atendidas
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-400">Tratamientos en Curso</span>
          <p className="text-2xl font-black text-purple-700 mt-1">{treatments.length}</p>
          <span className="text-[10px] text-purple-600 font-bold mt-1 block">
            Seguimiento clínico activo
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Evolución de Ingresos Mensuales (S/)
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">Año 2026</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 pt-6">
            {monthlyData.map((d) => {
              const heightPct = Math.round((d.revenue / maxRevenue) * 100);
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[9px] font-bold font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    S/ {(d.revenue / 1000).toFixed(1)}k
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-lg h-44 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-teal-700 to-teal-500 rounded-t-lg transition-all duration-500 group-hover:from-teal-600 group-hover:to-teal-400"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Procedures Distribution */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Tratamientos Más Solicitados
          </h3>

          <div className="space-y-3 pt-2">
            {treatmentsData.map((tr) => (
              <div key={tr.name} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span className="truncate pr-2">{tr.name}</span>
                  <span className="font-mono font-bold">{tr.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${tr.color} rounded-full`}
                    style={{ width: `${tr.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  Printer,
  FileText,
  Trash2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Budget, BudgetItem } from '../../types';
import confetti from 'canvas-confetti';

export const BudgetsView: React.FC = () => {
  const {
    budgets,
    patients,
    addBudget,
    updateBudgetStatus,
    currentUser,
    selectedSede,
    selectedPatientId,
    addInvoice,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [viewingBudget, setViewingBudget] = useState<Budget | null>(null);

  // Form states for new budget
  const [patientId, setPatientId] = useState(selectedPatientId || patients[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [expirationDate, setExpirationDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('Presupuesto válido por 30 días calendario.');

  const [items, setItems] = useState<BudgetItem[]>([
    {
      id: 'item-1',
      tooth: 'Pieza 46',
      cieCode: 'D2391',
      description: 'Curación con Resina Fotocurable Nanohíbrida (Compuesta)',
      quantity: 1,
      unitPrice: 140.0,
      discount: 0,
      total: 140.0,
      status: 'pendiente',
    },
    {
      id: 'item-2',
      tooth: 'General',
      cieCode: 'D1110',
      description: 'Profilaxis Dental Profunda y Destartraje con Ultrasonido',
      quantity: 1,
      unitPrice: 120.0,
      discount: 20.0,
      total: 100.0,
      status: 'pendiente',
    },
  ]);

  const selectedPatient = patients.find((p) => p.id === patientId);

  const subtotal = items.reduce((acc, it) => acc + it.total, 0);
  const igv = subtotal * 0.18;
  const total = subtotal;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        tooth: 'General',
        cieCode: 'D0120',
        description: 'Nuevo procedimiento odontológico',
        quantity: 1,
        unitPrice: 100.0,
        discount: 0,
        total: 100.0,
        status: 'pendiente',
      },
    ]);
  };

  const handleUpdateItem = (id: string, field: keyof BudgetItem, val: any) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, [field]: val };
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
          const q = field === 'quantity' ? val : it.quantity;
          const up = field === 'unitPrice' ? val : it.unitPrice;
          const disc = field === 'discount' ? val : it.discount;
          updated.total = Math.max(0, q * up - disc);
        }
        return updated;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const newB = addBudget({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      date,
      expirationDate,
      dentistName: currentUser.name,
      sedeId: selectedSede === 'todas' ? 'clinica-surco' : selectedSede,
      status: 'aprobado',
      items,
      subtotal,
      discount: 0,
      igv,
      total,
      notes,
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setIsCreating(false);
    setViewingBudget(newB);
  };

  // Convert budget into SUNAT Invoice
  const handleConvertToInvoice = (budget: Budget) => {
    const patient = patients.find((p) => p.id === budget.patientId);
    if (!patient) return;

    addInvoice({
      patientId: patient.id,
      patientName: patient.fullName,
      patientDoc: patient.docNumber,
      date: new Date().toISOString().split('T')[0],
      type: patient.docType === 'RUC' ? 'factura' : 'boleta',
      series: patient.docType === 'RUC' ? 'F001' : 'B001',
      items: budget.items.map((it) => ({
        description: it.description,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        total: it.total,
      })),
      subtotal: budget.subtotal,
      igv: budget.igv,
      total: budget.total,
      paymentMethod: 'efectivo',
      status: 'emitida',
      sedeId: budget.sedeId,
    });

    updateBudgetStatus(budget.id, 'aprobado');
    alert('¡Comprobante electrónico SUNAT generado con éxito!');
  };

  const safeBudgets = budgets || [];
  const filteredBudgets = safeBudgets.filter((b) => {
    if (!b) return false;
    return (
      (b.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.code || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div id="budgets-view" className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-900">
              Presupuestos Odontológicos y Cotizaciones
            </h1>
            <p className="text-xs text-slate-500">
              Elaboración detallada de planes de tratamiento, descuentos y facturación electrónica directa
            </p>
          </div>
        </div>

        {!isCreating && (
          <button
            id="btn-nuevo-presupuesto"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nuevo Presupuesto</span>
          </button>
        )}
      </div>

      {isCreating ? (
        /* Create Budget Form */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase">
              NUEVO PRESUPUESTO CLÍNICO
            </h2>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              ← Volver
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Header info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Paciente *</label>
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
                <label className="font-bold text-slate-700 block mb-1">Fecha Emisión</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fecha Vencimiento</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Line items table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 uppercase">Tratamientos y Procedimientos</h3>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-teal-600 hover:text-teal-800 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> + Agregar Ítem
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Pieza</th>
                      <th className="p-3">Código</th>
                      <th className="p-3">Descripción</th>
                      <th className="p-3 w-16 text-center">Cant.</th>
                      <th className="p-3 w-24 text-right">P. Unit (S/)</th>
                      <th className="p-3 w-24 text-right">Desc (S/)</th>
                      <th className="p-3 w-28 text-right">Total (S/)</th>
                      <th className="p-3 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((it) => (
                      <tr key={it.id} className="hover:bg-slate-50">
                        <td className="p-2">
                          <input
                            type="text"
                            value={it.tooth}
                            onChange={(e) => handleUpdateItem(it.id, 'tooth', e.target.value)}
                            className="w-24 p-1.5 border border-slate-300 rounded font-semibold"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={it.cieCode}
                            onChange={(e) => handleUpdateItem(it.id, 'cieCode', e.target.value)}
                            className="w-20 p-1.5 border border-slate-300 rounded font-mono"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={it.description}
                            onChange={(e) => handleUpdateItem(it.id, 'description', e.target.value)}
                            className="w-full p-1.5 border border-slate-300 rounded font-medium"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="1"
                            value={it.quantity}
                            onChange={(e) => handleUpdateItem(it.id, 'quantity', parseInt(e.target.value, 10))}
                            className="w-16 p-1.5 border border-slate-300 rounded text-center"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.1"
                            value={it.unitPrice}
                            onChange={(e) => handleUpdateItem(it.id, 'unitPrice', parseFloat(e.target.value))}
                            className="w-24 p-1.5 border border-slate-300 rounded text-right font-mono"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.1"
                            value={it.discount}
                            onChange={(e) => handleUpdateItem(it.id, 'discount', parseFloat(e.target.value))}
                            className="w-24 p-1.5 border border-slate-300 rounded text-right font-mono"
                          />
                        </td>
                        <td className="p-2 text-right font-black font-mono text-teal-800">
                          S/ {it.total.toFixed(2)}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(it.id)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Summary */}
            <div className="flex justify-end">
              <div className="w-64 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold">S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>I.G.V. (18% ref):</span>
                  <span className="font-mono">S/ {igv.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total a Pagar:</span>
                  <span className="text-teal-700 font-mono">S/ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Notas y Condiciones del Presupuesto</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                id="btn-guardar-presupuesto"
                type="submit"
                className="px-6 py-2.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md"
              >
                Guardar Presupuesto
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* List of budgets */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por paciente o código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total: <strong>{filteredBudgets.length} presupuestos</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">CÓDIGO</th>
                  <th className="p-3.5">PACIENTE</th>
                  <th className="p-3.5">FECHA</th>
                  <th className="p-3.5">VENCE</th>
                  <th className="p-3.5 text-right">TOTAL (S/)</th>
                  <th className="p-3.5">ESTADO</th>
                  <th className="p-3.5 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBudgets.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-sky-700">{b.code}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{b.patientName}</p>
                      <p className="text-[10px] text-slate-500">{b.dentistName}</p>
                    </td>
                    <td className="p-3.5 text-slate-600">{b.date}</td>
                    <td className="p-3.5 text-slate-500">{b.expirationDate}</td>
                    <td className="p-3.5 text-right font-black font-mono text-slate-900">
                      S/ {b.total.toFixed(2)}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === 'aprobado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'pendiente'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleConvertToInvoice(b)}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold border border-emerald-200 text-[11px]"
                        title="Facturar en SUNAT"
                      >
                        Facturar
                      </button>
                      <button
                        onClick={() => setViewingBudget(b)}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-[11px]"
                      >
                        Ver Proforma
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Proforma Sheet Modal */}
      {viewingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">DENTS DS • PROFORMA</h2>
                <p className="text-xs text-slate-500 font-mono">Presupuesto {viewingBudget.code}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir
                </button>
                <button
                  onClick={() => setViewingBudget(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
              <div>
                <p className="text-slate-500">Paciente:</p>
                <p className="font-bold text-slate-900 text-sm">{viewingBudget.patientName}</p>
              </div>
              <div>
                <p className="text-slate-500">Odontólogo Tratante:</p>
                <p className="font-bold text-slate-900">{viewingBudget.dentistName}</p>
              </div>
              <div>
                <p className="text-slate-500">Fecha de Emisión:</p>
                <p className="font-bold text-slate-800">{viewingBudget.date}</p>
              </div>
              <div>
                <p className="text-slate-500">Válido hasta:</p>
                <p className="font-bold text-slate-800">{viewingBudget.expirationDate}</p>
              </div>
            </div>

            <div className="space-y-2">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5">Pieza</th>
                    <th className="p-2.5">Descripción</th>
                    <th className="p-2.5 text-center">Cant.</th>
                    <th className="p-2.5 text-right">P. Unit</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {viewingBudget.items.map((it) => (
                    <tr key={it.id}>
                      <td className="p-2.5 font-bold text-slate-700">{it.tooth}</td>
                      <td className="p-2.5">{it.description}</td>
                      <td className="p-2.5 text-center">{it.quantity}</td>
                      <td className="p-2.5 text-right font-mono">S/ {it.unitPrice.toFixed(2)}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                        S/ {it.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-500">{viewingBudget.notes}</span>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">TOTAL PRESUPUESTO:</span>
                <span className="text-2xl font-black font-mono text-teal-700">
                  S/ {viewingBudget.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

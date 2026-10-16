import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Printer,
  QrCode,
  FileCheck,
  Building,
  DollarSign,
  Receipt,
} from 'lucide-react';
import { Invoice } from '../../types';
import confetti from 'canvas-confetti';

export const BillingView: React.FC = () => {
  const {
    invoices,
    patients,
    addInvoice,
    selectedSede,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // New invoice form
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [type, setType] = useState<'boleta' | 'factura'>('boleta');
  const [description, setDescription] = useState('Consulta Integral y Curación con Resina');
  const [amount, setAmount] = useState(140.0);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta' | 'yape' | 'plin' | 'transferencia'>('yape');

  const selectedPatient = patients.find((p) => p.id === patientId);

  const handleEmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const sub = amount / 1.18;
    const igv = amount - sub;

    const newInv = addInvoice({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      patientDoc: selectedPatient.docNumber,
      date: new Date().toISOString().split('T')[0],
      type,
      series: type === 'boleta' ? 'B001' : 'F001',
      items: [
        {
          description,
          quantity: 1,
          unitPrice: amount,
          total: amount,
        },
      ],
      subtotal: sub,
      igv,
      total: amount,
      paymentMethod,
      status: 'emitida',
      sedeId: selectedSede === 'todas' ? 'clinica-surco' : selectedSede,
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setIsCreating(false);
    setSelectedInvoice(newInv);
  };

  const safeInvoices = invoices || [];
  const filteredInvoices = safeInvoices.filter((inv) => {
    if (!inv) return false;
    return (
      (inv.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.patientDoc || '').includes(searchQuery)
    );
  });

  const totalEmitted = safeInvoices.reduce((acc, inv) => acc + (inv.total ?? inv.amount ?? 0), 0);

  return (
    <div id="billing-view" className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-900">
              Facturación Electrónica SUNAT y Caja
            </h1>
            <p className="text-xs text-slate-500">
              Emisión de Boletas Electrónicas (B001), Facturas (F001) y medios de pago integrados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-right">
            <span className="text-[10px] font-bold text-emerald-700 uppercase block">Total Facturado</span>
            <span className="text-sm font-black font-mono text-emerald-900">S/ {totalEmitted.toFixed(2)}</span>
          </div>

          {!isCreating && (
            <button
              id="btn-emitir-comprobante"
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Emitir Comprobante</span>
            </button>
          )}
        </div>
      </div>

      {isCreating ? (
        /* Form to emit new electronic receipt */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase">
              EMISIÓN DE COMPROBANTE ELECTRÓNICO SUNAT
            </h2>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              ← Volver
            </button>
          </div>

          <form onSubmit={handleEmitInvoice} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tipo de Comprobante *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-teal-900"
                >
                  <option value="boleta">Boleta de Venta Electrónica (B001)</option>
                  <option value="factura">Factura Electrónica (F001 - con RUC)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Paciente / Cliente *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold"
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} • {p.docType}: {p.docNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Medio de Pago *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="yape">Yape / Plin (Billetera digital)</option>
                  <option value="tarjeta">Tarjeta Débito / Crédito (POS)</option>
                  <option value="efectivo">Efectivo en Caja</option>
                  <option value="transferencia">Transferencia BCP / BBVA / Interbank</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Descripción del Servicio Odontológico *</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Monto Total Cobrado (S/) *</label>
                <input
                  type="number"
                  step="0.5"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold text-base text-emerald-800"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                id="btn-confirmar-emision-sunat"
                type="submit"
                className="px-6 py-2.5 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md"
              >
                Emitir Comprobante a SUNAT
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Invoices list */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por N° comprobante o paciente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total: <strong>{filteredInvoices.length} comprobantes emitidos</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">COMPROBANTE</th>
                  <th className="p-3.5">PACIENTE / CLIENTE</th>
                  <th className="p-3.5">DOC. IDENTIDAD</th>
                  <th className="p-3.5">FECHA</th>
                  <th className="p-3.5">MEDIO PAGO</th>
                  <th className="p-3.5 text-right">TOTAL (S/)</th>
                  <th className="p-3.5">ESTADO SUNAT</th>
                  <th className="p-3.5 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-teal-700">
                      {inv.number}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{inv.patientName}</td>
                    <td className="p-3.5 font-mono text-slate-600">{inv.patientDoc}</td>
                    <td className="p-3.5 text-slate-600">{inv.date}</td>
                    <td className="p-3.5 capitalize font-semibold text-slate-700">{inv.paymentMethod}</td>
                    <td className="p-3.5 text-right font-black font-mono text-slate-900">
                      S/ {inv.total.toFixed(2)}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                        <FileCheck className="w-3 h-3" /> Aceptada
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-[11px]"
                      >
                        Ver Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Ticket Receipt with SUNAT QR code */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-4 font-mono text-xs">
            <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
              <h2 className="text-base font-black text-slate-900">CLÍNICA DENTAL DENTS DS</h2>
              <p className="text-[10px] text-slate-500">RUC: 20608945123</p>
              <p className="text-[10px] text-slate-500">Av. Javier Prado Este 2340 - Lima</p>
              <p className="text-xs font-bold text-teal-800 pt-1 uppercase">
                {selectedInvoice.type === 'boleta' ? 'BOLETA ELECTRÓNICA' : 'FACTURA ELECTRÓNICA'}
              </p>
              <p className="font-bold text-slate-800">{selectedInvoice.number}</p>
            </div>

            <div className="space-y-1 text-[11px] border-b border-dashed border-slate-300 pb-3">
              <p>Fecha: {selectedInvoice.date}</p>
              <p>Cliente: {selectedInvoice.patientName}</p>
              <p>Doc: {selectedInvoice.patientDoc}</p>
              <p>Medio Pago: {(selectedInvoice.paymentMethod || 'Efectivo').toUpperCase()}</p>
            </div>

            <div className="space-y-1 border-b border-dashed border-slate-300 pb-3">
              {selectedInvoice.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-[11px]">
                  <span>1x {it.description}</span>
                  <span className="font-bold">S/ {it.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-right">
              <p className="text-[11px]">Op. Gravada: S/ {selectedInvoice.subtotal.toFixed(2)}</p>
              <p className="text-[11px]">I.G.V. 18%: S/ {selectedInvoice.igv.toFixed(2)}</p>
              <p className="text-sm font-black text-slate-900">TOTAL: S/ {selectedInvoice.total.toFixed(2)}</p>
            </div>

            {/* Simulated SUNAT QR */}
            <div className="text-center pt-2 border-t border-dashed border-slate-300 space-y-1">
              <div className="w-20 h-20 bg-slate-100 border border-slate-300 rounded mx-auto flex items-center justify-center">
                <QrCode className="w-16 h-16 text-slate-800" />
              </div>
              <p className="text-[9px] text-slate-400">Representación impresa de Comprobante Electrónico SUNAT</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded font-sans font-bold text-xs flex items-center gap-1"
              >
                <Printer className="w-3 h-3" /> Imprimir
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-3 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded font-sans font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

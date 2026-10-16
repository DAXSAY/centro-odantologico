import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Boxes,
  Calendar,
  Layers,
} from 'lucide-react';
import { InventoryItem } from '../../types';
import confetti from 'canvas-confetti';

export const InventoryView: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryStock, selectedSede } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Restauradores');
  const [currentStock, setCurrentStock] = useState(10);
  const [minStock, setMinStock] = useState(5);
  const [unit, setUnit] = useState('unidad');
  const [batchNumber, setBatchNumber] = useState('LOT-2026-X');
  const [expirationDate, setExpirationDate] = useState('2027-12-31');
  const [costPrice, setCostPrice] = useState(45.0);

  const safeInventory = inventory || [];
  const filteredItems = safeInventory.filter((it) => {
    if (!it) return false;
    const nameMatch = (it.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = (it.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const batchMatch = (it.batchNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || catMatch || batchMatch;
  });

  const lowStockCount = safeInventory.filter(
    (it) => it && (it.currentStock ?? it.stock ?? 0) <= it.minStock
  ).length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem({
      name,
      category,
      currentStock,
      minStock,
      unit,
      batchNumber,
      expirationDate,
      costPrice,
      sedeId: selectedSede === 'todas' ? 'clinica-surco' : selectedSede,
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setIsCreating(false);
  };

  return (
    <div id="inventory-view" className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-900">
              Inventario de Materiales e Insumos Dentales
            </h1>
            <p className="text-xs text-slate-500">
              Control de stock, lotes, fechas de caducidad y alertas de reposición mínima
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lowStockCount > 0 && (
            <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl flex items-center gap-2 text-rose-700 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>{lowStockCount} insumo(s) por agotarse</span>
            </div>
          )}

          {!isCreating && (
            <button
              id="btn-nuevo-insumo"
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuevo Insumo</span>
            </button>
          )}
        </div>
      </div>

      {isCreating ? (
        /* Create Item Form */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase">
              REGISTRAR NUEVO INSUMO ODONTOLÓGICO
            </h2>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              ← Volver
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre del Insumo / Material *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Resina Filtek Z350 XT A2"
                  className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="Restauradores">Restauradores / Resinas</option>
                  <option value="Anestésicos">Anestésicos / Agujas</option>
                  <option value="Endodoncia">Endodoncia / Limas</option>
                  <option value="Bioseguridad">Bioseguridad / Guantes / Mascarillas</option>
                  <option value="Ortodoncia">Ortodoncia / Brackets</option>
                  <option value="Impresión">Impresión / Alginato / Silicona</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Unidad de Medida</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="unidad">Jeringa / Unidad</option>
                  <option value="caja">Caja</option>
                  <option value="frasco">Frasco</option>
                  <option value="paquete">Paquete</option>
                  <option value="kit">Kit</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Stock Actual</label>
                <input
                  type="number"
                  value={currentStock}
                  onChange={(e) => setCurrentStock(parseInt(e.target.value, 10))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Stock Mínimo (Alerta)</label>
                <input
                  type="number"
                  value={minStock}
                  onChange={(e) => setMinStock(parseInt(e.target.value, 10))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">N° Lote</label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Fecha de Vencimiento</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
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
                type="submit"
                className="px-6 py-2.5 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md"
              >
                Guardar Insumo
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Inventory table */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar insumo, categoría o lote..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total: <strong>{filteredItems.length} insumos registrados</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">INSUMO / MATERIAL</th>
                  <th className="p-3.5">CATEGORÍA</th>
                  <th className="p-3.5">LOTE</th>
                  <th className="p-3.5">VENCIMIENTO</th>
                  <th className="p-3.5 text-center">STOCK ACTUAL</th>
                  <th className="p-3.5">ESTADO STOCK</th>
                  <th className="p-3.5 text-right">ACCIONES KARDEX</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((it) => {
                  const isLow = it.currentStock <= it.minStock;
                  return (
                    <tr key={it.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{it.name}</td>
                      <td className="p-3.5 text-slate-600 font-medium">{it.category}</td>
                      <td className="p-3.5 font-mono text-slate-500">{it.batchNumber}</td>
                      <td className="p-3.5 text-slate-600">{it.expirationDate}</td>
                      <td className="p-3.5 text-center font-bold text-sm font-mono">
                        {it.currentStock} {it.unit}
                      </td>
                      <td className="p-3.5">
                        {isLow ? (
                          <span className="bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Bajo Stock (&lt;{it.minStock})
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold w-fit">
                            Óptimo
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => updateInventoryStock(it.id, Math.max(0, it.currentStock - 1))}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold"
                          title="Descargar 1 unidad"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => updateInventoryStock(it.id, it.currentStock + 5)}
                          className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded font-bold border border-teal-200"
                          title="Ingresar 5 unidades"
                        >
                          +5
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

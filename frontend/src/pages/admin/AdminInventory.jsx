import React, { useState, useEffect } from 'react';
import {
  Boxes,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Search,
  Plus,
  Minus,
  Save,
  Check,
} from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminInventory({ lang = 'uz' }) {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Quick edit state: { [productId]: number }
  const [stockEdits, setStockEdits] = useState({});
  const [savedId, setSavedId] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, [currentPage, search, stockStatusFilter]);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        search: search || undefined,
        stock_status: stockStatusFilter || undefined,
      };
      const res = await adminService.getInventory(params);
      setProducts(res.data || []);
      setSummary(res.summary || null);
      setPagination(res.pagination || null);
    } catch (e) {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockChange = (id, val) => {
    setStockEdits((prev) => ({ ...prev, [id]: Math.max(0, parseInt(val) || 0) }));
  };

  const handleSaveStock = async (id) => {
    const newStock = stockEdits[id];
    if (newStock === undefined) return;

    try {
      await adminService.updateStock(id, newStock);
      setSavedId(id);
      setTimeout(() => setSavedId(null), 2000);
      fetchInventory();
    } catch (e) {
      alert('Qoldiqni yangilashda xatolik');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'uz' ? 'Omborxona & Qoldiqlar Nazorati' : 'Склад и Управление запасами'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Dori vositalarining zaxirasi, kam qolgan va tugagan mahsulotlar monitoringi
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Jami ombor qoldig‘i</p>
              <p className="text-xl font-black text-slate-900 mt-1">{summary.total_units} dona</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
          </div>

          <button
            onClick={() => setStockStatusFilter('normal')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              stockStatusFilter === 'normal'
                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <p className="text-xs font-semibold text-emerald-800">Yetarli (Normal &gt; 10)</p>
            <p className="text-xl font-black text-emerald-900 mt-1">{summary.normal_count} xil</p>
          </button>

          <button
            onClick={() => setStockStatusFilter('low_stock')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              stockStatusFilter === 'low_stock'
                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <p className="text-xs font-semibold text-amber-800">Kam qolgan (1 - 10)</p>
            <p className="text-xl font-black text-amber-900 mt-1">{summary.low_stock_count} xil</p>
          </button>

          <button
            onClick={() => setStockStatusFilter('out_of_stock')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              stockStatusFilter === 'out_of_stock'
                ? 'bg-red-50 border-red-500 ring-2 ring-red-500/20'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <p className="text-xs font-semibold text-red-800">Tugagan (0 dona)</p>
            <p className="text-xl font-black text-red-900 mt-1">{summary.out_of_stock_count} xil</p>
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Mahsulot nomi yoki brendi bo‘yicha qidirish..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500 text-slate-900"
          />
        </div>

        <div className="flex gap-2">
          {stockStatusFilter && (
            <button
              onClick={() => setStockStatusFilter('')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
            >
              Filtrni tozalash
            </button>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Mahsulot nomi</th>
                <th className="p-4">Kategoriya</th>
                <th className="p-4">Brend</th>
                <th className="p-4">Zaxira holati</th>
                <th className="p-4">Joriy qoldiq</th>
                <th className="p-4 text-right">Tezkor yangilash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= 10;
                  const isOut = p.stock === 0;
                  const currentVal = stockEdits[p.id] !== undefined ? stockEdits[p.id] : p.stock;
                  const hasChanged = stockEdits[p.id] !== undefined && stockEdits[p.id] !== p.stock;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">#{p.id}</td>
                      <td className="p-4 font-bold text-slate-900 max-w-xs">{p.name}</td>
                      <td className="p-4 text-slate-600">{p.category?.name_uz || '—'}</td>
                      <td className="p-4 text-teal-700 font-bold uppercase">{p.brand}</td>
                      <td className="p-4">
                        {isOut ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            <span>Tugagan (Out of Stock)</span>
                          </span>
                        ) : isLow ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Kam qolgan (Low Stock)</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Yetarli (Normal)</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-900 text-sm">
                        {p.stock} dona
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50">
                            <button
                              type="button"
                              onClick={() => handleStockChange(p.id, currentVal - 1)}
                              className="p-1.5 text-slate-600 hover:text-slate-900"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              value={currentVal}
                              onChange={(e) => handleStockChange(p.id, e.target.value)}
                              className="w-12 text-center bg-transparent border-0 font-bold text-xs font-mono focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleStockChange(p.id, currentVal + 1)}
                              className="p-1.5 text-slate-600 hover:text-slate-900"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {hasChanged && (
                            <button
                              onClick={() => handleSaveStock(p.id)}
                              className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
                              title="Saqlash"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {savedId === p.id && (
                            <span className="text-teal-600 flex items-center gap-1 text-[11px] font-bold animate-scale-in">
                              <Check className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    Mahsulotlar topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  ShoppingBag,
  Package,
} from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminReports({ lang = 'uz' }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getDashboardStats();
      setData(res.data);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (val) => {
    return Number(val || 0).toLocaleString('uz-UZ') + " so'm";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'uz' ? 'Moliyaviy & Savdo Hisobotlari' : 'Финансовые и Торговые отчеты'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Savdo ko‘rsatkichlari tahlili va mahsulotlar aylanmasi
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs shadow-xs transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Hisobotni chop etish (PDF)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Jami tasdiqlangan tushum</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {formatPrice(data?.stats?.total_sales || 0)}
          </p>
          <span className="text-[11px] text-teal-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Muvaffaqiyatli savdolar</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">O‘rtacha buyurtma cheki (AOV)</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {formatPrice(
              data?.stats?.total_orders
                ? (data?.stats?.total_sales / data?.stats?.total_orders)
                : 0
            )}
          </p>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
            Har bir buyurtmaga to‘g‘ri keluvchi summa
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Xizmat ko‘rsatilgan mijozlar</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {data?.stats?.total_customers || 0} nafar
          </p>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">
            Faol xaridorlar bazasi
          </span>
        </div>
      </div>

      {/* Breakdown Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Kategoriyalar bo‘yicha umumiy holat</h2>
        <div className="divide-y divide-slate-100 text-xs">
          {data?.charts?.categories_distribution?.map((cat) => (
            <div key={cat.id} className="py-3 flex items-center justify-between">
              <span className="font-semibold text-slate-900">{cat.name} ({cat.name_ru})</span>
              <span className="font-bold text-teal-700">{cat.products_count} ta dori vositasi</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

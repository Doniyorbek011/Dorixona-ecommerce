import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Boxes,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import adminService from '../../services/adminService';

export default function AdminDashboard({ lang = 'uz' }) {
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
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (val) => {
    return Number(val || 0).toLocaleString('uz-UZ') + " so'm";
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200" />
          ))}
        </div>
        <div className="h-80 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  const { stats, alerts, charts, recent_orders } = data;

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'uz' ? 'Boshqaruv Paneli' : 'Панель управления'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {lang === 'uz'
            ? 'Savdo ko‘rsatkichlari, yangi buyurtmalar va dori-darmonlar holati'
            : 'Показатели продаж, новые заказы и складские запасы'}
        </p>
      </div>

      {/* 1. Alerts Banner if any */}
      {(alerts.new_orders_count > 0 || alerts.low_stock_count > 0 || alerts.out_of_stock_count > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {alerts.new_orders_count > 0 && (
            <Link
              to="/admin/orders"
              className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between hover:bg-blue-100/70 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-950">
                    {alerts.new_orders_count} ta Yangi Buyurtma!
                  </p>
                  <p className="text-[11px] text-blue-700">Tasdiqlashni kutmoqda</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </Link>
          )}

          {alerts.low_stock_count > 0 && (
            <Link
              to="/admin/inventory?stock_status=low_stock"
              className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between hover:bg-amber-100/70 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-950">
                    {alerts.low_stock_count} ta Kam Qolgan Dori
                  </p>
                  <p className="text-[11px] text-amber-700">Qoldiq 10 donadan kam</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-600" />
            </Link>
          )}

          {alerts.out_of_stock_count > 0 && (
            <Link
              to="/admin/inventory?stock_status=out_of_stock"
              className="p-4 rounded-2xl bg-red-50/80 border border-red-200 flex items-center justify-between hover:bg-red-100/70 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-red-950">
                    {alerts.out_of_stock_count} ta Tugagan Mahsulot
                  </p>
                  <p className="text-[11px] text-red-700">Omborda qolmagan</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-red-600" />
            </Link>
          )}
        </div>
      )}

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              {lang === 'uz' ? 'Jami Savdo' : 'Общие продажи'}
            </p>
            <p className="text-xl font-black text-slate-900 mt-1">
              {formatPrice(stats.total_sales)}
            </p>
            <span className="text-[11px] font-semibold text-teal-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+{stats.total_orders} buyurtma</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              {lang === 'uz' ? 'Buyurtmalar soni' : 'Всего заказов'}
            </p>
            <p className="text-xl font-black text-slate-900 mt-1">
              {stats.total_orders} ta
            </p>
            <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 mt-1">
              <span>{alerts.new_orders_count} yangi</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              {lang === 'uz' ? 'Ro‘yxatdan o‘tgan Mijozlar' : 'Покупатели'}
            </p>
            <p className="text-xl font-black text-slate-900 mt-1">
              {stats.total_customers} nafar
            </p>
            <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1 mt-1">
              <span>Faol hisoblar</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              {lang === 'uz' ? 'Mahsulotlar katalogi' : 'Товаров в каталоге'}
            </p>
            <p className="text-xl font-black text-slate-900 mt-1">
              {stats.total_products} xil
            </p>
            <span className="text-[11px] font-semibold text-teal-600 flex items-center gap-1 mt-1">
              <span>Faol dori vositalari</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {lang === 'uz' ? 'So‘nggi 7 kunlik savdo dinamikasi' : 'Динамика продаж за 7 дней'}
              </h2>
              <p className="text-[11px] text-slate-500">Daromad va kunlik buyurtmalar</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.daily_sales}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val) => [formatPrice(val), 'Daromad']}
                  labelFormatter={(label) => `Sana: ${label}`}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0284c7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Product Distribution */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {lang === 'uz' ? 'Kategoriyalar bo‘yicha' : 'По категориям'}
            </h2>
            <p className="text-[11px] text-slate-500 mb-4">Mahsulotlar taqsimoti</p>

            <div className="space-y-3">
              {charts.categories_distribution?.slice(0, 5).map((cat) => (
                <div key={cat.id}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 truncate">{cat.name}</span>
                    <span className="text-slate-500">{cat.products_count} ta</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (cat.products_count / (stats.total_products || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/admin/categories"
            className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-medical-600 hover:text-medical-700 flex items-center justify-between"
          >
            <span>Barcha kategoriyalarni boshqarish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4. Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {lang === 'uz' ? 'So‘nggi Buyurtmalar' : 'Последние заказы'}
            </h2>
            <p className="text-[11px] text-slate-500">Mijozlardan qabul qilingan so‘nggi buyurtmalar</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-medical-600 hover:text-medical-700 flex items-center gap-1"
          >
            <span>Barchasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Mijoz</th>
                <th className="p-4">Telefon</th>
                <th className="p-4">Summa</th>
                <th className="p-4">Holati</th>
                <th className="p-4">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent_orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900">#{order.id}</td>
                  <td className="p-4 font-semibold text-slate-900">{order.customer_name}</td>
                  <td className="p-4 text-slate-500">{order.phone}</td>
                  <td className="p-4 font-bold text-slate-900">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

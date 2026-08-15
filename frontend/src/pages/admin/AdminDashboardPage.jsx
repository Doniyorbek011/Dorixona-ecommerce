import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Package,
  ShoppingBag,
  CreditCard,
  Clock,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import authService from '../../services/authService';

export default function AdminDashboardPage({ lang = 'uz' }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.getAdminStats();
      setStats(res.data);
      setIsLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (lang === 'uz'
            ? 'Admin ma’lumotlarini yuklashda xatolik yuz berdi.'
            : 'Ошибка загрузки данных панели управления.')
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatPrice = (val) => {
    return Number(val || 0).toLocaleString('uz-UZ') + " so'm";
  };

  const t = {
    uz: {
      title: 'Administrator Boshqaruv Paneli',
      subtitle: 'Tizim statistikasi, mahsulotlar va buyurtmalar holati',
      refresh: 'Yangilash',
      kpiUsers: 'Mijozlar soni',
      kpiCategories: 'Kategoriyalar',
      kpiProducts: 'Mahsulotlar',
      kpiOrders: 'Jami buyurtmalar',
      kpiPending: 'Kutilayotgan buyurtmalar',
      kpiRevenue: 'To‘langan tushum',
      recentOrders: 'So‘nggi buyurtmalar',
      thOrderId: 'ID',
      thCustomer: 'Mijoz',
      thPhone: 'Telefon',
      thAmount: 'Summa',
      thPayment: 'To‘lov usuli',
      thStatus: 'Holati',
      thDate: 'Sana',
      noOrders: 'Buyurtmalar mavjud emas',
    },
    ru: {
      title: 'Панель управления администратора',
      subtitle: 'Статистика системы, товары и заказы',
      refresh: 'Обновить',
      kpiUsers: 'Покупатели',
      kpiCategories: 'Категории',
      kpiProducts: 'Товары',
      kpiOrders: 'Всего заказов',
      kpiPending: 'Ожидают обработки',
      kpiRevenue: 'Оплаченная выручка',
      recentOrders: 'Последние заказы',
      thOrderId: 'ID',
      thCustomer: 'Клиент',
      thPhone: 'Телефон',
      thAmount: 'Сумма',
      thPayment: 'Оплата',
      thStatus: 'Статус',
      thDate: 'Дата',
      noOrders: 'Заказов нет',
    },
  };

  const currentT = t[lang];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-navy-900 text-teal-400 flex items-center justify-center shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-navy-900">{currentT.title}</h1>
            <p className="text-xs text-gray-500">{currentT.subtitle}</p>
          </div>
        </div>

        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-2xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{currentT.refresh}</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">{currentT.kpiRevenue}</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-navy-900 tracking-tight">
            {formatPrice(stats?.total_revenue)}
          </div>
          <p className="text-[11px] text-teal-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Muvaffaqiyatli to‘langan buyurtmalar</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">{currentT.kpiOrders}</span>
            <div className="w-9 h-9 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-navy-900 tracking-tight">
            {stats?.total_orders ?? 0}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {stats?.pending_orders ?? 0} ta kutilayotgan
          </p>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">{currentT.kpiProducts}</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-navy-900 tracking-tight">
            {stats?.total_products ?? 0}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {stats?.total_categories ?? 0} ta kategoriyada
          </p>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500">{currentT.kpiUsers}</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-navy-900 tracking-tight">
            {stats?.total_users ?? 0}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Faol ro‘yxatdan o‘tgan mijozlar</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-navy-900">{currentT.recentOrders}</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
            {stats?.recent_orders?.length ?? 0} ta yozuv
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">{currentT.thOrderId}</th>
                <th className="px-6 py-3">{currentT.thCustomer}</th>
                <th className="px-6 py-3">{currentT.thPhone}</th>
                <th className="px-6 py-3">{currentT.thAmount}</th>
                <th className="px-6 py-3">{currentT.thPayment}</th>
                <th className="px-6 py-3">{currentT.thStatus}</th>
                <th className="px-6 py-3">{currentT.thDate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {stats?.recent_orders && stats.recent_orders.length > 0 ? (
                stats.recent_orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-bold text-navy-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-navy-900">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-3.5">{order.phone}</td>
                    <td className="px-6 py-3.5 font-semibold text-navy-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-3.5 uppercase font-mono text-[11px]">
                      {order.payment_method}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          order.status === 'delivered'
                            ? 'bg-teal-50 text-teal-700 border border-teal-200'
                            : order.status === 'processing'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {currentT.noOrders}
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

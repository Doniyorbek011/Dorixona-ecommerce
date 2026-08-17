import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  Truck,
  Clock,
  MapPin,
  Phone,
  User as UserIcon,
  CreditCard,
  Banknote,
  FileText,
  ExternalLink,
} from 'lucide-react';

import adminService from '../../services/adminService';

export default function AdminOrders({ lang = 'uz' }) {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: null });

  useEffect(() => {
    fetchOrders();
  }, [currentPage, search, statusFilter]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        search: search || undefined,
        status: statusFilter || undefined,
      };
      const res = await adminService.getOrders(params);
      setOrders(res.data || []);
      setPagination(res.pagination || null);
    } catch (e) {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus, paymentStatus) => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    setFeedback({ type: null, message: null });

    try {
      const payload = {};
      if (newStatus) payload.status = newStatus;
      if (paymentStatus) payload.payment_status = paymentStatus;

      const res = await adminService.updateOrderStatus(selectedOrder.id, payload);
      setSelectedOrder({ ...selectedOrder, ...res.data });
      setFeedback({ type: 'success', message: 'Buyurtma holati muvaffaqiyatli yangilandi!' });
      fetchOrders();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Xatolik yuz berdi.',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatPrice = (val) => {
    return Number(val || 0).toLocaleString('uz-UZ') + " so'm";
  };

  const getStatusBadge = (status, paymentStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            {lang === 'uz' ? 'Yangi' : 'Новый'}
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {lang === 'uz' ? 'Tasdiqlangan' : 'Подтвержден'}
          </span>
        );
      case 'preparing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            {lang === 'uz' ? 'Tayyorlanmoqda' : 'Собирается'}
          </span>
        );
      case 'shipping':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
            {lang === 'uz' ? 'Yetkazilmoqda' : 'В пути'}
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {lang === 'uz' ? 'Yetkazib berildi' : 'Доставлен'}
          </span>
        );
      case 'cancelled':
        if (paymentStatus === 'failed') {
          return (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {lang === 'uz' ? 'To‘lov xatosi / Bekor' : 'Ошибка оплаты'}
            </span>
          );
        }
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
            {lang === 'uz' ? 'Bekor qilingan' : 'Отменен'}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };


  const getPaymentStatusBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            To‘langan
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Kutilmoqda
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-700 border border-red-200">
            Bekor
          </span>
        );
      case 'refunded':
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Qaytarilgan
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700">
            {paymentStatus || 'pending'}
          </span>
        );
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'uz' ? 'Buyurtmalar Boshqaruvi' : 'Управление заказами'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Mijozlar buyurtmalari, statuslarini o‘zgartirish va yetkazib berish nazorati
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buyurtma ID, mijoz ismi yoki telefon raqami bo‘yicha qidirish..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500 text-slate-900"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500 text-slate-900"
          >
            <option value="">Barcha holatlar</option>
            <option value="new">Yangi (new)</option>
            <option value="confirmed">Tasdiqlangan (confirmed)</option>
            <option value="preparing">Tayyorlanmoqda (preparing)</option>
            <option value="shipping">Yetkazilmoqda (shipping)</option>
            <option value="delivered">Yetkazib berildi (delivered)</option>
            <option value="cancelled">Bekor qilingan (cancelled)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Mijoz</th>
                <th className="p-4">Telefon</th>
                <th className="p-4">Manzil</th>
                <th className="p-4">Jami Summa</th>
                <th className="p-4">To‘lov</th>
                <th className="p-4">Holati</th>
                <th className="p-4">Sana</th>
                <th className="p-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">#{order.id}</td>
                    <td className="p-4 font-bold text-slate-900">{order.customer_name}</td>
                    <td className="p-4 text-slate-600">{order.phone}</td>
                    <td className="p-4 text-slate-600 truncate max-w-[150px]">{order.address}</td>
                    <td className="p-4 font-bold text-slate-900">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="uppercase font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md w-fit">
                          {order.payment_method}
                        </span>
                        {getPaymentStatusBadge(order.payment_status)}
                      </div>
                    </td>

                    <td className="p-4">{getStatusBadge(order.status, order.payment_status)}</td>
                    <td className="p-4 text-slate-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setFeedback({ type: null, message: null });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-medical-50 text-medical-700 hover:bg-medical-600 hover:text-white transition-all text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ko‘rish</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400">
                    Buyurtmalar topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination && pagination.last_page > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Jami: <strong>{pagination.total}</strong> ta buyurtma
            </span>
            <div className="flex gap-1">
              {Array.from({ length: pagination.last_page }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg font-semibold transition-colors ${
                    currentPage === i + 1
                      ? 'bg-medical-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ORDER DETAIL & STATUS UPDATE MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-scale-in my-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-slate-900">
                  Buyurtma #{selectedOrder.id}
                </h2>
                {getStatusBadge(selectedOrder.status, selectedOrder.payment_status)}
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback.message && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 animate-slide-up ${
                  feedback.type === 'success'
                    ? 'bg-teal-50 border border-teal-200 text-teal-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Status Controller Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-900">Buyurtma holatini yangilash:</p>
                <p className="text-[11px] text-slate-500">Mijoz profilingizda o‘zgarish aks etadi</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedOrder.status}
                  disabled={isUpdatingStatus}
                  onChange={(e) => handleUpdateStatus(e.target.value, null)}
                  className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500 text-slate-900"
                >
                  <option value="new">Yangi (new)</option>
                  <option value="confirmed">Tasdiqlangan (confirmed)</option>
                  <option value="preparing">Tayyorlanmoqda (preparing)</option>
                  <option value="shipping">Yetkazilmoqda (shipping)</option>
                  <option value="delivered">Yetkazib berildi (delivered)</option>
                  <option value="cancelled">Bekor qilingan (cancelled)</option>
                </select>

                <select
                  value={selectedOrder.payment_status}
                  disabled={isUpdatingStatus}
                  onChange={(e) => handleUpdateStatus(null, e.target.value)}
                  className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500 text-slate-900"
                >
                  <option value="pending">To‘lov: Kutilmoqda</option>
                  <option value="paid">To‘lov: To‘langan</option>
                  <option value="failed">To‘lov: Bekor bo‘lgan</option>
                </select>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-medical-600" />
                  <span>Mijoz ma’lumotlari</span>
                </p>
                <p className="text-slate-700">
                  Ism: <strong>{selectedOrder.customer_name}</strong>
                </p>
                <p className="text-slate-700">
                  Telefon: <strong>{selectedOrder.phone}</strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>Yetkazib berish manzili</span>
                  </p>
                  {selectedOrder.latitude && selectedOrder.longitude && (
                    <a
                      href={`https://yandex.uz/maps/?pt=${selectedOrder.longitude},${selectedOrder.latitude}&z=16&l=map`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 active:bg-teal-200 text-teal-700 text-[11px] font-bold border border-teal-200 transition-colors shadow-2xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Xaritada ko‘rish</span>
                    </a>
                  )}
                </div>
                <p className="text-slate-700">{selectedOrder.address}</p>
                {selectedOrder.latitude && selectedOrder.longitude && (
                  <p className="text-[10px] text-slate-400 font-mono">
                    📍 {Number(selectedOrder.latitude).toFixed(6)}, {Number(selectedOrder.longitude).toFixed(6)}
                  </p>
                )}
                {selectedOrder.note && (
                  <p className="text-[11px] text-slate-500 italic">
                    Eslatma: "{selectedOrder.note}"
                  </p>
                )}
              </div>
            </div>


            {/* Ordered Items Table */}
            <div>
              <p className="text-xs font-bold text-slate-900 mb-2">Buyurtma qilingan mahsulotlar:</p>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{item.product_name}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.quantity} dona × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Calculation Row */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Mahsulotlar summasi:</span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(selectedOrder.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Yetkazib berish:</span>
                <span className="font-semibold text-slate-900">
                  {selectedOrder.delivery_price > 0
                    ? formatPrice(selectedOrder.delivery_price)
                    : 'Bepul'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Jami:</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

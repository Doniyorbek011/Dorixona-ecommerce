import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  Eye,
  ShoppingBag,
  Mail,
  Phone,
  Calendar,
  X,
  MapPin,
} from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminCustomers({ lang = 'uz' }) {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Detail modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, search]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        search: search || undefined,
      };
      const res = await adminService.getCustomers(params);
      setCustomers(res.data || []);
      setPagination(res.pagination || null);
    } catch (e) {
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetail = async (id) => {
    setIsLoadingDetail(true);
    try {
      const res = await adminService.getCustomer(id);
      setSelectedCustomer(res.data);
    } catch (e) {
      alert('Mijoz ma’lumotlarini olishda xatolik');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const formatPrice = (val) => {
    return Number(val || 0).toLocaleString('uz-UZ') + " so'm";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'uz' ? 'Mijozlar Ro‘yxati' : 'Список клиентов'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Ro‘yxatdan o‘tgan xaridorlar va ularning faolligi
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Ism, email yoki telefon raqam bo‘yicha qidirish..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500 text-slate-900"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Mijoz</th>
                <th className="p-4">Email</th>
                <th className="p-4">Telefon</th>
                <th className="p-4">Buyurtmalar</th>
                <th className="p-4">Jami Xarid</th>
                <th className="p-4">Ro‘yxatdan o‘tgan</th>
                <th className="p-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">#{c.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-medical-50 border border-medical-200 text-medical-700 font-bold flex items-center justify-center text-xs">
                          {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="font-bold text-slate-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{c.email}</td>
                    <td className="p-4 text-slate-600">{c.phone}</td>
                    <td className="p-4 font-semibold text-slate-900">
                      {c.orders_count ?? 0} ta
                    </td>
                    <td className="p-4 font-bold text-teal-700">
                      {formatPrice(c.orders_sum_total || 0)}
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(c.id)}
                        className="px-3 py-1.5 rounded-xl bg-medical-50 text-medical-700 hover:bg-medical-600 hover:text-white transition-all text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profil</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    Mijozlar topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER DETAIL MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-scale-in my-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-medical-600 text-white flex items-center justify-center text-lg font-bold">
                  {selectedCustomer.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {selectedCustomer.name}
                  </h2>
                  <p className="text-xs text-slate-500">{selectedCustomer.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-slate-500">Jami buyurtmalar:</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedCustomer.orders_count ?? 0} ta
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-slate-500">Jami sarflangan summa:</p>
                <p className="text-lg font-bold text-teal-700 mt-0.5">
                  {formatPrice(selectedCustomer.orders_sum_total || 0)}
                </p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-2 text-xs text-slate-700">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>Telefon: <strong>{selectedCustomer.phone}</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Manzil: <strong>{selectedCustomer.address || 'Kiritilmagan'}</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Ro‘yxatdan o‘tgan sana: <strong>{new Date(selectedCustomer.created_at).toLocaleString()}</strong></span>
              </p>
            </div>

            {/* Orders History */}
            <div>
              <p className="text-xs font-bold text-slate-900 mb-2">Buyurtmalar tarixi:</p>
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                {selectedCustomer.orders?.length > 0 ? (
                  selectedCustomer.orders.map((o) => (
                    <div key={o.id} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">Buyurtma #{o.id}</p>
                        <p className="text-[11px] text-slate-500">
                          {new Date(o.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{formatPrice(o.total)}</p>
                        <span className="text-[10px] font-bold uppercase text-blue-700">
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center text-slate-400">Buyurtmalar mavjud emas.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

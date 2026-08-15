import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Calendar,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowRight,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function ProfilePage({ lang = 'uz' }) {
  const { user, isAdmin, updateProfile, fetchProfile, isLoading, error: storeError } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const [feedback, setFeedback] = useState({ type: null, message: null });
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFeedback({ type: null, message: null });

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
    };

    if (formData.new_password) {
      if (formData.new_password !== formData.new_password_confirmation) {
        setFeedback({
          type: 'error',
          message: lang === 'uz' ? 'Yangi parol tasdig‘i mos kelmadi.' : 'Пароли не совпадают.',
        });
        return;
      }
      payload.current_password = formData.current_password;
      payload.new_password = formData.new_password;
      payload.new_password_confirmation = formData.new_password_confirmation;
    }

    const res = await updateProfile(payload);

    if (res.success) {
      setFeedback({
        type: 'success',
        message: lang === 'uz' ? 'Profilingiz muvaffaqiyatli saqlandi!' : 'Профиль успешно сохранен!',
      });
      setFormData((prev) => ({
        ...prev,
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      }));
    } else {
      setFeedback({
        type: 'error',
        message: res.error || (lang === 'uz' ? 'Xatolik yuz berdi.' : 'Произошла ошибка.'),
      });
    }
  };

  const t = {
    uz: {
      title: 'Mening profilim',
      subtitle: 'Shaxsiy ma’lumotlaringiz va buyurtmalar holati',
      adminBadge: 'Administrator',
      userBadge: 'Doimiy Mijoz',
      ordersCount: 'Jami buyurtmalar',
      cartCount: 'Savatdagi mahsulotlar',
      memberSince: 'A’zo bo‘lgan sana',
      tabGeneral: 'Shaxsiy ma’lumotlar',
      tabSecurity: 'Xavfsizlik va Parol',
      nameLabel: 'To‘liq ism',
      phoneLabel: 'Telefon raqam',
      emailLabel: 'Email manzil',
      addressLabel: 'Yetkazib berish manzili',
      currentPasswordLabel: 'Joriy parol (o‘zgartirish uchun)',
      newPasswordLabel: 'Yangi parol',
      confirmNewPasswordLabel: 'Yangi parolni tasdiqlang',
      saveBtn: 'O‘zgarishlarni saqlash',
      saving: 'Saqlanmoqda...',
      adminLinkText: 'Admin Boshqaruv Paneliga o‘tish',
    },
    ru: {
      title: 'Мой профиль',
      subtitle: 'Личные данные и статус ваших заказов',
      adminBadge: 'Администратор',
      userBadge: 'Покупатель',
      ordersCount: 'Всего заказов',
      cartCount: 'Товаров в корзине',
      memberSince: 'Дата регистрации',
      tabGeneral: 'Личные данные',
      tabSecurity: 'Безопасность и Пароль',
      nameLabel: 'Полное имя',
      phoneLabel: 'Номер телефона',
      emailLabel: 'Email адрес',
      addressLabel: 'Адрес доставки',
      currentPasswordLabel: 'Текущий пароль (для смены)',
      newPasswordLabel: 'Новый пароль',
      confirmNewPasswordLabel: 'Подтвердите новый пароль',
      saveBtn: 'Сохранить изменения',
      saving: 'Сохранение...',
      adminLinkText: 'Перейти в Панель управления',
    },
  };

  const currentT = t[lang];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-medical-600 to-teal-500 text-white flex items-center justify-center text-2xl font-bold shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-navy-900">{user?.name}</h1>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    isAdmin
                      ? 'bg-navy-900 text-white border-navy-800'
                      : 'bg-teal-50 text-teal-700 border-teal-200'
                  }`}
                >
                  {isAdmin ? currentT.adminBadge : currentT.userBadge}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  {user?.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {user?.phone}
                </span>
              </p>
            </div>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Shield className="w-4 h-4 text-teal-400" />
              <span>{currentT.adminLinkText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-medical-100 text-medical-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{currentT.ordersCount}</p>
              <p className="text-lg font-bold text-navy-900">{user?.orders_count ?? 0}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{currentT.cartCount}</p>
              <p className="text-lg font-bold text-navy-900">{user?.cart_items_count ?? 0}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{currentT.memberSince}</p>
              <p className="text-sm font-semibold text-navy-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Bugun'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings Form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 bg-gray-50/50">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'general'
                ? 'border-medical-600 text-medical-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-navy-900'
            }`}
          >
            {currentT.tabGeneral}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-medical-600 text-medical-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-navy-900'
            }`}
          >
            {currentT.tabSecurity}
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {feedback.message && (
            <div
              className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-3 animate-slide-up ${
                feedback.type === 'success'
                  ? 'bg-teal-50 border border-teal-200 text-teal-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            {activeTab === 'general' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    {currentT.nameLabel}
                  </label>
                  <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    {currentT.phoneLabel}
                  </label>
                  <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    {currentT.emailLabel}
                  </label>
                  <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    {currentT.addressLabel}
                  </label>
                  <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    {currentT.currentPasswordLabel}
                  </label>
                  <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="current_password"
                      value={formData.current_password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    {currentT.newPasswordLabel}
                  </label>
                  <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    {currentT.confirmNewPasswordLabel}
                  </label>
                  <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="new_password_confirmation"
                      value={formData.new_password_confirmation}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="py-2.5 px-5 rounded-xl text-xs font-semibold text-white bg-medical-600 hover:bg-medical-700 active:bg-medical-800 disabled:opacity-50 transition-all shadow-xs flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{currentT.saveBtn}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

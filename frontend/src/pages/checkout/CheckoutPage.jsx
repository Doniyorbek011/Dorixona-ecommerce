import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Banknote,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Pill,
  ShoppingBag,
  Sparkles,
  Navigation,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCartStore from '../../store/cartStore';
import orderService from '../../services/orderService';
import LocationPickerModal from '../../components/common/LocationPickerModal';

export default function CheckoutPage({ lang = 'uz' }) {
  const { user } = useAuth();
  const { items, subtotal, deliveryPrice, isFreeDelivery, total, fetchCart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    latitude: null,
    longitude: null,
    note: '',
    payment_method: 'cash',
  });

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customer_name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);

    if (!formData.customer_name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError(
        lang === 'uz'
          ? 'Iltimos, ism, telefon va yetkazib berish manzilini to‘ldiring.'
          : 'Пожалуйста, заполните имя, телефон и адрес доставки.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: formData.customer_name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        latitude: formData.latitude ?? null,
        longitude: formData.longitude ?? null,
        note: formData.note.trim() || null,
        payment_method: formData.payment_method,
        idempotency_key: `order_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      };

      // For guest checkout: attach items from local cart
      if (!user) {
        payload.items = items.map((i) => ({
          product_id: i.product_id || i.id,
          quantity: i.quantity,
        }));
      }

      const res = await orderService.createOrder(payload);

      // Clear/refresh cart
      if (!user) {
        clearCart();
      } else {
        fetchCart();
      }

      const redirectUrl = res.payment?.redirect_url || res.redirect_url;
      const requiresRedirect = res.payment?.requires_redirect ?? res.requires_redirect;

      if (requiresRedirect && redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      setOrderSuccess(res.order);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (lang === 'uz'
            ? 'Buyurtma yaratishda xatolik yuz berdi. Qaytadan urinib ko‘ring.'
            : 'Ошибка оформления заказа. Попробуйте еще раз.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };



  const formatPrice = (val) => {
    return Number(val || 0).toLocaleString('uz-UZ') + " so'm";
  };

  const t = {
    uz: {
      title: 'Buyurtmani rasmiylashtirish',
      subtitle: 'Yetkazib berish ma’lumotlarini va to‘lov usulini tasdiqlang',
      customerInfo: 'Mijoz va Yetkazib berish ma’lumotlari',
      nameLabel: 'Qabul qiluvchining to‘liq ismi',
      namePlaceholder: 'Doniyor Rustamov',
      phoneLabel: 'Bog‘lanish telefoni',
      phonePlaceholder: '+998901234567',
      addressLabel: 'To‘liq yetkazib berish manzili',
      addressPlaceholder: 'Toshkent sh., Yunusobod tumani, 4-mavze, 12-uy, 45-xonadon',
      noteLabel: 'Kuryer uchun eslatma (ixtiyoriy)',
      notePlaceholder: 'Masalan: Domofon kodi 1234, chaqaloq uxlab yotibdi, yetib kelgach telefon qiling...',
      paymentTitle: 'To‘lov usulini tanlang',
      cashPay: 'Naqd pul (Kuryerga qabul qilganda to‘lash)',
      cashDesc: 'Mahsulotni qo‘lingizga olganingizdan so‘ng naqd pulda to‘laysiz',
      paymePay: 'Payme orqali to‘lov',
      paymeDesc: 'Payme ilovasi yoki kartangiz orqali xavfsiz onlayn to‘lov',
      clickPay: 'Click orqali to‘lov',
      clickDesc: 'Click Up ilovasi yoki Click tizimi orqali tezkor onlayn to‘lov',
      uzumPay: 'Uzum Bank orqali to‘lov',
      uzumDesc: 'Uzum Bank ilovasi yoki Uzum to‘lov tizimi orqali onlayn to‘lov',
      mainBadge: 'Kuryerga',
      onlineBadge: 'Onlayn',
      orderSummary: 'Buyurtma tarkibi',
      subtotal: 'Mahsulotlar summasi:',
      delivery: 'Yetkazib berish:',
      freeDelivery: 'Bepul',
      totalToPay: 'Jami to‘lov:',
      submitOrder: 'Buyurtmani tasdiqlash',
      submitting: 'Rasmiylashtirilmoqda...',
      successTitle: 'Buyurtmangiz muvaffaqiyatli qabul qilindi!',
      successSubtitle: 'Farmatsevtlarimiz buyurtmangizni yig‘ishni boshladi.',
      orderIdLabel: 'Buyurtma raqami:',
      deliveryEstimate: 'Yetkazib berish muddati: 2 soat ichida',
      viewOrdersBtn: 'Buyurtmalar tarixiga o‘tish',
      registerToTrack: 'Hisob ochish va buyurtmani kuzatish',
      backToHomeBtn: 'Bosh sahifaga qaytish',
      emptyCartError: 'Savatingizda mahsulotlar mavjud emas.',
      goToCatalog: 'Katalogga o‘tish',
      feat1: '100% Sertifikatlangan dorilar',
      feat2: 'Tezkor kuryer xizmati',
      guestBannerTitle: 'Ro‘yxatdan o‘tish shart emas',
      guestBannerText: 'Buyurtma berish uchun ro‘yxatdan o‘tish shart emas. Hisob ochsangiz, buyurtmalar tarixingizni kuzatib borishingiz mumkin bo‘ladi.',
      guestBannerRegister: 'Ro‘yxatdan o‘tish',
      pickOnMapBtn: 'Xaritadan belgilash',
      mapLocationPicked: 'Manzil xaritada belgilandi',
    },
    ru: {
      title: 'Оформление заказа',
      subtitle: 'Подтвердите адрес доставки и способ оплаты',
      customerInfo: 'Данные получателя и доставки',
      nameLabel: 'ФИО получателя',
      namePlaceholder: 'Данияр Рустамов',
      phoneLabel: 'Контактный телефон',
      phonePlaceholder: '+998901234567',
      addressLabel: 'Полный адрес доставки',
      addressPlaceholder: 'г. Ташкент, Юнусабадский район, 4-квартал, д. 12, кв. 45',
      noteLabel: 'Примечание для курьера (необязательно)',
      notePlaceholder: 'Например: код домофона 1234, позвоните по прибытии...',
      paymentTitle: 'Способ оплаты',
      cashPay: 'Наличными при получении (Курьеру)',
      cashDesc: 'Оплата наличными после проверки заказа курьеру',
      paymePay: 'Оплата через Payme',
      paymeDesc: 'Безопасная онлайн-оплата через приложение или карту Payme',
      clickPay: 'Оплата через Click',
      clickDesc: 'Быстрая оплата через Click Up или онлайн-систему Click',
      uzumPay: 'Оплата через Uzum Bank',
      uzumDesc: 'Оплата через мобильное приложение Uzum Bank',
      mainBadge: 'Курьеру',
      onlineBadge: 'Онлайн',
      orderSummary: 'Ваш заказ',
      subtotal: 'Стоимость товаров:',
      delivery: 'Доставка:',
      freeDelivery: 'Бесплатно',
      totalToPay: 'Итого к оплате:',
      submitOrder: 'Подтвердить заказ',
      submitting: 'Оформление...',
      successTitle: 'Ваш заказ успешно оформлен!',
      successSubtitle: 'Наши фармацевты уже приступили к сборке заказа.',
      orderIdLabel: 'Номер заказа:',
      deliveryEstimate: 'Срок доставки: в течение 2 часов',
      viewOrdersBtn: 'Перейти к истории заказов',
      registerToTrack: 'Создать аккаунт для отслеживания',
      backToHomeBtn: 'На главную',
      emptyCartError: 'Ваша корзина пуста.',
      goToCatalog: 'В каталог',
      feat1: '100% Сертифицированные препараты',
      feat2: 'Быстрая доставка курьером',
      guestBannerTitle: 'Регистрация не требуется',
      guestBannerText: 'Для оформления заказа регистрация не требуется. Создав аккаунт, вы сможете отслеживать историю заказов.',
      guestBannerRegister: 'Зарегистрироваться',
      pickOnMapBtn: 'Указать на карте',
      mapLocationPicked: 'Адрес указан на карте',
    },

  };

  const currentT = t[lang];

  // Success Screen
  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-xs text-center animate-slide-up">
          <div className="w-20 h-20 rounded-3xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-black tracking-widest text-teal-600 uppercase">
            Muvaffaqiyatli
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1 mb-2">
            {currentT.successTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-8">
            {currentT.successSubtitle}
          </p>

          {/* Order Details Card */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-left max-w-lg mx-auto space-y-3 mb-8">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-gray-200">
              <span className="text-gray-500">{currentT.orderIdLabel}</span>
              <span className="font-mono font-bold text-navy-900 text-sm">
                #{orderSuccess.id}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pb-3 border-b border-gray-200">
              <span className="text-gray-500">Holati:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                {orderSuccess.status}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pb-3 border-b border-gray-200">
              <span className="text-gray-500">Yetkazish manzili:</span>
              <span className="font-semibold text-navy-900 text-right max-w-xs truncate">
                {orderSuccess.address}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pb-3 border-b border-gray-200">
              <span className="text-gray-500">To‘lov summasi:</span>
              <span className="font-bold text-navy-900 text-sm">
                {formatPrice(orderSuccess.total)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 pt-1">
              <Truck className="w-4 h-4 text-teal-600" />
              <span>{currentT.deliveryEstimate}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <Link
                to="/profile"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{currentT.viewOrdersBtn}</span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{currentT.registerToTrack}</span>
              </Link>
            )}

            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-navy-900 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentT.backToHomeBtn}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty on checkout page
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-4">
            <Pill className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-navy-900 mb-2">
            {currentT.emptyCartError}
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-semibold mt-4 shadow-xs"
          >
            <span>{currentT.goToCatalog}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          {currentT.title}
        </h1>
        <p className="text-xs text-gray-500 mt-1">{currentT.subtitle}</p>
      </div>

      {/* Guest checkout informative note */}
      {!user && (
        <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-up">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-navy-900">{currentT.guestBannerTitle}</h4>
              <p className="text-xs text-gray-600 mt-0.5">{currentT.guestBannerText}</p>
            </div>
          </div>
          <Link
            to="/register"
            state={{ from: { pathname: '/checkout' } }}
            className="shrink-0 px-3.5 py-2 rounded-xl bg-white border border-teal-200 text-teal-700 hover:bg-teal-600 hover:text-white transition-colors text-xs font-semibold shadow-2xs"
          >
            {currentT.guestBannerRegister}
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-3 animate-slide-up">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}


      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Delivery Form & Payment Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Address Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2 mb-5">
              <MapPin className="w-4 h-4 text-medical-600" />
              <span>{currentT.customerInfo}</span>
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    {currentT.nameLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder={currentT.namePlaceholder}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-transparent border-0 focus:outline-none text-navy-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    {currentT.phoneLabel} <span className="text-red-500">*</span>
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
                      placeholder={currentT.phonePlaceholder}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-transparent border-0 focus:outline-none text-navy-900"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <label className="block text-xs font-semibold text-navy-900">
                    {currentT.addressLabel} <span className="text-red-500">*</span>
                  </label>

                  <div className="flex items-center gap-2">
                    {formData.latitude && formData.longitude && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full animate-fade-in">
                        📍 {currentT.mapLocationPicked}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowLocationPicker(true)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 border border-teal-200 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-teal-600" />
                      <span>{currentT.pickOnMapBtn}</span>
                    </button>
                  </div>
                </div>

                <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={currentT.addressPlaceholder}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-transparent border-0 focus:outline-none text-navy-900"
                    required
                  />
                </div>
              </div>


              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  {currentT.noteLabel}
                </label>
                <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500">
                  <div className="absolute top-3 left-3.5 pointer-events-none text-gray-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <textarea
                    rows={2}
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder={currentT.notePlaceholder}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-transparent border-0 focus:outline-none text-navy-900 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2 mb-5">
              <CreditCard className="w-4 h-4 text-medical-600" />
              <span>{currentT.paymentTitle}</span>
            </h2>

            <div className="space-y-3">
              {/* Option 1: Cash */}
              <label
                className={`relative flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.payment_method === 'cash'
                    ? 'border-medical-600 bg-medical-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="cash"
                  checked={formData.payment_method === 'cash'}
                  onChange={handleChange}
                  className="w-4 h-4 text-medical-600 focus:ring-medical-500 mt-1 border-gray-300"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-navy-900">{currentT.cashPay}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 ml-auto sm:ml-0">
                      {currentT.mainBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">{currentT.cashDesc}</p>
                </div>
              </label>

              {/* Option 2: Payme */}
              <label
                className={`relative flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.payment_method === 'payme'
                    ? 'border-teal-500 bg-teal-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="payme"
                  checked={formData.payment_method === 'payme'}
                  onChange={handleChange}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500 mt-1 border-gray-300"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-[11px] tracking-tighter">
                      P
                    </div>
                    <p className="text-xs font-bold text-navy-900">{currentT.paymePay}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 ml-auto sm:ml-0">
                      {currentT.onlineBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">{currentT.paymeDesc}</p>
                </div>
              </label>

              {/* Option 3: Click */}
              <label
                className={`relative flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.payment_method === 'click'
                    ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="click"
                  checked={formData.payment_method === 'click'}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-1 border-gray-300"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-[11px] tracking-tighter">
                      C
                    </div>
                    <p className="text-xs font-bold text-navy-900">{currentT.clickPay}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 ml-auto sm:ml-0">
                      {currentT.onlineBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">{currentT.clickDesc}</p>
                </div>
              </label>

              {/* Option 4: Uzum Bank */}
              <label
                className={`relative flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.payment_method === 'uzum'
                    ? 'border-purple-500 bg-purple-50/40 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="uzum"
                  checked={formData.payment_method === 'uzum'}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 mt-1 border-gray-300"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-[11px] tracking-tighter">
                      U
                    </div>
                    <p className="text-xs font-bold text-navy-900">{currentT.uzumPay}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 ml-auto sm:ml-0">
                      {currentT.onlineBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">{currentT.uzumDesc}</p>
                </div>
              </label>
            </div>
          </div>
        </div>


        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs sticky top-20 space-y-6">
            <h2 className="text-base font-bold text-navy-900">
              {currentT.orderSummary}
            </h2>

            {/* Compact Items List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id || item.product_id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 p-1.5 shrink-0 flex items-center justify-center">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&auto=format&fit=crop&q=80'
                      }
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-navy-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {item.quantity} × {formatPrice(item.unit_price)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-navy-900">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>{currentT.subtotal}</span>
                <span className="font-semibold text-navy-900">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>{currentT.delivery}</span>
                <span className="font-semibold text-navy-900">
                  {isFreeDelivery ? currentT.freeDelivery : formatPrice(deliveryPrice)}
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="pt-4 border-t border-gray-100 flex items-baseline justify-between">
              <span className="text-xs font-bold text-gray-600">{currentT.totalToPay}</span>
              <span className="text-xl font-black text-navy-900">
                {formatPrice(total)}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-2xl bg-medical-600 hover:bg-medical-700 active:bg-medical-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{currentT.submitting}</span>
                </>
              ) : (
                <>
                  <span>{currentT.submitOrder}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Assurances */}
            <div className="pt-2 space-y-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{currentT.feat1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-medical-600 shrink-0" />
                <span>{currentT.feat2}</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Interactive Leaflet Location Picker Modal */}
      <LocationPickerModal
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        initialLat={formData.latitude || 41.299496}
        initialLng={formData.longitude || 69.240073}
        initialAddress={formData.address}
        lang={lang}
        onConfirm={({ address, latitude, longitude }) => {
          setFormData((prev) => ({
            ...prev,
            address: address || prev.address,
            latitude,
            longitude,
          }));
        }}
      />
    </div>
  );
}


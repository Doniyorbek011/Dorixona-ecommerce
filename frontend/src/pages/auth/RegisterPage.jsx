import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Pill,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  MapPin,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function RegisterPage({ lang = 'uz' }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    if (formData.password !== formData.password_confirmation) {
      setFormError(
        lang === 'uz'
          ? 'Parol va uning tasdig‘i mos kelmadi.'
          : 'Пароли не совпадают.'
      );
      return;
    }

    const res = await register(formData);

    if (res.success) {
      navigate('/profile', { replace: true });
    } else {
      setFormError(res.error);
      if (res.errors) {
        setFieldErrors(res.errors);
      }
    }
  };

  const t = {
    uz: {
      title: 'Ro‘yxatdan o‘tish',
      subtitle: 'Apteka platformasida yangi mijoz hisobini yarating',
      nameLabel: 'To‘liq ismingiz',
      namePlaceholder: 'Doniyor Rustamov',
      phoneLabel: 'Telefon raqamingiz',
      phonePlaceholder: '+998901234567',
      emailLabel: 'Email manzili',
      emailPlaceholder: 'misol@apteka.uz',
      addressLabel: 'Yetkazib berish manzili (ixtiyoriy)',
      addressPlaceholder: 'Toshkent sh., Yunusobod tumani...',
      passwordLabel: 'Parol',
      passwordPlaceholder: 'Kamida 6 ta belgi',
      confirmPasswordLabel: 'Parolni tasdiqlang',
      confirmPasswordPlaceholder: 'Parolni qayta kiriting',
      submit: 'Hisob yaratish',
      submitting: 'Yaratilmoqda...',
      hasAccount: 'Hisobingiz bormi?',
      loginNow: 'Tizimga kiring',
    },
    ru: {
      title: 'Регистрация',
      subtitle: 'Создайте аккаунт покупателя на платформе Apteka',
      nameLabel: 'Полное имя',
      namePlaceholder: 'Данияр Рустамов',
      phoneLabel: 'Номер телефона',
      phonePlaceholder: '+998901234567',
      emailLabel: 'Email адрес',
      emailPlaceholder: 'example@apteka.uz',
      addressLabel: 'Адрес доставки (необязательно)',
      addressPlaceholder: 'г. Ташкент, Юнусабадский район...',
      passwordLabel: 'Пароль',
      passwordPlaceholder: 'Минимум 6 символов',
      confirmPasswordLabel: 'Подтвердите пароль',
      confirmPasswordPlaceholder: 'Повторите пароль',
      submit: 'Создать аккаунт',
      submitting: 'Создание...',
      hasAccount: 'Уже есть аккаунт?',
      loginNow: 'Войти',
    },
  };

  const currentT = t[lang];

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-medical-600 to-teal-500 items-center justify-center text-white shadow-sm mb-3">
            <Pill className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            {currentT.title}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-600">
            {currentT.subtitle}
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 sm:px-10 rounded-2xl border border-gray-200 shadow-xs">
          {formError && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 animate-slide-up">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
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
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={currentT.namePlaceholder}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900 placeholder:text-gray-400"
                  required
                />
              </div>
              {fieldErrors.name && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.name[0]}</p>
              )}
            </div>

            {/* Phone & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900 placeholder:text-gray-400"
                    required
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.phone[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  {currentT.emailLabel} <span className="text-red-500">*</span>
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
                    placeholder={currentT.emailPlaceholder}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900 placeholder:text-gray-400"
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.email[0]}</p>
                )}
              </div>
            </div>

            {/* Address */}
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
                  placeholder={currentT.addressPlaceholder}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  {currentT.passwordLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={currentT.passwordPlaceholder}
                    className="w-full pl-10 pr-9 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900 placeholder:text-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.password[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  {currentT.confirmPasswordLabel} <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder={currentT.confirmPasswordPlaceholder}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-medical-600 hover:bg-medical-700 active:bg-medical-800 disabled:opacity-50 transition-all shadow-xs flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{currentT.submitting}</span>
                </>
              ) : (
                <>
                  <span>{currentT.submit}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-600">
            <span>{currentT.hasAccount} </span>
            <Link
              to="/login"
              className="font-semibold text-medical-600 hover:text-medical-700 transition-colors"
            >
              {currentT.loginNow}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

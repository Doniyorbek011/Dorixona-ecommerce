import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Pill, Lock, Mail, Key, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import authService from '../../services/authService';

export default function ResetPasswordPage({ lang = 'uz' }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    token: location.state?.token || '',
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password_confirmation) {
      setError(lang === 'uz' ? 'Parol va uning tasdig‘i mos kelmadi.' : 'Пароли не совпадают.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(formData);
      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (lang === 'uz' ? 'Parolni yangilashda xatolik yuz berdi.' : 'Ошибка сброса пароля.')
      );
      setIsLoading(false);
    }
  };

  const t = {
    uz: {
      title: 'Yangi parol o‘rnatish',
      subtitle: 'Emailingizga kelgan kod va yangi parolni kiriting',
      emailLabel: 'Email manzili',
      tokenLabel: 'Tiklash kodi / Token',
      passwordLabel: 'Yangi parol',
      confirmPasswordLabel: 'Yangi parolni tasdiqlang',
      submit: 'Parolni yangilash',
      submitting: 'Saqlanmoqda...',
      successTitle: 'Parol muvaffaqiyatli o‘zgartirildi!',
      successSubtitle: 'Endi yangi parolingiz bilan tizimga kirishingiz mumkin.',
      goToLogin: 'Kirish sahifasiga o‘tish',
    },
    ru: {
      title: 'Установка нового пароля',
      subtitle: 'Введите полученный код сброса и новый пароль',
      emailLabel: 'Email адрес',
      tokenLabel: 'Код сброса / Токен',
      passwordLabel: 'Новый пароль',
      confirmPasswordLabel: 'Подтвердите новый пароль',
      submit: 'Обновить пароль',
      submitting: 'Сохранение...',
      successTitle: 'Пароль успешно изменен!',
      successSubtitle: 'Теперь вы можете войти в систему с новым паролем.',
      goToLogin: 'Перейти ко входу',
    },
  };

  const currentT = t[lang];

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
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
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-4 text-center animate-slide-up">
              <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-900">
                {currentT.successTitle}
              </h3>
              <p className="text-xs text-gray-600">
                {currentT.successSubtitle}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-medical-600 hover:bg-medical-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>{currentT.goToLogin}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  {currentT.tokenLabel}
                </label>
                <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="token"
                    value={formData.token}
                    onChange={handleChange}
                    placeholder="Reset token"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  {currentT.passwordLabel}
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
                    className="w-full pl-10 pr-9 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900"
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                  {currentT.confirmPasswordLabel}
                </label>
                <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-medical-600 hover:bg-medical-700 active:bg-medical-800 disabled:opacity-50 transition-all shadow-xs flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{currentT.submit}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="text-xs font-medium text-gray-600 hover:text-navy-900 transition-colors"
                >
                  Kirish sahifasiga qaytish
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

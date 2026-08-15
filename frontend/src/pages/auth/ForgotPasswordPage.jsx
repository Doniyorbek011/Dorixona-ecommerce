import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import authService from '../../services/authService';

export default function ForgotPasswordPage({ lang = 'uz' }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await authService.forgotPassword({ email });
      setSuccessData(data);
      setIsLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (lang === 'uz'
            ? 'Xatolik yuz berdi. Email manzilini tekshiring.'
            : 'Произошла ошибка. Проверьте email.')
      );
      setIsLoading(false);
    }
  };

  const t = {
    uz: {
      title: 'Parolni tiklash',
      subtitle: 'Email manzilingizni kiriting, biz tiklash kodini yuboramiz',
      emailLabel: 'Email manzili',
      submit: 'Tiklash kodini olish',
      backToLogin: 'Kirish sahifasiga qaytish',
      successTitle: 'Tiklash kodi yuborildi!',
      proceedBtn: 'Parolni o‘zgartirishga o‘tish',
      devNotice: 'Dasturlash rejimi uchun tiklash kodi (Token):',
    },
    ru: {
      title: 'Восстановление пароля',
      subtitle: 'Введите ваш email, и мы вышлем код для сброса пароля',
      emailLabel: 'Email адрес',
      submit: 'Получить код',
      backToLogin: 'Вернуться ко входу',
      successTitle: 'Код для сброса отправлен!',
      proceedBtn: 'Перейти к смене пароля',
      devNotice: 'Код для сброса (Режим разработки):',
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

          {successData ? (
            <div className="space-y-4 text-center animate-slide-up">
              <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-900">
                {currentT.successTitle}
              </h3>
              <p className="text-xs text-gray-600">
                {successData.message}
              </p>

              {successData.dev_reset_token && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-left">
                  <p className="text-[11px] font-semibold text-gray-600 mb-1">
                    {currentT.devNotice}
                  </p>
                  <code className="text-xs font-mono text-medical-700 break-all select-all">
                    {successData.dev_reset_token}
                  </code>
                </div>
              )}

              <button
                onClick={() =>
                  navigate('/reset-password', {
                    state: {
                      email: successData.dev_email || email,
                      token: successData.dev_reset_token || '',
                    },
                  })
                }
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-medical-600 hover:bg-medical-700 transition-colors flex items-center justify-center gap-2"
              >
                <span>{currentT.proceedBtn}</span>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@apteka.uz"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-medical-600 hover:bg-medical-700 active:bg-medical-800 disabled:opacity-50 transition-all shadow-xs flex items-center justify-center gap-2"
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
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-navy-900 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {currentT.backToLogin}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

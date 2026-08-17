import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Pill,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function LoginPage({ lang = 'uz' }) {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!loginInput.trim() || !password.trim()) {
      setFormError(
        lang === 'uz'
          ? 'Iltimos, barcha maydonlarni to‘ldiring.'
          : 'Пожалуйста, заполните все поля.'
      );
      return;
    }

    const res = await login({ login: loginInput, password });

    if (res.success) {
      const from = location.state?.from?.pathname || (res.user.role === 'admin' ? '/admin' : '/profile');
      navigate(from, { replace: true });
    } else {
      setFormError(res.error);
    }
  };

  const t = {
    uz: {
      title: 'Tizimga kirish',
      subtitle: 'Apteka platformasidagi shaxsiy hisobingizga kiring',
      loginLabel: 'Email yoki Telefon raqam',
      loginPlaceholder: 'user@apteka.uz yoki +998901234567',
      passwordLabel: 'Parol',
      passwordPlaceholder: 'Parolingizni kiriting',
      forgotPassword: 'Parolni unutdingizmi?',
      submit: 'Tizimga kirish',
      submitting: 'Tekshirilmoqda...',
      noAccount: 'Hisobingiz yo‘qmi?',
      registerNow: 'Ro‘yxatdan o‘ting',
    },
    ru: {
      title: 'Вход в аккаунт',
      subtitle: 'Войдите в личный кабинет платформы Apteka',
      loginLabel: 'Email или номер телефона',
      loginPlaceholder: 'user@apteka.uz или +998901234567',
      passwordLabel: 'Пароль',
      passwordPlaceholder: 'Введите пароль',
      forgotPassword: 'Забыли пароль?',
      submit: 'Войти',
      submitting: 'Проверка...',
      noAccount: 'Нет аккаунта?',
      registerNow: 'Зарегистрироваться',
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
          {formError && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 animate-slide-up">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                {currentT.loginLabel}
              </label>
              <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500 transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder={currentT.loginPlaceholder}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900 placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-navy-900">
                  {currentT.passwordLabel}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-medium text-medical-600 hover:text-medical-700 transition-colors"
                >
                  {currentT.forgotPassword}
                </Link>
              </div>
              <div className="relative rounded-xl border border-gray-200 focus-within:border-medical-500 focus-within:ring-1 focus-within:ring-medical-500 transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={currentT.passwordPlaceholder}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-transparent border-0 focus:outline-none text-navy-900 placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-medical-600 hover:bg-medical-700 active:bg-medical-800 disabled:opacity-50 transition-all shadow-xs flex items-center justify-center gap-2"
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
            <span>{currentT.noAccount} </span>
            <Link
              to="/register"
              className="font-semibold text-medical-600 hover:text-medical-700 transition-colors"
            >
              {currentT.registerNow}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


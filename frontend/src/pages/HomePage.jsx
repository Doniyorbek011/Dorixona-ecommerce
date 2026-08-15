import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  ShieldCheck,
  Truck,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  User,
  Shield,
  Activity,
  Layers,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { checkHealth } from '../services/api';

export default function HomePage({ lang = 'uz' }) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [apiStatus, setApiStatus] = useState({ state: 'checking', data: null });

  useEffect(() => {
    checkHealth()
      .then((data) => setApiStatus({ state: 'online', data }))
      .catch((err) => setApiStatus({ state: 'error', data: err }));
  }, []);

  const t = {
    uz: {
      badge: 'Sog‘lig‘ingiz uchun ishonchli onlayn dorixona',
      heroTitle: 'Barcha kerakli dori vositalari bir joyda',
      heroSubtitle:
        'Sertifikatlangan dori vositalari, vitaminlar va tibbiy texnikalarni uyingizga tez va xavfsiz yetkazib beramiz.',
      loginBtn: 'Tizimga kirish',
      registerBtn: 'Ro‘yxatdan o‘tish',
      profileBtn: 'Mening profilim',
      adminBtn: 'Admin Paneli',
      feat1Title: '100% Sertifikatlangan',
      feat1Desc: 'Barcha mahsulotlar kafolatlangan va litsenziyalangan',
      feat2Title: 'Tezkor yetkazib berish',
      feat2Desc: 'Toshkent bo‘ylab 2 soat ichida eshigingizgacha',
      feat3Title: '24/7 Farmatsevt yordami',
      feat3Desc: 'Malakali mutaxassislardan bepul onlayn maslahat',
      authStatusTitle: 'Foydalanuvchi Seansi:',
      loggedInAs: 'Tizimga kirilgan hisob:',
      roleLabel: 'Rol:',
    },
    ru: {
      badge: 'Надежная интернет-аптека для вашего здоровья',
      heroTitle: 'Все необходимые лекарства в одном месте',
      heroSubtitle:
        'Сертифицированные лекарства, витамины и медицинская техника с быстрой доставкой на дом.',
      loginBtn: 'Войти',
      registerBtn: 'Регистрация',
      profileBtn: 'Мой профиль',
      adminBtn: 'Панель администратора',
      feat1Title: '100% Сертифицировано',
      feat1Desc: 'Все товары сертифицированы и проверены',
      feat2Title: 'Быстрая доставка',
      feat2Desc: 'По Ташкенту в течение 2 часов до двери',
      feat3Title: 'Поддержка 24/7',
      feat3Desc: 'Бесплатная консультация квалифицированных фармацевтов',
      authStatusTitle: 'Сеанс пользователя:',
      loggedInAs: 'Вы вошли как:',
      roleLabel: 'Роль:',
    },
  };

  const currentT = t[lang];

  return (
    <div className="space-y-12 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-medical-900 text-white p-8 sm:p-14 shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-teal-300 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentT.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            {currentT.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 mb-8 max-w-2xl leading-relaxed">
            {currentT.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="px-6 py-3 rounded-xl bg-medical-600 hover:bg-medical-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>{currentT.profileBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-teal-300 border border-teal-500/30 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-teal-400" />
                    <span>{currentT.adminBtn}</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl bg-medical-600 hover:bg-medical-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{currentT.loginBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm transition-all"
                >
                  {currentT.registerBtn}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-teal-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Auth Status & API Health Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-medical-50 border border-medical-200 text-medical-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">API Status:</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    apiStatus.state === 'online' ? 'bg-teal-500 animate-pulse' : 'bg-red-500'
                  }`}
                />
                <span className="text-xs font-bold text-navy-900">
                  {apiStatus.state === 'online' ? 'Laravel Sanctum API Online (200 OK)' : 'Checking API...'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 px-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
            <span className="text-gray-500">{currentT.authStatusTitle}</span>
            {isAuthenticated ? (
              <span className="font-bold text-teal-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                {user?.name} ({user?.role})
              </span>
            ) : (
              <span className="font-medium text-gray-600">Mehmon (Kirilmagan)</span>
            )}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-medical-200 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-navy-900 mb-1">{currentT.feat1Title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed">{currentT.feat1Desc}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-medical-200 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center mb-4">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-navy-900 mb-1">{currentT.feat2Title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed">{currentT.feat2Desc}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-medical-200 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center mb-4">
            <Headphones className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-navy-900 mb-1">{currentT.feat3Title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed">{currentT.feat3Desc}</p>
        </div>
      </div>
    </div>
  );
}

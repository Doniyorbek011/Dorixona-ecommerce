import React, { useEffect, useState } from 'react';
import { checkHealth } from './services/api';
import {
  Activity,
  ShieldCheck,
  Globe,
  Database,
  CheckCircle2,
  AlertCircle,
  Pill,
  Server,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('uz');
  const [apiStatus, setApiStatus] = useState({
    loading: true,
    connected: false,
    data: null,
    error: null,
  });

  const checkConnection = async () => {
    setApiStatus((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await checkHealth();
      setApiStatus({
        loading: false,
        connected: true,
        data,
        error: null,
      });
    } catch (err) {
      setApiStatus({
        loading: false,
        connected: false,
        data: null,
        error: err.message || 'Failed to connect to backend',
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const t = {
    uz: {
      title: 'Apteka E-Commerce Platformasi',
      subtitle: 'Zamonaviy onlayn dorixona va tibbiy mahsulotlar tizimi',
      phase1: '1-Bosqich: Loyiha Sozlamalari Muvaffaqiyatli Bajarildi',
      backendStatus: 'Backend API Holati',
      checking: 'Tekshirilmoqda...',
      connected: 'Ulandi va Ishlamoqda',
      disconnected: 'Ulanishda xatolik',
      retry: 'Qayta tekshirish',
      stackTitle: 'Texnologiyalar Steki',
      features: [
        { title: 'React + Vite', desc: 'Tezkor frontend arxitekturasi va zamonaviy komponentlar' },
        { title: 'Tailwind CSS', desc: 'Tibbiy ranglar palitrasi (to‘q ko‘k, tibbiy ko‘k, feruza)' },
        { title: 'Laravel + Sanctum', desc: 'Xavfsiz RESTful API va autentifikatsiya' },
        { title: 'MySQL & Ko‘p tillilik', desc: 'O‘zbekcha va Ruscha to‘liq qo‘llab-quvvatlash' },
      ],
    },
    ru: {
      title: 'Платформа E-Commerce «Apteka»',
      subtitle: 'Современная система онлайн-аптеки и медицинских товаров',
      phase1: 'Фаза 1: Настройка проекта успешно завершена',
      backendStatus: 'Статус Backend API',
      checking: 'Проверка...',
      connected: 'Подключено и работает',
      disconnected: 'Ошибка подключения',
      retry: 'Повторить',
      stackTitle: 'Стек технологий',
      features: [
        { title: 'React + Vite', desc: 'Быстрая архитектура фронтенда и современные компоненты' },
        { title: 'Tailwind CSS', desc: 'Медицинская палитра (тёмно-синий, медицинский синий, бирюзовый)' },
        { title: 'Laravel + Sanctum', desc: 'Безопасный RESTful API и аутентификация' },
        { title: 'MySQL и Мультиязычность', desc: 'Полная поддержка узбекского и русского языков' },
      ],
    },
  };

  const currentT = t[lang];

  return (
    <div className="min-h-screen bg-gray-50 text-navy-900 flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-medical-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-navy-900">APTEKA</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-medical-50 text-medical-700 border border-medical-200">
                Setup Phase 1
              </span>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setLang('uz')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                lang === 'uz'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-gray-600 hover:text-navy-900'
              }`}
            >
              O'zbekcha
            </button>
            <button
              onClick={() => setLang('ru')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                lang === 'ru'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-gray-600 hover:text-navy-900'
              }`}
            >
              Русский
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium mb-4">
            <Activity className="w-4 h-4 text-teal-600" />
            {currentT.phase1}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight mb-4">
            {currentT.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            {currentT.subtitle}
          </p>
        </div>

        {/* API Health & Status Card */}
        <div className="max-w-2xl mx-auto w-full bg-white rounded-2xl border border-gray-200 shadow-xs p-6 mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-medical-600" />
              <h2 className="text-base font-semibold text-navy-900">{currentT.backendStatus}</h2>
            </div>
            <button
              onClick={checkConnection}
              className="text-xs font-medium text-medical-600 hover:text-medical-700 transition-colors"
            >
              {currentT.retry}
            </button>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {apiStatus.loading ? (
                <div className="w-3 h-3 rounded-full bg-gray-400 animate-ping" />
              ) : apiStatus.connected ? (
                <div className="w-3 h-3 rounded-full bg-teal-500 shadow-xs" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-red-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {apiStatus.loading
                  ? currentT.checking
                  : apiStatus.connected
                  ? currentT.connected
                  : currentT.disconnected}
              </span>
            </div>

            {apiStatus.data && (
              <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">
                v{apiStatus.data.version}
              </span>
            )}
          </div>

          {apiStatus.error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{apiStatus.error} (Ensure `php artisan serve` is active on port 8000)</span>
            </div>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto w-full">
          {currentT.features.map((f, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-medical-50 border border-medical-100 flex items-center justify-center text-medical-600 mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-navy-900 mb-1">{f.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <span>&copy; {new Date().getFullYear()} Apteka Platform. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Laravel Sanctum Auth Ready
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-medical-600" />
              UZ / RU Localization Ready
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

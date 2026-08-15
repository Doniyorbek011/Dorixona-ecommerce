import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function UnauthorizedPage({ lang = 'uz' }) {
  const { user, logout } = useAuth();

  const t = {
    uz: {
      code: '403',
      title: 'Kirish taqiqlangan (Ruxsat yo‘q)',
      subtitle:
        'Siz ushbu bo‘limga kirish uchun yetarli administrator huquqlariga ega emassiz.',
      currentRole: 'Sizning hozirgi rolingiz:',
      homeBtn: 'Bosh sahifaga qaytish',
      switchAdminBtn: 'Administrator sifatida qayta kirish',
    },
    ru: {
      code: '403',
      title: 'Доступ запрещен',
      subtitle:
        'У вас недостаточно прав администратора для просмотра этой страницы.',
      currentRole: 'Ваша текущая роль:',
      homeBtn: 'На главную',
      switchAdminBtn: 'Войти под администратором',
    },
  };

  const currentT = t[lang];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="text-xs font-black tracking-widest text-amber-600 uppercase">
          Xatolik {currentT.code}
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-navy-900 mt-1 mb-2">
          {currentT.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mb-6">
          {currentT.subtitle}
        </p>

        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs mb-6 inline-block">
          <span className="text-gray-500">{currentT.currentRole} </span>
          <span className="font-bold text-navy-900 uppercase">
            {user?.role || 'Mehmon'}
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            to="/"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentT.homeBtn}</span>
          </Link>
          <button
            onClick={async () => {
              await logout();
              window.location.href = '/login';
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{currentT.switchAdminBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

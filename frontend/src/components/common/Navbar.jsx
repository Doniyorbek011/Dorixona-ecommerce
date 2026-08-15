import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Pill,
  User as UserIcon,
  LogOut,
  Shield,
  ShoppingBag,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X,
  Grid,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import SearchAutocomplete from './SearchAutocomplete';

export default function Navbar({ lang, setLang }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  const t = {
    uz: {
      home: 'Bosh sahifa',
      catalog: 'Katalog',
      orders: 'Buyurtmalarim',
      profile: 'Mening profilim',
      adminPanel: 'Admin Boshqaruvi',
      login: 'Kirish',
      register: 'Ro‘yxatdan o‘tish',
      logout: 'Chiqish',
      adminRole: 'Administrator',
      userRole: 'Mijoz',
    },
    ru: {
      home: 'Главная',
      catalog: 'Каталог',
      orders: 'Мои заказы',
      profile: 'Мой профиль',
      adminPanel: 'Панель администратора',
      login: 'Войти',
      register: 'Регистрация',
      logout: 'Выйти',
      adminRole: 'Администратор',
      userRole: 'Покупатель',
    },
  };

  const currentT = t[lang || 'uz'];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Catalog Button */}
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-medical-600 to-teal-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-navy-900">APTEKA</span>
              </div>
            </Link>

            <Link
              to="/products"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-medical-50 hover:bg-medical-100 text-medical-700 font-semibold text-xs transition-colors border border-medical-200"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{currentT.catalog}</span>
            </Link>
          </div>

          {/* Center Search Autocomplete */}
          <div className="flex-1 max-w-md hidden md:block">
            <SearchAutocomplete lang={lang} />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
              <button
                onClick={() => setLang('uz')}
                className={`px-2.5 py-0.5 rounded font-semibold transition-all ${
                  lang === 'uz'
                    ? 'bg-white text-navy-900 shadow-2xs'
                    : 'text-gray-600 hover:text-navy-900'
                }`}
              >
                UZ
              </button>
              <button
                onClick={() => setLang('ru')}
                className={`px-2.5 py-0.5 rounded font-semibold transition-all ${
                  lang === 'ru'
                    ? 'bg-white text-navy-900 shadow-2xs'
                    : 'text-gray-600 hover:text-navy-900'
                }`}
              >
                RU
              </button>
            </div>

            {/* Admin shortcut if admin */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-900 text-white hover:bg-navy-800 transition-colors text-xs font-semibold shadow-2xs"
              >
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                <span>Admin</span>
              </Link>
            )}

            {/* Auth Buttons or User Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-sm font-medium text-navy-900 transition-colors focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-medical-50 border border-medical-200 text-medical-600 flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block max-w-[110px] truncate text-xs font-semibold">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-1.5 z-50 animate-slide-up">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-[11px] text-gray-500">Kirilgan hisob:</p>
                      <p className="text-xs font-bold text-navy-900 truncate">{user?.name}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                        {isAdmin ? currentT.adminRole : currentT.userRole}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-medical-600"
                    >
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      {currentT.profile}
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50/50 hover:bg-teal-50"
                      >
                        <LayoutDashboard className="w-4 h-4 text-teal-600" />
                        {currentT.adminPanel}
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {currentT.logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-navy-900 hover:text-medical-600 transition-colors"
                >
                  {currentT.login}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-medical-600 hover:bg-medical-700 rounded-xl shadow-xs transition-colors"
                >
                  {currentT.register}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar and menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 space-y-3">
            <SearchAutocomplete lang={lang} />

            <div className="flex flex-col gap-1 pt-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                {currentT.home}
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
              >
                <Grid className="w-3.5 h-3.5 text-medical-600" />
                {currentT.catalog}
              </Link>
              {isAuthenticated && (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  {currentT.profile}
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-teal-700 bg-teal-50 flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  {currentT.adminPanel}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

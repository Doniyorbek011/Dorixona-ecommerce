import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Pill,
  User as UserIcon,
  LogOut,
  Shield,
  ShoppingCart,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X,
  Grid,
  Layers,
  Info,
  Phone,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCartStore from '../../store/cartStore';
import SearchAutocomplete from './SearchAutocomplete';

export default function Navbar({ lang, setLang }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const totalQuantity = useCartStore((state) => state.totalQuantity);
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
      categories: 'Kategoriyalar',
      about: 'Biz haqimizda',
      contact: 'Aloqa',
      orders: 'Buyurtmalarim',
      profile: 'Mening profilim',
      cart: 'Savat',
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
      categories: 'Категории',
      about: 'О нас',
      contact: 'Контакты',
      orders: 'Мои заказы',
      profile: 'Мой профиль',
      cart: 'Корзина',
      adminPanel: 'Панель администратора',
      login: 'Войти',
      register: 'Регистрация',
      logout: 'Выйти',
      adminRole: 'Администратор',
      userRole: 'Покупатель',
    },
  };

  const currentT = t[lang || 'uz'];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Main Nav Links */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-medical-600 to-teal-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-navy-900">APTEKA</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to="/products"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors ${
                  isActive('/products')
                    ? 'bg-medical-50 text-medical-700 border border-medical-200'
                    : 'text-gray-600 hover:text-navy-900 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>{currentT.catalog}</span>
              </Link>

              <Link
                to="/categories"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors ${
                  isActive('/categories')
                    ? 'bg-medical-50 text-medical-700 border border-medical-200'
                    : 'text-gray-600 hover:text-navy-900 hover:bg-gray-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{currentT.categories}</span>
              </Link>

              <Link
                to="/about"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors ${
                  isActive('/about')
                    ? 'bg-medical-50 text-medical-700 border border-medical-200'
                    : 'text-gray-600 hover:text-navy-900 hover:bg-gray-100'
                }`}
              >
                <span>{currentT.about}</span>
              </Link>

              <Link
                to="/contact"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors ${
                  isActive('/contact')
                    ? 'bg-medical-50 text-medical-700 border border-medical-200'
                    : 'text-gray-600 hover:text-navy-900 hover:bg-gray-100'
                }`}
              >
                <span>{currentT.contact}</span>
              </Link>
            </nav>
          </div>

          {/* Center Search Autocomplete */}
          <div className="flex-1 max-w-xs xl:max-w-sm hidden md:block">
            <SearchAutocomplete lang={lang} />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
              <button
                type="button"
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
                type="button"
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

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl border border-gray-200 hover:border-medical-300 hover:bg-medical-50/50 text-navy-900 transition-colors"
              title="Savat"
            >
              <ShoppingCart className="w-5 h-5 text-navy-800" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-medical-600 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-xs border-2 border-white animate-scale-in">
                  {totalQuantity}
                </span>
              )}
            </Link>

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
                  type="button"
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

                    <Link
                      to="/cart"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-medical-600"
                    >
                      <ShoppingCart className="w-4 h-4 text-gray-400" />
                      <span>{currentT.cart}</span>
                      {totalQuantity > 0 && (
                        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-medical-50 text-medical-700">
                          {totalQuantity}
                        </span>
                      )}
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
                        type="button"
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
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar and menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-gray-100 space-y-3">
            <SearchAutocomplete lang={lang} />

            <div className="flex flex-col gap-1 pt-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive('/') ? 'bg-medical-50 text-medical-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {currentT.home}
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  isActive('/products') ? 'bg-medical-50 text-medical-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-3.5 h-3.5 text-medical-600" />
                {currentT.catalog}
              </Link>
              <Link
                to="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  isActive('/categories') ? 'bg-medical-50 text-medical-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-medical-600" />
                {currentT.categories}
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  isActive('/about') ? 'bg-medical-50 text-medical-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Info className="w-3.5 h-3.5 text-medical-600" />
                {currentT.about}
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                  isActive('/contact') ? 'bg-medical-50 text-medical-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-medical-600" />
                {currentT.contact}
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-3.5 h-3.5 text-medical-600" />
                  <span>{currentT.cart}</span>
                </div>
                {totalQuantity > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-medical-50 text-medical-700">
                    {totalQuantity}
                  </span>
                )}
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

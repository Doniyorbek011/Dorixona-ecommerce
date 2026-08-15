import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Boxes,
  BarChart3,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  Bell,
  Search,
  Shield,
  Pill,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function AdminLayout({ lang = 'uz' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: lang === 'uz' ? 'Boshqaruv' : 'Дашборд', end: true },
    { to: '/admin/products', icon: Package, label: lang === 'uz' ? 'Mahsulotlar' : 'Товары' },
    { to: '/admin/categories', icon: Layers, label: lang === 'uz' ? 'Kategoriyalar' : 'Категории' },
    { to: '/admin/orders', icon: ShoppingBag, label: lang === 'uz' ? 'Buyurtmalar' : 'Заказы' },
    { to: '/admin/customers', icon: Users, label: lang === 'uz' ? 'Mijozlar' : 'Клиенты' },
    { to: '/admin/inventory', icon: Boxes, label: lang === 'uz' ? 'Omborxona' : 'Склад' },
    { to: '/admin/reports', icon: BarChart3, label: lang === 'uz' ? 'Hisobotlar' : 'Отчеты' },
    { to: '/admin/settings', icon: Settings, label: lang === 'uz' ? 'Sozlamalar' : 'Настройки' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-navy-950 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold">
            <Pill className="w-5 h-5" />
          </div>
          <span className="font-black text-sm tracking-wide">APTEKA ADMIN</span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg text-gray-300 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-navy-950 text-slate-300 flex flex-col justify-between transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand */}
          <div className="p-5 border-b border-navy-900 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-medical-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white block">APTEKA</span>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-medical-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-navy-900/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom / User & Store */}
        <div className="p-3 border-t border-navy-900 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-teal-400 hover:bg-navy-900 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>{lang === 'uz' ? 'Asosiy do‘konga o‘tish' : 'В интернет-аптеку'}</span>
          </Link>

          <div className="p-2.5 rounded-xl bg-navy-900/60 border border-navy-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-teal-300 truncate">Administrator</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-navy-900 transition-colors"
              title="Chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'uz' ? 'Tizim boshqaruvi' : 'Панель управления'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{user?.name}</p>
              <p className="text-[10px] text-slate-500">{user?.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-medical-50 border border-medical-200 text-medical-700 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Page View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import CartNotification from './components/common/CartNotification';
import GlobalToast from './components/common/GlobalToast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import GuestRoute from './components/auth/GuestRoute';
import { Pill } from 'lucide-react';

import useAuthStore from './store/authStore';
import useCartStore from './store/cartStore';

// Lazy loaded Public & Customer pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/products/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/products/ProductDetailPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CartPage = lazy(() => import('./pages/cart/CartPage'));
const CheckoutPage = lazy(() => import('./pages/checkout/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const ProfilePage = lazy(() => import('./pages/auth/ProfilePage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));

// Lazy loaded Admin Panel pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-medical-50 border border-medical-200 text-medical-600 flex items-center justify-center animate-pulse">
        <Pill className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-xs font-semibold text-slate-500">Yuklanmoqda...</p>
    </div>
  );
}

function AppContent({ lang, setLang }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-medical-500 selection:text-white font-sans">
      {!isAdminPath && <Navbar lang={lang} setLang={setLang} />}

      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public catalog & shopping */}
            <Route path="/" element={<HomePage lang={lang} />} />
            <Route path="/products" element={<ProductsPage lang={lang} />} />
            <Route path="/products/:slug" element={<ProductDetailPage lang={lang} />} />
            <Route path="/categories" element={<CategoriesPage lang={lang} />} />
            <Route path="/about" element={<AboutPage lang={lang} />} />
            <Route path="/contact" element={<ContactPage lang={lang} />} />
            <Route path="/cart" element={<CartPage lang={lang} />} />

            {/* Protected Checkout route */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage lang={lang} />
                </ProtectedRoute>
              }
            />

            {/* Guest-only auth routes */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage lang={lang} />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <RegisterPage lang={lang} />
                </GuestRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <GuestRoute>
                  <ForgotPasswordPage lang={lang} />
                </GuestRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <GuestRoute>
                  <ResetPasswordPage lang={lang} />
                </GuestRoute>
              }
            />

            {/* Protected Customer routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage lang={lang} />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout lang={lang} />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard lang={lang} />} />
              <Route path="products" element={<AdminProducts lang={lang} />} />
              <Route path="categories" element={<AdminCategories lang={lang} />} />
              <Route path="orders" element={<AdminOrders lang={lang} />} />
              <Route path="customers" element={<AdminCustomers lang={lang} />} />
              <Route path="inventory" element={<AdminInventory lang={lang} />} />
              <Route path="reports" element={<AdminReports lang={lang} />} />
              <Route path="settings" element={<AdminSettings lang={lang} />} />
            </Route>

            {/* Unauthorized 403 route */}
            <Route path="/unauthorized" element={<UnauthorizedPage lang={lang} />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global floating alerts and notifications */}
      <GlobalToast />
      {!isAdminPath && <CartNotification lang={lang} />}

      {!isAdminPath && (
        <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4">
            <p>© {new Date().getFullYear()} Apteka Online Pharmacy. All rights reserved.</p>
            <p className="mt-1 text-[11px] text-gray-400">
              Medical Blue & Teal Design System | Uzbek (UZ) & Russian (RU)
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState('uz');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const syncWithServer = useCartStore((state) => state.syncWithServer);

  // Sync / fetch cart on mount and when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      syncWithServer();
    } else {
      fetchCart();
    }
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <AppContent lang={lang} setLang={setLang} />
    </BrowserRouter>
  );
}

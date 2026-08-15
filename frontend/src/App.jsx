import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import CartNotification from './components/common/CartNotification';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import GuestRoute from './components/auth/GuestRoute';

// Public & Customer pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ProfilePage from './pages/auth/ProfilePage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Admin Panel pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminInventory from './pages/admin/AdminInventory';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

import useAuthStore from './store/authStore';
import useCartStore from './store/cartStore';

function AppContent({ lang, setLang }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-medical-500 selection:text-white font-sans">
      {!isAdminPath && <Navbar lang={lang} setLang={setLang} />}

      <main className="flex-1">
        <Routes>
          {/* Public catalog & shopping */}
          <Route path="/" element={<HomePage lang={lang} />} />
          <Route path="/products" element={<ProductsPage lang={lang} />} />
          <Route path="/products/:slug" element={<ProductDetailPage lang={lang} />} />
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
      </main>

      {/* Global Cart floating toast notification */}
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

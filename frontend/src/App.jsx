import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import CartNotification from './components/common/CartNotification';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import GuestRoute from './components/auth/GuestRoute';

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
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

import useAuthStore from './store/authStore';
import useCartStore from './store/cartStore';

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
      <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-medical-500 selection:text-white font-sans">
        <Navbar lang={lang} setLang={setLang} />

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
                  <AdminDashboardPage lang={lang} />
                </AdminRoute>
              }
            />

            {/* Unauthorized 403 route */}
            <Route path="/unauthorized" element={<UnauthorizedPage lang={lang} />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Cart floating toast notification */}
        <CartNotification lang={lang} />

        <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4">
            <p>© {new Date().getFullYear()} Apteka Online Pharmacy. All rights reserved.</p>
            <p className="mt-1 text-[11px] text-gray-400">
              Medical Blue & Teal Design System | Uzbek (UZ) & Russian (RU)
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

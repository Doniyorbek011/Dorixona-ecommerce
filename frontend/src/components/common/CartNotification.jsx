import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, CheckCircle2, X, ArrowRight } from 'lucide-react';
import useCartStore from '../../store/cartStore';

export default function CartNotification({ lang = 'uz' }) {
  const notification = useCartStore((state) => state.notification);
  const dismissNotification = useCartStore((state) => state.dismissNotification);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dismissNotification();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up max-w-sm w-full">
      <div className="bg-navy-900 text-white rounded-2xl p-4 shadow-2xl border border-navy-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold truncate">
              {notification.productName}
            </p>
            <p className="text-[11px] text-teal-300">
              {lang === 'uz' ? 'Savatga muvaffaqiyatli qo‘shildi' : 'Успешно добавлено в корзину'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/cart"
            onClick={dismissNotification}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center gap-1"
          >
            <span>{lang === 'uz' ? 'Savat' : 'Корзина'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={dismissNotification}
            className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

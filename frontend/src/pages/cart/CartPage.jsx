import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  CheckCircle2,
  Pill,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuth from '../../hooks/useAuth';

export default function CartPage({ lang = 'uz' }) {
  const {
    items,
    itemsCount,
    totalQuantity,
    subtotal,
    deliveryPrice,
    freeDeliveryThreshold,
    freeDeliveryRemaining,
    isFreeDelivery,
    total,
    updateItemQuantity,
    removeItem,
    clearCart,
  } = useCartStore();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const formatPrice = (val) => {
    return Number(val || 0).toLocaleString('uz-UZ') + " so'm";
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'APTEKA10') {
      setPromoApplied(true);
    } else {
      alert(lang === 'uz' ? 'Yaroqsiz promokod' : 'Недействительный промокод');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login with return path to checkout
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  const t = {
    uz: {
      title: 'Xarid savati',
      itemCount: 'ta mahsulot',
      emptyTitle: 'Savatingiz hozircha bo‘sh',
      emptySubtitle: 'Siz hali hech qanday dori vositasi yoki tibbiy buyum tanlamadingiz.',
      goToCatalog: 'Katalogga o‘tish',
      clearCart: 'Savatni tozalash',
      unitPrice: 'dona narxi',
      maxStockNotice: 'Maksimal mavjud miqdor:',
      orderSummary: 'Buyurtma hisobi',
      subtotal: 'Mahsulotlar summasi:',
      delivery: 'Yetkazib berish:',
      freeDelivery: 'Bepul',
      freeDeliveryNotice: 'Bepul yetkazib berish uchun yana',
      freeDeliveryAchieved: 'Siz bepul yetkazib berish imkoniyatiga egasiz!',
      promoLabel: 'Promokod bormi?',
      promoPlaceholder: 'Masalan: APTEKA10',
      applyPromo: 'Qo‘llash',
      promoSuccess: 'Promokod faollashtirildi (-10%)',
      totalToPay: 'Jami to‘lov:',
      checkoutBtn: 'Buyurtmani rasmiylashtirish',
      guestCheckoutNote: 'Buyurtma berish uchun tizimga kirishingiz lozim',
      feat1: '100% Sertifikatlangan original mahsulotlar',
      feat2: 'Tezkor yetkazib berish (2 soatda)',
      feat3: 'Xavfsiz va qulay to‘lov usullari',
      continueShopping: 'Xaridni davom ettirish',
    },
    ru: {
      title: 'Корзина покупок',
      itemCount: 'товаров',
      emptyTitle: 'Ваша корзина пуста',
      emptySubtitle: 'Вы еще не выбрали ни одного лекарства или медицинского товара.',
      goToCatalog: 'Перейти в каталог',
      clearCart: 'Очистить корзину',
      unitPrice: 'цена за шт.',
      maxStockNotice: 'Максимально доступно:',
      orderSummary: 'Сумма заказа',
      subtotal: 'Стоимость товаров:',
      delivery: 'Доставка:',
      freeDelivery: 'Бесплатно',
      freeDeliveryNotice: 'До бесплатной доставки осталось',
      freeDeliveryAchieved: 'Вам доступна бесплатная доставка!',
      promoLabel: 'Есть промокод?',
      promoPlaceholder: 'Например: APTEKA10',
      applyPromo: 'Применить',
      promoSuccess: 'Промокод активирован (-10%)',
      totalToPay: 'Итого к оплате:',
      checkoutBtn: 'Оформить заказ',
      guestCheckoutNote: 'Для оформления заказа необходимо войти в аккаунт',
      feat1: '100% Сертифицированные препараты',
      feat2: 'Быстрая доставка за 2 часа',
      feat3: 'Безопасные способы оплаты',
      continueShopping: 'Продолжить покупки',
    },
  };

  const currentT = t[lang];

  // Calculate promo discount if applied
  const finalDiscount = promoApplied ? subtotal * 0.1 : 0;
  const finalTotal = Math.max(0, total - finalDiscount);

  // Free delivery progress percentage
  const freeDeliveryProgress = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-gray-200 p-12 shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-medical-50 border border-medical-100 text-medical-600 flex items-center justify-center mx-auto mb-5">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900 mb-2">
            {currentT.emptyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-8">
            {currentT.emptySubtitle}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>{currentT.goToCatalog}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight flex items-center gap-3">
            <span>{currentT.title}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-medical-50 text-medical-700 border border-medical-200">
              {totalQuantity} {currentT.itemCount}
            </span>
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-transparent transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{currentT.clearCart}</span>
        </button>
      </div>

      {/* Main Grid: Items list + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const itemId = item.id || item.product_id;
            const categoryName =
              lang === 'ru'
                ? item.category?.name_ru || item.category?.name_uz
                : item.category?.name_uz || item.category?.name_ru;

            return (
              <div
                key={itemId}
                className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 border border-gray-100 p-2 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80'
                      }
                      alt={item.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {item.brand && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                          {item.brand}
                        </span>
                      )}
                      {categoryName && (
                        <span className="text-[10px] text-gray-400 font-medium truncate">
                          • {categoryName}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/products/${item.slug || item.id}`}
                      className="text-xs sm:text-sm font-bold text-navy-900 hover:text-medical-600 transition-colors line-clamp-1 block"
                    >
                      {item.name}
                    </Link>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs font-bold text-navy-900">
                        {formatPrice(item.unit_price)}
                      </span>
                      {item.has_discount && (
                        <span className="text-[11px] text-gray-400 line-through">
                          {formatPrice(item.price)}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">
                        / {currentT.unitPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  {/* Quantity Stepper */}
                  <div className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50/50 shadow-2xs">
                    <button
                      type="button"
                      disabled={item.quantity <= 1}
                      onClick={() => updateItemQuantity(itemId, item.quantity - 1)}
                      className="p-1.5 text-gray-600 hover:text-navy-900 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-navy-900 font-mono">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={item.quantity >= item.stock}
                      onClick={() => updateItemQuantity(itemId, item.quantity + 1)}
                      className="p-1.5 text-gray-600 hover:text-navy-900 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[90px]">
                    <p className="text-sm font-black text-navy-900">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(itemId)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold text-medical-600 hover:text-medical-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{currentT.continueShopping}</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs sticky top-20 space-y-6">
            <h2 className="text-base font-bold text-navy-900">
              {currentT.orderSummary}
            </h2>

            {/* Free delivery tracker */}
            <div className="p-3.5 rounded-2xl bg-medical-50/70 border border-medical-200/70">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-medical-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-medical-600" />
                  <span>Yetkazib berish</span>
                </span>
                <span className="text-medical-700">
                  {isFreeDelivery ? currentT.freeDelivery : `${formatPrice(deliveryPrice)}`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1.5">
                <div
                  className="h-full bg-gradient-to-r from-medical-500 to-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>

              <p className="text-[11px] text-gray-600">
                {isFreeDelivery ? (
                  <span className="text-teal-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    {currentT.freeDeliveryAchieved}
                  </span>
                ) : (
                  <span>
                    {currentT.freeDeliveryNotice} <strong>{formatPrice(freeDeliveryRemaining)}</strong>
                  </span>
                )}
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>{currentT.subtotal}</span>
                <span className="font-semibold text-navy-900">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>{currentT.delivery}</span>
                <span className="font-semibold text-navy-900">
                  {isFreeDelivery ? currentT.freeDelivery : formatPrice(deliveryPrice)}
                </span>
              </div>

              {promoApplied && (
                <div className="flex justify-between text-teal-700 font-semibold">
                  <span>Promokod chegirmasi (10%):</span>
                  <span>-{formatPrice(finalDiscount)}</span>
                </div>
              )}
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="pt-2 border-t border-gray-100">
              <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                {currentT.promoLabel}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder={currentT.promoPlaceholder}
                  className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-medical-500 text-navy-900 uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-navy-900 transition-colors"
                >
                  {currentT.applyPromo}
                </button>
              </div>
              {promoApplied && (
                <p className="text-[11px] text-teal-600 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {currentT.promoSuccess}
                </p>
              )}
            </form>

            {/* Total Section */}
            <div className="pt-4 border-t border-gray-100 flex items-baseline justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500">{currentT.totalToPay}</p>
              </div>
              <div className="text-xl font-black text-navy-900">
                {formatPrice(finalTotal)}
              </div>
            </div>

            {/* Checkout CTA */}
            <div>
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3.5 px-5 rounded-2xl bg-medical-600 hover:bg-medical-700 active:bg-medical-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{currentT.checkoutBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!isAuthenticated && (
                <p className="text-[11px] text-amber-700 bg-amber-50 rounded-xl p-2.5 mt-2.5 text-center font-medium border border-amber-200">
                  {currentT.guestCheckoutNote}
                </p>
              )}
            </div>

            {/* Assurances */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{currentT.feat1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-medical-600 shrink-0" />
                <span>{currentT.feat2}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

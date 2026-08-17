import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, CheckCircle2, XCircle, Pill } from 'lucide-react';
import useCartStore from '../../store/cartStore';

export default function ProductCard({ product, lang = 'uz' }) {
  const addItem = useCartStore((state) => state.addItem);

  if (!product) return null;

  const isDiscounted =
    product.discount_price !== null &&
    Number(product.discount_price) > 0 &&
    Number(product.discount_price) < Number(product.price);

  const currentPrice = isDiscounted
    ? Number(product.discount_price)
    : Number(product.price);

  const discountPercentage = isDiscounted
    ? Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)
    : 0;

  const inStock = Number(product.stock) > 0;

  const formatPrice = (val) => {
    return Number(val || 0).toLocaleString('uz-UZ') + " so'm";
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inStock) {
      await addItem(product, 1);
    }
  };

  const t = {
    uz: {
      inStock: 'Sotuvda mavjud',
      outOfStock: 'Mavjud emas',
      addToCart: 'Savatga',
      outOfStockBtn: 'Qolmagan',
      reviews: 'sharh',
      noReviews: 'Hali baholanmagan',
    },
    ru: {
      inStock: 'В наличии',
      outOfStock: 'Нет в наличии',
      addToCart: 'В корзину',
      outOfStockBtn: 'Нет в наличии',
      reviews: 'отзывов',
      noReviews: 'Нет отзывов',
    },
  };

  const currentT = t[lang] || t.uz;

  const ratingCount = Number(product.rating_count || 0);
  const ratingValue = Number(product.rating || 0);

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/80 hover:border-medical-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative">
      {/* Discount Badge */}
      {isDiscounted && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-amber-500 text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-xs">
          -{discountPercentage}%
        </div>
      )}

      {/* Image Container */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-4/3 overflow-hidden bg-gray-50 p-4"
      >
        <img
          src={product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80';
          }}
        />
      </Link>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand and Category */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium mb-1.5">
            <span className="uppercase tracking-wider text-teal-600 font-semibold truncate max-w-[120px]">
              {product.brand || 'Apteka'}
            </span>
            <span className="truncate max-w-[100px]">
              {lang === 'ru'
                ? product.category?.name_ru || product.category?.name_uz
                : product.category?.name_uz || product.category?.name_ru}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/products/${product.slug}`}
            className="block font-bold text-sm text-navy-900 group-hover:text-medical-600 transition-colors line-clamp-2 min-h-[40px]"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2 min-h-[20px]">
            {ratingCount > 0 && ratingValue > 0 ? (
              <>
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-xs font-bold text-navy-900">
                  {ratingValue.toFixed(1)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  ({ratingCount})
                </span>
              </>
            ) : (
              <span className="text-[11px] text-gray-400 font-medium">
                {currentT.noReviews}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-3">
          {/* Stock and Price Row */}
          <div>
            {/* Availability */}
            <div className="flex items-center gap-1 text-[11px] mb-1">
              {inStock ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span className="text-teal-700 font-medium">{currentT.inStock}</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  <span className="text-gray-500 font-medium">{currentT.outOfStock}</span>
                </>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-base font-black text-navy-900 tracking-tight">
                {formatPrice(currentPrice)}
              </span>
              {isDiscounted && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            disabled={!inStock}
            onClick={handleAddToCart}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs ${
              inStock
                ? 'bg-medical-50 text-medical-700 hover:bg-medical-600 hover:text-white active:bg-medical-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{inStock ? currentT.addToCart : currentT.outOfStockBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

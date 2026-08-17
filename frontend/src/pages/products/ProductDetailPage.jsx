import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  RotateCcw,
  Pill,
  ArrowLeft,
  Share2,
  FileText,
} from 'lucide-react';
import productService from '../../services/productService';
import ProductCard from '../../components/products/ProductCard';
import SEO from '../../components/common/SEO';
import useCartStore from '../../store/cartStore';

export default function ProductDetailPage({ lang = 'uz' }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const fetchProductDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await productService.getProduct(slug);
      setProduct(res.data);
      setSimilarProducts(res.similar_products || []);
    } catch (err) {
      setError(
        lang === 'uz'
          ? 'Mahsulot topilmadi yoki o‘chirilgan bo‘lishi mumkin.'
          : 'Товар не найден или удален.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isDiscounted =
    product &&
    product.discount_price !== null &&
    Number(product.discount_price) > 0 &&
    Number(product.discount_price) < Number(product.price);

  const currentPrice = isDiscounted
    ? Number(product.discount_price)
    : Number(product?.price || 0);

  const discountPercentage = isDiscounted
    ? Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)
    : 0;

  const savedAmount = isDiscounted
    ? Number(product.price) - Number(product.discount_price)
    : 0;

  const inStock = product && Number(product.stock) > 0;

  const formatPrice = (val) => {
    return Number(val || 0).toLocaleString('uz-UZ') + " so'm";
  };

  const handleAddToCart = async () => {
    if (product && inStock) {
      await addItem(product, quantity);
    }
  };

  const handleBuyNow = async () => {
    if (product && inStock) {
      await addItem(product, quantity);
      navigate('/cart');
    }
  };

  const t = {
    uz: {
      home: 'Bosh sahifa',
      catalog: 'Katalog',
      inStock: 'Sotuvda mavjud',
      outOfStock: 'Hozirda sotuvda mavjud emas',
      unitsLeft: 'dona qoldi',
      savedAmount: 'Tejovingiz:',
      quantityLabel: 'Miqdor:',
      addToCart: 'Savatga qo‘shish',
      buyNow: 'Hoziroq xarid qilish',
      similarTitle: 'O‘xshash dori vositalari',
      tabDescription: 'Tavsif va Qo‘llash usuli',
      tabSpecs: 'Xususiyatlari',
      tabDelivery: 'Yetkazib berish va To‘lov',
      brand: 'Brend / Ishlab chiqaruvchi:',
      category: 'Kategoriya:',
      form: 'Chiqarilish shakli:',
      storage: 'Saqlash sharoiti:',
      storageVal: 'Quruq, yorug‘likdan himoyalangan, 25°C dan yuqori bo‘lmagan joyda saqlansin.',
      feat1: '100% Asl mahsulot kafolati',
      feat2: 'Toshkent bo‘ylab 2 soatda yetkazish',
      feat3: 'Mutaxassis bilan xavfsiz konsultatsiya',
      backToCatalog: 'Katalogga qaytish',
      reviews: 'sharhlar',
      noReviews: 'Hali baholanmagan',
    },
    ru: {
      home: 'Главная',
      catalog: 'Каталог',
      inStock: 'В наличии',
      outOfStock: 'Нет в наличии',
      unitsLeft: 'шт. осталось',
      savedAmount: 'Ваша выгода:',
      quantityLabel: 'Количество:',
      addToCart: 'В корзину',
      buyNow: 'Купить сейчас',
      similarTitle: 'Похожие товары',
      tabDescription: 'Описание и Инструкция',
      tabSpecs: 'Характеристики',
      tabDelivery: 'Доставка и Оплата',
      brand: 'Бренд / Производитель:',
      category: 'Категория:',
      form: 'Форма выпуска:',
      storage: 'Условия хранения:',
      storageVal: 'Хранить в сухом, защищенном от света месте при температуре не выше 25°C.',
      feat1: '100% Гарантия подлинности',
      feat2: 'Доставка по Ташкенту за 2 часа',
      feat3: 'Безопасная консультация специалиста',
      backToCatalog: 'Вернуться в каталог',
      reviews: 'отзывов',
      noReviews: 'Нет отзывов',
    },
  };

  const currentT = t[lang] || t.uz;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded w-1/2 mt-6" />
            <div className="h-12 bg-gray-200 rounded-2xl w-full mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
          <Pill className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Mahsulot topilmadi</h2>
        <p className="text-xs text-gray-500 mb-6">{error}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-medical-600 text-white text-xs font-semibold shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentT.backToCatalog}</span>
        </Link>
      </div>
    );
  }

  const categoryName =
    lang === 'ru'
      ? product.category?.name_ru || product.category?.name_uz
      : product.category?.name_uz || product.category?.name_ru;

  // Schema.org Product structured data
  const schemaProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description || `${product.name} - Apteka online dorixonasi`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Apteka',
    },
    offers: {
      '@type': 'Offer',
      price: currentPrice,
      priceCurrency: 'UZS',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: window.location.href,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dynamic SEO Tags */}
      <SEO
        title={`${product.name} - ${formatPrice(currentPrice)}`}
        description={`${product.name} (${product.brand}). ${product.description || 'Apteka online dorixonasidan xarid qiling.'}`}
        image={product.image}
        url={window.location.href}
        type="product"
        schemaJson={schemaProduct}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 overflow-x-auto pb-2">
        <Link to="/" className="hover:text-medical-600 transition-colors">
          {currentT.home}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <Link to="/products" className="hover:text-medical-600 transition-colors">
          {currentT.catalog}
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link
              to={`/products?category=${product.category.slug}`}
              className="hover:text-medical-600 transition-colors truncate max-w-[150px]"
            >
              {categoryName}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-navy-900 font-semibold truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Product Section */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Left Column: Image with badges */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square bg-gray-50 rounded-2xl p-8 border border-gray-100 flex items-center justify-center overflow-hidden">
              {isDiscounted && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs font-black px-3 py-1 rounded-xl shadow-xs">
                  -{discountPercentage}% Chegirma
                </div>
              )}

              <img
                src={product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'}
                alt={product.name}
                loading="lazy"
                className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80';
                }}
              />
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Brand & Category tags */}
              <div className="flex items-center gap-3 mb-2">
                {product.brand && (
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600 px-2.5 py-0.5 rounded-md bg-teal-50 border border-teal-200">
                    {product.brand}
                  </span>
                )}
                <span className="text-xs font-medium text-gray-500">
                  {categoryName}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Rating & Stock row */}
              <div className="flex items-center gap-4 mt-3 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  {Number(product.rating_count) > 0 && Number(product.rating) > 0 ? (
                    <>
                      <div className="flex text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <span className="text-xs font-bold text-navy-900">
                        {Number(product.rating).toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        ({product.rating_count} {currentT.reviews})
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">
                      {currentT.noReviews}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {inStock ? (
                    <span className="text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      {currentT.inStock} ({product.stock} {currentT.unitsLeft})
                    </span>
                  ) : (
                    <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-gray-400" />
                      {currentT.outOfStock}
                    </span>
                  )}
                </div>
              </div>

              {/* Price Display */}
              <div className="mt-5 p-4 rounded-2xl bg-gray-50/80 border border-gray-200/70">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-navy-900 tracking-tight">
                    {formatPrice(currentPrice)}
                  </span>
                  {isDiscounted && (
                    <span className="text-base text-gray-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {isDiscounted && (
                  <p className="text-xs text-teal-700 font-semibold mt-1">
                    {currentT.savedAmount} {formatPrice(savedAmount)}
                  </p>
                )}
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-navy-900">
                    {currentT.quantityLabel}
                  </span>
                  <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white shadow-2xs">
                    <button
                      type="button"
                      disabled={quantity <= 1 || !inStock}
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="p-2 text-gray-600 hover:text-navy-900 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-navy-900 font-mono">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= product.stock || !inStock}
                      onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                      className="p-2 text-gray-600 hover:text-navy-900 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    disabled={!inStock}
                    onClick={handleAddToCart}
                    className="py-3 px-5 rounded-xl text-xs font-semibold text-white bg-medical-600 hover:bg-medical-700 active:bg-medical-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{currentT.addToCart}</span>
                  </button>

                  <button
                    type="button"
                    disabled={!inStock}
                    onClick={handleBuyNow}
                    className="py-3 px-5 rounded-xl text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 border border-teal-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    <Zap className="w-4 h-4 text-teal-600" />
                    <span>{currentT.buyNow}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Medical Assurances */}
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2.5 text-[11px] font-medium text-gray-600">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{currentT.feat1}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[11px] font-medium text-gray-600">
                <Truck className="w-4 h-4 text-medical-600 shrink-0" />
                <span>{currentT.feat2}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[11px] font-medium text-gray-600">
                <Pill className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{currentT.feat3}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specs, Delivery */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden mb-16">
        <div className="flex border-b border-gray-200 bg-gray-50/50">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-6 py-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'description'
                ? 'border-medical-600 text-medical-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-navy-900'
            }`}
          >
            {currentT.tabDescription}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-medical-600 text-medical-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-navy-900'
            }`}
          >
            {currentT.tabSpecs}
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-6 py-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'delivery'
                ? 'border-medical-600 text-medical-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-navy-900'
            }`}
          >
            {currentT.tabDelivery}
          </button>
        </div>

        <div className="p-6 sm:p-8 text-xs text-gray-700 leading-relaxed">
          {activeTab === 'description' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-sm font-bold text-navy-900">Mahsulot haqida ma’lumot</h3>
              <p>{product.description || 'Ushbu dori vositasi bo‘yicha qo‘shimcha tavsif kiritilmagan.'}</p>
              <div className="p-4 bg-medical-50/60 rounded-2xl border border-medical-200/60 mt-4">
                <p className="font-semibold text-medical-900 mb-1">Qo‘llash bo‘yicha ko‘rsatmalar:</p>
                <p className="text-gray-600">
                  Dori vositasini qabul qilishdan oldin yo‘riqnoma bilan tanishib chiqing yoki shifokor bilan maslahatlashing.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl divide-y divide-gray-100">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">{currentT.brand}</span>
                <span className="font-semibold text-navy-900">{product.brand || '—'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">{currentT.category}</span>
                <span className="font-semibold text-navy-900">{categoryName}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-500">{currentT.storage}</span>
                <span className="font-medium text-navy-900 text-right max-w-xs">{currentT.storageVal}</span>
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-3 max-w-3xl">
              <h3 className="text-sm font-bold text-navy-900">Yetkazib berish xizmati</h3>
              <p>• Toshkent shahri bo‘ylab tezkor yetkazib berish: 2 soat ichida (15,000 so‘m, 150,000 so‘mdan yuqori xaridlarda bepul).</p>
              <p>• O‘zbekiston viloyatlari bo‘ylab: 24-48 soat ichida.</p>
              <h3 className="text-sm font-bold text-navy-900 mt-4">To‘lov usullari</h3>
              <p>• Naqd pul orqali kuryerga to‘lov</p>
              <p>• Payme, Click, Uzum orqali onlayn to‘lov</p>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-navy-900">
              {currentT.similarTitle}
            </h2>
            <Link
              to={`/products?category=${product.category?.slug}`}
              className="text-xs font-semibold text-medical-600 hover:text-medical-700"
            >
              Barchasini ko‘rish →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similarProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                lang={lang}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

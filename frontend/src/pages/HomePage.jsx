import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  ShieldCheck,
  Truck,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  User,
  Shield,
  Activity,
  Layers,
  Grid,
  Percent,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { checkHealth } from '../services/api';
import productService from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import ProductSkeleton from '../components/products/ProductSkeleton';
import SearchAutocomplete from '../components/common/SearchAutocomplete';

export default function HomePage({ lang = 'uz' }) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [apiStatus, setApiStatus] = useState({ state: 'checking', data: null });
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    // Health check
    checkHealth()
      .then((data) => setApiStatus({ state: 'online', data }))
      .catch((err) => setApiStatus({ state: 'error', data: err }));

    // Categories
    productService.getCategories().then((res) => setCategories(res.data || []));

    // Featured products
    productService
      .getProducts({ per_page: 6, sort: 'popular' })
      .then((res) => {
        setFeaturedProducts(res.data || []);
      })
      .finally(() => setIsLoadingProducts(false));
  }, []);

  const t = {
    uz: {
      badge: 'Sog‘lig‘ingiz uchun ishonchli onlayn dorixona',
      heroTitle: 'Barcha kerakli dori vositalari bir joyda',
      heroSubtitle:
        'Sertifikatlangan dori vositalari, vitaminlar va tibbiy texnikalarni uyingizga tez va xavfsiz yetkazib beramiz.',
      catalogBtn: 'Katalogga o‘tish',
      loginBtn: 'Tizimga kirish',
      categoriesTitle: 'Ommabop kategoriyalar',
      featuredTitle: 'Tavsiya etiladigan mahsulotlar',
      viewAll: 'Barchasini ko‘rish',
      feat1Title: '100% Sertifikatlangan',
      feat1Desc: 'Barcha mahsulotlar kafolatlangan va litsenziyalangan',
      feat2Title: 'Tezkor yetkazib berish',
      feat2Desc: 'Toshkent bo‘ylab 2 soat ichida eshigingizgacha',
      feat3Title: '24/7 Farmatsevt yordami',
      feat3Desc: 'Malakali mutaxassislardan bepul onlayn maslahat',
    },
    ru: {
      badge: 'Надежная интернет-аптека для вашего здоровья',
      heroTitle: 'Все необходимые лекарства в одном месте',
      heroSubtitle:
        'Сертифицированные лекарства, витамины и медицинская техника с быстрой доставкой на дом.',
      catalogBtn: 'Перейти в каталог',
      loginBtn: 'Войти',
      categoriesTitle: 'Популярные категории',
      featuredTitle: 'Рекомендуемые товары',
      viewAll: 'Смотреть все',
      feat1Title: '100% Сертифицировано',
      feat1Desc: 'Все товары сертифицированы и проверены',
      feat2Title: 'Быстрая доставка',
      feat2Desc: 'По Ташкенту в течение 2 часов до двери',
      feat3Title: 'Поддержка 24/7',
      feat3Desc: 'Бесплатная консультация квалифицированных фармацевтов',
    },
  };

  const currentT = t[lang];

  return (
    <div className="space-y-12 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-medical-900 text-white p-8 sm:p-14 shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-teal-300 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentT.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            {currentT.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 mb-8 max-w-2xl leading-relaxed">
            {currentT.heroSubtitle}
          </p>

          {/* Instant Hero Search */}
          <div className="max-w-xl mb-8">
            <SearchAutocomplete lang={lang} placeholder="Dori nomi yoki brend bo‘yicha qidiring..." />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="px-6 py-3 rounded-xl bg-medical-600 hover:bg-medical-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Grid className="w-4 h-4" />
              <span>{currentT.catalogBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm transition-all"
              >
                {currentT.loginBtn}
              </Link>
            )}
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-teal-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Categories Grid Section */}
      {categories.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
                {currentT.categoriesTitle}
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-semibold text-medical-600 hover:text-medical-700 flex items-center gap-1"
            >
              <span>{currentT.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const catName = lang === 'ru' ? cat.name_ru || cat.name_uz : cat.name_uz || cat.name_ru;
              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200/80 p-4 hover:border-medical-300 hover:shadow-md transition-all flex flex-col items-center text-center overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 p-2 overflow-hidden mb-3 group-hover:scale-105 transition-transform flex items-center justify-center">
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80'}
                      alt={catName}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="text-xs font-bold text-navy-900 group-hover:text-medical-600 transition-colors line-clamp-2 min-h-[32px]">
                    {catName}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-medium mt-1">
                    {cat.products_count ?? 0} ta mahsulot
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
            {currentT.featuredTitle}
          </h2>
          <Link
            to="/products"
            className="text-xs font-semibold text-medical-600 hover:text-medical-700 flex items-center gap-1"
          >
            <span>{currentT.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {isLoadingProducts ? (
            <ProductSkeleton count={6} />
          ) : (
            featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                lang={lang}
                onAddToCart={(item) => alert(`"${item.name}" savatga qo‘shildi!`)}
              />
            ))
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-medical-200 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-navy-900 mb-1">{currentT.feat1Title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed">{currentT.feat1Desc}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-medical-200 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center mb-4">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-navy-900 mb-1">{currentT.feat2Title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed">{currentT.feat2Desc}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-medical-200 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center mb-4">
            <Headphones className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-navy-900 mb-1">{currentT.feat3Title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed">{currentT.feat3Desc}</p>
        </div>
      </div>
    </div>
  );
}

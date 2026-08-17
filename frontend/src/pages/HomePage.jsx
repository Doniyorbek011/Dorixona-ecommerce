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
  Grid,
  Percent,
  Layers,
  Award,
  Clock,
  MapPin,
  ThermometerSnowflake,
  ShieldAlert,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { checkHealth } from '../services/api';
import productService from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import ProductSkeleton from '../components/products/ProductSkeleton';
import SearchAutocomplete from '../components/common/SearchAutocomplete';
import SEO from '../components/common/SEO';

export default function HomePage({ lang = 'uz' }) {
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [isLoadingDiscounted, setIsLoadingDiscounted] = useState(true);
  const [isLoadingNew, setIsLoadingNew] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Categories
    productService
      .getCategories()
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Failed to load categories', err));

    // Discounted products (fetch where discount_price is active)
    productService
      .getProducts({ has_discount: true, per_page: 6 })
      .then((res) => {
        setDiscountedProducts(res.data || []);
      })
      .catch((err) => console.error('Failed to load discounted products', err))
      .finally(() => setIsLoadingDiscounted(false));

    // New products (order by created_at desc)
    productService
      .getProducts({ sort: 'newest', per_page: 6 })
      .then((res) => {
        setNewProducts(res.data || []);
      })
      .catch((err) => console.error('Failed to load new products', err))
      .finally(() => setIsLoadingNew(false));
  }, []);

  const t = {
    uz: {
      badge: 'Sog‘lig‘ingiz uchun ishonchli onlayn dorixona',
      heroTitle: 'Barcha kerakli dori vositalari bir joyda',
      heroSubtitle:
        'Sertifikatlangan dori vositalari, vitaminlar va tibbiy texnikalarni uyingizga tez va xavfsiz yetkazib beramiz.',
      catalogBtn: 'Katalogga o‘tish',
      categoriesBtn: 'Barcha kategoriyalar',
      loginBtn: 'Tizimga kirish',
      categoriesTitle: 'Ommabop kategoriyalar',
      viewAllCategories: 'Barcha kategoriyalar',
      discountTitle: 'Chegirmadagi mahsulotlar',
      discountSubtitle: 'Eng yaxshi narxlar va maxsus takliflar',
      newTitle: 'Yangi kelgan dorilar',
      newSubtitle: 'Katalogimizga yaqinda qo‘shilgan mahsulotlar',
      viewAll: 'Barchasini ko‘rish',
      productsSuffix: 'ta mahsulot',
      
      // Why Choose Us
      whyTitle: 'Nega aynan Apteka?',
      whySubtitle: 'Mijozlarimiz salomatligi va xavfsizligini ta’minlash bizning ustuvor vazifamiz',
      feat1Title: 'Litsenziyalangan dori vositalari',
      feat1Desc: '100% original, O‘zbekiston Respublikasi SSV ro‘yxatidan o‘tgan sertifikatlangan dorilar.',
      feat2Title: 'Tezkor yetkazib berish',
      feat2Desc: 'Toshkent shahri bo‘ylab 1-2 soat ichida to‘g‘ridan-to‘g‘ri eshigingizgacha yetkazib beriladi.',
      feat3Title: '24/7 Farmatsevt yordami',
      feat3Desc: 'Malakali mutaxassislarimiz kun-u tun bepul onlayn konsultatsiya berishga tayyor.',
      feat4Title: 'Hamyonbop va qulay to‘lov',
      feat4Desc: 'Shaffof narxlar, muntazam chegirmalar hamda Payme, Click va naqd pul orqali to‘lov.',

      // Delivery info
      deliveryTitle: 'Yetkazib berish shartlari',
      deliverySubtitle: 'Tez, xavfsiz va barcha sanitariya-gigiyena talablariga muvofiq',
      delAreaTitle: 'Yetkazib berish hududlari',
      delAreaDesc: 'Toshkent shahri bo‘ylab to‘liq, shuningdek Toshkent viloyati hududlariga xizmat ko‘rsatiladi.',
      delPriceTitle: 'Yetkazib berish narxi',
      delPriceDesc: '200 000 so‘mdan ortiq buyurtmalar uchun yetkazib berish BEPUL. Standart yetkazish narxi — 15 000 so‘m.',
      delTimeTitle: 'Yetkazish vaqti',
      delTimeDesc: 'Shoshilinch buyurtmalar 1–2 soatda, standart buyurtmalar esa buyurtma qilingan kunning o‘zida yetkaziladi.',
      delTempTitle: 'Maxsus harorat rejimi',
      delTempDesc: 'Sovuq zanjir talab qilinadigan barcha dori vositalari maxsus termobokslarda xavfsiz yetkaziladi.',
    },
    ru: {
      badge: 'Надежная интернет-аптека для вашего здоровья',
      heroTitle: 'Все необходимые лекарства в одном месте',
      heroSubtitle:
        'Сертифицированные лекарства, витамины и медицинская техника с быстрой доставкой на дом.',
      catalogBtn: 'Перейти в каталог',
      categoriesBtn: 'Все категории',
      loginBtn: 'Войти',
      categoriesTitle: 'Популярные категории',
      viewAllCategories: 'Все категории',
      discountTitle: 'Товары со скидкой',
      discountSubtitle: 'Лучшие цены и специальные выгодные предложения',
      newTitle: 'Новинки каталога',
      newSubtitle: 'Недавно поступившие медикаменты и товары для здоровья',
      viewAll: 'Смотреть все',
      productsSuffix: 'товаров',

      // Why Choose Us
      whyTitle: 'Почему выбирают нас?',
      whySubtitle: 'Здоровье и безопасность наших клиентов — наш главный приоритет',
      feat1Title: 'Лицензированные препараты',
      feat1Desc: '100% оригинальные медикаменты, прошедшие государственную регистрацию Минздрава РУз.',
      feat2Title: 'Быстрая экспресс-доставка',
      feat2Desc: 'Доставка по Ташкенту осуществляется за 1–2 часа прямо до вашей двери.',
      feat3Title: 'Поддержка фармацевтов 24/7',
      feat3Desc: 'Квалифицированные специалисты бесплатно проконсультируют вас в любое время суток.',
      feat4Title: 'Выгодные цены и удобная оплата',
      feat4Desc: 'Прозрачные цены, регулярные акции и удобная оплата картами Payme, Click или наличными.',

      // Delivery info
      deliveryTitle: 'Информация о доставке',
      deliverySubtitle: 'Быстро, надежно и с соблюдением всех санитарных норм',
      delAreaTitle: 'Зоны доставки',
      delAreaDesc: 'Доставка по всему г. Ташкент, а также в прилегающие районы Ташкентской области.',
      delPriceTitle: 'Стоимость доставки',
      delPriceDesc: 'При заказе от 200 000 сум доставка БЕСПЛАТНАЯ. Стандартная доставка — 15 000 сум.',
      delTimeTitle: 'Время доставки',
      delTimeDesc: 'Срочная доставка от 1 до 2 часов. Стандартная доставка выполняется в день оформления заказа.',
      delTempTitle: 'Соблюдение терморежима',
      delTempDesc: 'Препараты, требующие «холодовой цепи», транспортируются в термоконтейнерах.',
    },
  };

  const currentT = t[lang] || t.uz;

  return (
    <div className="space-y-14 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO
        title={lang === 'ru' ? 'Apteka - Онлайн аптека в Ташкенте' : 'Apteka - Toshkentda onlayn dorixona'}
        description={currentT.heroSubtitle}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-medical-900 text-white p-8 sm:p-14 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-teal-300 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentT.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            {currentT.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 mb-8 max-w-2xl leading-relaxed">
            {currentT.heroSubtitle}
          </p>

          {/* Instant Hero Search */}
          <div className="max-w-xl mb-8">
            <SearchAutocomplete
              lang={lang}
              placeholder={
                lang === 'ru'
                  ? 'Поиск лекарств по названию или бренду...'
                  : 'Dori nomi yoki brend bo‘yicha qidiring...'
              }
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="px-6 py-3 rounded-xl bg-medical-600 hover:bg-medical-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Grid className="w-4 h-4" />
              <span>{currentT.catalogBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/categories"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>{currentT.categoriesBtn}</span>
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white font-semibold text-xs sm:text-sm transition-all hidden sm:inline-block"
              >
                {currentT.loginBtn}
              </Link>
            )}
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-teal-500/15 to-transparent pointer-events-none" />
      </div>

      {/* Categories Grid Section */}
      {categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
                {currentT.categoriesTitle}
              </h2>
            </div>
            <Link
              to="/categories"
              className="text-xs font-bold text-medical-600 hover:text-medical-700 flex items-center gap-1 group"
            >
              <span>{currentT.viewAllCategories}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const catName = lang === 'ru' ? cat.name_ru || cat.name_uz : cat.name_uz || cat.name_ru;
              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200/80 p-4 hover:border-medical-400 hover:shadow-md transition-all flex flex-col items-center text-center overflow-hidden"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 p-2 overflow-hidden mb-3 group-hover:scale-105 transition-transform flex items-center justify-center">
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
                    {cat.products_count ?? 0} {currentT.productsSuffix}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 1. Discounted Products Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
                {currentT.discountTitle}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">{currentT.discountSubtitle}</p>
            </div>
          </div>
          <Link
            to="/products?has_discount=true"
            className="text-xs font-bold text-medical-600 hover:text-medical-700 flex items-center gap-1 group"
          >
            <span>{currentT.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {isLoadingDiscounted ? (
            <ProductSkeleton count={6} />
          ) : discountedProducts.length > 0 ? (
            discountedProducts.map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} />
            ))
          ) : (
            <div className="col-span-full py-8 text-center bg-white rounded-2xl border border-gray-200 text-xs text-gray-500">
              {lang === 'ru' ? 'В данный момент нет скидочных товаров' : 'Hozircha chegirmadagi mahsulotlar mavjud emas'}
            </div>
          )}
        </div>
      </section>

      {/* 2. New Products Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
                {currentT.newTitle}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">{currentT.newSubtitle}</p>
            </div>
          </div>
          <Link
            to="/products?sort=newest"
            className="text-xs font-bold text-medical-600 hover:text-medical-700 flex items-center gap-1 group"
          >
            <span>{currentT.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {isLoadingNew ? (
            <ProductSkeleton count={6} />
          ) : newProducts.length > 0 ? (
            newProducts.map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} />
            ))
          ) : (
            <div className="col-span-full py-8 text-center bg-white rounded-2xl border border-gray-200 text-xs text-gray-500">
              {lang === 'ru' ? 'Товары не найдены' : 'Mahsulotlar topilmadi'}
            </div>
          )}
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="pt-2">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight mb-2">
            {currentT.whyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            {currentT.whySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs hover:border-medical-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-navy-900 mb-2">{currentT.feat1Title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{currentT.feat1Desc}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs hover:border-medical-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-navy-900 mb-2">{currentT.feat2Title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{currentT.feat2Desc}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs hover:border-medical-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center mb-4">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-navy-900 mb-2">{currentT.feat3Title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{currentT.feat3Desc}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs hover:border-medical-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-navy-900 mb-2">{currentT.feat4Title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{currentT.feat4Desc}</p>
          </div>
        </div>
      </section>

      {/* 4. Delivery Information Section */}
      <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-50 text-medical-700 text-xs font-bold mb-2">
              <Truck className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Сервис доставки' : 'Yetkazib berish xizmati'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
              {currentT.deliveryTitle}
            </h2>
            <p className="text-xs text-gray-500 mt-1">{currentT.deliverySubtitle}</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 px-4 py-2 rounded-xl border border-teal-200 self-start md:self-auto">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>{lang === 'ru' ? '200 000 сум+ Бесплатная доставка' : '200 000 so‘mdan yuqori BEPUL yetkazish'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy-900 mb-1">{currentT.delAreaTitle}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{currentT.delAreaDesc}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy-900 mb-1">{currentT.delPriceTitle}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{currentT.delPriceDesc}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy-900 mb-1">{currentT.delTimeTitle}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{currentT.delTimeDesc}</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy-900 mb-1">{currentT.delTempTitle}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{currentT.delTempDesc}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, ArrowRight, Search, Sparkles, Layers, Package } from 'lucide-react';
import productService from '../services/productService';
import SEO from '../components/common/SEO';

export default function CategoriesPage({ lang = 'uz' }) {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    productService
      .getCategories()
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Failed to load categories', err))
      .finally(() => setIsLoading(false));
  }, []);

  const t = {
    uz: {
      title: 'Barcha kategoriyalar',
      subtitle: 'Kerakli dori vositalari, tibbiy buyumlar va parvarish vositalarini toifalar bo‘yicha toping',
      searchPlaceholder: 'Kategoriyani qidiring...',
      productsCount: 'ta mahsulot',
      viewProducts: 'Katalogga o‘tish',
      emptyTitle: 'Kategoriya topilmadi',
      emptyDesc: 'Qidiruv so‘rovingiz bo‘yicha hech qanday kategoriya topilmadi.',
      breadcrumbHome: 'Bosh sahifa',
      breadcrumbCat: 'Kategoriyalar',
    },
    ru: {
      title: 'Все категории',
      subtitle: 'Найдите необходимые лекарства, медицинские изделия и товары для здоровья по категориям',
      searchPlaceholder: 'Поиск по категориям...',
      productsCount: 'товаров',
      viewProducts: 'Перейти в каталог',
      emptyTitle: 'Категория не найдена',
      emptyDesc: 'По вашему запросу не найдено ни одной категории.',
      breadcrumbHome: 'Главная',
      breadcrumbCat: 'Категории',
    },
  };

  const currentT = t[lang] || t.uz;

  const filteredCategories = categories.filter((cat) => {
    const name = lang === 'ru' ? cat.name_ru || cat.name_uz : cat.name_uz || cat.name_ru;
    const desc = cat.description || '';
    const term = searchTerm.toLowerCase().trim();
    return name.toLowerCase().includes(term) || desc.toLowerCase().includes(term);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title={lang === 'ru' ? 'Категории товаров - Apteka' : 'Mahsulot kategoriyalari - Apteka'}
        description={currentT.subtitle}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-medical-600 transition-colors">
          {currentT.breadcrumbHome}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-navy-900 font-semibold">{currentT.breadcrumbCat}</span>
      </nav>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-medical-900 text-white p-8 sm:p-12 mb-10 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-teal-300 mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>{currentT.breadcrumbCat}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
            {currentT.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
            {currentT.subtitle}
          </p>

          {/* Search bar inside header */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={currentT.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-teal-400 transition-all"
            />
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-teal-500/15 to-transparent pointer-events-none" />
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-4 animate-pulse"
            >
              <div className="w-20 h-20 bg-gray-200 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const catName = lang === 'ru' ? cat.name_ru || cat.name_uz : cat.name_uz || cat.name_ru;
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group bg-white rounded-2xl border border-gray-200/80 p-5 hover:border-medical-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 p-2 shrink-0 group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center">
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'}
                      alt={catName}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-base text-navy-900 group-hover:text-medical-600 transition-colors line-clamp-1 mb-1">
                      {catName}
                    </h2>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">
                      {cat.description || (lang === 'ru' ? 'Высококачественные проверенные товары' : 'Yuqori sifatli sertifikatlangan mahsulotlar')}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                      <Package className="w-3 h-3 text-teal-600" />
                      <span>
                        {cat.products_count ?? 0} {currentT.productsCount}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-medical-600 group-hover:text-medical-700">
                  <span>{currentT.viewProducts}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-navy-900 mb-1">{currentT.emptyTitle}</h3>
          <p className="text-xs text-gray-500 mb-4">{currentT.emptyDesc}</p>
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="px-4 py-2 rounded-xl bg-medical-50 text-medical-600 font-semibold text-xs hover:bg-medical-100 transition-colors"
          >
            {lang === 'ru' ? 'Очистить поиск' : 'Qidiruvni tozalash'}
          </button>
        </div>
      )}
    </div>
  );
}

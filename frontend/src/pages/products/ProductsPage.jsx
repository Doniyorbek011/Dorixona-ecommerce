import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Pill,
  Search,
  Check,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import productService from '../../services/productService';
import ProductCard from '../../components/products/ProductCard';
import ProductSkeleton from '../../components/products/ProductSkeleton';
import SearchAutocomplete from '../../components/common/SearchAutocomplete';

export default function ProductsPage({ lang = 'uz' }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentInStock = searchParams.get('in_stock') === 'true';
  const currentHasDiscount = searchParams.get('has_discount') === 'true';
  const currentMinPrice = searchParams.get('price_min') || '';
  const currentMaxPrice = searchParams.get('price_max') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Data states
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Local filter inputs
  const [priceInput, setPriceInput] = useState({
    min: currentMinPrice,
    max: currentMaxPrice,
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories and brands on mount
  useEffect(() => {
    productService.getCategories().then((res) => setCategories(res.data || []));
    productService.getBrands().then((res) => setBrands(res.data || []));
  }, []);

  // Fetch products whenever search params change
  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = {
        category: currentCategory || undefined,
        search: currentSearch || undefined,
        sort: currentSort || undefined,
        in_stock: currentInStock ? 1 : undefined,
        has_discount: currentHasDiscount ? 1 : undefined,
        price_min: currentMinPrice || undefined,
        price_max: currentMaxPrice || undefined,
        brand: currentBrand || undefined,
        page: currentPage,
        per_page: 12,
      };

      const res = await productService.getProducts(params);
      setProducts(res.data || []);
      setPagination(res.pagination || null);
    } catch (err) {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilter = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || value === false) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });

    // Reset to page 1 whenever filters change (unless updating page itself)
    if (!updates.page) {
      newParams.delete('page');
    }

    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setPriceInput({ min: '', max: '' });
    setSearchParams({});
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    updateFilter({
      price_min: priceInput.min || null,
      price_max: priceInput.max || null,
    });
  };

  const toggleBrand = (brandName) => {
    const activeBrands = currentBrand ? currentBrand.split(',') : [];
    const index = activeBrands.indexOf(brandName);

    let updated;
    if (index > -1) {
      updated = activeBrands.filter((b) => b !== brandName);
    } else {
      updated = [...activeBrands, brandName];
    }

    updateFilter({ brand: updated.length > 0 ? updated.join(',') : null });
  };

  const t = {
    uz: {
      catalogTitle: 'Mahsulotlar katalogi',
      allCategories: 'Barcha kategoriyalar',
      filters: 'Filtrlar',
      clearFilters: 'Tozalash',
      priceFilter: 'Narx oralig‘i (so‘m)',
      from: 'Dan',
      to: 'Gacha',
      apply: 'Qo‘llash',
      brands: 'Ishlab chiqaruvchi / Brend',
      inStockOnly: 'Faqat sotuvda borlar',
      discountOnly: 'Chegirmadagi mahsulotlar',
      sortBy: 'Saralash:',
      sortNewest: 'Eng yangi',
      sortPriceAsc: 'Arzonidan qimmatiga',
      sortPriceDesc: 'Qimmatidan arzoniga',
      sortPopular: 'Ommabop',
      resultsCount: 'ta mahsulot topildi',
      noProducts: 'Tanlangan filtrlar bo‘yicha mahsulotlar topilmadi',
      noProductsHint: 'Iltimos, boshqa parametrlarni tanlang yoki filtrlarni tozalang.',
      prev: 'Oldingi',
      next: 'Keyingi',
    },
    ru: {
      catalogTitle: 'Каталог товаров',
      allCategories: 'Все категории',
      filters: 'Фильтры',
      clearFilters: 'Сбросить',
      priceFilter: 'Ценовой диапазон (сум)',
      from: 'От',
      to: 'До',
      apply: 'Применить',
      brands: 'Производитель / Бренд',
      inStockOnly: 'Только в наличии',
      discountOnly: 'Товары со скидкой',
      sortBy: 'Сортировка:',
      sortNewest: 'Сначала новые',
      sortPriceAsc: 'Сначала дешевые',
      sortPriceDesc: 'Сначала дорогие',
      sortPopular: 'Популярные',
      resultsCount: 'товаров найдено',
      noProducts: 'По выбранным фильтрам товары не найдены',
      noProductsHint: 'Попробуйте изменить параметры поиска или сбросить фильтры.',
      prev: 'Назад',
      next: 'Вперед',
    },
  };

  const currentT = t[lang];

  // Active filters count
  const activeFiltersCount = [
    currentCategory,
    currentSearch,
    currentInStock,
    currentHasDiscount,
    currentMinPrice,
    currentMaxPrice,
    currentBrand,
  ].filter(Boolean).length;

  const renderFilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
          {currentT.allCategories}
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter({ category: null })}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
              !currentCategory
                ? 'bg-medical-50 text-medical-700 font-bold border border-medical-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>{currentT.allCategories}</span>
          </button>

          {categories.map((cat) => {
            const isSelected = currentCategory === cat.slug || currentCategory === cat.id.toString();
            const catName = lang === 'ru' ? cat.name_ru || cat.name_uz : cat.name_uz || cat.name_ru;
            return (
              <button
                key={cat.id}
                onClick={() => updateFilter({ category: cat.slug })}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-medical-50 text-medical-700 font-bold border border-medical-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="truncate">{catName}</span>
                <span className="text-[11px] text-gray-400 font-normal ml-2">
                  {cat.products_count ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="pt-4 border-t border-gray-200 space-y-3">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-navy-900">
          <input
            type="checkbox"
            checked={currentInStock}
            onChange={(e) => updateFilter({ in_stock: e.target.checked })}
            className="w-4 h-4 rounded text-medical-600 focus:ring-medical-500 border-gray-300"
          />
          <span>{currentT.inStockOnly}</span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-navy-900">
          <input
            type="checkbox"
            checked={currentHasDiscount}
            onChange={(e) => updateFilter({ has_discount: e.target.checked })}
            className="w-4 h-4 rounded text-medical-600 focus:ring-medical-500 border-gray-300"
          />
          <span>{currentT.discountOnly}</span>
        </label>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
          {currentT.priceFilter}
        </h3>
        <form onSubmit={handlePriceApply} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder={currentT.from}
              value={priceInput.min}
              onChange={(e) => setPriceInput({ ...priceInput, min: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-medical-500 text-navy-900"
            />
            <input
              type="number"
              placeholder={currentT.to}
              value={priceInput.max}
              onChange={(e) => setPriceInput({ ...priceInput, max: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-medical-500 text-navy-900"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 text-xs font-semibold text-medical-700 bg-medical-50 hover:bg-medical-100 rounded-lg transition-colors border border-medical-200"
          >
            {currentT.apply}
          </button>
        </form>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
            {currentT.brands}
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {brands.map((b) => {
              const activeList = currentBrand ? currentBrand.split(',') : [];
              const isChecked = activeList.includes(b.brand);
              return (
                <label
                  key={b.brand}
                  className="flex items-center justify-between text-xs text-gray-700 hover:text-navy-900 cursor-pointer py-0.5"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBrand(b.brand)}
                      className="w-3.5 h-3.5 rounded text-medical-600 focus:ring-medical-500 border-gray-300"
                    />
                    <span className="truncate max-w-[140px]">{b.brand}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">({b.count})</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Clear Filters Button */}
      {activeFiltersCount > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={clearAllFilters}
            className="w-full py-2 px-3 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{currentT.clearFilters}</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            {currentT.catalogTitle}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {pagination ? `${pagination.total} ${currentT.resultsCount}` : '...'}
          </p>
        </div>

        {/* Top Search Autocomplete */}
        <div className="w-full md:w-80">
          <SearchAutocomplete lang={lang} />
        </div>
      </div>

      {/* Controls Bar: Mobile filter toggle & Sort Dropdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3 mb-6 shadow-xs flex items-center justify-between gap-4">
        {/* Mobile filter button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-navy-900 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{currentT.filters}</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-medical-600 text-white flex items-center justify-center text-[10px]">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Active search filter tag */}
        <div className="hidden sm:flex items-center gap-2 text-xs flex-1">
          {currentSearch && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-medical-50 border border-medical-200 text-medical-700 text-xs font-medium">
              <span>Qidiruv: "{currentSearch}"</span>
              <button
                onClick={() => updateFilter({ search: null })}
                className="hover:text-red-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs font-medium text-gray-500 hidden sm:inline">
            {currentT.sortBy}
          </span>
          <select
            value={currentSort}
            onChange={(e) => updateFilter({ sort: e.target.value })}
            className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-navy-900 focus:outline-none focus:border-medical-500 cursor-pointer"
          >
            <option value="newest">{currentT.sortNewest}</option>
            <option value="price_asc">{currentT.sortPriceAsc}</option>
            <option value="price_desc">{currentT.sortPriceDesc}</option>
            <option value="popular">{currentT.sortPopular}</option>
          </select>
        </div>
      </div>

      {/* Main Catalog Grid & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs h-fit sticky top-20">
          {renderFilterSidebar()}
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <ProductSkeleton count={6} />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  onAddToCart={(p) => {
                    // Quick alert demonstration for cart in Phase 4
                    alert(`"${p.name}" savatga qo‘shildi!`);
                  }}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400 flex items-center justify-center mx-auto mb-4">
                <Pill className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-navy-900 mb-1">
                {currentT.noProducts}
              </h3>
              <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
                {currentT.noProductsHint}
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{currentT.clearFilters}</span>
              </button>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
              <button
                disabled={pagination.current_page === 1}
                onClick={() => updateFilter({ page: pagination.current_page - 1 })}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{currentT.prev}</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => updateFilter({ page: pageNum })}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                      pageNum === pagination.current_page
                        ? 'bg-medical-600 text-white shadow-2xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => updateFilter({ page: pagination.current_page + 1 })}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-colors"
              >
                <span>{currentT.next}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-slide-left z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-medical-600" />
                  <span>{currentT.filters}</span>
                </h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {renderFilterSidebar()}
            </div>

            <div className="pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-medical-600 hover:bg-medical-700 text-white text-xs font-semibold shadow-xs"
              >
                Natijalarni ko‘rish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

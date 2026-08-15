import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, Pill, ArrowRight } from 'lucide-react';
import productService from '../../services/productService';

export default function SearchAutocomplete({ lang = 'uz', placeholder, className = '' }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Debounced autocomplete search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await productService.autocomplete(query.trim());
        setSuggestions(res.data || []);
        setIsOpen(true);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (slug) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/products/${slug}`);
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString('uz-UZ') + " so'm";
  };

  const t = {
    uz: {
      defaultPlaceholder: 'Dori, vitamin yoki tibbiy buyum qidirish...',
      viewAll: 'Barcha natijalarni ko‘rish',
      noResults: 'Hech narsa topilmadi.',
      inStock: 'Sotuvda bor',
      outOfStock: 'Qolmagan',
    },
    ru: {
      defaultPlaceholder: 'Поиск лекарств, витаминов или приборов...',
      viewAll: 'Посмотреть все результаты',
      noResults: 'Ничего не найдено.',
      inStock: 'В наличии',
      outOfStock: 'Нет в наличии',
    },
  };

  const currentT = t[lang];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder={placeholder || currentT.defaultPlaceholder}
            className="w-full pl-10 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm bg-gray-50/80 hover:bg-gray-100/80 focus:bg-white border border-gray-200 focus:border-medical-500 focus:ring-1 focus:ring-medical-500 rounded-xl transition-all text-navy-900 placeholder:text-gray-400 focus:outline-none"
          />
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-medical-600" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 animate-slide-up max-h-96 overflow-y-auto">
          {suggestions.length > 0 ? (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Mahsulotlar
              </div>
              {suggestions.map((item) => {
                const finalPrice = item.discount_price && item.discount_price > 0
                  ? item.discount_price
                  : item.price;
                const hasDiscount = item.discount_price && item.discount_price > 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectProduct(item.slug)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-medical-50/50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&auto=format&fit=crop&q=80';
                          }}
                        />
                      ) : (
                        <Pill className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-navy-900 truncate">
                          {item.name}
                        </p>
                        {item.brand && (
                          <span className="text-[10px] text-gray-400 font-medium shrink-0">
                            • {item.brand}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-teal-600 font-medium truncate">
                        {lang === 'ru'
                          ? item.category?.name_ru || item.category?.name_uz
                          : item.category?.name_uz || item.category?.name_ru}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-navy-900">
                        {formatPrice(finalPrice)}
                      </p>
                      {hasDiscount && (
                        <p className="text-[10px] text-gray-400 line-through">
                          {formatPrice(item.price)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="p-2 border-t border-gray-100 mt-1">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-2 px-3 rounded-xl bg-medical-50 hover:bg-medical-100 text-medical-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{currentT.viewAll}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            !isLoading && (
              <div className="p-6 text-center text-xs text-gray-500">
                <Pill className="w-6 h-6 text-gray-300 mx-auto mb-1.5" />
                <span>{currentT.noResults}</span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

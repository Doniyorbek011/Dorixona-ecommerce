import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import {
  X,
  MapPin,
  Crosshair,
  Check,
  Loader2,
  AlertTriangle,
  Search,
} from 'lucide-react';

// Custom SVG Pin Icon for Leaflet
const createCustomMarkerIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: grab;">
        <div style="
          width: 38px;
          height: 38px;
          border-radius: 50% 50% 50% 0;
          background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(13, 148, 136, 0.35), 0 2px 4px rgba(0,0,0,0.1);
          border: 2.5px solid #ffffff;
        ">
          <div style="
            width: 12px;
            height: 12px;
            background: #ffffff;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
        <div style="
          width: 10px;
          height: 4px;
          background: rgba(0,0,0,0.25);
          border-radius: 50%;
          margin-top: 2px;
          filter: blur(1px);
        "></div>
      </div>
    `,
    iconSize: [38, 44],
    iconAnchor: [19, 42],
    popupAnchor: [0, -42],
  });
};

export default function LocationPickerModal({
  isOpen,
  onClose,
  initialLat = 41.299496,
  initialLng = 69.240073,
  initialAddress = '',
  onConfirm,
  lang = 'uz',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);

  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });
  const [addressText, setAddressText] = useState(initialAddress || '');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  const t = {
    uz: {
      modalTitle: 'Yetkazib berish manzilini xaritadan tanlang',
      modalSubtitle: 'Xaritadagi belgini kerakli manzil ustiga olib boring yoki bosing',
      myLocationBtn: 'Mening joylashuvim',
      locating: 'Aniqlanmoqda...',
      addressLabel: 'Tanlangan manzil:',
      addressPlaceholder: 'Xaritadan manzilni belgilang yoki yozing...',
      coordinatesLabel: 'Koordinatalar:',
      confirmBtn: 'Manzilni tasdiqlash',
      cancelBtn: 'Bekor qilish',
      dragHint: 'Xaritani bosish yoki belgini surish orqali manzilni aniqlang',
      geoError: 'Joylashuvni aniqlab bo‘lmadi. Iltimos, xaritada qo‘lda belgilang.',
    },
    ru: {
      modalTitle: 'Выберите адрес доставки на карте',
      modalSubtitle: 'Переместите маркер в нужную точку или кликните по карте',
      myLocationBtn: 'Мое местоположение',
      locating: 'Определение...',
      addressLabel: 'Выбранный адрес:',
      addressPlaceholder: 'Укажите адрес на карте или напишите...',
      coordinatesLabel: 'Координаты:',
      confirmBtn: 'Подтвердить адрес',
      cancelBtn: 'Отмена',
      dragHint: 'Кликните по карте или перетащите маркер для выбора адреса',
      geoError: 'Не удалось определить местоположение. Укажите вручную на карте.',
    },
  };

  const currentT = t[lang] || t.uz;

  // Reverse Geocoding with OpenStreetMap Nominatim
  const reverseGeocode = useCallback(async (lat, lng) => {
    setIsGeocoding(true);
    setGeoError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=${lang === 'ru' ? 'ru,uz,en' : 'uz,ru,en'}`
      );
      if (!response.ok) throw new Error('Geocoding network error');
      const data = await response.json();

      if (data && data.display_name) {
        // Format a human-readable clean address
        const addr = data.address || {};
        const parts = [];

        if (addr.road || addr.pedestrian || addr.street) {
          parts.push(addr.road || addr.pedestrian || addr.street);
          if (addr.house_number) {
            parts[0] += `, ${addr.house_number}`;
          }
        }
        if (addr.neighbourhood || addr.suburb || addr.quarter) {
          parts.push(addr.neighbourhood || addr.suburb || addr.quarter);
        }
        if (addr.city_district || addr.borough) {
          parts.push(addr.city_district || addr.borough);
        }
        if (addr.city || addr.town || addr.county) {
          parts.push(addr.city || addr.town || addr.county);
        }

        const formatted = parts.length > 0 ? parts.join(', ') : data.display_name;
        setAddressText(formatted);
      }
    } catch {
      // Fallback: keep previous or set coordinate placeholder
      if (!addressText) {
        setAddressText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } finally {
      setIsGeocoding(false);
    }
  }, [lang, addressText]);

  // Update marker and state
  const handlePositionChange = useCallback((lat, lng, fetchAddress = true) => {
    setCoords({ lat, lng });
    if (markerInstanceRef.current) {
      markerInstanceRef.current.setLatLng([lat, lng]);
    }
    if (fetchAddress) {
      reverseGeocode(lat, lng);
    }
  }, [reverseGeocode]);

  // Initialize Map
  useEffect(() => {
    if (!isOpen) return;

    // Reset initial coords on open
    const targetLat = initialLat || 41.299496;
    const targetLng = initialLng || 69.240073;
    setCoords({ lat: targetLat, lng: targetLng });
    if (initialAddress) {
      setAddressText(initialAddress);
    }

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [targetLat, targetLng],
        zoom: 15,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([targetLat, targetLng], {
        icon: createCustomMarkerIcon(),
        draggable: true,
      }).addTo(map);

      // Drag event
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        handlePositionChange(position.lat, position.lng, true);
      });

      // Map click event
      map.on('click', (e) => {
        handlePositionChange(e.latlng.lat, e.latlng.lng, true);
        map.panTo(e.latlng, { animate: true, duration: 0.5 });
      });

      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;

      // Force recalculation of container size
      map.invalidateSize();

      // If initial address wasn't passed, geocode
      if (!initialAddress) {
        reverseGeocode(targetLat, targetLng);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerInstanceRef.current = null;
      }
    };
  }, [isOpen, initialLat, initialLng, initialAddress, handlePositionChange, reverseGeocode]);

  // Geolocation handler
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError(currentT.geoError);
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIsLocating(false);
        handlePositionChange(latitude, longitude, true);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 17, {
            animate: true,
            duration: 1.2,
          });
        }
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        setGeoError(currentT.geoError);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm({
        address: addressText.trim(),
        latitude: coords.lat,
        longitude: coords.lng,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-teal-50/50 via-white to-medical-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shadow-2xs shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-navy-900 leading-tight">
                {currentT.modalTitle}
              </h3>
              <p className="text-[11px] text-gray-500 hidden sm:block mt-0.5">
                {currentT.modalSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-navy-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container Area */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[360px] bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full min-h-[300px] sm:min-h-[360px] z-0" />

          {/* Floating Geolocation Button */}
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="absolute top-3 right-3 z-10 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md hover:bg-white text-navy-900 border border-gray-200/80 shadow-md hover:shadow-lg text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-70"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4 text-teal-600" />
            )}
            <span>{isLocating ? currentT.locating : currentT.myLocationBtn}</span>
          </button>

          {/* Floating Hint Tag */}
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden sm:block">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-900/80 backdrop-blur-md text-white text-[11px] font-medium shadow-md">
              📍 {currentT.dragHint}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {geoError && (
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 text-amber-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{geoError}</span>
          </div>
        )}

        {/* Modal Footer / Address Preview */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-white space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <label className="font-bold text-navy-900 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-teal-600" />
                <span>{currentT.addressLabel}</span>
              </label>
              <span className="text-[10px] text-gray-400 font-mono">
                {currentT.coordinatesLabel} {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </span>
            </div>

            <div className="relative rounded-xl border border-gray-200 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                {isGeocoding ? (
                  <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4 text-teal-600" />
                )}
              </div>
              <input
                type="text"
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                placeholder={currentT.addressPlaceholder}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-transparent border-0 focus:outline-none text-navy-900 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
            >
              {currentT.cancelBtn}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 active:from-teal-800 active:to-teal-900 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{currentT.confirmBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

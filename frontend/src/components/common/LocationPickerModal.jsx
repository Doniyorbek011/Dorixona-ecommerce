import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin,
  Navigation,
  Check,
  X,
  Loader2,
  AlertCircle,
  Search,
  Crosshair,
} from 'lucide-react';
import L from 'leaflet';

// Custom modern SVG pin icon for Leaflet
const createPinIcon = () => {
  return L.divIcon({
    className: 'custom-location-pin',
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-18px, -36px);
      ">
        <div style="
          position: absolute;
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
          transform: rotate(-45deg);
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.45);
          border: 2.5px solid #ffffff;
        "></div>
        <div style="
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          top: 10px;
          left: 12px;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.15);
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

export default function LocationPickerModal({
  isOpen,
  onClose,
  onConfirm,
  initialLat = 41.299496,
  initialLng = 69.240073,
  initialAddress = '',
  lang = 'uz',
}) {
  const [coords, setCoords] = useState({
    lat: initialLat || 41.299496,
    lng: initialLng || 69.240073,
  });
  const [address, setAddress] = useState(initialAddress || '');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);
  const abortControllerRef = useRef(null);

  const t = {
    uz: {
      modalTitle: 'Yetkazib berish manzilini xaritada tanlang',
      modalSubtitle: 'Markerni siljiting yoki kerakli nuqtaga bosing',
      useCurrentLocation: 'Joriy joylashuvimni aniqlash',
      locating: 'Aniqlanmoqda...',
      addressLabel: 'Tanlangan manzil:',
      addressPlaceholder: 'Manzil avtomatik aniqlanmoqda...',
      confirmLocation: 'Manzilni tasdiqlash',
      cancel: 'Bekor qilish',
      fallbackGeoError: 'Manzilni avtomatik aniqlab bo‘lmadi, iltimos qo‘lda kiriting.',
      geoPermissionDenied: 'Joylashuvni aniqlashga ruxsat berilmadi.',
      geoUnavailable: 'Joylashuv ma’lumoti mavjud emas.',
      geoTimeout: 'Joylashuvni aniqlash vaqti tugadi.',
    },
    ru: {
      modalTitle: 'Укажите адрес доставки на карте',
      modalSubtitle: 'Переместите маркер или нажмите на нужную точку',
      useCurrentLocation: 'Моё местоположение',
      locating: 'Определение...',
      addressLabel: 'Выбранный адрес:',
      addressPlaceholder: 'Адрес определяется автоматически...',
      confirmLocation: 'Подтвердить адрес',
      cancel: 'Отмена',
      fallbackGeoError: 'Не удалось определить адрес автоматически, укажите вручную.',
      geoPermissionDenied: 'Доступ к геолокации запрещен.',
      geoUnavailable: 'Информация о местоположении недоступна.',
      geoTimeout: 'Время ожидания геолокации истекло.',
    },
  };

  const currentT = t[lang] || t.uz;

  // Reverse Geocoding via OpenStreetMap Nominatim
  const reverseGeocode = useCallback(
    async (lat, lng) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsGeocoding(true);
      setGeoError(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            signal: controller.signal,
            headers: {
              'Accept-Language': lang === 'ru' ? 'ru,uz;q=0.8' : 'uz,ru;q=0.8,en;q=0.5',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Nominatim request failed');
        }

        const data = await response.json();
        if (data && data.display_name) {
          // Format a clean, human-readable address
          const formatted = data.display_name;
          setAddress(formatted);
        } else {
          setGeoError(currentT.fallbackGeoError);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setGeoError(currentT.fallbackGeoError);
        }
      } finally {
        setIsGeocoding(false);
      }
    },
    [lang, currentT.fallbackGeoError]
  );

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    const initialCenter = [
      coords.lat || 41.299496,
      coords.lng || 69.240073,
    ];

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 15,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker(initialCenter, {
        draggable: true,
        icon: createPinIcon(),
      }).addTo(map);

      // Marker drag handler
      marker.on('dragend', (e) => {
        const position = e.target.getLatLng();
        setCoords({ lat: position.lat, lng: position.lng });
        reverseGeocode(position.lat, position.lng);
      });

      // Map click handler
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setCoords({ lat, lng });
        reverseGeocode(lat, lng);
      });

      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;

      // Initial reverse geocode if no address provided
      if (!address) {
        reverseGeocode(initialCenter[0], initialCenter[1]);
      }
    } else {
      mapInstanceRef.current.invalidateSize();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Handle GPS Location Request
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError(currentT.geoUnavailable);
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoords({ lat, lng });

        if (mapInstanceRef.current && markerInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1.2 });
          markerInstanceRef.current.setLatLng([lat, lng]);
        }

        reverseGeocode(lat, lng);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError(currentT.geoPermissionDenied);
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError(currentT.geoUnavailable);
            break;
          case error.TIMEOUT:
            setGeoError(currentT.geoTimeout);
            break;
          default:
            setGeoError(currentT.fallbackGeoError);
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleConfirm = () => {
    onConfirm({
      address: address.trim(),
      latitude: coords.lat,
      longitude: coords.lng,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-200 animate-scale-in my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-navy-900 leading-tight">
                {currentT.modalTitle}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                {currentT.modalSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map View */}
        <div className="relative w-full h-72 sm:h-96 bg-gray-100">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Current GPS location trigger button */}
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-xs hover:bg-white text-navy-900 hover:text-teal-700 font-semibold text-xs px-3 py-2 rounded-xl shadow-md border border-gray-200/80 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
            ) : (
              <Crosshair className="w-4 h-4 text-teal-600" />
            )}
            <span className="hidden sm:inline">
              {isLocating ? currentT.locating : currentT.useCurrentLocation}
            </span>
          </button>

          {/* Coordinate indicator pill */}
          <div className="absolute bottom-3 left-3 z-10 bg-navy-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-lg pointer-events-none">
            {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
          </div>
        </div>

        {/* Address Input & Actions */}
        <div className="p-4 sm:p-6 bg-gray-50/80 border-t border-gray-100 space-y-4 shrink-0">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-navy-900 flex items-center gap-1.5">
                <span>{currentT.addressLabel}</span>
                {isGeocoding && <Loader2 className="w-3 h-3 animate-spin text-teal-600" />}
              </label>
            </div>

            <div className="relative rounded-xl border border-gray-200 bg-white focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={currentT.addressPlaceholder}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-transparent border-0 focus:outline-none text-navy-900 font-medium"
              />
            </div>

            {geoError && (
              <div className="mt-2 text-[11px] text-amber-700 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{geoError}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold transition-colors"
            >
              {currentT.cancel}
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{currentT.confirmLocation}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

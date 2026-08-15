import React, { useState } from 'react';
import {
  Settings,
  Store,
  Phone,
  Clock,
  Truck,
  DollarSign,
  Save,
  CheckCircle2,
} from 'lucide-react';

export default function AdminSettings({ lang = 'uz' }) {
  const [settings, setSettings] = useState({
    pharmacy_name: 'Apteka Online Pharmacy',
    support_phone: '+998 71 200 00 00',
    working_hours: '08:00 - 23:00 (Har kuni)',
    free_delivery_threshold: '150000',
    delivery_fee: '15000',
    address: 'Toshkent shahri, Amir Temur ko‘chasi, 107-uy',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'uz' ? 'Tizim Sozlamalari' : 'Настройки системы'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Dorixona ma’lumotlari, yetkazib berish shartlari va aloqa vositalari
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Sozlamalar muvaffaqiyatli saqlandi!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Dorixona nomi
            </label>
            <div className="relative rounded-xl border border-slate-200 focus-within:border-medical-500">
              <input
                type="text"
                value={settings.pharmacy_name}
                onChange={(e) => setSettings({ ...settings, pharmacy_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-transparent border-0 focus:outline-none text-slate-900 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Mijozlarni qo‘llab-quvvatlash telefoni
            </label>
            <div className="relative rounded-xl border border-slate-200 focus-within:border-medical-500">
              <input
                type="text"
                value={settings.support_phone}
                onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-transparent border-0 focus:outline-none text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Ish tartibi
            </label>
            <div className="relative rounded-xl border border-slate-200 focus-within:border-medical-500">
              <input
                type="text"
                value={settings.working_hours}
                onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-transparent border-0 focus:outline-none text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Asosiy dorixona manzili
            </label>
            <div className="relative rounded-xl border border-slate-200 focus-within:border-medical-500">
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-transparent border-0 focus:outline-none text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Bepul yetkazib berish chegarasi (so‘m)
            </label>
            <div className="relative rounded-xl border border-slate-200 focus-within:border-medical-500">
              <input
                type="number"
                value={settings.free_delivery_threshold}
                onChange={(e) => setSettings({ ...settings, free_delivery_threshold: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-transparent border-0 focus:outline-none text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Standart yetkazib berish narxi (so‘m)
            </label>
            <div className="relative rounded-xl border border-slate-200 focus-within:border-medical-500">
              <input
                type="number"
                value={settings.delivery_fee}
                onChange={(e) => setSettings({ ...settings, delivery_fee: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-transparent border-0 focus:outline-none text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Sozlamalarni saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
}

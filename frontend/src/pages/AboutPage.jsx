import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Truck,
  HeartHandshake,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Pill,
  Building2,
  Stethoscope,
} from 'lucide-react';
import SEO from '../components/common/SEO';

export default function AboutPage({ lang = 'uz' }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const t = {
    uz: {
      breadcrumbHome: 'Bosh sahifa',
      breadcrumbAbout: 'Biz haqimizda',
      badge: 'Rasmiy litsenziyalangan onlayn dorixona',
      heroTitle: 'Sog‘lig‘ingiz — bizning eng oliy qadriyatimiz',
      heroSubtitle:
        'Apteka — O‘zbekiston bo‘ylab sertifikatlangan dori vositalari, vitaminlar va tibbiy jihozlarni tezkor va xavfsiz yetkazib beruvchi zamonaviy raqamli dorixona tarmog‘i.',
      stat1Val: '10,000+',
      stat1Lbl: 'Sertifikatlangan dorilar',
      stat2Val: '2 Soat',
      stat2Lbl: 'Tezkor yetkazish vaqti',
      stat3Val: '50,000+',
      stat3Lbl: 'Mamnun mijozlar',
      stat4Val: '24/7',
      stat4Lbl: 'Farmatsevt maslahati',
      missionTitle: 'Bizning missiyamiz va maqsadimiz',
      missionP1:
        'Bizning asosiy vazifamiz — har bir fuqaroga sifatli, xavfsiz va asl dori vositalaridan qulay foydalanish imkoniyatini taqdim etishdir. Biz faqat rasmiy ishlab chiqaruvchilar va sertifikatlangan yetkazib beruvchilar bilan ishlaymiz.',
      missionP2:
        'Harorat rejimiga qat’iy rioya qilingan holda saqlash va maxsus termobokslarda yetkazib berish orqali barcha dori vositalarining shifobaxshlik xususiyatlarini to‘liq saqlab qolamiz.',
      featuresTitle: 'Nega minglab insonlar bizga ishonishadi?',
      f1Title: '100% Asl mahsulot kafolati',
      f1Desc: 'Barcha vositalar O‘zbekiston Respublikasi Sog‘liqni saqlash vazirligi ro‘yxatidan o‘tgan va sertifikatlarga ega.',
      f2Title: 'Tezkor yetkazib berish',
      f2Desc: 'Toshkent shahri bo‘ylab buyurtmangiz 1-2 soat ichida to‘g‘ridan-to‘g‘ri eshigingizgacha yetkaziladi.',
      f3Title: 'Malakali farmatsevtlar',
      f3Desc: 'Tajribali farmatsevtlarimiz kun-u tun savollaringizga javob berishga va to‘g‘ri vositani tanlashga tayyor.',
      f4Title: 'Qulay to‘lov va shaffof narxlar',
      f4Desc: 'Hamyonbop narxlar, muntazam aksiyalar hamda Payme, Click yoki naqd pul orqali qulay to‘lov tizimi.',
      ctaTitle: 'Sog‘lig‘ingiz uchun kerakli dori vositalarini hoziroq buyurtma qiling',
      ctaBtn: 'Katalogga o‘tish',
      contactBtn: 'Aloqaga chiqish',
    },
    ru: {
      breadcrumbHome: 'Главная',
      breadcrumbAbout: 'О нас',
      badge: 'Официальная лицензированная интернет-аптека',
      heroTitle: 'Ваше здоровье — наша главная ценность',
      heroSubtitle:
        'Apteka — современная цифровая аптечная сеть, обеспечивающая быструю и безопасную доставку сертифицированных медикаментов, витаминов и медицинской техники по всему Узбекистану.',
      stat1Val: '10,000+',
      stat1Lbl: 'Сертифицированных товаров',
      stat2Val: '2 Часа',
      stat2Lbl: 'Быстрая доставка',
      stat3Val: '50,000+',
      stat3Lbl: 'Довольных клиентов',
      stat4Val: '24/7',
      stat4Lbl: 'Поддержка фармацевтов',
      missionTitle: 'Наша миссия и принципы',
      missionP1:
        'Наша цель — предоставить каждому человеку быстрый, удобный и надежный доступ к оригинальным лекарственным препаратам высочайшего качества. Мы сотрудничаем исключительно с официальными дистрибьюторами и производителями.',
      missionP2:
        'Соблюдение температурного режима при хранении и транспортировке в специализированных термобоксах гарантирует сохранность всех целебных свойств медикаментов.',
      featuresTitle: 'Почему тысячи клиентов выбирают нас?',
      f1Title: '100% Гарантия подлинности',
      f1Desc: 'Все препараты зарегистрированы в Минздраве Республики Узбекистан и имеют сертификаты качества.',
      f2Title: 'Экспресс-доставка',
      f2Desc: 'Доставка по Ташкенту осуществляется за 1–2 часа прямо до вашей двери.',
      f3Title: 'Квалифицированные фармацевты',
      f3Desc: 'Наши опытные специалисты круглосуточно готовы проконсультировать и помочь с выбором препаратов.',
      f4Title: 'Прозрачные цены и удобная оплата',
      f4Desc: 'Доступные цены, регулярные скидки, а также удобная оплата картами Uzum, Payme, Click или наличными.',
      ctaTitle: 'Закажите необходимые препараты для здоровья прямо сейчас',
      ctaBtn: 'В каталог',
      contactBtn: 'Связаться с нами',
    },
  };

  const currentT = t[lang] || t.uz;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <SEO
        title={lang === 'ru' ? 'О компании - Apteka' : 'Biz haqimizda - Apteka'}
        description={currentT.heroSubtitle}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-medical-600 transition-colors">
          {currentT.breadcrumbHome}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-navy-900 font-semibold">{currentT.breadcrumbAbout}</span>
      </nav>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-medical-900 text-white p-8 sm:p-14 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-teal-300 mb-6">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>{currentT.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            {currentT.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 mb-8 max-w-2xl leading-relaxed">
            {currentT.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="px-6 py-3 rounded-xl bg-medical-600 hover:bg-medical-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>{currentT.ctaBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm transition-all"
            >
              {currentT.contactBtn}
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { val: currentT.stat1Val, lbl: currentT.stat1Lbl, icon: Pill, color: 'text-medical-600', bg: 'bg-medical-50' },
          { val: currentT.stat2Val, lbl: currentT.stat2Lbl, icon: Clock, color: 'text-teal-600', bg: 'bg-teal-50' },
          { val: currentT.stat3Val, lbl: currentT.stat3Lbl, icon: Users, color: 'text-navy-700', bg: 'bg-navy-50' },
          { val: currentT.stat4Val, lbl: currentT.stat4Lbl, icon: Stethoscope, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-2xs hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mx-auto mb-3`}>
              <item.icon className="w-6 h-6" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">{item.val}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">{item.lbl}</p>
          </div>
        ))}
      </div>

      {/* Mission & Standards Split Section */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-50 text-medical-700 text-xs font-bold mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>Apteka Online</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight mb-4">
            {currentT.missionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
            {currentT.missionP1}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
            {currentT.missionP2}
          </p>

          <div className="space-y-3">
            {[
              lang === 'ru' ? 'Строгий контроль сроков годности и условий хранения' : 'Yaroqlilik muddati va saqlash sharoitlarini qat’iy nazorat qilish',
              lang === 'ru' ? 'Прямые поставки от ведущих фармацевтических заводов' : 'Yetakchi farmatsevtika zavodlaridan to‘g‘ridan-to‘g‘ri yetkazib berish',
              lang === 'ru' ? 'Электронная проверка подлинности каждой упаковки' : 'Har bir dori qadoqining elektron haqiqiyligini tekshirish',
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-navy-900">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-md bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=800&auto=format&fit=crop&q=80"
              alt="Pharmacy laboratory and warehouse"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-navy-900 text-white p-4 rounded-2xl shadow-lg border border-navy-800 hidden sm:flex items-center gap-3">
            <Award className="w-8 h-8 text-teal-400 shrink-0" />
            <div>
              <p className="text-xs font-bold">{lang === 'ru' ? 'Лицензия Минздрава РУз' : 'O‘zR SSV Davlat Litsenziyasi'}</p>
              <p className="text-[10px] text-gray-400">№ AP-2024-884920</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight mb-2">
            {currentT.featuresTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: currentT.f1Title, desc: currentT.f1Desc, icon: ShieldCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
            { title: currentT.f2Title, desc: currentT.f2Desc, icon: Truck, color: 'text-medical-600', bg: 'bg-medical-50' },
            { title: currentT.f3Title, desc: currentT.f3Desc, icon: HeartHandshake, color: 'text-navy-700', bg: 'bg-navy-50' },
            { title: currentT.f4Title, desc: currentT.f4Desc, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs hover:border-medical-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl ${feat.bg} ${feat.color} flex items-center justify-center mb-4`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-navy-900 mb-2">{feat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

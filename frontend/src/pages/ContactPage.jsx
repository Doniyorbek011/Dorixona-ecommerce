import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Headphones,
  Sparkles,
} from 'lucide-react';
import SEO from '../components/common/SEO';

export default function ContactPage({ lang = 'uz' }) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const t = {
    uz: {
      breadcrumbHome: 'Bosh sahifa',
      breadcrumbContact: 'Aloqa',
      badge: '24/7 Mijozlarni qo‘llab-quvvatlash',
      heroTitle: 'Biz bilan bog‘laning',
      heroSubtitle:
        'Savollaringiz, takliflaringiz bormi yoki mutaxassis maslahati kerakmi? Biz bilan bog‘laning, yordam berishdan mamnunmiz.',
      formTitle: 'Xabar yuborish',
      formSubtitle: 'Quyidagi formani to‘ldiring, mutaxassisimiz tez orada siz bilan bog‘lanadi.',
      nameLabel: 'To‘liq ismingiz',
      namePlaceholder: 'Masalan: Doniyor Olimov',
      contactLabel: 'Telefon raqam yoki Email',
      contactPlaceholder: '+998 90 123 45 67 yoki email@example.com',
      subjectLabel: 'Mavzu',
      subjectPlaceholder: 'Masalan: Dori vositasi bo‘yicha maslahat',
      messageLabel: 'Xabaringiz',
      messagePlaceholder: 'Savolingiz yoki fikringizni batafsil yozing...',
      submitBtn: 'Xabarni yuborish',
      submittingBtn: 'Yuborilmoqda...',
      successTitle: 'Xabaringiz muvaffaqiyatli yuborildi!',
      successDesc: 'Tez orada operatorimiz siz bilan bog‘lanadi. Salomat bo‘ling!',
      sendAnother: 'Yana xabar yuborish',
      infoTitle: 'Bog‘lanish ma’lumotlari',
      phoneTitle: 'Telefon raqamlar',
      phoneVal1: '+998 (71) 200-00-00',
      phoneVal2: '+998 (90) 123-45-67',
      emailTitle: 'Elektron pochta',
      emailVal: 'info@apteka.uz',
      addressTitle: 'Manzilimiz',
      addressVal: 'Toshkent shahri, Chilonzor tumani, Bunyodkor shoh ko‘chasi, 15-uy',
      hoursTitle: 'Ish tartibi',
      hoursVal: '24/7 — Dam olish kunlarisiz, tun-u kun xizmatingizdamiz',
      hotlineBadge: 'Shoshilinch Farmatsevt Maslahati',
      hotlineDesc: 'Retseptlar va dori qo‘llash bo‘yicha bepul maslahat liniyasi:',
      errName: 'Ismingizni kiritishingiz shart',
      errContact: 'Telefon raqam yoki email kiritishingiz shart',
      errMessage: 'Xabar matnini kiritishingiz shart (kamida 10 ta belgi)',
    },
    ru: {
      breadcrumbHome: 'Главная',
      breadcrumbContact: 'Контакты',
      badge: 'Круглосуточная поддержка клиентов',
      heroTitle: 'Свяжитесь с нами',
      heroSubtitle:
        'Есть вопросы, предложения или нужна консультация фармацевта? Напишите или позвоните нам, мы всегда рады помочь.',
      formTitle: 'Отправить сообщение',
      formSubtitle: 'Заполните форму ниже, и наш специалист свяжется с вами в кратчайшие сроки.',
      nameLabel: 'Ваше имя',
      namePlaceholder: 'Например: Дониёр Алимов',
      contactLabel: 'Телефон или Email',
      contactPlaceholder: '+998 90 123 45 67 или email@example.com',
      subjectLabel: 'Тема обращения',
      subjectPlaceholder: 'Например: Консультация по препарату',
      messageLabel: 'Сообщение',
      messagePlaceholder: 'Напишите ваш вопрос или отзыв...',
      submitBtn: 'Отправить сообщение',
      submittingBtn: 'Отправка...',
      successTitle: 'Ваше сообщение успешно отправлено!',
      successDesc: 'Наш оператор свяжется с вами в ближайшее время. Будьте здоровы!',
      sendAnother: 'Отправить еще одно сообщение',
      infoTitle: 'Контактная информация',
      phoneTitle: 'Телефоны',
      phoneVal1: '+998 (71) 200-00-00',
      phoneVal2: '+998 (90) 123-45-67',
      emailTitle: 'Электронная почта',
      emailVal: 'info@apteka.uz',
      addressTitle: 'Наш адрес',
      addressVal: 'г. Ташкент, Чиланзарский район, пр. Бунёдкор, дом 15',
      hoursTitle: 'Режим работы',
      hoursVal: '24/7 — Круглосуточно, без выходных и перерывов',
      hotlineBadge: 'Срочная консультация фармацевта',
      hotlineDesc: 'Бесплатная горячая линия по подбору и приему лекарств:',
      errName: 'Пожалуйста, укажите ваше имя',
      errContact: 'Пожалуйста, укажите телефон или email',
      errMessage: 'Пожалуйста, введите текст сообщения (не менее 10 символов)',
    },
  };

  const currentT = t[lang] || t.uz;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = currentT.errName;
    }
    if (!formData.contact.trim()) {
      errs.contact = currentT.errContact;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = currentT.errMessage;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate friendly frontend submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', contact: '', subject: '', message: '' });
      setErrors({});
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <SEO
        title={lang === 'ru' ? 'Контакты - Apteka' : 'Aloqa va Manzillar - Apteka'}
        description={currentT.heroSubtitle}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-medical-600 transition-colors">
          {currentT.breadcrumbHome}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-navy-900 font-semibold">{currentT.breadcrumbContact}</span>
      </nav>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-medical-900 text-white p-8 sm:p-12 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-teal-300 mb-4">
            <Headphones className="w-3.5 h-3.5" />
            <span>{currentT.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
            {currentT.heroTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {currentT.heroSubtitle}
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-teal-500/15 to-transparent pointer-events-none" />
      </div>

      {/* Main Grid: Form (Left) & Contact Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs">
          {isSubmitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 animate-scale-in">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-navy-900 mb-2">{currentT.successTitle}</h2>
              <p className="text-xs text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
                {currentT.successDesc}
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                {currentT.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-1">{currentT.formTitle}</h2>
                <p className="text-xs text-gray-500">{currentT.formSubtitle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1.5">
                    {currentT.nameLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={currentT.namePlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-navy-900 bg-gray-50/50 focus:bg-white focus:outline-none transition-all ${
                      errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-medical-500'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1.5">
                    {currentT.contactLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder={currentT.contactPlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-navy-900 bg-gray-50/50 focus:bg-white focus:outline-none transition-all ${
                      errors.contact ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-medical-500'
                    }`}
                  />
                  {errors.contact && <p className="text-[11px] text-red-500 mt-1">{errors.contact}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  {currentT.subjectLabel}
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={currentT.subjectPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-medical-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  {currentT.messageLabel} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={currentT.messagePlaceholder}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-navy-900 bg-gray-50/50 focus:bg-white focus:outline-none transition-all ${
                    errors.message ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-medical-500'
                  }`}
                />
                {errors.message && <p className="text-[11px] text-red-500 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-medical-600 hover:bg-medical-700 active:bg-medical-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? currentT.submittingBtn : currentT.submitBtn}</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Hotline Box */}
          <div className="bg-gradient-to-br from-teal-500 to-medical-600 text-white rounded-3xl p-6 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-100 mb-2">
              <Headphones className="w-4 h-4" />
              <span>{currentT.hotlineBadge}</span>
            </div>
            <p className="text-xs text-teal-50 mb-3">{currentT.hotlineDesc}</p>
            <a
              href="tel:+998712000000"
              className="inline-flex items-center gap-2 bg-white text-navy-900 px-4 py-2 rounded-xl text-sm font-black shadow-xs hover:bg-teal-50 transition-colors"
            >
              <Phone className="w-4 h-4 text-teal-600" />
              <span>+998 (71) 200-00-00</span>
            </a>
          </div>

          {/* Detailed Info Cards */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-5 shadow-xs">
            <h3 className="text-base font-bold text-navy-900 pb-3 border-b border-gray-100">
              {currentT.infoTitle}
            </h3>

            {/* Phone */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900">{currentT.phoneTitle}</p>
                <p className="text-xs text-gray-600 mt-0.5">{currentT.phoneVal1}</p>
                <p className="text-xs text-gray-600">{currentT.phoneVal2}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900">{currentT.emailTitle}</p>
                <p className="text-xs text-gray-600 mt-0.5">{currentT.emailVal}</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900">{currentT.addressTitle}</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{currentT.addressVal}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy-900">{currentT.hoursTitle}</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{currentT.hoursVal}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

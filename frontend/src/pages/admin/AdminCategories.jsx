import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
} from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminCategories({ lang = 'uz' }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: null });

  const [formData, setFormData] = useState({
    name_uz: '',
    name_ru: '',
    slug: '',
    description: '',
    image: '',
    status: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getCategories();
      setCategories(res.data || []);
    } catch (e) {
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name_uz: '',
      name_ru: '',
      slug: '',
      description: '',
      image: '',
      status: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name_uz: cat.name_uz || '',
      name_ru: cat.name_ru || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image: cat.image || '',
      status: Boolean(cat.status),
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback({ type: null, message: null });

    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, formData);
        setFeedback({ type: 'success', message: 'Kategoriya yangilandi!' });
      } else {
        await adminService.createCategory(formData);
        setFeedback({ type: 'success', message: 'Yangi kategoriya yaratildi!' });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Xatolik yuz berdi.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCategoryId) return;
    try {
      await adminService.deleteCategory(deleteCategoryId);
      setDeleteCategoryId(null);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Kategoriyani o‘chirishda xatolik');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'uz' ? 'Kategoriyalar Boshqaruvi' : 'Управление категориями'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dorilar va buyumlar kategoriyalari (UZ / RU)
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Kategoriya</span>
        </button>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 animate-slide-up ${
            feedback.type === 'success'
              ? 'bg-teal-50 border border-teal-200 text-teal-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Rasm</th>
                <th className="p-4">Nomi (UZ)</th>
                <th className="p-4">Nomi (RU)</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Mahsulotlar</th>
                <th className="p-4">Holati</th>
                <th className="p-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">#{cat.id}</td>
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name_uz}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Layers className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900">{cat.name_uz}</td>
                    <td className="p-4 text-slate-600">{cat.name_ru}</td>
                    <td className="p-4 font-mono text-[11px] text-teal-700">{cat.slug}</td>
                    <td className="p-4 font-semibold text-slate-900">
                      {cat.products_count ?? 0} ta
                    </td>
                    <td className="p-4">
                      {cat.status ? (
                        <span className="text-teal-700 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          Faol
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Nofaol
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-medical-600 hover:bg-medical-50 transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCategoryId(cat.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    Kategoriyalar mavjud emas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-scale-in my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya qo‘shish'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomi (O‘zbekcha) *
                </label>
                <input
                  type="text"
                  value={formData.name_uz}
                  onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })}
                  placeholder="Masalan: Dori-darmonlar"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomi (Ruscha) *
                </label>
                <input
                  type="text"
                  value={formData.name_ru}
                  onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                  placeholder="Masalan: Лекарственные препараты"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Slug (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="dori-darmonlar"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rasm URL manzili
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tavsif
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cat_status"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  className="w-4 h-4 text-medical-600 rounded-md border-slate-300"
                />
                <label htmlFor="cat_status" className="text-xs font-semibold text-slate-700">
                  Faol kategoriya
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-semibold text-xs shadow-xs"
                >
                  {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteCategoryId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-scale-in text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Kategoriyani o‘chirishni tasdiqlaysizmi?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Agar unga mahsulotlar biriktirilgan bo‘lsa, o‘chirish mumkin bo‘lmaydi.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setDeleteCategoryId(null)}
                className="py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDelete}
                className="py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs"
              >
                O‘chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Filter,
  ArrowUpDown,
  Upload,
} from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminProducts({ lang = 'uz' }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: null });

  // Form state
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    slug: '',
    brand: '',
    description: '',
    price: '',
    discount_price: '',
    stock: '10',
    image: '',
    status: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await adminService.getCategories();
      setCategories(res.data || []);
    } catch (e) {}
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        search: search || undefined,
        category_id: selectedCategory || undefined,
      };
      const res = await adminService.getProducts(params);
      setProducts(res.data || []);
      setPagination(res.pagination || null);
    } catch (e) {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      category_id: categories[0]?.id || '',
      name: '',
      slug: '',
      brand: '',
      description: '',
      price: '',
      discount_price: '',
      stock: '10',
      image: '',
      status: true,
    });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      category_id: p.category_id || '',
      name: p.name || '',
      slug: p.slug || '',
      brand: p.brand || '',
      description: p.description || '',
      price: p.price || '',
      discount_price: p.discount_price || '',
      stock: p.stock || '0',
      image: p.image || '',
      status: Boolean(p.status),
    });
    setImageFile(null);
    setImagePreview(p.image || '');
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback({ type: null, message: null });

    const data = new FormData();
    data.append('category_id', formData.category_id);
    data.append('name', formData.name);
    if (formData.slug) data.append('slug', formData.slug);
    data.append('brand', formData.brand);
    data.append('description', formData.description);
    data.append('price', formData.price);
    if (formData.discount_price) data.append('discount_price', formData.discount_price);
    data.append('stock', formData.stock);
    data.append('status', formData.status ? '1' : '0');

    if (imageFile) {
      data.append('image_file', imageFile);
    } else if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, data);
        setFeedback({ type: 'success', message: 'Mahsulot muvaffaqiyatli yangilandi!' });
      } else {
        await adminService.createProduct(data);
        setFeedback({ type: 'success', message: 'Yangi mahsulot qo‘shildi!' });
      }
      setIsModalOpen(false);
      fetchProducts();
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
    if (!deleteProductId) return;
    try {
      await adminService.deleteProduct(deleteProductId);
      setDeleteProductId(null);
      fetchProducts();
    } catch (e) {
      alert('Mahsulotni o‘chirishda xatolik');
    }
  };

  const formatPrice = (val) => {
    return Number(val || 0).toLocaleString('uz-UZ') + " so'm";
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'uz' ? 'Mahsulotlar Boshqaruvi' : 'Управление товарами'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dori vositalarini qo‘shish, tahrirlash va o‘chirish
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Mahsulot</span>
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

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Nomi yoki brendi bo‘yicha qidirish..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500 text-slate-900"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500 text-slate-900"
          >
            <option value="">Barcha kategoriyalar</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_uz}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Rasm</th>
                <th className="p-4">Nomi & Brend</th>
                <th className="p-4">Kategoriya</th>
                <th className="p-4">Narxi</th>
                <th className="p-4">Qoldiq</th>
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
              ) : products.length > 0 ? (
                products.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= 10;
                  const isOut = p.stock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">#{p.id}</td>
                      <td className="p-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 p-1 flex items-center justify-center overflow-hidden">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 min-w-[200px]">
                        <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                        <p className="text-[10px] font-bold text-teal-600 uppercase">
                          {p.brand || '—'}
                        </p>
                      </td>
                      <td className="p-4 text-slate-600 font-medium truncate max-w-[120px]">
                        {p.category?.name_uz || '—'}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{formatPrice(p.price)}</p>
                        {p.discount_price && (
                          <p className="text-[10px] text-teal-600 font-semibold">
                            Chegirma: {formatPrice(p.discount_price)}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            isOut
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : isLow
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {p.stock} dona
                        </span>
                      </td>
                      <td className="p-4">
                        {p.status ? (
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
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-medical-600 hover:bg-medical-50 transition-colors"
                            title="Tahrirlash"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteProductId(p.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="O‘chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">
                    Mahsulotlar topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination && pagination.last_page > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Jami: <strong>{pagination.total}</strong> ta mahsulot
            </span>
            <div className="flex gap-1">
              {Array.from({ length: pagination.last_page }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg font-semibold transition-colors ${
                    currentPage === i + 1
                      ? 'bg-medical-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-scale-in my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo‘shish'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategoriya *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_uz}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brend / Ishlab chiqaruvchi *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Masalan: Bayer, Sanofi, Nobel"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mahsulot nomi *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masalan: Paratsetamol 500 mg N10"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tavsif va Qo‘llash yo‘riqnomasi
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Dori haqida batafsil ma’lumot..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Asosiy narxi (so‘m) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="25000"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chegirma narxi (so‘m)
                  </label>
                  <input
                    type="number"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    placeholder="20000"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ombordagi qoldiq (dona) *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500 font-mono"
                  />
                </div>
              </div>

              {/* Image Upload & URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mahsulot rasmi (Yuklash yoki URL)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 cursor-pointer transition-colors border border-slate-200">
                    <Upload className="w-4 h-4" />
                    <span>Fayl tanlash</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="yoki rasm URL manzilini kiriting..."
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-medical-500"
                  />

                  {imagePreview && (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 p-1 shrink-0 overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="prod_status"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  className="w-4 h-4 text-medical-600 rounded-md border-slate-300"
                />
                <label htmlFor="prod_status" className="text-xs font-semibold text-slate-700">
                  Sotuvda faol (ko‘rinadigan)
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
      {deleteProductId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-scale-in text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Mahsulotni o‘chirishni tasdiqlaysizmi?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Ushbu amalni ortga qaytarib bo‘lmaydi.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setDeleteProductId(null)}
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

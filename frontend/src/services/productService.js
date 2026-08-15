import api from './api';

export const productService = {
  // Fetch paginated products with all filters and sorting
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Fetch single product detail and similar items by ID or slug
  getProduct: async (idOrSlug) => {
    const response = await api.get(`/products/${idOrSlug}`);
    return response.data;
  },

  // Fetch active categories with product counts
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Fetch single category
  getCategory: async (idOrSlug) => {
    const response = await api.get(`/categories/${idOrSlug}`);
    return response.data;
  },

  // Fetch distinct brand list
  getBrands: async () => {
    const response = await api.get('/products/brands');
    return response.data;
  },

  // Instant autocomplete search
  autocomplete: async (query) => {
    const response = await api.get('/products/search/autocomplete', {
      params: { q: query },
    });
    return response.data;
  },
};

export default productService;

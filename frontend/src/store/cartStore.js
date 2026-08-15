import { create } from 'zustand';
import cartService from '../services/cartService';

const FREE_DELIVERY_THRESHOLD = 150000;
const STANDARD_DELIVERY_PRICE = 15000;

const getLocalCart = () => {
  try {
    const raw = localStorage.getItem('guest_cart');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalCart = (items) => {
  try {
    localStorage.setItem('guest_cart', JSON.stringify(items));
  } catch (e) {}
};

const calculateTotals = (items) => {
  let subtotal = 0;
  let totalQuantity = 0;

  const formattedItems = items.map((item) => {
    const unitPrice =
      item.discount_price !== null &&
      Number(item.discount_price) > 0 &&
      Number(item.discount_price) < Number(item.price)
        ? Number(item.discount_price)
        : Number(item.price);

    const itemSubtotal = unitPrice * item.quantity;
    subtotal += itemSubtotal;
    totalQuantity += item.quantity;

    return {
      ...item,
      unit_price: unitPrice,
      subtotal: itemSubtotal,
    };
  });

  const deliveryPrice =
    subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_PRICE;
  const total = subtotal > 0 ? subtotal + deliveryPrice : 0;
  const freeDeliveryRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD && subtotal > 0;

  return {
    items: formattedItems,
    itemsCount: formattedItems.length,
    totalQuantity,
    subtotal,
    deliveryPrice,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    freeDeliveryRemaining,
    isFreeDelivery,
    total,
  };
};

const initialGuestTotals = calculateTotals(getLocalCart());

export const useCartStore = create((set, get) => ({
  items: initialGuestTotals.items,
  itemsCount: initialGuestTotals.itemsCount,
  totalQuantity: initialGuestTotals.totalQuantity,
  subtotal: initialGuestTotals.subtotal,
  deliveryPrice: initialGuestTotals.deliveryPrice,
  freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
  freeDeliveryRemaining: initialGuestTotals.freeDeliveryRemaining,
  isFreeDelivery: initialGuestTotals.isFreeDelivery,
  total: initialGuestTotals.total,
  isLoading: false,
  notification: null,

  // Fetch cart (server if token exists, otherwise local guest)
  fetchCart: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      const local = getLocalCart();
      const totals = calculateTotals(local);
      set({ ...totals });
      return;
    }

    set({ isLoading: true });
    try {
      const res = await cartService.getCart();
      const d = res.data;
      set({
        items: d.items,
        itemsCount: d.items_count,
        totalQuantity: d.total_quantity,
        subtotal: Number(d.subtotal),
        deliveryPrice: Number(d.delivery_price),
        freeDeliveryThreshold: Number(d.free_delivery_threshold),
        freeDeliveryRemaining: Number(d.free_delivery_remaining),
        isFreeDelivery: d.is_free_delivery,
        total: Number(d.total),
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  // Add product to cart
  addItem: async (product, quantity = 1) => {
    const token = localStorage.getItem('token');
    const availableStock = Number(product.stock || 0);

    if (availableStock < 1) {
      return { success: false, message: 'Mahsulot omborda qolmagan.' };
    }

    if (token) {
      // Authenticated user ➔ server sync
      set({ isLoading: true });
      try {
        const res = await cartService.addToCart({
          product_id: product.id,
          quantity,
        });
        const d = res.data;
        set({
          items: d.items,
          itemsCount: d.items_count,
          totalQuantity: d.total_quantity,
          subtotal: Number(d.subtotal),
          deliveryPrice: Number(d.delivery_price),
          freeDeliveryRemaining: Number(d.free_delivery_remaining),
          isFreeDelivery: d.is_free_delivery,
          total: Number(d.total),
          isLoading: false,
          notification: {
            productName: product.name,
            quantity,
            type: 'added',
          },
        });
        return { success: true };
      } catch (err) {
        set({ isLoading: false });
        return {
          success: false,
          message: err.response?.data?.message || 'Xatolik yuz berdi.',
        };
      }
    } else {
      // Guest ➔ localStorage
      const currentItems = [...get().items];
      const existingIndex = currentItems.findIndex((i) => i.product_id === product.id || i.id === product.id);

      if (existingIndex > -1) {
        const newQty = currentItems[existingIndex].quantity + quantity;
        if (newQty > availableStock) {
          return {
            success: false,
            message: `Omborda faqat ${availableStock} dona mavjud.`,
          };
        }
        currentItems[existingIndex].quantity = newQty;
      } else {
        if (quantity > availableStock) {
          return {
            success: false,
            message: `Omborda faqat ${availableStock} dona mavjud.`,
          };
        }
        currentItems.push({
          id: product.id,
          product_id: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          image: product.image,
          category: product.category,
          price: Number(product.price),
          discount_price: product.discount_price ? Number(product.discount_price) : null,
          quantity,
          stock: availableStock,
        });
      }

      saveLocalCart(currentItems);
      const totals = calculateTotals(currentItems);
      set({
        ...totals,
        notification: {
          productName: product.name,
          quantity,
          type: 'added',
        },
      });
      return { success: true };
    }
  },

  // Update item quantity
  updateItemQuantity: async (itemId, quantity) => {
    const token = localStorage.getItem('token');

    if (quantity < 1) return;

    if (token) {
      set({ isLoading: true });
      try {
        const res = await cartService.updateQuantity(itemId, quantity);
        const d = res.data;
        set({
          items: d.items,
          itemsCount: d.items_count,
          totalQuantity: d.total_quantity,
          subtotal: Number(d.subtotal),
          deliveryPrice: Number(d.delivery_price),
          freeDeliveryRemaining: Number(d.free_delivery_remaining),
          isFreeDelivery: d.is_free_delivery,
          total: Number(d.total),
          isLoading: false,
        });
        return { success: true };
      } catch (err) {
        set({ isLoading: false });
        return {
          success: false,
          message: err.response?.data?.message || 'Xatolik yuz berdi.',
        };
      }
    } else {
      const currentItems = [...get().items];
      const item = currentItems.find((i) => i.id === itemId || i.product_id === itemId);

      if (item) {
        if (quantity > item.stock) {
          return {
            success: false,
            message: `Maksimal mavjud miqdor: ${item.stock} dona.`,
          };
        }
        item.quantity = quantity;
        saveLocalCart(currentItems);
        const totals = calculateTotals(currentItems);
        set({ ...totals });
        return { success: true };
      }
    }
  },

  // Remove single item
  removeItem: async (itemId) => {
    const token = localStorage.getItem('token');

    if (token) {
      set({ isLoading: true });
      try {
        const res = await cartService.removeFromCart(itemId);
        const d = res.data;
        set({
          items: d.items,
          itemsCount: d.items_count,
          totalQuantity: d.total_quantity,
          subtotal: Number(d.subtotal),
          deliveryPrice: Number(d.delivery_price),
          freeDeliveryRemaining: Number(d.free_delivery_remaining),
          isFreeDelivery: d.is_free_delivery,
          total: Number(d.total),
          isLoading: false,
        });
      } catch (err) {
        set({ isLoading: false });
      }
    } else {
      const updated = get().items.filter((i) => i.id !== itemId && i.product_id !== itemId);
      saveLocalCart(updated);
      const totals = calculateTotals(updated);
      set({ ...totals });
    }
  },

  // Clear entire cart
  clearCart: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await cartService.clearCart();
      } catch (e) {}
    }
    localStorage.removeItem('guest_cart');
    const totals = calculateTotals([]);
    set({ ...totals });
  },

  // Sync guest cart to server upon login
  syncWithServer: async () => {
    const local = getLocalCart();
    if (local.length > 0) {
      const payload = local.map((i) => ({
        product_id: i.product_id || i.id,
        quantity: i.quantity,
      }));
      try {
        await cartService.syncCart(payload);
        localStorage.removeItem('guest_cart');
      } catch (e) {}
    }
    get().fetchCart();
  },

  dismissNotification: () => set({ notification: null }),
}));

export default useCartStore;

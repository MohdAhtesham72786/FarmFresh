import { api, getAdminToken, withAuth, withSession } from "./client";

export const authApi = {
  login: (username, password) => api.post("/auth/login", { username, password }),
  me: () => api.get("/auth/me", withAuth()),
};

export const catalogApi = {
  list: (params) => api.get("/catalog", withSession({ params })),
  categories: () => api.get("/catalog/categories", withSession()),
  get: (id) => api.get(`/catalog/${id}`, withSession()),
};

export const adminProductsApi = {
  list: (params) => api.get("/products", withAuth({ params })),
  categories: () => api.get("/products/filters/categories", withAuth()),
  get: (id) => api.get(`/products/${id}`, withAuth()),
  create: (data) => api.post("/products", data, withAuth()),
  update: (id, data) => api.put(`/products/${id}`, data, withAuth()),
  delete: (id) => api.delete(`/products/${id}`, withAuth()),
  updateStatus: (id, status) => api.patch(`/products/${id}/status`, { status }, withAuth()),
  updateStock: (id, available_quantity) =>
    api.patch(`/products/${id}/stock`, { available_quantity }, withAuth()),
  uploadImage: (formData) =>
    api.post("/products/upload-image", formData, {
      headers: {
        Authorization: getAdminToken() ? `Bearer ${getAdminToken()}` : undefined,
      },
    }),
};

export const adminDashboardApi = {
  stats: () => api.get("/admin/dashboard/stats", withAuth()),
};

export const adminOrdersApi = {
  list: () => api.get("/admin/orders", withAuth()),
};

export const cartApi = {
  get: () => api.get("/cart", withSession()),
  add: (product_id, quantity = 1) =>
    api.post("/cart/items", { product_id, quantity }, withSession()),
  update: (cartItemId, quantity) =>
    api.put(`/cart/items/${cartItemId}`, { quantity }, withSession()),
  remove: (cartItemId) => api.delete(`/cart/items/${cartItemId}`, withSession()),
};

export const wishlistApi = {
  get: () => api.get("/wishlist", withSession()),
  add: (product_id) => api.post("/wishlist/items", { product_id }, withSession()),
  remove: (productId) => api.delete(`/wishlist/items/${productId}`, withSession()),
};

export const ordersApi = {
  checkout: (data) => api.post("/orders/checkout", data, withSession()),
  get: (orderId) => api.get(`/orders/${orderId}`, withSession()),
  list: () => api.get("/orders", withSession()),
};
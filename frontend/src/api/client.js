import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";
const SESSION_KEY = "farmer_cart_session_id";
const TOKEN_KEY = "farmer_cart_admin_token";

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const path = window.location.pathname;
    if (
      error.response?.status === 401 &&
      path.startsWith("/admin") &&
      path !== "/admin/login"
    ) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.assign("/admin/login");
    }
    return Promise.reject(error);
  },
);

export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function withSession(config = {}) {
  return {
    ...config,
    headers: {
      ...config.headers,
      "X-Session-Id": getSessionId(),
    },
  };
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function withAuth(config = {}) {
  const token = getAdminToken();
  return {
    ...config,
    headers: {
      ...config.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}
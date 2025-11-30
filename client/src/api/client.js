// API клиент для подключения к бэкенду
const API_URL = 'http://localhost:5000/api';

// Получить токен из localStorage
const getToken = () => localStorage.getItem('token');

// Базовая функция для запросов к API
const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Произошла ошибка');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================
// АУТЕНТИФИКАЦИЯ
// ============================================

// Регистрация
export const register = async (login, email, password) => {
  const data = await fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ login, email, password }),
  });
  
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data));
  
  return data;
};

// Авторизация
export const login = async (login, password) => {
  const data = await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ login, password }),
  });
  
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data));
  
  return data;
};

// Выход
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Получить профиль
export const getProfile = async () => {
  return await fetchAPI('/auth/profile');
};

// ============================================
// ТОВАРЫ
// ============================================

// Получить все товары
export const getProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return await fetchAPI(`/products?${queryParams}`);
};

// Получить популярные товары
export const getPopularProducts = async () => {
  return await fetchAPI('/products/popular');
};

// Получить новые товары
export const getNewProducts = async () => {
  return await fetchAPI('/products/new');
};

// Получить товар по ID
export const getProductById = async (id) => {
  return await fetchAPI(`/products/${id}`);
};

// ============================================
// КОРЗИНА
// ============================================

// Получить корзину
export const getCart = async () => {
  return await fetchAPI('/cart');
};

// Добавить в корзину
export const addToCart = async (productId, quantity = 1) => {
  return await fetchAPI('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
};

// Обновить количество
export const updateCartItem = async (productId, quantity) => {
  return await fetchAPI(`/cart/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
};

// Удалить из корзины
export const removeFromCart = async (productId) => {
  return await fetchAPI(`/cart/${productId}`, {
    method: 'DELETE',
  });
};

// Очистить корзину
export const clearCart = async () => {
  return await fetchAPI('/cart', {
    method: 'DELETE',
  });
};

// ============================================
// ЗАКАЗЫ
// ============================================

// Создать заказ
export const createOrder = async (orderData) => {
  return await fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

// Получить заказы пользователя
export const getUserOrders = async () => {
  return await fetchAPI('/orders');
};

// Получить заказ по ID
export const getOrderById = async (id) => {
  return await fetchAPI(`/orders/${id}`);
};


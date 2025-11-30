// 🔗 Примеры интеграции API в React компоненты

// ============================================
// 1. Настройка API клиента
// ============================================

// src/api/client.js
const API_URL = 'http://localhost:5000/api';

// Получить токен из localStorage
const getToken = () => localStorage.getItem('token');

// Базовый fetch с обработкой ошибок
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
// 2. API функции - Аутентификация
// ============================================

// Регистрация
export const register = async (login, email, password) => {
  const data = await fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ login, email, password }),
  });
  
  // Сохраняем токен
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
// 3. API функции - Товары
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
// 4. API функции - Корзина
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
// 5. API функции - Заказы
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

// ============================================
// 6. Примеры использования в компонентах
// ============================================

// Пример: Компонент Login
import { useState } from 'react';
import { login } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.login, formData.password);
      navigate('/'); // Перенаправляем на главную
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        placeholder="Login"
        value={formData.login}
        onChange={(e) => setFormData({ ...formData, login: e.target.value })}
        disabled={loading}
      />
      
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        disabled={loading}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Загрузка...' : 'Войти'}
      </button>
    </form>
  );
}

// Пример: Компонент ProductList с загрузкой данных
import { useState, useEffect } from 'react';
import { getProducts } from '../api/client';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts({ page: 1, limit: 10 });
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="products-grid">
      {products.map(product => (
        <div key={product._id} className="product-card">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Цена: {product.finalPrice}₽</p>
        </div>
      ))}
    </div>
  );
}

// Пример: Добавление в корзину
import { addToCart } from '../api/client';

const handleAddToCart = async (productId) => {
  try {
    const result = await addToCart(productId, 1);
    alert(result.message); // "Товар добавлен в корзину"
  } catch (err) {
    alert(err.message);
  }
};

// Пример: Оформление заказа
import { createOrder, clearCart } from '../api/client';

const handleCheckout = async () => {
  const orderData = {
    items: cartItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity
    })),
    deliveryAddress: {
      country: 'Россия',
      city: 'Москва',
      address: 'ул. Примерная, д. 1, кв. 1'
    },
    paymentMethod: 'visa'
  };

  try {
    const order = await createOrder(orderData);
    alert('Заказ оформлен!');
    navigate(`/orders/${order._id}`);
  } catch (err) {
    alert(err.message);
  }
};

// ============================================
// 7. Context API для глобального состояния
// ============================================

// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем наличие токена при загрузке
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  const loginUser = async (login, password) => {
    const data = await login(login, password);
    setUser(data);
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Использование в App.jsx
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ваши роуты */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Использование в компонентах
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logoutUser } = useAuth();

  return (
    <header>
      {user ? (
        <>
          <span>Привет, {user.login}!</span>
          <button onClick={logoutUser}>Выйти</button>
        </>
      ) : (
        <a href="/login">Войти</a>
      )}
    </header>
  );
}


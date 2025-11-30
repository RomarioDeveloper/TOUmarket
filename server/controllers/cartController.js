import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Получить корзину пользователя
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Фильтруем товары, которые все еще активны
    const activeCartItems = user.cart.filter(item => item.product && item.product.isActive);

    // Вычисляем общую сумму
    const totalPrice = activeCartItems.reduce((sum, item) => {
      return sum + (item.product.finalPrice * item.quantity);
    }, 0);

    res.json({
      cart: activeCartItems,
      totalPrice
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Добавить товар в корзину
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Проверка существования товара
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    if (!product.isActive) {
      return res.status(400).json({ message: 'Товар недоступен' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Недостаточно товара на складе' });
    }

    const user = await User.findById(req.user._id);

    // Проверяем, есть ли товар уже в корзине
    const existingItem = user.cart.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      // Обновляем количество
      existingItem.quantity += quantity;
      
      // Проверяем наличие на складе
      if (existingItem.quantity > product.stock) {
        return res.status(400).json({ message: 'Недостаточно товара на складе' });
      }
    } else {
      // Добавляем новый товар
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.product');

    res.json({
      cart: updatedUser.cart,
      message: 'Товар добавлен в корзину'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Обновить количество товара в корзине
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Количество должно быть больше 0' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Недостаточно товара на складе' });
    }

    const user = await User.findById(req.user._id);

    const cartItem = user.cart.find(
      item => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Товар не найден в корзине' });
    }

    cartItem.quantity = quantity;

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.product');

    res.json({
      cart: updatedUser.cart,
      message: 'Количество обновлено'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Удалить товар из корзины
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      item => item.product.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.product');

    res.json({
      cart: updatedUser.cart,
      message: 'Товар удален из корзины'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Очистить корзину
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart = [];

    await user.save();

    res.json({
      cart: [],
      message: 'Корзина очищена'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


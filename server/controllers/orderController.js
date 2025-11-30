import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Создать новый заказ
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Корзина пуста' });
    }

    if (!deliveryAddress || !deliveryAddress.country || !deliveryAddress.city || !deliveryAddress.address) {
      return res.status(400).json({ message: 'Укажите адрес доставки' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Выберите способ оплаты' });
    }

    // Проверяем наличие товаров и вычисляем цены
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: `Товар ${item.product} не найден` });
      }

      if (!product.isActive) {
        return res.status(400).json({ message: `Товар ${product.name} недоступен` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Недостаточно товара ${product.name} на складе. Доступно: ${product.stock}` 
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.finalPrice
      });

      totalPrice += product.finalPrice * item.quantity;

      // Уменьшаем количество на складе
      product.stock -= item.quantity;
      await product.save();
    }

    // Применяем скидку если есть
    const discount = req.body.discount || 0;
    const finalPrice = totalPrice - discount;

    // Создаем заказ
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      discount,
      finalPrice,
      deliveryAddress,
      paymentMethod
    });

    // Очищаем корзину пользователя
    const user = await User.findById(req.user._id);
    user.cart = [];
    user.orders.push(order._id);
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Получить все заказы пользователя
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Получить заказ по ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'login email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    // Проверяем, что заказ принадлежит пользователю или пользователь - админ
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет доступа к этому заказу' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Обновить статус заказа
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Seller)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Укажите новый статус' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    order.status = status;

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Пометить заказ как оплаченный
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    // Проверяем, что заказ принадлежит пользователю
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Нет доступа к этому заказу' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'processing';

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Отменить заказ
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    // Проверяем, что заказ принадлежит пользователю
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет доступа к этому заказу' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Нельзя отменить доставленный заказ' });
    }

    // Возвращаем товары на склад
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';

    await order.save();

    res.json({ message: 'Заказ отменен', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Получить все заказы (для админа)
// @route   GET /api/orders/all
// @access  Private (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'login email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


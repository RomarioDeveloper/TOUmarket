import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderToPaid,
  cancelOrder,
  getAllOrders
} from '../controllers/orderController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Приватные роуты (требуется аутентификация)
router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/cancel', protect, cancelOrder);

// Роуты для администратора
router.get('/all/admin', protect, isAdmin, getAllOrders);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);

export default router;


import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPopularProducts,
  getNewProducts
} from '../controllers/productController.js';
import { protect, isSeller } from '../middleware/auth.js';

const router = express.Router();

// Публичные роуты
router.get('/', getProducts);
router.get('/popular', getPopularProducts);
router.get('/new', getNewProducts);
router.get('/:id', getProductById);

// Приватные роуты (требуется аутентификация + роль продавца)
router.post('/', protect, isSeller, createProduct);
router.put('/:id', protect, isSeller, updateProduct);
router.delete('/:id', protect, isSeller, deleteProduct);

export default router;


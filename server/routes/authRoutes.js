import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Публичные роуты
router.post('/register', register);
router.post('/login', login);

// Приватные роуты
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;


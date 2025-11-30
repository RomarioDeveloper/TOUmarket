import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Регистрация нового пользователя
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { login, email, password } = req.body;

    // Проверка наличия всех полей
    if (!login || !email || !password) {
      return res.status(400).json({ message: 'Пожалуйста, заполните все поля' });
    }

    // Проверка существования пользователя
    const userExists = await User.findOne({ $or: [{ email }, { login }] });

    if (userExists) {
      return res.status(400).json({ message: 'Пользователь с таким email или логином уже существует' });
    }

    // Создание нового пользователя
    const user = await User.create({
      login,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        login: user.login,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Неверные данные пользователя' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Авторизация пользователя
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    // Проверка наличия полей
    if (!login || !password) {
      return res.status(400).json({ message: 'Пожалуйста, заполните все поля' });
    }

    // Поиск пользователя
    const user = await User.findOne({ login });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        login: user.login,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Неверный логин или пароль' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Получение профиля пользователя
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Обновление профиля пользователя
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.login = req.body.login || user.login;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        login: updatedUser.login,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

// Тестовые данные
const users = [
  {
    login: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    login: 'seller1',
    email: 'seller1@example.com',
    password: 'seller123',
    role: 'seller'
  },
  {
    login: 'buyer1',
    email: 'buyer1@example.com',
    password: 'buyer123',
    role: 'buyer'
  }
];

const products = [
  {
    name: 'Смартфон Samsung Galaxy S23',
    description: 'Мощный флагманский смартфон с отличной камерой и производительностью',
    price: 79990,
    discount: 10,
    category: 'electronics',
    stock: 50,
    isPopular: true,
    isNew: true
  },
  {
    name: 'Ноутбук Apple MacBook Air M2',
    description: 'Легкий и мощный ноутбук для работы и творчества',
    price: 129990,
    discount: 5,
    category: 'electronics',
    stock: 30,
    isPopular: true,
    isNew: true
  },
  {
    name: 'Беспроводные наушники Sony WH-1000XM5',
    description: 'Премиальные наушники с шумоподавлением',
    price: 29990,
    discount: 15,
    category: 'electronics',
    stock: 100,
    isPopular: true,
    isNew: false
  },
  {
    name: 'Умные часы Apple Watch Series 9',
    description: 'Функциональные умные часы с множеством датчиков здоровья',
    price: 44990,
    discount: 0,
    category: 'electronics',
    stock: 75,
    isPopular: true,
    isNew: true
  },
  {
    name: 'Игровая консоль PlayStation 5',
    description: 'Новейшая игровая консоль от Sony',
    price: 54990,
    discount: 0,
    category: 'electronics',
    stock: 25,
    isPopular: true,
    isNew: true
  },
  {
    name: 'Планшет iPad Air',
    description: 'Универсальный планшет для работы и развлечений',
    price: 64990,
    discount: 8,
    category: 'electronics',
    stock: 40,
    isPopular: false,
    isNew: true
  },
  {
    name: 'Электронная книга Kindle Paperwhite',
    description: 'Компактная читалка с подсветкой экрана',
    price: 14990,
    discount: 20,
    category: 'electronics',
    stock: 150,
    isPopular: false,
    isNew: false
  },
  {
    name: 'Фитнес-браслет Xiaomi Mi Band 8',
    description: 'Доступный фитнес-трекер с множеством функций',
    price: 4990,
    discount: 25,
    category: 'electronics',
    stock: 200,
    isPopular: true,
    isNew: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Очистка базы данных
    await User.deleteMany();
    await Product.deleteMany();

    console.log('База данных очищена');

    // Создание пользователей
    const createdUsers = await User.create(users);
    console.log(`Создано ${createdUsers.length} пользователей`);

    // Получаем продавца для товаров
    const seller = createdUsers.find(user => user.role === 'seller');

    // Добавляем продавца к товарам
    const productsWithSeller = products.map(product => ({
      ...product,
      seller: seller._id
    }));

    // Создание товаров
    const createdProducts = await Product.create(productsWithSeller);
    console.log(`Создано ${createdProducts.length} товаров`);

    console.log('✅ База данных успешно заполнена тестовыми данными');
    console.log('\nТестовые пользователи:');
    console.log('1. Админ: login=admin, password=admin123');
    console.log('2. Продавец: login=seller1, password=seller123');
    console.log('3. Покупатель: login=buyer1, password=buyer123');

    process.exit(0);
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
    process.exit(1);
  }
};

seedDatabase();


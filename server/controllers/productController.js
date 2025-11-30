import Product from '../models/Product.js';

// @desc    Получить все товары
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, isPopular, isNew, search, page = 1, limit = 10 } = req.query;

    // Фильтры
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (isPopular) {
      filter.isPopular = isPopular === 'true';
    }

    if (isNew) {
      filter.isNew = isNew === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Пагинация
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate('seller', 'login email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Получить один товар по ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'login email');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Товар не найден' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Создать новый товар
// @route   POST /api/products
// @access  Private (Seller/Admin)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      category,
      image,
      images,
      stock,
      isPopular,
      isNew
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      discount,
      category,
      image,
      images,
      stock,
      seller: req.user._id,
      isPopular,
      isNew
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Обновить товар
// @route   PUT /api/products/:id
// @access  Private (Seller/Admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    // Проверка, что пользователь - владелец товара или админ
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для обновления этого товара' });
    }

    const {
      name,
      description,
      price,
      discount,
      category,
      image,
      images,
      stock,
      isPopular,
      isNew,
      isActive
    } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.discount = discount !== undefined ? discount : product.discount;
    product.category = category || product.category;
    product.image = image || product.image;
    product.images = images || product.images;
    product.stock = stock !== undefined ? stock : product.stock;
    product.isPopular = isPopular !== undefined ? isPopular : product.isPopular;
    product.isNew = isNew !== undefined ? isNew : product.isNew;
    product.isActive = isActive !== undefined ? isActive : product.isActive;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Удалить товар
// @route   DELETE /api/products/:id
// @access  Private (Seller/Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    // Проверка, что пользователь - владелец товара или админ
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для удаления этого товара' });
    }

    await product.deleteOne();

    res.json({ message: 'Товар удален' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Получить популярные товары
// @route   GET /api/products/popular
// @access  Public
export const getPopularProducts = async (req, res) => {
  try {
    const products = await Product.find({ isPopular: true, isActive: true })
      .populate('seller', 'login email')
      .limit(10)
      .sort({ rating: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Получить новые товары
// @route   GET /api/products/new
// @access  Public
export const getNewProducts = async (req, res) => {
  try {
    const products = await Product.find({ isNew: true, isActive: true })
      .populate('seller', 'login email')
      .limit(10)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


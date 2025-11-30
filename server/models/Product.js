import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название товара обязательно'],
    trim: true,
    maxlength: [200, 'Название не должно превышать 200 символов']
  },
  description: {
    type: String,
    required: [true, 'Описание товара обязательно'],
    maxlength: [2000, 'Описание не должно превышать 2000 символов']
  },
  price: {
    type: Number,
    required: [true, 'Цена обязательна'],
    min: [0, 'Цена не может быть отрицательной']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Скидка не может быть отрицательной'],
    max: [100, 'Скидка не может превышать 100%']
  },
  finalPrice: {
    type: Number
  },
  category: {
    type: String,
    required: [true, 'Категория обязательна'],
    enum: ['electronics', 'clothing', 'food', 'books', 'toys', 'sports', 'home', 'other']
  },
  image: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: [true, 'Количество на складе обязательно'],
    min: [0, 'Количество не может быть отрицательным'],
    default: 0
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Вычисление финальной цены с учетом скидки
productSchema.pre('save', function(next) {
  if (this.discount > 0) {
    this.finalPrice = this.price - (this.price * this.discount / 100);
  } else {
    this.finalPrice = this.price;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;


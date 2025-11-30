import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Main/elements/Header';
import Footer from '../Main/elements/Footer';
import { useToast } from '../components/Toast';
import '../Main/Main.css';
import { getCart, updateCartItem, removeFromCart, createOrder } from '../api/client';

export default function Cart(){
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCheckout, setShowCheckout] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('visa');
    const [address, setAddress] = useState({
        country: '',
        city: '',
        address: ''
    });
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            
            const data = await getCart();
            setCartItems(data.cart || []);
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
            addToast('Ошибка загрузки корзины', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            await updateCartItem(productId, newQuantity);
            await loadCart();
            addToast('✓ Количество обновлено');
        } catch (error) {
            addToast('Ошибка обновления количества', 'error');
        }
    };

    const handleRemove = async (productId) => {
        try {
            await removeFromCart(productId);
            await loadCart();
            addToast('✓ Товар удален из корзины');
        } catch (error) {
            addToast('Ошибка удаления товара', 'error');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => {
            if (item.product) {
                return sum + (item.product.finalPrice * item.quantity);
            }
            return sum;
        }, 0);
    };

    const handleCheckout = async () => {
        if (!address.country || !address.city || !address.address) {
            addToast('Заполните все поля адреса', 'error');
            return;
        }

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity
                })),
                deliveryAddress: address,
                paymentMethod: paymentMethod
            };

            await createOrder(orderData);
            addToast('✓ Заказ успешно оформлен!');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            addToast('Ошибка оформления заказа', 'error');
        }
    };

    if (!localStorage.getItem('token')) {
        return (
            <div className="page-container">
                <Header />
                <div className="hero-section">
                    <div className="hero-inner">
                        <h1 className="hero-title">Корзина</h1>
                        <p className="hero-subtitle">Войдите, чтобы увидеть корзину</p>
                        <button 
                            onClick={() => navigate('/login')}
                            style={{
                                marginTop: '20px',
                                padding: '12px 32px',
                                background: '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            Войти
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page-container">
                <Header />
                <div className="hero-section">
                    <div className="hero-inner">
                        <div style={{ fontSize: '32px' }}>○</div>
                        <p className="hero-subtitle">Загрузка корзины...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="page-container">
                <Header />
                <div className="hero-section">
                    <div className="hero-inner">
                        <h1 className="hero-title">Корзина пуста</h1>
                        <p className="hero-subtitle">Добавьте товары в корзину</p>
                        <button 
                            onClick={() => navigate('/')}
                            style={{
                                marginTop: '20px',
                                padding: '12px 32px',
                                background: '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }}
                        >
                            В каталог
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (showCheckout) {
        return (
            <div className="page-container">
                <Header />
                
                <div style={{ padding: '60px 40px', maxWidth: '800px', margin: '0 auto' }}>
                    <button 
                        onClick={() => setShowCheckout(false)}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #E5E5E5',
                            background: '#fff',
                            borderRadius: '8px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginBottom: '20px'
                        }}
                    >
                        ← Назад в корзину
                    </button>

                    <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '40px' }}>
                        Оформление заказа
                    </h1>

                    {/* Способ оплаты */}
                    <div style={{ 
                        background: '#fff',
                        border: '1px solid #E5E5E5',
                        borderRadius: '12px',
                        padding: '24px',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                            Способ оплаты
                        </h3>
                        
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <div 
                                onClick={() => setPaymentMethod('visa')}
                                style={{
                                    flex: '1',
                                    minWidth: '150px',
                                    padding: '20px',
                                    border: `2px solid ${paymentMethod === 'visa' ? '#000' : '#E5E5E5'}`,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    background: paymentMethod === 'visa' ? '#F9F9F9' : '#fff',
                                    textAlign: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💳</div>
                                <div style={{ fontWeight: '600' }}>VISA</div>
                            </div>

                            <div 
                                onClick={() => setPaymentMethod('mastercard')}
                                style={{
                                    flex: '1',
                                    minWidth: '150px',
                                    padding: '20px',
                                    border: `2px solid ${paymentMethod === 'mastercard' ? '#000' : '#E5E5E5'}`,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    background: paymentMethod === 'mastercard' ? '#F9F9F9' : '#fff',
                                    textAlign: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💳</div>
                                <div style={{ fontWeight: '600' }}>MasterCard</div>
                            </div>

                            <div 
                                onClick={() => setPaymentMethod('paypal')}
                                style={{
                                    flex: '1',
                                    minWidth: '150px',
                                    padding: '20px',
                                    border: `2px solid ${paymentMethod === 'paypal' ? '#000' : '#E5E5E5'}`,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    background: paymentMethod === 'paypal' ? '#F9F9F9' : '#fff',
                                    textAlign: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🅿️</div>
                                <div style={{ fontWeight: '600' }}>PayPal</div>
                            </div>
                        </div>
                    </div>

                    {/* Адрес доставки */}
                    <div style={{ 
                        background: '#fff',
                        border: '1px solid #E5E5E5',
                        borderRadius: '12px',
                        padding: '24px',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                            Адрес доставки
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '13px', color: '#666', marginBottom: '8px', display: 'block' }}>
                                    Страна
                                </label>
                                <input 
                                    type="text"
                                    value={address.country}
                                    onChange={(e) => setAddress({...address, country: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #E5E5E5',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontFamily: 'Montserrat, sans-serif'
                                    }}
                                    placeholder="Казахстан"
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', color: '#666', marginBottom: '8px', display: 'block' }}>
                                    Город
                                </label>
                                <input 
                                    type="text"
                                    value={address.city}
                                    onChange={(e) => setAddress({...address, city: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #E5E5E5',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontFamily: 'Montserrat, sans-serif'
                                    }}
                                    placeholder="Павлодар"
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', color: '#666', marginBottom: '8px', display: 'block' }}>
                                    Улица, дом, квартира
                                </label>
                                <input 
                                    type="text"
                                    value={address.address}
                                    onChange={(e) => setAddress({...address, address: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #E5E5E5',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontFamily: 'Montserrat, sans-serif'
                                    }}
                                    placeholder="ул. Примерная, д. 1, кв. 1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Итого */}
                    <div style={{ 
                        background: '#fff',
                        border: '1px solid #E5E5E5',
                        borderRadius: '12px',
                        padding: '24px'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            fontSize: '20px',
                            fontWeight: '700',
                            marginBottom: '20px'
                        }}>
                            <span>Итого</span>
                            <span>{calculateTotal().toLocaleString('ru-RU')} ₽</span>
                        </div>

                        <button 
                            onClick={handleCheckout}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Оформить заказ
                        </button>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    return (
        <div className="page-container">
            <Header />
            
            <div style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '40px' }}>
                    Корзина ({cartItems.length})
                </h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
                    {/* Товары */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {cartItems.map(item => (
                            item.product && (
                                <div key={item.product._id} style={{
                                    background: '#fff',
                                    border: '1px solid #E5E5E5',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    display: 'flex',
                                    gap: '20px'
                                }}>
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        background: '#F9F9F9',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '40px'
                                    }}>
                                        📱
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                                            {item.product.name}
                                        </h3>
                                        <p style={{ fontSize: '18px', fontWeight: '600', color: '#000' }}>
                                            {item.product.finalPrice.toLocaleString('ru-RU')} ₽
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <button 
                                                onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    border: '1px solid #E5E5E5',
                                                    background: '#fff',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                −
                                            </button>
                                            <span style={{ fontSize: '16px', fontWeight: '500', width: '30px', textAlign: 'center' }}>
                                                {item.quantity}
                                            </span>
                                            <button 
                                                onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    border: '1px solid #E5E5E5',
                                                    background: '#fff',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => handleRemove(item.product._id)}
                                            style={{
                                                padding: '8px 16px',
                                                border: '1px solid #E5E5E5',
                                                background: '#fff',
                                                borderRadius: '8px',
                                                fontSize: '13px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>

                    {/* Итого */}
                    <div style={{
                        background: '#fff',
                        border: '1px solid #E5E5E5',
                        borderRadius: '12px',
                        padding: '24px',
                        height: 'fit-content',
                        position: 'sticky',
                        top: '100px'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                            Итого
                        </h3>
                        
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            fontSize: '16px',
                            marginBottom: '12px'
                        }}>
                            <span>Товары ({cartItems.length})</span>
                            <span>{calculateTotal().toLocaleString('ru-RU')} ₽</span>
                        </div>

                        <div style={{ 
                            borderTop: '1px solid #E5E5E5',
                            paddingTop: '16px',
                            marginTop: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '20px',
                            fontWeight: '700'
                        }}>
                            <span>Итого</span>
                            <span>{calculateTotal().toLocaleString('ru-RU')} ₽</span>
                        </div>

                        <button 
                            onClick={() => setShowCheckout(true)}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: '600',
                                marginTop: '20px',
                                cursor: 'pointer'
                            }}
                        >
                            Оформить заказ
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

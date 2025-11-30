import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNewProducts, addToCart } from '../../api/client';
import { useToast } from '../../components/Toast';

export default function NewProductsSection(){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getNewProducts();
                setProducts(data);
            } catch (err) {
                setError('Ошибка загрузки товаров');
                console.error('Error loading products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = async (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            addToast('Войдите, чтобы добавить товар в корзину', 'error');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        try {
            await addToCart(product._id, 1);
            addToast(`✓ ${product.name} добавлен в корзину`);
        } catch (error) {
            console.error('Ошибка добавления в корзину:', error);
            addToast('Ошибка добавления в корзину', 'error');
        }
    };

    if (loading) {
        return (
            <section className="popular-products">
                <h2 className="section-title">Новые поступления</h2>
                <div className="loading-container">
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>○</div>
                    <div>Загрузка...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="popular-products">
                <h2 className="section-title">Новые поступления</h2>
                <div className="error-container">
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>✕</div>
                    <div>{error}</div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return (
            <section className="popular-products">
                <h2 className="section-title">Новые поступления</h2>
                <div className="empty-container">
                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>□</div>
                    <div>Новых товаров пока нет</div>
                </div>
            </section>
        );
    }

    return(
         <section className="popular-products">
            <h2 className="section-title">Новые поступления</h2>
            
            <div className="products-grid">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        <div className="product-image">
                            {getEmojiForCategory(product.category)}
                        </div>
                        
                        <div className="product-details">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '8px'
                            }}>
                                <h3 className="product-name">{product.name}</h3>
                                <div style={{
                                    background: '#000000',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap'
                                }}>
                                    NEW
                                </div>
                            </div>
                            
                            <div className="product-price">
                                {product.discount > 0 ? (
                                    <>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px',
                                            fontSize: '13px',
                                            color: '#999999'
                                        }}>
                                            <span style={{ textDecoration: 'line-through' }}>
                                                {product.price.toLocaleString('ru-RU')} ₽
                                            </span>
                                            <span style={{ 
                                                color: '#000000',
                                                fontWeight: '500'
                                            }}>
                                                -{product.discount}%
                                            </span>
                                        </div>
                                        <span style={{ 
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#000000'
                                        }}>
                                            {product.finalPrice.toLocaleString('ru-RU')} ₽
                                        </span>
                                    </>
                                ) : (
                                    <span style={{ 
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#000000'
                                    }}>
                                        {product.price.toLocaleString('ru-RU')} ₽
                                    </span>
                                )}
                            </div>
                            
                            <button 
                                className="add-to-cart-button"
                                onClick={() => handleAddToCart(product)}
                            >
                                В корзину
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

function getEmojiForCategory(category) {
    const emojis = {
        electronics: '📱',
        clothing: '👕',
        food: '🍕',
        books: '📚',
        toys: '🧸',
        sports: '⚽',
        home: '🏠',
        other: '🎁'
    };
    return emojis[category] || '○';
}

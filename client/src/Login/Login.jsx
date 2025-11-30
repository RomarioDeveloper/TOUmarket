import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/client';
import { useToast } from '../components/Toast';
import '../Main/Main.css';

export default function Login(){
    const [formData, setFormData] = useState({ login: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData.login, formData.password);
            addToast('✓ Успешная авторизация!');
            setTimeout(() => navigate('/'), 1000);
        } catch (err) {
            addToast(err.message || 'Ошибка авторизации', 'error');
        } finally {
            setLoading(false);
        }
    };

    return(
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        padding: '20px'
    }}>
        <div style={{
            width: '100%',
            maxWidth: '400px'
        }}>
            <Link to="/" style={{ 
                textDecoration: 'none',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '40px'
            }}>
                <div style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#000',
                    letterSpacing: '-0.5px'
                }}>
                    TOU
                </div>
            </Link>

            <div style={{
                background: '#fff',
                border: '1px solid #E5E5E5',
                borderRadius: '12px',
                padding: '40px'
            }}>
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    color: '#000'
                }}>
                    Войти
                </h1>
                <p style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '32px'
                }}>
                    Войдите в свой аккаунт
                </p>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ 
                            fontSize: '13px', 
                            fontWeight: '500',
                            color: '#000',
                            marginBottom: '8px',
                            display: 'block'
                        }}>
                            Логин
                        </label>
                        <input 
                            type="text" 
                            value={formData.login}
                            onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                            disabled={loading}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #E5E5E5',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontFamily: 'Montserrat, sans-serif'
                            }}
                            placeholder="Введите логин"
                        />
                    </div>
                    
                    <div>
                        <label style={{ 
                            fontSize: '13px', 
                            fontWeight: '500',
                            color: '#000',
                            marginBottom: '8px',
                            display: 'block'
                        }}>
                            Пароль
                        </label>
                        <input 
                            type="password" 
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            disabled={loading}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #E5E5E5',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontFamily: 'Montserrat, sans-serif'
                            }}
                            placeholder="Введите пароль"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            marginTop: '8px'
                        }}
                    >
                        {loading ? 'Загрузка...' : 'Войти'}
                    </button>

                    <div style={{ 
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#666',
                        marginTop: '8px'
                    }}>
                        Нет аккаунта?{' '}
                        <Link to="/register" style={{ 
                            color: '#000',
                            fontWeight: '600',
                            textDecoration: 'none'
                        }}>
                            Регистрация
                        </Link>
                    </div>
                </form>
            </div>

            <div style={{
                textAlign: 'center',
                marginTop: '24px',
                fontSize: '13px',
                color: '#999'
            }}>
                Тестовый аккаунт: buyer1 / buyer123
            </div>
        </div>
    </div>
    )
}



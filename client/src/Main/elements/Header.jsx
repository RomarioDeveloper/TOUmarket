import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logout } from "../../api/client";

export default function Header() {
    const location = useLocation();
    const path = location.pathname;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, [location]);

    const handleLogout = () => {
        logout();
        setUser(null);
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                        src="https://tou.edu.kz/images/logo.png" 
                        alt="TOU" 
                        style={{ height: '40px' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="logo">TOU</div>
                </Link>

                <div className="search-wrapper">
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Поиск товаров..."
                    />
                    <button className="search-button">Найти</button>
                </div>

                <div className="header-buttons">
                    <Link to="/cart">
                        <button className="cart-button">Корзина</button>
                    </Link>

                    {user ? (
                        <div className="user-profile-card">
                            <div className="user-avatar">
                                {user.login.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-info">
                                <div className="user-name">{user.login}</div>
                                <div className="user-role">
                                    {user.role === 'admin' ? 'Администратор' : 
                                     user.role === 'seller' ? 'Продавец' : 
                                     'Покупатель'}
                                </div>
                            </div>
                            <button 
                                className="login-button" 
                                onClick={handleLogout}
                                style={{
                                    marginLeft: '8px',
                                    padding: '8px 16px',
                                    height: '36px'
                                }}
                            >
                                Выйти
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="login-button">Войти</button>
                            </Link>

                            <Link to="/register">
                                <button className="register-button">Регистрация</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <nav className="navigation">
                <Link to="/">
                    <button className={`nav-tab ${path === "/" ? "nav-tab-active" : ""}`}>
                        Каталог
                    </button>
                </Link>

                <Link to="/new">
                    <button className={`nav-tab ${path === "/new" ? "nav-tab-active" : ""}`}>
                        Новинки
                    </button>
                </Link>

                <Link to="/cart">
                    <button className={`nav-tab ${path === "/cart" ? "nav-tab-active" : ""}`}>
                        Корзина
                    </button>
                </Link>

                <button className="nav-tab" disabled>
                    Контакты
                </button>
            </nav>
        </header>
    );
}

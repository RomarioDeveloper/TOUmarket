

export default function Footer(){
    return(
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-column">
                    <h3 className="footer-heading">Покупателю</h3>
                    <a href="#" className="footer-link">Витрина товаров</a>
                    <a href="#" className="footer-link">Все продавцы</a>
                    <a href="#" className="footer-link">Личный кабинет</a>
                    <a href="#" className="footer-link">Помощь</a>
                </div>
                
                <div className="footer-column">
                    <h3 className="footer-heading">Продавцу</h3>
                    <a href="#" className="footer-link">Стать продавцом</a>
                    <a href="#" className="footer-link">Кабинет продавца</a>
                    <a href="#" className="footer-link">Помощь</a>
                </div>
                
                <div className="footer-column">
                    <h3 className="footer-heading">Справка</h3>
                    <a href="#" className="footer-link">Обратная связь</a>
                    <a href="#" className="footer-link">Политики конфиденциальности</a>
                </div>
            </div>
            
            <div className="copyright">© 2022-2025 [Название] Все права защищены</div>
        </footer>
    )
}
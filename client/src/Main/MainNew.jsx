import './Main.css'
import Header from './elements/Header'
import Footer from './elements/Footer'
import NewProductsSection from './elements/NewProductsSection'

export default function MainNew(){
     return (
    <div className="page-container">
        <Header />
        
        <div className="hero-section">
            <div className="hero-inner">
                <h1 className="hero-title">Новые поступления</h1>
                <p className="hero-subtitle">Свежие товары каждую неделю</p>
            </div>
        </div>
        
        <NewProductsSection />
        
        <Footer />
    </div>
  )
}

    
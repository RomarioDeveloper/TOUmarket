import Header from "./elements/Header";
import Psection from "./elements/ProductsSection";
import Footer from "./elements/Footer";
import './Main.css'

function MainCat() {
  return (
    <div className="page-container">
        <Header />
        
        <div className="hero-section">
            <div className="hero-inner">
                <h1 className="hero-title">TOU</h1>
                <p className="hero-subtitle">Торайгыров Университет - Маркетплейс</p>
            </div>
        </div>
        
        <Psection />
        <Footer />
    </div>
  );
}

export default MainCat;

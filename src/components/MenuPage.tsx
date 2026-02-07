import React, { useState, useEffect, useCallback } from 'react';
import { getMenu } from '../api/products';
import './MenuPage.css';

interface MenuItem {
  id: number;
  name: string;
  price: string;
  description: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  items: MenuItem[];
}

const MenuPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [loading, setLoading] = useState(true);

  const spreads = [
    { title: 'Cover', categories: [] },
    { title: 'Café & Thé', categories: ['cafe', 'the', 'boissons', 'eau'] },
    { title: 'Pâtisseries & Salée', categories: ['patisseries', 'salee', 'narguile'] },
    { title: 'Jeux & Fin', categories: ['jeux'] }
  ];

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getMenu();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const goToCategory = (spreadIndex: number) => {
    setCurrentSpread(spreadIndex);
  };

  const changePage = (direction: number) => {
    const newSpread = currentSpread + direction;
    if (newSpread >= 0 && newSpread < (spreads.length + 1)) {
      setCurrentSpread(newSpread);
    }
  };

  const getCategoriesForSpread = (spreadIndex: number) => {
    const spread = spreads[spreadIndex];
    return categories.filter(cat => spread.categories.includes(cat.id));
  };

  const renderIcon = (icon: string) => {
    const isImage = /\.(png|jpg|jpeg|svg|webp)$/i.test(icon);
    if (isImage) {
      return <img src={icon} alt="icon" className="category-icon-img" />;
    }
    return <span className="category-icon-emoji">{icon}</span>;
  };

  const renderPage = (spreadIndex: number) => {
    // Cover Page
    if (spreadIndex === 0) {
      return (
        <div className="page full-page cover-page">
          <div className="cover-content">
            <h1 className="cover-logo">Café Carthage</h1>
            <div className="cover-divider"></div>
            <p className="cover-subtitle">Djerba</p>
            <p className="cover-tagline">Une expérience authentique dans le cœur de Carthage</p>
          </div>
          <div className="page-header">
            <h2 className="page-title">Bienvenue</h2>
            <p className="page-subtitle">Notre Menu</p>
          </div>
          <div className="category-nav">
            {categories.map(category => (
              <button 
                key={category.id}
                className="category-btn"
                onClick={() => {
                  const index = spreads.findIndex(s => s.categories.includes(category.id));
                  if (index !== -1) goToCategory(index);
                }}
              >
                {renderIcon(category.icon)}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
          <div className="page-number">1</div>
        </div>
      );
    }
    else if (spreadIndex === spreads.length ) {
      return (
        <div
            className="page full-page thankyou-page"
            style={{
              background: "linear-gradient(135deg,#00897b,#00695c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div style={{ textAlign: "center", color: "#fff" }}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "3rem",
                  marginBottom: "20px",
                  fontStyle: "italic"
                }}
              >
                Merci!
              </h2>
          
              <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
                شكرا
              </p>
          
              <div
                style={{
                  width: "80px",
                  height: "2px",
                  background: "#fff",
                  margin: "0 auto 30px"
                }}
              />
          
              <p style={{ fontSize: "1rem", opacity: 0.9 }}>Café Carthage</p>
          
              
            </div>
          
            <div className="page-number">{currentSpread + 1} / {spreads.length +1}</div>
          </div>

      );
    }
    // Menu Spreads
    const spreadCategories = getCategoriesForSpread(spreadIndex);
    return (
      <div className="page full-page">
        {spreadCategories.map(category => (
          <div key={category.id} className="menu-section">
            <div className="section-header">
              {renderIcon(category.icon)}
              <h3 className="section-title">{category.name}</h3>
            </div>
            {(category.items || []).map(item => (
              <div key={item.id} className="menu-item">
                <div className="item-header">
                  <span className="item-name">{item.name}</span>
                  <span className="item-dots"></span>
                  <span className="item-price">{item.price}</span>
                </div>
                {item.description && <p className="item-description">{item.description}</p>}
              </div>
            ))}
          </div>
        ))}
        <div className="page-number">{spreadIndex + 1}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="magazine-wrapper">
        <div className="page-spread active">
          {renderPage(currentSpread)}
        </div>

        {/* Navigation */}
        <div className="navigation">
          <button 
            className="nav-btn" 
            onClick={() => changePage(-1)}
            disabled={currentSpread === 0}
          >
            ← Précédent
          </button>
          <button 
            className="nav-btn" 
            onClick={() => changePage(1)}
            disabled={currentSpread === spreads.length - 1}
          >
            Suivant →
          </button>
        </div>
        <div className="page-indicator">
          Page {currentSpread + 1} / {spreads.length +1}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;

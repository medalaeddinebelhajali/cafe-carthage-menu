import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getMenu } from '../api/products';
import { motion } from 'framer-motion';
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
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getMenu();
      setCategories(data);
      setActiveCategory('all');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const selectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);

    // Scroll to the top of the menu container when a filter is clicked
    // so they are brought back up to see the items if they were scrolled down.
    const element = document.querySelector('.menu-container');
    if (element) {
      const yOffset = -90; // Offset for sticky navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      // Only scroll up if they are currently lower down the page
      if (window.scrollY > y) {
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const renderIcon = (icon: string) => {
    const isImage = /\.(png|jpg|jpeg|svg|webp)$/i.test(icon);
    if (isImage) {
      return <img src={icon} alt="icon" className="category-icon-img" />;
    }
    return <span className="category-icon-emoji">{icon}</span>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Chargement...</div>
      </div>
    );
  }

  const displayedCategories = activeCategory === 'all'
    ? categories
    : categories.filter(c => c.id === activeCategory);

  return (
    <div className="single-menu-page">
      {/* Hero Cover Section */}
      <div className="hero-cover">
        <div className="hero-overlay">
          <Link to="/apropos" className="about-link" style={{ position: 'absolute', top: '0.2rem', right: '0.2rem', color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, background: 'rgba(0, 0, 0, 0.3)', padding: '0.5rem 1rem', borderRadius: '20px', backdropFilter: 'blur(5px)' }}>À Propos de Nous</Link>
          <img src="/images/logo.png" alt="icon" className="logo-img" />
          <h1 className="hero-logo"></h1>
          <div className="hero-divider"></div>
          <p className="hero-subtitle">Djerba</p>
          <p className="hero-tagline">Une expérience authentique dans le cœur de Djerba</p>
        </div>
      </div>

      {/* Sticky Navbar */}
      <div className="sticky-navbar">
        <div className="nav-container">
          {/* Tous Button acts as "Show All" filter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              className={`nav-category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => selectCategory('all')}
            >
              <span className="category-icon-emoji">🍽️</span>
              <span>Tous</span>
            </button>
          </motion.div>

          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: (index + 1) * 0.05 }}
            >
              <button
                className={`nav-category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => selectCategory(cat.id)}
              >
                {renderIcon(cat.icon)}
                <span>{cat.name}</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <div className="menu-container">
        {displayedCategories.map((category) => (
          <div key={category.id} id={`category-${category.id}`} className="menu-section">
            <div className="section-header">
              {renderIcon(category.icon)}
              <h3 className="section-title">{category.name}</h3>
            </div>

            <motion.div 
              className="items-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {(category.items || []).map(item => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                  }}
                  style={{ width: '100%' }}
                >
                  <div className="menu-item-card">
                    <div className="item-header">
                      <span className="item-name">{item.name}</span>
                      <span className="item-dots"></span>
                      <span className="item-price">{item.price}</span>
                    </div>
                    {item.description && <p className="item-description">{item.description}</p>}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}

        {/* Thank You Footer */}
        <div className="thank-you-footer">
          <h2 className="thank-you-title">Merci!</h2>
          <div className="thank-you-divider"></div>
          <p className="thank-you-text">Café Carthage</p>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;

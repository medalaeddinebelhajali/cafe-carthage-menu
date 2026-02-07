import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, getCategories, addProduct, updateProduct, deleteProduct } from '../api/products';
import './AdminDashboard.css';
interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  category_id: string;
  categoryName?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, []);
  const ADMIN_USER = "e7d9f30c08ff75b134bd6f6d54a22d25e6ceb5ddaa2f1a42721f279665d4c34a";

/* password: 123456 */
const ADMIN_HASH ="6a13f0c7a3ba956bab2bcd38138002f12cd0e5b94a19e3467c1e41b884425765"; // example hash (we generate below)

async function sha256(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
  useEffect(() => {
    const checkAdmin = async () => {
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
  
      const hashed1 = await sha256(username);
      const hashed2 = await sha256(password);
  
      if (hashed1 !== ADMIN_USER || hashed2 !== ADMIN_HASH) {
        window.location.href = "/login";
      }
    };
  
    checkAdmin();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.price || !formData.categoryId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
        setSuccess('Product updated successfully!');
      } else {
        await addProduct(formData);
        setSuccess('Product added successfully!');
      }
      
      setFormData({ name: '', price: '', description: '', categoryId: '' });
      setEditingId(null);
      fetchData();
    } catch (error) {
      setError('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      categoryId: product.category_id
    });
    setEditingId(product.id);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(id);
      setSuccess('Product deleted successfully!');
      fetchData();
    } catch (error) {
      setError('Error deleting product');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', price: '', description: '', categoryId: '' });
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }
  const renderIcon = (icon: string) => {
    const isImage = /\.(png|jpg|jpeg|svg|webp)$/i.test(icon);
  
    if (isImage) {
      return (
        <img
          src={icon}
          alt="icon"
          className="category-icon-img"
        />
      );
    }
  
    return <span className="category-icon-emoji">{icon}</span>;
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>📋 Admin Dashboard</h1>
        <p>Manage Café Carthage Menu Products</p>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="admin-content">
        <div className="form-section">
          <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="text"
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g., 2.5 DT"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {renderIcon(category.icon)} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Optional description"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="products-section">
          <h2>Products ({products.length})</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">{product.price}</p>
                  <p className="category">{product.categoryName}</p>
                  {product.description && (
                    <p className="description">{product.description}</p>
                  )}
                </div>
                <div className="product-actions">
                  <button
                    onClick={() => handleEdit(product)}
                    className="btn btn-edit"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn btn-delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

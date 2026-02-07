import { supabase } from '../lib/supabaseClient';

// Get all categories with their products
export const getMenu = async () => {
  try {
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('id');

    if (categoriesError) throw categoriesError;

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('id');

    if (productsError) throw productsError;

    // Group products by category
    const menu = categories.map(category => ({
      ...category,
      items: products.filter(product => product.category_id === category.id)
    }));

    return menu;
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
};

// Get all products (for admin)
export const getProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (name)
      `)
      .order('id');

    if (error) throw error;

    return data.map(product => ({
      ...product,
      categoryName: product.categories?.name || 'Unknown'
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get all categories (for admin)
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Add new product
export const addProduct = async (productData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name,
        price: productData.price,
        description: productData.description || '',
        category_id: productData.categoryId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (id, productData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        price: productData.price,
        description: productData.description || '',
        category_id: productData.categoryId
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

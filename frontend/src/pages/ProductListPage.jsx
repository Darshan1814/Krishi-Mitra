import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Calendar, Phone } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const ProductListPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    image: null,
    contact: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = () => {
    // Get products from localStorage
    const storedProducts = localStorage.getItem(`products_${category}`);
    if (storedProducts) {
      const parsedProducts = JSON.parse(storedProducts);
      setProducts(Array.isArray(parsedProducts) ? parsedProducts : []);
    } else {
      // Initialize with fallback data
      const fallbackData = getFallbackData();
      setProducts(Array.isArray(fallbackData) ? fallbackData : []);
      localStorage.setItem(`products_${category}`, JSON.stringify(fallbackData));
    }
  };

  const getFallbackData = () => {
    // Return empty array - no default products
    return [];
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newId = Array.isArray(products) && products.length > 0 ? Math.max(...products.map(p => p.id), 0) + 1 : 1;
    const productToAdd = {
      ...newProduct,
      id: newId,
      category,
      date: new Date().toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    };
    
    const updatedProducts = [...(Array.isArray(products) ? products : []), productToAdd];
    setProducts(updatedProducts);
    localStorage.setItem(`products_${category}`, JSON.stringify(updatedProducts));
    
    setNewProduct({ name: '', description: '', price: '', location: '', image: null, contact: '' });
    setShowAddForm(false);
  };

  const getCategoryTitle = () => {
    switch(category) {
      case 'farmer-to-farmer': return 'Farmer to Farmer Products';
      case 'farmer-to-business': return 'Farmer to Business Products';
      case 'business-to-farmer': return 'Business to Farmer Products';
      default: return 'Products';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/ecommerce" className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">
              <TranslatableText>{getCategoryTitle()}</TranslatableText>
            </h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            <TranslatableText>Add Product</TranslatableText>
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">
                <TranslatableText>Add New Product</TranslatableText>
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full p-3 border rounded-lg h-24"
                  required
                />
                <input
                  type="text"
                  placeholder="Price (e.g., ₹45/kg)"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newProduct.location}
                  onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  value={newProduct.contact}
                  onChange={(e) => setNewProduct({...newProduct, contact: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setNewProduct({...newProduct, image: e.target.result});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                  {newProduct.image && (
                    <img src={newProduct.image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
                  )}
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                  >
                    <TranslatableText>Add Product</TranslatableText>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
                  >
                    <TranslatableText>Cancel</TranslatableText>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(products) && products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-56 object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300';
                }}
              />
              <div className="p-6">
                <h3 className="font-bold text-gray-800 mb-3 text-xl">{product.name}</h3>
                {product.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
                )}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-green-600" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{product.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-purple-600" />
                    <span>{product.contact}</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="text-2xl font-bold text-green-600 mb-4">{product.price}</div>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                    <TranslatableText>Contact Seller</TranslatableText>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {Array.isArray(products) && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              <TranslatableText>No products found. Be the first to add a product!</TranslatableText>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
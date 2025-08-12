import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import LanguageToggle from '../components/LanguageToggle';

const FertilizerStorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');

  const texts = {
    en: {
      title: 'Fertilizer Store - Agricultural Products',
      subtitle: 'Find the best fertilizers, pesticides, and seeds for your farm',
      noResults: 'No products found. Try searching for fertilizers, pesticides, or seeds.',
      error: 'Error searching products. Please try again.'
    },
    hi: {
      title: 'उर्वरक स्टोर - कृषि उत्पाद',
      subtitle: 'अपने खेत के लिए सबसे अच्छे उर्वरक, कीटनाशक और बीज खोजें',
      noResults: 'कोई उत्पाद नहीं मिला। उर्वरक, कीटनाशक या बीज खोजने का प्रयास करें।',
      error: 'उत्पाद खोजने में त्रुटि। कृपया पुनः प्रयास करें।'
    }
  };

  const t = texts[language];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Mock data for fertilizer products
      const mockProducts = [
        {
          id: 1,
          name: `${searchQuery} - Premium Quality`,
          image: 'https://5.imimg.com/data5/SELLER/Default/2023/1/YH/KN/WX/181565623/urea-fertilizer.jpg',
          price: '₹450',
          rating: 4.2,
          platform: 'Amazon'
        },
        {
          id: 2,
          name: `${searchQuery} - Organic`,
          image: 'https://5.imimg.com/data5/SELLER/Default/2022/8/KL/MN/OP/987654321/npk-fertilizer.jpg',
          price: '₹380',
          rating: 4.5,
          platform: 'BigHaat'
        },
        {
          id: 3,
          name: `${searchQuery} - Bulk Pack`,
          image: 'https://5.imimg.com/data5/SELLER/Default/2023/2/AB/CD/EF/123456789/dap-fertilizer.jpg',
          price: '₹520',
          rating: 4.1,
          platform: 'Flipkart'
        }
      ];
      
      setProducts(mockProducts);
      setError(null);
    } catch (error) {
      console.error('Search error:', error);
      setError(t.error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <LanguageToggle language={language} setLanguage={setLanguage} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t.title}</h1>
          <p className="text-gray-600 text-lg mb-6">{t.subtitle}</p>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          language={language}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Searching products...</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && searchQuery && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">{t.noResults}</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FertilizerStorePage;
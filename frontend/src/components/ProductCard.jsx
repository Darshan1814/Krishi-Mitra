import React, { useState } from 'react';

const ProductCard = ({ product, language }) => {
  const [imageError, setImageError] = useState(false);
  
  const texts = {
    en: {
      orderNow: 'Order Now',
      rating: 'Rating'
    },
    hi: {
      orderNow: 'अभी ऑर्डर करें',
      rating: 'रेटिंग'
    }
  };

  const t = texts[language];
  
  const fallbackImage = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <img 
        src={imageError ? fallbackImage : product.image} 
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-3"
        onError={() => setImageError(true)}
      />
      <h3 className="font-semibold text-lg mb-2 text-gray-800">{product.name}</h3>
      <div className="flex justify-between items-center mb-3">
        <span className="text-xl font-bold text-green-600">{product.price}</span>
        <div className="flex items-center">
          <span className="text-yellow-500">★</span>
          <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
        </div>
      </div>
      <div className="text-xs text-gray-500 mb-3">
        Available on {product.platform}
      </div>
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-center block"
      >
        {t.orderNow}
      </a>
    </div>
  );
};

export default ProductCard;
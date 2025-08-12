import React from 'react';
import { ShoppingBag, Star, ExternalLink } from 'lucide-react';
import TranslatableText from './TranslatableText';

const ProductSearchCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-green-100">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop';
          }}
        />
        <span className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          {product.platform}
        </span>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center mb-3">
          <Star className="text-yellow-400 fill-current" size={16} />
          <span className="ml-1 text-gray-600 text-sm">{product.rating}</span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-green-600">{product.price}</span>
          <span className="text-sm text-gray-500">on {product.platform}</span>
        </div>
        
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors font-medium"
        >
          <ShoppingBag size={16} />
          <span><TranslatableText>Buy Now</TranslatableText></span>
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

export default ProductSearchCard;
import React, { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import TranslatableText from './TranslatableText';

const AdBanner = ({ title, description, imageUrl, linkUrl, onClose }) => {
  return (
    <div className="relative bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 shadow-md">
      <div className="flex items-center">
        {imageUrl && (
          <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 flex-shrink-0">
            <img src={imageUrl} alt="Ad" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          {linkUrl && (
            <a 
              href={linkUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:text-green-700 flex items-center mt-1"
            >
              <TranslatableText>Learn More</TranslatableText>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          )}
        </div>
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default AdBanner;
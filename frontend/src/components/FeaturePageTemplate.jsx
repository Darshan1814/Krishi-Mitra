import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturePageTemplate = ({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  actions = null,
  bgColor = "from-green-50 to-white"
}) => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgColor}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              {Icon && (
                <div className="p-3 bg-green-100 rounded-lg">
                  <Icon size={24} className="text-green-600" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                {description && (
                  <p className="text-gray-600 mt-1">{description}</p>
                )}
              </div>
            </div>
          </div>
          {actions && (
            <div className="flex space-x-2">
              {actions}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FeaturePageTemplate;

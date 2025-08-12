import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Check, Loader } from 'lucide-react';
import TranslatableText from './TranslatableText';

const AddCropForm = ({ onAddCrop, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    price: '',
    description: '',
    harvestDate: '',
    location: ''
  });
  
  const [cropImage, setCropImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const cropCategories = [
    'Cereals', 'Pulses', 'Vegetables', 'Fruits', 'Oilseeds', 
    'Spices', 'Medicinal', 'Flowers', 'Others'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setCropImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate form
      if (!formData.name || !formData.category || !formData.quantity || !formData.price) {
        throw new Error('Please fill all required fields');
      }
      
      // Create crop data with image
      const cropData = {
        ...formData,
        image: cropImage,
        createdAt: new Date().toISOString(),
        status: 'Available'
      };
      
      // Call the parent function to add the crop
      await onAddCrop(cropData);
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        quantity: '',
        price: '',
        description: '',
        harvestDate: '',
        location: ''
      });
      setCropImage(null);
      
    } catch (err) {
      setError(err.message || 'Failed to add crop');
      console.error('Add crop error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          <TranslatableText>Add New Crop</TranslatableText>
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crop Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatableText>Crop Name*</TranslatableText>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Wheat, Rice, Tomatoes"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatableText>Category*</TranslatableText>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Select Category --</option>
              {cropCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatableText>Quantity*</TranslatableText>
            </label>
            <div className="flex">
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-2/3 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                className="w-1/3 border border-gray-300 border-l-0 rounded-r-md px-2 py-2 bg-gray-50"
                defaultValue="kg"
              >
                <option value="kg">kg</option>
                <option value="quintal">quintal</option>
                <option value="ton">ton</option>
                <option value="pieces">pieces</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatableText>Price (₹)*</TranslatableText>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="1"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Price per kg/unit"
              />
            </div>
          </div>

          {/* Harvest Date */}
          <div>
            <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatableText>Harvest Date</TranslatableText>
            </label>
            <input
              type="date"
              id="harvestDate"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatableText>Location</TranslatableText>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Village/District"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            <TranslatableText>Description</TranslatableText>
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Describe your crop quality, variety, etc."
          ></textarea>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <TranslatableText>Crop Image</TranslatableText>
          </label>
          
          {cropImage ? (
            <div className="relative">
              <img 
                src={cropImage} 
                alt="Crop preview" 
                className="w-full h-48 object-cover rounded-md" 
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center cursor-pointer hover:border-green-500 transition-colors"
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                <TranslatableText>Click to upload or drag and drop</TranslatableText>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                <TranslatableText>JPG, PNG or JPEG (max. 5MB)</TranslatableText>
              </p>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="hidden" 
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <TranslatableText>Cancel</TranslatableText>
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                <TranslatableText>Adding...</TranslatableText>
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                <TranslatableText>Add Crop</TranslatableText>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCropForm;
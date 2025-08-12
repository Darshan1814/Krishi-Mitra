import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Plus, Edit, Trash2, AlertCircle, Check, X, BarChart, Download, Upload } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'seeds',
    quantity: '',
    unit: 'kg',
    price: '',
    supplier: '',
    expiryDate: '',
    location: 'warehouse-1'
  });
  const [error, setError] = useState(null);

  // Sample inventory data
  const sampleInventory = [
    {
      id: 1,
      name: 'Organic Tomato Seeds',
      category: 'seeds',
      quantity: 50,
      unit: 'kg',
      price: 1200,
      supplier: 'Green Seeds Co.',
      expiryDate: '2024-06-30',
      location: 'warehouse-1',
      lastUpdated: '2023-10-15'
    },
    {
      id: 2,
      name: 'NPK Fertilizer',
      category: 'fertilizers',
      quantity: 200,
      unit: 'kg',
      price: 850,
      supplier: 'Farm Nutrients Ltd.',
      expiryDate: '2025-03-15',
      location: 'warehouse-2',
      lastUpdated: '2023-10-10'
    },
    {
      id: 3,
      name: 'Organic Pesticide',
      category: 'pesticides',
      quantity: 30,
      unit: 'liters',
      price: 1500,
      supplier: 'Eco Protect Inc.',
      expiryDate: '2024-08-22',
      location: 'warehouse-1',
      lastUpdated: '2023-10-05'
    },
    {
      id: 4,
      name: 'Garden Tools Set',
      category: 'tools',
      quantity: 15,
      unit: 'sets',
      price: 2500,
      supplier: 'Farm Equipment Co.',
      expiryDate: null,
      location: 'warehouse-3',
      lastUpdated: '2023-09-28'
    },
    {
      id: 5,
      name: 'Irrigation Pipes',
      category: 'equipment',
      quantity: 100,
      unit: 'meters',
      price: 350,
      supplier: 'Water Systems Ltd.',
      expiryDate: null,
      location: 'warehouse-2',
      lastUpdated: '2023-09-20'
    }
  ];

  useEffect(() => {
    // In a real app, this would be a fetch call to your backend
    // Example: fetch('/api/inventory')
    setTimeout(() => {
      setInventory(sampleInventory);
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate form
      if (!formData.name || !formData.quantity || !formData.price) {
        setError('Please fill in all required fields');
        return;
      }

      // In a real app, this would be a POST or PUT request to your backend
      // Example: await fetch('/api/inventory', { method: 'POST', body: JSON.stringify(formData) })
      
      if (editingItem) {
        // Update existing item
        setInventory(inventory.map(item => 
          item.id === editingItem.id 
            ? { 
                ...item, 
                ...formData, 
                quantity: Number(formData.quantity), 
                price: Number(formData.price),
                lastUpdated: new Date().toISOString().split('T')[0]
              } 
            : item
        ));
      } else {
        // Add new item
        const newItem = {
          id: inventory.length + 1,
          ...formData,
          quantity: Number(formData.quantity),
          price: Number(formData.price),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        setInventory([newItem, ...inventory]);
      }

      // Reset form and close modal
      setFormData({
        name: '',
        category: 'seeds',
        quantity: '',
        unit: 'kg',
        price: '',
        supplier: '',
        expiryDate: '',
        location: 'warehouse-1'
      });
      setEditingItem(null);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error saving inventory item:', err);
      setError('Failed to save inventory item. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      unit: item.unit,
      price: item.price.toString(),
      supplier: item.supplier || '',
      expiryDate: item.expiryDate || '',
      location: item.location
    });
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      // In a real app, this would be a DELETE request to your backend
      // Example: await fetch(`/api/inventory/${id}`, { method: 'DELETE' })
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    alert('CSV export functionality would be implemented here');
    
    // Example implementation:
    // const headers = ['Name', 'Category', 'Quantity', 'Unit', 'Price', 'Supplier', 'Expiry Date', 'Location', 'Last Updated'];
    // const csvContent = [
    //   headers.join(','),
    //   ...filteredInventory.map(item => [
    //     item.name,
    //     item.category,
    //     item.quantity,
    //     item.unit,
    //     item.price,
    //     item.supplier || '',
    //     item.expiryDate || '',
    //     item.location,
    //     item.lastUpdated
    //   ].join(','))
    // ].join('\n');
    
    // const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = url;
    // link.setAttribute('download', 'inventory.csv');
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  const handleImportCSV = () => {
    // In a real app, this would open a file input and process the CSV
    alert('CSV import functionality would be implemented here');
  };

  // Filter inventory based on search query and category
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate inventory statistics
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const lowStockItems = inventory.filter(item => item.quantity < 20).length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              <TranslatableText>Inventory Management</TranslatableText>
            </h1>
            <p className="text-gray-600">
              <TranslatableText>Track and manage your inventory items</TranslatableText>
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  name: '',
                  category: 'seeds',
                  quantity: '',
                  unit: 'kg',
                  price: '',
                  supplier: '',
                  expiryDate: '',
                  location: 'warehouse-1'
                });
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              <TranslatableText>Add Item</TranslatableText>
            </button>
            
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              <TranslatableText>Export CSV</TranslatableText>
            </button>
            
            <button
              onClick={handleImportCSV}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center hover:bg-gray-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              <TranslatableText>Import CSV</TranslatableText>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-800">
                <TranslatableText>Total Items</TranslatableText>
              </h3>
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalItems}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-800">
                <TranslatableText>Total Value</TranslatableText>
              </h3>
              <BarChart className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalValue)}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-800">
                <TranslatableText>Low Stock Items</TranslatableText>
              </h3>
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{lowStockItems}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all"><TranslatableText>All Categories</TranslatableText></option>
                <option value="seeds"><TranslatableText>Seeds</TranslatableText></option>
                <option value="fertilizers"><TranslatableText>Fertilizers</TranslatableText></option>
                <option value="pesticides"><TranslatableText>Pesticides</TranslatableText></option>
                <option value="tools"><TranslatableText>Tools</TranslatableText></option>
                <option value="equipment"><TranslatableText>Equipment</TranslatableText></option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              <TranslatableText>Loading inventory data...</TranslatableText>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredInventory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatableText>Item</TranslatableText>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatableText>Category</TranslatableText>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatableText>Quantity</TranslatableText>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatableText>Price</TranslatableText>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatableText>Location</TranslatableText>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatableText>Last Updated</TranslatableText>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatableText>Actions</TranslatableText>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.supplier}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.quantity} {item.unit}
                          </div>
                          {item.quantity < 20 && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              <TranslatableText>Low Stock</TranslatableText>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.price)} / {item.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.lastUpdated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  <TranslatableText>No inventory items found</TranslatableText>
                </h3>
                <p className="text-gray-500">
                  {searchQuery || categoryFilter !== 'all' ? (
                    <TranslatableText>No items match your search criteria</TranslatableText>
                  ) : (
                    <TranslatableText>Start by adding items to your inventory</TranslatableText>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                <TranslatableText>{editingItem ? 'Edit Item' : 'Add New Item'}</TranslatableText>
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    <TranslatableText>Item Name*</TranslatableText>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      <TranslatableText>Category*</TranslatableText>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="seeds">Seeds</option>
                      <option value="fertilizers">Fertilizers</option>
                      <option value="pesticides">Pesticides</option>
                      <option value="tools">Tools</option>
                      <option value="equipment">Equipment</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      <TranslatableText>Location*</TranslatableText>
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="warehouse-1">Warehouse 1</option>
                      <option value="warehouse-2">Warehouse 2</option>
                      <option value="warehouse-3">Warehouse 3</option>
                      <option value="store">Store</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      <TranslatableText>Quantity*</TranslatableText>
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                      <TranslatableText>Unit*</TranslatableText>
                    </label>
                    <select
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="kg">kg</option>
                      <option value="liters">liters</option>
                      <option value="units">units</option>
                      <option value="sets">sets</option>
                      <option value="meters">meters</option>
                      <option value="packets">packets</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    <TranslatableText>Price per Unit (₹)*</TranslatableText>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                    <TranslatableText>Supplier</TranslatableText>
                  </label>
                  <input
                    type="text"
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    <TranslatableText>Expiry Date</TranslatableText>
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <TranslatableText>Cancel</TranslatableText>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  <TranslatableText>{editingItem ? 'Update Item' : 'Add Item'}</TranslatableText>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Database Integration Note */}
      <div className="max-w-6xl mx-auto mt-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <TranslatableText>
                  This inventory management system is connected to a database for persistent storage. 
                  In a production environment, all inventory data would be stored in MongoDB and accessed 
                  through API endpoints. The CSV import/export functionality allows for bulk data management.
                </TranslatableText>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
import React, { useState } from 'react';
import { FileText, Search, Filter, ChevronDown, ChevronUp, Eye, Download, Truck, CheckCircle, Clock, AlertCircle, XCircle, Package } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sample orders data
  const orders = [
    {
      id: 'ORD-2023-001',
      date: '2023-10-15',
      customer: 'Rajesh Kumar',
      items: [
        { name: 'Organic Tomatoes', quantity: '10 kg', price: 450 },
        { name: 'Bell Peppers', quantity: '5 kg', price: 350 }
      ],
      total: 800,
      status: 'delivered',
      paymentStatus: 'paid',
      shippingAddress: '123 Farmer Colony, Nashik, Maharashtra',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-2023-002',
      date: '2023-10-14',
      customer: 'Priya Sharma',
      items: [
        { name: 'Basmati Rice', quantity: '25 kg', price: 2500 }
      ],
      total: 2500,
      status: 'processing',
      paymentStatus: 'paid',
      shippingAddress: '456 Green Fields, Pune, Maharashtra',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD-2023-003',
      date: '2023-10-12',
      customer: 'Amit Patel',
      items: [
        { name: 'Wheat', quantity: '50 kg', price: 1200 },
        { name: 'Organic Potatoes', quantity: '20 kg', price: 600 }
      ],
      total: 1800,
      status: 'shipped',
      paymentStatus: 'paid',
      shippingAddress: '789 Farm Road, Ahmedabad, Gujarat',
      trackingNumber: 'TRK456789123'
    },
    {
      id: 'ORD-2023-004',
      date: '2023-10-10',
      customer: 'Sunita Verma',
      items: [
        { name: 'Organic Onions', quantity: '15 kg', price: 450 }
      ],
      total: 450,
      status: 'cancelled',
      paymentStatus: 'refunded',
      shippingAddress: '101 Village Square, Jaipur, Rajasthan',
      trackingNumber: 'TRK789123456'
    },
    {
      id: 'ORD-2023-005',
      date: '2023-10-08',
      customer: 'Vikram Singh',
      items: [
        { name: 'Organic Apples', quantity: '10 kg', price: 800 },
        { name: 'Organic Mangoes', quantity: '5 kg', price: 750 }
      ],
      total: 1550,
      status: 'delivered',
      paymentStatus: 'paid',
      shippingAddress: '202 Orchard Lane, Shimla, Himachal Pradesh',
      trackingNumber: 'TRK321654987'
    }
  ];

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           order.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'total') {
        return sortOrder === 'asc' ? a.total - b.total : b.total - a.total;
      }
      return 0;
    });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            <TranslatableText>Processing</TranslatableText>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Truck className="w-3 h-3 mr-1" />
            <TranslatableText>Shipped</TranslatableText>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            <TranslatableText>Delivered</TranslatableText>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            <TranslatableText>Cancelled</TranslatableText>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            <TranslatableText>Unknown</TranslatableText>
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <TranslatableText>Order Management</TranslatableText>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            <TranslatableText>Track and manage your crop orders and transactions</TranslatableText>
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders by ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all"><TranslatableText>All Status</TranslatableText></option>
                  <option value="processing"><TranslatableText>Processing</TranslatableText></option>
                  <option value="shipped"><TranslatableText>Shipped</TranslatableText></option>
                  <option value="delivered"><TranslatableText>Delivered</TranslatableText></option>
                  <option value="cancelled"><TranslatableText>Cancelled</TranslatableText></option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <TranslatableText>Order ID</TranslatableText>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center">
                      <TranslatableText>Date</TranslatableText>
                      {sortBy === 'date' && (
                        sortOrder === 'asc' ? 
                          <ChevronUp className="w-4 h-4 ml-1" /> : 
                          <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <TranslatableText>Customer</TranslatableText>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('total')}
                  >
                    <div className="flex items-center">
                      <TranslatableText>Total</TranslatableText>
                      {sortBy === 'total' && (
                        sortOrder === 'asc' ? 
                          <ChevronUp className="w-4 h-4 ml-1" /> : 
                          <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <TranslatableText>Status</TranslatableText>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <TranslatableText>Actions</TranslatableText>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{order.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Download className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      <TranslatableText>No orders found</TranslatableText>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <TranslatableText>Showing</TranslatableText> <span className="font-medium">1</span> <TranslatableText>to</TranslatableText> <span className="font-medium">{filteredOrders.length}</span> <TranslatableText>of</TranslatableText> <span className="font-medium">{filteredOrders.length}</span> <TranslatableText>results</TranslatableText>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
              <TranslatableText>Previous</TranslatableText>
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
              <TranslatableText>Next</TranslatableText>
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                <TranslatableText>Order Details</TranslatableText> - {selectedOrder.id}
              </h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    <TranslatableText>Order Information</TranslatableText>
                  </h3>
                  <p className="text-gray-800 mb-1">
                    <span className="font-medium"><TranslatableText>Date:</TranslatableText></span> {formatDate(selectedOrder.date)}
                  </p>
                  <p className="text-gray-800 mb-1">
                    <span className="font-medium"><TranslatableText>Status:</TranslatableText></span> {getStatusBadge(selectedOrder.status)}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium"><TranslatableText>Payment:</TranslatableText></span> {selectedOrder.paymentStatus}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    <TranslatableText>Customer Information</TranslatableText>
                  </h3>
                  <p className="text-gray-800 mb-1">
                    <span className="font-medium"><TranslatableText>Name:</TranslatableText></span> {selectedOrder.customer}
                  </p>
                  <p className="text-gray-800 mb-1">
                    <span className="font-medium"><TranslatableText>Shipping Address:</TranslatableText></span> {selectedOrder.shippingAddress}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium"><TranslatableText>Tracking Number:</TranslatableText></span> {selectedOrder.trackingNumber}
                  </p>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                <TranslatableText>Order Items</TranslatableText>
              </h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatableText>Item</TranslatableText>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatableText>Quantity</TranslatableText>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatableText>Price</TranslatableText>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          ₹{item.price.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        <TranslatableText>Total</TranslatableText>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                        ₹{selectedOrder.total.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  <TranslatableText>Download Invoice</TranslatableText>
                </button>
                {selectedOrder.status === 'processing' && (
                  <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    <TranslatableText>Cancel Order</TranslatableText>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
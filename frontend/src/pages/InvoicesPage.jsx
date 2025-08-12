import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Download, Eye, Printer, ChevronDown, ChevronUp, Check, X, Calendar, Clock } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Sample invoices data
  const sampleInvoices = [
    {
      id: 'INV-2023-001',
      customer: {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+91 98765 43210',
        address: '123 Farmer Colony, Nashik, Maharashtra, 422001'
      },
      date: '2023-10-15',
      dueDate: '2023-10-30',
      items: [
        { name: 'Organic Tomatoes', quantity: 50, unit: 'kg', price: 45, total: 2250 },
        { name: 'Bell Peppers', quantity: 30, unit: 'kg', price: 60, total: 1800 }
      ],
      subtotal: 4050,
      tax: 202.5,
      total: 4252.5,
      status: 'paid',
      paymentDate: '2023-10-16'
    },
    {
      id: 'INV-2023-002',
      customer: {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 87654 32109',
        address: '456 Green Fields, Pune, Maharashtra, 411001'
      },
      date: '2023-10-12',
      dueDate: '2023-10-27',
      items: [
        { name: 'Basmati Rice', quantity: 100, unit: 'kg', price: 80, total: 8000 }
      ],
      subtotal: 8000,
      tax: 400,
      total: 8400,
      status: 'pending',
      paymentDate: null
    },
    {
      id: 'INV-2023-003',
      customer: {
        name: 'Amit Patel',
        email: 'amit@example.com',
        phone: '+91 76543 21098',
        address: '789 Farm Road, Ahmedabad, Gujarat, 380001'
      },
      date: '2023-10-08',
      dueDate: '2023-10-23',
      items: [
        { name: 'Wheat', quantity: 200, unit: 'kg', price: 30, total: 6000 },
        { name: 'Organic Potatoes', quantity: 100, unit: 'kg', price: 25, total: 2500 }
      ],
      subtotal: 8500,
      tax: 425,
      total: 8925,
      status: 'overdue',
      paymentDate: null
    },
    {
      id: 'INV-2023-004',
      customer: {
        name: 'Sunita Verma',
        email: 'sunita@example.com',
        phone: '+91 65432 10987',
        address: '101 Village Square, Jaipur, Rajasthan, 302001'
      },
      date: '2023-10-05',
      dueDate: '2023-10-20',
      items: [
        { name: 'Organic Onions', quantity: 150, unit: 'kg', price: 35, total: 5250 }
      ],
      subtotal: 5250,
      tax: 262.5,
      total: 5512.5,
      status: 'paid',
      paymentDate: '2023-10-18'
    },
    {
      id: 'INV-2023-005',
      customer: {
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        phone: '+91 54321 09876',
        address: '202 Orchard Lane, Shimla, Himachal Pradesh, 171001'
      },
      date: '2023-10-02',
      dueDate: '2023-10-17',
      items: [
        { name: 'Organic Apples', quantity: 200, unit: 'kg', price: 75, total: 15000 },
        { name: 'Organic Mangoes', quantity: 100, unit: 'kg', price: 120, total: 12000 }
      ],
      subtotal: 27000,
      tax: 1350,
      total: 28350,
      status: 'cancelled',
      paymentDate: null
    }
  ];

  useEffect(() => {
    // In a real app, this would be a fetch call to your backend
    // Example: fetch('/api/invoices')
    setTimeout(() => {
      setInvoices(sampleInvoices);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleDownloadPDF = (invoice) => {
    // Alert the user that PDF generation would happen here
    alert(`Downloading invoice ${invoice.id} as PDF...

In a production environment, this would generate a PDF with jsPDF library.
To implement this feature, install the required packages with:

npm install jspdf jspdf-autotable

Or use:

yarn add jspdf jspdf-autotable`);
    
    // Log the invoice data that would be used for the PDF
    console.log('Invoice data for PDF:', invoice);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter(invoice => {
      const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'total') {
        return sortOrder === 'asc' ? a.total - b.total : b.total - a.total;
      } else if (sortBy === 'dueDate') {
        return sortOrder === 'asc' 
          ? new Date(a.dueDate) - new Date(b.dueDate)
          : new Date(b.dueDate) - new Date(a.dueDate);
      }
      return 0;
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            <TranslatableText>Paid</TranslatableText>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            <TranslatableText>Pending</TranslatableText>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <Calendar className="w-3 h-3 mr-1" />
            <TranslatableText>Overdue</TranslatableText>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <X className="w-3 h-3 mr-1" />
            <TranslatableText>Cancelled</TranslatableText>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              <TranslatableText>Invoices</TranslatableText>
            </h1>
            <p className="text-gray-600">
              <TranslatableText>Manage and track your sales invoices</TranslatableText>
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => {}}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              <TranslatableText>New Invoice</TranslatableText>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all"><TranslatableText>All Status</TranslatableText></option>
                <option value="paid"><TranslatableText>Paid</TranslatableText></option>
                <option value="pending"><TranslatableText>Pending</TranslatableText></option>
                <option value="overdue"><TranslatableText>Overdue</TranslatableText></option>
                <option value="cancelled"><TranslatableText>Cancelled</TranslatableText></option>
              </select>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              <TranslatableText>Loading invoices...</TranslatableText>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <TranslatableText>Invoice #</TranslatableText>
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
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort('dueDate')}
                      >
                        <div className="flex items-center">
                          <TranslatableText>Due Date</TranslatableText>
                          {sortBy === 'dueDate' && (
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
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{invoice.customer.name}</div>
                          <div className="text-sm text-gray-500">{invoice.customer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(invoice.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(invoice)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  <TranslatableText>No invoices found</TranslatableText>
                </h3>
                <p className="text-gray-500">
                  {searchQuery || statusFilter !== 'all' ? (
                    <TranslatableText>No invoices match your search criteria</TranslatableText>
                  ) : (
                    <TranslatableText>Start by creating your first invoice</TranslatableText>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                <TranslatableText>Invoice Details</TranslatableText> - {selectedInvoice.id}
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleDownloadPDF(selectedInvoice)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => window.print()}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Invoice Header */}
              <div className="flex flex-col md:flex-row justify-between mb-8">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">KrishiMitra</h3>
                      <p className="text-sm text-gray-600">Agricultural Support Platform</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">123 Agriculture Road</p>
                  <p className="text-sm text-gray-600">Mumbai, Maharashtra 400001</p>
                  <p className="text-sm text-gray-600">support@krishimitra.com</p>
                  <p className="text-sm text-gray-600">+91 98765 43210</p>
                </div>
                
                <div className="mt-6 md:mt-0 text-right">
                  <h3 className="text-lg font-semibold text-gray-800">
                    <TranslatableText>Invoice</TranslatableText>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <TranslatableText>Invoice #:</TranslatableText> {selectedInvoice.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    <TranslatableText>Date:</TranslatableText> {formatDate(selectedInvoice.date)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <TranslatableText>Due Date:</TranslatableText> {formatDate(selectedInvoice.dueDate)}
                  </p>
                  <div className="mt-2">
                    {getStatusBadge(selectedInvoice.status)}
                  </div>
                </div>
              </div>
              
              {/* Customer Info */}
              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  <TranslatableText>Bill To:</TranslatableText>
                </h4>
                <p className="font-medium text-gray-800">{selectedInvoice.customer.name}</p>
                <p className="text-sm text-gray-600">{selectedInvoice.customer.address}</p>
                <p className="text-sm text-gray-600">{selectedInvoice.customer.email}</p>
                <p className="text-sm text-gray-600">{selectedInvoice.customer.phone}</p>
              </div>
              
              {/* Items Table */}
              <div className="mb-8">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <TranslatableText>Item</TranslatableText>
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <TranslatableText>Quantity</TranslatableText>
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <TranslatableText>Unit</TranslatableText>
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <TranslatableText>Price</TranslatableText>
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <TranslatableText>Total</TranslatableText>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {item.unit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Totals */}
              <div className="mb-8 flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      <TranslatableText>Subtotal</TranslatableText>
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(selectedInvoice.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      <TranslatableText>Tax (5%)</TranslatableText>
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(selectedInvoice.tax)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 font-medium">
                    <span className="text-base text-gray-900">
                      <TranslatableText>Total</TranslatableText>
                    </span>
                    <span className="text-base text-green-600">
                      {formatCurrency(selectedInvoice.total)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Payment Info */}
              {selectedInvoice.status === 'paid' && (
                <div className="bg-green-50 p-4 rounded-lg mb-8">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-sm text-green-800">
                      <TranslatableText>Payment received on</TranslatableText> {formatDate(selectedInvoice.paymentDate)}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Notes */}
              <div className="border-t border-gray-200 pt-6 text-center">
                <p className="text-sm text-gray-600">
                  <TranslatableText>Thank you for your business with KrishiMitra!</TranslatableText>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;
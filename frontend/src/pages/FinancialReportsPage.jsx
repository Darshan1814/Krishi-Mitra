import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Filter, Calendar, ChevronDown, RefreshCw, FileText, DollarSign, TrendingUp, TrendingDown, Layers } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const FinancialReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState(null);
  const [dateRange, setDateRange] = useState('last30days');
  const [reportType, setReportType] = useState('summary');
  const [error, setError] = useState(null);

  // Sample financial data (in a real app, this would come from Python backend)
  const sampleFinancialData = {
    summary: {
      totalRevenue: 245680,
      totalExpenses: 156420,
      netProfit: 89260,
      profitMargin: 36.3,
      revenueGrowth: 12.5,
      topSellingCrops: [
        { name: 'Tomatoes', revenue: 58500, percentage: 23.8 },
        { name: 'Rice', revenue: 45200, percentage: 18.4 },
        { name: 'Wheat', revenue: 38700, percentage: 15.8 },
        { name: 'Potatoes', revenue: 32100, percentage: 13.1 },
        { name: 'Onions', revenue: 28900, percentage: 11.8 }
      ],
      monthlyRevenue: [
        { month: 'Jan', revenue: 18500 },
        { month: 'Feb', revenue: 19200 },
        { month: 'Mar', revenue: 21500 },
        { month: 'Apr', revenue: 22800 },
        { month: 'May', revenue: 24100 },
        { month: 'Jun', revenue: 25600 },
        { month: 'Jul', revenue: 27200 },
        { month: 'Aug', revenue: 28900 },
        { month: 'Sep', revenue: 26700 },
        { month: 'Oct', revenue: 25100 },
        { month: 'Nov', revenue: 23800 },
        { month: 'Dec', revenue: 22300 }
      ],
      monthlyExpenses: [
        { month: 'Jan', expenses: 12200 },
        { month: 'Feb', expenses: 12800 },
        { month: 'Mar', expenses: 13500 },
        { month: 'Apr', expenses: 14200 },
        { month: 'May', expenses: 15100 },
        { month: 'Jun', expenses: 15900 },
        { month: 'Jul', expenses: 16800 },
        { month: 'Aug', expenses: 17600 },
        { month: 'Sep', expenses: 16500 },
        { month: 'Oct', expenses: 15800 },
        { month: 'Nov', expenses: 14900 },
        { month: 'Dec', expenses: 14100 }
      ]
    },
    cashFlow: {
      totalInflow: 267500,
      totalOutflow: 178240,
      netCashFlow: 89260,
      cashOnHand: 156780,
      projectedCashFlow: 98500,
      cashFlowItems: [
        { category: 'Crop Sales', amount: 245680, type: 'inflow' },
        { category: 'Services', amount: 21820, type: 'inflow' },
        { category: 'Seeds & Fertilizers', amount: 58700, type: 'outflow' },
        { category: 'Equipment', amount: 42300, type: 'outflow' },
        { category: 'Labor', amount: 35600, type: 'outflow' },
        { category: 'Transportation', amount: 18900, type: 'outflow' },
        { category: 'Utilities', amount: 12640, type: 'outflow' },
        { category: 'Other Expenses', amount: 10100, type: 'outflow' }
      ]
    },
    profitLoss: {
      revenue: {
        cropSales: 245680,
        services: 21820,
        subsidies: 15000,
        otherIncome: 5000,
        totalRevenue: 287500
      },
      expenses: {
        seeds: 28700,
        fertilizers: 30000,
        pesticides: 15600,
        equipment: 42300,
        labor: 35600,
        transportation: 18900,
        utilities: 12640,
        marketing: 8500,
        otherExpenses: 10100,
        totalExpenses: 202340
      },
      grossProfit: 85160,
      taxes: 17032,
      netProfit: 68128
    }
  };

  useEffect(() => {
    // In a real app, this would be a fetch call to a Python microservice
    // Example: fetch(`/api/financial-reports?type=${reportType}&dateRange=${dateRange}`)
    const fetchFinancialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call to Python backend
        await new Promise(resolve => setTimeout(resolve, 1500));
        setFinancialData(sampleFinancialData);
      } catch (err) {
        console.error('Error fetching financial data:', err);
        setError('Failed to fetch financial data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFinancialData();
  }, [reportType, dateRange]);

  const handleRefresh = () => {
    setLoading(true);
    // In a real app, this would trigger a new fetch from the Python backend
    setTimeout(() => {
      setFinancialData(sampleFinancialData);
      setLoading(false);
    }, 1000);
  };

  const handleExportCSV = () => {
    // In a real app, this would call a Python endpoint to generate and download a CSV
    alert('CSV export functionality would be handled by Python backend');
    
    // Example of how this would work with a real backend:
    // window.location.href = `/api/financial-reports/export?type=${reportType}&dateRange=${dateRange}&format=csv`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Find the maximum value for scaling the chart
  const maxRevenue = financialData?.summary?.monthlyRevenue?.reduce(
    (max, item) => Math.max(max, item.revenue),
    0
  ) || 0;

  const maxExpense = financialData?.summary?.monthlyExpenses?.reduce(
    (max, item) => Math.max(max, item.expenses),
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              <TranslatableText>Financial Reports</TranslatableText>
            </h1>
            <p className="text-gray-600">
              <TranslatableText>View comprehensive financial reports and analytics</TranslatableText>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="last30days"><TranslatableText>Last 30 Days</TranslatableText></option>
                <option value="last3months"><TranslatableText>Last 3 Months</TranslatableText></option>
                <option value="last6months"><TranslatableText>Last 6 Months</TranslatableText></option>
                <option value="lastyear"><TranslatableText>Last Year</TranslatableText></option>
                <option value="alltime"><TranslatableText>All Time</TranslatableText></option>
              </select>
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="summary"><TranslatableText>Summary</TranslatableText></option>
                <option value="cashFlow"><TranslatableText>Cash Flow</TranslatableText></option>
                <option value="profitLoss"><TranslatableText>Profit & Loss</TranslatableText></option>
              </select>
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2 text-gray-500" />
              <TranslatableText>Refresh</TranslatableText>
            </button>
            
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              <TranslatableText>Export CSV</TranslatableText>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              <TranslatableText>Loading financial data...</TranslatableText>
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Financial Data */}
        {!loading && !error && financialData && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-green-600">+{financialData.summary.revenueGrowth}%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{formatCurrency(financialData.summary.totalRevenue)}</h3>
                <p className="text-gray-600 text-sm">
                  <TranslatableText>Total Revenue</TranslatableText>
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Layers className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">-</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{formatCurrency(financialData.summary.totalExpenses)}</h3>
                <p className="text-gray-600 text-sm">
                  <TranslatableText>Total Expenses</TranslatableText>
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {financialData.summary.netProfit > 0 ? '+' : ''}
                    {formatCurrency(financialData.summary.netProfit)}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{formatCurrency(financialData.summary.netProfit)}</h3>
                <p className="text-gray-600 text-sm">
                  <TranslatableText>Net Profit</TranslatableText>
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-purple-600">{financialData.summary.profitMargin}%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{financialData.summary.profitMargin}%</h3>
                <p className="text-gray-600 text-sm">
                  <TranslatableText>Profit Margin</TranslatableText>
                </p>
              </div>
            </div>

            {/* Revenue & Expenses Chart */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                <TranslatableText>Revenue & Expenses</TranslatableText>
              </h2>
              
              <div className="h-64">
                <div className="flex h-full items-end space-x-2">
                  {financialData.summary.monthlyRevenue.map((item, index) => {
                    const expense = financialData.summary.monthlyExpenses[index];
                    const revenueHeight = (item.revenue / maxRevenue) * 100;
                    const expenseHeight = (expense.expenses / maxRevenue) * 100;
                    const profit = item.revenue - expense.expenses;
                    
                    return (
                      <div key={item.month} className="flex-1 flex flex-col items-center">
                        <div className="w-full relative">
                          <div 
                            className="w-full bg-green-500 rounded-t-sm"
                            style={{ height: `${revenueHeight}%` }}
                          ></div>
                          <div 
                            className="w-full bg-red-400 absolute bottom-0 rounded-t-sm"
                            style={{ height: `${expenseHeight}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">{item.month}</div>
                        <div className="text-xs text-gray-500">{formatCurrency(profit)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-center mt-4 space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
                  <span className="text-sm text-gray-600"><TranslatableText>Revenue</TranslatableText></span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-sm mr-2"></div>
                  <span className="text-sm text-gray-600"><TranslatableText>Expenses</TranslatableText></span>
                </div>
              </div>
            </div>

            {/* Top Selling Crops */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                <TranslatableText>Top Selling Crops</TranslatableText>
              </h2>
              
              <div className="space-y-4">
                {financialData.summary.topSellingCrops.map((crop) => (
                  <div key={crop.name} className="flex items-center">
                    <div className="w-32 text-sm font-medium text-gray-800">{crop.name}</div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${crop.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-24 text-right text-sm text-gray-600">{formatCurrency(crop.revenue)}</div>
                    <div className="w-16 text-right text-sm text-gray-500">{crop.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cash Flow */}
            {reportType === 'cashFlow' && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  <TranslatableText>Cash Flow Analysis</TranslatableText>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1"><TranslatableText>Total Inflow</TranslatableText></p>
                    <p className="text-xl font-semibold text-green-600">{formatCurrency(financialData.cashFlow.totalInflow)}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1"><TranslatableText>Total Outflow</TranslatableText></p>
                    <p className="text-xl font-semibold text-red-600">{formatCurrency(financialData.cashFlow.totalOutflow)}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1"><TranslatableText>Net Cash Flow</TranslatableText></p>
                    <p className="text-xl font-semibold text-blue-600">{formatCurrency(financialData.cashFlow.netCashFlow)}</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <TranslatableText>Category</TranslatableText>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <TranslatableText>Type</TranslatableText>
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <TranslatableText>Amount</TranslatableText>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {financialData.cashFlow.cashFlowItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.type === 'inflow' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item.type === 'inflow' ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                              )}
                              <TranslatableText>{item.type === 'inflow' ? 'Inflow' : 'Outflow'}</TranslatableText>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                            <span className={item.type === 'inflow' ? 'text-green-600' : 'text-red-600'}>
                              {item.type === 'inflow' ? '+' : '-'}{formatCurrency(item.amount)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Profit & Loss */}
            {reportType === 'profitLoss' && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  <TranslatableText>Profit & Loss Statement</TranslatableText>
                </h2>
                
                <div className="space-y-6">
                  {/* Revenue Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">
                      <TranslatableText>Revenue</TranslatableText>
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600"><TranslatableText>Crop Sales</TranslatableText></span>
                        <span className="font-medium">{formatCurrency(financialData.profitLoss.revenue.cropSales)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600"><TranslatableText>Services</TranslatableText></span>
                        <span className="font-medium">{formatCurrency(financialData.profitLoss.revenue.services)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600"><TranslatableText>Subsidies</TranslatableText></span>
                        <span className="font-medium">{formatCurrency(financialData.profitLoss.revenue.subsidies)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600"><TranslatableText>Other Income</TranslatableText></span>
                        <span className="font-medium">{formatCurrency(financialData.profitLoss.revenue.otherIncome)}</span>
                      </div>
                      <div className="flex justify-between py-2 font-semibold">
                        <span className="text-gray-800"><TranslatableText>Total Revenue</TranslatableText></span>
                        <span className="text-green-600">{formatCurrency(financialData.profitLoss.revenue.totalRevenue)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expenses Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">
                      <TranslatableText>Expenses</TranslatableText>
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600"><TranslatableText>Seeds</TranslatableText></span>
                        <span className="font-medium">{formatCurrency(financialData.profitLoss.expenses.seeds)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600"><TranslatableText>Fertilizers</TranslatableText></span>
                        <span className="font-medium">{formatCurrency(financialData.profitLoss.expenses.fertilizers)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600"><TranslatableText>Pesticides</TranslatableText></span>
                        <span className="font-medium">{formatCurrency(financialData.profitLoss.expenses.pesticides)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600"><TranslatableText>Equipment</TranslatableText></span>
                        <span className="font-medium">{formatCurrency(financialData.profitLoss.expenses.equipment)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600"><TranslatableText>Labor</TranslatableText></span>
                        <span className="font-medium">{formatCurrency(financialData.profitLoss.expenses.labor)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600"><TranslatableText>Transportation</TranslatableText></span>
                        <span className="font-medium">{formatCurrency(financialData.profitLoss.expenses.transportation)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600"><TranslatableText>Utilities</TranslatableText></span>
                        <span className="font-medium">{formatCurrency(financialData.profitLoss.expenses.utilities)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600"><TranslatableText>Marketing</TranslatableText></span>
                        <span className="font-medium">{formatCurrency(financialData.profitLoss.expenses.marketing)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600"><TranslatableText>Other Expenses</TranslatableText></span>
                        <span className="font-medium">{formatCurrency(financialData.profitLoss.expenses.otherExpenses)}</span>
                      </div>
                      <div className="flex justify-between py-2 font-semibold">
                        <span className="text-gray-800"><TranslatableText>Total Expenses</TranslatableText></span>
                        <span className="text-red-600">{formatCurrency(financialData.profitLoss.expenses.totalExpenses)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Summary Section */}
                  <div className="pt-4 border-t-2 border-gray-200">
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-800"><TranslatableText>Gross Profit</TranslatableText></span>
                        <span className="font-medium text-blue-600">{formatCurrency(financialData.profitLoss.grossProfit)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-800"><TranslatableText>Taxes</TranslatableText></span>
                        <span className="font-medium text-red-600">{formatCurrency(financialData.profitLoss.taxes)}</span>
                      </div>
                      <div className="flex justify-between py-2 font-bold">
                        <span className="text-gray-800"><TranslatableText>Net Profit</TranslatableText></span>
                        <span className="text-green-600">{formatCurrency(financialData.profitLoss.netProfit)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Python Integration Note */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <TranslatableText>
                      This financial data is processed using Python libraries like Pandas and NumPy for data analysis. 
                      In a production environment, the data would be fetched from a Python microservice that performs 
                      real-time analysis of your financial records. The CSV export functionality would also be handled 
                      by this Python backend.
                    </TranslatableText>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialReportsPage;
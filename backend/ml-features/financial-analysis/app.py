from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
CORS(app)

# Sample data for demonstration
# In a real app, this would come from a database
def load_sample_data():
    # Create sample financial data
    dates = pd.date_range(start='2023-01-01', end='2023-12-31', freq='D')
    
    # Generate random revenue data with seasonal patterns
    np.random.seed(42)
    base_revenue = 5000
    seasonal_factor = np.sin(np.linspace(0, 2*np.pi, len(dates))) * 2000
    trend_factor = np.linspace(0, 3000, len(dates))
    noise = np.random.normal(0, 500, len(dates))
    
    revenues = base_revenue + seasonal_factor + trend_factor + noise
    revenues = np.maximum(revenues, 0)  # Ensure no negative revenues
    
    # Generate expenses as a percentage of revenue with some randomness
    expense_ratio = 0.6
    expense_noise = np.random.normal(0, 300, len(dates))
    expenses = revenues * expense_ratio + expense_noise
    expenses = np.maximum(expenses, 0)  # Ensure no negative expenses
    
    # Create DataFrame
    df = pd.DataFrame({
        'date': dates,
        'revenue': revenues,
        'expenses': expenses
    })
    
    # Add derived columns
    df['profit'] = df['revenue'] - df['expenses']
    df['profit_margin'] = df['profit'] / df['revenue']
    
    # Add categorical columns for analysis
    crop_types = ['Wheat', 'Rice', 'Tomatoes', 'Potatoes', 'Onions']
    df['main_crop'] = np.random.choice(crop_types, size=len(df))
    
    return df

# Load sample data
financial_data = load_sample_data()

@app.route('/api/financial-reports/summary', methods=['GET'])
def get_financial_summary():
    # Get query parameters
    date_range = request.args.get('dateRange', 'last30days')
    
    # Filter data based on date range
    end_date = datetime.now().date()
    
    if date_range == 'last30days':
        start_date = end_date - timedelta(days=30)
    elif date_range == 'last3months':
        start_date = end_date - timedelta(days=90)
    elif date_range == 'last6months':
        start_date = end_date - timedelta(days=180)
    elif date_range == 'lastyear':
        start_date = end_date - timedelta(days=365)
    else:  # all time
        start_date = financial_data['date'].min().date()
    
    # Filter data
    filtered_data = financial_data[
        (financial_data['date'].dt.date >= start_date) & 
        (financial_data['date'].dt.date <= end_date)
    ]
    
    # Calculate summary statistics
    total_revenue = filtered_data['revenue'].sum()
    total_expenses = filtered_data['expenses'].sum()
    net_profit = total_revenue - total_expenses
    profit_margin = (net_profit / total_revenue) * 100 if total_revenue > 0 else 0
    
    # Calculate revenue growth compared to previous period
    previous_period_start = start_date - (end_date - start_date)
    previous_period_end = start_date - timedelta(days=1)
    
    previous_data = financial_data[
        (financial_data['date'].dt.date >= previous_period_start) & 
        (financial_data['date'].dt.date <= previous_period_end)
    ]
    
    previous_revenue = previous_data['revenue'].sum()
    revenue_growth = ((total_revenue - previous_revenue) / previous_revenue) * 100 if previous_revenue > 0 else 0
    
    # Get monthly data
    monthly_data = filtered_data.set_index('date').resample('M').sum()
    monthly_revenue = monthly_data['revenue'].tolist()
    monthly_expenses = monthly_data['expenses'].tolist()
    months = [d.strftime('%b') for d in monthly_data.index]
    
    # Get top selling crops
    crop_revenue = filtered_data.groupby('main_crop')['revenue'].sum().reset_index()
    crop_revenue = crop_revenue.sort_values('revenue', ascending=False)
    total_crop_revenue = crop_revenue['revenue'].sum()
    
    top_crops = []
    for _, row in crop_revenue.iterrows():
        percentage = (row['revenue'] / total_crop_revenue) * 100 if total_crop_revenue > 0 else 0
        top_crops.append({
            'name': row['main_crop'],
            'revenue': row['revenue'],
            'percentage': percentage
        })
    
    # Prepare response
    response = {
        'summary': {
            'totalRevenue': float(total_revenue),
            'totalExpenses': float(total_expenses),
            'netProfit': float(net_profit),
            'profitMargin': float(profit_margin),
            'revenueGrowth': float(revenue_growth),
            'topSellingCrops': top_crops[:5],  # Top 5 crops
            'monthlyRevenue': [
                {'month': month, 'revenue': float(revenue)} 
                for month, revenue in zip(months, monthly_revenue)
            ],
            'monthlyExpenses': [
                {'month': month, 'expenses': float(expense)} 
                for month, expense in zip(months, monthly_expenses)
            ]
        }
    }
    
    return jsonify(response)

@app.route('/api/financial-reports/cash-flow', methods=['GET'])
def get_cash_flow():
    # Get query parameters
    date_range = request.args.get('dateRange', 'last30days')
    
    # Filter data based on date range (similar to summary endpoint)
    end_date = datetime.now().date()
    
    if date_range == 'last30days':
        start_date = end_date - timedelta(days=30)
    elif date_range == 'last3months':
        start_date = end_date - timedelta(days=90)
    elif date_range == 'last6months':
        start_date = end_date - timedelta(days=180)
    elif date_range == 'lastyear':
        start_date = end_date - timedelta(days=365)
    else:  # all time
        start_date = financial_data['date'].min().date()
    
    # Filter data
    filtered_data = financial_data[
        (financial_data['date'].dt.date >= start_date) & 
        (financial_data['date'].dt.date <= end_date)
    ]
    
    # Calculate cash flow metrics
    total_inflow = filtered_data['revenue'].sum()
    
    # Break down expenses into categories (simulated)
    np.random.seed(42)
    expense_categories = {
        'Seeds & Fertilizers': 0.25,
        'Equipment': 0.20,
        'Labor': 0.18,
        'Transportation': 0.12,
        'Utilities': 0.08,
        'Other Expenses': 0.17
    }
    
    total_expenses = filtered_data['expenses'].sum()
    expense_breakdown = []
    
    for category, ratio in expense_categories.items():
        amount = total_expenses * ratio * (0.9 + np.random.random() * 0.2)  # Add some randomness
        expense_breakdown.append({
            'category': category,
            'amount': float(amount),
            'type': 'outflow'
        })
    
    # Add revenue sources (simulated)
    revenue_sources = [
        {'category': 'Crop Sales', 'amount': float(total_inflow * 0.92), 'type': 'inflow'},
        {'category': 'Services', 'amount': float(total_inflow * 0.08), 'type': 'inflow'}
    ]
    
    # Combine all cash flow items
    cash_flow_items = revenue_sources + expense_breakdown
    
    # Calculate totals
    total_outflow = sum(item['amount'] for item in expense_breakdown)
    net_cash_flow = total_inflow - total_outflow
    
    # Prepare response
    response = {
        'cashFlow': {
            'totalInflow': float(total_inflow),
            'totalOutflow': float(total_outflow),
            'netCashFlow': float(net_cash_flow),
            'cashOnHand': float(net_cash_flow + 50000),  # Simulated starting balance
            'projectedCashFlow': float(net_cash_flow * 1.1),  # Simple projection
            'cashFlowItems': cash_flow_items
        }
    }
    
    return jsonify(response)

@app.route('/api/financial-reports/profit-loss', methods=['GET'])
def get_profit_loss():
    # Get query parameters
    date_range = request.args.get('dateRange', 'last30days')
    
    # Filter data based on date range (similar to summary endpoint)
    end_date = datetime.now().date()
    
    if date_range == 'last30days':
        start_date = end_date - timedelta(days=30)
    elif date_range == 'last3months':
        start_date = end_date - timedelta(days=90)
    elif date_range == 'last6months':
        start_date = end_date - timedelta(days=180)
    elif date_range == 'lastyear':
        start_date = end_date - timedelta(days=365)
    else:  # all time
        start_date = financial_data['date'].min().date()
    
    # Filter data
    filtered_data = financial_data[
        (financial_data['date'].dt.date >= start_date) & 
        (financial_data['date'].dt.date <= end_date)
    ]
    
    # Calculate profit & loss metrics
    total_revenue = filtered_data['revenue'].sum()
    
    # Revenue breakdown (simulated)
    crop_sales = total_revenue * 0.85
    services = total_revenue * 0.07
    subsidies = total_revenue * 0.05
    other_income = total_revenue * 0.03
    
    # Expense breakdown (simulated)
    total_expenses = filtered_data['expenses'].sum()
    
    seeds = total_expenses * 0.14
    fertilizers = total_expenses * 0.15
    pesticides = total_expenses * 0.08
    equipment = total_expenses * 0.21
    labor = total_expenses * 0.18
    transportation = total_expenses * 0.09
    utilities = total_expenses * 0.06
    marketing = total_expenses * 0.04
    other_expenses = total_expenses * 0.05
    
    # Calculate gross profit and taxes
    gross_profit = total_revenue - total_expenses
    taxes = gross_profit * 0.2 if gross_profit > 0 else 0
    net_profit = gross_profit - taxes
    
    # Prepare response
    response = {
        'profitLoss': {
            'revenue': {
                'cropSales': float(crop_sales),
                'services': float(services),
                'subsidies': float(subsidies),
                'otherIncome': float(other_income),
                'totalRevenue': float(total_revenue)
            },
            'expenses': {
                'seeds': float(seeds),
                'fertilizers': float(fertilizers),
                'pesticides': float(pesticides),
                'equipment': float(equipment),
                'labor': float(labor),
                'transportation': float(transportation),
                'utilities': float(utilities),
                'marketing': float(marketing),
                'otherExpenses': float(other_expenses),
                'totalExpenses': float(total_expenses)
            },
            'grossProfit': float(gross_profit),
            'taxes': float(taxes),
            'netProfit': float(net_profit)
        }
    }
    
    return jsonify(response)

@app.route('/api/financial-reports/export', methods=['GET'])
def export_financial_data():
    # Get query parameters
    date_range = request.args.get('dateRange', 'last30days')
    report_type = request.args.get('type', 'summary')
    export_format = request.args.get('format', 'csv')
    
    # Filter data based on date range
    end_date = datetime.now().date()
    
    if date_range == 'last30days':
        start_date = end_date - timedelta(days=30)
    elif date_range == 'last3months':
        start_date = end_date - timedelta(days=90)
    elif date_range == 'last6months':
        start_date = end_date - timedelta(days=180)
    elif date_range == 'lastyear':
        start_date = end_date - timedelta(days=365)
    else:  # all time
        start_date = financial_data['date'].min().date()
    
    # Filter data
    filtered_data = financial_data[
        (financial_data['date'].dt.date >= start_date) & 
        (financial_data['date'].dt.date <= end_date)
    ]
    
    # Prepare export data based on report type
    if report_type == 'summary':
        export_df = filtered_data[['date', 'revenue', 'expenses', 'profit', 'profit_margin']]
    elif report_type == 'cashFlow':
        export_df = filtered_data[['date', 'revenue', 'expenses']]
    elif report_type == 'profitLoss':
        export_df = filtered_data[['date', 'revenue', 'expenses', 'profit']]
    else:
        export_df = filtered_data
    
    # Format date column
    export_df['date'] = export_df['date'].dt.strftime('%Y-%m-%d')
    
    # Return CSV data
    if export_format == 'csv':
        csv_data = export_df.to_csv(index=False)
        return csv_data, 200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': f'attachment; filename=financial_report_{report_type}_{date_range}.csv'
        }
    else:
        return jsonify({'error': 'Unsupported export format'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
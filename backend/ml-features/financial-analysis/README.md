# Financial Analysis Microservice

This Python microservice provides financial data analysis for the KrishiMitra platform.

## Features

- Financial summary reports
- Cash flow analysis
- Profit & loss statements
- CSV export functionality

## Requirements

- Python 3.8+
- Flask
- Pandas
- NumPy

## Installation

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Running the Service

```
python app.py
```

The service will be available at http://localhost:5002

## API Endpoints

- `/api/financial-reports/summary` - Get financial summary
- `/api/financial-reports/cash-flow` - Get cash flow analysis
- `/api/financial-reports/profit-loss` - Get profit & loss statement
- `/api/financial-reports/export` - Export financial data as CSV

## Query Parameters

- `dateRange`: `last30days`, `last3months`, `last6months`, `lastyear`, `alltime`
- `type`: `summary`, `cashFlow`, `profitLoss`
- `format`: `csv` (for export endpoint)

## Integration with Frontend

This microservice is used by the FinancialReportsPage in the KrishiMitra frontend application.
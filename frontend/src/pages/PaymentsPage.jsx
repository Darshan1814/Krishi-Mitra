import React from 'react';
import { CreditCard } from 'lucide-react';
import FeaturePageTemplate from '../components/FeaturePageTemplate';

const PaymentsPage = () => {
  return (
    <FeaturePageTemplate
      title="Payment Gateway"
      description="Secure payment processing for crop transactions"
      icon={CreditCard}
    >
      <div className="p-6">
        <div className="text-center py-12">
          <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CreditCard size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Gateway</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Secure payment processing for crop transactions
          </p>
          <div className="bg-gray-50 p-8 rounded-lg">
            <p className="text-gray-500 text-lg">
              This feature is currently under development and will be available soon.
            </p>
            <div className="mt-6">
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </FeaturePageTemplate>
  );
};

export default PaymentsPage;
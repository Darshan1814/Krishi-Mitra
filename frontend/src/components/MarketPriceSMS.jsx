import React, { useState } from 'react';
import { MessageSquare, Phone, Send } from 'lucide-react';
import TranslatableText from './TranslatableText';

const MarketPriceSMS = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const sendSMS = async () => {
    if (!phoneNumber) {
      setMessage('Please enter a phone number');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/sms/send-market-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
        mode: 'cors'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Market prices sent successfully via SMS!');
        setMessageType('success');
        setPhoneNumber('');
      } else {
        setMessage(data.error || 'Failed to send SMS');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Failed to send SMS. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsApp = async () => {
    if (!phoneNumber) {
      setMessage('Please enter a phone number');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/sms/send-whatsapp-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
        mode: 'cors'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Market prices sent successfully via WhatsApp!');
        setMessageType('success');
        setPhoneNumber('');
      } else {
        setMessage(data.error || 'Failed to send WhatsApp message');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Failed to send WhatsApp message. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Send className="w-5 h-5 text-green-600 mr-2" />
        <TranslatableText>Send Market Prices</TranslatableText>
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <TranslatableText>Phone Number</TranslatableText>
          </label>
          <input
            type="tel"
            placeholder="+919876543210"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            <TranslatableText>Include country code (e.g., +91 for India)</TranslatableText>
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={sendSMS}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Phone className="w-4 h-4" />
            )}
            <span><TranslatableText>Send SMS</TranslatableText></span>
          </button>

          <button
            onClick={sendWhatsApp}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <MessageSquare className="w-4 h-4" />
            )}
            <span><TranslatableText>Send WhatsApp</TranslatableText></span>
          </button>
        </div>

        {message && (
          <div className={`p-3 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPriceSMS;
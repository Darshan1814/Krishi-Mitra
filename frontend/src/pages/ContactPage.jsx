import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Send data to backend API
      const response = await axios.post('/api/contact', formData);
      
      console.log('Form submitted:', response.data);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Reset the success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          <TranslatableText>Contact Us</TranslatableText>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          <TranslatableText>
            Have questions about KrishiMitra? Need help with your farming or business? 
            Our team is here to assist you. Reach out to us using the form below.
          </TranslatableText>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-green-600 text-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">
            <TranslatableText>Get In Touch</TranslatableText>
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-green-500 p-3 rounded-full mr-4">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  <TranslatableText>Address</TranslatableText>
                </h3>
                <p className="mt-1">
                  <TranslatableText>
                    MIT-AOE, Jalgaon, Maharashtra
                  </TranslatableText>
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-500 p-3 rounded-full mr-4">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  <TranslatableText>Phone</TranslatableText>
                </h3>
                <p className="mt-1">+91 98765 43210</p>
                <p>+91 87654 32109</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-500 p-3 rounded-full mr-4">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  <TranslatableText>Email</TranslatableText>
                </h3>
                <p className="mt-1">doraemonboy288@gmail.com</p>
                <p>info@krishimitra.com</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="font-medium text-lg mb-4">
              <TranslatableText>Working Hours</TranslatableText>
            </h3>
            <p className="mb-2">
              <TranslatableText>Monday - Friday: 9:00 AM - 6:00 PM</TranslatableText>
            </p>
            <p>
              <TranslatableText>Saturday: 9:00 AM - 1:00 PM</TranslatableText>
            </p>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                <TranslatableText>Message Sent!</TranslatableText>
              </h2>
              <p className="text-gray-600">
                <TranslatableText>
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </TranslatableText>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                <TranslatableText>Send Us a Message</TranslatableText>
              </h2>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatableText>Your Name</TranslatableText>
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
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatableText>Email Address</TranslatableText>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatableText>Phone Number</TranslatableText>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatableText>Your Message</TranslatableText>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <TranslatableText>Sending...</TranslatableText>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    <TranslatableText>Send Message</TranslatableText>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Database Integration Note */}
      <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <TranslatableText>
                This contact form is connected to a MongoDB database. When you submit the form, 
                your message is stored in the database and can be accessed by administrators through 
                the admin dashboard. The backend API handles form validation and data persistence.
              </TranslatableText>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
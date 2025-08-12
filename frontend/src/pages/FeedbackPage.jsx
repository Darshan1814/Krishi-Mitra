import React, { useState } from 'react';
import { MessageSquare, Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'general',
    rating: 0,
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real app, you would send this data to your backend
      // const response = await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // if (!response.ok) throw new Error('Failed to submit feedback');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Feedback submitted:', formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        feedbackType: 'general',
        rating: 0,
        message: ''
      });
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <TranslatableText>Feedback</TranslatableText>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            <TranslatableText>
              We value your feedback! Help us improve KrishiMitra by sharing your thoughts and suggestions.
            </TranslatableText>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                <TranslatableText>Thank You!</TranslatableText>
              </h2>
              <p className="text-gray-600 mb-6">
                <TranslatableText>
                  Your feedback has been submitted successfully. We appreciate your input!
                </TranslatableText>
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <TranslatableText>Submit Another Feedback</TranslatableText>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatableText>Feedback Type</TranslatableText>
                </label>
                <select
                  id="feedbackType"
                  name="feedbackType"
                  value={formData.feedbackType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general"><TranslatableText>General Feedback</TranslatableText></option>
                  <option value="bug"><TranslatableText>Bug Report</TranslatableText></option>
                  <option value="feature"><TranslatableText>Feature Request</TranslatableText></option>
                  <option value="complaint"><TranslatableText>Complaint</TranslatableText></option>
                  <option value="praise"><TranslatableText>Praise</TranslatableText></option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatableText>Rate Your Experience</TranslatableText>
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          star <= formData.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatableText>Your Feedback</TranslatableText>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please share your thoughts, suggestions, or report issues..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <TranslatableText>Submitting...</TranslatableText>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      <TranslatableText>Submit Feedback</TranslatableText>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            <TranslatableText>Other Ways to Reach Us</TranslatableText>
          </h2>
          <div className="space-y-3">
            <p className="text-gray-700">
              <TranslatableText>Email:</TranslatableText> <a href="mailto:feedback@krishimitra.com" className="text-blue-600 hover:underline">feedback@krishimitra.com</a>
            </p>
            <p className="text-gray-700">
              <TranslatableText>Phone:</TranslatableText> +91 98765 43210
            </p>
            <p className="text-gray-700">
              <TranslatableText>
                You can also reach out to us through our social media channels for quick responses.
              </TranslatableText>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
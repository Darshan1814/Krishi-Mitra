import React, { useState } from 'react';
import { Info, Search, ChevronDown, ChevronUp, MessageCircle, Mail, Phone, FileText } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  const faqs = [
    {
      question: "How do I use the Plant Doctor feature?",
      answer: "To use the Plant Doctor feature, navigate to the Camera page from the main menu. You can either take a photo directly using your device's camera or upload an existing image. Once uploaded, our AI will analyze the image and provide information about the plant, including any diseases or issues detected."
    },
    {
      question: "How accurate is the disease detection?",
      answer: "Our disease detection system has been trained on thousands of images and achieves an accuracy rate of approximately 85-90%. However, for critical decisions, we recommend consulting with a local agricultural expert to confirm the diagnosis."
    },
    {
      question: "Can I use KrishiMitra offline?",
      answer: "Some basic features of KrishiMitra can work offline, but most features including plant disease detection, AI chat, and marketplace require an internet connection to function properly."
    },
    {
      question: "How do I sell my crops on the marketplace?",
      answer: "To sell crops, first register as a farmer. Then navigate to your Farmer Dashboard and click on 'Add Crop'. Fill in the details about your crop including quantity, price, and quality. Once submitted, your listing will be visible to vendors on the marketplace."
    },
    {
      question: "How do I contact a farmer about their crops?",
      answer: "When viewing a crop listing on the marketplace, you can click the 'Order' button to initiate a purchase. This will notify the farmer, who can then contact you using the contact information in your profile."
    },
    {
      question: "Is my data secure on KrishiMitra?",
      answer: "Yes, we take data security very seriously. All personal information is encrypted and stored securely. We do not share your personal data with third parties without your explicit consent."
    },
    {
      question: "How do I change my language preference?",
      answer: "You can change your language preference by clicking on the language selector in the top navigation bar. Currently, we support English and Hindi."
    },
    {
      question: "What should I do if I forget my password?",
      answer: "If you forget your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and we'll send you instructions to reset your password."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const helpCategories = [
    { icon: MessageCircle, title: "Chat Support", description: "Talk to our support team via chat" },
    { icon: Mail, title: "Email Support", description: "Send us an email at support@krishimitra.com" },
    { icon: Phone, title: "Phone Support", description: "Call us at +91 98765 43210" },
    { icon: FileText, title: "Documentation", description: "Browse our detailed user guides" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Info size={32} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            <TranslatableText>Help Center</TranslatableText>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            <TranslatableText>
              Find answers to common questions and get support for using KrishiMitra
            </TranslatableText>
          </p>
        </div>

        {/* Search */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {helpCategories.map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <category.icon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                <TranslatableText>{category.title}</TranslatableText>
              </h3>
              <p className="text-gray-600 text-sm">
                <TranslatableText>{category.description}</TranslatableText>
              </p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            <TranslatableText>Frequently Asked Questions</TranslatableText>
          </h2>
          
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <h3 className="text-lg font-medium text-gray-800">
                      <TranslatableText>{faq.question}</TranslatableText>
                    </h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-gray-600">
                        <TranslatableText>{faq.answer}</TranslatableText>
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600">
                  <TranslatableText>No results found for "{searchQuery}"</TranslatableText>
                </p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-green-600 hover:text-green-700 font-medium"
                >
                  <TranslatableText>Clear search</TranslatableText>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="max-w-3xl mx-auto mt-16 bg-green-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            <TranslatableText>Still Need Help?</TranslatableText>
          </h2>
          <p className="text-gray-600 mb-6">
            <TranslatableText>
              Can't find what you're looking for? Our support team is here to help.
            </TranslatableText>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              <TranslatableText>Start Chat</TranslatableText>
            </button>
            <button className="border border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg transition-colors flex items-center justify-center">
              <Mail className="w-5 h-5 mr-2" />
              <TranslatableText>Contact Support</TranslatableText>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
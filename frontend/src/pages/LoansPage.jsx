import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, Calendar, ExternalLink, Loader, Volume2 } from 'lucide-react';

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const speakLoanDetails = (loan, lang) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking && !isPaused) {
        speechSynthesis.pause();
        setIsPaused(true);
        return;
      }
      
      if (isPaused) {
        speechSynthesis.resume();
        setIsPaused(false);
        return;
      }
      
      speechSynthesis.cancel();
      
      let text = '';
      if (lang === 'hi') {
        text = `ऋण का नाम: ${loan['Loan Name']}। ब्याज दर: ${loan['Interest Rate']}। बैंक का नाम: ${loan['Bank Name']}। विवरण: ${loan.Description}`;
      } else {
        text = `Loan Name: ${loan['Loan Name']}. Interest Rate: ${loan['Interest Rate']}. Bank Name: ${loan['Bank Name']}. Description: ${loan.Description}`;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await fetch('https://krushi-backend-1.onrender.com/api/loans');
      const data = await response.json();
      
      if (response.ok && data.loans) {
        setLoans(data.loans);
      } else {
        setError('Failed to fetch loans');
      }
    } catch (err) {
      setError('Error fetching loans');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Agricultural Loans</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loans && loans.length > 0 ? loans.map((loan, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              {loan['Loan Name']}
            </h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-gray-600">
                <Percent className="w-4 h-4 mr-2 text-blue-600" />
                <span>Interest Rate: {loan['Interest Rate']}</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">
              {loan.Description}
            </p>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">{loan['Bank Name']}</span>
              
              <a 
                href={loan['Apply Link']} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-green-600 hover:text-green-700 text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Apply Now
              </a>
            </div>
            
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <div className="relative group">
                <button
                  onClick={() => speakLoanDetails(loan, 'en')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center"
                >
                  <Volume2 className="w-3 h-3 mr-1" />
                  <span className="text-xs">EN</span>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {isSpeaking ? (isPaused ? 'Resume' : 'Pause') : 'Listen'} in English
                </div>
              </div>
              
              <div className="relative group">
                <button
                  onClick={() => speakLoanDetails(loan, 'hi')}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center"
                >
                  <Volume2 className="w-3 h-3 mr-1" />
                  <span className="text-xs">HI</span>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {isSpeaking ? (isPaused ? 'पुनः शुरू करें' : 'रोकें') : 'हिंदी में सुनें'}
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            No loans available at the moment
          </div>
        )}
      </div>
    </div>
  );
};

export default LoansPage;
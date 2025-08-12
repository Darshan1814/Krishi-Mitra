import React, { useState } from 'react';
import { MessageCircle, User, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeaturePageTemplate from '../components/FeaturePageTemplate';

const LiveChatPage = () => {
  const [farmerName, setFarmerName] = useState('');
  const [issue, setIssue] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const navigate = useNavigate();

  const requestLiveChat = async () => {
    if (!farmerName.trim() || !issue.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsRequesting(true);
    const roomId = `chat_${Date.now()}`;

    try {
      // Send request to expert
      const response = await fetch('http://localhost:5001/api/expert/chat-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerName,
          issue,
          roomId,
          type: 'chat'
        })
      });

      if (response.ok) {
        // Navigate to live chat page
        navigate(`/live-chat/${roomId}`);
      } else {
        alert('Failed to send request');
      }
    } catch (error) {
      console.error('Error requesting chat:', error);
      alert('Failed to connect to server');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <FeaturePageTemplate
      title="Live Chat"
      description="Chat with agricultural experts in real-time"
      icon={MessageCircle}
    >
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Expert Live Chat</h2>
              <p className="text-gray-600">
                Get instant help from agricultural experts via live chat
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe Your Issue
                </label>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your farming issue or question..."
                />
              </div>

              <button
                onClick={requestLiveChat}
                disabled={isRequesting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 mr-2" />
                {isRequesting ? 'Connecting...' : 'Start Live Chat'}
              </button>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">How it works:</h3>
              <ol className="text-sm text-green-700 space-y-1">
                <li>1. Fill in your details and describe your issue</li>
                <li>2. Click "Start Live Chat" to send a request</li>
                <li>3. Wait for an expert to accept your chat</li>
                <li>4. Get real-time help through text messages</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </FeaturePageTemplate>
  );
};

export default LiveChatPage;
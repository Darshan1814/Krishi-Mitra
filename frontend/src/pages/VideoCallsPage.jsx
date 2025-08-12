import React, { useState } from 'react';
import { Video, User, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeaturePageTemplate from '../components/FeaturePageTemplate';

const VideoCallsPage = () => {
  const [farmerName, setFarmerName] = useState('');
  const [issue, setIssue] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const navigate = useNavigate();

  const requestVideoCall = async () => {
    if (!farmerName.trim() || !issue.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setIsRequesting(true);
    const roomId = `room_${Date.now()}`;

    try {
      // Send request to expert
      const response = await fetch('http://localhost:5001/api/expert/call-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerName,
          issue,
          roomId,
          type: 'call'
        })
      });

      if (response.ok) {
        // Navigate to video call page and wait for expert
        navigate(`/video-call/${roomId}`);
      } else {
        alert('Failed to send request');
      }
    } catch (error) {
      console.error('Error requesting call:', error);
      alert('Failed to connect to server');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <FeaturePageTemplate
      title="Video Calls"
      description="Connect with agricultural experts through video calls"
      icon={Video}
    >
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Video size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Expert Video Call</h2>
              <p className="text-gray-600">
                Get personalized advice from agricultural experts via video call
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your farming issue or question..."
                />
              </div>

              <button
                onClick={requestVideoCall}
                disabled={isRequesting}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Phone className="w-5 h-5 mr-2" />
                {isRequesting ? 'Connecting...' : 'Start Video Call'}
              </button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Fill in your details and describe your issue</li>
                <li>2. Click "Start Video Call" to send a request</li>
                <li>3. Wait for an expert to accept your call</li>
                <li>4. Get personalized advice through video chat</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </FeaturePageTemplate>
  );
};

export default VideoCallsPage;
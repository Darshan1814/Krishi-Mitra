import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, PhoneOff, User, Clock, MessageCircle } from 'lucide-react';

const ExpertDashboard = () => {
  const [expert, setExpert] = useState(null);
  const [callRequests, setCallRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const expertData = localStorage.getItem('expert');
    if (expertData) {
      setExpert(JSON.parse(expertData));
    } else {
      // Default expert for testing
      setExpert({
        name: 'Dr. Fertilizer Expert',
        specialization: 'Fertilizer & Crop Management'
      });
    }
    
    fetchCallRequests();
    
    // Poll for new requests every 5 seconds
    const interval = setInterval(fetchCallRequests, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchCallRequests = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/expert/call-requests');
      const data = await response.json();
      if (data.success) {
        setCallRequests(data.requests.filter(r => r.status === 'pending'));
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const handleCallResponse = async (requestId, action) => {
    try {
      const response = await fetch('http://localhost:5001/api/expert/call-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action })
      });

      if (response.ok) {
        if (action === 'accepted') {
          const request = callRequests.find(r => r.id === requestId);
          navigate(`/video-call/${request.roomId}`);
        }
        fetchCallRequests();
      }
    } catch (error) {
      console.error('Failed to respond to call:', error);
    }
  };

  if (!expert) {
    setExpert({
      name: 'Dr. Fertilizer Expert',
      specialization: 'Fertilizer & Crop Management'
    });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Expert Dashboard</h1>
          <p className="text-gray-600 mb-4">Welcome, {expert.name}</p>
          <p className="text-sm text-gray-500">Specialization: {expert.specialization}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Incoming Requests</h2>
          
          {callRequests.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {callRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{request.farmerName}</h3>
                        <p className="text-gray-600">{request.issue}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(request.timestamp).toLocaleTimeString()}
                        </p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          request.type === 'chat' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {request.type === 'chat' ? 'Chat Request' : 'Video Call Request'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={async () => {
                          // First accept the request
                          await handleCallResponse(request.id, 'accepted');
                          
                          // Then navigate to appropriate page
                          if (request.type === 'chat') {
                            navigate(`/expert-chat/${request.roomId}?expert=true`);
                          } else {
                            navigate(`/video-call/${request.roomId}?expert=true`);
                          }
                        }}
                        className={`text-white px-4 py-2 rounded-lg transition-colors flex items-center ${
                          request.type === 'chat' 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {request.type === 'chat' ? (
                          <><MessageCircle className="w-4 h-4 mr-2" />Accept Chat</>
                        ) : (
                          <><Phone className="w-4 h-4 mr-2" />Accept Call</>
                        )}
                      </button>
                      <button
                        onClick={() => handleCallResponse(request.id, 'rejected')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                      >
                        <PhoneOff className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;
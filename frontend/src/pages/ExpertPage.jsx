import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MessageCircle, User, Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';

const ExpertPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issue, setIssue] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatStatus, setChatStatus] = useState('connecting');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const requestVideoCall = async () => {
    if (!issue.trim()) {
      alert('Please describe your issue');
      return;
    }
    
    setRequesting(true);
    const roomId = Math.random().toString(36).substring(7);
    
    try {
      const response = await fetch('http://localhost:5001/api/expert/call-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerName: user?.fullName || 'Farmer',
          issue: issue,
          roomId: roomId,
          type: 'call'
        })
      });
      
      if (response.ok) {
        alert('Call request sent! Please wait for expert to accept.');
        setTimeout(() => {
          navigate(`/video-call/${roomId}`);
        }, 3000);
      }
    } catch (error) {
      alert('Failed to send request');
    } finally {
      setRequesting(false);
    }
  };

  const requestChat = async () => {
    if (!issue.trim()) {
      alert('Please describe your issue');
      return;
    }
    
    setRequesting(true);
    const newRoomId = `chat_${Date.now()}`;
    setRoomId(newRoomId);
    
    try {
      const response = await fetch('http://localhost:5001/api/expert/chat-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerName: user?.fullName || 'Farmer',
          issue: issue,
          roomId: newRoomId,
          type: 'chat'
        })
      });
      
      if (response.ok) {
        setShowChat(true);
        initializeChat(newRoomId);
      } else {
        alert('Failed to send chat request');
      }
    } catch (error) {
      alert('Failed to connect to server');
    } finally {
      setRequesting(false);
    }
  };

  const initializeChat = async (chatRoomId) => {
    try {
      const newSocket = io('http://localhost:5006');
      setSocket(newSocket);

      const userType = 'farmer';
      const userName = user?.fullName || 'Farmer';
      
      newSocket.emit('join-chat', { roomId: chatRoomId, userType, userName });
      console.log('Joined chat room:', chatRoomId, 'as', userType);
      
      setChatStatus('waiting');

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
        setIsConnected(true);
      });
      
      newSocket.on('expert-joined', () => {
        console.log('Expert joined the chat');
        setChatStatus('active');
        setIsConnected(true);
      });
      
      newSocket.on('chat-ready', () => {
        console.log('Chat ready - both users present');
        setChatStatus('active');
        setIsConnected(true);
      });
      
      newSocket.on('waiting-for-expert', () => {
        console.log('Waiting for expert to join');
        setChatStatus('waiting');
      });

      newSocket.on('receive-message', (message) => {
        console.log('Message received:', message);
        setMessages(prev => [...prev, message]);
      });
      
      newSocket.on('chat-ended', () => {
        console.log('Chat ended by expert');
        endChat();
      });

    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || chatStatus !== 'active') return;

    const userName = user?.fullName || 'Farmer';
    const messageData = {
      roomId,
      message: newMessage,
      sender: userName,
      userType: 'farmer'
    };

    const displayMessage = {
      id: Date.now(),
      text: newMessage,
      sender: userName,
      userType: 'farmer',
      timestamp: new Date()
    };

    console.log('Sending message:', messageData);
    socket.emit('send-message', messageData);
    setMessages(prev => [...prev, displayMessage]);
    setNewMessage('');
  };
  
  const endChat = () => {
    console.log('End chat clicked');
    
    if (socket) {
      socket.emit('end-chat', roomId);
      socket.disconnect();
      setSocket(null);
    }
    
    setShowChat(false);
    setMessages([]);
    setChatStatus('connecting');
    setIsConnected(false);
    setIssue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (showChat) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex flex-col z-50">
        <div className="bg-white shadow-sm p-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={endChat}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center">
              <MessageCircle className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-semibold">Chat with Expert</h1>
                <p className="text-sm text-gray-600">Farmer: {user?.fullName || user?.name || 'Farmer'}</p>
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${
            chatStatus === 'active' && isConnected ? 'bg-green-600 text-white' : 
            chatStatus === 'waiting' ? 'bg-yellow-600 text-white' :
            chatStatus === 'connecting' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
          }`}>
            {chatStatus === 'active' && isConnected ? 'Active' :
             chatStatus === 'waiting' ? 'Waiting for Expert' :
             chatStatus === 'connecting' ? 'Connecting...' : 'Chat Ended'}
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-4">
            {chatStatus === 'waiting' && (
              <div className="text-center py-8">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-yellow-600 animate-pulse" />
                </div>
                <p className="text-gray-600">Waiting for expert to join the chat...</p>
              </div>
            )}
            
            {messages.map((message) => {
              const isOwnMessage = message.userType === 'farmer';
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                      isOwnMessage
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 shadow border'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <User className="w-4 h-4 mr-1" />
                      <p className="text-sm font-medium">{message.sender}</p>
                    </div>
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="bg-white border-t p-6">
          <div className="max-w-6xl mx-auto">
            {chatStatus === 'active' ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={endChat}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {chatStatus === 'waiting' ? 'Cancel Chat' : 'End Chat'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-4">Connect with Fertilizer Expert</h1>
          <p className="text-gray-600 mb-6">
            Get personalized advice from our agricultural experts through video consultation
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center mb-4">
                <User className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-green-800">Expert Available</h3>
              </div>
              <p className="text-gray-700 mb-4">
                <strong>Fertilizer Expert</strong><br />
                Specialization: Fertilizer & Crop Management<br />
                Status: <span className="text-green-600 font-semibold">Online</span>
              </p>
              
              <div className="space-y-4">
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Describe your farming issue or question..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                />
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={requestChat}
                    disabled={requesting}
                    className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-gray-400"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {requesting ? 'Requesting...' : 'Request Chat'}
                  </button>
                  <button
                    onClick={requestVideoCall}
                    disabled={requesting}
                    className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:bg-gray-400"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    {requesting ? 'Requesting...' : 'Video Call'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-blue-800">What You Can Ask</h3>
              </div>
              <ul className="text-gray-700 space-y-2">
                <li>• Fertilizer recommendations</li>
                <li>• Crop nutrition advice</li>
                <li>• Soil health assessment</li>
                <li>• Pest and disease management</li>
                <li>• Organic farming techniques</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertPage;
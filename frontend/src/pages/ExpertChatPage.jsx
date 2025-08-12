import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Send, ArrowLeft, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';

const ExpertChatPage = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isExpert = searchParams.get('expert') === 'true' || localStorage.getItem('expert');
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatStatus, setChatStatus] = useState('connecting'); // connecting, waiting, active, ended
  const [isConnected, setIsConnected] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);
  const messagesEndRef = useRef(null);

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    let mounted = true;
    let newSocket = null;
    
    const initializeChat = async () => {
      try {
        // Initialize socket
        newSocket = io('http://localhost:5006');
        setSocket(newSocket);

        // Initialize WebRTC peer connection
        const pc = new RTCPeerConnection(iceServers);
        setPeerConnection(pc);

        // Create data channel for real-time messaging (expert creates channel)
        if (isExpert) {
          const channel = pc.createDataChannel('chat', { ordered: true });
          setDataChannel(channel);
          
          channel.onopen = () => {
            console.log('Expert data channel opened');
          };
          
          channel.onmessage = (event) => {
            const messageData = JSON.parse(event.data);
            if (mounted) {
              setMessages(prev => [...prev, messageData]);
            }
          };
        }

        // Handle incoming data channel (farmer receives channel)
        pc.ondatachannel = (event) => {
          const channel = event.channel;
          setDataChannel(channel);
          
          channel.onopen = () => {
            console.log('Farmer data channel opened');
          };
          
          channel.onmessage = (event) => {
            const messageData = JSON.parse(event.data);
            if (mounted) {
              setMessages(prev => [...prev, messageData]);
            }
          };
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate && newSocket) {
            newSocket.emit('ice-candidate', { roomId, candidate: event.candidate });
          }
        };

        // Determine user type
        const userType = isExpert ? 'expert' : 'farmer';
        const userName = isExpert ? 'Expert' : (user?.name || 'Farmer');
        
        // Join the room with user type
        newSocket.emit('join-chat', { roomId, userType, userName });
        console.log('Joined chat room:', roomId, 'as', userType);
        
        // Set initial status
        if (userType === 'farmer') {
          setChatStatus('waiting');
        } else {
          setChatStatus('connecting');
        }

        // Socket event handlers
        newSocket.on('connect', () => {
          console.log('Connected to chat server');
          setIsConnected(true);
        });
        
        newSocket.on('user-connected', (data) => {
          console.log('Another user connected:', data);
        });
        
        newSocket.on('chat-ready', () => {
          console.log('Chat ready - both users present');
          setChatStatus('active');
          setIsConnected(true);
        });
        
        newSocket.on('start-chat', async () => {
          console.log('Starting WebRTC chat - creating offer');
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            newSocket.emit('offer', { roomId, offer });
          } catch (error) {
            console.error('Error creating offer:', error);
          }
        });

        newSocket.on('offer', async (data) => {
          console.log('Received offer');
          try {
            await pc.setRemoteDescription(data.offer);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            newSocket.emit('answer', { roomId, answer });
          } catch (error) {
            console.error('Error handling offer:', error);
          }
        });

        newSocket.on('answer', async (data) => {
          console.log('Received answer');
          try {
            await pc.setRemoteDescription(data.answer);
          } catch (error) {
            console.error('Error handling answer:', error);
          }
        });

        newSocket.on('ice-candidate', async (data) => {
          console.log('Received ICE candidate');
          try {
            await pc.addIceCandidate(data.candidate);
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        });
        
        newSocket.on('expert-joined', () => {
          console.log('Expert joined the chat');
          setChatStatus('active');
          setIsConnected(true);
        });
        
        newSocket.on('waiting-for-expert', () => {
          console.log('Waiting for expert to join');
          setChatStatus('waiting');
        });
        
        newSocket.on('user-disconnected', () => {
          console.log('User disconnected');
          setChatStatus('ended');
        });

        newSocket.on('receive-message', (message) => {
          console.log('Message received:', message);
          if (mounted) {
            setMessages(prev => [...prev, message]);
          }
        });
        
        newSocket.on('chat-ended', (data) => {
          console.log('Chat ended by remote user:', data);
          if (data.endedBy !== newSocket.id) {
            // Navigate to appropriate page based on user type
            if (isExpert) {
              navigate('/expert-dashboard');
            } else {
              navigate('/dashboard');
            }
          }
        });

      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();

    return () => {
      mounted = false;
      if (newSocket) {
        newSocket.disconnect();
      }
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [roomId, isExpert, user?.name, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || chatStatus !== 'active') return;

    const userName = isExpert ? 'Expert' : (user?.name || 'Farmer');
    const displayMessage = {
      id: Date.now(),
      text: newMessage,
      sender: userName,
      userType: isExpert ? 'expert' : 'farmer',
      timestamp: new Date()
    };

    // Send via WebRTC data channel if available, fallback to socket
    if (dataChannel && dataChannel.readyState === 'open') {
      console.log('Sending message via WebRTC:', displayMessage);
      dataChannel.send(JSON.stringify(displayMessage));
    } else if (socket) {
      console.log('Sending message via Socket:', displayMessage);
      socket.emit('send-message', {
        roomId,
        message: newMessage,
        sender: userName,
        userType: isExpert ? 'expert' : 'farmer'
      });
    }
    
    setMessages(prev => [...prev, displayMessage]);
    setNewMessage('');
  };
  
  const endChat = () => {
    console.log('End chat clicked');
    
    // Notify other user about chat end
    if (socket) {
      socket.emit('end-chat', roomId);
      socket.disconnect();
      setSocket(null);
    }
    
    // Navigate back to appropriate page
    if (isExpert) {
      navigate('/expert-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={endChat}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <MessageCircle className="w-6 h-6 text-blue-600 mr-2" />
            <div>
              <h1 className="text-xl font-semibold">
                {isExpert ? 'Chat with Farmer' : 'Chat with Expert'}
              </h1>
              <p className="text-sm text-gray-500">Room: {roomId}</p>
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

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          {chatStatus === 'waiting' && (
            <div className="text-center py-8">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-yellow-600 animate-pulse" />
              </div>
              <p className="text-gray-600">Waiting for expert to join the chat...</p>
            </div>
          )}
          
          {messages.map((message) => {
            const isOwnMessage = (isExpert && message.userType === 'expert') || (!isExpert && message.userType === 'farmer');
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
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

      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          {chatStatus === 'active' ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
};

export default ExpertChatPage;
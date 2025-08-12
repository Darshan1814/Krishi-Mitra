import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I am KrishiMitra AI, your agricultural assistant. How can I help you with your farming questions today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Direct Gemini AI call without backend dependency
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyDrYXOmHqiChayrg_yC0i-aGi-OqeJw1v4'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are KrishiMitra AI, an expert agricultural assistant for Indian farmers. Provide helpful, practical advice about farming, crops, diseases, weather, and agricultural practices in India. Keep responses concise and actionable. User question: ${inputMessage}`
            }]
          }]
        }),
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0]) {
        const botMessage = {
          id: Date.now() + 1,
          text: data.candidates[0].content.parts[0].text,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error('Chat error:', error);
      console.error('Error details:', error.message);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message}. Please try again later.`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20 pb-4 px-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-md p-4 border-b">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <Bot className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                <TranslatableText>KrishiMitra AI Assistant</TranslatableText>
              </h1>
              <p className="text-sm text-gray-600">
                <TranslatableText>Your agricultural expert</TranslatableText>
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && (
                    <Bot className="w-4 h-4 mt-1 text-green-600" />
                  )}
                  {message.sender === 'user' && (
                    <User className="w-4 h-4 mt-1 text-white" />
                  )}
                  <div>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-green-600" />
                  <div className="flex items-center space-x-1">
                    <Loader className="w-4 h-4 animate-spin text-green-600" />
                    <span className="text-sm">
                      <TranslatableText>Thinking...</TranslatableText>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white rounded-b-lg shadow-md p-4 border-t">
          <div className="flex space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about farming, crops, diseases, or agricultural practices..."
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="2"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
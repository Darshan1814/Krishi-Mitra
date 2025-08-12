import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Mic, MicOff, Volume2 } from 'lucide-react';
import { chatWithAI } from '../services/mlService';
import TranslatableText from './TranslatableText';

const PlantixChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm KrishiMitra AI Assistant. I can help you with farming advice, plant diseases, weather guidance, and more. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'mr-IN'; // Marathi language
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Try ML service first, then fallback to direct API
      let response;
      try {
        response = await chatWithAI(inputText);
      } catch (mlError) {
        // Fallback to direct Gemini API
        const directResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are KrishiMitra AI, an expert agricultural assistant for Indian farmers. Provide helpful, practical advice about farming, crops, diseases, weather, and agricultural practices in India. Keep responses concise and actionable. User question: ${inputText}` }] }]
          })
        });
        const data = await directResponse.json();
        response = {
          success: data.candidates && data.candidates[0],
          response: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to get response'
        };
      }

      if (response.success) {
        const botMessage = {
          id: messages.length + 2,
          text: response.response,
          sender: 'bot',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "I apologize, but I am currently experiencing technical difficulties. Please try again later or contact support for assistance with your farming questions.",
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

  const toggleVoiceRecognition = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const detectLanguage = (text) => {
    const devanagariPattern = /[ऀ-ॿ]/;
    
    if (devanagariPattern.test(text)) {
      // Marathi specific words/patterns
      const marathiWords = ['मराठी', 'महाराष्ट्र', 'आहे', 'आणि', 'करतो', 'करते', 'होते', 'आम्ही'];
      const isMarathi = marathiWords.some(word => text.includes(word));
      
      return isMarathi ? 'mr-IN' : 'hi-IN';
    }
    return 'en-US';
  };

  const speakMessage = (text, messageId) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking && speakingMessageId === messageId) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
        setSpeakingMessageId(null);
        return;
      }
      
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      const detectedLang = detectLanguage(text);
      utterance.lang = detectedLang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpeakingMessageId(messageId);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        } text-white`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-green-500 text-white p-4 rounded-t-lg flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold"><TranslatableText>KrishiMitra AI</TranslatableText></h3>
              <p className="text-xs text-green-100"><TranslatableText>Farming Assistant</TranslatableText></p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-green-500 text-white'
                }`}>
                  {message.sender === 'user' ? 
                    <User className="w-3 h-3" /> : 
                    <Bot className="w-3 h-3" />
                  }
                </div>
                <div className={`max-w-xs ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block p-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    {message.sender === 'bot' && (
                      <button
                        onClick={() => speakMessage(message.text, message.id)}
                        className={`ml-2 p-1 rounded transition-colors ${
                          isSpeaking && speakingMessageId === message.id
                            ? 'bg-red-100 hover:bg-red-200 text-red-600'
                            : 'hover:bg-gray-200 text-gray-600'
                        }`}
                        title={isSpeaking && speakingMessageId === message.id ? 'Stop speaking' : 'Listen to response'}
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-gray-100 p-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about farming, crops, diseases..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={toggleVoiceRecognition}
                disabled={isLoading}
                className={`p-2 rounded-md transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } disabled:bg-gray-300`}
                title={isListening ? 'Stop listening' : 'Start voice input (Marathi)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 disabled:bg-gray-300 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              <TranslatableText>Powered by Gemini AI</TranslatableText>
              {isListening && (
                <span className="block text-blue-600 font-medium">
                  <TranslatableText>🎤 Listening in Marathi...</TranslatableText>
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PlantixChatbot;


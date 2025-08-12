import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await axios.post('https://api.gemini.com/v1/your_endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_GEMINI_API_KEY',
        },
        data: JSON.stringify({ query: input })
      });
      const botMessage = { sender: 'bot', text: response.data.answer };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching data from Gemini:', error);
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong!' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 m-8 w-full max-w-sm bg-white shadow-lg rounded-lg p-4">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`p-2 text-sm ${message.sender === 'user' ? 'text-blue-600 text-right' : 'text-green-600'}`}>
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring"
        placeholder="Type a message..."
      />
      <button
        onClick={sendMessage}
        className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded"
      >
        Send
      </button>
    </div>
  );
};

export default Chatbot;


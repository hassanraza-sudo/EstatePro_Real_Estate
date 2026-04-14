import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MinusSquare, PlusSquare, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const ChatBox = ({ receiverId, receiverName, receiverRole }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  // Simulate loading messages from an API
  useEffect(() => {
    const timer = setTimeout(() => {
      const sampleMessages = [
        {
          id: 1,
          text: `Hello! I'm interested in learning more about the property.`,
          sender: currentUser?.id,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          text: `Hi there! I'd be happy to help. What would you like to know?`,
          sender: receiverId,
          timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          text: `Is the property still available for viewing this weekend?`,
          sender: currentUser?.id,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 4,
          text: `Yes, it's available. Would you like to schedule a visit?`,
          sender: receiverId,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setMessages(sampleMessages);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentUser, receiverId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      text: newMessage,
      sender: currentUser?.id,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simulate response after delay
    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        text: "Thank you for your message. I'll get back to you shortly.",
        sender: receiverId,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className={`fixed bottom-4 right-4 z-40 w-72 sm:w-80 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out ${isMinimized ? 'h-14' : 'h-96'}`}>
      {/* Chat header */}
      <div className="bg-blue-600 text-white rounded-t-lg p-3 flex justify-between items-center cursor-pointer" 
        onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center">
          <div className="bg-white rounded-full p-1 mr-2">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-sm">{receiverName}</h3>
            <p className="text-xs text-blue-100 capitalize">{receiverRole}</p>
          </div>
        </div>
        <div className="flex space-x-1">
          {isMinimized ? (
            <PlusSquare className="h-5 w-5" />
          ) : (
            <MinusSquare className="h-5 w-5" />
          )}
          <X className="h-5 w-5" />
        </div>
      </div>
      
      {!isMinimized && (
        <>
          {/* Messages container */}
          <div className="p-3 h-64 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => {
                  const isCurrentUser = message.sender === currentUser?.id;
                  // Show date if first message or if date is different from previous message
                  const showDate = index === 0 || 
                    formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                  
                  return (
                    <React.Fragment key={message.id}>
                      {showDate && (
                        <div className="text-center my-2">
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
                        <div className={`max-w-[80%] rounded-lg px-3 py-2 ${isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                          <p className="text-sm">{message.text}</p>
                          <span className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'} block text-right mt-1`}>
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          
          {/* Input form */}
          <div className="border-t border-gray-200 p-3">
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow py-2 px-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 rounded-r-md hover:bg-blue-700 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
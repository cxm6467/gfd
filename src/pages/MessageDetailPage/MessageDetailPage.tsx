import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Settings } from 'lucide-react';
import { AppLayout } from '../../components/templates/AppLayout';
import { Avatar } from '../../components/atoms/Avatar';
import { MessageBubble } from '../../components/molecules/MessageBubble';
import { mockMessages } from '../../data/mockData';
import { useTheme } from '../../hooks/useTheme';

export const MessageDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [newMessage, setNewMessage] = useState('');

  // TODO: Implement real-time messaging with Socket.io
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      // TODO: Send message via API
      setNewMessage('');
    }
  };

  return (
    <div className={`min-h-screen ${theme.colors.background} flex flex-col`}>
      {/* Custom Header for Message Detail */}
      <header className={`${theme.colors.surface} shadow-sm border-b ${theme.colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/messages')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <Avatar emoji="👨‍🍳" size="sm" />
                <div>
                  <h2 className={`text-lg font-semibold ${theme.colors.text}`}>Alex</h2>
                  <p className="text-sm text-green-500">Online now</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-2">
          {mockMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className={`${theme.colors.surface} border-t ${theme.colors.border} p-4 safe-area-pb`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className={`flex-1 border ${theme.colors.border} rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
            />
            <button 
              onClick={handleSendMessage}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
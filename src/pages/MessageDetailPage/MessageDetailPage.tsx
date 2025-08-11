import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Settings } from 'lucide-react';
import { AppLayout } from '../../components/templates/AppLayout';
import { Avatar } from '../../components/atoms/Avatar';
import { MessageBubble } from '../../components/molecules/MessageBubble';
import { AIMessageSuggestions } from '../../components/molecules/AIMessageSuggestions';
import { mockMessages } from '../../data/mockData';
import { StorageService } from '../../services/storageService';
import { AIModerationService } from '../../services/aiModerationService';
import { useTheme } from '../../hooks/useTheme';

export const MessageDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(() => {
    // Load messages from session storage
    const conversationState = storageService.getConversationState(id || '');
    return conversationState.messages || mockMessages;
  });
  const [moderationWarning, setModerationWarning] = useState<string | null>(null);
  
  const storageService = StorageService.getInstance();
  const aiModerationService = AIModerationService.getInstance();
  
  // Get match data from session storage
  const matches = storageService.getMatches();
  const currentMatch = matches.find(match => match.id === id);
  
  // Fallback to mock data if no match found
  const matchName = currentMatch?.profile?.name || 'Alex';
  const matchEmoji = currentMatch?.profile?.emoji || '👨‍🍳';
  const matchDietaryInfo = currentMatch?.profile?.dietaryInfo || 'Gluten-Free';

  // TODO: Implement real-time messaging with Socket.io
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        // Moderate message content
        const moderationResult = await aiModerationService.moderateMessage(
          newMessage, 
          id || ''
        );

        if (!moderationResult.isAllowed) {
          setModerationWarning(moderationResult.reason || 'Message contains inappropriate content');
          return;
        }

        if (moderationResult.suggestedEdit) {
          setModerationWarning(`Suggestion: ${moderationResult.suggestedEdit}`);
          return;
        }

        // Create new message
        const message = {
          id: Date.now(),
          sender: 'Me',
          message: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true
        };

        // Add to messages
        const updatedMessages = [...messages, message];
        setMessages(updatedMessages);

        // Save to session storage
        storageService.saveConversationState(id || '', {
          messages: updatedMessages,
          lastMessage: message,
          lastActivity: new Date().toISOString()
        });

        console.log('Message sent:', newMessage);
        setModerationWarning(null);
      } catch (error) {
        console.error('Error sending message:', error);
        setModerationWarning('Failed to send message. Please try again.');
      }
      
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
                <Avatar emoji={matchEmoji} size="sm" />
                <div>
                  <h2 className={`text-lg font-semibold ${theme.colors.text}`}>{matchName}</h2>
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
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className={`${theme.colors.surface} border-t ${theme.colors.border} p-4 safe-area-pb`}>
        <div className="max-w-4xl mx-auto">
          {/* AI Suggestions */}
          <AIMessageSuggestions
            conversationId={id || ''}
            matchName={matchName}
            dietaryInfo={matchDietaryInfo}
            onSuggestionSelect={setNewMessage}
          />

          {/* Moderation Warning */}
          {moderationWarning && (
            <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">{moderationWarning}</p>
            </div>
          )}

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
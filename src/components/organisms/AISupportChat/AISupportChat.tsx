import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Minimize2 } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface AISupportChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AISupportChat: React.FC<AISupportChatProps> = ({ isOpen, onToggle }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your GF'd support assistant. I can help you with account questions, safety tips, gluten-free dining recommendations, and more. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    // Safety-related responses
    if (input.includes('safety') || input.includes('report') || input.includes('block')) {
      return "Safety is our top priority! You can report users by clicking the three dots on their profile or in conversations. For immediate safety concerns, contact our 24/7 safety team at safety@gfd.com. Would you like me to guide you through the reporting process?";
    }

    // Account-related responses
    if (input.includes('account') || input.includes('profile') || input.includes('delete') || input.includes('subscription')) {
      return "I can help with account management! For profile updates, go to your Profile tab. To manage subscriptions, visit Settings > Subscription. To delete your account, go to Settings > Account > Delete Account. Is there a specific account issue I can help you with?";
    }

    // Gluten-free dining responses
    if (input.includes('restaurant') || input.includes('dining') || input.includes('gluten') || input.includes('celiac')) {
      return "Great question about gluten-free dining! Our Restaurants tab shows verified GF-friendly places with safety ratings. Look for the shield icon for dedicated prep areas. Always inform restaurant staff about your sensitivity level. Would you like tips for safe dining or help finding restaurants in your area?";
    }

    // Matching and dating responses
    if (input.includes('match') || input.includes('like') || input.includes('dating') || input.includes('message')) {
      return "I can help with matching and messaging! Our algorithm considers dietary compatibility, location, and shared interests. To get better matches, complete your profile and be specific about your gluten-free needs. Having trouble with matches or messages?";
    }

    // Technical support responses
    if (input.includes('bug') || input.includes('error') || input.includes('problem') || input.includes('not working')) {
      return "Sorry you're experiencing technical issues! Try refreshing the app or logging out and back in. For persistent problems, please email support@gfd.com with details about your device and the issue. I can also help troubleshoot common problems - what specifically isn't working?";
    }

    // Verification responses
    if (input.includes('verify') || input.includes('verification') || input.includes('badge')) {
      return "Verification helps build trust in our community! You can verify your photos, ID, and location in the Verification tab. Photo verification usually takes 24-48 hours. Verified profiles get 3x more matches! Need help with the verification process?";
    }

    // Default response
    return "I'm here to help! I can assist with account questions, safety concerns, gluten-free dining tips, matching advice, technical support, and verification. You can also contact our human support team at support@gfd.com for more complex issues. What would you like to know more about?";
  };

  const quickActions = [
    "How do I report someone?",
    "Find gluten-free restaurants",
    "Why am I not getting matches?",
    "How to verify my profile?",
    "Delete my account"
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">GF'd Support</h3>
            <p className="text-xs text-blue-100">AI Assistant • Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggle}
            className="p-1 hover:bg-blue-500 rounded transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-blue-500 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-3 h-3 text-white" />
                ) : (
                  <Bot className="w-3 h-3 text-gray-600" />
                )}
              </div>
              <div className={`rounded-2xl px-4 py-2 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <Bot className="w-3 h-3 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.slice(0, 3).map((action, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(action)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          AI responses • For urgent issues, email support@gfd.com
        </p>
      </div>
    </div>
  );
};
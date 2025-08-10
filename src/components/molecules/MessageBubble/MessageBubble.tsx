import React from 'react';
import { Message } from '../../../types';
import { useTheme } from '../../../hooks/useTheme';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { theme } = useTheme();

  return (
    <div className={`flex ${message.isMe ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 ${theme.borderRadius.lg} ${
        message.isMe 
          ? 'bg-red-500 text-white' 
          : `${theme.colors.surface} ${theme.colors.text} shadow-sm`
      }`}>
        <p className="text-sm">{message.message}</p>
        <p className={`text-xs mt-1 ${message.isMe ? 'text-red-100' : theme.colors.textSecondary}`}>
          {message.time}
        </p>
      </div>
    </div>
  );
};
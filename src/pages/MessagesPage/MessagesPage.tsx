import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/templates/AppLayout';
import { Avatar } from '../../components/atoms/Avatar';
import { mockMatches } from '../../data/mockData';
import { useTheme } from '../../hooks/useTheme';

export const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pt-4 md:pt-8 px-4">
        <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text} mb-6 md:mb-8`}>
          Messages
        </h1>
        
        <div className={`${theme.colors.surface} ${theme.borderRadius.md} shadow-md overflow-hidden`}>
          {mockMatches.map((match, index) => (
            <div 
              key={match.id} 
              className={`p-4 md:p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                index !== mockMatches.length - 1 ? `border-b ${theme.colors.border}` : ''
              }`}
              onClick={() => navigate(`/messages/${match.id}`)}
            >
              <div className="flex items-center space-x-4">
                <Avatar emoji={match.emoji} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-semibold ${theme.colors.text} truncate`}>
                      {match.name}
                    </h3>
                    <span className={`text-sm ${theme.colors.textSecondary} flex-shrink-0 ml-2`}>
                      {match.time}
                    </span>
                  </div>
                  <p className={`${theme.colors.textSecondary} truncate`}>
                    {match.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};
import React from 'react';
import { Match } from '../../../types';
import { Avatar } from '../../atoms/Avatar';
import { Button } from '../../atoms/Button';
import { useTheme } from '../../../hooks/useTheme';

interface MatchCardProps {
  match: Match;
  onMessage: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onMessage }) => {
  const { theme } = useTheme();

  return (
    <div className={`${theme.colors.surface} ${theme.borderRadius.md} shadow-md overflow-hidden hover:shadow-lg transition-shadow`}>
      <div className={theme.spacing.md}>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar emoji={match.emoji} size="lg" />
          <div className="flex-1">
            <h3 className={`text-xl font-semibold ${theme.colors.text}`}>{match.name}</h3>
            <p className={`${theme.colors.textSecondary} text-sm`}>{match.time}</p>
          </div>
        </div>
        <p className={`${theme.colors.text} mb-4`}>{match.lastMessage}</p>
        <Button onClick={onMessage} fullWidth>
          Send Message
        </Button>
      </div>
    </div>
  );
};
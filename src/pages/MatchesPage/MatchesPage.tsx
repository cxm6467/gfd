import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/templates/AppLayout';
import { MatchCard } from '../../components/molecules/MatchCard';
import { mockMatches } from '../../data/mockData';
import { useTheme } from '../../hooks/useTheme';

export const MatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pt-4 md:pt-8 px-4">
        <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text} mb-6 md:mb-8`}>
          Your Matches
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {mockMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onMessage={() => navigate(`/messages/${match.id}`)}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};
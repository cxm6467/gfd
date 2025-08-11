import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { AppLayout } from '../../components/templates/AppLayout';
import { MatchCard } from '../../components/molecules/MatchCard';
import { Button } from '../../components/atoms/Button';
import { mockMatches } from '../../data/mockData';
import { useMatchesStorage } from '../../hooks/useSessionStorage';
import { useTheme } from '../../hooks/useTheme';

export const MatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { matches } = useMatchesStorage();

  // Convert session storage matches to display format
  const displayMatches = matches.map(match => ({
    id: match.profile?.id || match.id,
    name: match.profile?.name || 'Unknown',
    lastMessage: match.lastMessage || "You matched! Say hello 👋",
    time: match.matchedAt ? new Date(match.matchedAt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }) : 'Just now',
    emoji: match.profile?.emoji || '👤'
  }));

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pt-4 md:pt-8 px-4">
        <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text} mb-6 md:mb-8`}>
          Your Matches
        </h1>
        
        {displayMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {displayMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onMessage={() => navigate(`/messages/${match.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className={`text-xl font-semibold ${theme.colors.text} mb-2`}>No matches yet</h3>
            <p className={`${theme.colors.textSecondary} mb-6`}>
              Start swiping to find your perfect gluten-free match!
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Discover People
            </Button>
          </div>
        )}

        {/* Debug Info */}
        {import.meta.env.DEV && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-medium mb-2">Debug Info:</h3>
            <p className="text-sm text-gray-600">
              Session matches: {matches.length} | Display matches: {displayMatches.length}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
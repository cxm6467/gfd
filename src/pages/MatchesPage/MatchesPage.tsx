import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { AppLayout } from '../../components/templates/AppLayout';
import { MatchCard } from '../../components/molecules/MatchCard';
import { Button } from '../../components/atoms/Button';
import { MatchService } from '../../services/matchService';
import { useAuth } from '../../hooks/useAuth';
import { Match } from '../../types';
import { useTheme } from '../../hooks/useTheme';

export const MatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const matchService = MatchService.getInstance();

  useEffect(() => {
    loadMatches();
  }, [user]);

  const loadMatches = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const userMatches = await matchService.getMatches(user.id);
      setMatches(userMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pt-4 md:pt-8 px-4">
        <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text} mb-6 md:mb-8`}>
          Your Matches
        </h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className={theme.colors.textSecondary}>Loading your matches...</p>
          </div>
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {matches.map((match) => (
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
      </div>
    </AppLayout>
  );
};
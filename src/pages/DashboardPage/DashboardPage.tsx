import React from 'react';
import { AppLayout } from '../../components/templates/AppLayout';
import { SwipeStack } from '../../components/organisms/SwipeStack';
import { mockProfiles } from '../../data/mockData';
import { User } from '../../types';
import { MatchService } from '../../services/matchService';
import { useAuth } from '../../hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const matchService = MatchService.getInstance();
  
  const handleLike = (profile: User) => {
    console.log('Liked:', profile.name);
    // Like action is handled by SwipeStack component
  };

  const handlePass = (profile: User) => {
    console.log('Passed:', profile.name);
    // Pass action is handled by SwipeStack component
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto pt-4 md:pt-8 px-4">
        <SwipeStack
          profiles={mockProfiles}
          onLike={handleLike}
          onPass={handlePass}
        />
      </div>
    </AppLayout>
  );
};
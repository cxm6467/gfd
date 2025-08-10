import React from 'react';
import { AppLayout } from '../../components/templates/AppLayout';
import { SwipeStack } from '../../components/organisms/SwipeStack';
import { mockProfiles } from '../../data/mockData';
import { User } from '../../types';

export const DashboardPage: React.FC = () => {
  // TODO: Implement real profile service integration
  const handleLike = (profile: User) => {
    console.log('Liked:', profile.name);
    // TODO: Send like to backend API
  };

  const handlePass = (profile: User) => {
    console.log('Passed:', profile.name);
    // TODO: Send pass to backend API
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
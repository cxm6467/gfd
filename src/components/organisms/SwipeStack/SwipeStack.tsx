import React, { useState } from 'react';
import { User } from '../../../types';
import { ProfileCard } from '../../molecules/ProfileCard';
import { Button } from '../../atoms/Button';
import { Heart, X } from 'lucide-react';

interface SwipeStackProps {
  profiles: User[];
  onLike: (profile: User) => void;
  onPass: (profile: User) => void;
}

export const SwipeStack: React.FC<SwipeStackProps> = ({ profiles, onLike, onPass }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLike = () => {
    if (currentIndex < profiles.length) {
      onLike(profiles[currentIndex]);
      setCurrentIndex((prev) => (prev + 1) % profiles.length);
    }
  };

  const handlePass = () => {
    if (currentIndex < profiles.length) {
      onPass(profiles[currentIndex]);
      setCurrentIndex((prev) => (prev + 1) % profiles.length);
    }
  };

  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No more profiles to show</p>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="relative">
      {/* Profile Stack */}
      <div className="relative h-[600px] mb-6">
        <ProfileCard
          profile={currentProfile}
          onSwipeLeft={handlePass}
          onSwipeRight={handleLike}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-6">
        <button
          onClick={handlePass}
          className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl"
        >
          <X className="w-8 h-8" />
        </button>
        <button
          onClick={handleLike}
          className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
        >
          <Heart className="w-8 h-8 fill-current" />
        </button>
      </div>
    </div>
  );
};
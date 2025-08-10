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
  const [removedProfiles, setRemovedProfiles] = useState<Set<number>>(new Set());

  // Filter out profiles that have been swiped
  const activeProfiles = profiles.filter(profile => !removedProfiles.has(profile.id));

  const handleLike = () => {
    if (currentIndex < activeProfiles.length) {
      const currentProfile = activeProfiles[currentIndex];
      onLike(currentProfile);
      setRemovedProfiles(prev => new Set([...prev, currentProfile.id]));
      
      // Move to next profile or reset if we've seen all
      if (currentIndex >= activeProfiles.length - 1) {
        setCurrentIndex(0);
      }
    }
  };

  const handlePass = () => {
    if (currentIndex < activeProfiles.length) {
      const currentProfile = activeProfiles[currentIndex];
      onPass(currentProfile);
      setRemovedProfiles(prev => new Set([...prev, currentProfile.id]));
      
      // Move to next profile or reset if we've seen all
      if (currentIndex >= activeProfiles.length - 1) {
        setCurrentIndex(0);
      }
    }
  };

  if (activeProfiles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <p className="text-gray-500 text-lg">You've seen all available profiles!</p>
          <button
            onClick={() => {
              setRemovedProfiles(new Set());
              setCurrentIndex(0);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Show Profiles Again
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = activeProfiles[currentIndex];
  const nextProfile = activeProfiles[currentIndex + 1];

  return (
    <div className="relative">
      {/* Profile Stack */}
      <div className="relative h-[600px] mb-6">
        {/* Next Profile (Background) */}
        {nextProfile && (
          <div className="absolute inset-0 transform scale-95 opacity-50">
            <ProfileCard
              profile={nextProfile}
              onSwipeLeft={() => {}}
              onSwipeRight={() => {}}
              style={{ pointerEvents: 'none' }}
            />
          </div>
        )}
        
        {/* Current Profile (Foreground) */}
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
      
      {/* Profile Counter */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          {activeProfiles.length - currentIndex} profiles remaining
        </p>
      </div>
    </div>
  );
};
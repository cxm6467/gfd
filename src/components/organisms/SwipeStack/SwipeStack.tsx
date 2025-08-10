import React, { useState } from 'react';
import { useEffect } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('swipe_current_index');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [removedProfiles, setRemovedProfiles] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('swipe_removed_profiles');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('swipe_current_index', currentIndex.toString());
  }, [currentIndex]);

  useEffect(() => {
    localStorage.setItem('swipe_removed_profiles', JSON.stringify([...removedProfiles]));
  }, [removedProfiles]);

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

  const handleReset = () => {
    setRemovedProfiles(new Set());
    setCurrentIndex(0);
    // Clear localStorage
    localStorage.removeItem('swipe_removed_profiles');
    localStorage.removeItem('swipe_current_index');
  };
  if (activeProfiles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">You've seen everyone!</h3>
          <p className="text-gray-500 mb-6">Check back later for new profiles, or review the ones you've seen.</p>
          <Button onClick={handleReset} variant="outline">
            Show Profiles Again
          </Button>
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
          {activeProfiles.length} of {profiles.length} profiles remaining
        </p>
        {removedProfiles.size > 0 && (
          <button
            onClick={handleReset}
            className="text-xs text-blue-600 hover:text-blue-700 mt-2 underline"
          >
            Reset and see all profiles again
          </button>
        )}
      </div>
    </div>
  );
};
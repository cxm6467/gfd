import React, { useState } from 'react';
import { useEffect } from 'react';
import { User } from '../../../types';
import { ProfileCard } from '../../molecules/ProfileCard';
import { Button } from '../../atoms/Button';
import { MatchService } from '../../../services/matchService';
import { useAuth } from '../../../hooks/useAuth';
import { Heart, X } from 'lucide-react';
import { StorageService } from '../../../services/storageService';

interface SwipeStackProps {
  profiles: User[];
  onLike: (profile: User) => void;
  onPass: (profile: User) => void;
}

export const SwipeStack: React.FC<SwipeStackProps> = ({ profiles, onLike, onPass }) => {
  const { user } = useAuth();
  const matchService = MatchService.getInstance();
  const storageService = StorageService.getInstance();
  
  const [currentIndex, setCurrentIndex] = useState(() => {
    // Try session storage first, then localStorage
    const sessionState = storageService.getAppState();
    if (sessionState.currentIndex !== undefined) {
      return sessionState.currentIndex;
    }
    const saved = localStorage.getItem('swipe_current_index');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [removedProfiles, setRemovedProfiles] = useState<Set<number>>(() => {
    // Try session storage first, then localStorage
    const sessionState = storageService.getAppState();
    if (sessionState.removedProfiles) {
      return new Set(sessionState.removedProfiles);
    }
    const saved = localStorage.getItem('swipe_removed_profiles');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('swipe_current_index', currentIndex.toString());
    // Also save to session storage
    const appState = storageService.getAppState();
    storageService.saveAppState({
      ...appState,
      currentIndex,
      lastUpdated: new Date().toISOString()
    });
  }, [currentIndex]);

  useEffect(() => {
    localStorage.setItem('swipe_removed_profiles', JSON.stringify([...removedProfiles]));
    // Also save to session storage
    const appState = storageService.getAppState();
    storageService.saveAppState({
      ...appState,
      removedProfiles: [...removedProfiles],
      lastUpdated: new Date().toISOString()
    });
  }, [removedProfiles]);

  // Filter out profiles that have been swiped
  const activeProfiles = profiles.filter(profile => !removedProfiles.has(profile.id));

  const handleLike = async () => {
    if (currentIndex < activeProfiles.length) {
      const currentProfile = activeProfiles[currentIndex];
      
      // Add to matches system
      if (user) {
        try {
          const result = await matchService.addLike(user.id, currentProfile);
          if (result.isMatch) {
            // Show match notification
            alert(`🎉 It's a match with ${currentProfile.name}! Check your Matches tab.`);
            // TODO: Replace with proper match notification UI
          }
        } catch (error) {
          console.error('Error adding like:', error);
        }
      }
      
      onLike(currentProfile);
      setRemovedProfiles(prev => new Set([...prev, currentProfile.id]));
      
      // Move to next profile
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePass = async () => {
    if (currentIndex < activeProfiles.length) {
      const currentProfile = activeProfiles[currentIndex];
      
      // Save pass action to session storage
      storageService.addSwipeAction('pass', currentProfile.id.toString());
      
      onPass(currentProfile);
      setRemovedProfiles(prev => new Set([...prev, currentProfile.id]));
      
      // Move to next profile
      setCurrentIndex(prev => prev + 1);
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

  // Safety check: if no current profile, show empty state
  if (!currentProfile) {
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
          disabled={!currentProfile}
          className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl"
        >
          <X className="w-8 h-8" />
        </button>
        <button
          onClick={handleLike}
          disabled={!currentProfile}
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
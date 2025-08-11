import { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';

export const useSessionStorage = <T>(key: string, defaultValue: T) => {
  const storageService = StorageService.getInstance();
  
  const [value, setValue] = useState<T>(() => {
    const stored = storageService.getItem<T>(key);
    return stored !== null ? stored : defaultValue;
  });

  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
    setValue(valueToStore);
    storageService.setItem(key, valueToStore);
  };

  const removeStoredValue = () => {
    setValue(defaultValue);
    storageService.removeItem(key);
  };

  return [value, setStoredValue, removeStoredValue] as const;
};

// Specialized hooks for common use cases
export const useMatchesStorage = () => {
  const storageService = StorageService.getInstance();
  
  const [matches, setMatches] = useState(() => storageService.getMatches());

  const addMatch = (match: any) => {
    storageService.addMatch(match);
    setMatches(storageService.getMatches());
  };

  const removeMatch = (matchId: string) => {
    storageService.removeMatch(matchId);
    setMatches(storageService.getMatches());
  };

  const clearMatches = () => {
    storageService.saveMatches([]);
    setMatches([]);
  };

  return { matches, addMatch, removeMatch, clearMatches };
};

export const useProfileChanges = () => {
  const storageService = StorageService.getInstance();
  
  const [profileChanges, setProfileChanges] = useState(() => 
    storageService.getProfileChanges()
  );

  const updateField = (field: string, value: any) => {
    storageService.updateProfileField(field, value);
    setProfileChanges(storageService.getProfileChanges());
  };

  const saveChanges = (changes: any) => {
    storageService.saveProfileChanges(changes);
    setProfileChanges(changes);
  };

  const clearChanges = () => {
    storageService.saveProfileChanges({});
    setProfileChanges({});
  };

  const hasUnsavedChanges = () => {
    return Object.keys(profileChanges).length > 0;
  };

  return { 
    profileChanges, 
    updateField, 
    saveChanges, 
    clearChanges, 
    hasUnsavedChanges 
  };
};

export const useSwipeHistory = () => {
  const storageService = StorageService.getInstance();
  
  const [swipeHistory, setSwipeHistory] = useState(() => 
    storageService.getSwipeHistory()
  );

  const addSwipe = (action: 'like' | 'pass' | 'superLike', profileId: string) => {
    storageService.addSwipeAction(action, profileId);
    setSwipeHistory(storageService.getSwipeHistory());
  };

  const clearHistory = () => {
    storageService.saveSwipeHistory({
      liked: [],
      passed: [],
      superLiked: []
    });
    setSwipeHistory(storageService.getSwipeHistory());
  };

  return { swipeHistory, addSwipe, clearHistory };
};
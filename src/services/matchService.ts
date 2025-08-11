import { User, Match } from '../types';
import { StorageService } from './storageService';

export interface MatchData {
  id: string;
  userId: string;
  likedUserId: string;
  isMatch: boolean; // true if both users liked each other
  createdAt: Date;
}

export class MatchService {
  private static instance: MatchService;
  private storageService = StorageService.getInstance();
  
  static getInstance(): MatchService {
    if (!MatchService.instance) {
      MatchService.instance = new MatchService();
    }
    return MatchService.instance;
  }

  // Add a like and check for mutual match
  async addLike(currentUserId: string, likedProfile: User): Promise<{ isMatch: boolean; matchId?: string }> {
    console.log('Adding like:', currentUserId, 'likes', likedProfile.id);
    
    // Check if we already have a match with this user
    const existingMatches = this.storageService.getMatches();
    const alreadyMatched = existingMatches.find(match => 
      match.profile?.id === likedProfile.id || 
      match.matchedUserId === likedProfile.id.toString()
    );
    
    if (alreadyMatched) {
      console.log('Already matched with this user');
      return { isMatch: true, matchId: alreadyMatched.id };
    }
    
    // For demo purposes, simulate that some profiles like you back (50% chance)
    const isLikedBack = Math.random() > 0.5;
    
    // Get existing likes from session storage
    const existingLikes = this.getLikes();
    
    // Save swipe action to session storage
    this.storageService.addSwipeAction('like', likedProfile.id.toString());
    
    // Create new like
    const newLike: MatchData = {
      id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUserId,
      likedUserId: likedProfile.id.toString(),
      isMatch: isLikedBack,
      createdAt: new Date()
    };

    // Save the like
    existingLikes.push(newLike);
    this.saveLikes(existingLikes);

    if (isLikedBack) {
      // It's a match! Add to matches
      console.log(`🎉 It's a match with ${likedProfile.name}!`);

      await this.addMatch(currentUserId, likedProfile);
      
      // Save match to session storage
      this.storageService.addMatch({
        id: `match_${Date.now()}`,
        userId: currentUserId,
        matchedUserId: likedProfile.id.toString(),
        profile: likedProfile,
        matchedAt: new Date().toISOString(),
        lastMessage: "You matched! Say hello 👋"
      });
      
      return { isMatch: true, matchId: newLike.id };
    } else {
      console.log(`👍 Liked ${likedProfile.name}, waiting for them to like back...`);
      return { isMatch: false };
    }
  }

  // Get all matches for current user
  async getMatches(userId: string): Promise<Match[]> {
    // Get matches from session storage
    const sessionMatches = this.storageService.getMatches();
    
    // Convert session matches to Match format
    return sessionMatches.map(match => ({
      id: parseInt(match.id.replace(/\D/g, '')) || Math.floor(Math.random() * 1000),
      name: match.profile?.name || 'Unknown',
      lastMessage: match.lastMessage || "You matched! Say hello 👋",
      time: this.formatTime(new Date(match.matchedAt)),
      emoji: match.profile?.emoji || '👤'
    }));
  }

  // Add a new match
  private async addMatch(userId: string, matchedUser: User): Promise<void> {
    const matches = this.getStoredMatches();
    
    const newMatch = {
      id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      participants: [userId, matchedUser.id.toString()],
      createdAt: new Date(),
      lastMessage: null,
      isActive: true
    };

    matches.push(newMatch);
    localStorage.setItem('user_matches', JSON.stringify(matches));
    
    // Also save to session storage
    this.storageService.addMatch({
      ...newMatch,
      profile: matchedUser,
      matchedAt: newMatch.createdAt.toISOString()
    });
  }

  // Helper methods
  private getLikes(): MatchData[] {
    const stored = localStorage.getItem('user_likes');
    return stored ? JSON.parse(stored) : [];
  }

  private saveLikes(likes: MatchData[]): void {
    localStorage.setItem('user_likes', JSON.stringify(likes));
  }

  private getStoredMatches(): any[] {
    const stored = localStorage.getItem('user_matches');
    return stored ? JSON.parse(stored) : [];
  }

  private findUserById(userId: string): User | undefined {
    // Import mock profiles to find user data
    try {
      const { mockProfiles } = require('../data/mockData');
      return mockProfiles.find((user: User) => user.id.toString() === userId);
    } catch (error) {
      console.error('Error loading mock profiles:', error);
      return undefined;
    }
  }

  private formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  // Clear all matches and likes (for testing)
  clearAllData(): void {
    localStorage.removeItem('user_likes');
    localStorage.removeItem('user_matches');
    localStorage.removeItem('swipe_removed_profiles');
    localStorage.removeItem('swipe_current_index');
  }
}
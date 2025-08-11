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
    
    // Get existing likes from session storage
    const existingLikes = this.getLikes();
    
    // Save swipe action to session storage
    this.storageService.addSwipeAction('like', likedProfile.id.toString());
    
    // Create new like
    const newLike: MatchData = {
      id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUserId,
      likedUserId: likedProfile.id.toString(),
      isMatch: false,
      createdAt: new Date()
    };

    // Check if the other user already liked us (mutual match)
    const mutualLike = existingLikes.find(like => 
      like.userId === likedProfile.id.toString() && 
      like.likedUserId === currentUserId
    );

    if (mutualLike) {
      // It's a match! Update both likes
      newLike.isMatch = true;
      mutualLike.isMatch = true;
      
      // Save updated likes
      const updatedLikes = existingLikes.map(like => 
        like.id === mutualLike.id ? mutualLike : like
      );
      updatedLikes.push(newLike);
      this.saveLikes(updatedLikes);

      // Add to matches
      await this.addMatch(currentUserId, likedProfile);
      
      // Save match to session storage
      this.storageService.addMatch({
        id: newLike.id,
        userId: currentUserId,
        matchedUserId: likedProfile.id.toString(),
        profile: likedProfile,
        matchedAt: new Date().toISOString()
      });
      
      return { isMatch: true, matchId: newLike.id };
    } else {
      // Just a like, not a match yet
      existingLikes.push(newLike);
      this.saveLikes(existingLikes);
      
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
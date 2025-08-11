// Session Storage Service - Persistent data across browser sessions
// Handles storing user data, matches, and app state in sessionStorage

export interface StorageData {
  matches: any[];
  profileChanges: any;
  userPreferences: any;
  swipeHistory: any;
  conversationState: any;
}

export class StorageService {
  private static instance: StorageService;
  private readonly STORAGE_KEYS = {
    MATCHES: 'gfd_matches',
    PROFILE_CHANGES: 'gfd_profile_changes',
    USER_PREFERENCES: 'gfd_user_preferences',
    SWIPE_HISTORY: 'gfd_swipe_history',
    CONVERSATION_STATE: 'gfd_conversation_state',
    APP_STATE: 'gfd_app_state'
  };

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Generic storage methods
  setItem<T>(key: string, data: T): void {
    try {
      const serialized = JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
        version: '1.0'
      });
      sessionStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Error saving to session storage:', error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const stored = sessionStorage.getItem(key);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return parsed.data;
    } catch (error) {
      console.error('Error reading from session storage:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  // Match-specific methods
  saveMatches(matches: any[]): void {
    this.setItem(this.STORAGE_KEYS.MATCHES, matches);
  }

  getMatches(): any[] {
    return this.getItem(this.STORAGE_KEYS.MATCHES) || [];
  }

  addMatch(match: any): void {
    const existingMatches = this.getMatches();
    const updatedMatches = [...existingMatches, match];
    this.saveMatches(updatedMatches);
  }

  removeMatch(matchId: string): void {
    const existingMatches = this.getMatches();
    const updatedMatches = existingMatches.filter(m => m.id !== matchId);
    this.saveMatches(updatedMatches);
  }

  // Profile changes methods
  saveProfileChanges(changes: any): void {
    this.setItem(this.STORAGE_KEYS.PROFILE_CHANGES, changes);
  }

  getProfileChanges(): any {
    return this.getItem(this.STORAGE_KEYS.PROFILE_CHANGES) || {};
  }

  updateProfileField(field: string, value: any): void {
    const existingChanges = this.getProfileChanges();
    const updatedChanges = {
      ...existingChanges,
      [field]: value,
      lastUpdated: new Date().toISOString()
    };
    this.saveProfileChanges(updatedChanges);
  }

  // User preferences methods
  saveUserPreferences(preferences: any): void {
    this.setItem(this.STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  getUserPreferences(): any {
    return this.getItem(this.STORAGE_KEYS.USER_PREFERENCES) || {};
  }

  updatePreference(key: string, value: any): void {
    const existingPrefs = this.getUserPreferences();
    const updatedPrefs = {
      ...existingPrefs,
      [key]: value,
      lastUpdated: new Date().toISOString()
    };
    this.saveUserPreferences(updatedPrefs);
  }

  // Swipe history methods
  saveSwipeHistory(history: any): void {
    this.setItem(this.STORAGE_KEYS.SWIPE_HISTORY, history);
  }

  getSwipeHistory(): any {
    return this.getItem(this.STORAGE_KEYS.SWIPE_HISTORY) || {
      liked: [],
      passed: [],
      superLiked: []
    };
  }

  addSwipeAction(action: 'like' | 'pass' | 'superLike', profileId: string): void {
    const history = this.getSwipeHistory();
    const actionKey = action === 'superLike' ? 'superLiked' : `${action}d`;
    
    if (!history[actionKey].includes(profileId)) {
      history[actionKey].push(profileId);
      history.lastAction = {
        type: action,
        profileId,
        timestamp: new Date().toISOString()
      };
      this.saveSwipeHistory(history);
    }
  }

  // Conversation state methods
  saveConversationState(conversationId: string, state: any): void {
    const allStates = this.getItem(this.STORAGE_KEYS.CONVERSATION_STATE) || {};
    allStates[conversationId] = {
      ...state,
      lastUpdated: new Date().toISOString()
    };
    this.setItem(this.STORAGE_KEYS.CONVERSATION_STATE, allStates);
  }

  getConversationState(conversationId: string): any {
    const allStates = this.getItem(this.STORAGE_KEYS.CONVERSATION_STATE) || {};
    return allStates[conversationId] || {};
  }

  // App state methods
  saveAppState(state: any): void {
    this.setItem(this.STORAGE_KEYS.APP_STATE, state);
  }

  getAppState(): any {
    return this.getItem(this.STORAGE_KEYS.APP_STATE) || {};
  }

  // Utility methods
  clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
  }

  getStorageInfo(): any {
    const info = {
      totalItems: 0,
      totalSize: 0,
      items: {} as any
    };

    Object.entries(this.STORAGE_KEYS).forEach(([name, key]) => {
      const data = sessionStorage.getItem(key);
      if (data) {
        info.totalItems++;
        info.totalSize += data.length;
        info.items[name] = {
          size: data.length,
          lastModified: JSON.parse(data).timestamp
        };
      }
    });

    return info;
  }

  // Export/Import for debugging
  exportData(): string {
    const data: any = {};
    Object.entries(this.STORAGE_KEYS).forEach(([name, key]) => {
      const stored = this.getItem(key);
      if (stored) {
        data[name] = stored;
      }
    });
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      Object.entries(data).forEach(([name, value]) => {
        const key = this.STORAGE_KEYS[name as keyof typeof this.STORAGE_KEYS];
        if (key) {
          this.setItem(key, value);
        }
      });
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid data format');
    }
  }
}
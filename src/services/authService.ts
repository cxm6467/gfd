// TODO: Authentication Service - Implement with your preferred provider
// This service provides a complete auth system interface for implementation
// Current implementation uses localStorage for development/testing

import { StorageService } from './storageService';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  dietaryRestrictions: string;
  profileImage?: string;
  bio?: string;
  createdAt: Date;
  lastLogin: Date;
  isVerified: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  dietaryRestrictions: string;
  bio?: string;
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private authListeners: ((user: User | null) => void)[] = [];
  private storageService = StorageService.getInstance();

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  constructor() {
    // Load user from localStorage on initialization
    this.loadUserFromStorage();
  }

  // Sign up with email and password
  async signUp(data: SignUpData): Promise<{ user: User; tokens: AuthTokens }> {
    console.log('TODO: Implement real signup - currently using mock data for:', data.email);

    // Validate input
    this.validateSignUpData(data);

    // Check if user already exists
    const existingUsers = this.getStoredUsers();
    if (existingUsers.find(u => u.email === data.email)) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      location: data.location,
      dietaryRestrictions: data.dietaryRestrictions,
      createdAt: new Date(),
      lastLogin: new Date(),
      isVerified: false,
    };

    // Hash password (mock implementation)
    const hashedPassword = await this.hashPassword(data.password);

    // Store user and password
    existingUsers.push(user);
    this.saveUsers(existingUsers);
    this.savePassword(user.id, hashedPassword);

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Set current user
    this.setCurrentUser(user, tokens);

    // Save profile to session storage
    this.storageService.saveProfileChanges({
      userId: user.id,
      profileData: user,
      createdAt: new Date().toISOString()
    });

    return { user, tokens };
  }

  // Sign in with email and password
  async signIn(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    console.log('TODO: Implement real signin - currently using mock data for:', credentials.email);

    const users = this.getStoredUsers();
    const user = users.find(u => u.email === credentials.email);

    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const storedPassword = this.getStoredPassword(user.id);
    const isValidPassword = await this.verifyPassword(credentials.password, storedPassword);

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    // Update last login
    user.lastLogin = new Date();
    this.updateUser(user);

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Set current user
    this.setCurrentUser(user, tokens);

    // Save login to session storage
    this.storageService.updateProfileField('lastLogin', new Date().toISOString());

    return { user, tokens };
  }

  // Quick sign in for test mode
  async quickSignIn(): Promise<{ user: User; tokens: AuthTokens }> {
    // Check if test mode is enabled (either via localStorage or environment)
    const testModeFromStorage = localStorage.getItem('VITE_TEST_MODE');
    const testModeFromEnv = import.meta.env.VITE_TEST_MODE;
    const isTestModeEnabled = testModeFromStorage === 'true' || testModeFromEnv === 'true';
    
    if (!isTestModeEnabled) {
      throw new Error('Quick sign in only available in test mode');
    }
    
    console.log('TODO: Remove quick sign in before production - test mode only');

    // Create or get test user
    let testUser = this.getStoredUsers().find(u => u.email === 'test@gfd.com');
    
    if (!testUser) {
      testUser = {
        id: 'test_user_123',
        email: 'test@gfd.com',
        firstName: 'Test',
        lastName: 'User',
        age: 28,
        location: 'San Francisco, CA',
        dietaryRestrictions: 'celiac_disease',
        createdAt: new Date(),
        lastLogin: new Date(),
        isVerified: true,
      };

      const users = this.getStoredUsers();
      users.push(testUser);
      this.saveUsers(users);
    }

    // Update last login
    testUser.lastLogin = new Date();
    this.updateUser(testUser);

    // Generate tokens
    const tokens = this.generateTokens(testUser);

    // Set current user
    this.setCurrentUser(testUser, tokens);

    // Save test user to session storage
    this.storageService.saveProfileChanges({
      userId: testUser.id,
      profileData: testUser,
      testMode: true,
      createdAt: new Date().toISOString()
    });

    return { user: testUser, tokens };
  }

  // Sign out
  async signOut(): Promise<void> {
    console.log('Signing out user');

    // Clear current user
    this.currentUser = null;
    
    // Clear stored tokens
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('current_user');

    // Notify listeners
    this.notifyAuthListeners(null);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.isTokenValid();
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.authListeners = this.authListeners.filter(listener => listener !== callback);
    };
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No authenticated user');
    }

    const updatedUser = { ...this.currentUser, ...updates };
    this.updateUser(updatedUser);
    this.setCurrentUser(updatedUser);

    // Save profile changes to session storage
    this.storageService.saveProfileChanges({
      userId: updatedUser.id,
      profileData: updatedUser,
      changes: updates,
      updatedAt: new Date().toISOString()
    });

    return updatedUser;
  }

  // Upload profile image
  async uploadProfileImage(file: File): Promise<string> {
    if (!this.currentUser) {
      throw new Error('No authenticated user');
    }

    console.log('Uploading profile image:', file.name);

    // Mock implementation - in production, use actual file storage
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        
        // Update user profile with image
        this.updateProfile({ profileImage: imageUrl });
        
        // Save image upload to session storage
        this.storageService.updateProfileField('profileImage', imageUrl);
        
        resolve(imageUrl);
      };
      reader.readAsDataURL(file);
    });
  }

  // Private helper methods
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('current_user');
    const storedTokens = localStorage.getItem('auth_tokens');

    if (storedUser && storedTokens && this.isTokenValid()) {
      this.currentUser = JSON.parse(storedUser);
      this.notifyAuthListeners(this.currentUser);
    }
  }

  private setCurrentUser(user: User, tokens?: AuthTokens): void {
    this.currentUser = user;
    localStorage.setItem('current_user', JSON.stringify(user));
    
    if (tokens) {
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    }

    this.notifyAuthListeners(user);
  }

  private generateTokens(user: User): AuthTokens {
    // Mock JWT tokens - in production, use proper JWT library
    const accessToken = `access_${user.id}_${Date.now()}`;
    const refreshToken = `refresh_${user.id}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    return { accessToken, refreshToken, expiresAt };
  }

  private isTokenValid(): boolean {
    const storedTokens = localStorage.getItem('auth_tokens');
    if (!storedTokens) return false;

    const tokens: AuthTokens = JSON.parse(storedTokens);
    return new Date() < new Date(tokens.expiresAt);
  }

  private async hashPassword(password: string): Promise<string> {
    // Mock password hashing - in production, use bcrypt
    return `hashed_${password}_${Date.now()}`;
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    // Mock password verification
    return hashedPassword.includes(password);
  }

  private validateSignUpData(data: SignUpData): void {
    if (!data.email || !data.email.includes('@')) {
      throw new Error('Valid email is required');
    }
    if (!data.password || data.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    if (!data.firstName || !data.lastName) {
      throw new Error('First and last name are required');
    }
    if (!data.age || data.age < 18 || data.age > 99) {
      throw new Error('Age must be between 18 and 99');
    }
  }

  private getStoredUsers(): User[] {
    const stored = localStorage.getItem('app_users');
    return stored ? JSON.parse(stored) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem('app_users', JSON.stringify(users));
  }

  private updateUser(user: User): void {
    const users = this.getStoredUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      this.saveUsers(users);
    }
  }

  private savePassword(userId: string, hashedPassword: string): void {
    const passwords = JSON.parse(localStorage.getItem('app_passwords') || '{}');
    passwords[userId] = hashedPassword;
    localStorage.setItem('app_passwords', JSON.stringify(passwords));
  }

  private getStoredPassword(userId: string): string {
    const passwords = JSON.parse(localStorage.getItem('app_passwords') || '{}');
    return passwords[userId] || '';
  }

  private notifyAuthListeners(user: User | null): void {
    this.authListeners.forEach(callback => callback(user));
  }

  // Development/testing utilities
  clearAllData(): void {
    localStorage.removeItem('current_user');
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('app_users');
    localStorage.removeItem('app_passwords');
    this.storageService.clearAllData();
    this.currentUser = null;
    this.notifyAuthListeners(null);
  }

  // Get all users (for testing/admin)
  getAllUsers(): User[] {
    return this.getStoredUsers();
  }

  // Session storage utilities
  getSessionData(): any {
    return {
      matches: this.storageService.getMatches(),
      profileChanges: this.storageService.getProfileChanges(),
      userPreferences: this.storageService.getUserPreferences(),
      swipeHistory: this.storageService.getSwipeHistory(),
      storageInfo: this.storageService.getStorageInfo()
    };
  }

  exportSessionData(): string {
    return this.storageService.exportData();
  }

  importSessionData(jsonData: string): void {
    this.storageService.importData(jsonData);
  }
}
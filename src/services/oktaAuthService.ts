import { oktaAuth, jwtUtils } from './oktaConfig';
import { User } from '../types';

export interface OktaUser extends User {
  oktaId: string;
  accessToken: string;
  idToken: string;
  refreshToken?: string;
}

export class OktaAuthService {
  private static instance: OktaAuthService;
  private currentUser: OktaUser | null = null;
  private authListeners: ((user: OktaUser | null) => void)[] = [];

  static getInstance(): OktaAuthService {
    if (!OktaAuthService.instance) {
      OktaAuthService.instance = new OktaAuthService();
    }
    return OktaAuthService.instance;
  }

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      // Check if user is already authenticated
      const isAuthenticated = await oktaAuth.isAuthenticated();
      
      if (isAuthenticated) {
        await this.loadUserFromOkta();
      }

      // Listen for token renewal
      oktaAuth.tokenManager.on('renewed', async () => {
        await this.loadUserFromOkta();
      });

      // Listen for token expiration
      oktaAuth.tokenManager.on('expired', () => {
        this.handleTokenExpired();
      });

    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  }

  // Sign in with Okta
  async signIn(): Promise<void> {
    try {
      await oktaAuth.signInWithRedirect();
    } catch (error) {
      console.error('Okta sign in error:', error);
      throw new Error('Failed to sign in with Okta');
    }
  }

  // Handle callback after OAuth redirect
  async handleCallback(): Promise<void> {
    try {
      await oktaAuth.handleLoginRedirect();
      await this.loadUserFromOkta();
    } catch (error) {
      console.error('Callback handling error:', error);
      throw new Error('Failed to handle authentication callback');
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await oktaAuth.signOut();
      this.currentUser = null;
      this.notifyAuthListeners(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  // Get current user
  getCurrentUser(): OktaUser | null {
    return this.currentUser;
  }

  // Check if authenticated
  async isAuthenticated(): Promise<boolean> {
    return await oktaAuth.isAuthenticated();
  }

  // Get access token
  async getAccessToken(): Promise<string | null> {
    try {
      const token = await oktaAuth.getAccessToken();
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  // Get ID token
  async getIdToken(): Promise<string | null> {
    try {
      const token = await oktaAuth.getIdToken();
      return token;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  // Inspect JWT tokens (for experimentation)
  async inspectTokens(): Promise<{
    accessToken: any;
    idToken: any;
    userInfo: any;
  } | null> {
    try {
      const accessToken = await this.getAccessToken();
      const idToken = await this.getIdToken();
      const userInfo = await oktaAuth.getUser();

      if (!accessToken || !idToken) return null;

      return {
        accessToken: jwtUtils.formatTokenForDisplay(accessToken),
        idToken: jwtUtils.formatTokenForDisplay(idToken),
        userInfo
      };
    } catch (error) {
      console.error('Error inspecting tokens:', error);
      return null;
    }
  }

  // Refresh tokens
  async refreshTokens(): Promise<void> {
    try {
      await oktaAuth.tokenManager.renew('accessToken');
      await oktaAuth.tokenManager.renew('idToken');
      await this.loadUserFromOkta();
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Failed to refresh tokens');
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: OktaUser | null) => void): () => void {
    this.authListeners.push(callback);
    
    return () => {
      this.authListeners = this.authListeners.filter(listener => listener !== callback);
    };
  }

  // Private methods
  private async loadUserFromOkta(): Promise<void> {
    try {
      const userInfo = await oktaAuth.getUser();
      const accessToken = await this.getAccessToken();
      const idToken = await this.getIdToken();

      if (userInfo && accessToken && idToken) {
        const user: OktaUser = {
          id: userInfo.sub || '',
          oktaId: userInfo.sub || '',
          email: userInfo.email || '',
          firstName: userInfo.given_name || '',
          lastName: userInfo.family_name || '',
          age: 28, // Default age, can be updated in profile
          location: 'San Francisco, CA', // Default location
          dietaryRestrictions: 'celiac_disease', // Default restriction
          accessToken,
          idToken,
          createdAt: new Date(),
          lastLogin: new Date(),
          isVerified: userInfo.email_verified || false,
        };

        this.currentUser = user;
        this.notifyAuthListeners(user);
      }
    } catch (error) {
      console.error('Error loading user from Okta:', error);
    }
  }

  private handleTokenExpired(): void {
    console.log('Token expired, signing out user');
    this.currentUser = null;
    this.notifyAuthListeners(null);
  }

  private notifyAuthListeners(user: OktaUser | null): void {
    this.authListeners.forEach(callback => callback(user));
  }

  // Development utilities
  async getTokenInfo(): Promise<any> {
    const tokens = await this.inspectTokens();
    return {
      isAuthenticated: await this.isAuthenticated(),
      tokens,
      user: this.currentUser,
      tokenManager: oktaAuth.tokenManager.getTokensSync()
    };
  }
}
import { getAuth0Client, jwtUtils } from './auth0Config';
import { User } from '../types';

export interface Auth0User extends User {
  auth0Id: string;
  accessToken: string;
  idToken: string;
  refreshToken?: string;
}

export class Auth0AuthService {
  private static instance: Auth0AuthService;
  private currentUser: Auth0User | null = null;
  private authListeners: ((user: Auth0User | null) => void)[] = [];

  static getInstance(): Auth0AuthService {
    if (!Auth0AuthService.instance) {
      Auth0AuthService.instance = new Auth0AuthService();
    }
    return Auth0AuthService.instance;
  }

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const auth0 = await getAuth0Client();
      
      // Check if user is already authenticated
      const isAuthenticated = await auth0.isAuthenticated();
      
      if (isAuthenticated) {
        await this.loadUserFromAuth0();
      }

    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  }

  // Sign in with Auth0
  async signIn(): Promise<void> {
    try {
      const auth0 = await getAuth0Client();
      await auth0.loginWithRedirect();
    } catch (error) {
      console.error('Auth0 sign in error:', error);
      throw new Error('Failed to sign in with Auth0');
    }
  }

  // Handle callback after OAuth redirect
  async handleCallback(): Promise<void> {
    try {
      const auth0 = await getAuth0Client();
      await auth0.handleRedirectCallback();
      await this.loadUserFromAuth0();
    } catch (error) {
      console.error('Callback handling error:', error);
      throw new Error('Failed to handle authentication callback');
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      const auth0 = await getAuth0Client();
      await auth0.logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
      this.currentUser = null;
      this.notifyAuthListeners(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  // Get current user
  getCurrentUser(): Auth0User | null {
    return this.currentUser;
  }

  // Check if authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const auth0 = await getAuth0Client();
      return await auth0.isAuthenticated();
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Get access token
  async getAccessToken(): Promise<string | null> {
    try {
      const auth0 = await getAuth0Client();
      const token = await auth0.getTokenSilently();
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  // Get ID token
  async getIdToken(): Promise<string | null> {
    try {
      const auth0 = await getAuth0Client();
      const claims = await auth0.getIdTokenClaims();
      return claims?.__raw || null;
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
      const auth0 = await getAuth0Client();
      const userInfo = await auth0.getUser();

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
      const auth0 = await getAuth0Client();
      await auth0.getTokenSilently({ cacheMode: 'off' });
      await this.loadUserFromAuth0();
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Failed to refresh tokens');
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: Auth0User | null) => void): () => void {
    this.authListeners.push(callback);
    
    return () => {
      this.authListeners = this.authListeners.filter(listener => listener !== callback);
    };
  }

  // Private methods
  private async loadUserFromAuth0(): Promise<void> {
    try {
      const auth0 = await getAuth0Client();
      const userInfo = await auth0.getUser();
      const accessToken = await this.getAccessToken();
      const idToken = await this.getIdToken();

      if (userInfo && accessToken && idToken) {
        const user: Auth0User = {
          id: userInfo.sub || '',
          auth0Id: userInfo.sub || '',
          email: userInfo.email || '',
          firstName: userInfo.given_name || userInfo.name?.split(' ')[0] || '',
          lastName: userInfo.family_name || userInfo.name?.split(' ')[1] || '',
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
      console.error('Error loading user from Auth0:', error);
    }
  }

  private notifyAuthListeners(user: Auth0User | null): void {
    this.authListeners.forEach(callback => callback(user));
  }

  // Development utilities
  async getTokenInfo(): Promise<any> {
    const tokens = await this.inspectTokens();
    const auth0 = await getAuth0Client();
    
    return {
      isAuthenticated: await this.isAuthenticated(),
      tokens,
      user: this.currentUser,
      cache: await auth0.getTokenSilently().catch(() => null)
    };
  }
}
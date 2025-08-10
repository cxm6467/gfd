import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';

// Auth0 configuration for JWT experimentation
export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'your-domain.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id',
  authorizationParams: {
    redirect_uri: window.location.origin + '/login/callback',
    scope: 'openid profile email',
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://api.gfd.com',
  },
  useRefreshTokens: true,
  cacheLocation: 'localstorage' as const,
};

let auth0Client: Auth0Client | null = null;

export const getAuth0Client = async (): Promise<Auth0Client> => {
  if (!auth0Client) {
    auth0Client = await createAuth0Client(auth0Config);
  }
  return auth0Client;
};

// JWT utilities for experimentation
export const jwtUtils = {
  // Decode JWT without verification (for inspection)
  decodeToken(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  },

  // Get token expiration
  getTokenExpiration(token: string) {
    const decoded = this.decodeToken(token);
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  },

  // Check if token is expired
  isTokenExpired(token: string) {
    const expiration = this.getTokenExpiration(token);
    return expiration ? expiration < new Date() : true;
  },

  // Get token claims
  getTokenClaims(token: string) {
    return this.decodeToken(token);
  },

  // Format token for display
  formatTokenForDisplay(token: string) {
    const decoded = this.decodeToken(token);
    if (!decoded) return null;

    return {
      header: JSON.parse(atob(token.split('.')[0])),
      payload: decoded,
      signature: token.split('.')[2],
      raw: token
    };
  }
};
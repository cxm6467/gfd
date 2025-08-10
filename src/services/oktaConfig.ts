import { OktaAuth } from '@okta/okta-auth-js';

// Okta configuration for JWT experimentation
export const oktaConfig = {
  issuer: import.meta.env.VITE_OKTA_ISSUER || 'https://dev-12345678.okta.com/oauth2/default',
  clientId: import.meta.env.VITE_OKTA_CLIENT_ID || 'your-client-id',
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  disableHttpsCheck: import.meta.env.NODE_ENV === 'development',
};

export const oktaAuth = new OktaAuth(oktaConfig);

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
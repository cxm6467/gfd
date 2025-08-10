import { useState, useEffect } from 'react';
import { AuthService, User } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authService = AuthService.getInstance();

  useEffect(() => {
    // Initialize auth state
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Listen for auth changes
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.signIn({ email, password });
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: any) => {
    setLoading(true);
    try {
      const result = await authService.signUp(data);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
    } finally {
      setLoading(false);
    }
  };

  const quickSignIn = async () => {
    setLoading(true);
    try {
      const result = await authService.quickSignIn();
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: authService.isAuthenticated(),
    signIn,
    signUp,
    signOut,
    quickSignIn,
  };
};
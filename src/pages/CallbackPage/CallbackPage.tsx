import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OktaAuthService } from '../../services/oktaAuthService';
import { useTheme } from '../../hooks/useTheme';

export const CallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const oktaAuthService = OktaAuthService.getInstance();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      await oktaAuthService.handleCallback();
      navigate('/dashboard');
    } catch (error) {
      console.error('Callback error:', error);
      navigate('/?error=auth_failed');
    }
  };

  return (
    <div className={`min-h-screen ${theme.colors.background} flex items-center justify-center`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className={`text-xl font-semibold ${theme.colors.text} mb-2`}>
          Completing Sign In...
        </h2>
        <p className={theme.colors.textSecondary}>
          Please wait while we finish setting up your account.
        </p>
      </div>
    </div>
  );
};
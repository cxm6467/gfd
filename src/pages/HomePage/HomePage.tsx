import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, MessageCircle, Heart } from 'lucide-react';
import { Logo } from '../../components/atoms/Logo';
import { Button } from '../../components/atoms/Button';
import { TestModeToggle } from '../../components/molecules/TestModeToggle';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, quickSignIn } = useAuth();
  
  const [isTestMode, setIsTestMode] = useState(() => {
    const stored = localStorage.getItem('VITE_TEST_MODE');
    return stored ? stored === 'true' : import.meta.env.VITE_TEST_MODE !== 'false';
  });

  const handleTestModeToggle = (enabled: boolean) => {
    setIsTestMode(enabled);
  };

  const handleQuickSignIn = async () => {
    try {
      await quickSignIn();
      navigate('/profile');
    } catch (error) {
      console.error('Quick sign in failed:', error);
    }
  };

  const handleStartJourney = () => {
    if (user) {
      navigate('/dashboard');
    } else {
    navigate('/profile');
    }
  };

  return (
    <div className={`min-h-screen ${theme.colors.background}`}>
      {/* Hero Section */}
      <div className="relative bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 pb-12 md:pb-24">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-8 md:mb-16">
            <Logo size="md" />
            
            <div className="flex items-center space-x-4">
              {isTestMode && import.meta.env.VITE_TEST_MODE === 'true' ? (
                <Button onClick={handleQuickSignIn}>
                  Quick Sign In (Test)
                </Button>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/profile')}
                    className={`${theme.colors.textSecondary} hover:text-gray-800 font-medium transition-colors`}
                  >
                    Sign In
                  </button>
                  <Button onClick={() => navigate('/profile')}>
                    Join Now
                  </Button>
                </>
              )}
            </div>
          </nav>

          {/* Main Content */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Connect with
              <span className="text-blue-600 block font-light">
                Gluten-Free Singles
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 font-light">
              A sophisticated platform for individuals who understand the importance of gluten-free living. 
              Connect with like-minded people who share your commitment to health and wellness.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 md:mb-16 px-4">
              <Button 
                onClick={handleStartJourney}
                size="lg"
                fullWidth={window.innerWidth < 640}
              >
                Start Your Journey
              </Button>
              <Button 
                variant="outline"
                size="lg"
                fullWidth={window.innerWidth < 640}
              >
                Learn More
              </Button>
            </div>

            {/* Sign In Options Preview */}
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-500 mb-8 md:mb-16">
              <span className="hidden sm:inline">Sign in with:</span>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:shadow-lg transition-all">
                  <span className="text-blue-600 font-bold">G</span>
                </div>
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:shadow-lg transition-all">
                  <span className="text-blue-800 font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:shadow-lg transition-all">
                  <span className="text-slate-600">@</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 md:py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-slate-900 mb-4">
              Built for Meaningful Connections
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light">
              Advanced features designed specifically for the gluten-free dating community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Identity Verification */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-3">Identity Verification</h3>
              <p className="text-slate-600 leading-relaxed font-light">
                Multi-step verification process including photo, ID, and location verification for authentic connections.
              </p>
            </div>

            {/* Dietary Compatibility */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-3">Dietary Compatibility</h3>
              <p className="text-slate-600 leading-relaxed font-light">
                Advanced matching based on celiac disease, gluten sensitivity levels, and cross-contamination preferences.
              </p>
            </div>

            {/* Safe Communication */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-3">Safe Communication</h3>
              <p className="text-slate-600 leading-relaxed font-light">
                End-to-end encrypted messaging with built-in safety features and 24/7 moderation support.
              </p>
            </div>

            {/* Gluten-Free Dining */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-3">Gluten-Free Dining</h3>
              <p className="text-slate-600 leading-relaxed font-light">
                Comprehensive database of verified gluten-free restaurants with safety ratings and community reviews.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
            Begin Your Journey
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto font-light">
            Join a refined community of health-conscious individuals who understand 
            the importance of shared values and lifestyle choices.
          </p>
          <Button 
            onClick={() => setShowAuthModal(true)}
            onClick={() => navigate('/profile')}
            variant="secondary"
            size="lg"
          >
            Join GF'd
          </Button>
          <p className="text-gray-400 mt-4 text-sm font-light">
            Complimentary membership • Premium features available
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Logo size="sm" />
            </div>
            <p className="text-sm mb-4 font-light">
              © 2024 GF'd. Crafted for the gluten-free community.
            </p>
            <div className="flex flex-wrap justify-center space-x-4 md:space-x-8 text-sm">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="/safety" className="hover:text-white transition-colors">Safety Guidelines</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
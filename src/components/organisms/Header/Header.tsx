import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../../atoms/Logo';
import { TestModeToggle } from '../../molecules/TestModeToggle';
import { useTheme } from '../../../hooks/useTheme';

export const Header: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  
  const [isTestMode, setIsTestMode] = useState(() => {
    const stored = localStorage.getItem('VITE_TEST_MODE');
    return stored ? stored === 'true' : true; // Default to true for development
  });

  // Force test mode to true for development
  useEffect(() => {
    setIsTestMode(true);
  }, []);

  const handleTestModeToggle = (enabled: boolean) => {
    setIsTestMode(enabled);
    localStorage.setItem('VITE_TEST_MODE', enabled.toString());
  };

  const navItems = [
    { path: '/dashboard', label: 'Discover' },
    { path: '/matches', label: 'Matches' },
    { path: '/messages', label: 'Messages' },
    { path: '/restaurants', label: 'Restaurants' },
    { path: '/verification', label: 'Verify' },
    { path: '/profile', label: 'Profile' },
  ];

  return (
    <>
      {/* Test Mode Banner - Always show in development */}
      {isTestMode && (
        <div className="bg-red-600 text-white px-4 py-3 text-center text-sm font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>🧪</span>
              <span>Test Mode Active - Development Environment</span>
            </div>
            <TestModeToggle isTestMode={isTestMode} onToggle={handleTestModeToggle} />
          </div>
        </div>
      )}
      
      <header className={`${theme.colors.surface} shadow-sm border-b ${theme.colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-red-600'
                      : `${theme.colors.textSecondary} hover:text-gray-800`
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Navigation - Bottom Tab Bar will be added later */}
          </div>
        </div>
      </header>
    </>
  );
};
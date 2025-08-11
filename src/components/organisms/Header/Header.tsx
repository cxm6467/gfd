import React from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    </header>
};
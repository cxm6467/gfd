import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, MessageCircle, Users, User, MapPin } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';

export const MobileTabBar: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();

  const tabs = [
    { path: '/dashboard', icon: Heart, label: 'Discover' },
    { path: '/matches', icon: Users, label: 'Matches' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
    { path: '/restaurants', icon: MapPin, label: 'Restaurants' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 ${theme.colors.surface} border-t ${theme.colors.border} safe-area-pb`}>
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                isActive ? 'text-red-600' : theme.colors.textSecondary
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
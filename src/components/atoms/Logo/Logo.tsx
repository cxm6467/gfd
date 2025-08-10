import React from 'react';
import { Wheat } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-lg' },
    md: { icon: 'w-8 h-8', text: 'text-xl' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl' },
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="bg-blue-600 rounded-full p-2 flex items-center justify-center shadow-lg">
          <Wheat className={`${sizeClasses[size].icon} text-yellow-400`} />
        </div>
        <div className="absolute inset-0 border-4 border-blue-400 rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-0.5 bg-yellow-400 rotate-45"></div>
        </div>
      </div>
      {showText && (
        <span className={`${sizeClasses[size].text} font-bold text-blue-600`}>
          GF'd
        </span>
      )}
    </div>
  );
};
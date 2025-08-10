import React from 'react';

interface AvatarProps {
  emoji: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ emoji, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-32 h-32 text-6xl',
  };

  return (
    <div className={`bg-red-100 rounded-full flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <span>{emoji}</span>
    </div>
  );
};
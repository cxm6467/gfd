import React from 'react';
import { useState } from 'react';
import { User } from '../../../types';
import { Avatar } from '../../atoms/Avatar';
import { useTheme } from '../../../hooks/useTheme';

interface ProfileCardProps {
  profile: User;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  style?: React.CSSProperties;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
  style,
}) => {
  const { theme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;
    
    // Only allow horizontal movement
    setDragOffset({ x: deltaX, y: 0 });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    const { x } = dragOffset;
    
    if (Math.abs(x) > threshold) {
      if (x > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
    
    // Reset state
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartPos({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPos.x;
    setDragOffset({ x: deltaX, y: 0 });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    const { x } = dragOffset;
    
    if (Math.abs(x) > threshold) {
      if (x > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
    
    // Reset state
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const cardTransform = isDragging 
    ? `translateX(${dragOffset.x}px) rotate(${dragOffset.x * 0.1}deg) scale(${1 + Math.abs(dragOffset.x) * 0.0005})`
    : 'translateX(0px) rotate(0deg) scale(1)';

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        transform: cardTransform,
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        touchAction: 'none',
        ...style,
      }}
      className={`${theme.colors.surface} ${theme.borderRadius.lg} shadow-xl overflow-hidden cursor-grab active:cursor-grabbing select-none`}
    >
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-slate-50 opacity-50"></div>
        
        <div className={`relative ${theme.spacing.lg}`}>
          <div className="text-center">
            <Avatar emoji={profile.emoji} size="xl" className="mx-auto mb-6" />
            
            <h2 className={`text-3xl font-light ${theme.colors.text} mb-2`}>
              {profile.name}, {profile.age}
            </h2>
            
            <p className="text-amber-600 font-medium mb-2 text-sm uppercase tracking-wide">{profile.dietaryInfo}</p>
            <p className={`${theme.colors.textSecondary} mb-6`}>{profile.location}</p>
            
            <div className={`bg-white/80 backdrop-blur-sm ${theme.borderRadius.md} ${theme.spacing.md} mb-8 border border-slate-200`}>
              <p className={`${theme.colors.text} leading-relaxed font-light`}>
                {profile.description}
              </p>
            </div>
            
            {/* Swipe indicators */}
            <div className="flex justify-between items-center text-sm text-slate-400 mb-4 font-light">
              <span>← Pass</span>
              <span>Swipe or tap buttons</span>
              <span>Like →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
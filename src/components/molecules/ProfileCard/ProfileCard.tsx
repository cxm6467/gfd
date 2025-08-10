import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
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
  
  const [{ x, rotate, scale }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    scale: 1,
  }));

  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      const trigger = vx > 0.2 || Math.abs(mx) > 100;
      
      if (!active && trigger) {
        if (xDir > 0) {
          // Swipe right - like
          api.start({ x: 300, rotate: 20, scale: 0.8 });
          setTimeout(() => {
            onSwipeRight();
            api.set({ x: 0, rotate: 0, scale: 1 });
          }, 200);
        } else {
          // Swipe left - pass
          api.start({ x: -300, rotate: -20, scale: 0.8 });
          setTimeout(() => {
            onSwipeLeft();
            api.set({ x: 0, rotate: 0, scale: 1 });
          }, 200);
        }
      } else {
        api.start({
          x: active ? mx : 0,
          rotate: active ? mx / 10 : 0,
          scale: active ? 1.05 : 1,
        });
      }
    },
    { axis: 'x' }
  );

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        rotate,
        scale,
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
    </animated.div>
  );
};
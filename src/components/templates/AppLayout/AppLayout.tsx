import React from 'react';
import { useState } from 'react';
import { Header } from '../../organisms/Header';
import { MobileTabBar } from '../../organisms/MobileTabBar';
import { AISupportChat } from '../../organisms/AISupportChat';
import { useTheme } from '../../../hooks/useTheme';

interface AppLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showMobileNav?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showHeader = true, 
  showMobileNav = true 
}) => {
  const { theme } = useTheme();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className={`min-h-screen ${theme.colors.background}`}>
      {showHeader && <Header />}
      
      <main className={`${showMobileNav ? 'pb-20 md:pb-0' : ''}`}>
        {children}
      </main>
      
      {showMobileNav && <MobileTabBar />}
      
      <AISupportChat 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(!isChatOpen)} 
      />
    </div>
  );
};
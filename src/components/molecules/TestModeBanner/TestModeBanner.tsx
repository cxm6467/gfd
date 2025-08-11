import React, { useState } from 'react';
import { TestModeToggle } from '../TestModeToggle';
import { useTestMode } from '../../../hooks/useTestMode';

export const TestModeBanner: React.FC = () => {
  const { isTestMode, toggleTestMode } = useTestMode();

  // Show banner in development or when test mode is enabled
  const showBanner = import.meta.env.DEV || isTestMode;
  
  // Dynamic title based on test mode state
  const bannerTitle = isTestMode 
    ? "🧪 Test Mode Active - Development Environment"
    : "🔧 Development Mode - Test Mode Disabled";

  if (!showBanner) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-3 text-center text-sm font-medium relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span>{bannerTitle}</span>
        </div>
        <TestModeToggle isTestMode={isTestMode} onToggle={toggleTestMode} />
      </div>
    </div>
  );
};
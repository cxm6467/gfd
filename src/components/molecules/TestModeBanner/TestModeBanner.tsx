import React, { useState } from 'react';
import { TestModeToggle } from '../TestModeToggle';

export const TestModeBanner: React.FC = () => {
  const [isTestMode, setIsTestMode] = useState(() => {
    const stored = localStorage.getItem('VITE_TEST_MODE');
    return stored ? stored === 'true' : import.meta.env.VITE_TEST_MODE === 'true';
  });

  const handleTestModeToggle = (enabled: boolean) => {
    setIsTestMode(enabled);
    localStorage.setItem('VITE_TEST_MODE', enabled.toString());
  };

  // Always show banner in development
  const showBanner = import.meta.env.DEV || isTestMode;

  if (!showBanner) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-3 text-center text-sm font-medium relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span>🧪</span>
          <span>Test Mode Active - Development Environment</span>
        </div>
        <TestModeToggle isTestMode={isTestMode} onToggle={handleTestModeToggle} />
      </div>
    </div>
  );
};
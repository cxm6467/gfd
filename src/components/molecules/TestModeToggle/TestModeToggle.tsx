import React, { useState, useEffect } from 'react';

interface TestModeToggleProps {
  isTestMode: boolean;
  onToggle: (enabled: boolean) => void;
}

export const TestModeToggle: React.FC<TestModeToggleProps> = ({ isTestMode, onToggle }) => {
  const [isToggling, setIsToggling] = useState(false);


  const handleToggle = () => {
    if (isToggling) return; // Prevent multiple clicks during animation
    
    // Only allow toggle if VITE_TEST_MODE is enabled
    if (import.meta.env.VITE_TEST_MODE !== 'true') {
      return;
    }
    
    setIsToggling(true);
    const newState = !isTestMode;
    onToggle(newState);
    
    // Update environment variable simulation
    if (typeof window !== 'undefined') {
      localStorage.setItem('VITE_TEST_MODE', newState.toString());
    }
    
    // Reset toggling state after animation
    setTimeout(() => {
      setIsToggling(false);
    }, 300);
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="text-white text-sm font-medium">Test Mode</span>
      <button
        onClick={handleToggle}
        disabled={isToggling}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 ${
          isTestMode ? 'bg-yellow-400' : 'bg-green-500'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isTestMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-white text-xs">
        {isTestMode ? 'ON' : 'OFF'}
      </span>
    </div>
  );
};
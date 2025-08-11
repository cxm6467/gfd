import { useState, useEffect } from 'react';

export const useTestMode = () => {
  const [isTestMode, setIsTestMode] = useState(() => {
    const stored = localStorage.getItem('VITE_TEST_MODE');
    const envValue = import.meta.env.VITE_TEST_MODE;
    return stored ? stored === 'true' : envValue === 'true';
  });

  const toggleTestMode = (enabled: boolean) => {
    setIsTestMode(enabled);
    localStorage.setItem('VITE_TEST_MODE', enabled.toString());
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('testModeChanged', { 
      detail: { enabled } 
    }));
  };

  useEffect(() => {
    const handleTestModeChange = (event: CustomEvent) => {
      setIsTestMode(event.detail.enabled);
    };

    window.addEventListener('testModeChanged', handleTestModeChange as EventListener);
    
    return () => {
      window.removeEventListener('testModeChanged', handleTestModeChange as EventListener);
    };
  }, []);

  return { isTestMode, toggleTestMode };
};
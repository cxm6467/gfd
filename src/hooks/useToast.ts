import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState<{
    message: string;
    isVisible: boolean;
    onClick?: () => void;
  }>({
    message: '',
    isVisible: false,
  });

  const showToast = (message: string, onClick?: () => void) => {
    setToast({
      message,
      isVisible: true,
      onClick,
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false,
    }));
  };

  return {
    toast,
    showToast,
    hideToast,
  };
};
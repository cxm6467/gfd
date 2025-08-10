import React from 'react';
import { useTheme } from '../../../hooks/useTheme';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
}) => {
  const { theme } = useTheme();

  const baseClasses = 'font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2';
  
  const variantClasses = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all`,
    secondary: `${theme.colors.secondary} ${theme.colors.text} hover:bg-slate-200 shadow-md`,
    outline: `border-2 border-blue-300 text-blue-600 hover:bg-blue-600 hover:text-white shadow-md hover:shadow-lg transition-all`,
  };

  const sizeClasses = {
    sm: `px-3 py-1.5 text-sm ${theme.borderRadius.sm}`,
    md: `px-4 py-2 text-base ${theme.borderRadius.md}`,
    lg: `px-6 py-3 text-lg ${theme.borderRadius.md}`,
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass}`}
    >
      {children}
    </button>
  );
};
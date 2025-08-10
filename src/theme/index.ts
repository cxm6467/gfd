import { Theme } from '../types';

export const lightTheme: Theme = {
  colors: {
    primary: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    secondary: 'bg-gray-100',
    background: 'bg-white',
    surface: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  },
  spacing: {
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  },
  borderRadius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-600',
    secondary: 'bg-gray-800',
    background: 'bg-gray-900',
    surface: 'bg-gray-800',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    border: 'border-gray-700',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-600',
  },
  spacing: {
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  },
  borderRadius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  },
};
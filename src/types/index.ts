export interface User {
  id: number;
  name: string;
  age: number;
  bio: string;
  description: string;
  emoji: string;
  dietaryInfo: string;
  location: string;
}

export interface Match {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  emoji: string;
}

export interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  isMe: boolean;
}

export interface Theme {
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

export interface VerificationStatus {
  id: string;
  type: 'photo' | 'id' | 'location';
  status: 'pending' | 'verified' | 'rejected' | 'not_started';
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  priceLevel: number; // 1-4 ($-$$$$)
  distance: number; // in miles
  glutenFreeOptions: {
    hasMenu: boolean;
    hasDedicatedPrep: boolean;
    userRating: number;
    safetyRating: number;
  };
  photos: string[];
  phone?: string;
  website?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  verified: boolean;
}
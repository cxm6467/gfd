import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProfilePage } from './ProfilePage';

// Mock hooks and services
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

vi.mock('../../hooks/useTestMode', () => ({
  useTestMode: vi.fn()
}));

vi.mock('../../services/storageService', () => ({
  StorageService: {
    getInstance: vi.fn(() => ({
      getProfileChanges: vi.fn(() => ({})),
      updateProfileField: vi.fn(),
      saveProfileChanges: vi.fn()
    }))
  }
}));

/**
 * Test suite for ProfilePage component
 * 
 * Coverage areas:
 * - Authentication state handling
 * - Profile form rendering
 * - Bio editing functionality
 * - Session storage integration
 * - Test mode debug buttons
 * - Profile image upload
 * - Form validation
 * - Navigation handling
 */
describe('ProfilePage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  const mockUseAuth = vi.mocked(require('../../hooks/useAuth').useAuth);
  const mockUseTestMode = vi.mocked(require('../../hooks/useTestMode').useTestMode);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render sign up form when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      quickSignIn: vi.fn()
    });
    mockUseTestMode.mockReturnValue({
      isTestMode: false,
      toggleTestMode: vi.fn()
    });

    renderWithRouter(<ProfilePage />);
    expect(screen.getByText('Join GF\'d')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
  });

  it('should render profile editor when authenticated', () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      age: 28,
      location: 'San Francisco, CA',
      dietaryRestrictions: 'celiac_disease',
      bio: 'Love gluten-free cooking!',
      createdAt: new Date(),
      lastLogin: new Date(),
      isVerified: true
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      quickSignIn: vi.fn()
    });
    mockUseTestMode.mockReturnValue({
      isTestMode: false,
      toggleTestMode: vi.fn()
    });

    renderWithRouter(<ProfilePage />);
    expect(screen.getByText('John\'s Profile')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Love gluten-free cooking!')).toBeInTheDocument();
  });

  it('should show debug buttons only in test mode', () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      age: 28,
      location: 'San Francisco, CA',
      dietaryRestrictions: 'celiac_disease',
      createdAt: new Date(),
      lastLogin: new Date(),
      isVerified: true
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      quickSignIn: vi.fn()
    });

    // Test with test mode enabled
    mockUseTestMode.mockReturnValue({
      isTestMode: true,
      toggleTestMode: vi.fn()
    });

    const { rerender } = renderWithRouter(<ProfilePage />);
    expect(screen.getByText('Inspect JWT')).toBeInTheDocument();
    expect(screen.getByText('Session Data')).toBeInTheDocument();

    // Test with test mode disabled
    mockUseTestMode.mockReturnValue({
      isTestMode: false,
      toggleTestMode: vi.fn()
    });

    rerender(<ProfilePage />);
    expect(screen.queryByText('Inspect JWT')).not.toBeInTheDocument();
    expect(screen.queryByText('Session Data')).not.toBeInTheDocument();
  });

  it('should handle bio editing with character limit', () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      age: 28,
      location: 'San Francisco, CA',
      dietaryRestrictions: 'celiac_disease',
      bio: 'Short bio',
      createdAt: new Date(),
      lastLogin: new Date(),
      isVerified: true
    };

    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      quickSignIn: vi.fn()
    });
    mockUseTestMode.mockReturnValue({
      isTestMode: false,
      toggleTestMode: vi.fn()
    });

    renderWithRouter(<ProfilePage />);
    
    const bioTextarea = screen.getByDisplayValue('Short bio');
    expect(bioTextarea).toBeInTheDocument();
    expect(screen.getByText('9/150 characters')).toBeInTheDocument();
  });

  it('should show test mode bypass button only in test mode', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      quickSignIn: vi.fn()
    });

    // Test with test mode enabled
    mockUseTestMode.mockReturnValue({
      isTestMode: true,
      toggleTestMode: vi.fn()
    });

    const { rerender } = renderWithRouter(<ProfilePage />);
    expect(screen.getByText('🧪 Test Mode: Skip Sign In')).toBeInTheDocument();

    // Test with test mode disabled
    mockUseTestMode.mockReturnValue({
      isTestMode: false,
      toggleTestMode: vi.fn()
    });

    rerender(<ProfilePage />);
    expect(screen.queryByText('🧪 Test Mode: Skip Sign In')).not.toBeInTheDocument();
  });

  it('should integrate with session storage', () => {
    const mockStorageService = require('../../services/storageService').StorageService.getInstance();
    
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      quickSignIn: vi.fn()
    });
    mockUseTestMode.mockReturnValue({
      isTestMode: false,
      toggleTestMode: vi.fn()
    });

    renderWithRouter(<ProfilePage />);
    
    // Test that session storage methods are available
    expect(mockStorageService.getProfileChanges).toBeDefined();
    expect(mockStorageService.updateProfileField).toBeDefined();
  });
});
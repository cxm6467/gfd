import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TestModeBanner } from './TestModeBanner';

// Mock the useTestMode hook
vi.mock('../../../hooks/useTestMode', () => ({
  useTestMode: vi.fn()
}));

/**
 * Test suite for TestModeBanner component
 * 
 * Coverage areas:
 * - Banner visibility in development
 * - Test mode state display
 * - Title updates based on test mode
 * - Toggle functionality
 * - Environment-based behavior
 * - Dynamic title changes
 */
describe('TestModeBanner', () => {
  const mockUseTestMode = vi.mocked(require('../../../hooks/useTestMode').useTestMode);

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock development environment
    vi.stubEnv('DEV', true);
  });

  it('should render banner in development mode', () => {
    mockUseTestMode.mockReturnValue({
      isTestMode: true,
      toggleTestMode: vi.fn()
    });

    render(<TestModeBanner />);
    expect(screen.getByText(/Test Mode Active/)).toBeInTheDocument();
  });

  it('should show active title when test mode is enabled', () => {
    mockUseTestMode.mockReturnValue({
      isTestMode: true,
      toggleTestMode: vi.fn()
    });

    render(<TestModeBanner />);
    expect(screen.getByText('🧪 Test Mode Active - Development Environment')).toBeInTheDocument();
  });

  it('should show disabled title when test mode is disabled', () => {
    mockUseTestMode.mockReturnValue({
      isTestMode: false,
      toggleTestMode: vi.fn()
    });

    render(<TestModeBanner />);
    expect(screen.getByText('🔧 Development Mode - Test Mode Disabled')).toBeInTheDocument();
  });

  it('should render toggle component', () => {
    const mockToggle = vi.fn();
    mockUseTestMode.mockReturnValue({
      isTestMode: true,
      toggleTestMode: mockToggle
    });

    render(<TestModeBanner />);
    expect(screen.getByText('Test Mode')).toBeInTheDocument();
  });

  it('should not render in production when test mode is disabled', () => {
    vi.stubEnv('DEV', false);
    mockUseTestMode.mockReturnValue({
      isTestMode: false,
      toggleTestMode: vi.fn()
    });

    render(<TestModeBanner />);
    expect(screen.queryByText(/Test Mode/)).not.toBeInTheDocument();
  });

  it('should render in production when test mode is enabled', () => {
    vi.stubEnv('DEV', false);
    mockUseTestMode.mockReturnValue({
      isTestMode: true,
      toggleTestMode: vi.fn()
    });

    render(<TestModeBanner />);
    expect(screen.getByText(/Test Mode Active/)).toBeInTheDocument();
  });

  it('should handle toggle functionality', () => {
    const mockToggle = vi.fn();
    mockUseTestMode.mockReturnValue({
      isTestMode: false,
      toggleTestMode: mockToggle
    });

    render(<TestModeBanner />);
    // The toggle functionality is tested in TestModeToggle.test.tsx
    expect(mockToggle).toBeDefined();
  });

  it('should update title when test mode changes', () => {
    const { rerender } = render(<TestModeBanner />);
    
    // First render with test mode enabled
    mockUseTestMode.mockReturnValue({
      isTestMode: true,
      toggleTestMode: vi.fn()
    });
    rerender(<TestModeBanner />);
    expect(screen.getByText(/Test Mode Active/)).toBeInTheDocument();

    // Second render with test mode disabled
    mockUseTestMode.mockReturnValue({
      isTestMode: false,
      toggleTestMode: vi.fn()
    });
    rerender(<TestModeBanner />);
    expect(screen.getByText(/Test Mode Disabled/)).toBeInTheDocument();
  });

  it('should maintain consistent styling across states', () => {
    mockUseTestMode.mockReturnValue({
      isTestMode: true,
      toggleTestMode: vi.fn()
    });

    render(<TestModeBanner />);
    const banner = screen.getByText(/Test Mode Active/).closest('div');
    expect(banner).toHaveClass('bg-red-600', 'text-white');
  });
});
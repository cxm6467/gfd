import React, { useState } from 'react';
import { X, Mail, Lock, User, Calendar, MapPin } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { authService } from '../../../services/supabaseClient';
import { useTheme } from '../../../hooks/useTheme';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { theme } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    age: '',
    location: '',
    dietaryRestrictions: 'celiac_disease'
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Sign up with profile data
        await authService.signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          age: parseInt(formData.age),
          location: formData.location,
          dietary_restrictions: formData.dietaryRestrictions
        });
        alert('Check your email to confirm your account!');
      } else {
        // Sign in
        await authService.signIn(formData.email, formData.password);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.signInWithGoogle();
      // Note: Google OAuth will redirect, so onSuccess won't be called here
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${theme.colors.surface} rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className={`text-2xl font-bold ${theme.colors.text}`}>
            {isSignUp ? 'Join GF\'d' : 'Welcome Back'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Google Sign In */}
          <Button
            onClick={handleGoogleAuth}
            disabled={loading}
            variant="outline"
            fullWidth
            className="mb-4"
          >
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 mr-3 bg-white rounded border flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">G</span>
              </div>
              Continue with Google
            </div>
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="First name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                      Age
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        required
                        min="18"
                        max="99"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Age"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                    Dietary Restrictions
                  </label>
                  <select
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="celiac_disease">Celiac Disease</option>
                    <option value="ncgs">Non-Celiac Gluten Sensitivity</option>
                    <option value="lifestyle_choice">Lifestyle Choice</option>
                    <option value="wheat_allergy">Wheat Allergy</option>
                    <option value="dermatitis_herpetiformis">Dermatitis Herpetiformis</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password (8+ characters)"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : 'Need an account? Sign up'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
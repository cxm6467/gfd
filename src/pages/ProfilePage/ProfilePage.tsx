import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, Mail, Lock, MapPin, Calendar, Key } from 'lucide-react';
import { AppLayout } from '../../components/templates/AppLayout';
import { Button } from '../../components/atoms/Button';
import { ProfileImageUpload } from '../../components/molecules/ProfileImageUpload';
import { JWTInspector } from '../../components/organisms/JWTInspector';
import { Auth0AuthService } from '../../services/auth0AuthService';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, signIn, signUp, signOut, isAuthenticated } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(!isAuthenticated);
  const [showJWTInspector, setShowJWTInspector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: user?.age?.toString() || '',
    location: user?.location || '',
    dietaryRestrictions: user?.dietaryRestrictions || 'celiac_disease'
  });

  const auth0AuthService = Auth0AuthService.getInstance();

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: '',
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age.toString(),
        location: user.location,
        dietaryRestrictions: user.dietaryRestrictions
      });
      setIsSignUp(false);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await signUp({
          ...formData,
          age: parseInt(formData.age)
        });
        navigate('/dashboard');
      } else {
        await signIn(formData.email, formData.password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    console.log('Profile image uploaded:', imageUrl);
    // Image is automatically saved to user profile via auth service
  };

  const handleImageUploadError = (error: string) => {
    console.error('Image upload error:', error);
    setError(error);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update profile data
      // Profile updates are handled by the auth service
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAuth0SignIn = async () => {
    try {
      await auth0AuthService.signIn();
    } catch (error) {
      setError('Auth0 sign in failed');
    }
  };

  // If user is authenticated, show profile editor
  if (isAuthenticated && user) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto pt-4 md:pt-8 px-4">
          <div className={`${theme.colors.surface} ${theme.borderRadius.md} shadow-lg overflow-hidden border ${theme.colors.border}`}>
            <div className={theme.spacing.lg}>
              <div className="text-center mb-8">
                <div className="mb-6">
                  <ProfileImageUpload
                    currentImage={user.profileImage}
                    userId={user.id}
                    onImageUploaded={handleImageUploaded}
                    onUploadError={handleImageUploadError}
                    maxSize={10}
                  />
                </div>
                <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text} mb-2`}>
                  {user.firstName}'s Profile
                </h1>
                <p className={`${theme.colors.textSecondary} flex items-center justify-center`}>
                  <Heart className="w-4 h-4 mr-2 text-rose-400" />
                  Manage your dating profile and preferences
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                      First Name
                    </label>
                    <input 
                      type="text" 
                      value={user.firstName}
                      readOnly
                      className={`w-full border ${theme.colors.border} ${theme.borderRadius.sm} px-3 py-2 bg-gray-50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                      Last Name
                    </label>
                    <input 
                      type="text" 
                      value={user.lastName}
                      readOnly
                      className={`w-full border ${theme.colors.border} ${theme.borderRadius.sm} px-3 py-2 bg-gray-50`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                      Age
                    </label>
                    <input 
                      type="number" 
                      value={user.age}
                      readOnly
                      className={`w-full border ${theme.colors.border} ${theme.borderRadius.sm} px-3 py-2 bg-gray-50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                      Location
                    </label>
                    <input 
                      type="text" 
                      value={user.location}
                      readOnly
                      className={`w-full border ${theme.colors.border} ${theme.borderRadius.sm} px-3 py-2 bg-gray-50`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                    Dietary Restrictions
                  </label>
                  <select 
                    value={user.dietaryRestrictions}
                    disabled
                    className={`w-full border ${theme.colors.border} ${theme.borderRadius.sm} px-3 py-2 bg-gray-50`}
                  >
                    <option value="celiac_disease">Celiac Disease</option>
                    <option value="ncgs">Non-Celiac Gluten Sensitivity</option>
                    <option value="lifestyle_choice">Lifestyle Choice</option>
                    <option value="wheat_allergy">Wheat Allergy</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button onClick={() => navigate('/dashboard')} fullWidth>
                    Start Matching
                  </Button>
                  <Button 
                    onClick={() => setShowJWTInspector(true)}
                    variant="outline"
                    fullWidth
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Inspect JWT
                  </Button>
                  <Button 
                    onClick={handleSignOut}
                    variant="outline"
                    fullWidth
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
            
            <JWTInspector 
              isOpen={showJWTInspector} 
              onClose={() => setShowJWTInspector(false)} 
            />
          </div>
        </div>
      </AppLayout>
    );
  }

  // If not authenticated, show sign up/sign in form
  return (
    <AppLayout showHeader={false}>
      <div className="max-w-2xl mx-auto pt-4 md:pt-8 px-4">
        <div className={`${theme.colors.surface} ${theme.borderRadius.md} shadow-lg overflow-hidden border ${theme.colors.border}`}>
          <div className={theme.spacing.lg}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text} mb-2`}>
                {isSignUp ? 'Join GF\'d' : 'Welcome Back'}
              </h1>
              <p className={`${theme.colors.textSecondary} flex items-center justify-center`}>
                {isSignUp ? 'Create your gluten-free dating profile' : 'Sign in to continue your journey'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                          className={`w-full pl-10 pr-4 py-3 border ${theme.colors.border} ${theme.borderRadius.sm} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                        className={`w-full px-4 py-3 border ${theme.colors.border} ${theme.borderRadius.sm} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                          className={`w-full pl-10 pr-4 py-3 border ${theme.colors.border} ${theme.borderRadius.sm} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                          className={`w-full pl-10 pr-4 py-3 border ${theme.colors.border} ${theme.borderRadius.sm} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                      className={`w-full px-4 py-3 border ${theme.colors.border} ${theme.borderRadius.sm} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                    className={`w-full pl-10 pr-4 py-3 border ${theme.colors.border} ${theme.borderRadius.sm} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                    className={`w-full pl-10 pr-4 py-3 border ${theme.colors.border} ${theme.borderRadius.sm} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account & Start Matching' : 'Sign In')}
              </Button>

              {/* Okta OAuth Option */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
              
              <Button
                onClick={handleAuth0SignIn}
                disabled={loading}
                variant="outline"
                fullWidth
              >
                <div className="flex items-center justify-center">
                  <Key className="w-5 h-5 mr-3 text-blue-600" />
                  Sign in with Auth0 (JWT Demo)
                </div>
              </Button>
              {/* Toggle Sign Up/Sign In */}
              <div className="text-center">
                <button
                  type="button"
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
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
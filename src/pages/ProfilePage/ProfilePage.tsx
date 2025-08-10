import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart } from 'lucide-react';
import { AppLayout } from '../../components/templates/AppLayout';
import { Button } from '../../components/atoms/Button';
import { ProfileImageUpload } from '../../components/molecules/ProfileImageUpload';
import { useTheme } from '../../hooks/useTheme';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // TODO: Implement real profile service integration
  const handleImageUploaded = (imageUrl: string) => {
    console.log('Profile image uploaded:', imageUrl);
    // TODO: Save image URL to user profile
  };

  const handleImageUploadError = (error: string) => {
    console.error('Image upload error:', error);
    // TODO: Show error toast/notification
  };

  const handleSaveProfile = () => {
    console.log('Saving profile...');
    // TODO: Save profile via API
  };

  const handleSignOut = () => {
    console.log('Signing out...');
    // TODO: Clear authentication tokens
    navigate('/');
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto pt-4 md:pt-8 px-4">
        <div className={`${theme.colors.surface} ${theme.borderRadius.md} shadow-lg overflow-hidden border ${theme.colors.border}`}>
          <div className={theme.spacing.lg}>
            <div className="text-center mb-8">
              <div className="mb-6">
                <ProfileImageUpload
                  userId="current-user-id"
                  onImageUploaded={handleImageUploaded}
                  onUploadError={handleImageUploadError}
                  maxSize={10}
                />
              </div>
              <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text} mb-2`}>
                Your Profile
              </h1>
              <p className={`${theme.colors.textSecondary} flex items-center justify-center`}>
                <Heart className="w-4 h-4 mr-2 text-rose-400" />
                Manage your dating profile and preferences
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                  Name
                </label>
                <input 
                  type="text" 
                  defaultValue="John Doe"
                  className={`w-full border ${theme.colors.border} ${theme.borderRadius.sm} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-colors`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                  Age
                </label>
                <input 
                  type="number" 
                  defaultValue="30"
                  className={`w-full border ${theme.colors.border} ${theme.borderRadius.sm} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-colors`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                  Dietary Restrictions
                </label>
                <select className={`w-full border ${theme.colors.border} ${theme.borderRadius.sm} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-colors`}>
                  <option>Celiac Disease</option>
                  <option>Non-Celiac Gluten Sensitivity</option>
                  <option>Lifestyle Choice</option>
                  <option>Wheat Allergy</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
                  Bio
                </label>
                <textarea 
                  rows={4}
                  defaultValue="Love exploring gluten-free restaurants and cooking healthy meals. Looking for someone who shares my passion for a gluten-free lifestyle!"
                  className={`w-full border ${theme.colors.border} ${theme.borderRadius.sm} px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-colors`}
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button onClick={handleSaveProfile} fullWidth>
                  Save Changes
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
        </div>
      </div>
    </AppLayout>
  );
};
import React, { useState, useEffect } from 'react';
import { Shield, Award } from 'lucide-react';
import { AppLayout } from '../../components/templates/AppLayout';
import { VerificationCard } from '../../components/molecules/VerificationCard';
import { Button } from '../../components/atoms/Button';
import { VerificationStatus } from '../../types';
import { VerificationService } from '../../services/verificationService';
import { useTheme } from '../../hooks/useTheme';

export const VerificationPage: React.FC = () => {
  const { theme } = useTheme();
  const [verifications, setVerifications] = useState<VerificationStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const verificationService = VerificationService.getInstance();

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    setLoading(true);
    try {
      // TODO: Get actual user ID from auth context
      const userId = 'current-user-id';
      const status = await verificationService.getVerificationStatus(userId);
      setVerifications(status);
    } catch (error) {
      console.error('Error loading verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartVerification = async (type: string) => {
    console.log('Starting verification for:', type);
    
    // TODO: Implement actual verification flows
    switch (type) {
      case 'photo':
        // TODO: Open photo verification modal
        alert('Photo verification would open camera/file picker');
        break;
      case 'id':
        // TODO: Open ID verification modal
        alert('ID verification would open document scanner');
        break;
      case 'location':
        // TODO: Request location permission and verify
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                await verificationService.submitLocationVerification(
                  position.coords.latitude,
                  position.coords.longitude
                );
                alert('Location verification submitted!');
                loadVerifications(); // Refresh status
              } catch (error) {
                console.error('Location verification failed:', error);
              }
            },
            (error) => {
              console.error('Location access denied:', error);
              alert('Location access is required for verification');
            }
          );
        }
        break;
    }
  };

  const verifiedCount = verifications.filter(v => v.status === 'verified').length;
  const badges = verificationService.getVerificationBadges(verifications);

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto pt-4 md:pt-8 px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className={theme.colors.textSecondary}>Loading verification status...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pt-4 md:pt-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-500" />
          </div>
          <h1 className={`text-2xl md:text-3xl font-bold ${theme.colors.text} mb-2`}>
            Account Verification
          </h1>
          <p className={`${theme.colors.textSecondary} max-w-2xl mx-auto`}>
            Verify your account to build trust with matches and unlock premium features. 
            Verified profiles get 3x more matches!
          </p>
        </div>

        {/* Progress Summary */}
        <div className={`${theme.colors.surface} ${theme.borderRadius.md} shadow-md p-6 mb-8`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`text-xl font-semibold ${theme.colors.text} mb-1`}>
                Verification Progress
              </h2>
              <p className={theme.colors.textSecondary}>
                {verifiedCount} of {verifications.length} verifications completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-500">
                {Math.round((verifiedCount / verifications.length) * 100)}%
              </div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(verifiedCount / verifications.length) * 100}%` }}
            ></div>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div>
              <h3 className={`text-sm font-medium ${theme.colors.text} mb-2`}>
                Your Verification Badges:
              </h3>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    <Award className="h-4 w-4 mr-1" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Verification Cards */}
        <div className="space-y-6">
          {verifications.map((verification) => (
            <VerificationCard
              key={verification.id}
              verification={verification}
              onStartVerification={handleStartVerification}
            />
          ))}
        </div>

        {/* Benefits Section */}
        <div className={`${theme.colors.surface} ${theme.borderRadius.md} shadow-md p-6 mt-8`}>
          <h2 className={`text-xl font-semibold ${theme.colors.text} mb-4`}>
            Why Verify Your Account?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className={`font-medium ${theme.colors.text} mb-2`}>Build Trust</h3>
              <p className={`text-sm ${theme.colors.textSecondary}`}>
                Show matches you're a real, verified person
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className={`font-medium ${theme.colors.text} mb-2`}>Get More Matches</h3>
              <p className={`text-sm ${theme.colors.textSecondary}`}>
                Verified profiles receive 3x more likes
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className={`font-medium ${theme.colors.text} mb-2`}>Enhanced Safety</h3>
              <p className={`text-sm ${theme.colors.textSecondary}`}>
                Connect with other verified members safely
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
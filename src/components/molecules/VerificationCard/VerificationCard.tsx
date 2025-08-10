import React from 'react';
import { Camera, CreditCard, MapPin, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { VerificationStatus } from '../../../types';
import { Button } from '../../atoms/Button';
import { useTheme } from '../../../hooks/useTheme';

interface VerificationCardProps {
  verification: VerificationStatus;
  onStartVerification: (type: string) => void;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({ 
  verification, 
  onStartVerification 
}) => {
  const { theme } = useTheme();

  const getIcon = () => {
    switch (verification.type) {
      case 'photo':
        return <Camera className="h-6 w-6" />;
      case 'id':
        return <CreditCard className="h-6 w-6" />;
      case 'location':
        return <MapPin className="h-6 w-6" />;
    }
  };

  const getStatusIcon = () => {
    switch (verification.status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'not_started':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (verification.status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      case 'not_started':
        return 'Not Started';
    }
  };

  const getStatusColor = () => {
    switch (verification.status) {
      case 'verified':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      case 'not_started':
        return 'text-gray-500';
    }
  };

  const getTitle = () => {
    switch (verification.type) {
      case 'photo':
        return 'Photo Verification';
      case 'id':
        return 'ID Verification';
      case 'location':
        return 'Location Verification';
    }
  };

  const getDescription = () => {
    switch (verification.type) {
      case 'photo':
        return 'Verify your photos match your profile to build trust with matches';
      case 'id':
        return 'Verify your identity with a government-issued ID for enhanced safety';
      case 'location':
        return 'Verify your location to show accurate distance to matches';
    }
  };

  return (
    <div className={`${theme.colors.surface} ${theme.borderRadius.md} shadow-md overflow-hidden`}>
      <div className={theme.spacing.md}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${theme.colors.background} ${theme.borderRadius.sm}`}>
              {getIcon()}
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${theme.colors.text}`}>
                {getTitle()}
              </h3>
              <p className={`text-sm ${theme.colors.textSecondary}`}>
                {getDescription()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {verification.status === 'not_started' && (
          <Button 
            onClick={() => onStartVerification(verification.type)}
            fullWidth
            size="sm"
          >
            Start Verification
          </Button>
        )}

        {verification.status === 'rejected' && verification.rejectionReason && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Rejection Reason:</strong> {verification.rejectionReason}
            </p>
            <Button 
              onClick={() => onStartVerification(verification.type)}
              variant="outline"
              size="sm"
              fullWidth
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {verification.verifiedAt && (
          <div className="mt-3 text-xs text-gray-500">
            Verified on {new Date(verification.verifiedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};
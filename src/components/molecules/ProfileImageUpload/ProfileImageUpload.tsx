import React, { useState, useRef } from 'react';
import { Camera, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { MediaService, MediaFile } from '../../../services/mediaService';
import { Button } from '../../atoms/Button';
import { useTheme } from '../../../hooks/useTheme';

interface ProfileImageUploadProps {
  currentImage?: string;
  onImageUploaded: (imageUrl: string) => void;
  onUploadError: (error: string) => void;
  userId: string;
  maxSize?: number; // in MB
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  currentImage,
  onImageUploaded,
  onUploadError,
  userId,
  maxSize = 10,
}) => {
  const { theme } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaService = MediaService.getInstance();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onUploadError('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      onUploadError(`Image size must be less than ${maxSize}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const mediaFile = await mediaService.uploadMedia(file, userId, {
        encrypt: true,
        generateThumbnail: true,
        maxSize: maxSize * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        quality: 0.8,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Get decrypted URL for immediate display
      const result = await mediaService.getDecryptedMedia(mediaFile.id, userId);
      if (result) {
        onImageUploaded(result.url);
      }

    } catch (error) {
      onUploadError(error instanceof Error ? error.message : 'Upload failed');
      setPreviewUrl(currentImage || null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUploaded('');
  };

  return (
    <div className="space-y-4">
      {/* Image Preview */}
      <div className="relative">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-gray-100 border-4 border-white shadow-lg">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-blue-300" />
            </div>
          )}
        </div>

        {/* Upload Progress Overlay */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <div className="text-center text-white">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <div className="text-xs font-medium">{uploadProgress}%</div>
            </div>
          </div>
        )}

        {/* Remove Button */}
        {previewUrl && !uploading && (
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload Button */}
      <div className="text-center">
        <Button
          onClick={handleCameraClick}
          disabled={uploading}
          variant="outline"
          size="sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          {previewUrl ? 'Change Photo' : 'Add Photo'}
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">Photo Guidelines</p>
            <ul className="space-y-1">
              <li>• Use a clear, recent photo of yourself</li>
              <li>• Face should be clearly visible</li>
              <li>• Max size: {maxSize}MB (JPEG, PNG, WebP)</li>
              <li>• Photos are encrypted and secure</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-700">
            <p className="font-medium mb-1">Privacy & Security</p>
            <p>Your photos are encrypted before upload and only visible to your matches. All images go through content moderation for community safety.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
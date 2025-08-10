import React, { useState, useRef } from 'react';
import { Upload, Image, Video, Mic, X, CheckCircle, AlertCircle } from 'lucide-react';
import { MediaService, MediaFile } from '../../../services/mediaService';
import { Button } from '../../atoms/Button';
import { useTheme } from '../../../hooks/useTheme';

interface MediaUploadProps {
  onUploadComplete: (files: MediaFile[]) => void;
  onUploadError: (error: string) => void;
  maxFiles?: number;
  allowedTypes?: ('image' | 'video' | 'audio')[];
  maxSize?: number; // in MB
  userId: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  onUploadComplete,
  onUploadError,
  maxFiles = 5,
  allowedTypes = ['image', 'video', 'audio'],
  maxSize = 50,
  userId,
}) => {
  const { theme } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaService = MediaService.getInstance();

  const getMimeTypes = (): string[] => {
    const typeMap = {
      image: ['image/jpeg', 'image/png', 'image/webp'],
      video: ['video/mp4', 'video/webm'],
      audio: ['audio/mp3', 'audio/wav', 'audio/ogg'],
    };

    return allowedTypes.flatMap(type => typeMap[type]);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    if (uploadedFiles.length + files.length > maxFiles) {
      onUploadError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileId = `temp_${Date.now()}_${index}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileId] || 0;
            if (currentProgress >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, [fileId]: currentProgress + 10 };
          });
        }, 200);

        try {
          const mediaFile = await mediaService.uploadMedia(file, userId, {
            encrypt: true,
            generateThumbnail: true,
            maxSize: maxSize * 1024 * 1024,
            allowedTypes: getMimeTypes(),
          });

          clearInterval(progressInterval);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          
          return mediaFile;
        } catch (error) {
          clearInterval(progressInterval);
          throw error;
        }
      });

      const results = await Promise.all(uploadPromises);
      setUploadedFiles(prev => [...prev, ...results]);
      onUploadComplete(results);

    } catch (error) {
      onUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (mimeType.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (mimeType.startsWith('audio/')) return <Mic className="w-5 h-5" />;
    return <Upload className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed ${theme.colors.border} ${theme.borderRadius.md} p-6 text-center hover:border-slate-400 transition-colors cursor-pointer`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className={`text-lg font-medium ${theme.colors.text} mb-2`}>
          Upload Media Files
        </h3>
        <p className={`text-sm ${theme.colors.textSecondary} mb-4`}>
          Drag and drop files here, or click to select
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500">
          {allowedTypes.includes('image') && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Images</span>
          )}
          {allowedTypes.includes('video') && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Videos</span>
          )}
          {allowedTypes.includes('audio') && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Audio</span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Max {maxFiles} files, {maxSize}MB each
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={getMimeTypes().join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <h4 className={`text-sm font-medium ${theme.colors.text}`}>Uploading...</h4>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Encrypting and uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-slate-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className={`text-sm font-medium ${theme.colors.text}`}>Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center justify-between p-3 ${theme.colors.surface} ${theme.borderRadius.sm} border ${theme.colors.border}`}
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.mimeType)}
                  <div>
                    <p className={`text-sm font-medium ${theme.colors.text}`}>
                      {file.originalName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(file.size)} • {file.mimeType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.moderationStatus === 'approved' && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                  {file.moderationStatus === 'pending' && (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-slate-600">
            <p className="font-medium mb-1">Secure Upload</p>
            <p>All files are encrypted before upload and stored securely. Only you and your matches can access your media.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, Shield, Eye, EyeOff } from 'lucide-react';
import { MediaService, MediaFile } from '../../../services/mediaService';
import { useTheme } from '../../../hooks/useTheme';

interface MediaViewerProps {
  mediaFile: MediaFile;
  userId: string;
  autoPlay?: boolean;
  showControls?: boolean;
  onError?: (error: string) => void;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({
  mediaFile,
  userId,
  autoPlay = false,
  showControls = true,
  onError,
}) => {
  const { theme } = useTheme();
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [blurred, setBlurred] = useState(true);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const mediaService = MediaService.getInstance();

  useEffect(() => {
    loadDecryptedMedia();
  }, [mediaFile.id, userId]);

  const loadDecryptedMedia = async () => {
    try {
      setLoading(true);
      const result = await mediaService.getDecryptedMedia(mediaFile.id, userId);
      
      if (result) {
        setDecryptedUrl(result.url);
        setExpiresAt(result.expiresAt);
      } else {
        onError?.('Unable to load media');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const toggleBlur = () => {
    setBlurred(!blurred);
  };

  const formatTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className={`${theme.colors.surface} ${theme.borderRadius.md} p-8 text-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
        <p className={`text-sm ${theme.colors.textSecondary}`}>
          Decrypting media...
        </p>
      </div>
    );
  }

  if (!decryptedUrl) {
    return (
      <div className={`${theme.colors.surface} ${theme.borderRadius.md} p-8 text-center border-2 border-dashed ${theme.colors.border}`}>
        <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className={`text-sm ${theme.colors.textSecondary}`}>
          Media unavailable or access denied
        </p>
      </div>
    );
  }

  const renderMedia = () => {
    if (mediaFile.mimeType.startsWith('image/')) {
      return (
        <div className="relative">
          <img
            src={decryptedUrl}
            alt={mediaFile.originalName}
            className={`w-full h-auto ${theme.borderRadius.md} ${
              blurred ? 'filter blur-lg' : ''
            } transition-all duration-300`}
          />
          {blurred && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={toggleBlur}
                className="bg-black/50 text-white px-4 py-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      );
    }

    if (mediaFile.mimeType.startsWith('video/')) {
      return (
        <div className="relative">
          <video
            src={decryptedUrl}
            className={`w-full h-auto ${theme.borderRadius.md} ${
              blurred ? 'filter blur-lg' : ''
            } transition-all duration-300`}
            controls={showControls && !blurred}
            autoPlay={autoPlay && !blurred}
            muted={muted}
          />
          {blurred && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <button
                onClick={toggleBlur}
                className="bg-black/50 text-white px-6 py-3 rounded-full hover:bg-black/70 transition-colors"
              >
                <Play className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      );
    }

    if (mediaFile.mimeType.startsWith('audio/')) {
      return (
        <div className={`${theme.colors.surface} ${theme.borderRadius.md} p-6 border ${theme.colors.border}`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h3 className={`font-medium ${theme.colors.text}`}>
                {mediaFile.originalName}
              </h3>
              <p className="text-sm text-slate-500">
                {mediaFile.duration ? `${Math.floor(mediaFile.duration / 60)}:${(mediaFile.duration % 60).toString().padStart(2, '0')}` : 'Audio file'}
              </p>
            </div>
          </div>
          
          {!blurred && (
            <audio
              src={decryptedUrl}
              controls={showControls}
              autoPlay={autoPlay}
              className="w-full"
            />
          )}
          
          {blurred && (
            <div className="text-center">
              <button
                onClick={toggleBlur}
                className="bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-colors"
              >
                <Play className="w-4 h-4 inline mr-2" />
                Play Audio
              </button>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-3">
      {renderMedia()}
      
      {/* Media Controls */}
      {showControls && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3">
            {!mediaFile.mimeType.startsWith('image/') && (
              <button
                onClick={toggleBlur}
                className={`flex items-center space-x-1 px-2 py-1 rounded ${
                  blurred ? 'text-slate-600' : 'text-slate-900'
                } hover:bg-slate-100 transition-colors`}
              >
                {blurred ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{blurred ? 'Show' : 'Hide'}</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-3 text-slate-500">
            {expiresAt && (
              <span className="text-xs">
                Expires in {formatTimeRemaining(expiresAt)}
              </span>
            )}
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span className="text-xs">Encrypted</span>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Status */}
      {mediaFile.moderationStatus === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800">
            This media is pending moderation review.
          </p>
        </div>
      )}
    </div>
  );
};
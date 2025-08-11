import React, { useState, useEffect } from 'react';
import { Database, Download, Upload, Trash2, RefreshCw, X } from 'lucide-react';
import { StorageService } from '../../../services/storageService';
import { Button } from '../../atoms/Button';
import { useTheme } from '../../../hooks/useTheme';

interface SessionStorageDebuggerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionStorageDebugger: React.FC<SessionStorageDebuggerProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { theme } = useTheme();
  const [storageInfo, setStorageInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'profile' | 'swipes'>('overview');
  const [importData, setImportData] = useState('');
  const storageService = StorageService.getInstance();

  useEffect(() => {
    if (isOpen) {
      loadStorageInfo();
    }
  }, [isOpen]);

  const loadStorageInfo = () => {
    const info = storageService.getStorageInfo();
    const data = {
      info,
      matches: storageService.getMatches(),
      profileChanges: storageService.getProfileChanges(),
      userPreferences: storageService.getUserPreferences(),
      swipeHistory: storageService.getSwipeHistory(),
      appState: storageService.getAppState()
    };
    setStorageInfo(data);
  };

  const handleExport = () => {
    const exportedData = storageService.exportData();
    const blob = new Blob([exportedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gfd-session-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      storageService.importData(importData);
      setImportData('');
      loadStorageInfo();
      alert('Data imported successfully!');
    } catch (error) {
      alert('Import failed: ' + (error as Error).message);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all session data?')) {
      storageService.clearAllData();
      loadStorageInfo();
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${theme.colors.surface} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-blue-600" />
            <h2 className={`text-2xl font-bold ${theme.colors.text}`}>
              Session Storage Debugger
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={loadStorageInfo} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'overview' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
                }`}
              >
                <Database className="w-4 h-4 inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'matches' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
                }`}
              >
                Matches ({storageInfo?.matches?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'profile' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
                }`}
              >
                Profile Changes
              </button>
              <button
                onClick={() => setActiveTab('swipes')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'swipes' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
                }`}
              >
                Swipe History
              </button>
            </div>

            {/* Storage Stats */}
            {storageInfo && (
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-2">Storage Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span>{storageInfo.info.totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Size:</span>
                    <span>{formatBytes(storageInfo.info.totalSize)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 space-y-2">
              <Button onClick={handleExport} variant="outline" size="sm" fullWidth>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button onClick={handleClearAll} variant="outline" size="sm" fullWidth>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {storageInfo ? (
              <>
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Session Storage Overview</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {storageInfo.matches.length}
                        </div>
                        <div className="text-sm text-blue-800">Active Matches</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {storageInfo.swipeHistory.liked?.length || 0}
                        </div>
                        <div className="text-sm text-green-800">Profiles Liked</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {Object.keys(storageInfo.profileChanges).length}
                        </div>
                        <div className="text-sm text-yellow-800">Profile Changes</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatBytes(storageInfo.info.totalSize)}
                        </div>
                        <div className="text-sm text-purple-800">Storage Used</div>
                      </div>
                    </div>

                    {/* Import/Export */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Import Data</h4>
                      <textarea
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder="Paste exported JSON data here..."
                        className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm"
                      />
                      <Button onClick={handleImport} disabled={!importData.trim()}>
                        <Upload className="w-4 h-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'matches' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Stored Matches</h3>
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                      {JSON.stringify(storageInfo.matches, null, 2)}
                    </pre>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Profile Changes</h3>
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                      {JSON.stringify(storageInfo.profileChanges, null, 2)}
                    </pre>
                  </div>
                )}

                {activeTab === 'swipes' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Swipe History</h3>
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                      {JSON.stringify(storageInfo.swipeHistory, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className={theme.colors.textSecondary}>
                  Loading session storage data...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
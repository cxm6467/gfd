import React, { useState, useEffect } from 'react';
import { Eye, Copy, RefreshCw, Key, Clock, User, X } from 'lucide-react';
import { Auth0AuthService } from '../../../services/auth0AuthService';
import { jwtUtils } from '../../../services/auth0Config';
import { Button } from '../../atoms/Button';
import { useTheme } from '../../../hooks/useTheme';

interface JWTInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JWTInspector: React.FC<JWTInspectorProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [tokenData, setTokenData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'access' | 'id' | 'user'>('access');
  const auth0AuthService = Auth0AuthService.getInstance();

  useEffect(() => {
    if (isOpen) {
      loadTokenData();
    }
  }, [isOpen]);

  const loadTokenData = async () => {
    setLoading(true);
    try {
      const data = await auth0AuthService.getTokenInfo();
      setTokenData(data);
    } catch (error) {
      console.error('Error loading token data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${theme.colors.surface} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Key className="w-6 h-6 text-blue-600" />
            <h2 className={`text-2xl font-bold ${theme.colors.text}`}>
              JWT Token Inspector
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={loadTokenData} variant="outline" size="sm">
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

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className={theme.colors.textSecondary}>Loading token data...</p>
          </div>
        ) : (
          <div className="flex h-[600px]">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('access')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'access' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
                  }`}
                >
                  <Key className="w-4 h-4 inline mr-2" />
                  Access Token
                </button>
                <button
                  onClick={() => setActiveTab('id')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'id' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  ID Token
                </button>
                <button
                  onClick={() => setActiveTab('user')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'user' ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  User Info
                </button>
              </div>

              {/* Token Status */}
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-2">Auth Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Authenticated:</span>
                    <span className={tokenData?.isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                      {tokenData?.isAuthenticated ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {tokenData?.tokens?.accessToken && (
                    <div className="flex justify-between">
                      <span>Token Expires:</span>
                      <span className="text-xs">
                        {formatDate(tokenData.tokens.accessToken.payload.exp)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {tokenData ? (
                <div className="p-6">
                  {activeTab === 'access' && tokenData.tokens?.accessToken && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Access Token</h3>
                        <Button
                          onClick={() => copyToClipboard(tokenData.tokens.accessToken.raw)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Token
                        </Button>
                      </div>

                      {/* Header */}
                      <div>
                        <h4 className="font-medium mb-2">Header</h4>
                        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                          {JSON.stringify(tokenData.tokens.accessToken.header, null, 2)}
                        </pre>
                      </div>

                      {/* Payload */}
                      <div>
                        <h4 className="font-medium mb-2">Payload</h4>
                        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                          {JSON.stringify(tokenData.tokens.accessToken.payload, null, 2)}
                        </pre>
                      </div>

                      {/* Key Claims */}
                      <div>
                        <h4 className="font-medium mb-2">Key Claims</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-sm text-blue-600 font-medium">Subject (sub)</div>
                            <div className="text-sm">{tokenData.tokens.accessToken.payload.sub}</div>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="text-sm text-green-600 font-medium">Issuer (iss)</div>
                            <div className="text-sm">{tokenData.tokens.accessToken.payload.iss}</div>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <div className="text-sm text-yellow-600 font-medium">Audience (aud)</div>
                            <div className="text-sm">{tokenData.tokens.accessToken.payload.aud}</div>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="text-sm text-purple-600 font-medium">Expires (exp)</div>
                            <div className="text-sm">{formatDate(tokenData.tokens.accessToken.payload.exp)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'id' && tokenData.tokens?.idToken && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">ID Token</h3>
                        <Button
                          onClick={() => copyToClipboard(tokenData.tokens.idToken.raw)}
                          variant="outline"
                          size="sm"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Token
                        </Button>
                      </div>

                      {/* Header */}
                      <div>
                        <h4 className="font-medium mb-2">Header</h4>
                        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                          {JSON.stringify(tokenData.tokens.idToken.header, null, 2)}
                        </pre>
                      </div>

                      {/* Payload */}
                      <div>
                        <h4 className="font-medium mb-2">Payload</h4>
                        <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                          {JSON.stringify(tokenData.tokens.idToken.payload, null, 2)}
                        </pre>
                      </div>

                      {/* User Claims */}
                      <div>
                        <h4 className="font-medium mb-2">User Claims</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-sm text-blue-600 font-medium">Email</div>
                            <div className="text-sm">{tokenData.tokens.idToken.payload.email}</div>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="text-sm text-green-600 font-medium">Name</div>
                            <div className="text-sm">{tokenData.tokens.idToken.payload.name}</div>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <div className="text-sm text-yellow-600 font-medium">Email Verified</div>
                            <div className="text-sm">{tokenData.tokens.idToken.payload.email_verified ? 'Yes' : 'No'}</div>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="text-sm text-purple-600 font-medium">Auth Time</div>
                            <div className="text-sm">{formatDate(tokenData.tokens.idToken.payload.auth_time)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'user' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">User Information</h3>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm overflow-x-auto">
                          {JSON.stringify(tokenData.userInfo, null, 2)}
                        </pre>
                      </div>

                      {/* Token Manager State */}
                      <div>
                        <h4 className="font-medium mb-2">Token Manager State</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm overflow-x-auto">
                            {JSON.stringify(tokenData.tokenManager, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className={theme.colors.textSecondary}>
                    No token data available. Please sign in first.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
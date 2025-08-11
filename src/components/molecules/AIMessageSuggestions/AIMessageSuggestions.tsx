import React, { useState, useEffect } from 'react';
import { Bot, Lightbulb, Shield, MessageCircle, RefreshCw } from 'lucide-react';
import { AIModerationService, AIMessage } from '../../../services/aiModerationService';
import { StorageService } from '../../../services/storageService';
import { useTheme } from '../../../hooks/useTheme';

interface AIMessageSuggestionsProps {
  conversationId: string;
  matchName: string;
  dietaryInfo?: string;
  onSuggestionSelect: (message: string) => void;
}

export const AIMessageSuggestions: React.FC<AIMessageSuggestionsProps> = ({
  conversationId,
  matchName,
  dietaryInfo,
  onSuggestionSelect
}) => {
  const { theme } = useTheme();
  const [suggestions, setSuggestions] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const aiModerationService = AIModerationService.getInstance();
  const storageService = StorageService.getInstance();

  useEffect(() => {
    loadSuggestions();
  }, [conversationId]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      // Check session storage first
      const cachedSuggestions = storageService.getAIMessages(conversationId);
      
      if (cachedSuggestions.length > 0) {
        setSuggestions(cachedSuggestions);
      } else {
        // Generate new suggestions
        await generateNewSuggestions();
      }
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewSuggestions = async () => {
    try {
      const newSuggestions = await aiModerationService.generateConversationSuggestions(
        conversationId,
        {
          matchName,
          dietaryInfo,
          recentMessages: [] // TODO: Pass actual recent messages
        }
      );

      setSuggestions(newSuggestions);
      
      // Save to session storage
      storageService.saveAIMessages(conversationId, newSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await generateNewSuggestions();
    setLoading(false);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'icebreaker':
        return <MessageCircle className="w-4 h-4" />;
      case 'tip':
        return <Lightbulb className="w-4 h-4" />;
      case 'warning':
        return <Shield className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'icebreaker':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'tip':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'warning':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (suggestions.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="mb-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 mb-2"
      >
        <Bot className="w-4 h-4" />
        <span>AI Suggestions</span>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {suggestions.length}
        </span>
      </button>

      {/* Suggestions */}
      {isExpanded && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Tap a suggestion to use it</span>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <Bot className="w-6 h-6 text-gray-400 mx-auto mb-2 animate-pulse" />
              <p className="text-xs text-gray-500">Generating suggestions...</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => onSuggestionSelect(suggestion.content)}
                  className={`w-full text-left p-3 rounded-lg border transition-all hover:shadow-sm ${getColorForType(suggestion.type)}`}
                >
                  <div className="flex items-start space-x-2">
                    {getIconForType(suggestion.type)}
                    <p className="text-sm flex-1">{suggestion.content}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
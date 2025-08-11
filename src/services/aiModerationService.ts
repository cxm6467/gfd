// AI Moderation Service for message content filtering
// This service provides content moderation for user messages
// Current implementation uses rule-based filtering with session storage

export interface ModerationResult {
  isAllowed: boolean;
  confidence: number;
  flags: string[];
  suggestedEdit?: string;
  reason?: string;
}

export interface AIMessage {
  id: string;
  content: string;
  type: 'suggestion' | 'warning' | 'tip' | 'icebreaker';
  timestamp: Date;
  conversationId: string;
  isModerated: boolean;
}

export class AIModerationService {
  private static instance: AIModerationService;
  
  static getInstance(): AIModerationService {
    if (!AIModerationService.instance) {
      AIModerationService.instance = new AIModerationService();
    }
    return AIModerationService.instance;
  }

  // Content moderation for user messages
  async moderateMessage(content: string, conversationId: string): Promise<ModerationResult> {
    console.log('Moderating message content:', content.substring(0, 50) + '...');

    // Rule-based content filtering (production would use AI services)
    const flags: string[] = [];
    let isAllowed = true;
    let confidence = 0.95;
    let suggestedEdit: string | undefined;

    // Check for inappropriate content
    const inappropriateWords = [
      'spam', 'scam', 'money', 'bitcoin', 'investment', 'loan',
      'explicit', 'inappropriate', 'harassment'
    ];

    const lowerContent = content.toLowerCase();
    
    inappropriateWords.forEach(word => {
      if (lowerContent.includes(word)) {
        flags.push(`potentially_inappropriate_${word}`);
        confidence = Math.max(0.3, confidence - 0.2);
      }
    });

    // Check for personal information sharing
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    
    if (emailRegex.test(content)) {
      flags.push('contains_email');
      suggestedEdit = content.replace(emailRegex, '[email removed for safety]');
      confidence = 0.7;
    }
    
    if (phoneRegex.test(content)) {
      flags.push('contains_phone');
      suggestedEdit = content.replace(phoneRegex, '[phone removed for safety]');
      confidence = 0.7;
    }

    // Block if confidence is too low
    if (confidence < 0.5) {
      isAllowed = false;
    }

    return {
      isAllowed,
      confidence,
      flags,
      suggestedEdit,
      reason: flags.length > 0 ? 'Message contains potentially unsafe content' : undefined
    };
  }

  // Generate AI conversation suggestions
  async generateConversationSuggestions(conversationId: string, context: {
    matchName: string;
    sharedInterests?: string[];
    dietaryInfo?: string;
    recentMessages?: string[];
  }): Promise<AIMessage[]> {
    console.log('Generating AI suggestions for conversation:', conversationId);

    const suggestions: AIMessage[] = [];
    const now = new Date();

    // Icebreaker suggestions
    const icebreakers = [
      `Hey ${context.matchName}! I noticed we both have ${context.dietaryInfo}. What's your favorite gluten-free restaurant in the area?`,
      `Hi ${context.matchName}! Have you tried any good GF bakeries lately? I'm always looking for new recommendations!`,
      `Hello! I see we're both gluten-free. Do you have any go-to recipes that are absolutely delicious?`,
      `Hey there! What's been your biggest gluten-free discovery recently? I love hearing about new finds!`
    ];

    // Add icebreaker if no messages yet
    if (!context.recentMessages || context.recentMessages.length === 0) {
      suggestions.push({
        id: `ai_${Date.now()}_icebreaker`,
        content: icebreakers[Math.floor(Math.random() * icebreakers.length)],
        type: 'icebreaker',
        timestamp: now,
        conversationId,
        isModerated: true
      });
    }

    // Conversation tips
    const tips = [
      "💡 Tip: Ask about their favorite gluten-free restaurants for great date ideas!",
      "💡 Tip: Share your celiac/sensitivity story when you feel comfortable - it builds connection!",
      "💡 Tip: Suggest a video call before meeting in person for added safety.",
      "💡 Tip: Ask about their experience with cross-contamination to understand their needs better."
    ];

    suggestions.push({
      id: `ai_${Date.now()}_tip`,
      content: tips[Math.floor(Math.random() * tips.length)],
      type: 'tip',
      timestamp: now,
      conversationId,
      isModerated: true
    });

    // Safety reminders (occasionally)
    if (Math.random() > 0.7) {
      suggestions.push({
        id: `ai_${Date.now()}_safety`,
        content: "🛡️ Remember: Keep conversations on GF'd until you feel comfortable sharing personal contact info. Your safety is our priority!",
        type: 'warning',
        timestamp: now,
        conversationId,
        isModerated: true
      });
    }

    return suggestions;
  }

  // Generate smart reply suggestions
  async generateSmartReplies(lastMessage: string, context: {
    matchName: string;
    conversationHistory: string[];
  }): Promise<string[]> {
    console.log('Generating smart replies for:', lastMessage.substring(0, 30) + '...');

    const lowerMessage = lastMessage.toLowerCase();
    
    // Restaurant-related replies
    if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      return [
        "That sounds amazing! I'd love to check it out 😊",
        "I've been looking for a new GF place to try!",
        "Do they have a dedicated gluten-free menu?"
      ];
    }

    // Recipe-related replies
    if (lowerMessage.includes('recipe') || lowerMessage.includes('cook') || lowerMessage.includes('bake')) {
      return [
        "I'd love to try that recipe! Could you share it?",
        "Cooking together sounds like fun! 👨‍🍳",
        "I'm always looking for new GF recipes to try!"
      ];
    }

    // Meeting/date related replies
    if (lowerMessage.includes('meet') || lowerMessage.includes('date') || lowerMessage.includes('coffee')) {
      return [
        "I'd like that! Do you know any good GF-friendly places?",
        "Sounds great! When works best for you?",
        "Perfect! I know a great gluten-free café we could try."
      ];
    }

    // General positive replies
    return [
      "That's really interesting! Tell me more 😊",
      "I completely understand that!",
      "That sounds wonderful!",
      "I'd love to hear more about that!"
    ];
  }

  // Check if message needs human review
  async requiresHumanReview(content: string, flags: string[]): Promise<boolean> {
    // High-risk flags that require human review
    const highRiskFlags = [
      'contains_email',
      'contains_phone',
      'potentially_inappropriate',
      'harassment_detected'
    ];

    return flags.some(flag => 
      highRiskFlags.some(riskFlag => flag.includes(riskFlag))
    );
  }
}
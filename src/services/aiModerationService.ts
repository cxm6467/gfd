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

  // Generate silly AI responses as the match
  async generateMatchResponse(userMessage: string, matchName: string, dietaryInfo?: string): Promise<string> {
    console.log('Generating AI match response for:', matchName);

    const lowerMessage = userMessage.toLowerCase();

    // Food and restaurant responses
    if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      const foodResponses = [
        `OMG yes! I know this amazing GF place that has the BEST pasta! 🍝 We should totally go together!`,
        `Food is life! 😍 I'm always hunting for new gluten-free spots. Have you tried that new bakery on Main Street?`,
        `You're speaking my language! 🗣️ I have a whole list of GF restaurants saved on my phone. Want me to share some favorites?`,
        `I'm literally drooling just thinking about good GF food! 🤤 What's your go-to comfort food?`,
        `YES! Finally someone who gets it! 🙌 Most people don't understand how exciting a good GF menu is!`
      ];
      return foodResponses[Math.floor(Math.random() * foodResponses.length)];
    }

    // Cooking and recipe responses
    if (lowerMessage.includes('cook') || lowerMessage.includes('recipe') || lowerMessage.includes('bake')) {
      const cookingResponses = [
        `I LOVE cooking! 👨‍🍳 Just made the most amazing GF chocolate chip cookies yesterday. Want the recipe?`,
        `Cooking is my therapy! 🧘‍♀️ There's something magical about creating delicious GF treats from scratch.`,
        `OMG you cook too?! 😱 We're going to get along SO well! I'm always experimenting with new GF flours.`,
        `Baking is my superpower! 💪 I can make GF bread that tastes better than regular bread. Fight me! 😂`,
        `YES! Another kitchen wizard! ✨ I've been perfecting my GF sourdough starter for months now.`
      ];
      return cookingResponses[Math.floor(Math.random() * cookingResponses.length)];
    }

    // Celiac/gluten-free specific responses
    if (lowerMessage.includes('celiac') || lowerMessage.includes('gluten') || lowerMessage.includes('sensitivity')) {
      const celiacResponses = [
        `Finally! Someone who ACTUALLY understands! 🙏 The struggle is real but we're stronger for it!`,
        `Gluten-free life chose us! 💪 But honestly, I've never felt better since going GF. How about you?`,
        `The GF community is the best! 🤗 We look out for each other like no other group I know.`,
        `Cross-contamination anxiety is SO real! 😅 I've become a professional ingredient detective!`,
        `Being GF has made me such a better cook! 👨‍🍳 Silver lining to our dietary adventures!`
      ];
      return celiacResponses[Math.floor(Math.random() * celiacResponses.length)];
    }

    // Dating and relationship responses
    if (lowerMessage.includes('date') || lowerMessage.includes('meet') || lowerMessage.includes('coffee')) {
      const datingResponses = [
        `I'd love to meet up! ☕ Know any good GF-friendly coffee shops? I have trust issues with regular cafes 😂`,
        `A date sounds wonderful! 💕 Fair warning: I might quiz the waiter about ingredients. Is that a dealbreaker? 😅`,
        `Yes! Let's do it! 🎉 I promise I'm more fun than my dietary restrictions make me sound!`,
        `Meeting in person sounds great! 😊 I know this amazing GF brunch place that will blow your mind!`,
        `I'm so excited! 🥳 Finally a date where I don't have to explain what gluten is for 20 minutes!`
      ];
      return datingResponses[Math.floor(Math.random() * datingResponses.length)];
    }

    // Compliment responses
    if (lowerMessage.includes('beautiful') || lowerMessage.includes('cute') || lowerMessage.includes('amazing')) {
      const complimentResponses = [
        `Aww, you're making me blush! 😊 You're pretty amazing yourself!`,
        `That's so sweet! 🥰 I was just thinking the same about you!`,
        `You're too kind! ☺️ I love your energy already!`,
        `Thank you! 😘 You definitely know how to make someone smile!`,
        `Stop it, you! 😄 You're going to give me a big head!`
      ];
      return complimentResponses[Math.floor(Math.random() * complimentResponses.length)];
    }

    // Question responses
    if (lowerMessage.includes('?')) {
      const questionResponses = [
        `Great question! 🤔 Let me think... Actually, what do YOU think about it?`,
        `Ooh, I love deep questions! 💭 But first, tell me about your favorite GF snack!`,
        `You're really making me think here! 🧠 I appreciate someone who asks good questions!`,
        `Hmm, that's interesting! 🤨 I've never thought about it that way before.`,
        `You know what? 💡 That's exactly the kind of question I love discussing over GF pizza!`
      ];
      return questionResponses[Math.floor(Math.random() * questionResponses.length)];
    }

    // Greeting responses
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      const greetingResponses = [
        `Hey there! 👋 I'm so excited we matched! Tell me, what's your GF origin story?`,
        `Hello! 😊 This is already the best part of my day! How are you doing?`,
        `Hi! 🌟 I have to say, your profile totally caught my attention! What's your favorite GF treat?`,
        `Hey! 👋 I'm practically bouncing with excitement! Finally someone who gets the GF life!`,
        `Hello there! 😄 I was just thinking about messaging you! Great minds think alike!`
      ];
      return greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
    }

    // Default silly responses
    const defaultResponses = [
      `You know what? 🤷‍♀️ I was just thinking the exact same thing! Are we telepathically connected or what?`,
      `That's so interesting! 🤓 I love how your mind works! Tell me more!`,
      `Okay, but can we talk about how AMAZING it is that we both understand the GF struggle? 🙌`,
      `You're absolutely right! 💯 Also, random question: what's your stance on oat flour? Asking for a friend... 😏`,
      `I'm having such a good time chatting with you! 😊 This is way better than explaining cross-contamination to confused dates!`,
      `You know what's crazy? 🤯 Before I went GF, I never realized how much gluten is in EVERYTHING!`,
      `I'm getting serious good vibes from you! ✨ Plus you probably won't judge me for reading ingredient labels for 10 minutes! 😂`,
      `This conversation is already better than 90% of my dating app experiences! 🎉 No one's asked me to "just pick off the croutons" yet!`
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
}
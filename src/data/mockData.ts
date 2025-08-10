import { User, Match, Message } from '../types';

export const mockProfiles: User[] = [
  {
    id: 1,
    name: "Sarah",
    age: 28,
    bio: "Celiac since 2018 • Loves baking GF treats",
    description: "Passionate about creating delicious gluten-free recipes and exploring safe restaurants. Looking for someone who understands the importance of a dedicated GF kitchen!",
    emoji: "👩‍🍳",
    dietaryInfo: "Celiac Disease",
    location: "San Francisco, CA"
  },
  {
    id: 2,
    name: "Mike",
    age: 32,
    bio: "Gluten-free athlete • CrossFit enthusiast",
    description: "Been gluten-free for 5 years and never felt better! Love staying active and finding new GF restaurants. Let's explore the city together!",
    emoji: "🏋️‍♂️",
    dietaryInfo: "Non-Celiac Gluten Sensitivity",
    location: "San Francisco, CA"
  },
  {
    id: 3,
    name: "Emma",
    age: 26,
    bio: "Food blogger • GF recipe creator",
    description: "I run a popular gluten-free food blog and love discovering hidden gem restaurants. Looking for someone to share culinary adventures with!",
    emoji: "📝",
    dietaryInfo: "Lifestyle Choice",
    location: "San Francisco, CA"
  },
  {
    id: 4,
    name: "Alex",
    age: 29,
    bio: "Chef specializing in GF cuisine",
    description: "Professional chef who creates amazing gluten-free dishes. I believe food should be both safe and delicious. Let's cook together!",
    emoji: "👨‍🍳",
    dietaryInfo: "Celiac Disease",
    location: "San Francisco, CA"
  },
  {
    id: 5,
    name: "Jordan",
    age: 31,
    bio: "Yoga instructor • Wellness enthusiast",
    description: "Teaching yoga and living gluten-free has transformed my life. Seeking someone who values health, mindfulness, and authentic connections.",
    emoji: "🧘‍♀️",
    dietaryInfo: "Non-Celiac Gluten Sensitivity",
    location: "San Francisco, CA"
  },
  {
    id: 6,
    name: "Taylor",
    age: 27,
    bio: "Travel blogger • Adventure seeker",
    description: "I travel the world finding the best gluten-free restaurants and hidden gems. Looking for a travel companion who shares my dietary needs!",
    emoji: "✈️",
    dietaryInfo: "Lifestyle Choice",
    location: "San Francisco, CA"
  },
  {
    id: 7,
    name: "Casey",
    age: 30,
    bio: "Software engineer • Home baker",
    description: "By day I code, by night I perfect gluten-free sourdough recipes. Love solving problems and creating delicious GF treats!",
    emoji: "💻",
    dietaryInfo: "Celiac Disease",
    location: "San Francisco, CA"
  },
  {
    id: 8,
    name: "Riley",
    age: 25,
    bio: "Artist • Creative soul",
    description: "Creating art and living gluten-free. I find beauty in simple, clean living and authentic connections. Let's create something beautiful together!",
    emoji: "🎨",
    dietaryInfo: "Dermatitis Herpetiformis",
    location: "San Francisco, CA"
  }
];

export const mockMatches: Match[] = [
  { id: 1, name: "Alex", lastMessage: "That restaurant looks amazing! 😍", time: "2m ago", emoji: "👨‍🍳" },
  { id: 2, name: "Jamie", lastMessage: "Thanks for the GF bakery recommendation!", time: "1h ago", emoji: "🧑‍🍳" },
  { id: 3, name: "Taylor", lastMessage: "How was your date at that new place?", time: "3h ago", emoji: "👩‍💼" }
];

export const mockMessages: Message[] = [
  { id: 1, sender: "Alex", message: "Hey! I saw you love that gluten-free bakery downtown. Have you tried their new sourdough?", time: "10:30 AM", isMe: false },
  { id: 2, sender: "Me", message: "Yes! It's incredible. Finally a sourdough that tastes like the real thing. Want to check out their new location together?", time: "10:35 AM", isMe: true },
  { id: 3, sender: "Alex", message: "That sounds perfect! I've been wanting to try their weekend brunch menu too.", time: "10:37 AM", isMe: false },
  { id: 4, sender: "Me", message: "Great! How about Saturday at 11 AM? I can make a reservation.", time: "10:40 AM", isMe: true },
  { id: 5, sender: "Alex", message: "Perfect! Looking forward to it 😊", time: "10:42 AM", isMe: false }
];

export const mockRestaurants = [
  {
    id: "1",
    name: "Gluten-Free Bistro",
    address: "123 Main St",
    city: "San Francisco",
    state: "CA",
    rating: 4.5,
    reviewCount: 127,
    priceLevel: 2,
    distance: 0.3,
    glutenFreeOptions: {
      hasMenu: true,
      hasDedicatedPrep: true,
      userRating: 4.8,
      safetyRating: 4.9
    },
    photos: ["https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"],
    phone: "(555) 123-4567",
    website: "https://glutenfreebistro.com"
  },
  {
    id: "2", 
    name: "Safe Haven Kitchen",
    address: "456 Oak Ave",
    city: "San Francisco",
    state: "CA",
    rating: 4.7,
    reviewCount: 89,
    priceLevel: 3,
    distance: 0.8,
    glutenFreeOptions: {
      hasMenu: true,
      hasDedicatedPrep: true,
      userRating: 4.6,
      safetyRating: 4.8
    },
    photos: ["https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"],
    phone: "(555) 987-6543"
  },
  {
    id: "3",
    name: "Celiac's Choice",
    address: "789 Pine St",
    city: "San Francisco", 
    state: "CA",
    rating: 4.3,
    reviewCount: 156,
    priceLevel: 2,
    distance: 1.2,
    glutenFreeOptions: {
      hasMenu: true,
      hasDedicatedPrep: false,
      userRating: 4.4,
      safetyRating: 4.2
    },
    photos: ["https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg"],
    phone: "(555) 456-7890",
    website: "https://celiacschoice.com"
  }
];

export const mockVerifications = [
  {
    id: "1",
    type: "photo" as const,
    status: "verified" as const,
    submittedAt: "2024-01-10T10:00:00Z",
    verifiedAt: "2024-01-10T14:30:00Z"
  },
  {
    id: "2", 
    type: "id" as const,
    status: "pending" as const,
    submittedAt: "2024-01-15T09:15:00Z"
  },
  {
    id: "3",
    type: "location" as const,
    status: "not_started" as const
  }
];
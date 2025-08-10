# API Documentation - GlutenConnect

## GraphQL API Overview

GlutenConnect uses GraphQL for all client-server communication, providing type-safe, efficient data fetching with a single endpoint.

**Endpoint:** `/graphql`  
**Playground:** `/graphql` (development only)

## Authentication

All API requests require authentication via JWT tokens in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Types
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (30 days), used to obtain new access tokens

## Schema Overview

```graphql
type Query {
  # User & Profile
  me: User
  user(id: ID!): User
  users(filters: UserFilters, pagination: Pagination): UserConnection
  
  # Matching
  potentialMatches(filters: MatchFilters): [User!]!
  matches: [Match!]!
  match(id: ID!): Match
  
  # Messaging
  conversations: [Conversation!]!
  conversation(id: ID!): Conversation
  messages(conversationId: ID!, pagination: Pagination): MessageConnection
  
  # Restaurants & Places
  restaurants(location: LocationInput, filters: RestaurantFilters): [Restaurant!]!
  restaurant(id: ID!): Restaurant
}

type Mutation {
  # Authentication
  register(input: RegisterInput!): AuthResponse!
  login(input: LoginInput!): AuthResponse!
  refreshToken(refreshToken: String!): AuthResponse!
  logout: Boolean!
  
  # Profile Management
  updateProfile(input: ProfileInput!): User!
  uploadPhoto(file: Upload!): Photo!
  deletePhoto(id: ID!): Boolean!
  
  # Matching Actions
  like(userId: ID!): MatchResult!
  pass(userId: ID!): Boolean!
  superLike(userId: ID!): MatchResult!
  unmatch(matchId: ID!): Boolean!
  
  # Messaging
  sendMessage(input: MessageInput!): Message!
  markAsRead(conversationId: ID!): Boolean!
  deleteMessage(id: ID!): Boolean!
  
  # Safety Features
  report(input: ReportInput!): Boolean!
  block(userId: ID!): Boolean!
  unblock(userId: ID!): Boolean!
}

type Subscription {
  # Real-time messaging
  messageAdded(conversationId: ID!): Message!
  messageStatusUpdated(conversationId: ID!): MessageStatus!
  
  # Match notifications
  newMatch: Match!
  
  # Typing indicators
  typingStarted(conversationId: ID!): TypingIndicator!
  typingStopped(conversationId: ID!): TypingIndicator!
}
```

## Core Types

### User & Profile Types

```graphql
type User {
  id: ID!
  email: String!
  profile: Profile!
  photos: [Photo!]!
  preferences: UserPreferences!
  subscription: Subscription
  isOnline: Boolean!
  lastSeen: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Profile {
  firstName: String!
  lastName: String!
  age: Int!
  bio: String
  location: Location!
  
  # Gluten-free specific fields
  dietaryRestrictions: [DietaryRestriction!]!
  celiacDiagnosis: Boolean!
  crossContaminationSensitivity: SensitivityLevel!
  favoriteRestaurants: [Restaurant!]!
  
  # Lifestyle
  interests: [Interest!]!
  lifestyle: Lifestyle!
  height: Int
  education: Education
  occupation: String
  
  # Verification
  isVerified: Boolean!
  verificationMethods: [VerificationType!]!
}

enum DietaryRestriction {
  CELIAC_DISEASE
  NON_CELIAC_GLUTEN_SENSITIVITY
  LIFESTYLE_CHOICE
  WHEAT_ALLERGY
  DERMATITIS_HERPETIFORMIS
}

enum SensitivityLevel {
  EXTREMELY_SENSITIVE  # Dedicated GF facilities only
  HIGHLY_SENSITIVE     # Certified GF restaurants
  MODERATELY_SENSITIVE # GF menu items with precautions
  LOW_SENSITIVITY      # Basic GF options acceptable
}
```

### Matching Types

```graphql
type Match {
  id: ID!
  users: [User!]!
  matchedAt: DateTime!
  compatibility: CompatibilityScore!
  conversation: Conversation
  isActive: Boolean!
}

type CompatibilityScore {
  overall: Float! # 0.0 - 1.0
  dietary: Float!
  lifestyle: Float!
  location: Float!
  interests: Float!
  restaurantPreferences: Float!
}

enum MatchResult {
  MATCH        # Mutual like - match created
  LIKE         # Like sent, waiting for response  
  SUPER_MATCH  # Mutual super like
  NO_MATCH     # Like sent but not matched yet
}
```

### Messaging Types

```graphql
type Conversation {
  id: ID!
  participants: [User!]!
  messages: [Message!]!
  lastMessage: Message
  unreadCount: Int!
  isActive: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Message {
  id: ID!
  conversation: Conversation!
  sender: User!
  content: String!
  type: MessageType!
  status: MessageStatus!
  attachments: [Attachment!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum MessageType {
  TEXT
  IMAGE
  LOCATION
  RESTAURANT_RECOMMENDATION
  SAFETY_CHECK_IN
}

enum MessageStatus {
  SENT
  DELIVERED
  READ
  FAILED
}
```

### Restaurant Integration

```graphql
type Restaurant {
  id: ID!
  name: String!
  location: Location!
  glutenFreeOptions: GlutenFreeInfo!
  photos: [String!]!
  rating: Float!
  reviewCount: Int!
  priceLevel: PriceLevel!
  cuisine: [Cuisine!]!
  hours: [BusinessHours!]!
  contact: ContactInfo!
}

type GlutenFreeInfo {
  hasDedicatedMenu: Boolean!
  hasGlutenFreeKitchen: Boolean!
  certifications: [Certification!]!
  crossContaminationPrevention: CrossContaminationLevel!
  userRating: Float! # Community rating for GF options
  userReviewCount: Int!
}

enum CrossContaminationLevel {
  DEDICATED_FACILITY    # 100% gluten-free facility
  DEDICATED_PREP_AREA   # Separate prep area
  CAREFUL_PROTOCOLS     # Careful handling protocols
  BASIC_PRECAUTIONS     # Basic precautions taken
  UNKNOWN               # No information available
}
```

## Query Examples

### Get Current User Profile

```graphql
query GetCurrentUser {
  me {
    id
    email
    profile {
      firstName
      lastName
      age
      bio
      location {
        city
        state
        country
      }
      dietaryRestrictions
      celiacDiagnosis
      crossContaminationSensitivity
      interests {
        name
        category
      }
    }
    photos {
      id
      url
      isMain
    }
    preferences {
      ageRange {
        min
        max
      }
      maxDistance
      dietaryCompatibility
    }
  }
}
```

### Get Potential Matches

```graphql
query GetPotentialMatches($filters: MatchFilters) {
  potentialMatches(filters: $filters) {
    id
    profile {
      firstName
      age
      bio
      location {
        city
        state
      }
      dietaryRestrictions
      crossContaminationSensitivity
      interests {
        name
      }
    }
    photos(limit: 5) {
      id
      url
      isMain
    }
  }
}
```

### Get Conversations with Messages

```graphql
query GetConversations {
  conversations {
    id
    participants {
      id
      profile {
        firstName
      }
      photos(limit: 1) {
        url
      }
    }
    lastMessage {
      content
      type
      createdAt
      sender {
        id
      }
    }
    unreadCount
    updatedAt
  }
}
```

### Find Gluten-Free Restaurants

```graphql
query FindRestaurants($location: LocationInput!, $filters: RestaurantFilters) {
  restaurants(location: $location, filters: $filters) {
    id
    name
    location {
      address
      city
      latitude
      longitude
    }
    glutenFreeOptions {
      hasDedicatedMenu
      hasGlutenFreeKitchen
      crossContaminationPrevention
      userRating
      certifications {
        name
        issuedBy
      }
    }
    photos
    rating
    priceLevel
    cuisine
  }
}
```

## Mutation Examples

### User Registration

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    success
    user {
      id
      email
      profile {
        firstName
        lastName
      }
    }
    tokens {
      accessToken
      refreshToken
    }
    message
  }
}
```

**Variables:**
```json
{
  "input": {
    "email": "user@example.com",
    "password": "securePassword123!",
    "profile": {
      "firstName": "Jane",
      "lastName": "Doe",
      "age": 28,
      "location": {
        "city": "San Francisco",
        "state": "CA",
        "country": "US",
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "dietaryRestrictions": ["CELIAC_DISEASE"],
      "celiacDiagnosis": true,
      "crossContaminationSensitivity": "HIGHLY_SENSITIVE"
    }
  }
}
```

### Send a Like

```graphql
mutation SendLike($userId: ID!) {
  like(userId: $userId) {
    result # MATCH, LIKE, SUPER_MATCH, NO_MATCH
    match {
      id
      users {
        id
        profile {
          firstName
        }
      }
      compatibility {
        overall
        dietary
      }
      matchedAt
    }
  }
}
```

### Send Message

```graphql
mutation SendMessage($input: MessageInput!) {
  sendMessage(input: $input) {
    id
    content
    type
    status
    createdAt
    sender {
      id
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "conversationId": "conv_123",
    "content": "Hey! I saw you love that gluten-free bakery downtown. Have you tried their new sourdough?",
    "type": "TEXT"
  }
}
```

### Restaurant Recommendation

```graphql
mutation RecommendRestaurant($input: MessageInput!) {
  sendMessage(input: $input) {
    id
    content
    type
    attachments {
      ... on RestaurantAttachment {
        restaurant {
          id
          name
          glutenFreeOptions {
            hasDedicatedMenu
            userRating
          }
          location {
            address
          }
        }
      }
    }
    createdAt
  }
}
```

## Subscription Examples

### Real-time Messages

```graphql
subscription MessageAdded($conversationId: ID!) {
  messageAdded(conversationId: $conversationId) {
    id
    content
    type
    sender {
      id
      profile {
        firstName
      }
    }
    createdAt
  }
}
```

### New Match Notifications

```graphql
subscription NewMatches {
  newMatch {
    id
    users {
      id
      profile {
        firstName
      }
      photos(limit: 1) {
        url
      }
    }
    compatibility {
      overall
      dietary
    }
    matchedAt
  }
}
```

## Error Handling

GraphQL errors follow this structure:

```json
{
  "errors": [
    {
      "message": "User not found",
      "locations": [{"line": 2, "column": 3}],
      "path": ["user"],
      "extensions": {
        "code": "USER_NOT_FOUND",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    }
  ],
  "data": null
}
```

### Common Error Codes

- `UNAUTHENTICATED`: Invalid or missing authentication token
- `FORBIDDEN`: Insufficient permissions for the requested operation
- `NOT_FOUND`: Requested resource doesn't exist
- `VALIDATION_ERROR`: Input validation failed
- `RATE_LIMITED`: Too many requests from this client
- `INTERNAL_ERROR`: Server-side error occurred

## Rate Limiting

API endpoints have different rate limits based on operation type:

| Operation Type | Rate Limit | Window |
|---|---|---|
| Authentication | 5 requests | 1 minute |
| Matching Actions | 100 requests | 1 hour |
| Messaging | 200 messages | 1 hour |
| Profile Updates | 10 requests | 1 minute |
| File Uploads | 20 uploads | 1 hour |

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

## Pagination

List queries use cursor-based pagination:

```graphql
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

**Usage:**
```graphql
query GetUsers($first: Int, $after: String) {
  users(first: $first, after: $after) {
    edges {
      node {
        id
        profile {
          firstName
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## File Uploads

File uploads use the GraphQL multipart request specification:

```graphql
mutation UploadPhoto($file: Upload!) {
  uploadPhoto(file: $file) {
    id
    url
    thumbnailUrl
    isMain
  }
}
```

**Supported formats:** JPG, PNG, WebP  
**Maximum size:** 10MB per file  
**Processing:** Automatic resizing and optimization

This API documentation provides comprehensive coverage of all available operations in the GlutenConnect platform.
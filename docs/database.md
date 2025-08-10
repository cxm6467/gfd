# Database Schema Documentation - GlutenConnect

## Overview

GlutenConnect uses PostgreSQL as the primary database with Prisma ORM for type-safe database operations. The schema is designed to support gluten-free specific features while maintaining scalability and performance.

## Database Architecture

### Core Principles
- **Data Integrity**: Foreign key constraints and validation rules
- **Performance**: Proper indexing and query optimization
- **Scalability**: Partitioning strategies for large tables
- **Security**: Row-level security and data encryption
- **GDPR Compliance**: Soft deletes and data retention policies

### Connection Strategy
- **Primary Database**: Read/write operations
- **Read Replicas**: Query optimization for heavy read operations
- **Connection Pooling**: Efficient connection management
- **Failover**: Automatic failover to read replicas if needed

## Schema Overview

```prisma
// TODO: Create comprehensive Prisma schema
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String             @id @default(cuid())
  email             String             @unique
  emailVerified     Boolean            @default(false)
  phoneNumber       String?            @unique
  phoneVerified     Boolean            @default(false)
  passwordHash      String?            // Nullable for social login only users
  
  // Profile Information
  profile           Profile?
  photos            Photo[]
  preferences       UserPreferences?
  subscription      Subscription?
  
  // Authentication & Security
  authProviders     AuthProvider[]
  sessions          Session[]
  twoFactorEnabled  Boolean            @default(false)
  twoFactorSecret   String?            @db.Text // Encrypted
  
  // Activity & Status
  isOnline          Boolean            @default(false)
  lastSeen          DateTime?
  location          Location?
  
  // Matching & Interactions
  sentLikes         Like[]             @relation("LikeSender")
  receivedLikes     Like[]             @relation("LikeReceiver")
  matches           Match[]            @relation("MatchUsers")
  conversations     Conversation[]     @relation("ConversationParticipants")
  
  // Safety & Moderation
  reports           Report[]           @relation("ReportReporter")
  reportedBy        Report[]           @relation("ReportReported")
  blocks            Block[]            @relation("BlockBlocker")
  blockedBy         Block[]            @relation("BlockBlocked")
  
  // Metadata
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  deletedAt         DateTime?          // Soft delete for GDPR
  
  @@map("users")
}

model Profile {
  id                    String                 @id @default(cuid())
  userId                String                 @unique
  user                  User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Basic Information
  firstName             String                 @db.VarChar(50)
  lastName              String                 @db.VarChar(50)
  displayName           String?                @db.VarChar(100)
  dateOfBirth           DateTime
  gender                Gender
  bio                   String?                @db.Text
  
  // Location
  locationId            String?
  location              Location?              @relation(fields: [locationId], references: [id])
  
  // Physical Attributes
  height                Int?                   // in centimeters
  bodyType              BodyType?
  ethnicity             Ethnicity[]
  
  // Lifestyle & Background
  education             EducationLevel?
  occupation            String?                @db.VarChar(100)
  company               String?                @db.VarChar(100)
  religion              Religion?
  politicalViews        PoliticalViews?
  smokingStatus         SmokingStatus?
  drinkingStatus        DrinkingStatus?
  
  // Gluten-Free Specific Fields
  dietaryRestrictions   DietaryRestriction[]
  celiacDiagnosis       Boolean                @default(false)
  diagnosisYear         Int?
  crossContaminationSensitivity SensitivityLevel @default(MODERATELY_SENSITIVE)
  
  // Interests & Preferences
  interests             Interest[]
  hobbies               String[]               @default([])
  favoriteRestaurants   Restaurant[]           @relation("UserFavoriteRestaurants")
  
  // Verification
  isVerified            Boolean                @default(false)
  verificationMethods   VerificationType[]     @default([])
  idVerificationStatus  VerificationStatus     @default(UNVERIFIED)
  photoVerificationStatus VerificationStatus   @default(UNVERIFIED)
  
  // Preferences
  lookingFor            RelationshipType[]     @default([])
  hasChildren           Boolean?
  wantsChildren         Boolean?
  petPreference         PetPreference?
  
  // Metadata
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt
  
  @@map("profiles")
}

model Photo {
  id          String         @id @default(cuid())
  userId      String
  user        User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Image Details
  url         String         @db.Text
  thumbnailUrl String?       @db.Text
  originalUrl String?        @db.Text
  
  // Metadata
  isMain      Boolean        @default(false)
  order       Int            @default(0)
  width       Int?
  height      Int?
  fileSize    Int?           // in bytes
  mimeType    String?        @db.VarChar(50)
  
  // Verification & Moderation
  isVerified  Boolean        @default(false)
  moderationStatus ModerationType @default(PENDING)
  moderationNotes  String?   @db.Text
  
  // AI Analysis (optional)
  aiTags      String[]       @default([])
  faceDetected Boolean?
  
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  @@map("photos")
}

// Matching System
model Like {
  id          String         @id @default(cuid())
  senderId    String
  receiverId  String
  sender      User           @relation("LikeSender", fields: [senderId], references: [id], onDelete: Cascade)
  receiver    User           @relation("LikeReceiver", fields: [receiverId], references: [id], onDelete: Cascade)
  
  type        LikeType       @default(REGULAR)
  message     String?        @db.Text
  
  createdAt   DateTime       @default(now())
  
  @@unique([senderId, receiverId])
  @@map("likes")
}

model Match {
  id              String         @id @default(cuid())
  users           User[]         @relation("MatchUsers")
  
  // Match Details
  matchedAt       DateTime       @default(now())
  compatibility   Float?         // 0.0 to 1.0
  compatibilityBreakdown Json?   // Detailed compatibility scores
  
  // Relationship Status
  isActive        Boolean        @default(true)
  conversation    Conversation?
  
  // Analytics
  viewCount       Int            @default(0)
  lastInteraction DateTime?
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  @@map("matches")
}

// Messaging System
model Conversation {
  id            String         @id @default(cuid())
  matchId       String         @unique
  match         Match          @relation(fields: [matchId], references: [id], onDelete: Cascade)
  
  participants  User[]         @relation("ConversationParticipants")
  messages      Message[]
  
  // Conversation State
  isActive      Boolean        @default(true)
  lastMessage   Message?       @relation("LastMessage")
  
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  
  @@map("conversations")
}

model Message {
  id              String         @id @default(cuid())
  conversationId  String
  conversation    Conversation   @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  senderId        String
  sender          User           @relation(fields: [senderId], references: [id], onDelete: Cascade)
  
  // Message Content
  content         String         @db.Text // Encrypted
  type            MessageType    @default(TEXT)
  attachments     Json?          // Store attachment metadata
  
  // Message Status
  status          MessageStatus  @default(SENT)
  readBy          Json?          // Track read status per participant
  readAt          DateTime?
  
  // Safety & Moderation
  isModerated     Boolean        @default(false)
  moderationFlags String[]       @default([])
  
  // Metadata
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  deletedAt       DateTime?      // Soft delete
  
  // Relations
  lastMessageIn   Conversation[] @relation("LastMessage")
  
  @@map("messages")
}

// Location & Geography
model Location {
  id          String         @id @default(cuid())
  
  // Address Components
  address     String?        @db.VarChar(255)
  city        String         @db.VarChar(100)
  state       String?        @db.VarChar(100)
  country     String         @db.VarChar(100)
  postalCode  String?        @db.VarChar(20)
  
  // Coordinates
  latitude    Float
  longitude   Float
  
  // Metadata
  timeZone    String?        @db.VarChar(50)
  
  // Relations
  users       User[]
  profiles    Profile[]
  restaurants Restaurant[]
  
  @@index([latitude, longitude])
  @@map("locations")
}

// Restaurant Integration
model Restaurant {
  id                    String                @id @default(cuid())
  
  // Basic Information
  name                  String                @db.VarChar(255)
  description           String?               @db.Text
  website               String?               @db.VarChar(255)
  phoneNumber           String?               @db.VarChar(50)
  
  // Location
  locationId            String
  location              Location              @relation(fields: [locationId], references: [id])
  
  // Cuisine & Dining
  cuisineTypes          CuisineType[]
  priceLevel            PriceLevel            @default(MODERATE)
  serviceTypes          ServiceType[]         @default([DINE_IN])
  
  // Gluten-Free Information
  glutenFreeInfo        GlutenFreeInfo?
  
  // External Integration
  googlePlaceId         String?               @unique @db.VarChar(255)
  yelpBusinessId        String?               @unique @db.VarChar(255)
  
  // User Relations
  favoritedBy           Profile[]             @relation("UserFavoriteRestaurants")
  reviews               RestaurantReview[]
  
  // Status & Metadata
  isActive              Boolean               @default(true)
  verificationStatus    VerificationStatus    @default(UNVERIFIED)
  
  createdAt             DateTime              @default(now())
  updatedAt             DateTime              @updatedAt
  
  @@index([googlePlaceId])
  @@index([locationId])
  @@map("restaurants")
}

model GlutenFreeInfo {
  id                        String                    @id @default(cuid())
  restaurantId              String                    @unique
  restaurant                Restaurant                @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  
  // Gluten-Free Capabilities
  hasDedicatedMenu          Boolean                   @default(false)
  hasGlutenFreeKitchen      Boolean                   @default(false)
  hasTrainedStaff           Boolean                   @default(false)
  
  // Cross-Contamination Prevention
  crossContaminationLevel   CrossContaminationLevel   @default(BASIC_PRECAUTIONS)
  separatePreparationArea   Boolean                   @default(false)
  dedicatedEquipment        Boolean                   @default(false)
  
  // Certifications
  certifications            Certification[]
  
  // User Ratings (Community-driven)
  glutenFreeRating          Float?                    // Average GF-specific rating
  glutenFreeReviewCount     Int                       @default(0)
  safetyRating              Float?                    // Safety rating for sensitive individuals
  
  // Menu Information
  glutenFreeOptions         String[]                  @default([])
  menuDescription           String?                   @db.Text
  specialNotes              String?                   @db.Text
  
  updatedAt                 DateTime                  @updatedAt
  
  @@map("gluten_free_info")
}

// User Preferences
model UserPreferences {
  id              String         @id @default(cuid())
  userId          String         @unique
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Matching Preferences
  ageRangeMin     Int            @default(18)
  ageRangeMax     Int            @default(99)
  maxDistance     Int            @default(50) // in kilometers
  genderPreference Gender[]      @default([])
  
  // Dietary Compatibility
  dietaryCompatibility DietaryCompatibilityLevel @default(SAME_RESTRICTIONS)
  requiresCeliacMatch     Boolean @default(false)
  sensitivityTolerance    SensitivityLevel @default(MODERATELY_SENSITIVE)
  
  // Lifestyle Preferences
  educationImportance     ImportanceLevel @default(SOMEWHAT_IMPORTANT)
  religionImportance      ImportanceLevel @default(NOT_IMPORTANT)
  smokingTolerance        SmokingTolerance @default(NO_PREFERENCE)
  drinkingTolerance       DrinkingTolerance @default(NO_PREFERENCE)
  
  // Dating Preferences
  relationshipTypes       RelationshipType[] @default([LONG_TERM])
  childrenTolerance       ChildrenTolerance @default(NO_PREFERENCE)
  petTolerance           PetTolerance @default(NO_PREFERENCE)
  
  // App Preferences
  showOnlineStatus        Boolean @default(true)
  allowLocationSharing    Boolean @default(true)
  emailNotifications      Boolean @default(true)
  pushNotifications       Boolean @default(true)
  
  updatedAt               DateTime @updatedAt
  
  @@map("user_preferences")
}

// Subscription & Payments
model Subscription {
  id                String             @id @default(cuid())
  userId            String             @unique
  user              User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Subscription Details
  tier              SubscriptionTier
  status            SubscriptionStatus @default(ACTIVE)
  
  // Billing
  stripeCustomerId      String?        @unique @db.VarChar(255)
  stripeSubscriptionId  String?        @unique @db.VarChar(255)
  currentPeriodStart    DateTime?
  currentPeriodEnd      DateTime?
  canceledAt            DateTime?
  cancelAtPeriodEnd     Boolean        @default(false)
  
  // Usage Tracking
  featuresUsed          Json?          // Track premium feature usage
  
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  
  @@map("subscriptions")
}

// Safety & Moderation
model Report {
  id            String         @id @default(cuid())
  reporterId    String
  reportedId    String
  reporter      User           @relation("ReportReporter", fields: [reporterId], references: [id])
  reported      User           @relation("ReportReported", fields: [reportedId], references: [id])
  
  // Report Details
  type          ReportType
  reason        String         @db.Text
  description   String?        @db.Text
  evidence      Json?          // Screenshots, message IDs, etc.
  
  // Status & Resolution
  status        ReportStatus   @default(PENDING)
  resolution    String?        @db.Text
  moderatorId   String?
  resolvedAt    DateTime?
  
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  
  @@map("reports")
}

model Block {
  id         String    @id @default(cuid())
  blockerId  String
  blockedId  String
  blocker    User      @relation("BlockBlocker", fields: [blockerId], references: [id])
  blocked    User      @relation("BlockBlocked", fields: [blockedId], references: [id])
  
  reason     String?   @db.Text
  createdAt  DateTime  @default(now())
  
  @@unique([blockerId, blockedId])
  @@map("blocks")
}

// Enums
enum Gender {
  MALE
  FEMALE
  NON_BINARY
  OTHER
  PREFER_NOT_TO_SAY
}

enum DietaryRestriction {
  CELIAC_DISEASE
  NON_CELIAC_GLUTEN_SENSITIVITY
  WHEAT_ALLERGY
  DERMATITIS_HERPETIFORMIS
  LIFESTYLE_CHOICE
}

enum SensitivityLevel {
  EXTREMELY_SENSITIVE    // Dedicated GF facilities only
  HIGHLY_SENSITIVE       // Certified GF with strict protocols
  MODERATELY_SENSITIVE   // GF menu items with precautions
  LOW_SENSITIVITY        // Basic GF options acceptable
}

enum CrossContaminationLevel {
  DEDICATED_FACILITY     // 100% gluten-free facility
  DEDICATED_PREP_AREA    // Separate prep area and equipment
  CAREFUL_PROTOCOLS      // Careful handling with some precautions
  BASIC_PRECAUTIONS      // Basic precautions taken
  UNKNOWN                // No information available
}

enum LikeType {
  REGULAR
  SUPER_LIKE
  BOOST
}

enum MessageType {
  TEXT
  IMAGE
  LOCATION
  RESTAURANT_RECOMMENDATION
  SAFETY_CHECK_IN
  SYSTEM
}

enum MessageStatus {
  SENT
  DELIVERED
  READ
  FAILED
}

enum SubscriptionTier {
  FREE
  GLUTEN_PLUS      // $9.99/month
  GLUTEN_PREMIUM   // $19.99/month
  GLUTEN_GOLD      // $29.99/month
}

// Additional enums...
enum VerificationStatus {
  UNVERIFIED
  PENDING
  VERIFIED
  REJECTED
}

enum ReportType {
  INAPPROPRIATE_CONTENT
  HARASSMENT
  FAKE_PROFILE
  SPAM
  SAFETY_CONCERN
  OTHER
}

enum ReportStatus {
  PENDING
  UNDER_REVIEW
  RESOLVED
  DISMISSED
}
```

## Indexing Strategy

### Primary Indexes
```sql
-- TODO: Optimize database indexes for performance

-- User lookup and authentication
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_users_phone_number ON users(phone_number);
CREATE INDEX CONCURRENTLY idx_users_last_seen ON users(last_seen) WHERE deleted_at IS NULL;

-- Matching algorithm optimization
CREATE INDEX CONCURRENTLY idx_profiles_age_location ON profiles(
  EXTRACT(YEAR FROM AGE(date_of_birth)), 
  location_id
) WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY idx_profiles_dietary ON profiles 
USING GIN (dietary_restrictions) 
WHERE deleted_at IS NULL;

-- Location-based queries
CREATE INDEX CONCURRENTLY idx_locations_coordinates ON locations 
USING GIST (point(longitude, latitude));

-- Message history and conversations
CREATE INDEX CONCURRENTLY idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_messages_sender_status ON messages(sender_id, status);

-- Restaurant discovery
CREATE INDEX CONCURRENTLY idx_restaurants_location_active ON restaurants(location_id, is_active);
CREATE INDEX CONCURRENTLY idx_restaurants_gluten_free ON restaurants(id) 
WHERE id IN (SELECT restaurant_id FROM gluten_free_info);
```

### Composite Indexes
```sql
-- TODO: Create composite indexes for complex queries

-- Matching queries with multiple filters
CREATE INDEX CONCURRENTLY idx_profiles_matching ON profiles(
  location_id,
  EXTRACT(YEAR FROM AGE(date_of_birth)),
  gender,
  is_verified
) WHERE deleted_at IS NULL;

-- Message search and filtering
CREATE INDEX CONCURRENTLY idx_messages_search ON messages(
  conversation_id,
  type,
  created_at DESC,
  status
) WHERE deleted_at IS NULL;

-- Subscription and payment tracking
CREATE INDEX CONCURRENTLY idx_subscriptions_status_period ON subscriptions(
  status,
  current_period_end
) WHERE status = 'ACTIVE';
```

## Database Functions

### Distance Calculation
```sql
-- TODO: Implement PostGIS functions for location queries

CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 FLOAT,
  lon1 FLOAT,
  lat2 FLOAT,
  lon2 FLOAT
) RETURNS FLOAT AS $$
BEGIN
  RETURN (
    6371 * acos(
      cos(radians(lat1)) * cos(radians(lat2)) * 
      cos(radians(lon2) - radians(lon1)) + 
      sin(radians(lat1)) * sin(radians(lat2))
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### Compatibility Scoring
```sql
-- TODO: Create compatibility scoring function

CREATE OR REPLACE FUNCTION calculate_compatibility(
  user1_id UUID,
  user2_id UUID
) RETURNS JSON AS $$
DECLARE
  dietary_score FLOAT;
  location_score FLOAT;
  lifestyle_score FLOAT;
  overall_score FLOAT;
BEGIN
  -- Calculate dietary compatibility (40% weight)
  SELECT calculate_dietary_compatibility(user1_id, user2_id) INTO dietary_score;
  
  -- Calculate location compatibility (30% weight)
  SELECT calculate_location_compatibility(user1_id, user2_id) INTO location_score;
  
  -- Calculate lifestyle compatibility (30% weight)
  SELECT calculate_lifestyle_compatibility(user1_id, user2_id) INTO lifestyle_score;
  
  -- Calculate weighted overall score
  overall_score := (dietary_score * 0.4) + (location_score * 0.3) + (lifestyle_score * 0.3);
  
  RETURN json_build_object(
    'overall', overall_score,
    'dietary', dietary_score,
    'location', location_score,
    'lifestyle', lifestyle_score
  );
END;
$$ LANGUAGE plpgsql;
```

## Row Level Security (RLS)

### User Data Protection
```sql
-- TODO: Implement comprehensive RLS policies

-- Users can only access their own data
CREATE POLICY user_own_data ON users 
FOR ALL TO authenticated 
USING (id = auth.uid());

-- Profile visibility based on matching preferences
CREATE POLICY profile_visibility ON profiles 
FOR SELECT TO authenticated 
USING (
  user_id = auth.uid() OR 
  user_id IN (
    SELECT id FROM get_potential_matches(auth.uid())
  )
);

-- Messages only visible to conversation participants
CREATE POLICY message_participants ON messages 
FOR ALL TO authenticated 
USING (
  sender_id = auth.uid() OR 
  conversation_id IN (
    SELECT c.id FROM conversations c 
    JOIN match m ON c.match_id = m.id 
    WHERE auth.uid() = ANY(
      SELECT user_id FROM match_users WHERE match_id = m.id
    )
  )
);

-- Restaurant data is publicly readable
CREATE POLICY restaurant_public_read ON restaurants 
FOR SELECT TO authenticated 
USING (is_active = true);
```

### Data Audit Trail
```sql
-- TODO: Create audit logging system

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (table_name, record_id, operation, old_data, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (table_name, record_id, operation, old_data, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, record_id, operation, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Data Retention & Cleanup

### Automated Cleanup Jobs
```sql
-- TODO: Implement data retention policies

-- Clean up old sessions (older than 30 days)
DELETE FROM sessions 
WHERE expires_at < NOW() - INTERVAL '30 days';

-- Soft delete inactive users (no activity for 2 years)
UPDATE users 
SET deleted_at = NOW() 
WHERE last_seen < NOW() - INTERVAL '2 years' 
AND deleted_at IS NULL;

-- Hard delete user data after soft delete grace period (90 days)
DELETE FROM users 
WHERE deleted_at < NOW() - INTERVAL '90 days';

-- Clean up expired password reset tokens
DELETE FROM password_reset_tokens 
WHERE expires_at < NOW();

-- Archive old messages (configurable per user, default 1 year)
WITH old_messages AS (
  SELECT m.id 
  FROM messages m
  JOIN conversations c ON m.conversation_id = c.id
  WHERE m.created_at < NOW() - INTERVAL '1 year'
  AND NOT EXISTS (
    SELECT 1 FROM user_preferences up 
    WHERE up.user_id IN (
      SELECT user_id FROM match_users WHERE match_id = c.match_id
    ) AND up.message_retention_days IS NOT NULL
  )
)
UPDATE messages 
SET deleted_at = NOW() 
WHERE id IN (SELECT id FROM old_messages);
```

### GDPR Compliance
```sql
-- TODO: Implement GDPR data export and deletion

-- Function to export all user data
CREATE OR REPLACE FUNCTION export_user_data(target_user_id UUID) 
RETURNS JSON AS $$
DECLARE
  user_data JSON;
BEGIN
  SELECT json_build_object(
    'user', row_to_json(u),
    'profile', row_to_json(p),
    'photos', json_agg(DISTINCT ph),
    'preferences', row_to_json(up),
    'messages', json_agg(DISTINCT m),
    'matches', json_agg(DISTINCT mt),
    'subscription', row_to_json(s)
  ) INTO user_data
  FROM users u
  LEFT JOIN profiles p ON u.id = p.user_id
  LEFT JOIN photos ph ON u.id = ph.user_id
  LEFT JOIN user_preferences up ON u.id = up.user_id
  LEFT JOIN messages m ON u.id = m.sender_id
  LEFT JOIN matches mt ON u.id = ANY(SELECT unnest(mt.user_ids))
  LEFT JOIN subscriptions s ON u.id = s.user_id
  WHERE u.id = target_user_id;
  
  RETURN user_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to completely delete user data
CREATE OR REPLACE FUNCTION delete_user_data(target_user_id UUID) 
RETURNS BOOLEAN AS $$
BEGIN
  -- Delete in reverse dependency order
  DELETE FROM audit_log WHERE user_id = target_user_id;
  DELETE FROM reports WHERE reporter_id = target_user_id OR reported_id = target_user_id;
  DELETE FROM blocks WHERE blocker_id = target_user_id OR blocked_id = target_user_id;
  DELETE FROM messages WHERE sender_id = target_user_id;
  DELETE FROM likes WHERE sender_id = target_user_id OR receiver_id = target_user_id;
  DELETE FROM subscriptions WHERE user_id = target_user_id;
  DELETE FROM user_preferences WHERE user_id = target_user_id;
  DELETE FROM photos WHERE user_id = target_user_id;
  DELETE FROM profiles WHERE user_id = target_user_id;
  DELETE FROM sessions WHERE user_id = target_user_id;
  DELETE FROM auth_providers WHERE user_id = target_user_id;
  DELETE FROM users WHERE id = target_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Performance Optimization

### Partitioning Strategy
```sql
-- TODO: Implement table partitioning for large tables

-- Partition messages by month for better performance
CREATE TABLE messages (
  -- columns...
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE messages_2024_01 PARTITION OF messages
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE messages_2024_02 PARTITION OF messages  
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Automatic partition management
CREATE OR REPLACE FUNCTION create_monthly_partitions() RETURNS void AS $$
DECLARE
  start_date DATE;
  end_date DATE;
  table_name TEXT;
BEGIN
  start_date := date_trunc('month', CURRENT_DATE);
  
  FOR i IN 0..11 LOOP
    end_date := start_date + INTERVAL '1 month';
    table_name := 'messages_' || to_char(start_date, 'YYYY_MM');
    
    EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF messages 
                    FOR VALUES FROM (%L) TO (%L)',
                   table_name, start_date, end_date);
    
    start_date := end_date;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### Query Optimization
```sql
-- TODO: Create materialized views for expensive queries

-- Materialized view for user statistics
CREATE MATERIALIZED VIEW user_stats AS
SELECT 
  u.id,
  COUNT(DISTINCT l.id) as likes_received,
  COUNT(DISTINCT m.id) as matches_count,
  COUNT(DISTINCT msg.id) as messages_sent,
  AVG(r.rating) as average_rating
FROM users u
LEFT JOIN likes l ON u.id = l.receiver_id
LEFT JOIN matches m ON u.id = ANY(m.user_ids)
LEFT JOIN messages msg ON u.id = msg.sender_id
LEFT JOIN reviews r ON u.id = r.reviewed_user_id
WHERE u.deleted_at IS NULL
GROUP BY u.id;

-- Refresh strategy
CREATE OR REPLACE FUNCTION refresh_user_stats() RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh every hour
SELECT cron.schedule('refresh-user-stats', '0 * * * *', 'SELECT refresh_user_stats()');
```

## Backup and Recovery

### Backup Strategy
```sql
-- TODO: Implement comprehensive backup strategy

-- Point-in-time recovery setup
-- Enable WAL archiving in postgresql.conf
-- archive_mode = on
-- archive_command = 'cp %p /backup/archive/%f'
-- wal_level = replica

-- Daily full backup script
#!/bin/bash
BACKUP_DIR="/backup/daily"
DATE=$(date +%Y%m%d)
pg_dump -h localhost -U backup_user -d glutenconnect \
  --format=custom --compress=9 \
  --file="${BACKUP_DIR}/glutenconnect_${DATE}.dump"

# Verify backup integrity
pg_restore --list "${BACKUP_DIR}/glutenconnect_${DATE}.dump" > /dev/null

if [ $? -eq 0 ]; then
  echo "Backup completed successfully: glutenconnect_${DATE}.dump"
else
  echo "Backup verification failed!" >&2
  exit 1
fi
```

This database schema provides a robust foundation for GlutenConnect with proper indexing, security, and performance optimizations specifically designed for the gluten-free dating use case.
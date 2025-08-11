-- GF'd Database Schema (Stubbed)
-- TODO: Implement full schema from docs/database.md

-- This file contains the complete database schema design
-- Currently stubbed - implement tables as needed

-- Example of what will be implemented:
/*
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_ids UUID[] NOT NULL,
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  compatibility_score FLOAT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL, -- Will be encrypted
  message_type VARCHAR(50) DEFAULT 'TEXT',
  status VARCHAR(50) DEFAULT 'SENT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  gluten_free_rating FLOAT,
  has_dedicated_prep BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
*/

-- TODO: Implement all tables from the database documentation
-- TODO: Add proper constraints and relationships
-- TODO: Add RLS policies for security
-- TODO: Add performance indexes
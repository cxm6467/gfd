-- GF'd Dating App - Database Initialization Script
-- This script sets up the initial database structure for local development

-- Create database extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Create initial tables (basic structure)
-- Full schema will be managed by Prisma migrations

-- Users table (basic structure)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_number VARCHAR(50),
    phone_verified BOOLEAN DEFAULT FALSE,
    password_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Profiles table (basic structure)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    bio TEXT,
    dietary_restrictions TEXT[] DEFAULT '{}',
    celiac_diagnosis BOOLEAN DEFAULT FALSE,
    cross_contamination_sensitivity VARCHAR(50) DEFAULT 'MODERATELY_SENSITIVE',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_dietary ON profiles USING GIN (dietary_restrictions);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development
INSERT INTO users (id, email, email_verified) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'test@gfd.local', true),
    ('550e8400-e29b-41d4-a716-446655440001', 'demo@gfd.local', true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (user_id, first_name, last_name, date_of_birth, bio, dietary_restrictions, celiac_diagnosis) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Test', 'User', '1990-01-01', 'Test user for development', '{"CELIAC_DISEASE"}', true),
    ('550e8400-e29b-41d4-a716-446655440001', 'Demo', 'User', '1985-06-15', 'Demo user for testing', '{"LIFESTYLE_CHOICE"}', false)
ON CONFLICT (user_id) DO NOTHING;
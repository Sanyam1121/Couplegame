/*
  # Create game sessions schema

  1. New Tables
    - `game_sessions`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `game_type` (text)
      - `player1_id` (uuid)
      - `player2_id` (uuid)
      - `current_state` (jsonb)
      - `is_active` (boolean)
    
  2. Security
    - Enable RLS on `game_sessions` table
    - Add policies for authenticated users to:
      - Read sessions they are part of
      - Update sessions they are part of
      - Create new sessions
*/

CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  game_type text NOT NULL,
  player1_id uuid REFERENCES auth.users(id),
  player2_id uuid REFERENCES auth.users(id),
  current_state jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  last_updated timestamptz DEFAULT now()
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Allow users to read sessions they are part of
CREATE POLICY "Users can read their game sessions"
  ON game_sessions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = player1_id OR 
    auth.uid() = player2_id
  );

-- Allow users to update sessions they are part of
CREATE POLICY "Users can update their game sessions"
  ON game_sessions
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = player1_id OR 
    auth.uid() = player2_id
  );

-- Allow users to create new sessions
CREATE POLICY "Users can create game sessions"
  ON game_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = player1_id);
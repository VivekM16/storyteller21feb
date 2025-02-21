/*
  # Story Generation System Tables

  1. New Tables
    - `story_prompts`
      - `id` (uuid, primary key)
      - `age_group` (text)
      - `theme` (text)
      - `writing_style` (text)
      - `characters` (text)
      - `season` (text)
      - `story_length` (text)
      - `custom_preferences` (text)
      - `status` (text)
      - `created_at` (timestamp)
    
    - `stories`
      - `id` (uuid, primary key)
      - `prompt_id` (uuid, foreign key)
      - `title` (text)
      - `content` (text)
      - `preview` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to create stories
*/

-- Create story_prompts table
CREATE TABLE IF NOT EXISTS story_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  age_group text NOT NULL,
  theme text NOT NULL,
  writing_style text NOT NULL,
  characters text NOT NULL,
  season text NOT NULL,
  story_length text NOT NULL,
  custom_preferences text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid REFERENCES story_prompts(id),
  title text NOT NULL,
  content text NOT NULL,
  preview text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE story_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Create policies for story_prompts
CREATE POLICY "Allow public read access to story_prompts"
  ON story_prompts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to story_prompts"
  ON story_prompts
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policies for stories
CREATE POLICY "Allow public read access to stories"
  ON stories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to stories"
  ON stories
  FOR INSERT
  TO public
  WITH CHECK (true);
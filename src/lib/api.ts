import { getConfig } from './config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

interface StoryParams {
  age: string;
  theme: string;
  writingStyle: string;
  characters: string;
  season: string;
  storyLength: string;
  customPreferences: string;
}

interface UsageStats {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

interface StoryResponse {
  title: string;
  content: string;
  usage: UsageStats;
}

interface StoryPrompt {
  id: string;
  age_group: string;
  theme: string;
  writing_style: string;
  characters: string;
  season: string;
  story_length: string;
  custom_preferences: string;
  status: string;
  created_at: string;
}

export interface Story {
  id: string;
  prompt_id: string;
  title: string;
  content: string;
  preview: string;
  created_at: string;
  prompt?: StoryPrompt;
}

// Use relative API URL for local development
// const API_URL = '/api';
const API_URL = import.meta.env.VITE_BACKEND_URL+'/api';

// Initialize Supabase client with error handling
const initSupabase = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

const supabase = initSupabase();

// Save prompt to database
async function savePrompt(params: StoryParams): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('story_prompts')
      .insert({
        age_group: params.age,
        theme: params.theme,
        writing_style: params.writingStyle,
        characters: params.characters,
        season: params.season,
        story_length: params.storyLength,
        custom_preferences: params.customPreferences,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error saving prompt:', error);
    throw error;
  }
}

// Save generated story to database
async function saveStory(promptId: string, title: string, content: string): Promise<void> {
  try {
    const preview = content.split('\n')[0].slice(0, 200) + '...';
    
    const { error } = await supabase
      .from('stories')
      .insert({
        prompt_id: promptId,
        title,
        content,
        preview
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving story:', error);
    throw error;
  }
}

// Fetch all stories with their prompts
export async function getStories(): Promise<Story[]> {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        prompt:prompt_id(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
}

// Get a specific story by ID
export async function getStoryById(id: string): Promise<Story | null> {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        prompt:prompt_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching story:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching story:', error);
    return null;
  }
}

export async function generateStory(params: StoryParams): Promise<StoryResponse> {
  try {
    // First save the prompt to the database
    const promptId = await savePrompt(params);

    // Make the API call to generate the story
    const response = await fetch(`${API_URL}/generate-story`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to generate story');
    }

    const result = await response.json();

    // Save the generated story to the database
    await saveStory(promptId, result.title, result.content);

    return result;
  } catch (error) {
    console.error('Error in generateStory:', error);
    throw error;
  }
}

export async function getUsageStats(): Promise<UsageStats> {
  try {
    const response = await fetch(`${API_URL}/usage-stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch usage stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getUsageStats:', error);
    throw error;
  }
}
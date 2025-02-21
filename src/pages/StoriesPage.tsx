import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Wand2 as Magic, Users, Sparkles as Theme } from 'lucide-react';
import { Story, getStories } from '../lib/api';

// Helper function to convert to Title Case
function toTitleCase(str: string) {
  return str.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

// Helper function to format date
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export default function StoriesPage() {
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const fetchedStories = await getStories();
      setStories(fetchedStories);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStory = (story: Story) => {
    navigate('/story', { 
      state: { 
        existingStory: story,
        formData: {
          age: story.prompt?.age_group || '',
          theme: story.prompt?.theme || '',
          writingStyle: story.prompt?.writing_style || '',
          characters: story.prompt?.characters || '',
          season: story.prompt?.season || '',
          storyLength: story.prompt?.story_length || '',
          customPreferences: story.prompt?.custom_preferences || '',
        }
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Book className="h-10 w-10 text-purple-600" />
              <h1 className="text-3xl font-bold text-purple-800">Magical Stories</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Magic className="h-5 w-5" />
              Create New Story
            </button>
          </div>

          {/* Stories Grid */}
          {loading ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-purple-600">Loading stories...</p>
            </div>
          ) : stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div key={story.id} className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow">
                  <h3 className="text-xl font-semibold text-purple-800 mb-3">{story.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{story.preview}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>Age: {toTitleCase(story.prompt?.age_group || '')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Theme className="h-4 w-4" />
                      <span>Theme: {toTitleCase(story.prompt?.theme || '')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Book className="h-4 w-4" />
                      <span>Created on {formatDate(story.created_at)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewStory(story)}
                    className="w-full bg-purple-50 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Book className="h-4 w-4" />
                    Read Story
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
              <Book className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-600 mb-4">No stories generated yet.</p>
              <button
                onClick={() => navigate('/')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
              >
                <Magic className="h-5 w-5" />
                Create Your First Story
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
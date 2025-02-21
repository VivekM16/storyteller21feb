import React from 'react';
import { Book, Calendar, Users, ArrowRight } from 'lucide-react';
import { Story } from '../lib/api';

interface ReadyStoriesProps {
  stories: Story[];
  onViewStory: (story: Story) => void;
}

export default function ReadyStories({ stories, onViewStory }: ReadyStoriesProps) {
  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <Book className="h-8 w-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-purple-800">Ready Stories</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div key={story.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-purple-800 mb-3">{story.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{story.preview}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>Age: {story.prompt?.age_group}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(story.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => onViewStory(story)}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
              >
                View Story
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {stories.length === 0 && (
        <div className="text-center py-12 bg-purple-50 rounded-lg">
          <p className="text-purple-600">No stories generated yet. Create your first story above!</p>
        </div>
      )}
    </div>
  );
}
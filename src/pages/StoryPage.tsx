import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Book, Loader2, DollarSign } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { generateStory, getUsageStats, Story, getStoryById } from '../lib/api';
import AudioPlayer from '../components/AudioPlayer';

interface FormData {
  age: string;
  theme: string;
  writingStyle: string;
  characters: string;
  season: string;
  storyLength: string;
  customPreferences: string;
}

interface LocationState {
  formData: FormData;
  existingStory?: Story;
}

interface UsageStats {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export default function StoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    estimatedCost: 0
  });

  // Get state safely with type checking
  const state = location.state as LocationState | null;
  const formData = state?.formData;
  const existingStory = state?.existingStory;

  useEffect(() => {
    // If no form data is present, redirect to home
    if (!formData && !existingStory) {
      navigate('/');
      return;
    }

    async function loadStory() {
      try {
        setLoading(true);
        if (existingStory) {
          // If it's an existing story, fetch the latest version from the database
          const latestStory = await getStoryById(existingStory.id);
          setStory(latestStory || existingStory);
          setLoading(false);
          return;
        }

        if (formData) {
          const response = await generateStory(formData);
          setStory({
            id: 'new',
            title: response.title,
            content: response.content,
            preview: response.content.split('\n')[0].slice(0, 200) + '...',
            created_at: new Date().toISOString(),
            prompt_id: 'new',
          });
          setUsageStats(response.usage);
        }
      } catch (error) {
        console.error('Error loading story:', error);
        setStory(null);
      } finally {
        setLoading(false);
      }
    }

    loadStory();
  }, [formData, navigate, existingStory]);

  const handleDownloadPDF = () => {
    if (!story) return;
    
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(story.title, 20, 20);
    
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(story.content, 170);
    doc.text(splitText, 20, 40);
    
    doc.save('magical-story.pdf');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
          <p className="text-purple-800 font-medium">
            {existingStory ? 'Loading story...' : 'Generating your magical story...'}
          </p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <p className="text-red-600">Something went wrong while loading the story.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 flex items-center gap-2 text-purple-700 hover:text-purple-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-purple-700 hover:text-purple-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              Download PDF
            </button>
          </div>

          {/* Usage Stats */}
          {!existingStory && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center gap-2 text-purple-800 mb-2">
                <DollarSign className="h-5 w-5" />
                <h2 className="font-semibold">API Usage Statistics</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Tokens</p>
                  <p className="font-semibold">{usageStats.totalTokens.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Prompt Tokens</p>
                  <p className="font-semibold">{usageStats.promptTokens.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Completion Tokens</p>
                  <p className="font-semibold">{usageStats.completionTokens.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Estimated Cost</p>
                  <p className="font-semibold">${usageStats.estimatedCost.toFixed(4)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Story Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Story Header */}
            <div className="flex items-center gap-3 mb-6">
              <Book className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-purple-800">{story.title}</h1>
            </div>

            {/* Audio Player */}
            <div className="mb-6">
              <AudioPlayer text={story.content} />
            </div>

            {/* Story Parameters */}
            {formData && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 bg-purple-50 p-4 rounded-lg">
                <div>
                  <span className="text-sm text-purple-600">Age Group:</span>
                  <p className="font-semibold">{formData.age}</p>
                </div>
                <div>
                  <span className="text-sm text-purple-600">Theme:</span>
                  <p className="font-semibold">{formData.theme}</p>
                </div>
                <div>
                  <span className="text-sm text-purple-600">Style:</span>
                  <p className="font-semibold">{formData.writingStyle}</p>
                </div>
                <div>
                  <span className="text-sm text-purple-600">Characters:</span>
                  <p className="font-semibold">{formData.characters}</p>
                </div>
                <div>
                  <span className="text-sm text-purple-600">Season:</span>
                  <p className="font-semibold">{formData.season}</p>
                </div>
                <div>
                  <span className="text-sm text-purple-600">Length:</span>
                  <p className="font-semibold">{formData.storyLength} paragraphs</p>
                </div>
              </div>
            )}

            {/* Story Content */}
            <div className="prose max-w-none">
              {story.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph.trim()}
                  </p>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
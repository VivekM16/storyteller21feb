import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Magnet as Magic, User, Palette, Users, Sun, AlignLeft, Wand2 } from 'lucide-react';

interface FormData {
  age: string;
  theme: string;
  writingStyle: string;
  characters: string;
  season: string;
  storyLength: string;
  customPreferences: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    age: '',
    theme: '',
    writingStyle: '',
    characters: '',
    season: '',
    storyLength: '',
    customPreferences: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/story', { state: { formData } });
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-800 mb-4 flex items-center justify-center gap-3">
              <Book className="h-10 w-10" />
              Magical Story Teller
            </h1>
            <p className="text-lg text-purple-600 mb-6">Create enchanting bedtime stories for your little ones</p>
            <button
              onClick={() => navigate('/stories')}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-600 hover:text-white transition-colors inline-flex items-center gap-2 shadow-md"
            >
              <Book className="h-5 w-5" />
              View Ready Stories
            </button>
          </div>

          {/* Create Story Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <div className="flex items-center gap-3 mb-8">
              <Magic className="h-8 w-8 text-purple-600" />
              <h2 className="text-2xl font-bold text-purple-800">Create New Story</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age Group */}
              <div className="form-group">
                <label className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                  <User className="h-5 w-5" />
                  Child's Age
                </label>
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  required
                >
                  <option value="">Select age group</option>
                  <option value="1-2">1 to 2 years</option>
                  <option value="3-5">3 to 5 years</option>
                  <option value="6-8">6 to 8 years</option>
                  <option value="9-12">9 to 12 years</option>
                  <option value="13+">13+ years</option>
                </select>
              </div>

              {/* Story Theme */}
              <div className="form-group">
                <label className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                  <Magic className="h-5 w-5" />
                  Story Theme
                </label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  required
                >
                  <option value="">Select theme</option>
                  <option value="magical">Magical</option>
                  <option value="funny">Funny</option>
                  <option value="heroic">Heroic</option>
                  <option value="adventure">Adventure</option>
                  <option value="moral">Moral Values</option>
                  <option value="lifeSkills">Life Skills</option>
                  <option value="confidence">Confidence Building</option>
                  <option value="sporty">Sporty</option>
                </select>
              </div>

              {/* Writing Style */}
              <div className="form-group">
                <label className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                  <Palette className="h-5 w-5" />
                  Writing Style
                </label>
                <select
                  name="writingStyle"
                  value={formData.writingStyle}
                  onChange={handleChange}
                  className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  required
                >
                  <option value="">Select writing style</option>
                  <optgroup label="Indian Authors">
                    <option value="sudha-murty">Sudha Murty (Simple Moral Stories)</option>
                    <option value="ruskin-bond">Ruskin Bond (Nature & Adventure)</option>
                    <option value="anushka-ravishankar">Anushka Ravishankar (Rhythmic)</option>
                    <option value="deepa-agarwal">Deepa Agarwal (Cultural Stories)</option>
                    <option value="paro-anand">Paro Anand (Age Appropriate)</option>
                    <option value="devdutt-pattanaik">Devdutt Pattanaik (Mythology)</option>
                  </optgroup>
                  <optgroup label="International Authors">
                    <option value="dr-seuss">Dr. Seuss (Rhyming, Whimsical)</option>
                    <option value="roald-dahl">Roald Dahl (Imaginative, Quirky)</option>
                    <option value="eric-carle">Eric Carle (Simple, Educational)</option>
                    <option value="beatrix-potter">Beatrix Potter (Gentle, Nature-focused)</option>
                    <option value="hans-christian-andersen">Hans Christian Andersen (Fairy Tale Style)</option>
                    <option value="brothers-grimm">Brothers Grimm (Traditional Folklore)</option>
                    <option value="julia-donaldson">Julia Donaldson (Rhythmic, Engaging)</option>
                    <option value="enid-blyton">Enid Blyton (Adventurous, Descriptive)</option>
                  </optgroup>
                </select>
              </div>

              {/* Characters */}
              <div className="form-group">
                <label className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                  <Users className="h-5 w-5" />
                  Main Characters
                </label>
                <select
                  name="characters"
                  value={formData.characters}
                  onChange={handleChange}
                  className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  required
                >
                  <option value="">Select characters</option>
                  <optgroup label="Family">
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="brothers">Brothers</option>
                    <option value="sisters">Sisters</option>
                    <option value="friends">Friends</option>
                    <option value="grandparents">Grand-parents</option>
                  </optgroup>
                  <optgroup label="Vehicles">
                    <option value="cars">Cars & Trucks</option>
                    <option value="trains">Trains & Buses</option>
                    <option value="planes">Airplanes & Helicopters</option>
                  </optgroup>
                  <optgroup label="Royalty">
                    <option value="princess">Princess</option>
                    <option value="kings">Kings & Queens</option>
                    <option value="knights">Knights & Warriors</option>
                  </optgroup>
                  <optgroup label="TV Characters">
                    <option value="peppa">Peppa Pig & Family</option>
                    <option value="bluey">Bluey & Family</option>
                  </optgroup>
                  <optgroup label="Nature">
                    <option value="birds">Birds</option>
                    <option value="space">Planets & Stars</option>
                    <option value="food">Fruits & Vegetables</option>
                  </optgroup>
                </select>
              </div>

              {/* Season */}
              <div className="form-group">
                <label className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                  <Sun className="h-5 w-5" />
                  Season
                </label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  required
                >
                  <option value="">Select season</option>
                  <option value="summer">Summer</option>
                  <option value="winter">Winter</option>
                  <option value="autumn">Autumn</option>
                  <option value="monsoon">Monsoon</option>
                  <option value="spring">Spring</option>
                </select>
              </div>

              {/* Story Length */}
              <div className="form-group">
                <label className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                  <AlignLeft className="h-5 w-5" />
                  Story Length
                </label>
                <select
                  name="storyLength"
                  value={formData.storyLength}
                  onChange={handleChange}
                  className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  required
                >
                  <option value="">Select length</option>
                  <option value="2">2 Paragraphs</option>
                  <option value="3">3 Paragraphs</option>
                  <option value="4">4 Paragraphs</option>
                  <option value="6">6 Paragraphs</option>
                </select>
              </div>
            </div>

            {/* Custom Preferences */}
            <div className="mt-6">
              <label className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                <Wand2 className="h-5 w-5" />
                Special Preferences
              </label>
              <textarea
                name="customPreferences"
                value={formData.customPreferences}
                onChange={handleChange}
                placeholder="Add any special details or preferences for your story (upto 200 characters)"
                maxLength={200}
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent h-24"
              />
              <div className="text-sm text-gray-500 text-right">
                {formData.customPreferences.length}/200 characters
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                <Magic className="h-5 w-5" />
                Generate Magical Story
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
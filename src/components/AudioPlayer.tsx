import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Howl } from 'howler';

interface AudioPlayerProps {
  text: string;
}

export default function AudioPlayer({ text }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  const API_URL = import.meta.env.VITE_BACKEND_URL+'/api';

  const playAudio = async () => {
    try {
      if (soundRef.current) {
        if (isPlaying) {
          soundRef.current.pause();
          setIsPlaying(false);
          return;
        }
        soundRef.current.play();
        setIsPlaying(true);
        return;
      }

      setIsLoading(true);
      const response = await fetch(API_URL + '/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      soundRef.current = new Howl({
        src: [url],
        format: ['mp3'],
        html5: true,
        onend: () => {
          setIsPlaying(false);
        },
        onloaderror: (id, error) => {
          console.error('Loading error:', error);
          setIsLoading(false);
        },
      });

      soundRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMute = () => {
    if (soundRef.current) {
      soundRef.current.mute(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-purple-50 p-4 rounded-lg">
      <button
        onClick={playAudio}
        disabled={isLoading}
        className={`flex items-center justify-center w-12 h-12 rounded-full ${
          isLoading
            ? 'bg-purple-200 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700'
        } text-white transition-colors`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </button>

      <button
        onClick={toggleMute}
        disabled={!soundRef.current}
        className={`flex items-center justify-center w-12 h-12 rounded-full ${
          !soundRef.current
            ? 'bg-purple-200 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700'
        } text-white transition-colors`}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6" />
        ) : (
          <Volume2 className="w-6 h-6" />
        )}
      </button>

      <div className="text-sm text-purple-700">
        {isLoading
          ? 'Generating audio...'
          : isPlaying
          ? 'Playing story...'
          : 'Click play to listen'}
      </div>
    </div>
  );
}
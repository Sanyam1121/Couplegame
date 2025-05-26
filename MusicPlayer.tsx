import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, PlayCircle, PauseCircle } from 'lucide-react';

interface MusicPlayerProps {
  isPlaying: boolean;
  volume: number;
  onPlayToggle: () => void;
  onVolumeChange: (volume: number) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  isPlaying, 
  volume, 
  onPlayToggle, 
  onVolumeChange 
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element on component mount
  useEffect(() => {
    // Use a relaxing royalty-free music URL
    const musicUrl = 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3';
    
    audioRef.current = new Audio(musicUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    
    // Cleanup on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Handle play/pause changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        // Often browsers require user interaction before playing audio
        onPlayToggle();
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, onPlayToggle]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  return (
    <div className="bg-white rounded-full shadow-md p-2 flex items-center gap-2">
      <button 
        onClick={onPlayToggle}
        className="text-gray-700 hover:text-pink-500 transition-colors"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
      </button>
      
      <div className="flex items-center gap-1">
        <button 
          className="text-gray-700"
          onClick={() => onVolumeChange(volume === 0 ? 0.5 : 0)}
        >
          {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
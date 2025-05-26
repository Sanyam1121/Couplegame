import React from 'react';
import { Character } from '../types';

interface CharacterDisplayProps {
  character: Character;
  size?: 'small' | 'medium' | 'large';
  emotion?: 'happy' | 'sad' | 'surprised' | 'thinking';
  speaking?: boolean;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ 
  character, 
  size = 'medium',
  emotion = 'happy',
  speaking = false
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-40 h-40'
  };
  
  const getEmotionPath = () => {
    switch(emotion) {
      case 'happy': return "M 35,40 Q 40,45 45,40";
      case 'sad': return "M 35,45 Q 40,40 45,45";
      case 'surprised': return "M 40,42 A 2,2 0 1 1 40,42.1";
      case 'thinking': return "M 35,42 L 45,42";
      default: return "M 35,40 Q 40,45 45,40";
    }
  };
  
  const getAccessory = () => {
    switch(character.accessory) {
      case 'glasses':
        return (
          <g>
            <circle cx="35" cy="35" r="5" fill="none" stroke="#333" strokeWidth="1.5" />
            <circle cx="45" cy="35" r="5" fill="none" stroke="#333" strokeWidth="1.5" />
            <line x1="40" y1="35" x2="35" y2="35" stroke="#333" strokeWidth="1.5" />
            <line x1="45" y1="35" x2="50" y2="35" stroke="#333" strokeWidth="1.5" />
          </g>
        );
      case 'hat':
        return (
          <g>
            <path d="M 25,25 H 55 L 50,18 H 30 Z" fill={character.outfitColor} />
            <line x1="25" y1="25" x2="55" y2="25" stroke="#333" strokeWidth="1" />
          </g>
        );
      case 'bowtie':
        return (
          <g>
            <path d="M 35,55 L 30,50 L 35,45 L 40,45 L 45,50 L 40,55 Z" fill="#333" />
          </g>
        );
      case 'necklace':
        return (
          <g>
            <path d="M 35,50 Q 40,55 45,50" stroke="#FFD700" strokeWidth="1.5" fill="none" />
            <circle cx="40" cy="53" r="1.5" fill="#FFD700" />
          </g>
        );
      default:
        return null;
    }
  };
  
  // Animation for speaking effect
  const speakingAnimation = speaking ? (
    <g>
      <circle 
        cx="58" 
        cy="35" 
        r="3" 
        fill="#333" 
        opacity="0.8"
        className="animate-ping"
      />
      <circle 
        cx="65" 
        cy="30" 
        r="2" 
        fill="#333" 
        opacity="0.6"
        className="animate-ping animation-delay-300"
      />
      <circle 
        cx="70" 
        cy="25" 
        r="1.5" 
        fill="#333" 
        opacity="0.4"
        className="animate-ping animation-delay-600"
      />
    </g>
  ) : null;
  
  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <path 
          d="M 30,50 A 10,15 0 0 0 50,50 V 70 A 10,10 0 0 1 30,70 Z" 
          fill={character.outfitColor} 
        />
        
        {/* Neck */}
        <rect x="38" y="45" width="4" height="5" fill={character.skinColor} />
        
        {/* Head */}
        <circle cx="40" cy="35" r="15" fill={character.skinColor} />
        
        {/* Hair */}
        <path 
          d="M 25,35 A 15,15 0 0 1 55,35 V 25 A 15,15 0 0 0 25,25 Z" 
          fill={character.hairColor} 
        />
        
        {/* Eyes */}
        <circle cx="35" cy="35" r="2" fill="#333" />
        <circle cx="45" cy="35" r="2" fill="#333" />
        
        {/* Mouth - changes based on emotion */}
        <path d={getEmotionPath()} stroke="#333" strokeWidth="1.5" fill="none" />
        
        {/* Accessory */}
        {getAccessory()}
        
        {/* Speaking animation */}
        {speakingAnimation}
      </svg>
      
      {/* Character name */}
      <div className="text-center mt-2 text-sm font-medium">{character.name}</div>
    </div>
  );
};

export default CharacterDisplay;
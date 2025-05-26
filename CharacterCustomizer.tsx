import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, RefreshCw as Refresh } from 'lucide-react';
import { Character } from '../types';
import CharacterDisplay from './CharacterDisplay';

interface CharacterCustomizerProps {
  onBack: () => void;
}

const CharacterCustomizer: React.FC<CharacterCustomizerProps> = ({ onBack }) => {
  const [character1, setCharacter1] = useState<Character>({
    id: 'player1',
    name: 'Player 1',
    hairColor: '#6B3FA0',
    skinColor: '#FFD3B6',
    outfitColor: '#FF8BA7',
    accessory: 'glasses'
  });
  
  const [character2, setCharacter2] = useState<Character>({
    id: 'player2',
    name: 'Player 2',
    hairColor: '#3A86FF',
    skinColor: '#F9DCC4',
    outfitColor: '#8BD3DD',
    accessory: 'hat'
  });
  
  const [activeCharacter, setActiveCharacter] = useState<'player1' | 'player2'>('player1');
  
  // Load saved characters from localStorage
  useEffect(() => {
    const savedCharacter1 = localStorage.getItem('character1');
    const savedCharacter2 = localStorage.getItem('character2');
    
    if (savedCharacter1) setCharacter1(JSON.parse(savedCharacter1));
    if (savedCharacter2) setCharacter2(JSON.parse(savedCharacter2));
  }, []);
  
  // Save characters to localStorage when they change
  useEffect(() => {
    localStorage.setItem('character1', JSON.stringify(character1));
    localStorage.setItem('character2', JSON.stringify(character2));
  }, [character1, character2]);
  
  const handleNameChange = (name: string) => {
    if (activeCharacter === 'player1') {
      setCharacter1({ ...character1, name });
    } else {
      setCharacter2({ ...character2, name });
    }
  };
  
  const handleHairColorChange = (hairColor: string) => {
    if (activeCharacter === 'player1') {
      setCharacter1({ ...character1, hairColor });
    } else {
      setCharacter2({ ...character2, hairColor });
    }
  };
  
  const handleSkinColorChange = (skinColor: string) => {
    if (activeCharacter === 'player1') {
      setCharacter1({ ...character1, skinColor });
    } else {
      setCharacter2({ ...character2, skinColor });
    }
  };
  
  const handleOutfitColorChange = (outfitColor: string) => {
    if (activeCharacter === 'player1') {
      setCharacter1({ ...character1, outfitColor });
    } else {
      setCharacter2({ ...character2, outfitColor });
    }
  };
  
  const handleAccessoryChange = (accessory: string) => {
    if (activeCharacter === 'player1') {
      setCharacter1({ ...character1, accessory });
    } else {
      setCharacter2({ ...character2, accessory });
    }
  };
  
  const randomizeCharacter = () => {
    const hairColors = ['#6B3FA0', '#3A86FF', '#FB8500', '#DC2F02', '#001219', '#4A5859'];
    const skinColors = ['#FFD3B6', '#F9DCC4', '#E8DAB2', '#C6AC8F', '#AD8A64'];
    const outfitColors = ['#FF8BA7', '#8BD3DD', '#FFBE0B', '#3BCEAC', '#CD5334'];
    const accessories = ['glasses', 'hat', 'bowtie', 'necklace', 'none'];
    
    const randomHair = hairColors[Math.floor(Math.random() * hairColors.length)];
    const randomSkin = skinColors[Math.floor(Math.random() * skinColors.length)];
    const randomOutfit = outfitColors[Math.floor(Math.random() * outfitColors.length)];
    const randomAccessory = accessories[Math.floor(Math.random() * accessories.length)];
    
    if (activeCharacter === 'player1') {
      setCharacter1({
        ...character1,
        hairColor: randomHair,
        skinColor: randomSkin,
        outfitColor: randomOutfit,
        accessory: randomAccessory
      });
    } else {
      setCharacter2({
        ...character2,
        hairColor: randomHair,
        skinColor: randomSkin,
        outfitColor: randomOutfit,
        accessory: randomAccessory
      });
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto w-full animate-fadeIn">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h2 className="text-3xl font-bold mx-auto text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          Customize Characters
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Character Preview */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <div className="tabs flex gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded-full flex items-center gap-1 ${
                activeCharacter === 'player1' 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
              onClick={() => setActiveCharacter('player1')}
            >
              <User size={16} />
              <span>{character1.name}</span>
            </button>
            <button
              className={`px-4 py-2 rounded-full flex items-center gap-1 ${
                activeCharacter === 'player2' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } transition-colors`}
              onClick={() => setActiveCharacter('player2')}
            >
              <User size={16} />
              <span>{character2.name}</span>
            </button>
          </div>
          
          <div className="character-preview h-64 w-full flex justify-center items-center">
            {activeCharacter === 'player1' ? (
              <CharacterDisplay character={character1} size="large" />
            ) : (
              <CharacterDisplay character={character2} size="large" />
            )}
          </div>
          
          <button 
            onClick={randomizeCharacter}
            className="mt-4 flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
          >
            <Refresh size={16} />
            <span>Randomize</span>
          </button>
        </div>
        
        {/* Customization Options */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Customize</h3>
          
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={activeCharacter === 'player1' ? character1.name : character2.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                maxLength={12}
              />
            </div>
            
            {/* Hair Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hair Color
              </label>
              <div className="flex flex-wrap gap-2">
                {['#6B3FA0', '#3A86FF', '#FB8500', '#DC2F02', '#001219', '#4A5859'].map(color => (
                  <button
                    key={color}
                    onClick={() => handleHairColorChange(color)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      (activeCharacter === 'player1' ? character1.hairColor : character2.hairColor) === color
                        ? 'ring-2 ring-offset-2 ring-pink-500 scale-110'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            {/* Skin Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skin Tone
              </label>
              <div className="flex flex-wrap gap-2">
                {['#FFD3B6', '#F9DCC4', '#E8DAB2', '#C6AC8F', '#AD8A64'].map(color => (
                  <button
                    key={color}
                    onClick={() => handleSkinColorChange(color)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      (activeCharacter === 'player1' ? character1.skinColor : character2.skinColor) === color
                        ? 'ring-2 ring-offset-2 ring-pink-500 scale-110'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            {/* Outfit Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Outfit Color
              </label>
              <div className="flex flex-wrap gap-2">
                {['#FF8BA7', '#8BD3DD', '#FFBE0B', '#3BCEAC', '#CD5334'].map(color => (
                  <button
                    key={color}
                    onClick={() => handleOutfitColorChange(color)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      (activeCharacter === 'player1' ? character1.outfitColor : character2.outfitColor) === color
                        ? 'ring-2 ring-offset-2 ring-pink-500 scale-110'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            {/* Accessory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accessory
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['glasses', 'hat', 'bowtie', 'necklace', 'none'].map(accessory => (
                  <button
                    key={accessory}
                    onClick={() => handleAccessoryChange(accessory)}
                    className={`px-3 py-2 border rounded-md capitalize ${
                      (activeCharacter === 'player1' ? character1.accessory : character2.accessory) === accessory
                        ? 'bg-pink-100 border-pink-300 text-pink-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {accessory}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCustomizer;
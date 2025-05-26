import React from 'react';
import { GameType } from '../types';
import { Brain, MessageSquareText, PenTool } from 'lucide-react';

interface GameSelectorProps {
  onSelectGame: (game: GameType) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame }) => {
  const games = [
    {
      id: 'memoryMatch' as GameType,
      name: 'Memory Match',
      description: 'Test your memory by matching cards together. Take turns and see who has the better memory!',
      icon: <Brain className="w-12 h-12 text-pink-500" />,
      difficulty: 'Easy'
    },
    {
      id: 'wordGuess' as GameType,
      name: 'Word Whispers',
      description: 'One player describes a word without saying it, while the other tries to guess. Switch roles and collect points!',
      icon: <MessageSquareText className="w-12 h-12 text-purple-500" />,
      difficulty: 'Medium'
    },
    {
      id: 'drawTogether' as GameType,
      name: 'Sketch Together',
      description: 'Work together to create a drawing. One player starts, the other continues, creating a unique masterpiece!',
      icon: <PenTool className="w-12 h-12 text-teal-500" />,
      difficulty: 'Hard'
    }
  ];
  
  return (
    <div className="max-w-4xl mx-auto w-full animate-fadeIn">
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
        Choose a Game
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map(game => (
          <button 
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-center mb-4">
                {game.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-gray-800">{game.name}</h3>
              
              <div className="mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  game.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {game.difficulty}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm flex-grow">{game.description}</p>
              
              <div className="mt-4 text-pink-500 font-medium text-sm flex items-center justify-center">
                Play Now
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameSelector;
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { GameType } from '../types';
import MemoryMatch from './games/MemoryMatch';
import WordGuess from './games/WordGuess';
import DrawTogether from './games/DrawTogether';

interface GameAreaProps {
  game: GameType;
  onScoreUpdate: (player: 'player1' | 'player2', points: number) => void;
  onBackToGames: () => void;
}

const GameArea: React.FC<GameAreaProps> = ({ game, onScoreUpdate, onBackToGames }) => {
  const renderGame = () => {
    switch(game) {
      case 'memoryMatch':
        return <MemoryMatch onScoreUpdate={onScoreUpdate} />;
      case 'wordGuess':
        return <WordGuess onScoreUpdate={onScoreUpdate} />;
      case 'drawTogether':
        return <DrawTogether onScoreUpdate={onScoreUpdate} />;
      default:
        return <div>Game not found!</div>;
    }
  };
  
  const getGameTitle = () => {
    switch(game) {
      case 'memoryMatch': return 'Memory Match';
      case 'wordGuess': return 'Word Whispers';
      case 'drawTogether': return 'Sketch Together';
      default: return 'Game';
    }
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeIn">
      <div className="flex items-center mb-6">
        <button 
          onClick={onBackToGames}
          className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Games</span>
        </button>
        <h2 className="text-3xl font-bold mx-auto text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          {getGameTitle()}
        </h2>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        {renderGame()}
      </div>
    </div>
  );
};

export default GameArea;
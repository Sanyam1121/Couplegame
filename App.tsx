import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import GameSelector from './components/GameSelector';
import CharacterCustomizer from './components/CharacterCustomizer';
import GameArea from './components/GameArea';
import MusicPlayer from './components/MusicPlayer';
import { GameType } from './types';
import { saveGameState, loadGameState } from './utils/storage';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'games' | 'customize'>('home');
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  
  // Load saved game state
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setScore(savedState.score);
      setAchievements(savedState.achievements);
    }
  }, []);

  // Save game state when score or achievements change
  useEffect(() => {
    saveGameState({ score, achievements });
  }, [score, achievements]);

  const handleGameSelect = (game: GameType) => {
    setSelectedGame(game);
    setCurrentView('games');
  };

  const handleScoreUpdate = (player: 'player1' | 'player2', points: number) => {
    setScore(prevScore => {
      const newScore = {
        ...prevScore,
        [player]: prevScore[player] + points
      };
      return newScore;
    });
    
    // Check for achievements
    if (score.player1 + score.player2 >= 100 && !achievements.includes('Century')) {
      setAchievements(prev => [...prev, 'Century']);
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 text-gray-800 flex flex-col">
      <Header 
        onHome={() => setCurrentView('home')} 
        onCustomize={() => setCurrentView('customize')}
        score={score}
        achievements={achievements}
      />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        {currentView === 'home' && (
          <div className="text-center max-w-3xl mx-auto transition-all duration-500 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              Couple's Playdate
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700">
              Play, chat, and connect with your partner through fun interactive games!
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-6">
              <button 
                onClick={() => setCurrentView('games')}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Start Playing
              </button>
              <button 
                onClick={() => setCurrentView('customize')}
                className="px-8 py-4 bg-white text-gray-800 rounded-lg text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
              >
                Customize Characters
              </button>
            </div>
          </div>
        )}
        
        {currentView === 'games' && !selectedGame && (
          <GameSelector onSelectGame={handleGameSelect} />
        )}
        
        {currentView === 'games' && selectedGame && (
          <GameArea 
            game={selectedGame} 
            onScoreUpdate={handleScoreUpdate}
            onBackToGames={() => setSelectedGame(null)}
          />
        )}
        
        {currentView === 'customize' && (
          <CharacterCustomizer onBack={() => setCurrentView('home')} />
        )}
      </main>
      
      <div className="fixed bottom-4 right-4">
        <MusicPlayer 
          isPlaying={isMusicPlaying} 
          volume={musicVolume}
          onPlayToggle={() => setIsMusicPlaying(!isMusicPlaying)}
          onVolumeChange={setMusicVolume}
        />
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
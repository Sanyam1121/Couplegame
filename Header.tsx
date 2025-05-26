import React, { useState } from 'react';
import { Home, User, Award, Menu, X } from 'lucide-react';

interface HeaderProps {
  onHome: () => void;
  onCustomize: () => void;
  score: {
    player1: number;
    player2: number;
  };
  achievements: string[];
}

const Header: React.FC<HeaderProps> = ({ onHome, onCustomize, score, achievements }) => {
  const [showAchievements, setShowAchievements] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const totalScore = score.player1 + score.player2;
  
  return (
    <header className="bg-white bg-opacity-90 backdrop-blur-sm shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 font-bold text-xl cursor-pointer"
          onClick={onHome}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Couple's Playdate
          </span>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700 hover:text-pink-500 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={onHome}
            className="flex items-center gap-1 text-gray-700 hover:text-pink-500 transition-colors"
          >
            <Home size={18} />
            <span>Home</span>
          </button>
          
          <button 
            onClick={onCustomize}
            className="flex items-center gap-1 text-gray-700 hover:text-pink-500 transition-colors"
          >
            <User size={18} />
            <span>Customize</span>
          </button>
          
          <button 
            onClick={() => setShowAchievements(!showAchievements)}
            className="flex items-center gap-1 text-gray-700 hover:text-pink-500 transition-colors"
          >
            <Award size={18} />
            <span>Achievements</span>
            {achievements.length > 0 && (
              <span className="ml-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {achievements.length}
              </span>
            )}
          </button>
          
          <div className="flex items-center gap-1 bg-gradient-to-r from-pink-100 to-purple-100 px-3 py-1 rounded-full">
            <span className="font-medium">Score:</span>
            <span className="font-bold text-pink-600">{totalScore}</span>
          </div>
        </nav>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          <div className="container mx-auto px-4 flex flex-col">
            <button 
              onClick={() => {
                onHome();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-3 text-gray-700 hover:text-pink-500 transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </button>
            
            <button 
              onClick={() => {
                onCustomize();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-3 text-gray-700 hover:text-pink-500 transition-colors"
            >
              <User size={18} />
              <span>Customize</span>
            </button>
            
            <button 
              onClick={() => {
                setShowAchievements(!showAchievements);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-3 text-gray-700 hover:text-pink-500 transition-colors"
            >
              <Award size={18} />
              <span>Achievements</span>
              {achievements.length > 0 && (
                <span className="ml-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {achievements.length}
                </span>
              )}
            </button>
            
            <div className="flex items-center gap-1 py-3">
              <span className="font-medium">Score:</span>
              <span className="font-bold text-pink-600">{totalScore}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Achievements overlay */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAchievements(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Achievements</h2>
              <button 
                onClick={() => setShowAchievements(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            {achievements.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No achievements yet. Keep playing to earn some!
              </p>
            ) : (
              <ul className="space-y-3">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                    <Award className="text-pink-500" size={24} />
                    <span className="font-medium">{achievement}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
import React, { useState, useEffect, useRef } from 'react';
import { Timer, CheckCircle, XCircle, RefreshCw as Refresh } from 'lucide-react';
import CharacterDisplay from '../CharacterDisplay';
import { DialogueLine } from '../../types';

interface WordGuessProps {
  onScoreUpdate: (player: 'player1' | 'player2', points: number) => void;
}

const WordGuess: React.FC<WordGuessProps> = ({ onScoreUpdate }) => {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [guessInput, setGuessInput] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1');
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [gamePhase, setGamePhase] = useState<'setup' | 'clue' | 'guess' | 'result'>('setup');
  const [dialogue, setDialogue] = useState<DialogueLine[]>([]);
  const [clue, setClue] = useState<string>('');
  const [roundResult, setRoundResult] = useState<'correct' | 'incorrect' | null>(null);
  const [roundsPlayed, setRoundsPlayed] = useState<number>(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  
  // Word list for the game
  const wordList = [
    'sunset', 'coffee', 'rainbow', 'bicycle', 'pillow',
    'guitar', 'dolphin', 'birthday', 'candle', 'puzzle',
    'jungle', 'popcorn', 'camera', 'balloon', 'icecream',
    'mountain', 'painting', 'island', 'garden', 'umbrella'
  ];
  
  // Load characters from localStorage
  const character1 = JSON.parse(localStorage.getItem('character1') || '{"id":"player1","name":"Player 1","hairColor":"#6B3FA0","skinColor":"#FFD3B6","outfitColor":"#FF8BA7","accessory":"glasses"}');
  const character2 = JSON.parse(localStorage.getItem('character2') || '{"id":"player2","name":"Player 2","hairColor":"#3A86FF","skinColor":"#F9DCC4","outfitColor":"#8BD3DD","accessory":"hat"}');
  
  // Initialize dialogue
  useEffect(() => {
    setDialogue([
      { character: 'player1', text: "Let's see how well we can describe words!", emotion: 'happy' },
      { character: 'player2', text: "I'm ready to guess! This will be fun.", emotion: 'happy' }
    ]);
  }, []);
  
  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = window.setTimeout(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      // Time's up!
      setIsTimerRunning(false);
      
      if (gamePhase === 'clue') {
        // No clue was provided in time
        setDialogue([
          { 
            character: currentPlayer, 
            text: "Time's up! I couldn't think of a good clue.", 
            emotion: 'sad' 
          }
        ]);
        resetRound();
      } else if (gamePhase === 'guess') {
        // No guess was provided in time
        setRoundResult('incorrect');
        setGamePhase('result');
        setDialogue([
          { 
            character: currentPlayer === 'player1' ? 'player2' : 'player1', 
            text: "Time's up! The word was: " + currentWord, 
            emotion: 'thinking' 
          }
        ]);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isTimerRunning, timeLeft, gamePhase, currentPlayer, currentWord]);
  
  // Focus input when phase changes
  useEffect(() => {
    if ((gamePhase === 'clue' || gamePhase === 'guess') && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gamePhase]);
  
  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  };
  
  const startRound = () => {
    const newWord = getRandomWord();
    setCurrentWord(newWord);
    setTimeLeft(60);
    setIsTimerRunning(true);
    setGamePhase('clue');
    setDialogue([
      { 
        character: currentPlayer, 
        text: "I need to describe the word without saying it!", 
        emotion: 'thinking' 
      }
    ]);
  };
  
  const handleClueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clue.trim() === '') return;
    
    setIsTimerRunning(false);
    setGamePhase('guess');
    setTimeLeft(30);
    setIsTimerRunning(true);
    
    // Switch to the other player for guessing
    const guessingPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
    
    setDialogue([
      { 
        character: currentPlayer, 
        text: clue, 
        emotion: 'happy' 
      },
      { 
        character: guessingPlayer, 
        text: "Let me think about what this could be...", 
        emotion: 'thinking' 
      }
    ]);
  };
  
  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guessInput.trim() === '') return;
    
    setIsTimerRunning(false);
    
    const isCorrect = guessInput.toLowerCase().trim() === currentWord.toLowerCase();
    setRoundResult(isCorrect ? 'correct' : 'incorrect');
    setGamePhase('result');
    
    if (isCorrect) {
      // Award points for correct guess
      const newScore = {
        ...score,
        [currentPlayer === 'player1' ? 'player2' : 'player1']: score[currentPlayer === 'player1' ? 'player2' : 'player1'] + 5
      };
      setScore(newScore);
      onScoreUpdate(currentPlayer === 'player1' ? 'player2' : 'player1', 5);
      
      setDialogue([
        { 
          character: currentPlayer === 'player1' ? 'player2' : 'player1', 
          text: "Yes! That's correct!", 
          emotion: 'happy' 
        },
        { 
          character: currentPlayer, 
          text: "Great job guessing!", 
          emotion: 'happy' 
        }
      ]);
    } else {
      setDialogue([
        { 
          character: currentPlayer === 'player1' ? 'player2' : 'player1', 
          text: "No, that's not it. The word was: " + currentWord, 
          emotion: 'sad' 
        },
        { 
          character: currentPlayer, 
          text: "Maybe my clue wasn't clear enough.", 
          emotion: 'thinking' 
        }
      ]);
    }
    
    setRoundsPlayed(prev => prev + 1);
  };
  
  const resetRound = () => {
    setClue('');
    setGuessInput('');
    setGamePhase('setup');
    setRoundResult(null);
    
    // Switch players after each round
    setCurrentPlayer(prev => prev === 'player1' ? 'player2' : 'player1');
  };
  
  const resetGame = () => {
    resetRound();
    setScore({ player1: 0, player2: 0 });
    setRoundsPlayed(0);
    setDialogue([
      { character: 'player1', text: "Let's start fresh!", emotion: 'happy' },
      { character: 'player2', text: "I'm ready for a new game!", emotion: 'happy' }
    ]);
  };
  
  return (
    <div className="w-full">
      {/* Game instructions */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-2">How to Play:</h3>
        <p className="text-gray-700">
          One player gets a word and must describe it without saying the word itself. The other player must guess what the word is. Take turns being the clue-giver and guesser!
        </p>
      </div>
      
      {/* Game status */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className={`p-2 rounded-lg ${currentPlayer === 'player1' ? 'bg-pink-100 ring-2 ring-pink-300' : 'bg-gray-50'}`}>
            <CharacterDisplay 
              character={character1} 
              size="small" 
              speaking={
                (gamePhase === 'clue' && currentPlayer === 'player1') || 
                (gamePhase === 'guess' && currentPlayer === 'player2')
              } 
            />
          </div>
          <div className="text-center">
            <div className="font-medium">{character1.name}</div>
            <div className="text-sm text-gray-600">Score: {score.player1}</div>
          </div>
          
          <div className="mx-2 text-gray-400">vs</div>
          
          <div className={`p-2 rounded-lg ${currentPlayer === 'player2' ? 'bg-purple-100 ring-2 ring-purple-300' : 'bg-gray-50'}`}>
            <CharacterDisplay 
              character={character2} 
              size="small" 
              speaking={
                (gamePhase === 'clue' && currentPlayer === 'player2') || 
                (gamePhase === 'guess' && currentPlayer === 'player1')
              }
            />
          </div>
          <div className="text-center">
            <div className="font-medium">{character2.name}</div>
            <div className="text-sm text-gray-600">Score: {score.player2}</div>
          </div>
        </div>
        
        {isTimerRunning && (
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
            <Timer className={`${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-600'}`} size={18} />
            <span className="font-medium">{timeLeft}s</span>
          </div>
        )}
      </div>
      
      {/* Dialogue */}
      {dialogue.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
          {dialogue.map((line, index) => (
            <div key={index} className="flex items-start gap-3 mb-2 last:mb-0">
              <CharacterDisplay 
                character={line.character === 'player1' ? character1 : character2} 
                size="small"
                emotion={line.emotion || 'happy'}
                speaking={true}
              />
              <div className="bg-white p-3 rounded-lg shadow-sm flex-1">
                <p>{line.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Game area */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        {gamePhase === 'setup' && (
          <div className="text-center">
            <p className="mb-4 text-gray-700">
              {currentPlayer === 'player1' ? character1.name : character2.name} will give a clue for the next word.
            </p>
            <button
              onClick={startRound}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Start Round
            </button>
          </div>
        )}
        
        {gamePhase === 'clue' && (
          <div>
            <div className="mb-6 text-center">
              <h3 className="text-xl font-bold mb-2">Your Word:</h3>
              <div className="bg-pink-100 px-4 py-2 rounded-lg inline-block font-bold text-2xl text-pink-700">
                {currentWord}
              </div>
              <p className="mt-3 text-gray-600">
                Describe this word without saying it!
              </p>
            </div>
            
            <form onSubmit={handleClueSubmit} className="flex flex-col">
              <input
                ref={inputRef}
                type="text"
                value={clue}
                onChange={(e) => setClue(e.target.value)}
                placeholder="Enter your clue here..."
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
                required
              />
              <button
                type="submit"
                className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Give Clue
              </button>
            </form>
          </div>
        )}
        
        {gamePhase === 'guess' && (
          <div>
            <div className="mb-6 text-center">
              <h3 className="text-xl font-bold mb-2">Clue:</h3>
              <div className="bg-purple-100 px-4 py-2 rounded-lg inline-block font-medium text-xl text-purple-700">
                "{clue}"
              </div>
              <p className="mt-3 text-gray-600">
                Guess the word based on this clue!
              </p>
            </div>
            
            <form onSubmit={handleGuessSubmit} className="flex flex-col">
              <input
                ref={inputRef}
                type="text"
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                placeholder="Enter your guess here..."
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
                required
              />
              <button
                type="submit"
                className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Submit Guess
              </button>
            </form>
          </div>
        )}
        
        {gamePhase === 'result' && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {roundResult === 'correct' ? (
                <CheckCircle className="text-green-500" size={28} />
              ) : (
                <XCircle className="text-red-500" size={28} />
              )}
              <h3 className="text-xl font-bold">
                {roundResult === 'correct' ? 'Correct!' : 'Incorrect!'}
              </h3>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700">The word was:</p>
              <div className="mt-2 bg-gray-100 px-4 py-2 rounded-lg inline-block font-bold text-xl">
                {currentWord}
              </div>
            </div>
            
            <button
              onClick={resetRound}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Next Round
            </button>
          </div>
        )}
      </div>
      
      {/* Game controls */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-600">Rounds played: {roundsPlayed}</span>
        </div>
        
        <button
          onClick={resetGame}
          className="flex items-center gap-1 text-gray-600 hover:text-pink-500 transition-colors"
        >
          <Refresh size={16} />
          <span>Restart Game</span>
        </button>
      </div>
    </div>
  );
};

export default WordGuess;
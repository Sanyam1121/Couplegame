import React, { useState, useEffect } from 'react';
import { Heart, Trophy } from 'lucide-react';
import CharacterDisplay from '../CharacterDisplay';
import { DialogueLine } from '../../types';

interface MemoryMatchProps {
  onScoreUpdate: (player: 'player1' | 'player2', points: number) => void;
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryMatch: React.FC<MemoryMatchProps> = ({ onScoreUpdate }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1');
  const [moves, setMoves] = useState({ player1: 0, player2: 0 });
  const [dialogue, setDialogue] = useState<DialogueLine[]>([]);
  const [gameOver, setGameOver] = useState(false);
  
  // Load characters from localStorage
  const character1 = JSON.parse(localStorage.getItem('character1') || '{"id":"player1","name":"Player 1","hairColor":"#6B3FA0","skinColor":"#FFD3B6","outfitColor":"#FF8BA7","accessory":"glasses"}');
  const character2 = JSON.parse(localStorage.getItem('character2') || '{"id":"player2","name":"Player 2","hairColor":"#3A86FF","skinColor":"#F9DCC4","outfitColor":"#8BD3DD","accessory":"hat"}');
  
  // Initialize game
  useEffect(() => {
    initializeGame();
    setDialogue([
      { character: 'player1', text: "Ready to test your memory?", emotion: 'happy' },
      { character: 'player2', text: "Let's see who can remember more!", emotion: 'happy' }
    ]);
  }, []);
  
  const initializeGame = () => {
    const emojis = ['🐱', '🐶', '🐻', '🦊', '🦁', '🐯', '🐨', '🐼'];
    let newCards: Card[] = [];
    
    // Create pairs of cards
    for (let i = 0; i < emojis.length; i++) {
      newCards.push({
        id: i * 2,
        emoji: emojis[i],
        isFlipped: false,
        isMatched: false
      });
      
      newCards.push({
        id: i * 2 + 1,
        emoji: emojis[i],
        isFlipped: false,
        isMatched: false
      });
    }
    
    // Shuffle cards
    newCards = shuffleArray(newCards);
    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setCurrentPlayer('player1');
    setMoves({ player1: 0, player2: 0 });
    setGameOver(false);
  };
  
  const shuffleArray = (array: Card[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  const handleCardClick = (id: number) => {
    // Ignore if game is over or card is already flipped/matched
    if (
      gameOver ||
      flippedCards.length >= 2 ||
      cards.find(card => card.id === id)?.isFlipped ||
      cards.find(card => card.id === id)?.isMatched
    ) {
      return;
    }
    
    // Flip the card
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );
    
    setFlippedCards(prevFlipped => {
      const newFlipped = [...prevFlipped, id];
      
      // If two cards are flipped, check for a match
      if (newFlipped.length === 2) {
        const firstCardId = newFlipped[0];
        const secondCardId = newFlipped[1];
        
        const firstCard = cards.find(card => card.id === firstCardId);
        const secondCard = cards.find(card => card.id === secondCardId);
        
        if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
          // Match found
          setTimeout(() => {
            setCards(prevCards =>
              prevCards.map(card =>
                card.id === firstCardId || card.id === secondCardId
                  ? { ...card, isMatched: true }
                  : card
              )
            );
            
            setMatchedPairs(prev => {
              const newMatchedPairs = prev + 1;
              if (newMatchedPairs === 8) {
                // Game over
                setGameOver(true);
                
                // Add score based on performance
                const winner = moves.player1 <= moves.player2 ? 'player1' : 'player2';
                onScoreUpdate(winner, 10);
                
                // Set dialogue
                if (moves.player1 === moves.player2) {
                  setDialogue([
                    { character: 'player1', text: "It's a tie!", emotion: 'surprised' },
                    { character: 'player2', text: "Great game! Let's play again.", emotion: 'happy' }
                  ]);
                } else {
                  setDialogue([
                    { 
                      character: winner, 
                      text: "I won! My memory is better.", 
                      emotion: 'happy' 
                    },
                    { 
                      character: winner === 'player1' ? 'player2' : 'player1', 
                      text: "Good game! One more round?", 
                      emotion: 'thinking' 
                    }
                  ]);
                }
              }
              
              return newMatchedPairs;
            });
            
            // Add positive dialogue
            setDialogue([
              { 
                character: currentPlayer, 
                text: "Nice! I found a match!", 
                emotion: 'happy' 
              }
            ]);
            
            // Award points for finding a match
            onScoreUpdate(currentPlayer, 2);
            
          }, 500);
        } else {
          // No match
          setTimeout(() => {
            setCards(prevCards =>
              prevCards.map(card =>
                card.id === firstCardId || card.id === secondCardId
                  ? { ...card, isFlipped: false }
                  : card
              )
            );
            
            // Switch players
            setCurrentPlayer(prev => prev === 'player1' ? 'player2' : 'player1');
            
            // Add dialogue for missed match
            setDialogue([
              { 
                character: currentPlayer, 
                text: "Oops, no match!", 
                emotion: 'sad' 
              },
              { 
                character: currentPlayer === 'player1' ? 'player2' : 'player1', 
                text: "My turn now!", 
                emotion: 'happy' 
              }
            ]);
            
          }, 1000);
        }
        
        // Update moves count
        setMoves(prev => ({
          ...prev,
          [currentPlayer]: prev[currentPlayer] + 1
        }));
        
        // Reset flipped cards after checking
        return [];
      }
      
      return newFlipped;
    });
  };
  
  return (
    <div className="w-full">
      {/* Game instructions */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-2">How to Play:</h3>
        <p className="text-gray-700">
          Take turns flipping pairs of cards to find matches. Remember the positions of the cards you've seen! The player who finds the most matches wins.
        </p>
      </div>
      
      {/* Game status */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className={`p-2 rounded-lg ${currentPlayer === 'player1' ? 'bg-pink-100 ring-2 ring-pink-300' : 'bg-gray-50'}`}>
            <CharacterDisplay character={character1} size="small" speaking={currentPlayer === 'player1'} />
          </div>
          <div className="text-center">
            <div className="font-medium">{character1.name}</div>
            <div className="text-sm text-gray-600">Moves: {moves.player1}</div>
          </div>
          
          <div className="mx-2 text-gray-400">vs</div>
          
          <div className={`p-2 rounded-lg ${currentPlayer === 'player2' ? 'bg-purple-100 ring-2 ring-purple-300' : 'bg-gray-50'}`}>
            <CharacterDisplay character={character2} size="small" speaking={currentPlayer === 'player2'} />
          </div>
          <div className="text-center">
            <div className="font-medium">{character2.name}</div>
            <div className="text-sm text-gray-600">Moves: {moves.player2}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Heart className="text-pink-500" />
          <span className="font-medium">Pairs: {matchedPairs}/8</span>
        </div>
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
      
      {/* Game board */}
      <div className="grid grid-cols-4 gap-3">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-lg text-4xl flex items-center justify-center shadow-sm transition-all duration-300 transform ${
              card.isFlipped || card.isMatched
                ? 'bg-white rotate-0'
                : 'bg-gradient-to-r from-pink-300 to-purple-300 rotate-y-180'
            } ${
              card.isMatched ? 'bg-green-100 border-2 border-green-300' : ''
            }`}
            disabled={card.isMatched}
            style={{ perspective: '1000px' }}
          >
            {(card.isFlipped || card.isMatched) && card.emoji}
          </button>
        ))}
      </div>
      
      {/* Game over message */}
      {gameOver && (
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="text-yellow-500" />
            <h3 className="text-xl font-bold">Game Complete!</h3>
          </div>
          
          <p className="mb-4">
            {moves.player1 === moves.player2 
              ? "It's a tie!" 
              : `${moves.player1 < moves.player2 ? character1.name : character2.name} wins!`}
          </p>
          
          <button
            onClick={initializeGame}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryMatch;
// Game Types
export type GameType = 'memoryMatch' | 'wordGuess' | 'drawTogether';

export interface Character {
  id: string;
  name: string;
  hairColor: string;
  skinColor: string;
  outfitColor: string;
  accessory: string;
}

export interface GameState {
  score: {
    player1: number;
    player2: number;
  };
  achievements: string[];
}

export interface DialogueLine {
  character: 'player1' | 'player2';
  text: string;
  emotion?: 'happy' | 'sad' | 'surprised' | 'thinking';
}
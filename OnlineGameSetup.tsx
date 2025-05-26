import React, { useState, useEffect } from 'react';
import { Users, Copy, Check } from 'lucide-react';
import { supabase, createGameSession, joinGameSession } from '../utils/supabase';
import { GameType } from '../types';

interface OnlineGameSetupProps {
  onGameStart: (sessionId: string, isHost: boolean) => void;
  selectedGame: GameType;
}

const OnlineGameSetup: React.FC<OnlineGameSetupProps> = ({ onGameStart, selectedGame }) => {
  const [sessionId, setSessionId] = useState('');
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleCreateGame = async () => {
    try {
      setIsCreatingGame(true);
      setError('');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to create a game');

      const session = await createGameSession(selectedGame, user.id);
      setSessionId(session.id);
      onGameStart(session.id, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game');
    } finally {
      setIsCreatingGame(false);
    }
  };

  const handleJoinGame = async () => {
    try {
      setIsJoiningGame(true);
      setError('');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to join a game');

      await joinGameSession(sessionId, user.id);
      onGameStart(sessionId, false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join game');
    } finally {
      setIsJoiningGame(false);
    }
  };

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-2xl font-bold mb-6 text-center">Play Online</h3>

      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleCreateGame}
            disabled={isCreatingGame}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isCreatingGame ? 'Creating...' : 'Create New Game'}
          </button>

          <div className="text-center text-gray-500">or</div>

          <div className="w-full space-y-2">
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Enter game code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              onClick={handleJoinGame}
              disabled={!sessionId || isJoiningGame}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              {isJoiningGame ? 'Joining...' : 'Join Game'}
            </button>
          </div>
        </div>

        {sessionId && !isJoiningGame && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="font-medium">Game Code: {sessionId}</div>
            <button
              onClick={copySessionId}
              className="text-gray-600 hover:text-pink-500 transition-colors"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineGameSetup;
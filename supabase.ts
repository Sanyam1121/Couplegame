import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const createGameSession = async (gameType: string, player1Id: string) => {
  const { data, error } = await supabase
    .from('game_sessions')
    .insert([
      {
        game_type: gameType,
        player1_id: player1Id,
        current_state: {},
        is_active: true
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const joinGameSession = async (sessionId: string, player2Id: string) => {
  const { data, error } = await supabase
    .from('game_sessions')
    .update({ player2_id: player2Id })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateGameState = async (sessionId: string, newState: any) => {
  const { data, error } = await supabase
    .from('game_sessions')
    .update({ 
      current_state: newState,
      last_updated: new Date().toISOString()
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const subscribeToGameUpdates = (
  sessionId: string, 
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`game_${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_sessions',
        filter: `id=eq.${sessionId}`
      },
      callback
    )
    .subscribe();
};
import { supabase } from '../config/db.js';

export const checkCooldown = async (user_id) => {
  const { data } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(1);

  if (!data || data.length === 0) return false;

  const last = new Date(data[0].created_at);
  const now = new Date();
  return (now - last) < 3600000; // 1 hr
};

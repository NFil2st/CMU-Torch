import { supabase } from '../config/db.js';

export const getDailyStats = async (req, res) => {
  const { user_id } = req.query;

  const { data } = await supabase.rpc('get_daily_average', { uid: user_id });
  res.json({ daily_stats: data });
};

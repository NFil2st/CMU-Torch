import { supabase } from '../config/db.js';
import { calculateMoodScore } from '../utils/moodScore.js';
import { checkCooldown } from '../utils/cooldownCheck.js';

export const logMood = async (req, res) => {
  const { user_id, mood } = req.body;

  const cooldown = await checkCooldown(user_id);
  if (cooldown) return res.status(429).json({ error: "Wait 1 hour before next check-in" });

  const score = calculateMoodScore(mood);

  const { error } = await supabase.from('mood_logs').insert([{ user_id, mood_level: score }]);
  if (error) return res.status(400).json({ error });

  res.json({ message: "✅ Mood logged", score });
};

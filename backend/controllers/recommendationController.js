import { supabase } from '../config/db.js';

export const getRecommendations = async (req, res) => {
  const { mood_level } = req.query;

  const { data: food } = await supabase.from('food_recommendations').select('*').eq('mood_level', mood_level);
  const { data: exercise } = await supabase.from('exercise_recommendations').select('*').eq('mood_level', mood_level);
  const { data: mental } = await supabase.from('mental_support').select('*').eq('mood_level', mood_level);

  res.json({ food, exercise, mental });
};

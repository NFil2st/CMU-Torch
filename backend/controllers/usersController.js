// backend/controllers/usersController.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    res.status(200).json({ user: data.user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    res.status(200).json({ session: data.session });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { registerUser, loginUser };

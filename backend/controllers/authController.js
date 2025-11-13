import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/db.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email.endsWith('@cmu.ac.th')) {
  return res.status(400).json({ error: "ต้องใช้ email ของ CMU เท่านั้น" });
}

  const hash = await bcrypt.hash(password, 10);

  const { error } = await supabase.from('users').insert([{ name, email, password_hash: hash }]);
  if (error) return res.status(400).json({ error });

  res.json({ message: "✅ Registered successfully" });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { data: users } = await supabase.from('users').select('*').eq('email', email).single();
  if (!users) return res.status(404).json({ error: "User not found" });

  const match = await bcrypt.compare(password, users.password_hash);
  if (!match) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ id: users.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
};

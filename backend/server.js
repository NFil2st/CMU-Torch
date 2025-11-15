import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Database ตัวอย่างเก็บใน memory
const users = []; // { email, username, passwordHash }
const otps = {};  // { email: { code, expire } }

// Nodemailer (Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- API: ส่ง OTP ---
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.endsWith('@cmu.ac.th')) {
    return res.status(400).json({ success: false, message: 'กรุณาใส่อีเมล CMU เท่านั้น' });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expire = Date.now() + 5 * 60 * 1000; // หมดอายุ 5 นาที
  otps[email] = { code: otpCode, expire };

  try {
    await transporter.sendMail({
      from: `"CMU Torch App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'รหัส OTP สำหรับสมัคร CMU Torch',
      text: `รหัส OTP ของคุณคือ: ${otpCode} (หมดอายุใน 5 นาที)`
    });

    return res.json({ success: true, message: 'ส่ง OTP แล้ว' });
  } catch (err) {
    console.error('Error sending mail:', err);
    return res.status(500).json({ success: false, message: 'ส่ง OTP ไม่สำเร็จ' });
  }
});

// --- API: ตรวจสอบ OTP ---
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const record = otps[email];
  if (!record) return res.status(400).json({ success: false, message: 'OTP ไม่ถูกต้อง' });

  if (record.expire < Date.now()) {
    delete otps[email];
    return res.status(400).json({ success: false, message: 'OTP หมดอายุ' });
  }

  if (record.code !== otp) return res.status(400).json({ success: false, message: 'OTP ไม่ถูกต้อง' });

  delete otps[email];
  return res.json({ success: true, message: 'OTP ถูกต้อง' });
});

// --- API: สมัครบัญชี ---
app.post('/api/register', async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password)
    return res.status(400).json({ success: false, message: 'กรอกข้อมูลไม่ครบ' });

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'อีเมลนี้สมัครแล้ว' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ email, username, passwordHash });
  return res.json({ success: true, message: 'สมัครบัญชีสำเร็จ' });
});

// --- API: Login ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ success: false, message: 'ไม่พบผู้ใช้' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });

  const token = jwt.sign(
    { username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return res.json({ success: true, token });
});
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ success: false, message: 'ไม่พบผู้ใช้' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ success: false, message: 'รหัสผ่านผิด' });

  const token = jwt.sign(
    { username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return res.json({ success: true, token });
});
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

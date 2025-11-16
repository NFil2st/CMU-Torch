import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { supabase } from "../config/supabase.js";

dotenv.config();

const otps = {}; // { email: { code, expire } }

// Gmail Transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email.endsWith("@cmu.ac.th")) {
    return res.status(400).json({ success: false, message: "ต้องใช้อีเมล CMU" });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  otps[email] = { code: otpCode, expire: Date.now() + 5 * 60 * 1000 };

  try {
    await transporter.sendMail({
      from: `"CMU Torch" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP สำหรับสมัคร",
      text: `รหัส OTP: ${otpCode} (หมดอายุใน 5 นาที)`
    });

    return res.json({ success: true, message: "ส่ง OTP แล้ว" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
};

export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const record = otps[email];
  if (!record) return res.status(400).json({ success: false, message: "OTP ผิด" });

  if (record.expire < Date.now()) {
    delete otps[email];
    return res.status(400).json({ success: false, message: "OTP หมดอายุ" });
  }

  if (record.code !== otp) {
    return res.status(400).json({ success: false, message: "OTP ผิด" });
  }

  delete otps[email];
  return res.json({ success: true });
};

export const register = async (req, res) => {
  const { cmumail, username, password, name, major } = req.body;

  const { data: exists } = await supabase
    .from("User")
    .select("*")
    .eq("email", cmumail)
    .single();

  if (exists) {
    return res.status(400).json({ success: false, message: "อีเมลนี้ถูกใช้ไปแล้ว" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { error } = await supabase.from("User").insert([
    { cmumail, username, name, password: passwordHash, major }
  ]);

  if (error) {
    console.error("SUPABASE INSERT ERROR:", error);
    return res.status(500).json({ success: false, message: "สมัครไม่สำเร็จ" });
  }

  return res.json({ success: true });
};


export const login = async (req, res) => {
  const { username, password } = req.body;

  const { data: user } = await supabase
    .from("User")
    .select("*")
    .eq("username", username)
    .single();

  if (!user) {
    return res.status(400).json({ success: false, message: "ไม่พบผู้ใช้" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ success: false, message: "รหัสผ่านผิด" });

  const token = jwt.sign(
    { email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.json({ success: true, token });
};

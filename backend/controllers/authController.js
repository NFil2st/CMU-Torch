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

  return res.json({ success: true });
};

export const register = async (req, res) => {
  const { username, password, name, major, otp } = req.body;

  // หาอีเมลจาก OTP
  const emailRecord = Object.entries(otps).find(
    ([email, record]) => record.code === otp && record.expire > Date.now()
  );

  if (!emailRecord) {
    return res.status(400).json({ success: false, message: "OTP ผิดหรือหมดอายุ" });
  }

  const [cmumail] = emailRecord;

  // ตรวจสอบว่ามีผู้ใช้แล้วหรือไม่
  const { data: exists } = await supabase
    .from("User")
    .select("*")
    .eq("cmumail", cmumail)
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

  return res.json({ success: true, message: "สมัครสมาชิกสำเร็จ" });
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
{ email: user.cmumail, username: user.username },
    process.env.JWT_SECRET
  );

  return res.json({ success: true, token });
};




//profile controller
export const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data: user, error } = await supabase
      .from('User')
      .select('*')
      .eq('username', decoded.username)
      .single();

    if (error || !user) return res.status(404).json({ success: false });

    return res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};



export const getMoodFood = async (req, res) => {
  try {
    // 1. ดึง token จาก header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token" });

    // 2. ตรวจสอบ token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    // 3. ดึงข้อมูล user จาก Supabase
    const { data: user, error } = await supabase
      .from("User")
      .select("username, stackFood, mood")
      .eq("username", username)
      .single();

    if (error || !user) return res.status(404).json({ success: false, message: "User not found" });

    // 4. คืนค่า StackFood และ Mood
    return res.json({
      success: true,
      data: {
        username: user.username,
        stack: user.stackFood || [],
        mood: user.mood || "neutral",
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMoodExercise = async (req, res) => {
  try {
    // 1. ดึง token จาก header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token" });

    // 2. ตรวจสอบ token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    // 3. ดึงข้อมูล user จาก Supabase
    const { data: user, error } = await supabase
      .from("User")
      .select("username, stackExercise, mood")
      .eq("username", username)
      .single();

    if (error || !user) return res.status(404).json({ success: false, message: "User not found" });

    // 4. คืนค่า StackFood และ Mood
    return res.json({
      success: true,
      data: {
        username: user.username,
        stack: user.stackExercise || [],
        mood: user.mood || "neutral",
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMood = async (req, res) => {
  try {
    // 1. ดึง token จาก header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token" });

    // 2. ตรวจสอบ token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    // 3. ดึงข้อมูล user จาก Supabase
    const { data: user, error } = await supabase
      .from("User")
      .select("username, mood")
      .eq("username", username)
      .single();

    if (error || !user) return res.status(404).json({ success: false, message: "User not found" });

    // 4. คืนค่า StackFood และ Mood
    return res.json({
      success: true,
      data: {
        username: user.username,
        mood: user.mood || "neutral",
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
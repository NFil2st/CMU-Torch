import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

export const updateMood = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false });

    const { moodValue } = req.body; // 0=แย่, 3=ดี, 5=เยี่ยม
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ดึงข้อมูล user
    const { data: user, error } = await supabase
      .from("User")
      .select("*")
      .eq("username", decoded.username)
      .single();

    if (error || !user) return res.status(404).json({ success: false });

    const today = new Date().toISOString().slice(0, 10);

    // ตรวจสอบให้เป็น array
    let todayMoods = Array.isArray(user.todayMoods) ? user.todayMoods : [];
    let newMood;

    if (user.lastMoodDate !== today) {
      todayMoods = [moodValue]; // เริ่มวันใหม่ → รีเซ็ต
    } else {
      todayMoods.push(moodValue); // เพิ่ม mood ใหม่
    }

    // ค่าเฉลี่ยของวันนี้
    newMood = todayMoods.reduce((a, b) => a + b, 0) / todayMoods.length;

    // อัพเดท Supabase
    const { error: updateError } = await supabase
      .from("User")
      .update({
        mood: newMood,
        todayMoods,
        lastMoodDate: today,
      })
      .eq("username", decoded.username);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return res.status(500).json({ success: false });
    }

    return res.json({ success: true, mood: newMood, todayMoods });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};
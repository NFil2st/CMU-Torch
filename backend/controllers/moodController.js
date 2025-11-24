import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

export const updateMood = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false });

    const { moodValue } = req.body;
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("JWT Error:", error);
      return res.status(401).json({ success: false });
    }

    // ดึงข้อมูล user
    const { data: user, error } = await supabase
      .from("User")
      .select("*")
      .eq("username", decoded.username)
      .single();

    if (error || !user) return res.status(404).json({ success: false });

    const today = new Date().toISOString().slice(0, 10);

    // --- ตรวจสอบให้เป็น JSON ---
    let history = user.dailyMoodHistory || {};
    let todayMoods = history[today] || [];

    if (user.lastMoodDate !== today) {
      todayMoods = [];
    }

    todayMoods.push(moodValue);
    history[today] = todayMoods;

    // ===========================
    //   คำนวณค่าเฉลี่ย "วันนี้"
    // ===========================
    const todayAvg =
      todayMoods.reduce((a, b) => a + b, 0) / todayMoods.length;

    // ===========================
    //     คำนวณรายสัปดาห์ (7 วัน)
    // ===========================
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      weekDates.push(d.toISOString().slice(0, 10));
    }

    let weekValues = [];
    weekDates.forEach(d => {
      if (history[d]) {
        weekValues.push(
          history[d].reduce((a, b) => a + b, 0) / history[d].length
        );
      }
    });

    const moodweek =
      weekValues.length > 0
        ? weekValues.reduce((a, b) => a + b, 0) / weekValues.length
        : todayAvg;

    // ===========================
    //     คำนวณรายเดือน (30 วัน)
    // ===========================
    const monthDates = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      monthDates.push(d.toISOString().slice(0, 10));
    }

    let monthValues = [];
    monthDates.forEach(d => {
      if (history[d]) {
        monthValues.push(
          history[d].reduce((a, b) => a + b, 0) / history[d].length
        );
      }
    });

    const moodmonth =
      monthValues.length > 0
        ? monthValues.reduce((a, b) => a + b, 0) / monthValues.length
        : todayAvg;

    // ===========================
    //        อัปเดต Supabase
    // ===========================
    const { error: updateError } = await supabase
      .from("User")
      .update({
        mood: todayAvg,
        moodweek,
        moodmonth,
        todayMoods: history[today],
        dailyMoodHistory: history,
        lastMoodDate: today,
      })
      .eq("username", decoded.username);

    if (updateError) {
      console.error(updateError);
      return res.status(500).json({ success: false });
    }

    return res.json({
      success: true,
      today: todayAvg,
      moodweek,
      moodmonth,
      todayMoods: history[today]
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

export const getAllMoods = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from("User")
      .select("mood, moodweek, moodmonth, dailyMoodHistory")
      .eq("username", decoded.username)
      .single();

    
    console.log(user);
    console.log("Token:", token);
console.log("Decoded:", decoded);
console.log("Supabase user:", user, "Error:", error);


    if (error) return res.status(404).json({ success: false });

    return res.json({ success: true, ...user });

  } catch (err) {
    return res.status(500).json({ success: false });
  }
};

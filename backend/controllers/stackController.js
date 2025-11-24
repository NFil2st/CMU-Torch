import { supabase } from "../config/supabase.js";
import jwt from "jsonwebtoken";

// GET /getStack?type=food|exercise
export const getStack = async (req, res) => {
  try {
    const { type } = req.query; // "food" หรือ "exercise"
    if (!type || !["food", "exercise"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid type" });
    }

    // เลือก column ตาม type
    const stackColumn = type === "food" ? "stackFood" : "stackExercise";

    // ดึง Top 5 จาก Supabase
    const { data: users, error } = await supabase
      .from("User")
      .select(`username, name, major, ${stackColumn}`)
      .order(stackColumn, { ascending: false })
      .limit(5);

    if (error) {
      console.error("Supabase getStack error:", error);
      return res.status(500).json({ success: false, message: "Cannot fetch stack" });
    }

    // map ให้ชื่อ column เป็น stack
    const result = users.map(u => ({
      username: u.username,
      name: u.name,
      faculty: u.major,
      stack: u[stackColumn] || 0,
    }));

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

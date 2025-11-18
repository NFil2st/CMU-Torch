// controllers/exerciseController.js
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

export const completeExercise = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return res.status(401).json({ success: false, message: "Token missing or malformed" });
}

const token = authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ success: false });

    let decoded;
try {
  decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (err) {
  console.error("JWT Error:", err);
  return res.status(401).json({ success: false, message: "Invalid token" });
}


    const { data: user, error } = await supabase
      .from("User")
      .select("*")
      .eq("username", decoded.username)
      .single();

    if (error || !user) return res.status(404).json({ success: false });

    const today = new Date().toISOString().slice(0, 10);
    let newStack = 1; // เริ่มจาก 1
    if (user.lastExerciseDate === today && typeof user.stackExercise === "number") {
      // ถ้าออกกำลังกายวันนี้แล้ว → ไม่เพิ่มอีก
      return res.json({ success: true, stackExercise: user.stackExercise });
    } else if (user.stackExercise && typeof user.stackExercise === "number") {
      newStack = user.stackExercise + 1;
    }

    await supabase
      .from("User")
      .update({
        stackExercise: newStack,
        lastExerciseDate: today,
      })
      .eq("username", decoded.username);

    return res.json({ success: true, stackExercise: newStack });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};

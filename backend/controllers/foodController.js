// controllers/foodController.js
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

export const completeFood = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from("User")
      .select("*")
      .eq("username", decoded.username)
      .single();

    if (error || !user) return res.status(404).json({ success: false });

    const today = new Date().toISOString().slice(0, 10);
    let newStack = 1; // เริ่มจาก 1
    if (user.lastFoodDate === today && typeof user.stackFood === "number") {
      // ถ้าออกกำลังกายวันนี้แล้ว → ไม่เพิ่มอีก
      return res.json({ success: true, stackFood: user.stackFood });
    } else if (user.stackFood && typeof user.stackFood === "number") {
      newStack = user.stackFood + 1;
    }

    await supabase
      .from("User")
      .update({
        stackFood: newStack,
        lastFoodDate: today,
      })
      .eq("username", decoded.username);

    return res.json({ success: true, stackFood: newStack });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};


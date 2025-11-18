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

/**
 * @description: Controller สำหรับดึงรายการการออกกำลังกายทั้งหมด (สำหรับหน้าจอรายการ)
 * @route: GET /api/exercises/getExerciseList
 */
export const getExerciseList = async (req, res) => {
    try {
        // ** ลบข้อมูลจำลองออก และใช้ Supabase Client แทน **
        const { data: sports, error } = await supabase
            .from('sports') // ชื่อตารางของคุณตามภาพ
            .select('id, name'); // เลือกเฉพาะ id และ text (ชื่อกีฬา)

        if (error) {
            console.error('Supabase Query Error:', error);
            // ตรวจสอบ Error Code และส่ง Response กลับไป
            return res.status(500).json({ 
                message: "Failed to query Supabase database.", 
                error: error.message 
            });
        }
        
        // แปลงผลลัพธ์: Supabase จะส่งกลับ { id: 1, text: 'บาสเกตบอล' }
        // เราแปลงเป็น { id: 1, title: 'บาสเกตบอล' } เพื่อให้เข้ากันกับ Frontend
        const exercises = sports.map(sport => ({
            id: sport.id,
            title: sport.name,
            // category, icon, colors, ฯลฯ หากมีในตาราง สามารถ select มาได้
        }));

        res.status(200).json({
            message: "Successfully retrieved exercise list from Supabase.",
            // ส่งข้อมูลจริงที่ดึงมา
            data: exercises 
        });

    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ message: "An unexpected server error occurred.", error: error.message });
    }
};

// -----------------------------------------------------------------

/**
 * @description: Controller สำหรับดึงรายละเอียดการออกกำลังกายเฉพาะรายการ (ใช้ Query Parameter)
 * @route: GET /api/exercises/getExercise?id=X
 */
export const getExercise = async (req, res) => {
    try {
        const { mood } = req.query; // ดึงค่า mood tag จาก Query Parameter (เช่น 'สนุกสนาน', 'เครียด')

        if (!mood) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing 'mood' query parameter." 
            });
        }

        // 1. ดึงกีฬาทั้งหมดที่มี mood_tag ตรงกันจากตาราง 'sports'
        const { data: matchedExercises, error } = await supabase
            .from("sports")
            .select("id, name, mood_tag") // เลือกคอลัมน์ที่จำเป็น
            .eq("mood_tag", mood); // คัดกรองตาม mood_tag

        if (error) {
            console.error("Supabase Error fetching exercises:", error.message);
            return res.status(500).json({ 
                success: false, 
                message: "Failed to fetch exercise items.", 
                details: error.message 
            });
        }

        // 2. สุ่มเลือก 5 เมนู (กีฬา) จากรายการที่คัดกรองได้
        const shuffled = matchedExercises.sort(() => 0.5 - Math.random());
        const recommendedExercises = shuffled.slice(0, 5); // สุ่มมา 5 รายการ

        if (recommendedExercises.length === 0) {
            // หากไม่พบกีฬาที่ตรงกับอารมณ์
            return res.json({ 
                success: true, 
                exercise_items: [],
                message: `No exercises found for mood_tag: ${mood}`
            });
        }
        
        // 3. แปลงข้อมูลให้อยู่ในรูปแบบที่ Frontend เข้าใจ (เปลี่ยน 'text' เป็น 'title')
        const formattedExercises = recommendedExercises.map(item => ({
            id: item.id,
            title: item.name,
            mood_tag: item.mood_tag
            // เพิ่มคอลัมน์อื่นๆ ที่จำเป็น เช่น 'icon' ถ้ามีใน DB
        }));

        // 4. ส่งข้อมูลกีฬาที่สุ่มแล้วกลับไป
        return res.json({ 
            success: true, 
            exercise_items: formattedExercises 
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            success: false, 
            message: "Server error." 
        });
    }
};
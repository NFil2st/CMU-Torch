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
    if (typeof user.stackExercise === "number") {
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
        const exercises = (Array.isArray(sports) ? sports : []).map(sport => ({
            id: sport.id,
            title: sport.name,
            // ข้อมูลเสริมอื่นๆ
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
/**
 * @description: Controller สำหรับดึงสถานที่ออกกำลังกายตามชื่อกีฬา
 * @route: GET/POST /api/exercises/places?title=X
 */
export const getExercisePlaces = async (req, res) => {
  // รับชื่อกีฬาจาก Query Parameter (ถ้าใช้ GET) หรือ Body (ถ้าใช้ POST)
  const exerciseTitle = req.query.title || req.body.exerciseTitle; 

  if (!exerciseTitle) {
      return res.status(400).json({ 
          success: false, 
          message: "Missing 'title' or 'exerciseTitle' parameter." 
      });
  }

  try {
    // 1. ดึง sport_id จากตาราง 'sports'
    const { data: sportData, error: sportError } = await supabase
      .from('sports')
      .select('id')
      .eq('name', exerciseTitle)
      .single();

    if (sportError || !sportData) {
      if (sportError && sportError.code !== 'PGRST116') { // PGRST116 คือไม่พบข้อมูล
          console.error('Supabase Error fetching sport ID:', sportError);
          return res.status(500).json({ success: false, message: "Database query failed for sport ID." });
      }
      // ไม่พบกีฬา → ส่ง array ว่าง
      return res.json({ success: true, data: [], message: `Sport '${exerciseTitle}' not found.` });
    }

    const sportId = sportData.id;
    
    // 2. ดึง location_id ทั้งหมดจากตาราง 'sports_location' 
    const { data: sportLocationData, error: sportLocationError } = await supabase
      .from('sports_location')
      .select('location_id')
      .eq('sport_id', sportId);

    if (sportLocationError) {
      console.error('Supabase Error fetching sports_location:', sportLocationError);
      return res.status(500).json({ success: false, message: "Database query failed for sport locations link." });
    }

    const locationIds = sportLocationData.map(item => item.location_id);

    if (locationIds.length === 0) {
      return res.json({ success: true, data: [], message: `No locations linked to sport '${exerciseTitle}'.` });
    }

    // 3. ดึงข้อมูลสถานที่ (location) 
    const { data: locationsData, error: locationsError } = await supabase
      .from('locations')
      // เลือก name, open_time, close_time ตามที่คุณกำหนด
      .select('name, hours, latitude, longitude') 
      .in('id', locationIds);

    if (locationsError) {
      console.error('Supabase Error fetching locations:', locationsError);
      return res.status(500).json({ success: false, message: "Database query failed for locations data." });
    }

    // 4. แปลงรูปแบบข้อมูลให้เป็นตามที่ Frontend คาดหวัง
    const formattedPlaces = locationsData.map(location => ({
      name: location.name,
        hours: location.hours,
        latitude: location.latitude,
        longitude: location.longitude
    }));

    // 5. ส่ง Response สำเร็จ
    return res.json({ 
      success: true, 
      data: formattedPlaces,
      message: "Exercise places fetched successfully."
    });

  } catch (e) {
    console.error('Unexpected error in getExercisePlaces:', e);
    return res.status(500).json({ success: false, message: "An internal server error occurred." });
  }
};
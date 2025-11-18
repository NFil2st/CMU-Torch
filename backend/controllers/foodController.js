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

export const getFood = async (req, res) => {
  try {
    const { mood } = req.query; // ดึงค่า mood tag จาก Query Parameter

    if (!mood) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing 'mood' query parameter." 
        });
    }

    // 1. ดึงอาหารทั้งหมดที่มี mood_tag ตรงกัน
    const { data: matchedFoods, error } = await supabase
      .from("food_items")
      .select("id, name, mood_tag, goal_tag, imagea")
      .eq("mood_tag", mood); // คัดกรองตาม mood_tag

    if (error) {
      console.error("Supabase Error fetching food items:", error.message);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to fetch food items.", 
        details: error.message 
      });
    }

    // 2. สุ่มเลือก 5 เมนูจากรายการที่คัดกรองได้
    const shuffled = matchedFoods.sort(() => 0.5 - Math.random());
    const recommendedFoods = shuffled.slice(0, 5); // สุ่มมา 5 เมนู

    if (recommendedFoods.length === 0) {
        // หากไม่พบอาหารที่ตรงกับอารมณ์
        return res.json({ 
            success: true, 
            food_items: [],
            message: `No food found for mood_tag: ${mood}`
        });
    }

    // 3. ส่งข้อมูลอาหารที่สุ่มแล้วกลับไป
    return res.json({ 
      success: true, 
      food_items: recommendedFoods 
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      success: false, 
      message: "Server error." 
    });
  }
};

const goalTagMapping = {
    'increase': 'เพิ่มน้ำหนัก',
    'decrease': 'ลดน้ำหนัก',
    'general': 'ทั่วไป',
};

export const getFoodList = async (req, res) => { 
  try {
    const { mood, goal } = req.query; // ดึงค่า mood และ goal tag จาก Query Parameter

    if (!mood || !goal) {
        return res.status(400).json({ 
            success: false, 
            message: "Missing 'mood' or 'goal' query parameter." 
        });
    }

    // 1. แปลง Goal Tag เป็นภาษาไทย (เพื่อให้ตรงกับข้อมูลใน DB)
    const dbGoalTag = goalTagMapping[goal] || 'ทั่วไป'; // Default เป็น 'ทั่วไป'

    // 2. ดึงอาหารที่มี mood_tag และ goal_tag ตรงกัน
    const { data: matchedFoods, error } = await supabase
      .from("food_items")
      .select("id, name, mood_tag, goal_tag, imagea")
      .eq("mood_tag", mood)
      .or(`goal_tag.eq.${dbGoalTag},goal_tag.eq.ทั่วไป`); // กรองตาม Goal หรือ 'ทั่วไป'

    if (error) {
      console.error("Supabase Error fetching food items:", error.message);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to fetch food items.", 
        details: error.message 
      });
    }

    // 3. ส่งข้อมูลอาหารกลับไป
    return res.json({ 
      success: true, 
      food_items: matchedFoods 
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      success: false, 
      message: "Server error." 
    });
  }
};
export const getFoodLocations = async (req, res) => {
    try {
        const { food_id } = req.query; // ดึง food_id จาก Query Parameter

        if (!food_id) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing 'food_id' query parameter." 
            });
        }

        // 1. ดึงข้อมูล location_id จากตาราง food_locations ที่ตรงกับ food_item_id
        const { data: foodLocations, error: foodLocError } = await supabase
            .from("food_locations")
            .select("location_id")
            .eq("food_item_id", food_id);

        if (foodLocError) {
            console.error("Supabase Error fetching food_locations:", foodLocError.message);
            return res.status(500).json({ 
                success: false, 
                message: "Failed to fetch food locations mapping.", 
                details: foodLocError.message 
            });
        }

        if (foodLocations.length === 0) {
            return res.json({ 
                success: true, 
                locations: [],
                message: `No locations found for food_item_id: ${food_id}`
            });
        }

        // 2. ดึง location_id ทั้งหมดเพื่อนำไปใช้ค้นหาในตาราง locations
        const locationIds = foodLocations.map(item => item.location_id);

        // 3. ดึงข้อมูลสถานที่ (latitude, longitude, name) จากตาราง locations
        const { data: locations, error: locError } = await supabase
            .from("locations")
            .select("id, name, latitude, longitude") // ดึงคอลัมน์ที่จำเป็น
            .in("id", locationIds); // กรองตาม location_id ที่ได้มา

        if (locError) {
            console.error("Supabase Error fetching locations:", locError.message);
            return res.status(500).json({ 
                success: false, 
                message: "Failed to fetch location details.", 
                details: locError.message 
            });
        }

        // 4. ส่งข้อมูลสถานที่กลับไป (อาจจะต้องมีการเรียงลำดับตามระยะทางเพื่อให้ front-end เลือกที่ใกล้สุด)
        return res.json({ 
            success: true, 
            locations: locations 
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            success: false, 
            message: "Server error." 
        });
    }
};
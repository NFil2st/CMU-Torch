// controllers/scanController.js
import multer from "multer";
import axios from "axios";
import fs from "fs";
// import { supabase } from "../config/supabase.js"; // 💡 นำเข้า Supabase ถ้าคุณจะบันทึกผลลัพธ์

// ----------------------------------------------------
// *** การตั้งค่า Roboflow และ Multer ***
// ----------------------------------------------------
// ⚠️ ควรเก็บ Key ไว้ใน .env file และเปลี่ยนชื่อตัวแปรให้ตรง
// controllers/scanController.js

// ... (Imports และ Constants ยังคงเดิม)

// *** เปลี่ยนค่า ROBOFLOW_WORKFLOW_URL ***
// รูปแบบ URL สำหรับการเรียก Workflow โดยตรง
const ROBOFLOW_WORKFLOW_URL = "https://detect.roboflow.com/workflow/find-drinks-steaks-shrimp-eggs-chickens-salmon-porks-noodles-rice-creams-desserts-and-breads-3"; 
const ROBOFLOW_API_KEY = "rcfCtxxbiWonyMK1fmce"; // Key จาก .env
const upload = multer({ dest: "../uploads/" });
// ...

/**
 * @desc    [INITIATOR] รับรูปภาพจาก Mobile App และส่งไปยัง Roboflow 
 * เพื่อเริ่ม Workflow แบบ Asynchronous (Webhook)
 * @route   POST /api/scan-food
 */
export const scanFood = async (req, res) => {
    const { file, body } = req;
    
    if (!file) {
        return res.status(400).json({ success: false, message: "No image file provided." });
    }
    
    // ... (โค้ดดึง foodId, foodName)
    
    try {
        const imageBase64 = fs.readFileSync(file.path, { encoding: 'base64' });

        // 2. สร้าง URL สำหรับ Roboflow Workflow
        // 💡 การเรียก Roboflow แบบนี้มักจะใช้รูปแบบ 'detect.roboflow.com/workflow/...'
        const roboflowUploadUrl = `${ROBOFLOW_WORKFLOW_URL}?api_key=${ROBOFLOW_API_KEY}`;

        // 3. ส่งรูปภาพไปยัง Roboflow (Asynchronous Call)
        await axios.post(
            roboflowUploadUrl,
            imageBase64,
            { 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );
        
        fs.unlinkSync(file.path); 

        return res.status(202).json({ 
            success: true, 
            message: "Scan request accepted. Results will be delivered asynchronously." 
        });

    } catch (error) {
        // ... (โค้ดจัดการ error ยังคงเดิม)
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        // 💡 หากเป็น 500 ต่อ ให้ตรวจสอบว่า URL ถูกต้อง หรือว่าเกิดปัญหา permissions ในการลบไฟล์
        return res.status(500).json({ 
            success: false, 
            message: "Failed to initiate Roboflow scan. Check API key/URL or server logs." 
        });
    }
};

// ... (handleRoboflowWebhook และ upload export ยังคงเดิม)

/**
 * @desc    [RECEIVER] Handles the Roboflow Webhook notification containing scan results.
 * @route   POST /api/roboflow/webhook
 */
export const handleRoboflowWebhook = async (req, res) => {
   try {
        const roboflowPayload = req.body;
        
        // 1. ตรวจสอบว่ามีข้อมูลผลลัพธ์การทำนายหรือไม่
        const predictions = roboflowPayload.predictions || roboflowPayload.results?.predictions; 
        
        if (!predictions || predictions.length === 0) {
            console.log("Roboflow Webhook received, but no predictions found.");
            // 💡 ถ้าไม่พบอะไร เราควรบันทึกสถานะ 'No Result' เพื่อให้ Frontend ที่ Polling/Websocket ทราบ
            return res.status(200).json({ success: true, message: "No predictions." });
        }

        // 2. ดึงข้อมูลที่จำเป็นและประมวลผล
        const detectedFoods = predictions.map(p => ({
            name: p.class, 
            confidence: p.confidence, 
        }));

        // 3. (สำคัญ) บันทึกผลลัพธ์ลง DB เพื่อให้ Frontend ดึงไปแสดงผล
        // ในโลกจริง คุณจะต้องใช้ ID เฉพาะ (เช่น scan_id) ที่สร้างใน startScan 
        // เพื่อเชื่อมโยงผลลัพธ์นี้กับผู้ใช้ที่กำลังรอ
        // ตัวอย่าง: await supabase.from('scan_results').update({ status: 'completed', results: detectedFoods }).eq('id', roboflowPayload.scanId);
        
        console.log(`Successfully processed Roboflow Webhook. Found ${detectedFoods.length} items.`);

        // 4. ส่งสถานะ 200 กลับไปให้ Roboflow (ยืนยันการรับข้อมูล)
        return res.status(200).json({ 
            success: true, 
            detected_items: detectedFoods 
        });

    } catch (error) {
        console.error("Error processing Roboflow Webhook:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
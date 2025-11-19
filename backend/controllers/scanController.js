import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const upload = multer({ dest: "../uploads/" });

export const scanFood = async (req, res) => {
  try {
    const imgPath = req.file.path;
    console.log("📸 Received image:", imgPath);

    const apiKey = process.env.ROBOFLOW_API_KEY;
    if (!apiKey) throw new Error("❌ Missing ROBOFLOW_API_KEY in .env");

    const modelURL = `https://detect.roboflow.com/food-r9pba/4?api_key=${apiKey}`;

    const form = new FormData();
    form.append("file", fs.createReadStream(imgPath));

    const rfRes = await axios.post(modelURL, form, {
      headers: {
        ...form.getHeaders()
      }
    });
console.log("📥 Roboflow Raw Response:", JSON.stringify(rfRes.data, null, 2));

// --- แก้ไขโค้ดตรงนี้ ---
// เปลี่ยนจาก: const predictions = rfRes.data.outputs?.[0]?.predictions || [];
// เป็น:
const rawPredictions = rfRes.data.predictions || []; 
const classNames = rawPredictions.map(p => p.class);
// ----------------------

fs.unlinkSync(imgPath);

    return res.json({ success: true, predictions: classNames });
  } catch (err) {
    console.error("❌ Scan error:", err.response?.data || err.message || err);
    return res.status(500).json({ success: false, message: "Scan failed" });
  }
};

import multer from "multer";
import axios from "axios";
import fs from "fs";

const upload = multer({ dest: "../uploads/" });

export const scanFood = async (req, res) => {
  try {
    const imgPath = req.file.path;
    console.log("📸 Received image:", imgPath);

    // อ่านไฟล์เป็น base64
    const imageBase64 = fs.readFileSync(imgPath, { encoding: "base64" });
    console.log("🧬 Base64 length:", imageBase64.length);

    // ส่ง request เข้า Roboflow workflow
 const rfRes = await axios.post(
  "https://detect.roboflow.com/fff-hw4wm/workflows/find-drinks-steaks-shrimp-eggs-chickens-salmon-porks-noodles-rice-creams-desserts-and-breads-3?api_key=rcfCtxxbiWonyMK1fmce",

  {
    inputs: {
          image: { type: "base64", value: imageBase64 }
    }
  },
  {
    headers: { "Content-Type": "application/json" }
  }
);

    console.log("📥 Roboflow Raw Response:", JSON.stringify(rfRes.data, null, 2));

    // ดึง predictions
    const predictions = rfRes.data.outputs?.[0]?.predictions || [];
    const classNames = predictions.map(p => p.class);

    // ลบไฟล์ชั่วคราว
    fs.unlinkSync(imgPath);

    // ส่งกลับ frontend
    return res.json({
      success: true,
      predictions: classNames
    });

  } catch (err) {
    console.error("❌ Scan error:", err.response?.data || err);
    return res.status(500).json({ success: false, message: "Scan failed" });
  }
};

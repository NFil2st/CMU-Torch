import multer from "multer";
import axios from "axios";
import fs from "fs";

const upload = multer({ dest: "../uploads/" });

export const scanFood = async (req, res) => {
   try {
    const imgPath = req.file.path;

    console.log("📸 Received image:", imgPath);

    // อ่านเป็น Base64
    const imageBase64 = fs.readFileSync(imgPath, { encoding: "base64" });

    console.log("🧬 Base64 length:", imageBase64.length);

    // ส่งเข้า Roboflow
    console.log("🚀 Sending request to Roboflow…");

    const rfRes = await axios.post(
      "https://serverless.roboflow.com/fff-hw4wm/workflows/find-drinks-steaks-shrimp-eggs-chickens-salmon-porks-noodles-rice-creams-desserts-and-breads-2",
      {
        api_key: "rcfCtxxbiWonyMK1fmce",
        inputs: {
          image: { type: "base64", value: imageBase64 }
        }
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("📥 Roboflow Raw Response:", JSON.stringify(rfRes.data, null, 2));

    // ดึงผลลัพธ์
    const predictions = rfRes.data.outputs?.[0]?.predictions || [];

    console.log("🔍 Predictions:", predictions);

    // ลบไฟล์ทิ้ง
    fs.unlinkSync(imgPath);

    // ส่งให้ frontend
    // return res.json({
    //   success: true,
    //   predictions,
    //   raw: rfRes.data, // ถ้าอยากให้ frontend debug ด้วย
    // });

    // predictions = [ {...}, {...} ]

// ดึง object predictions
const predictionsObj = rfRes.data.outputs?.[0]?.predictions || {};

// ดึง array ข้างใน
const predictionsArray = predictionsObj.predictions || [];

// แปลงเป็น array ของ class name
const classNames = predictionsArray.map(p => p.class);

// ส่งกลับ frontend
return res.json({
  success: true,
  predictions: classNames, // array ของ string
});



  } catch (err) {
    console.error("❌ Scan error:", err.response?.data || err);
    return res.status(500).json({ success: false, message: "Scan failed" });
  }
};
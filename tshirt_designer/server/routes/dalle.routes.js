// server/routes/dalle.routes.js
import express from "express";
import axios from "axios";
const router = express.Router();

const PY_AI_URL = "http://localhost:8000/generate";

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Missing prompt" });

    const r = await axios.post(PY_AI_URL, { prompt }, { timeout: 180000000 });
    const photo = r.data?.photo;
    if (!photo) return res.status(502).json({ message: "No image from generator" });

    res.status(200).json({ photo });
  } catch (err) {
    const status = err?.response?.status || 500;
    res.status(status).json({ message: "Image generation failed" });
  }
});

export default router;

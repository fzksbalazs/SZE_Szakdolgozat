import express from 'express';
import * as dotenv from 'dotenv';
import {Configuration, OpenAIApi} from 'openai';
import cors from 'cors';

dotenv.config();

const router = express.Router();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,


  
});

const openai = new OpenAIApi(config);

router.route('/').get((req, res) => {
  res.send('Hello from DALL-E route');
});

router.route('/').post(async (req,res) => {
  try {
    const {prompt} = req.body;

    const response = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });
    const image = response.data?.data?.[0]?.b64_json;
    if (!image) {
      console.error("OpenAI response had no image:", response.data);
      return res.status(502).json({ message: "No image returned from OpenAI" });
    }

    res.status(200).json({ photo: image });
  } catch (err) {
    // írd ki, mi a valódi hiba (kulcs hiány, kvóta, stb.)
    const detail = err?.response?.data || err?.message || String(err);
    console.error("OpenAI error:", detail);
    res.status(500).json({ message: "Something went wrong", detail });
  }
});

export default router; 
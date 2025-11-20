import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import dalleRoutes from "./routes/dalle.routes.js";




dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://ai-szerver.onrender.com",  
      "https://wearable-3d.vercel.app", 
      "https://wearable-rust.vercel.app/designer?productId=1&color=%23ffffff&logoUrl=&mode=logo#",

    ],
    methods: ["GET", "POST"],
    credentials: false,
  })
);
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/dalle", dalleRoutes);

app.get("/", (req, res) => {
  res.send("Hello from tshirt designer");
});

app.listen(8080, () => console.log("A szerver fut a 8080-as porton"));

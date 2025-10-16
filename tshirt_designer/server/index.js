import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import dalleRoutes from "./routes/dalle.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/dalle", dalleRoutes);

app.get("/", (req, res) => {
  res.send("Hello from tshirt designer");
});

app.listen(8080, () => console.log("A szerver fut a 8080-as porton"));

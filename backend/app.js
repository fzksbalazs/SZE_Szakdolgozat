const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
var cors = require("cors");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const cartRoute = require("./routes/cart");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const emailRoutes = require("./routes/emailRoutes");

const cloudinary = require("cloudinary");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://wearable-3d.vercel.app",
  "https://wearable-rust.vercel.app",
];


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error("CORS blocked: " + origin));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.post("https://wearable-rira.onrender.com/api/debug/echo", (req, res) => {
  return res.json({
    hasBody: !!req.body,
    keys: req.body ? Object.keys(req.body) : null,
    preview: req.body?.imageDataUrl?.slice(0, 30),
  });
});

app.post("https://wearable-rira.onrender.com/api/custom/upload", async (req, res) => {
  try {
    console.log("Upload hit. headers:", req.headers);

    const { imageDataUrl, productId } = req.body || {};
    if (
      !imageDataUrl ||
      !/^data:image\/(png|jpeg);base64,/.test(imageDataUrl)
    ) {
      return res.status(400).json({ message: "Invalid imageDataUrl" });
    }

    const result = await cloudinary.uploader.upload(imageDataUrl, {
      folder: "custom-prints",
      overwrite: true,
      resource_type: "image",
      format: "png",
      public_id: `custom_${Date.now()}`,
    });

    console.log("Cloudinary OK:", result.secure_url);
    return res.json({
      url: result.secure_url,
      public_id: result.public_id,
      productId,
    });
  } catch (e) {
    console.error("Cloudinary upload error:", e);
    return res.status(500).json({ message: "Cloudinary upload failed" });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB csatlakozás sikeresen megtörtént!"))
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);
app.use("/api/emails", emailRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend szerver fut!");
});

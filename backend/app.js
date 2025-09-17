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

const cloudinary= require("cloudinary");


dotenv.config(); //env fileból toltes

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // .env
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --------- új endpoint: PNG dataURL → Cloudinary ---------
app.post("/api/upload-image", async (req, res) => {
  try {
    const { dataUrl } = req.body;
    if (!dataUrl || !dataUrl.startsWith("data:image/"))
      return res.status(400).json({ message: "Hiányzó vagy hibás dataUrl" });

    const upload = await cloudinary.v2.uploader.upload(dataUrl, {
      folder: "custom-shirts",
      overwrite: false,
    });

    return res.json({ url: upload.secure_url, public_id: upload.public_id });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({ message: "Upload failed" });
  }
});



mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB csatlakozás sikeresen megtörtént!"))
  .catch((err) => {
    console.log(err);
  });

  app.use(cors()); //Google miatt kell + frontend backend osszekotes
  app.use(express.json({limit: "10mb"}));

  
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
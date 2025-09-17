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


app.post("/api/custom/upload", async (req, res) => {
  try {
    const { imageDataUrl, productId } = req.body;
    if (!imageDataUrl) return res.status(400).json({ message: "Missing image" });

    const { secure_url } = await cloudinary.uploader.upload(imageDataUrl, {
      folder: "custom-tshirts",
      overwrite: true,
    });

    return res.json({ url: secure_url, productId });
  } catch (err) {
    console.error(err);
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
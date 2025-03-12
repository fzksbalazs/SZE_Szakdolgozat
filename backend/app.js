const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
var cors = require("cors");


dotenv.config(); //env fileból toltes




mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB csatlakozás sikeresen megtörtént!"))
  .catch((err) => {
    console.log(err);
  });

  app.use(cors()); //Google miatt kell + frontend backend osszekotes
  app.use(express.json());


  app.listen(process.env.PORT || 5000, () => {
    console.log("Backend szerver fut!");
  });
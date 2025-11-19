const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

console.log("SENDGRID KEY LOADED:", process.env.SENDGRID_API_KEY);




router.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    // 🔥 EMAIL CHECK
    const userEmail = req.body.email;
    if (!userEmail) {
      return res.status(200).json({
        savedOrder,
        warning: "Order saved but email was missing.",
      });
    }

   
    const productListHtml = savedOrder.products
      .map((p) => {
        return `
          <div style="display:flex; align-items:center; margin-bottom:12px;">

            <div>
              <div><strong>${p.title}</strong></div>
              <div>Mennyiség: ${p.quantity} db</div>
              <div>Ár: ${p.price} Ft/db</div>
            </div>
          </div>
        `;
      })
      .join("");

    const msg = {
      to: userEmail,
      from: process.env.EMAIL_USER,
      subject: "Rendelés visszaigazolása - Wearable",
      html: `
        <div style="font-family:Arial; padding:20px; color:#222;">
          <h2>Köszönjük a rendelésed!</h2>

          <p>Kedves Vásárló,</p>
          <p>A rendelésed sikeresen rögzítettük.</p>

          <h3>Rendelés azonosító:</h3>
          <p><strong>${savedOrder._id}</strong></p>

          <h3>Megrendelt termékek:</h3>
          <div style="margin-top:10px; padding:15px; background:#f7f7f7; border-radius:10px;">
            ${productListHtml}
          </div>

          <h3>Végösszeg:</h3>
          <p style="font-size:20px; font-weight:bold;">${savedOrder.amount} Ft</p>

          <hr/>
          <p style="font-size:13px; color:#777;">Ez egy automatikus email. Ne válaszolj rá.</p>
        </div>
      `,
    };

    await sgMail.send(msg);

    res.status(200).json(savedOrder);
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json(err);
  }
});

// ----------------- ORDER UPDATE -----------------
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ----------------- DELETE -----------------
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// ----------------- USER'S ORDERS -----------------
router.get("/find/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ----------------- GET ALL -----------------
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ----------------- STATS -----------------
router.get("/stats", async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $project: { month: { $month: "$createdAt" } } },
      { $group: { _id: "$month", total: { $sum: 1 } } },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

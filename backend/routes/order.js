const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const router = require("express").Router();

router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    try {
  const userEmail = req.body.email || req.body.address.email; // ha Stripe címet küld

  const productListHtml = savedOrder.products
    .map((p) => {
      return `
      <div style="display:flex; align-items:center; margin-bottom:12px;">
        <img src="${p.img}" width="70" style="border-radius:8px; margin-right:14px;" />
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
        <p>Köszönjük, hogy a <strong>Wearable</strong> webshopot választottad!  
        Az alábbi rendelésedet sikeresen rögzítettük.</p>

        <h3>Rendelés adatai</h3>
        <p><strong>Rendelés azonosító:</strong> ${savedOrder._id}</p>
        <p><strong>Dátum:</strong> ${new Date(savedOrder.createdAt).toLocaleString("hu-HU")}</p>

        <h3>Megrendelt termékek:</h3>
        <div style="margin-top:10px; padding:15px; background:#f7f7f7; border-radius:10px;">
          ${productListHtml}
        </div>

        <h3>Végösszeg:</h3>
        <p style="font-size:20px; font-weight:bold;">${savedOrder.amount} Ft</p>

        <br/>
        <p>Hamarosan értesítést kapsz, ha a csomagodat átadtuk a futárnak.</p>

        <hr/>
        <p style="font-size:13px; color:#777;">Ez egy automatikus üzenet. Kérdés esetén vedd fel velünk a kapcsolatot.</p>
      </div>
    `,
  };

  await sgMail.send(msg);

} catch (emailErr) {
  console.error("❌ Email sending error:", emailErr);
}
    res.status(200).json(savedOrder);
  } catch (err) {}
});

router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id",  async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/find/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get("/",  async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/stats", async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 }, 
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/income",  async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: prevMonth }
        }
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          salesAmount: "$amount",        
          salesCount: { $sum: 1 }       
        }
      },
      {
        $group: {
          _id: "$month",
          totalRevenue: { $sum: "$salesAmount" }, 
          totalCount: { $sum: 1 }                 
        }
      },
      { $sort: { _id: 1 } }   
    ]);

    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/sales/:productId",  async (req, res) => {
  const productId = req.params.productId;

  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const sales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastYear },
          "products.productId": productId
        }
      },
      {
        $unwind: "$products"
      },
      {
        $match: {
          "products.productId": productId
        }
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          quantity: "$products.quantity"
        }
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$quantity" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json(err);
  }
});






module.exports = router;



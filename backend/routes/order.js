const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {}
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
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

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get("/", verifyTokenAndAdmin, async (req, res) => {
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

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
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

router.get("/sales/:productId", verifyTokenAndAdmin, async (req, res) => {
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



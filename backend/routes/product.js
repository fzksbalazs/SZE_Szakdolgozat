const Product = require("../models/product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

router.post("/create", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  const qGender = req.query.gender; // 🔹 új: nem szerinti szűrés

  try {
    let products;

    if (qNew) {
      // 🔹 Legújabb termék
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory && qGender) {
      // 🔹 Kategória ÉS nem alapján
      products = await Product.find({
        categories: { $in: [qCategory] },
        gender: qGender,
      });
    } else if (qCategory) {
      // 🔹 Csak kategória alapján
      products = await Product.find({
        categories: { $in: [qCategory] },
      });
    } else if (qGender) {
      // 🔹 Csak nem alapján
      products = await Product.find({ gender: qGender });
    } else {
      // 🔹 Alapértelmezett: összes termék
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Product GET error:", err);
    res.status(500).json(err);
  }
});


module.exports = router;

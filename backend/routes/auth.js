const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


//REGISTER
function validatePassword(password) {
  const errors = [];

  if (!password) errors.push("A jelszó megadása kötelező.");
  else {
    if (password.length < 8)
      errors.push("A jelszónak legalább 8 karakter hosszúnak kell lennie.");
    if (!/[A-Z]/.test(password))
      errors.push("A jelszónak tartalmaznia kell legalább egy nagybetűt.");
    if (!/[a-z]/.test(password))
      errors.push("A jelszónak tartalmaznia kell legalább egy kisbetűt.");
    if (!/[0-9]/.test(password))
      errors.push("A jelszónak tartalmaznia kell legalább egy számjegyet.");
  
  }

  return errors;
}

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1️⃣ Alap mezőellenőrzés
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Az összes mező kitöltése kötelező!" });
    }

    // 2️⃣ Ellenőrizd, hogy az email vagy a felhasználónév foglalt-e
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Felhasználónév vagy email már létezik" });
    }

    // 3️⃣ Jelszó validáció
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        message: "Password validation failed",
        errors: passwordErrors,
      });
    }

    // 4️⃣ Új user létrehozása és titkosítás
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.PASS_SEC
    ).toString();

    const newUser = new User({
      username,
      email,
      password: encryptedPassword,
    });

    const savedUser = await newUser.save();

    // 5️⃣ Ne küldjük vissza a jelszót
    const { password: pw, ...others } = savedUser._doc;

    res.status(201).json({
      message: "User registered successfully",
      user: others,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json("Wrong username or password!");
    }

    // Jelszó dekódolása és ellenőrzése
    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== req.body.password) {
      return res.status(401).json("Wrong username or password!");
    }

    // JWT token generálása
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

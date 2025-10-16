const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const nodemailer = require('nodemailer');



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

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // 1️⃣ Ellenőrizzük, hogy létezik-e a felhasználó az email cím alapján
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Nincs felhasználó ezzel az email címmel." });
    }

    // 2️⃣ Generálunk egy egyedi reset token-t
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // A token 1 órán belül lejár
    await user.save();

    // 3️⃣ Beállítjuk a nodemailer küldést (smtp konfiguráció)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 4️⃣ Reset link küldése az emailhez
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await transporter.sendMail({
      to: email,
      subject: 'Jelszó visszaállítása',
      html: `<p>Kattints az alábbi linkre a jelszó visszaállításához:</p><p><a href="${resetUrl}">Visszaállítás</a></p>`,
    });

    res.status(200).json({ message: "Egy emailt küldtünk a jelszó visszaállításához." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Hiba történt a jelszó visszaállítása során." });
  }
});

// 2. Jelszó visszaállítása (új jelszó beállítása)
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // 1️⃣ Ellenőrizzük a reset token érvényességét
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }, // Győződjünk meg róla, hogy a token nem járt le
    });

    if (!user) {
      return res.status(400).json({ message: "Érvénytelen vagy lejárt token." });
    }

    // 2️⃣ Titkosítjuk az új jelszót
    const encryptedPassword = CryptoJS.AES.encrypt(newPassword, process.env.PASS_SEC).toString();
    user.password = encryptedPassword;
    user.resetToken = undefined; // Token törlése
    user.resetTokenExpiration = undefined; // Token lejárati idő törlése
    await user.save();

    res.status(200).json({ message: "A jelszót sikeresen visszaállítottuk." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Hiba történt a jelszó visszaállítása során." });
  }
});

module.exports = router;

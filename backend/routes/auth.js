const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Az összes mező kitöltése kötelező!" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Felhasználónév vagy email már létezik" });
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        message: "Password validation failed",
        errors: passwordErrors,
      });
    }

    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.PASS_SEC,
    ).toString();

    const newUser = new User({
      username,
      email,
      password: encryptedPassword,
    });

    const savedUser = await newUser.save();

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

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json("Wrong username or password!");
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC,
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== req.body.password) {
      return res.status(401).json("Wrong username or password!");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" },
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
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Nincs felhasználó ezzel az email címmel." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Jelszó visszaállítása",
      html: `<p>Kattints az alábbi linkre a jelszó visszaállításához:</p><p><a href="${resetUrl}">Visszaállítás</a></p>`,
    });

    res
      .status(200)
      .json({ message: "Egy emailt küldtünk a jelszó visszaállításához." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Hiba történt a jelszó visszaállítása során." });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Érvénytelen vagy lejárt token." });
    }

    const encryptedPassword = CryptoJS.AES.encrypt(
      newPassword,
      process.env.PASS_SEC,
    ).toString();
    user.password = encryptedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "A jelszót sikeresen visszaállítottuk." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Hiba történt a jelszó visszaállítása során." });
  }
});

module.exports = router;

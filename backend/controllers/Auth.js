import User from "../models/UserModel.js";
import argon2 from "argon2";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const Login = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    // Log token & secret yang dipakai
    console.log("🔐 RECAPTCHA_SECRET:", process.env.RECAPTCHA_SECRET);
    console.log("🔒 Token dari frontend:", token);

    // Verifikasi reCAPTCHA ke Google
    const params = new URLSearchParams();
    params.append("secret", process.env.RECAPTCHA_SECRET);
    params.append("response", token);

    const response = await axios.post("https://www.google.com/recaptcha/api/siteverify", params);

    // Log respon Google
    console.log("🧠 Google Response:", response.data);

    if (!response.data.success) {
      console.log("⚠️ Error verifikasi:", response.data["error-codes"]);
      return res.status(400).json({ msg: "Verifikasi reCAPTCHA gagal", error: response.data });
    }

    // Proses login setelah lolos reCAPTCHA
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const match = await argon2.verify(user.password, password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });

    req.session.userId = user.uuid;
    const { uuid, name, role } = user;

    console.log(`✅ [LOGIN] User ${email} berhasil login sebagai ${role}`);
    res.status(200).json({ uuid, name, email, role });

  } catch (error) {
    console.error("❌ [LOGIN ERROR]:", error.message);
    res.status(500).json({ msg: "Terjadi kesalahan di server", error: error.message });
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confPassword, role = "user" } = req.body;

  if (password !== confPassword)
    return res.status(400).json({ msg: "Password dan konfirmasi tidak cocok" });

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ msg: "Email sudah digunakan" });

    const hashPassword = await argon2.hash(password);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role, // default role bisa user
    });

    console.log(`✅ [REGISTER] ${email} berhasil didaftarkan`);
    res.status(201).json({ msg: "Registrasi berhasil, silakan login" });
  } catch (error) {
    console.error("❌ [REGISTER ERROR]:", error.message);
    res.status(500).json({ msg: "Gagal registrasi", error: error.message });
  }
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
  }

  const user = await User.findOne({
    attributes: ['uuid', 'name', 'email', 'role'],
    where: { uuid: req.session.userId }
  });

  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  res.status(200).json(user);
};

export const logOut = (req, res) => {
  console.log(`👋 [LOGOUT] User ${req.session.userId} sedang logout`);

  req.session.destroy((err) => {
    if (err) {
      console.error("❌ [LOGOUT ERROR]:", err.message);
      return res.status(400).json({ msg: "Tidak dapat logout" });
    }

    console.log("✅ [LOGOUT] Berhasil logout dan session dihancurkan");
    res.status(200).json({ msg: "Anda telah logout" });
  });
};

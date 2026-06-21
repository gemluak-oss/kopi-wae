const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "kopi_wae_secret_key_2024";

const register = async (req, res) => {
  const { user_name, email, password, no_hp } = req.body;

  if (!user_name || !email || !password) {
    return res.status(400).json({ message: "Nama, email, dan password wajib diisi" });
  }

  const checkEmail = "SELECT id_user FROM USER WHERE email = ?";
  db.query(checkEmail, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Error server", error: err });
    if (results.length > 0) return res.status(400).json({ message: "Email sudah terdaftar" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertUser = "INSERT INTO USER (user_name, email, password, role, no_hp) VALUES (?, ?, ?, ?, ?)";
    db.query(insertUser, [user_name, email, hashedPassword, "user", no_hp || null], (err) => {
      if (err) return res.status(500).json({ message: "Gagal mendaftar", error: err });
      res.status(201).json({ message: "Registrasi berhasil" });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  const query = "SELECT * FROM USER WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Error server", error: err });
    if (results.length === 0) return res.status(400).json({ message: "Email atau password salah" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Email atau password salah" });

    const token = jwt.sign({ id: user.id_user, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login berhasil",
      token,
      user: { id: user.id_user, name: user.user_name, email: user.email, role: user.role, no_hp: user.no_hp },
    });
  });
};

module.exports = { register, login };

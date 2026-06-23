const jwt = require("jsonwebtoken");
const JWT_SECRET = "kopi_wae_secret_key_2024";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan, silakan login" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("ISI TOKEN:", decoded); // ✅ TAROH DISINI
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid, silakan login ulang" });
  }
};

module.exports = authMiddleware;

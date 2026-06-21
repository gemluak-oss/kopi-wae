const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// 1. IMPORT RUTE
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

// 2. BIKIN MESIN EXPRESS
const app = express();
const PORT = 5000;

// 3. MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 4. MULTER CONFIG
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// 5. SERVE UPLOADS FOLDER
app.use("/uploads", express.static("uploads"));

// 6. UPLOAD ENDPOINT
app.post("/api/upload", upload.single("gambar"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Gagal upload" });
  res.json({ url: `http://localhost:5000/uploads/${req.file.filename}` });
});

// 7. DAFTARKAN RUTE
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Server Kopi Wae API berjalan dengan baik!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

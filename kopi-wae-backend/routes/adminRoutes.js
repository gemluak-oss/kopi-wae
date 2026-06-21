const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db");

// Protect all admin routes
router.use(authMiddleware);

// Dashboard
router.get("/dashboard", adminController.getDashboardStats);

// Kategori
router.get("/kategori", adminController.getAllKategori);
router.post("/kategori", adminController.tambahKategori);
router.put("/kategori/:id", adminController.editKategori);
router.delete("/kategori/:id", adminController.hapusKategori);

// Produk
router.get("/produk", adminController.getAllProdukAdmin);
router.post("/produk", adminController.tambahProduk);
router.put("/produk/:id", adminController.editProduk);

// GANTI DELETE PRODUK JADI:
router.delete("/produk/:id", (req, res) => {
  const { id } = req.params;

  // Hapus detail transaksi dulu
  db.query("DELETE FROM DETAIL_TRANSAKSI WHERE id_kopi = ?", [id], (err) => {
    // Hapus item keranjang
    db.query("DELETE FROM ITEM_KERANJANG WHERE id_kopi = ?", [id], (err) => {
      // Baru hapus produk
      db.query("DELETE FROM KOPI WHERE id_kopi = ?", [id], (err) => {
        if (err) return res.status(500).json({ message: "Gagal menghapus produk", error: err });
        res.json({ message: "Produk berhasil dihapus" });
      });
    });
  });
});

// Pesanan
router.get("/pesanan", adminController.getAllPesanan);
router.put("/pesanan/:id", adminController.updateStatusPesanan);

// Users - GET
router.get("/users", (req, res) => {
  const { role } = req.query;
  let query = "SELECT id_user, user_name, email, role, no_hp, foto FROM USER";
  const params = [];
  if (role && role !== "semua") {
    query += " WHERE role = ?";
    params.push(role);
  }
  query += " ORDER BY id_user DESC";
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json({ data: results });
  });
});

// Users - POST
router.post("/users", async (req, res) => {
  const { user_name, email, password, role, no_hp } = req.body;
  if (!user_name || !email || !password) return res.status(400).json({ message: "Nama, email, password wajib" });
  const bcrypt = require("bcryptjs");
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  db.query("INSERT INTO USER (user_name, email, password, role, no_hp) VALUES (?, ?, ?, ?, ?)", [user_name, email, hashed, role || "user", no_hp || null], (err) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.status(201).json({ message: "User ditambahkan" });
  });
});

// Users - PUT
router.put("/users/:id", async (req, res) => {
  const { user_name, email, password, role, no_hp, foto } = req.body;
  if (password) {
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    db.query("UPDATE USER SET user_name=?, email=?, password=?, role=?, no_hp=?, foto=? WHERE id_user=?", [user_name, email, hashed, role, no_hp, foto || null, req.params.id], (err) => {
      if (err) return res.status(500).json({ message: "Error" });
      res.json({ message: "User diupdate" });
    });
  } else {
    db.query("UPDATE USER SET user_name=?, email=?, role=?, no_hp=?, foto=? WHERE id_user=?", [user_name, email, role, no_hp, foto || null, req.params.id], (err) => {
      if (err) return res.status(500).json({ message: "Error" });
      res.json({ message: "User diupdate" });
    });
  }
});

// Users - DELETE
router.delete("/users/:id", (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM USER WHERE role = 'admin'", (err, result) => {
    if (err) return res.status(500).json({ message: "Error" });
    db.query("SELECT role FROM USER WHERE id_user = ?", [req.params.id], (err, user) => {
      if (err || user.length === 0) return res.status(500).json({ message: "Error" });
      if (user[0].role === "admin" && result[0].total <= 1) {
        return res.status(400).json({ message: "Tidak bisa menghapus admin terakhir!" });
      }
      db.query("DELETE FROM USER WHERE id_user = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: "Error" });
        res.json({ message: "User dihapus" });
      });
    });
  });
});

// Laporan
router.get("/laporan", adminController.getLaporanPenjualan);

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db");

// Auth (public)
router.post("/register", authController.register);
router.post("/login", authController.login);

// Produk (public)
router.get("/beranda", userController.getBerandaProduk);
router.get("/produk", userController.getMenuProduk);
router.get("/produk/:id", userController.getDetailProduk);

// Kategori (public)
router.get("/kategori", (req, res) => {
  db.query("SELECT * FROM KATEGORI ORDER BY nama_kategori", (err, results) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    res.json({ data: results });
  });
});

// ============ PROTECTED ROUTES ============

// Profil
router.get("/profil/:userId", authMiddleware, (req, res) => {
  db.query("SELECT id_user, user_name, email, role, no_hp, foto FROM USER WHERE id_user = ?", [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ data: results[0] });
  });
});

router.put("/profil/:userId", authMiddleware, (req, res) => {
  const { user_name, email, no_hp, foto } = req.body;
  db.query("UPDATE USER SET user_name = ?, email = ?, no_hp = ?, foto = ? WHERE id_user = ?", [user_name, email, no_hp || null, foto || null, req.params.userId], (err) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    res.json({ message: "Profil berhasil diupdate" });
  });
});

// Keranjang
router.get("/keranjang/:userId", authMiddleware, userController.getKeranjangUser);
router.post("/keranjang", authMiddleware, userController.addToKeranjang);
router.put("/keranjang/:id", authMiddleware, (req, res) => {
  const { qty } = req.body;
  if (qty <= 0) {
    db.query("DELETE FROM ITEM_KERANJANG WHERE id_itemkeranjang = ?", [req.params.id], (err) => {
      if (err) return res.status(500).json({ message: "Error" });
      res.json({ message: "Item dihapus" });
    });
  } else {
    db.query("UPDATE ITEM_KERANJANG SET qty = ? WHERE id_itemkeranjang = ?", [qty, req.params.id], (err) => {
      if (err) return res.status(500).json({ message: "Error" });
      res.json({ message: "Jumlah diupdate" });
    });
  }
});
router.delete("/keranjang/:id", authMiddleware, (req, res) => {
  db.query("DELETE FROM ITEM_KERANJANG WHERE id_itemkeranjang = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json({ message: "Item dihapus" });
  });
});

// Checkout
router.post("/checkout", authMiddleware, userController.prosesCheckout);

// History
router.get("/history/:userId", authMiddleware, userController.getHistoryTransaksi);

module.exports = router;

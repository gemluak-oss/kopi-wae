const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db");

// ==================== AUTH (PUBLIC) ====================
router.post("/register", authController.register);
router.post("/login", authController.login);

// ==================== PRODUK (PUBLIC) ====================
router.get("/beranda", userController.getBerandaProduk);
router.get("/produk", userController.getMenuProduk);
router.get("/produk/:id", userController.getDetailProduk);

// ==================== KATEGORI (PUBLIC) ====================
router.get("/kategori", (req, res) => {
  db.query("SELECT * FROM KATEGORI ORDER BY nama_kategori", (err, results) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json({ data: results });
  });
});

// ==================== VOUCHER ====================

// Get voucher aktif (public)
router.get("/voucher/aktif", (req, res) => {
  db.query("SELECT kode, diskon_persen, max_diskon, min_belanja FROM VOUCHER WHERE kuota > 0 LIMIT 5", (err, results) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json({ data: results });
  });
});

// Cek validasi voucher (protected)
router.post("/voucher", authMiddleware, (req, res) => {
  const { kode, subtotal } = req.body;

  db.query("SELECT * FROM VOUCHER WHERE kode = ? AND kuota > 0", [kode.toUpperCase()], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: "Voucher tidak valid" });

    const v = results[0];

    if (subtotal < v.min_belanja)
      return res.status(400).json({
        message: `Minimal belanja Rp ${v.min_belanja}`,
      });

    let diskon = (subtotal * v.diskon_persen) / 100;
    if (v.max_diskon && diskon > v.max_diskon) diskon = v.max_diskon;

    res.json({ data: { ...v, diskon } });
  });
});

// Kurangi kuota voucher setelah checkout berhasil (protected)
router.put("/voucher/kurang/:kode", authMiddleware, (req, res) => {
  const { kode } = req.params;
  const kodeUpper = kode.toUpperCase();

  console.log(`[VOUCHER] Mengurangi kuota: ${kodeUpper}`);

  // Cek dulu voucher masih ada
  db.query("SELECT * FROM VOUCHER WHERE kode = ?", [kodeUpper], (err, results) => {
    if (err) {
      console.error("[VOUCHER] Error cek:", err);
      return res.status(500).json({ message: "Error server" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Voucher tidak ditemukan" });
    }

    const voucher = results[0];

    if (voucher.kuota <= 0) {
      return res.status(400).json({ message: "Kuota voucher sudah habis" });
    }

    // Kurangi kuota
    db.query("UPDATE VOUCHER SET kuota = kuota - 1 WHERE kode = ?", [kodeUpper], (err2, result) => {
      if (err2) {
        console.error("[VOUCHER] Error update:", err2);
        return res.status(500).json({ message: "Gagal update voucher" });
      }

      console.log(`[VOUCHER] Sukses: ${kodeUpper}, sisa kuota: ${voucher.kuota - 1}`);

      res.json({
        success: true,
        message: "Kuota voucher berhasil dikurangi",
        sisa_kuota: voucher.kuota - 1,
      });
    });
  });
});

// ==================== PROFIL ====================
router.get("/profil/:userId", authMiddleware, (req, res) => {
  db.query("SELECT id_user, user_name, email, role, no_hp, foto FROM USER WHERE id_user = ?", [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error" });
    if (results.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ data: results[0] });
  });
});

router.put("/profil/:userId", authMiddleware, (req, res) => {
  const { user_name, email, no_hp, foto } = req.body;
  db.query("UPDATE USER SET user_name = ?, email = ?, no_hp = ?, foto = ? WHERE id_user = ?", [user_name, email, no_hp || null, foto || null, req.params.userId], (err) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json({ message: "Profil berhasil diupdate" });
  });
});

// ==================== KERANJANG ====================
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

// ==================== CHECKOUT ====================
router.post("/checkout", authMiddleware, userController.prosesCheckout);

// ==================== HISTORY ====================
router.get("/history/:userId", authMiddleware, userController.getHistoryTransaksi);

module.exports = router;

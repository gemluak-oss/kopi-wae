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

router.get("/voucher/aktif", (req, res) => {
  const userId = req.query.userId || "guest";
  const query = `
    SELECT v.*, 
      COALESCE(vu.total_pakai, 0) as sudah_dipakai,
      CASE WHEN COALESCE(vu.total_pakai, 0) >= v.max_usage_per_user THEN 1 ELSE 0 END as kuota_habis
    FROM VOUCHER v
    LEFT JOIN (SELECT id_voucher, COUNT(*) as total_pakai FROM VOUCHER_USAGE WHERE id_user = ? GROUP BY id_voucher) vu ON v.id_voucher = vu.id_voucher
    WHERE v.kuota > 0 LIMIT 5
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json({ data: results });
  });
});

router.post("/voucher", authMiddleware, (req, res) => {
  const { kode, subtotal, userId } = req.body;
  db.query(
    `SELECT v.*, COALESCE(vu.total_pakai, 0) as sudah_dipakai
     FROM VOUCHER v
     LEFT JOIN (SELECT id_voucher, COUNT(*) as total_pakai FROM VOUCHER_USAGE WHERE id_user = ? GROUP BY id_voucher) vu ON v.id_voucher = vu.id_voucher
     WHERE v.kode = ? AND v.kuota > 0`,
    [userId, kode.toUpperCase()],
    (err, results) => {
      if (err || results.length === 0) return res.status(400).json({ message: "Voucher tidak valid" });
      const v = results[0];
      if (v.sudah_dipakai >= v.max_usage_per_user) return res.status(400).json({ message: `Kamu sudah pakai voucher ini ${v.max_usage_per_user}x` });
      if (subtotal < v.min_belanja) return res.status(400).json({ message: `Minimal belanja Rp ${Number(v.min_belanja).toLocaleString("id-ID")}` });
      let diskon = (subtotal * v.diskon_persen) / 100;
      if (v.max_diskon && diskon > v.max_diskon) diskon = v.max_diskon;
      res.json({ data: { ...v, diskon } });
    },
  );
});

router.put("/voucher/kurang/:kode", authMiddleware, (req, res) => {
  const { kode } = req.params;
  const kodeUpper = kode.toUpperCase();
  const userId = req.user?.id;
  db.query("SELECT * FROM VOUCHER WHERE kode = ?", [kodeUpper], (err, results) => {
    if (err) return res.status(500).json({ message: "Error server" });
    if (results.length === 0) return res.status(404).json({ message: "Voucher tidak ditemukan" });
    const voucher = results[0];
    if (voucher.kuota <= 0) return res.status(400).json({ message: "Kuota voucher sudah habis" });
    db.query("UPDATE VOUCHER SET kuota = kuota - 1 WHERE kode = ?", [kodeUpper], (err2) => {
      if (err2) return res.status(500).json({ message: "Gagal update voucher" });
      db.query("INSERT INTO VOUCHER_USAGE (id_user, id_voucher) VALUES (?, ?)", [userId, voucher.id_voucher], (err3) => {
        if (err3) console.error("Gagal catat voucher usage:", err3);
      });
      // ✅ SSE
      const notifySSE = req.app.get("notifySSE");
      if (notifySSE) notifySSE("voucherUpdate", { message: "Voucher digunakan" });
      res.json({ success: true, message: "Voucher berhasil digunakan", sisa_kuota: voucher.kuota - 1 });
    });
  });
});

router.get("/voucher/history/:userId", authMiddleware, (req, res) => {
  db.query(`SELECT vu.*, v.kode, v.diskon_persen FROM VOUCHER_USAGE vu JOIN VOUCHER v ON vu.id_voucher = v.id_voucher WHERE vu.id_user = ? ORDER BY vu.digunakan_pada DESC`, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json({ data: results });
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
    // ✅ SSE
    const notifySSE = req.app.get("notifySSE");
    if (notifySSE) notifySSE("profilUpdate", { userId: req.params.userId });
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
      // ✅ SSE
      const notifySSE = req.app.get("notifySSE");
      if (notifySSE) notifySSE("keranjangUpdate", { userId: req.user?.id });
      res.json({ message: "Item dihapus" });
    });
  } else {
    db.query("UPDATE ITEM_KERANJANG SET qty = ? WHERE id_itemkeranjang = ?", [qty, req.params.id], (err) => {
      if (err) return res.status(500).json({ message: "Error" });
      // ✅ SSE
      const notifySSE = req.app.get("notifySSE");
      if (notifySSE) notifySSE("keranjangUpdate", { userId: req.user?.id });
      res.json({ message: "Jumlah diupdate" });
    });
  }
});

router.delete("/keranjang/:id", authMiddleware, (req, res) => {
  db.query("DELETE FROM ITEM_KERANJANG WHERE id_itemkeranjang = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Error" });
    // ✅ SSE
    const notifySSE = req.app.get("notifySSE");
    if (notifySSE) notifySSE("keranjangUpdate", { userId: req.user?.id });
    res.json({ message: "Item dihapus" });
  });
});

// ==================== CHECKOUT ====================
router.post("/checkout", authMiddleware, userController.prosesCheckout);

// ==================== HISTORY ====================
router.get("/history/detail/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  db.query(`SELECT t.*, p.metode_pembayaran FROM TRANSAKSI t LEFT JOIN PEMBAYARAN p ON t.id_transaksi = p.id_transaksi WHERE t.id_transaksi = ?`, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error" });
    if (results.length === 0) return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    const order = results[0];
    db.query(`SELECT dt.*, k.nama_kopi, k.gambar FROM DETAIL_TRANSAKSI dt JOIN KOPI k ON dt.id_kopi = k.id_kopi WHERE dt.id_transaksi = ?`, [id], (err2, items) => {
      if (err2) return res.status(500).json({ message: "Error" });
      order.items = items;
      res.json({ data: order });
    });
  });
});

router.get("/history/:userId", authMiddleware, userController.getHistoryTransaksi);

module.exports = router;

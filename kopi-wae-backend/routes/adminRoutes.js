const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const db = require("../config/db");

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
router.delete("/produk/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM DETAIL_TRANSAKSI WHERE id_kopi = ?", [id], (err) => {
    db.query("DELETE FROM ITEM_KERANJANG WHERE id_kopi = ?", [id], (err) => {
      db.query("DELETE FROM KOPI WHERE id_kopi = ?", [id], (err) => {
        if (err) return res.status(500).json({ message: "Gagal menghapus produk" });
        res.json({ message: "Produk berhasil dihapus" });
      });
    });
  });
});

// Pesanan
router.get("/pesanan", adminController.getAllPesanan);
router.put("/pesanan/:id", adminController.updateStatusPesanan);

// Users
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

router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT COUNT(*) AS total FROM USER WHERE role = 'admin'", (err, result) => {
    if (err) return res.status(500).json({ message: "Error" });
    db.query("SELECT role FROM USER WHERE id_user = ?", [id], (err, user) => {
      if (err || user.length === 0) return res.status(500).json({ message: "Error" });
      if (user[0].role === "admin" && result[0].total <= 1) return res.status(400).json({ message: "Tidak bisa menghapus admin terakhir!" });
      db.query("DELETE FROM DETAIL_TRANSAKSI WHERE id_transaksi IN (SELECT id_transaksi FROM TRANSAKSI WHERE id_user = ?)", [id], (err) => {
        db.query("DELETE FROM PEMBAYARAN WHERE id_transaksi IN (SELECT id_transaksi FROM TRANSAKSI WHERE id_user = ?)", [id], (err) => {
          db.query("DELETE FROM TRANSAKSI WHERE id_user = ?", [id], (err) => {
            db.query("DELETE FROM ITEM_KERANJANG WHERE id_keranjang IN (SELECT id_keranjang FROM KERANJANG WHERE id_user = ?)", [id], (err) => {
              db.query("DELETE FROM KERANJANG WHERE id_user = ?", [id], (err) => {
                db.query("DELETE FROM USER WHERE id_user = ?", [id], (err) => {
                  if (err) return res.status(500).json({ message: "Error" });
                  res.json({ message: "User dihapus" });
                });
              });
            });
          });
        });
      });
    });
  });
});

// ==================== VOUCHER ====================

// GET all voucher dengan statistik
router.get("/voucher", (req, res) => {
  db.query(
    `SELECT v.*, 
      COUNT(vu.id_usage) as total_digunakan,
      COUNT(DISTINCT vu.id_user) as total_user
     FROM VOUCHER v
     LEFT JOIN VOUCHER_USAGE vu ON v.id_voucher = vu.id_voucher
     GROUP BY v.id_voucher
     ORDER BY v.id_voucher DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error" });
      res.json({ data: results });
    },
  );
});

// POST tambah voucher
router.post("/voucher", (req, res) => {
  const { kode, diskon_persen, max_diskon, min_belanja, kuota, max_usage_per_user } = req.body;
  if (!kode || !diskon_persen) return res.status(400).json({ message: "Kode & diskon wajib" });

  db.query(
    "INSERT INTO VOUCHER (kode, diskon_persen, max_diskon, min_belanja, kuota, max_usage_per_user) VALUES (?, ?, ?, ?, ?, ?)",
    [kode.toUpperCase(), diskon_persen, max_diskon || null, min_belanja || 0, kuota || 100, max_usage_per_user || 1],
    (err) => {
      if (err) return res.status(500).json({ message: "Error" });
      res.status(201).json({ message: "Voucher ditambahkan" });
    },
  );
});

// PUT update voucher
router.put("/voucher/:id", (req, res) => {
  const { kode, diskon_persen, max_diskon, min_belanja, kuota, max_usage_per_user } = req.body;
  db.query(
    "UPDATE VOUCHER SET kode=?, diskon_persen=?, max_diskon=?, min_belanja=?, kuota=?, max_usage_per_user=? WHERE id_voucher=?",
    [kode.toUpperCase(), diskon_persen, max_diskon, min_belanja, kuota, max_usage_per_user || 1, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: "Error" });
      res.json({ message: "Voucher diupdate" });
    },
  );
});

// DELETE voucher
router.delete("/voucher/:id", (req, res) => {
  db.query("DELETE FROM VOUCHER_USAGE WHERE id_voucher = ?", [req.params.id], (err) => {
    db.query("DELETE FROM VOUCHER WHERE id_voucher = ?", [req.params.id], (err) => {
      if (err) return res.status(500).json({ message: "Error" });
      res.json({ message: "Voucher dihapus" });
    });
  });
});

// Laporan
router.get("/laporan", adminController.getLaporanPenjualan);

module.exports = router;

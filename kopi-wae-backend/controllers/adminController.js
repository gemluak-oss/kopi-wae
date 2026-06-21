const db = require("../config/db");

// =====================================================================
// DASHBOARD
// =====================================================================
const getDashboardStats = (req, res) => {
  const qPendapatan = "SELECT SUM(total_harga) AS total FROM TRANSAKSI WHERE status_pesanan = 'selesai'";
  const qPesanan = "SELECT COUNT(*) AS total FROM TRANSAKSI";
  const qProduk = "SELECT COUNT(*) AS total FROM KOPI";
  const qTerbaru = `
    SELECT t.id_transaksi, u.user_name as pelanggan, t.total_harga, t.status_pesanan, t.tgl_transaksi 
    FROM TRANSAKSI t 
    JOIN USER u ON t.id_user = u.id_user 
    ORDER BY t.tgl_transaksi DESC LIMIT 5
  `;
  const qTopKopi = `
    SELECT k.nama_kopi, SUM(dt.qty) AS total_terjual
    FROM DETAIL_TRANSAKSI dt
    JOIN KOPI k ON dt.id_kopi = k.id_kopi
    JOIN TRANSAKSI t ON dt.id_transaksi = t.id_transaksi
    WHERE t.status_pesanan = 'selesai'
    GROUP BY k.id_kopi
    ORDER BY total_terjual DESC
    LIMIT 5
  `;

  db.query(qPendapatan, (err1, resPendapatan) => {
    db.query(qPesanan, (err2, resPesanan) => {
      db.query(qProduk, (err3, resProduk) => {
        db.query(qTerbaru, (err4, resTerbaru) => {
          db.query(qTopKopi, (err5, resTopKopi) => {
            if (err1 || err2 || err3 || err4 || err5) return res.status(500).json({ pesan: "Gagal mengambil data dashboard." });
            res.json({
              pendapatan: resPendapatan[0].total || 0,
              pesanan_baru: resPesanan[0].total || 0,
              total_produk: resProduk[0].total || 0,
              pesanan_terbaru: resTerbaru || [],
              top_kopi: resTopKopi || [],
            });
          });
        });
      });
    });
  });
};

// =====================================================================
// KATEGORI
// =====================================================================
const getAllKategori = (req, res) => {
  db.query("SELECT * FROM KATEGORI ORDER BY nama_kategori", (err, results) => {
    if (err) return res.status(500).json({ pesan: "Error database" });
    res.json({ data: results });
  });
};

const tambahKategori = (req, res) => {
  const { nama_kategori } = req.body;
  if (!nama_kategori) return res.status(400).json({ pesan: "Nama kategori wajib diisi" });
  db.query("INSERT INTO KATEGORI (nama_kategori) VALUES (?)", [nama_kategori], (err) => {
    if (err) return res.status(500).json({ pesan: "Gagal menambah kategori" });
    res.status(201).json({ pesan: "Kategori ditambahkan!" });
  });
};

const editKategori = (req, res) => {
  const { nama_kategori } = req.body;
  db.query("UPDATE KATEGORI SET nama_kategori = ? WHERE id_kategori = ?", [nama_kategori, req.params.id], (err) => {
    if (err) return res.status(500).json({ pesan: "Gagal mengupdate kategori" });
    res.json({ pesan: "Kategori diupdate!" });
  });
};

const hapusKategori = (req, res) => {
  db.query("DELETE FROM KATEGORI WHERE id_kategori = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ pesan: "Gagal menghapus kategori" });
    res.json({ pesan: "Kategori dihapus!" });
  });
};

// =====================================================================
// PRODUK
// =====================================================================
const getAllProdukAdmin = (req, res) => {
  const sql = `
    SELECT KOPI.*, KATEGORI.nama_kategori 
    FROM KOPI 
    JOIN KATEGORI ON KOPI.id_kategori = KATEGORI.id_kategori
    ORDER BY KOPI.id_kopi DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ pesan: "Error saat mengambil data produk" });
    res.json({ data: results });
  });
};

const tambahProduk = (req, res) => {
  const { id_kategori, nama_kopi, harga_kopi, stok, stok_minimal, gambar } = req.body;
  if (!id_kategori || !nama_kopi || !harga_kopi) {
    return res.status(400).json({ pesan: "Kategori, nama, dan harga wajib diisi" });
  }
  const sql = "INSERT INTO KOPI (id_kategori, nama_kopi, harga_kopi, stok, stok_minimal, gambar) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [id_kategori, nama_kopi, harga_kopi, stok || 0, stok_minimal || 0, gambar || null], (err) => {
    if (err) return res.status(500).json({ pesan: "Gagal menambah produk" });
    res.status(201).json({ pesan: "Produk berhasil ditambahkan!" });
  });
};

const editProduk = (req, res) => {
  const { id_kategori, nama_kopi, harga_kopi, stok, stok_minimal, gambar } = req.body;
  const sql = "UPDATE KOPI SET id_kategori=?, nama_kopi=?, harga_kopi=?, stok=?, stok_minimal=?, gambar=? WHERE id_kopi=?";
  db.query(sql, [id_kategori, nama_kopi, harga_kopi, stok, stok_minimal, gambar || null, req.params.id], (err) => {
    if (err) return res.status(500).json({ pesan: "Gagal mengupdate produk" });
    res.json({ pesan: "Produk diupdate!" });
  });
};

const hapusProduk = (req, res) => {
  db.query("DELETE FROM KOPI WHERE id_kopi = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ pesan: "Gagal menghapus produk" });
    res.json({ pesan: "Produk dihapus!" });
  });
};

// =====================================================================
// PESANAN & LAPORAN
// =====================================================================
const getAllPesanan = (req, res) => {
  const query = `
    SELECT t.*, u.user_name as pelanggan, pm.metode_pembayaran
    FROM TRANSAKSI t 
    JOIN USER u ON t.id_user = u.id_user 
    LEFT JOIN PEMBAYARAN pm ON t.id_transaksi = pm.id_transaksi
    ORDER BY t.tgl_transaksi DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    res.json({ data: results });
  });
};

const updateStatusPesanan = (req, res) => {
  const { id } = req.params;
  const { status_pesanan } = req.body;
  db.query("UPDATE TRANSAKSI SET status_pesanan = ? WHERE id_transaksi = ?", [status_pesanan, id], (err) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    res.json({ message: "Status diupdate!" });
  });
};

const getLaporanPenjualan = (req, res) => {
  const query = `
    SELECT DATE(tgl_transaksi) as tanggal, COUNT(*) as jumlah, SUM(total_harga) as total
    FROM TRANSAKSI WHERE status_pesanan = 'selesai'
    GROUP BY DATE(tgl_transaksi) ORDER BY tanggal DESC LIMIT 30
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    res.json({ data: results });
  });
};

module.exports = {
  getDashboardStats,
  getAllKategori,
  tambahKategori,
  editKategori,
  hapusKategori,
  getAllProdukAdmin,
  tambahProduk,
  editProduk,
  hapusProduk,
  getAllPesanan,
  updateStatusPesanan,
  getLaporanPenjualan,
};

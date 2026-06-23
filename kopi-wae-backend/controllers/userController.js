const db = require("../config/db");

// ==================== PRODUK ====================
const getBerandaProduk = (req, res) => {
  const query = `
    SELECT k.*, kt.nama_kategori 
    FROM KOPI k 
    JOIN KATEGORI kt ON k.id_kategori = kt.id_kategori 
    ORDER BY k.id_kopi DESC LIMIT 8
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    res.json({ data: results });
  });
};

const getMenuProduk = (req, res) => {
  const { kategori, search } = req.query;
  let query = `
    SELECT k.*, kt.nama_kategori 
    FROM KOPI k 
    JOIN KATEGORI kt ON k.id_kategori = kt.id_kategori WHERE 1=1
  `;
  const params = [];
  if (kategori) {
    query += " AND k.id_kategori = ?";
    params.push(kategori);
  }
  if (search) {
    query += " AND k.nama_kopi LIKE ?";
    params.push(`%${search}%`);
  }
  query += " ORDER BY k.id_kopi DESC";

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    res.json({ data: results });
  });
};

const getDetailProduk = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT k.*, kt.nama_kategori 
    FROM KOPI k JOIN KATEGORI kt ON k.id_kategori = kt.id_kategori 
    WHERE k.id_kopi = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Produk tidak ditemukan" });
    res.json({ data: results[0] });
  });
};

// ==================== KERANJANG ====================
const getKeranjangUser = (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT ik.id_itemkeranjang, ik.qty, k.id_kopi, k.nama_kopi, k.harga_kopi, k.gambar,
    (ik.qty * k.harga_kopi) AS subtotal
    FROM KERANJANG kr
    JOIN ITEM_KERANJANG ik ON kr.id_keranjang = ik.id_keranjang
    JOIN KOPI k ON ik.id_kopi = k.id_kopi
    WHERE kr.id_user = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    const total = results.reduce((sum, item) => sum + item.subtotal, 0);
    res.json({ data: { items: results, total } });
  });
};

const addToKeranjang = (req, res) => {
  const { userId, kopiId, qty } = req.body;
  if (!userId || !kopiId || !qty) return res.status(400).json({ message: "userId, kopiId, qty wajib diisi" });

  const cari = "SELECT id_keranjang FROM KERANJANG WHERE id_user = ?";
  db.query(cari, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error", error: err });

    const proses = (idKeranjang) => {
      const cek = "SELECT id_itemkeranjang FROM ITEM_KERANJANG WHERE id_keranjang = ? AND id_kopi = ?";
      db.query(cek, [idKeranjang, kopiId], (err, items) => {
        if (err) return res.status(500).json({ message: "Error", error: err });
        if (items.length > 0) {
          db.query("UPDATE ITEM_KERANJANG SET qty = qty + ? WHERE id_itemkeranjang = ?", [qty, items[0].id_itemkeranjang], (err) => {
            if (err) return res.status(500).json({ message: "Error", error: err });
            res.json({ message: "Jumlah diupdate" });
          });
        } else {
          db.query("INSERT INTO ITEM_KERANJANG (id_keranjang, id_kopi, qty) VALUES (?, ?, ?)", [idKeranjang, kopiId, qty], (err) => {
            if (err) return res.status(500).json({ message: "Error", error: err });
            res.status(201).json({ message: "Item ditambahkan" });
          });
        }
      });
    };

    if (results.length === 0) {
      db.query("INSERT INTO KERANJANG (id_user) VALUES (?)", [userId], (err, result) => {
        if (err) return res.status(500).json({ message: "Error", error: err });
        proses(result.insertId);
      });
    } else {
      proses(results[0].id_keranjang);
    }
  });
};

// ==================== CHECKOUT ====================
const prosesCheckout = (req, res) => {
  // ✅ Ambil diskon & total dari FE
  const { userId, metodePembayaran, diskon, total: totalDariFE } = req.body;
  if (!userId) return res.status(400).json({ message: "userId wajib diisi" });

  const getCart = `
    SELECT ik.id_kopi, ik.qty, k.harga_kopi, k.nama_kopi, k.stok
    FROM KERANJANG kr
    JOIN ITEM_KERANJANG ik ON kr.id_keranjang = ik.id_keranjang
    JOIN KOPI k ON ik.id_kopi = k.id_kopi
    WHERE kr.id_user = ?
  `;

  db.query(getCart, [userId], (err, items) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    if (items.length === 0) return res.status(400).json({ message: "Keranjang kosong" });

    for (let item of items) {
      if (item.qty > item.stok) return res.status(400).json({ message: `Stok ${item.nama_kopi} tidak cukup` });
    }

    const subtotal = items.reduce((sum, i) => sum + i.qty * i.harga_kopi, 0);

    // ✅ Pake total dari FE kalo ada, kalo ga hitung sendiri
    const totalHarga = totalDariFE || subtotal + 10000 - (diskon || 0);

    db.query("INSERT INTO TRANSAKSI (id_user, tgl_transaksi, total_harga, status_pesanan) VALUES (?, NOW(), ?, ?)", [userId, totalHarga, "menunggu"], (err, result) => {
      if (err) return res.status(500).json({ message: "Error", error: err });
      const idTransaksi = result.insertId;

      items.forEach((item) => {
        const sub = item.qty * item.harga_kopi;
        db.query("INSERT INTO DETAIL_TRANSAKSI (id_transaksi, id_kopi, qty, harga_saat_ini, subtotal) VALUES (?, ?, ?, ?, ?)", [idTransaksi, item.id_kopi, item.qty, item.harga_kopi, sub]);
        db.query("UPDATE KOPI SET stok = stok - ? WHERE id_kopi = ?", [item.qty, item.id_kopi]);
      });

      const metode = metodePembayaran || "Transfer Bank";
      db.query("INSERT INTO PEMBAYARAN (id_transaksi, metode_pembayaran, tgl_pembayaran, status_pembayaran) VALUES (?, ?, NOW(), ?)", [idTransaksi, metode, "selesai"]);

      db.query("DELETE FROM ITEM_KERANJANG WHERE id_keranjang = (SELECT id_keranjang FROM KERANJANG WHERE id_user = ?)", [userId]);

      res.status(201).json({
        message: "Checkout berhasil",
        id_transaksi: idTransaksi,
        total: totalHarga,
        diskon: diskon || 0,
      });
    });
  });
};

// ==================== HISTORY ====================
const getHistoryTransaksi = (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT t.id_transaksi, t.id_user, t.tgl_transaksi, t.total_harga, t.status_pesanan,
      pm.metode_pembayaran, pm.status_pembayaran,
      COUNT(dt.id_detail) as total_item
    FROM TRANSAKSI t
    LEFT JOIN PEMBAYARAN pm ON t.id_transaksi = pm.id_transaksi
    LEFT JOIN DETAIL_TRANSAKSI dt ON t.id_transaksi = dt.id_transaksi
    WHERE t.id_user = ?
    GROUP BY t.id_transaksi, t.id_user, t.tgl_transaksi, t.total_harga, t.status_pesanan, pm.metode_pembayaran, pm.status_pembayaran
    ORDER BY t.tgl_transaksi DESC
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error", error: err });
    res.json({ data: results });
  });
};

module.exports = {
  getBerandaProduk,
  getMenuProduk,
  getDetailProduk,
  getKeranjangUser,
  addToKeranjang,
  prosesCheckout,
  getHistoryTransaksi,
};

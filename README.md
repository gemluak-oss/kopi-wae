# Kopi Wae - Coffee Shop Website

Website pemesanan kopi online fullstack dengan React, Express, dan MySQL.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express.js + Node.js
- **Database:** MySQL
- **Auth:** JWT (JSON Web Token)
- **Upload:** Multer

## Struktur Project

```text
kopi-wae/
├── kopi-wae-backend/        # Backend Express
│   ├── config/              # Konfigurasi database
│   ├── controllers/         # Logic endpoint
│   ├── middleware/          # Auth middleware
│   ├── routes/              # API routes
│   ├── uploads/             # Upload folder
│   ├── index.js             # Entry point
│   └── package.json
│
├── project-web-coffee-shop/ # Frontend React
│   ├── src/
│   │   ├── pages/           # Halaman admin & user
│   │   ├── layouts/         # Layout admin & user
│   │   └── utils/           # API config
│   ├── public/
│   └── package.json
│
└── README.md
```

## Fitur

### User

- Register & Login
- Home (produk terbaru)
- List produk + filter kategori
- Detail produk
- Keranjang (CRUD)
- Voucher diskon
- Checkout
- Riwayat transaksi
- Profil + upload foto
- Popup logout
- Limit pemakaian voucher per user
- Notifikasi voucher sukses/gagal di checkout

### Admin

- Dashboard dengan statistik & top kopi
- Manajemen kategori (CRUD)
- Manajemen produk (CRUD) + upload gambar
- Manajemen pesanan (update status)
- Manajemen voucher (CRUD) + limit per user + statistik pemakaian
- Manajemen pengguna (CRUD) + upload foto
- Laporan penjualan + grafik + export CSV
- Profil admin + upload foto
- Popup logout

## Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/gemluak-oss/kopi-wae.git
cd kopi-wae
```

### 2. Setup Database

Buat database baru di MySQL:

```sql
CREATE DATABASE db_kopi_wae;
```

Jalankan script SQL berikut untuk membuat tabel:

```sql
-- USER table
CREATE TABLE USER (
    id_user INT NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    no_hp VARCHAR(20),
    foto VARCHAR(500),
    PRIMARY KEY (id_user)
);

-- KATEGORI table
CREATE TABLE KATEGORI (
    id_kategori INT NOT NULL AUTO_INCREMENT,
    nama_kategori VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_kategori)
);

-- KOPI table
CREATE TABLE KOPI (
    id_kopi INT NOT NULL AUTO_INCREMENT,
    id_kategori INT NOT NULL,
    nama_kopi VARCHAR(255) NOT NULL,
    harga_kopi DECIMAL(10,2) NOT NULL,
    stok INT NOT NULL DEFAULT 0,
    stok_minimal INT NOT NULL DEFAULT 0,
    gambar VARCHAR(500),
    PRIMARY KEY (id_kopi),
    FOREIGN KEY (id_kategori) REFERENCES KATEGORI(id_kategori)
);

-- KERANJANG table
CREATE TABLE KERANJANG (
    id_keranjang INT NOT NULL AUTO_INCREMENT,
    id_user INT NOT NULL,
    PRIMARY KEY (id_keranjang),
    FOREIGN KEY (id_user) REFERENCES USER(id_user) ON DELETE CASCADE
);

-- ITEM_KERANJANG table
CREATE TABLE ITEM_KERANJANG (
    id_itemkeranjang INT NOT NULL AUTO_INCREMENT,
    id_keranjang INT NOT NULL,
    id_kopi INT NOT NULL,
    qty INT NOT NULL DEFAULT 1,
    PRIMARY KEY (id_itemkeranjang),
    FOREIGN KEY (id_keranjang) REFERENCES KERANJANG(id_keranjang) ON DELETE CASCADE,
    FOREIGN KEY (id_kopi) REFERENCES KOPI(id_kopi) ON DELETE CASCADE
);

-- TRANSAKSI table
CREATE TABLE TRANSAKSI (
    id_transaksi INT NOT NULL AUTO_INCREMENT,
    id_user INT NOT NULL,
    tgl_transaksi DATETIME NOT NULL,
    total_harga DECIMAL(10,2) NOT NULL,
    status_pesanan VARCHAR(100) NOT NULL DEFAULT 'menunggu',
    PRIMARY KEY (id_transaksi),
    FOREIGN KEY (id_user) REFERENCES USER(id_user)
);

-- DETAIL_TRANSAKSI table
CREATE TABLE DETAIL_TRANSAKSI (
    id_detail INT NOT NULL AUTO_INCREMENT,
    id_transaksi INT NOT NULL,
    id_kopi INT NOT NULL,
    qty INT NOT NULL,
    harga_saat_ini DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_detail),
    FOREIGN KEY (id_transaksi) REFERENCES TRANSAKSI(id_transaksi),
    FOREIGN KEY (id_kopi) REFERENCES KOPI(id_kopi)
);

-- PEMBAYARAN table
CREATE TABLE PEMBAYARAN (
    id_pembayaran INT NOT NULL AUTO_INCREMENT,
    id_transaksi INT NOT NULL,
    metode_pembayaran VARCHAR(100) NOT NULL,
    tgl_pembayaran DATETIME NOT NULL,
    status_pembayaran VARCHAR(100) NOT NULL DEFAULT 'selesai',
    PRIMARY KEY (id_pembayaran),
    FOREIGN KEY (id_transaksi) REFERENCES TRANSAKSI(id_transaksi)
);

-- VOUCHER table
CREATE TABLE VOUCHER (
    id_voucher INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    kode VARCHAR(50) NOT NULL UNIQUE,
    diskon_persen INT NOT NULL,
    max_diskon DECIMAL(10,2),
    min_belanja DECIMAL(10,2) DEFAULT 0,
    kuota INT DEFAULT 100
);

-- VOUCHER_USAGE table (tracking pemakaian voucher per user)
CREATE TABLE VOUCHER_USAGE (
    id_usage INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_voucher INT NOT NULL,
    id_transaksi INT NULL,
    digunakan_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES USER(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_voucher) REFERENCES VOUCHER(id_voucher) ON DELETE CASCADE,
    FOREIGN KEY (id_transaksi) REFERENCES TRANSAKSI(id_transaksi) ON DELETE SET NULL
);

-- Alter VOUCHER untuk limit per user
ALTER TABLE VOUCHER ADD COLUMN max_usage_per_user INT DEFAULT 1 AFTER kuota;
```

### Insert Data Dummy

```sql
-- Kategori
INSERT INTO KATEGORI (nama_kategori) VALUES
('Single Origin'),
('Blend'),
('Espresso Based'),
('Manual Brew');

-- Produk
INSERT INTO KOPI
(id_kategori, nama_kopi, harga_kopi, stok, stok_minimal, gambar)
VALUES
(1, 'Kopi Gayo Aceh', 35000, 100, 10, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
(1, 'Kopi Toraja', 40000, 80, 10, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'),
(2, 'House Blend', 30000, 120, 10, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'),
(3, 'Espresso Shot', 25000, 200, 10, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400'),
(3, 'Cappuccino', 35000, 150, 10, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400'),
(4, 'V60 Drip', 38000, 60, 10, 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400'),
(2, 'Signature Blend', 45000, 50, 5, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'),
(1, 'Kopi Bali Kintamani', 42000, 70, 10, 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400');

-- Voucher
INSERT INTO VOUCHER (kode, diskon_persen, max_diskon, min_belanja, kuota) VALUES
('KOPI10', 10, 20000, 50000, 50),
('HEMAT20', 20, 30000, 100000, 30);
```

### 3. Setup Backend

```bash
cd kopi-wae-backend
npm install
```

Dependencies yang terinstall:

- `express` - Web framework
- `cors` - Cross-Origin Resource Sharing
- `mysql2` - MySQL driver
- `dotenv` - Environment variables
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `multer` - File upload

Jalankan server:

```bash
npm run dev
```

Server berjalan di:

```text
http://localhost:5000
```

**Catatan:** Folder `uploads/` akan dibuat otomatis untuk menyimpan gambar yang diupload. Pastikan folder ini _writable_.

### 4. Setup Frontend

```bash
cd project-web-coffee-shop
npm install
npm run dev
```

Frontend berjalan di:

```text
http://localhost:5173
```

## Default Admin Account

Setelah register, ubah role user menjadi admin di database:

```sql
UPDATE USER
SET role = 'admin'
WHERE email = 'admin@kopiwae.com';
```

| Role  | Email             | Password |
| ----- | ----------------- | -------- |
| Admin | admin@kopiwae.com | admin123 |

## API Endpoints

### Auth

- `POST /api/user/register`
- `POST /api/user/login`

### User

- `GET /api/user/beranda`
- `GET /api/user/produk`
- `GET /api/user/produk/:id`
- `GET /api/user/kategori`
- `GET /api/user/keranjang/:userId`
- `POST /api/user/keranjang`
- `PUT /api/user/keranjang/:id`
- `DELETE /api/user/keranjang/:id`
- `POST /api/user/checkout`
- `GET /api/user/history/:userId`
- `GET /api/user/profil/:userId`
- `PUT /api/user/profil/:userId`

### Admin

- `GET /api/admin/dashboard`
- `GET/POST/PUT/DELETE /api/admin/kategori`
- `GET/POST/PUT/DELETE /api/admin/produk`
- `GET/PUT /api/admin/pesanan`
- `GET/POST/PUT/DELETE /api/admin/users`
- `GET /api/admin/laporan`

### Voucher

- `GET /api/user/voucher/aktif/:userId` - Voucher aktif dengan info limit user
- `POST /api/user/voucher` - Validasi voucher + cek limit per user
- `PUT /api/user/voucher/kurang/:kode` - Kurangi kuota + catat pemakaian
- `GET /api/user/voucher/history/:userId` - Riwayat pemakaian voucher

## Environment Variables

Buat file `.env` di folder `kopi-wae-backend/`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_kopi_wae
JWT_SECRET=kopi_wae_secret_key_2024
```

## Konfigurasi Database

Edit file `kopi-wae-backend/config/db.js`:

```javascript
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "db_kopi_wae",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Database connected!");
});

module.exports = db;
```

## Troubleshooting

### Port sudah digunakan

Jika port 5000 sudah dipakai, ubah di `kopi-wae-backend/index.js`:

```javascript
const PORT = 5000; // ganti ke 5001 atau lainnya
```

### Nodemon tidak ditemukan

```bash
npm install -g nodemon
```

### Koneksi database gagal

- Pastikan MySQL sudah berjalan (XAMPP/Laragon)
- Cek username & password di `config/db.js` atau `.env`
- Pastikan database `db_kopi_wae` sudah dibuat

### Token expired / 401 Unauthorized

- Logout lalu login kembali
- Token JWT expired setelah 1 hari

### Upload gambar gagal

- Pastikan folder `uploads/` ada di `kopi-wae-backend/`
- Cek limit file size di `index.js` (default 50MB)

## Cara Reset Database

Jika ada masalah dengan data, Anda bisa mereset database dengan cara berikut:

```sql
DROP DATABASE db_kopi_wae;
CREATE DATABASE db_kopi_wae;
-- Kemudian jalankan ulang script CREATE TABLE + INSERT data dummy di atas
```

## License

See the [LICENSE](LICENSE) file for details.

Project dibuat untuk kebutuhan tugas kuliah dan pembelajaran pengembangan aplikasi web fullstack menggunakan React, Express, dan MySQL.

# Kopi Wae - Coffee Shop Website

Website pemesanan kopi online fullstack dengan React, Express, dan MySQL.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express.js + Node.js
- **Database:** MySQL
- **Auth:** JWT (JSON Web Token)
- **Upload:** Multer

## Struktur Project

```
kopi-wae/
├── kopi-wae-backend/        # Backend Express
│   ├── config/              # Konfigurasi database
│   ├── controllers/         # Logic endpoint
│   ├── middleware/            # Auth middleware
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
- Checkout
- Riwayat transaksi
- Profil + upload foto
- Popup logout

### Admin
- Dashboard dengan statistik & top kopi
- Manajemen kategori (CRUD)
- Manajemen produk (CRUD) + upload gambar
- Manajemen pesanan (update status)
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

Jalankan script SQL untuk membuat tabel:

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
    harga_kopi DECIMAL(10, 2) NOT NULL,
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
    total_harga DECIMAL(10, 2) NOT NULL,
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
    harga_saat_ini DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
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
```

Insert data dummy:

```sql
-- Kategori
INSERT INTO KATEGORI (nama_kategori) VALUES 
('Single Origin'), ('Blend'), ('Espresso Based'), ('Manual Brew');

-- Produk
INSERT INTO KOPI (id_kategori, nama_kopi, harga_kopi, stok, stok_minimal, gambar) VALUES
(1, 'Kopi Gayo Aceh', 35000, 100, 10, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),
(1, 'Kopi Toraja', 40000, 80, 10, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'),
(2, 'House Blend', 30000, 120, 10, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'),
(3, 'Espresso Shot', 25000, 200, 10, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400'),
(3, 'Cappuccino', 35000, 150, 10, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400'),
(4, 'V60 Drip', 38000, 60, 10, 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400'),
(2, 'Signature Blend', 45000, 50, 5, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'),
(1, 'Kopi Bali Kintamani', 42000, 70, 10, 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400');
```

### 3. Setup Backend

```bash
cd kopi-wae-backend
npm install
npm run dev
```

Server berjalan di `http://localhost:5000`

### 4. Setup Frontend

```bash
cd project-web-coffee-shop
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173`

## Default Admin Account

Setelah register, ubah role user jadi admin di database:

```sql
UPDATE USER SET role = 'admin' WHERE email = 'admin@kopiwae.com';
```

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kopiwae.com | admin123 |

## API Endpoints

### Auth
- `POST /api/user/register` - Register
- `POST /api/user/login` - Login

### User
- `GET /api/user/beranda` - Produk terbaru
- `GET /api/user/produk` - Semua produk
- `GET /api/user/produk/:id` - Detail produk
- `GET /api/user/kategori` - Kategori
- `GET /api/user/keranjang/:userId` - Lihat keranjang
- `POST /api/user/keranjang` - Tambah keranjang
- `PUT /api/user/keranjang/:id` - Update qty
- `DELETE /api/user/keranjang/:id` - Hapus item
- `POST /api/user/checkout` - Checkout
- `GET /api/user/history/:userId` - Riwayat
- `GET /api/user/profil/:userId` - Profil
- `PUT /api/user/profil/:userId` - Update profil

### Admin
- `GET /api/admin/dashboard` - Dashboard
- `GET/POST/PUT/DELETE /api/admin/kategori` - CRUD Kategori
- `GET/POST/PUT/DELETE /api/admin/produk` - CRUD Produk
- `GET/PUT /api/admin/pesanan` - Kelola Pesanan
- `GET/POST/PUT/DELETE /api/admin/users` - CRUD User
- `GET /api/admin/laporan` - Laporan Penjualan

## Environment Variables

Buat file `.env` di `kopi-wae-backend/`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_kopi_wae
JWT_SECRET=kopi_wae_secret_key_2024
```

## License

MIT - Project Tugas Kuliah

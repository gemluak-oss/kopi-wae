
Gemini
Percakapan baru
Telusuri percakapan
Gambar
Baru
Koleksi
Notebook baru
Membuat File README.md Proyek Kopi Wae
React ke Backend MySQL dengan Node.js
Rekomendasi Makanan Sehat Malam Hari
Perbedaan Function dan Procedure MySQL
Sistem Berfungsi Baik, Ada Bantuan?
Bantuan Seputar Toko Kopi
Rekomendasi Kedai Kopi Depok, Sleman
Optimasi Biaya Transportasi Metode MODI
Permintaan Logo Anime 'C' Studio
Logo Desain Huruf C Tema Game
Logo C Tema Fantasi Magis
Logo Huruf R Simpel Klasik Tech
Permintaan Gambar Versi Huruf C
Banding Akun Game: Menunggu Keputusan
Kuis Pemrograman Web: Jawaban Lengkap
SQL Code untuk Database Toko Kopi
Laporan Dugaan Penipuan Akun Game
Urutan Nonton Tensura di Otakudesu
Fungsi SQL untuk Analisis Penjualan
Perbaiki gambar ini jadi lebih jelas tanpa bingkai
Ada Apa? Sini Cerita
Definisi Plastik Sebagai Polimer Sintetis
UTS Pendidikan Kewarganegaraan: AI Assistance
Permintaan Video Tidak Dapat Dipenuhi
Durasi Pemantauan Dunia dan Pemindaian
Analisis Statistik Data Tunggal Lengkap
import React from 'react'; const Login = ({ onLogin }) => {   return (         <div className="min-h-screen flex items-center justify-center bg-stone-200">             <div className="bg-white p-8 rounded-2xl shadow-xl w-96">                 {/* BAGIAN JUDUL */}         <div className="text-center mb-6">           {/* text-3xl (ukuran teks besar), font-bold (tebal), text-amber-900 (warna coklat kopi tua) */}           <h2 className="text-3xl font-bold text-amber-900">             Coffee Wae           </h2>           {/* text-gray-500 (teks abu-abu), mt-2 (margin atas ukuran 2) */}           <p className="text-gray-500 mt-2">Masuk ke akun pelangganmu</p>         </div>         {/* BAGIAN FORM (Bungkus inputan pakai flex ke bawah/column) */}         <div className="flex flex-col gap-4">                     {/* INPUT EMAIL */}           <div>             {/* text-sm (teks kecil), font-semibold (agak tebal), text-gray-700 */}             <label className="text-sm font-semibold text-gray-700">Email</label>             <input               type="email"               placeholder="nama@email.com"                           className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"             />           </div>           {/* INPUT PASSWORD */}           <div>             <label className="text-sm font-semibold text-gray-700">Password</label>             <input               type="password"               placeholder="••••••••"               className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"             />           </div>           {/* TOMBOL LOGIN */}           <button             /* Karena di App.jsx kamu butuh onLogin buat ubah role ke 'user', kita panggil fungsinya di sini */             onClick={() => onLogin('user')}                       className="w-full mt-4 bg-amber-800 hover:bg-amber-900 text-white font-bold py-2 px-4 rounded-lg transition-colors"           >             Masuk Sekarang           </button>                   </div>       </div>     </div>   ); }; export default Login; file login
Memperbarui Node.js dengan NVM
Statistik Tampilan Modern dan Elegan
Akses RDP Tool dari Mobile
via mobile udah ada auto sign ip rdp kah buat control jarak jauh terus dijawab seharusnya udah di set ke 0.0.0.0
Kata Kunci Variabel JavaScript: `const`
Mengaktifkan Fitur Catch-All SmarterMail
API Documentation and Bot Scripting
Penyelesaian Sistem Persamaan Linear Cramer
Analisis Data Nilai Ujian Siswa
Statistik Deskriptif Nilai Ujian Siswa
RAD vs Waterfall Sistem Perpustakaan
Penyelesaian Soal Matriks dan SPL
Rangkuman Tahapan Metode Waterfall
Kerjakan king
Latihan Soal JOIN dan Subquery SQL
Product Inventory List Organization
Penjelasan Latihan Modul JOIN
Latihan SQL: Penjelasan dan Jawaban
Ubah Kata "Nether" Menjadi "Mining"
Minimasi Biaya Promosi Metode Grafik
Tailwind CSS Layout Replikasi Foto
Tes Diterima, Siap Membantu
Perbandingan Prosesor Intel Core i3
Ekspansi Kofaktor Baris Pertama Matriks
Modifikasi Tampilan Web Bootstrap
Prioritas Perbaikan Hak Warga Negara
Penyelesaian Soal Matriks dan Persamaan Linear
Latihan Soal Matriks dan Persamaan Linear
Cara Scraping Komentar YouTube
Mengatasi Layar Gelap AnyDesk RDP
Mengatasi Crash Game di RDP
edit foto ini untuk stoknya 999
Simulasi Asisten Riset Teknis Tanpa Filter
Riset Operasi: Konsep, Tujuan, dan Model
Resume Video Big Data Analytics
Rangkuman Big Data Analytics: Definisi Hingga Manfaat
Data Mining dalam Big Data Analytic
Konversi Hexadecimal ke Floating Point
Adding Designs to CAD Toolbox
https://www.youtube.com/watch?v=8LlitCpjoxA&t=3915s
Modernisasi UI Form Kelola Habitat
Konfigurasi Jaringan VLSM Cisco Packet Tracer
Skrip Otomatisasi Game Roblox "The Forge"
Mengatasi Blokir Cloudflare Challenges
Resep Wedang Jahe Sederhana
Ide Foto Menarik dan Kekinian
Permintaan Bantuan Dan Jawaban
Opening Chrome Browser
Clarification Needed for "Turn On"
Arsiran Diagram Venn Operasi Himpunan
Bukti Induksi Formula Deret Kuadrat Ganjil
Pembuktian Induksi Matematika Soal Latihan
Tujuan Praktikum Arduino dan LED
Roblox Script: Rapid Fishing Recast
Membuat PPT Berdasarkan Video YouTube
Gerund vs. Verb Quiz Creation
Permintaan Kuis: Detail Diperlukan
Canvas Copying Finished.
Kuis Topik Apa?
Percakapan dengan Gemini
Ini file **README.md**:



```markdown

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

│   ├── middleware/           # Auth middleware

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

```



---



**Simpan sebagai `README.md` di root folder `D:\AMIKOM\KopiWae\README.md`**



buatin file readme.md

Python
content = """# Kopi Wae - Coffee Shop Website

Website pemesanan kopi online fullstack dengan React, Express, dan MySQL.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express.js + Node.js
- **Database:** MySQL
- **Auth:** JWT (JSON Web Token)
- **Upload:** Multer

## Struktur Project

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
git clone [https://github.com/gemluak-oss/kopi-wae.git](https://github.com/gemluak-oss/kopi-wae.git)
cd kopi-wae
2. Setup Database
Buat database baru di MySQL:

SQL
CREATE DATABASE db_kopi_wae;
Jalankan script SQL untuk membuat tabel:

SQL
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
Insert data dummy:

SQL
-- Kategori
INSERT INTO KATEGORI (nama_kategori) VALUES 
('Single Origin'), ('Blend'), ('Espresso Based'), ('Manual Brew');

-- Produk
INSERT INTO KOPI (id_kategori, nama_kopi, harga_kopi, stok, stok_minimal, gambar) VALUES
(1, 'Kopi Gayo Aceh', 35000, 100, 10, '[https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400](https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400)'),
(1, 'Kopi Toraja', 40000, 80, 10, '[https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400](https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400)'),
(2, 'House Blend', 30000, 120, 10, '[https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400](https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400)'),
(3, 'Espresso Shot', 25000, 200, 10, '[https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400](https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400)'),
(3, 'Cappuccino', 35000, 150, 10, '[https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400](https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400)'),
(4, 'V60 Drip', 38000, 60, 10, '[https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400](https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400)'),
(2, 'Signature Blend', 45000, 50, 5, '[https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400](https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400)'),
(1, 'Kopi Bali Kintamani', 42000, 70, 10, '[https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400](https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400)');
3. Setup Backend
Bash
cd kopi-wae-backend
npm install
npm run dev
Server berjalan di http://localhost:5000

4. Setup Frontend
Bash
cd project-web-coffee-shop
npm install
npm run dev
Frontend berjalan di http://localhost:5173

Default Admin Account
Setelah register, ubah role user jadi admin di database:

SQL
UPDATE USER SET role = 'admin' WHERE email = 'admin@kopiwae.com';
Role	Email	Password
Admin	admin@kopiwae.com	admin123
API Endpoints
Auth
POST /api/user/register - Register

POST /api/user/login - Login

User
GET /api/user/beranda - Produk terbaru

GET /api/user/produk - Semua produk

GET /api/user/produk/:id - Detail produk

GET /api/user/kategori - Kategori

GET /api/user/keranjang/:userId - Lihat keranjang

POST /api/user/keranjang - Tambah keranjang

PUT /api/user/keranjang/:id - Update qty

DELETE /api/user/keranjang/:id - Hapus item

POST /api/user/checkout - Checkout

GET /api/user/history/:userId - Riwayat

GET /api/user/profil/:userId - Profil

PUT /api/user/profil/:userId - Update profil

Admin
GET /api/admin/dashboard - Dashboard

GET/POST/PUT/DELETE /api/admin/kategori - CRUD Kategori

GET/POST/PUT/DELETE /api/admin/produk - CRUD Produk

GET/PUT /api/admin/pesanan - Kelola Pesanan

GET/POST/PUT/DELETE /api/admin/users - CRUD User

GET /api/admin/laporan - Laporan Penjualan

Environment Variables
Buat file .env di kopi-wae-backend/:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_kopi_wae
JWT_SECRET=kopi_wae_secret_key_2024
License
MIT - Project Tugas Kuliah
"""

with open('README.md', 'w', encoding='utf-8') as f:
f.write(content)

print("README.md generated successfully.")


```text?code_stdout&code_event_index=1
README.md generated successfully.

File README.md Anda telah berhasil dibuat.
Ikon MD
README
 MD 
Buka

Silakan unduh file tersebut dan pindahkan ke direktori yang Anda inginkan, yaitu di D:\AMIKOM\KopiWae\README.md.

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

git clone [https://github.com/gemluak-oss/kopi-wae.git](https://github.com/gemluak-oss/kopi-wae.git)

cd kopi-wae







\### 2. Setup Database







Buat database baru di MySQL:







```sql



CREATE DATABASE db\_kopi\_wae;



```







Jalankan script SQL berikut untuk membuat tabel:







```sql



\-- USER table



CREATE TABLE USER (



&#x20;   id\_user INT NOT NULL AUTO\_INCREMENT,



&#x20;   user\_name VARCHAR(255) NOT NULL,



&#x20;   password VARCHAR(255) NOT NULL,



&#x20;   email VARCHAR(255) NOT NULL,



&#x20;   role VARCHAR(50) NOT NULL DEFAULT 'user',



&#x20;   no\_hp VARCHAR(20),



&#x20;   foto VARCHAR(500),



&#x20;   PRIMARY KEY (id\_user)



);







\-- KATEGORI table



CREATE TABLE KATEGORI (



&#x20;   id\_kategori INT NOT NULL AUTO\_INCREMENT,



&#x20;   nama\_kategori VARCHAR(255) NOT NULL,



&#x20;   PRIMARY KEY (id\_kategori)



);







\-- KOPI table



CREATE TABLE KOPI (



&#x20;   id\_kopi INT NOT NULL AUTO\_INCREMENT,



&#x20;   id\_kategori INT NOT NULL,



&#x20;   nama\_kopi VARCHAR(255) NOT NULL,



&#x20;   harga\_kopi DECIMAL(10,2) NOT NULL,



&#x20;   stok INT NOT NULL DEFAULT 0,



&#x20;   stok\_minimal INT NOT NULL DEFAULT 0,



&#x20;   gambar VARCHAR(500),



&#x20;   PRIMARY KEY (id\_kopi),



&#x20;   FOREIGN KEY (id\_kategori) REFERENCES KATEGORI(id\_kategori)



);







\-- KERANJANG table



CREATE TABLE KERANJANG (



&#x20;   id\_keranjang INT NOT NULL AUTO\_INCREMENT,



&#x20;   id\_user INT NOT NULL,



&#x20;   PRIMARY KEY (id\_keranjang),



&#x20;   FOREIGN KEY (id\_user) REFERENCES USER(id\_user) ON DELETE CASCADE



);







\-- ITEM\_KERANJANG table



CREATE TABLE ITEM\_KERANJANG (



&#x20;   id\_itemkeranjang INT NOT NULL AUTO\_INCREMENT,



&#x20;   id\_keranjang INT NOT NULL,



&#x20;   id\_kopi INT NOT NULL,



&#x20;   qty INT NOT NULL DEFAULT 1,



&#x20;   PRIMARY KEY (id\_itemkeranjang),



&#x20;   FOREIGN KEY (id\_keranjang) REFERENCES KERANJANG(id\_keranjang) ON DELETE CASCADE,



&#x20;   FOREIGN KEY (id\_kopi) REFERENCES KOPI(id\_kopi) ON DELETE CASCADE



);







\-- TRANSAKSI table



CREATE TABLE TRANSAKSI (



&#x20;   id\_transaksi INT NOT NULL AUTO\_INCREMENT,



&#x20;   id\_user INT NOT NULL,



&#x20;   tgl\_transaksi DATETIME NOT NULL,



&#x20;   total\_harga DECIMAL(10,2) NOT NULL,



&#x20;   status\_pesanan VARCHAR(100) NOT NULL DEFAULT 'menunggu',



&#x20;   PRIMARY KEY (id\_transaksi),



&#x20;   FOREIGN KEY (id\_user) REFERENCES USER(id\_user)



);







\-- DETAIL\_TRANSAKSI table



CREATE TABLE DETAIL\_TRANSAKSI (



&#x20;   id\_detail INT NOT NULL AUTO\_INCREMENT,



&#x20;   id\_transaksi INT NOT NULL,



&#x20;   id\_kopi INT NOT NULL,



&#x20;   qty INT NOT NULL,



&#x20;   harga\_saat\_ini DECIMAL(10,2) NOT NULL,



&#x20;   subtotal DECIMAL(10,2) NOT NULL,



&#x20;   PRIMARY KEY (id\_detail),



&#x20;   FOREIGN KEY (id\_transaksi) REFERENCES TRANSAKSI(id\_transaksi),



&#x20;   FOREIGN KEY (id\_kopi) REFERENCES KOPI(id\_kopi)



);







\-- PEMBAYARAN table



CREATE TABLE PEMBAYARAN (



&#x20;   id\_pembayaran INT NOT NULL AUTO\_INCREMENT,



&#x20;   id\_transaksi INT NOT NULL,



&#x20;   metode\_pembayaran VARCHAR(100) NOT NULL,



&#x20;   tgl\_pembayaran DATETIME NOT NULL,



&#x20;   status\_pembayaran VARCHAR(100) NOT NULL DEFAULT 'selesai',



&#x20;   PRIMARY KEY (id\_pembayaran),



&#x20;   FOREIGN KEY (id\_transaksi) REFERENCES TRANSAKSI(id\_transaksi)



);



```







\### Insert Data Dummy







```sql



\-- Kategori



INSERT INTO KATEGORI (nama\_kategori) VALUES



('Single Origin'),



('Blend'),



('Espresso Based'),



('Manual Brew');







\-- Produk



INSERT INTO KOPI



(id\_kategori, nama\_kopi, harga\_kopi, stok, stok\_minimal, gambar)



VALUES



(1, 'Kopi Gayo Aceh', 35000, 100, 10, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'),



(1, 'Kopi Toraja', 40000, 80, 10, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'),



(2, 'House Blend', 30000, 120, 10, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'),



(3, 'Espresso Shot', 25000, 200, 10, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400'),



(3, 'Cappuccino', 35000, 150, 10, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400'),



(4, 'V60 Drip', 38000, 60, 10, 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400'),



(2, 'Signature Blend', 45000, 50, 5, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'),



(1, 'Kopi Bali Kintamani', 42000, 70, 10, 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400');



```







\### 3. Setup Backend







```bash



cd kopi-wae-backend



npm install



npm run dev



```







Server berjalan di:







```text



http://localhost:5000



```







\### 4. Setup Frontend







```bash



cd project-web-coffee-shop



npm install



npm run dev



```







Frontend berjalan di:







```text



http://localhost:5173



```







\## Default Admin Account







Setelah register, ubah role user menjadi admin:







```sql



UPDATE USER



SET role = 'admin'



WHERE email = 'admin@kopiwae.com';



```







| Role  | Email                                         | Password |



| ----- | --------------------------------------------- | -------- |



| Admin | \[admin@kopiwae.com](mailto:admin@kopiwae.com) | admin123 |







\## API Endpoints







\### Auth







\* `POST /api/user/register`



\* `POST /api/user/login`







\### User







\* `GET /api/user/beranda`



\* `GET /api/user/produk`



\* `GET /api/user/produk/:id`



\* `GET /api/user/kategori`



\* `GET /api/user/keranjang/:userId`



\* `POST /api/user/keranjang`



\* `PUT /api/user/keranjang/:id`



\* `DELETE /api/user/keranjang/:id`



\* `POST /api/user/checkout`



\* `GET /api/user/history/:userId`



\* `GET /api/user/profil/:userId`



\* `PUT /api/user/profil/:userId`







\### Admin







\* `GET /api/admin/dashboard`



\* `GET/POST/PUT/DELETE /api/admin/kategori`



\* `GET/POST/PUT/DELETE /api/admin/produk`



\* `GET/PUT /api/admin/pesanan`



\* `GET/POST/PUT/DELETE /api/admin/users`



\* `GET /api/admin/laporan`







\## Environment Variables







Buat file `.env` di folder `kopi-wae-backend/`







```env



DB\_HOST=localhost



DB\_USER=root



DB\_PASSWORD=



DB\_NAME=db\_kopi\_wae



JWT\_SECRET=kopi\_wae\_secret\_key\_2024



```







\## License







MIT License







Project dibuat untuk kebutuhan tugas kuliah dan pembelajaran pengembangan aplikasi web fullstack menggunakan React, Express, dan MySQL.









benerin

Tentu, ini adalah versi README.md yang sudah diperbaiki. Saya telah menghapus karakter escape (seperti \ sebelum #, _, dan *) yang salah tempat, serta merapikan indentasi tabel SQL (&#x20; yang tidak perlu).

Kamu bisa langsung menyalin kode di bawah ini:

Markdown
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
Fitur
User
Register & Login

Home (produk terbaru)

List produk + filter kategori

Detail produk

Keranjang (CRUD)

Checkout

Riwayat transaksi

Profil + upload foto

Popup logout

Admin
Dashboard dengan statistik & top kopi

Manajemen kategori (CRUD)

Manajemen produk (CRUD) + upload gambar

Manajemen pesanan (update status)

Manajemen pengguna (CRUD) + upload foto

Laporan penjualan + grafik + export CSV

Profil admin + upload foto

Popup logout

Instalasi
1. Clone Repository
Bash
git clone [https://github.com/gemluak-oss/kopi-wae.git](https://github.com/gemluak-oss/kopi-wae.git)
cd kopi-wae
2. Setup Database
Buat database baru di MySQL:

SQL
CREATE DATABASE db_kopi_wae;
Jalankan script SQL berikut untuk membuat tabel:

SQL
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
Insert Data Dummy
SQL
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
(1, 'Kopi Gayo Aceh', 35000, 100, 10, '[https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400](https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400)'),
(1, 'Kopi Toraja', 40000, 80, 10, '[https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400](https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400)'),
(2, 'House Blend', 30000, 120, 10, '[https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400](https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400)'),
(3, 'Espresso Shot', 25000, 200, 10, '[https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400](https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400)'),
(3, 'Cappuccino', 35000, 150, 10, '[https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400](https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400)'),
(4, 'V60 Drip', 38000, 60, 10, '[https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400](https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400)'),
(2, 'Signature Blend', 45000, 50, 5, '[https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400](https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400)'),
(1, 'Kopi Bali Kintamani', 42000, 70, 10, '[https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400](https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400)');
3. Setup Backend
Bash
cd kopi-wae-backend
npm install
npm run dev
Server berjalan di:

Plaintext
http://localhost:5000
4. Setup Frontend
Bash
cd project-web-coffee-shop
npm install
npm run dev
Frontend berjalan di:

Plaintext
http://localhost:5173
Default Admin Account
Setelah register, ubah role user menjadi admin di database:

SQL
UPDATE USER
SET role = 'admin'
WHERE email = 'admin@kopiwae.com';
Role	Email	Password
Admin	admin@kopiwae.com	admin123
API Endpoints
Auth
POST /api/user/register

POST /api/user/login

User
GET /api/user/beranda

GET /api/user/produk

GET /api/user/produk/:id

GET /api/user/kategori

GET /api/user/keranjang/:userId

POST /api/user/keranjang

PUT /api/user/keranjang/:id

DELETE /api/user/keranjang/:id

POST /api/user/checkout

GET /api/user/history/:userId

GET /api/user/profil/:userId

PUT /api/user/profil/:userId

Admin
GET /api/admin/dashboard

GET/POST/PUT/DELETE /api/admin/kategori

GET/POST/PUT/DELETE /api/admin/produk

GET/PUT /api/admin/pesanan

GET/POST/PUT/DELETE /api/admin/users

GET /api/admin/laporan

Environment Variables
Buat file .env di folder kopi-wae-backend/

Cuplikan kode
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_kopi_wae
JWT_SECRET=kopi_wae_secret_key_2024
License
MIT License

Project dibuat untuk kebutuhan tugas kuliah dan pembelajaran pengembangan aplikasi web fullstack menggunakan React, Express, dan MySQL.




Gemini adalah AI dan dapat melakukan kesalahan.

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
README.md
Menampilkan README.md.

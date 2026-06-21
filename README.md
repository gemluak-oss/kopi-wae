\# Kopi Wae - Coffee Shop Website



Website pemesanan kopi online fullstack dengan React, Express, dan MySQL.



\## Tech Stack



\* \*\*Frontend:\*\* React + Vite + Tailwind CSS

\* \*\*Backend:\*\* Express.js + Node.js

\* \*\*Database:\*\* MySQL

\* \*\*Auth:\*\* JWT (JSON Web Token)

\* \*\*Upload:\*\* Multer



\## Struktur Project



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

│   │   ├── pages/           # Halaman admin \& user

│   │   ├── layouts/         # Layout admin \& user

│   │   └── utils/           # API config

│   ├── public/

│   └── package.json

│

└── README.md

```



\## Fitur



\### User



\* Register \& Login

\* Home (produk terbaru)

\* List produk + filter kategori

\* Detail produk

\* Keranjang (CRUD)

\* Checkout

\* Riwayat transaksi

\* Profil + upload foto

\* Popup logout



\### Admin



\* Dashboard dengan statistik \& top kopi

\* Manajemen kategori (CRUD)

\* Manajemen produk (CRUD) + upload gambar

\* Manajemen pesanan (update status)

\* Manajemen pengguna (CRUD) + upload foto

\* Laporan penjualan + grafik + export CSV

\* Profil admin + upload foto

\* Popup logout



\## Instalasi



\### 1. Clone Repository



```bash

git clone https://github.com/gemluak-oss/kopi-wae.git

cd kopi-wae

```



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




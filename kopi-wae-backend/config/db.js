const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  password: '',      
  database: 'db_kopi_wae' 
});

db.connect((err) => {
  if (err) {
    console.error('❌ Gagal konek ke database:', err);
    return;
  }
  console.log('✅ Mantap! Terhubung ke database db_kopi_wae.');
});

// Mengekspor 'db' agar bisa dipakai di file controller
module.exports = db;
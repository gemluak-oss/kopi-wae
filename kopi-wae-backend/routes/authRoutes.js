const express = require('express');
const router = express.Router();

// Memanggil controller yang sudah kita buat
const authController = require('../controllers/authController');

// Mendaftarkan jalur (Endpoint)
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
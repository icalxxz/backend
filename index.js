const express = require('express');
const cors = require('cors');
const transactionRoutes = require('./routes/api');

const app = express();

// 1. Middleware CORS harus yang PERTAMA kali dipanggil
app.use(cors({
  origin: '*', // Izinkan semua origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Wajib ada OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Middleware JSON (Wajib agar bisa baca data dari FE)
app.use(express.json());

// 3. Handle OPTIONS manual (Jaga-jaga jika middleware cors bawaan gagal)
app.options('*', cors()); 

// 4. Rute Utama
app.use('/api/transactions', transactionRoutes);

// Debugging rute tidak ditemukan
app.use((req, res) => {
  res.status(404).json({ error: `Path ${req.url} tidak ditemukan!` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Portafoglio ON di port ${PORT}`);
});
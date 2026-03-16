const express = require('express');
const cors = require('cors');
const transactionRoutes = require('./routes/api');

const app = express();

// Konfigurasi CORS yang lebih kuat
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// DAFTARKAN ROUTE
// Dengan begini, semua yang ada di api.js akan diawali /api/transactions
app.use('/api/transactions', transactionRoutes);

// Fallback jika URL salah (Sangat membantu buat debug!)
app.use((req, res) => {
  console.log(`Ada request nyasar ke: ${req.url}`);
  res.status(404).json({ 
    error: "Route tidak ditemukan", 
    tips: "Cek apakah API_URL di FE sudah pas /api/transactions" 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Portafoglio meluncur di port ${PORT}`);
});
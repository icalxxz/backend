const express = require('express');
const cors = require('cors');
const transactionRoutes = require('./routes/api');

const app = express();

// 1. CORS: Cukup begini saja, sudah sangat aman untuk Railway
app.use(cors()); 

// 2. Parser JSON: Wajib agar req.body tidak kosong
app.use(express.json());

// 3. Rute Utama
// Pastikan folder 'routes' dan file 'api.js' namanya benar (case-sensitive)
app.use('/api/transactions', transactionRoutes);

// 4. Test Route (Cek server hidup)
app.get('/', (req, res) => {
  res.send('Server Portafoglio Running Well! 🚀');
});

// 5. Penanganan 404 yang aman
app.use((req, res) => {
  res.status(404).json({ error: `Path ${req.url} tidak ditemukan!` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ON di port ${PORT}`);
});
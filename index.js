const express = require('express');
const cors = require('cors');
const transactionRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes - Semua URL diawali dengan /api/transactions
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server meluncur di http://localhost:${PORT}`);
});
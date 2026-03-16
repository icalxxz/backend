const express = require('express');
const cors = require('cors');
const transactionRoutes = require('./routes/api');

const app = express();

// 1. CORS Paling Simpel (Paling Ampuh buat Railway)
app.use(cors()); 

// 2. Body Parser
app.use(express.json());

// 3. Test Route (Buka link backend-mu di browser, harus muncul tulisan ini)
app.get('/', (req, res) => {
  res.send('Arithmos API is Online! 🚀');
});

// 4. Utama
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ON port ${PORT}`);
});
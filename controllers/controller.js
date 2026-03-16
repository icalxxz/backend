const { admin, transactionsDb } = require('../services/service');

// 1. Ambil Semua Data
exports.getAllTransactions = async (req, res) => {
  try {
    const snapshot = await transactionsDb.orderBy('createdAt', 'desc').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    console.error("ERROR GET:", error);
    res.status(500).json({ message: error.message });
  }
};

// 2. Tambah Data (Create)
exports.addTransaction = async (req, res) => {
  try {
    const newDoc = {
      ...req.body,
      // Tetap simpan serverTimestamp untuk urusan sorting di DB
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const ref = await transactionsDb.add(newDoc);

    // KIRIM BALIK KE FE: 
    // Gunakan req.body.date (yang dikirim dari FE) agar formatnya tetap YYYY-MM-DD
    // Jangan kirim objek serverTimestamp ke FE karena akan terbaca sebagai objek kosong
    res.status(201).json({ 
      id: ref.id, 
      ...req.body,
      createdAt: new Date().toISOString() // Pengganti sementara agar FE tidak bingung
    });

  } catch (error) {
    console.error("ERROR ADD:", error);
    res.status(500).json({ message: error.message });
  }
};

// 3. UPDATE DATA (Edit)
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    delete updatedData.id;
    updatedData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await transactionsDb.doc(id).update(updatedData);
    
    // Pastikan response ke FE bersih
    res.status(200).json({ 
      id, 
      ...updatedData, 
      updatedAt: new Date().toISOString() 
    });
  } catch (error) {
    console.error("ERROR UPDATE:", error);
    res.status(500).json({ message: error.message });
  }
};

// 4. Hapus Data (Delete)
exports.deleteTransaction = async (req, res) => {
  try {
    await transactionsDb.doc(req.params.id).delete();
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
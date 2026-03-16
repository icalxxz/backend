const { admin, transactionsDb } = require('../services/service');

// 1. Ambil Semua Data
exports.getAllTransactions = async (req, res) => {
  try {
    const snapshot = await transactionsDb.orderBy('createdAt', 'desc').get();
    const data = snapshot.docs.map(doc => {
      const docData = doc.data();
      return { 
        id: doc.id, 
        ...docData,
        // Pastikan format tanggal aman untuk FE
        date: docData.date || new Date().toISOString().split('T')[0]
      };
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("ERROR GET:", error);
    res.status(500).json({ message: error.message });
  }
};

// 2. Tambah Data (Create)
exports.addTransaction = async (req, res) => {
  try {
    // Validasi sederhana agar tidak crash kalau req.body kosong
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Payload kosong!" });
    }

    const newDoc = {
      ...req.body,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const ref = await transactionsDb.add(newDoc);

    // KIRIM BALIK KE FE:
    // Kita kirim balik ID dan data asli dari FE (req.body)
    // Supaya filter t.date.startsWith() tidak gagal karena FieldValue object
    res.status(201).json({ 
      id: ref.id, 
      ...req.body,
      createdAt: new Date().toISOString() 
    });
  } catch (error) {
    console.error("ERROR ADD:", error);
    res.status(500).json({ message: error.message });
  }
};

// 3. UPDATE DATA
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "ID diperlukan" });

    const updatedData = { ...req.body };
    delete updatedData.id; // Keamanan: jangan simpan id di dalam field doc

    updatedData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await transactionsDb.doc(id).update(updatedData);
    
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

// 4. Hapus Data
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await transactionsDb.doc(id).delete();
    res.status(200).json({ message: "Transaction deleted successfully", id });
  } catch (error) {
    console.error("ERROR DELETE:", error);
    res.status(500).json({ message: error.message });
  }
};
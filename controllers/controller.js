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
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    const ref = await transactionsDb.add(newDoc);
    res.status(201).json({ id: ref.id, ...newDoc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. UPDATE DATA (Edit) - INI YANG BARU
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    // Hapus ID dari body agar tidak ikut tersimpan sebagai field di dalam Firestore
    delete updatedData.id;

    // Tambahkan timestamp update jika perlu
    updatedData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await transactionsDb.doc(id).update(updatedData);
    
    res.status(200).json({ id, ...updatedData });
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
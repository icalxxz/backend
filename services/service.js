const admin = require('firebase-admin');

let serviceAccount;

if (process.env.FIREBASE_CONFIG) {
  // Jika sedang di Railway, baca dari Environment Variable (dalam bentuk string JSON)
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
} else {
  // Jika sedang di laptop (Local), baca dari file .json kamu
  serviceAccount = require('../serviceAccountKey.json'); 
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const transactionsDb = db.collection('transactions');

module.exports = { admin, transactionsDb };
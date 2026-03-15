const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/controller');

router.get('/', transactionController.getAllTransactions);
router.post('/', transactionController.addTransaction);
router.delete('/:id', transactionController.deleteTransaction);
router.put('/:id', transactionController.updateTransaction);

module.exports = router;
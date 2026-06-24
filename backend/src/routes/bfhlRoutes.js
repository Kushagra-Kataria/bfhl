const express = require('express');
const { handleBfhl } = require('../controllers/bfhlController');

const router = express.Router();

// POST /bfhl - Process hierarchical node relationships
router.post('/', handleBfhl);

// GET /bfhl - Health check for this endpoint
router.get('/', (req, res) => {
  res.json({
    operation_code: 1,
    message: 'BFHL endpoint is active. Send a POST request with { "data": ["A->B", "A->C"] }',
  });
});

module.exports = router;

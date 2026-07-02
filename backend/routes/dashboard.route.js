const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/summary', protect, getDashboardSummary);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require('../controllers/leave.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Employee routes
router.post('/apply', protect, authorize('Employee'), applyLeave);
router.get('/my-requests', protect, authorize('Employee'), getMyLeaves);

// Admin routes
router.get('/all', protect, authorize('Admin'), getAllLeaves);
router.patch('/:id/status', protect, authorize('Admin'), updateLeaveStatus);

module.exports = router;

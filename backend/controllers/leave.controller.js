const Leave = require('../models/leave.model');
const User = require('../models/user.model');

// @desc    Apply for a leave
// @route   POST /api/leaves/apply
// @access  Private (Employee only)
const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields' });
    }

    const allowedTypes = ['Annual', 'Sick', 'Casual'];
    if (!allowedTypes.includes(leaveType)) {
      return res.status(400).json({ success: false, message: `Invalid leave type. Must be one of ${allowedTypes.join(', ')}` });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalize dates to midnight
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({ success: false, message: 'Start date cannot be in the past' });
    }

    if (start > end) {
      return res.status(400).json({ success: false, message: 'End date cannot be before start date' });
    }

    // Calculate requested days (inclusive)
    const diffTime = end.getTime() - start.getTime();
    const daysRequested = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Fetch user to check current balance
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentBalance = user.leaveBalances[leaveType];
    if (currentBalance < daysRequested) {
      return res.status(400).json({
        success: false,
        message: `Insufficient leave balance. You have ${currentBalance} days left for ${leaveType} leave, but requested ${daysRequested} days.`,
      });
    }

    // Create the leave request
    const leaveRequest = await Leave.create({
      employee: req.user.id,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      daysRequested,
      status: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: leaveRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while applying for leave' });
  }
};

// @desc    Get leave requests for logged-in employee
// @route   GET /api/leaves/my-requests
// @access  Private (Employee only)
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while retrieving your leave requests' });
  }
};

// @desc    Get all leave requests
// @route   GET /api/leaves/all
// @access  Private (Admin only)
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('employee', 'name email leaveBalances')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while retrieving all leave requests' });
  }
};

// @desc    Approve or reject a leave request
// @route   PATCH /api/leaves/:id/status
// @access  Private (Admin only)
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminComments } = req.body;
    const leaveId = req.params.id;

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid status (APPROVED or REJECTED)' });
    }

    const leaveRequest = await Leave.findById(leaveId);
    if (!leaveRequest) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    if (leaveRequest.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: `Leave request has already been ${leaveRequest.status.toLowerCase()}` });
    }

    const employee = await User.findById(leaveRequest.employee);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee associated with this leave request was not found' });
    }

    if (status === 'APPROVED') {
      const { leaveType, daysRequested } = leaveRequest;
      const currentBalance = employee.leaveBalances[leaveType];

      // Double-check balance upon approval (safety check if balance changed in the meantime)
      if (currentBalance < daysRequested) {
        return res.status(400).json({
          success: false,
          message: `Cannot approve request. Employee has insufficient balance: has ${currentBalance} days left, needs ${daysRequested} days.`,
        });
      }

      // Deduct balance
      employee.leaveBalances[leaveType] = currentBalance - daysRequested;
      await employee.save();
    }

    // Update leave request status
    leaveRequest.status = status;
    if (adminComments !== undefined) {
      leaveRequest.adminComments = adminComments;
    }
    await leaveRequest.save();

    res.status(200).json({
      success: true,
      message: `Leave request successfully ${status.toLowerCase()}`,
      data: leaveRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while updating leave request status' });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
};

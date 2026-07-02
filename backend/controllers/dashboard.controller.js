    const Leave = require('../models/leave.model');
const User = require('../models/user.model');

// @desc    Get dashboard summary statistics
// @route   GET /api/dashboard/summary
// @access  Private (Employee and Admin)
const getDashboardSummary = async (req, res) => {
  try {
    const role = req.user.role;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (role === 'Employee') {
      // 1. Get user leave balances
      const user = await User.findById(req.user.id).select('leaveBalances');

      // 2. Count requests by status
      const pendingCount = await Leave.countDocuments({ employee: req.user.id, status: 'PENDING' });
      const approvedCount = await Leave.countDocuments({ employee: req.user.id, status: 'APPROVED' });
      const rejectedCount = await Leave.countDocuments({ employee: req.user.id, status: 'REJECTED' });

      // 3. Get upcoming approved leaves (start date in future or today)
      const upcomingLeaves = await Leave.find({
        employee: req.user.id,
        status: 'APPROVED',
        startDate: { $gte: today },
      }).sort({ startDate: 1 });

      res.status(200).json({
        success: true,
        data: {
          role,
          leaveBalances: user.leaveBalances,
          stats: {
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount,
            total: pendingCount + approvedCount + rejectedCount,
          },
          upcomingLeaves,
        },
      });
    } else if (role === 'Admin') {
      // 1. Total employees (non-Admin users)
      const totalEmployees = await User.countDocuments({ role: 'Employee' });

      // 2. Leave counts across all employees
      const pendingRequests = await Leave.countDocuments({ status: 'PENDING' });
      const approvedRequests = await Leave.countDocuments({ status: 'APPROVED' });
      const rejectedRequests = await Leave.countDocuments({ status: 'REJECTED' });

      // 3. Find employees currently on approved leave today
      const absentEmployees = await Leave.find({
        status: 'APPROVED',
        startDate: { $lte: today },
        endDate: { $gte: today },
      }).populate('employee', 'name email');

      res.status(200).json({
        success: true,
        data: {
          role,
          stats: {
            totalEmployees,
            pendingRequests,
            approvedRequests,
            rejectedRequests,
            totalRequests: pendingRequests + approvedRequests + rejectedRequests,
          },
          currentlyAbsent: absentEmployees.map((leave) => ({
            leaveId: leave._id,
            employeeName: leave.employee ? leave.employee.name : 'Unknown Employee',
            employeeEmail: leave.employee ? leave.employee.email : '',
            leaveType: leave.leaveType,
            startDate: leave.startDate,
            endDate: leave.endDate,
            reason: leave.reason,
          })),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user role' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while generating dashboard summary' });
  }
};

module.exports = {
  getDashboardSummary,
};

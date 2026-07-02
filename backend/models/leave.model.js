const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  leaveType: {
    type: String,
    enum: ['Annual', 'Sick', 'Casual'],
    required: [true, 'Please select a leave type'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please select a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please select an end date'],
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for leave'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
  adminComments: {
    type: String,
    trim: true,
    default: '',
  },
  daysRequested: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Leave', leaveSchema);

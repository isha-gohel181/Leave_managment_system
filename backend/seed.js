require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model');
const Leave = require('./models/leave.model');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/leave_management';
    console.log('Connecting to database:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Database connected.');

    // 1. Clear existing data
    console.log('Clearing existing users and leaves...');
    await User.deleteMany({});
    await Leave.deleteMany({});
    console.log('Collections cleared.');

    // 2. Create mock users
    console.log('Seeding user profiles...');
    
    // HR Admin: Yash Mehta
    const yash = new User({
      name: 'Yash Mehta',
      email: 'yash@crave.com',
      password: 'password123',
      role: 'Admin'
    });
    await yash.save();

    // Employee 1: Isha Gohel
    const isha = new User({
      name: 'Isha Gohel',
      email: 'isha@crave.com',
      password: 'password123',
      role: 'Employee',
      leaveBalances: { Annual: 15, Sick: 8, Casual: 9 } // 2 sick, 1 casual approved
    });
    await isha.save();

    // Employee 2: Aidan O'Connor
    const aidan = new User({
      name: 'Aidan O\'Connor',
      email: 'aidan@crave.com',
      password: 'password123',
      role: 'Employee',
      leaveBalances: { Annual: 5, Sick: 10, Casual: 10 } // 10 annual approved
    });
    await aidan.save();

    // Employee 3: Sarah Jenkins
    const sarah = new User({
      name: 'Sarah Jenkins',
      email: 'sarah@crave.com',
      password: 'password123',
      role: 'Employee',
      leaveBalances: { Annual: 11, Sick: 5, Casual: 8 } // 4 annual, 5 sick, 2 casual approved
    });
    await sarah.save();

    // Employee 4: Liam Vance
    const liam = new User({
      name: 'Liam Vance',
      email: 'liam@crave.com',
      password: 'password123',
      role: 'Employee',
      leaveBalances: { Annual: 15, Sick: 7, Casual: 10 } // 3 sick approved, 1 casual rejected
    });
    await liam.save();

    // Employee 5: Chloe Mercer
    const chloe = new User({
      name: 'Chloe Mercer',
      email: 'chloe@crave.com',
      password: 'password123',
      role: 'Employee',
      leaveBalances: { Annual: 7, Sick: 10, Casual: 10 } // 8 annual approved
    });
    await chloe.save();

    console.log('Seeded 6 primary user profiles.');

    // Seed 39 dummy employees to reach exactly 45 staff members
    console.log('Seeding 39 dummy employees to reach exactly 45 staff members...');
    for (let i = 1; i <= 39; i++) {
      const dummy = new User({
        name: `Staff Member ${i}`,
        email: `staff${i}@crave.com`,
        password: 'password123',
        role: 'Employee'
      });
      await dummy.save();
    }
    console.log('Seeded 39 dummy profiles.');

    // 3. Create mock leave requests (Exactly 14 requests: 8 Approved, 4 Pending, 2 Rejected)
    console.log('Seeding leave requests...');

    const leaves = [
      // --- 8 APPROVED LEAVES ---
      {
        employee: isha._id,
        leaveType: 'Sick',
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-06-02'),
        reason: 'Regular medical checkup and recovery',
        status: 'APPROVED',
        adminComments: 'Approved. Get well soon!',
        daysRequested: 2
      },
      {
        employee: isha._id,
        leaveType: 'Casual',
        startDate: new Date('2026-01-22'),
        endDate: new Date('2026-01-22'),
        reason: 'Family event and dinner gathering',
        status: 'APPROVED',
        adminComments: 'Approved.',
        daysRequested: 1
      },
      {
        employee: aidan._id,
        leaveType: 'Annual',
        startDate: new Date('2025-12-20'),
        endDate: new Date('2025-12-29'),
        reason: 'Christmas and New Year family holidays',
        status: 'APPROVED',
        adminComments: 'Enjoy your winter holidays!',
        daysRequested: 10
      },
      {
        employee: sarah._id,
        leaveType: 'Sick',
        startDate: new Date('2026-01-15'),
        endDate: new Date('2026-01-19'),
        reason: 'Severe flu recovery',
        status: 'APPROVED',
        adminComments: 'Approved. Please rest well.',
        daysRequested: 5
      },
      {
        employee: sarah._id,
        leaveType: 'Annual',
        startDate: new Date('2026-03-10'),
        endDate: new Date('2026-03-13'),
        reason: 'Spring break trip',
        status: 'APPROVED',
        adminComments: 'Approved. Have a great trip!',
        daysRequested: 4
      },
      {
        employee: sarah._id,
        leaveType: 'Casual',
        startDate: new Date('2026-04-14'),
        endDate: new Date('2026-04-15'),
        reason: 'Personal errands and house moving helper',
        status: 'APPROVED',
        adminComments: 'Approved.',
        daysRequested: 2
      },
      {
        employee: liam._id,
        leaveType: 'Sick',
        startDate: new Date('2026-06-10'),
        endDate: new Date('2026-06-12'),
        reason: 'Recovery from minor wisdom teeth removal surgery',
        status: 'APPROVED',
        adminComments: 'Approved. Take rest.',
        daysRequested: 3
      },
      {
        employee: chloe._id,
        leaveType: 'Annual',
        startDate: new Date('2026-05-20'),
        endDate: new Date('2026-05-27'),
        reason: 'Annual trip to visit parents',
        status: 'APPROVED',
        adminComments: 'Approved. Have a safe journey.',
        daysRequested: 8
      },

      // --- 4 PENDING LEAVES ---
      {
        employee: isha._id,
        leaveType: 'Annual',
        startDate: new Date('2026-07-10'),
        endDate: new Date('2026-07-15'),
        reason: 'Summer family vacation trip',
        status: 'PENDING',
        daysRequested: 6
      },
      {
        employee: aidan._id,
        leaveType: 'Casual',
        startDate: new Date('2026-08-04'),
        endDate: new Date('2026-08-05'),
        reason: 'Relocating to a new apartment',
        status: 'PENDING',
        daysRequested: 2
      },
      {
        employee: liam._id,
        leaveType: 'Annual',
        startDate: new Date('2026-09-12'),
        endDate: new Date('2026-09-16'),
        reason: 'Autumn mountain hiking trip',
        status: 'PENDING',
        daysRequested: 5
      },
      {
        employee: chloe._id,
        leaveType: 'Sick',
        startDate: new Date('2026-07-03'),
        endDate: new Date('2026-07-03'),
        reason: 'Dentist appointment and checkup',
        status: 'PENDING',
        daysRequested: 1
      },

      // --- 2 REJECTED LEAVES ---
      {
        employee: isha._id,
        leaveType: 'Casual',
        startDate: new Date('2026-05-12'),
        endDate: new Date('2026-05-14'),
        reason: 'Attending best friend\'s out-of-town wedding',
        status: 'REJECTED',
        adminComments: 'Sorry Isha, team coverage limit reached for these dates.',
        daysRequested: 3
      },
      {
        employee: liam._id,
        leaveType: 'Casual',
        startDate: new Date('2026-02-10'),
        endDate: new Date('2026-02-10'),
        reason: 'Personal home maintenance emergency',
        status: 'REJECTED',
        adminComments: 'Please coordinate with team lead for short notice leave.',
        daysRequested: 1
      }
    ];

    for (const leaveData of leaves) {
      const leave = new Leave(leaveData);
      await leave.save();
    }

    console.log(`Seeded ${leaves.length} leave requests.`);

    console.log('\n--- SEED COMPLETE ---');
    console.log('Seeded Users:');
    console.log('  1. Employee: isha@crave.com / password123 (Isha Gohel)');
    console.log('  2. HR Admin: yash@crave.com / password123 (Yash Mehta)');
    console.log('  Total staff count reaches exactly 45 profiles.');
    console.log('  Total leave requests seeded: 14 (8 Approved, 4 Pending, 2 Rejected).');
    console.log('---------------------');

    await mongoose.disconnect();
    console.log('Database disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();

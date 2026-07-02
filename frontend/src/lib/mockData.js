export const mockUsers = {
  employee: {
    id: "EMP-2026-089",
    name: "Aidan O'Connor",
    email: "aidan@replicate.dev",
    role: "employee",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    department: "Engineering (Product)",
    manager: "Sarah Jenkins (Engineering Director)",
    joinDate: "Jan 12, 2024",
    office: "San Francisco, CA"
  },
  admin: {
    id: "EMP-2024-001",
    name: "Sarah Jenkins",
    email: "sarah@replicate.dev",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    department: "Engineering Management",
    joinDate: "Jun 1, 2021",
    office: "San Francisco, CA"
  }
};

export const initialLeaveBalances = [
  { type: "Annual Leave", total: 20, used: 8, pending: 2, available: 10, color: "#ea2804" },
  { type: "Sick Leave", total: 10, used: 3, pending: 0, available: 7, color: "#2b9a66" },
  { type: "Casual Leave", total: 7, used: 2, pending: 1, available: 4, color: "#f59e0b" },
  { type: "Maternity Leave", total: 30, used: 0, pending: 0, available: 30, color: "#ff6a3d" },
  { type: "Unpaid Leave", total: 99, used: 4, pending: 0, available: 95, color: "#646464" }
];

export const initialLeaveRequests = [
  {
    id: "LV-2041",
    employeeName: "Aidan O'Connor",
    employeeId: "EMP-2026-089",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    type: "Annual Leave",
    startDate: "2026-07-15",
    endDate: "2026-07-22",
    days: 6,
    reason: "Summer vacation in Hawaii with family. Will have intermittent internet access.",
    status: "pending",
    appliedDate: "2026-07-02"
  },
  {
    id: "LV-2040",
    employeeName: "Aidan O'Connor",
    employeeId: "EMP-2026-089",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    type: "Casual Leave",
    startDate: "2026-07-08",
    endDate: "2026-07-08",
    days: 1,
    reason: "Attending a real estate closing.",
    status: "pending",
    appliedDate: "2026-07-01"
  },
  {
    id: "LV-2035",
    employeeName: "Aidan O'Connor",
    employeeId: "EMP-2026-089",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    type: "Sick Leave",
    startDate: "2026-06-18",
    endDate: "2026-06-19",
    days: 2,
    reason: "Recovering from severe dental surgery. Dentist certificate available upon request.",
    status: "approved",
    appliedDate: "2026-06-17",
    reviewedBy: "Sarah Jenkins",
    reviewedDate: "2026-06-17"
  },
  {
    id: "LV-2030",
    employeeName: "Aidan O'Connor",
    employeeId: "EMP-2026-089",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    type: "Annual Leave",
    startDate: "2026-05-10",
    endDate: "2026-05-15",
    days: 5,
    reason: "Attending friend's wedding out of state.",
    status: "approved",
    appliedDate: "2026-05-01",
    reviewedBy: "Sarah Jenkins",
    reviewedDate: "2026-05-02"
  },
  {
    id: "LV-2021",
    employeeName: "Aidan O'Connor",
    employeeId: "EMP-2026-089",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    type: "Casual Leave",
    startDate: "2026-04-12",
    endDate: "2026-04-12",
    days: 1,
    reason: "Urgent home repairs (plumbing emergency).",
    status: "approved",
    appliedDate: "2026-04-11",
    reviewedBy: "Sarah Jenkins",
    reviewedDate: "2026-04-11"
  },
  {
    id: "LV-2015",
    employeeName: "Aidan O'Connor",
    employeeId: "EMP-2026-089",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    type: "Annual Leave",
    startDate: "2026-03-01",
    endDate: "2026-03-05",
    days: 5,
    reason: "Ski trip to Lake Tahoe.",
    status: "rejected",
    appliedDate: "2026-02-15",
    reviewedBy: "Sarah Jenkins",
    reviewedDate: "2026-02-16",
    rejectionReason: "Quarterly release deadline falls exactly during this period. Engineering presence is required."
  },
  // Other employees' leave requests (Admin Dashboard data)
  {
    id: "LV-2042",
    employeeName: "Elena Rostova",
    employeeId: "EMP-2025-012",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    type: "Annual Leave",
    startDate: "2026-07-20",
    endDate: "2026-08-03",
    days: 10,
    reason: "Visiting family in Europe for annual summer break.",
    status: "pending",
    appliedDate: "2026-07-02"
  },
  {
    id: "LV-2043",
    employeeName: "Marcus Vance",
    employeeId: "EMP-2024-045",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    type: "Sick Leave",
    startDate: "2026-07-03",
    endDate: "2026-07-05",
    days: 3,
    reason: "Flu symptoms, doctor advised complete rest for 3 days.",
    status: "pending",
    appliedDate: "2026-07-02"
  },
  {
    id: "LV-2044",
    employeeName: "Jasmine Kaur",
    employeeId: "EMP-2025-098",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    type: "Maternity Leave",
    startDate: "2026-08-01",
    endDate: "2026-10-31",
    days: 90,
    reason: "Upcoming maternity leave as planned and pre-aligned with HR.",
    status: "pending",
    appliedDate: "2026-07-02"
  },
  {
    id: "LV-2039",
    employeeName: "Devon Reynolds",
    employeeId: "EMP-2026-104",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    type: "Unpaid Leave",
    startDate: "2026-06-25",
    endDate: "2026-06-30",
    days: 5,
    reason: "Personal sabbatical research trip.",
    status: "approved",
    appliedDate: "2026-06-10",
    reviewedBy: "Sarah Jenkins",
    reviewedDate: "2026-06-12"
  },
  {
    id: "LV-2038",
    employeeName: "Tariq Mahmood",
    employeeId: "EMP-2025-077",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    type: "Annual Leave",
    startDate: "2026-06-12",
    endDate: "2026-06-15",
    days: 3,
    reason: "Long weekend vacation to Seattle.",
    status: "approved",
    appliedDate: "2026-06-01",
    reviewedBy: "Sarah Jenkins",
    reviewedDate: "2026-06-02"
  },
  {
    id: "LV-2037",
    employeeName: "Marcus Vance",
    employeeId: "EMP-2024-045",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    type: "Casual Leave",
    startDate: "2026-06-05",
    endDate: "2026-06-05",
    days: 1,
    reason: "Child's school parent-teacher meeting.",
    status: "approved",
    appliedDate: "2026-06-03",
    reviewedBy: "Sarah Jenkins",
    reviewedDate: "2026-06-04"
  },
  {
    id: "LV-2036",
    employeeName: "Elena Rostova",
    employeeId: "EMP-2025-012",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    type: "Sick Leave",
    startDate: "2026-06-01",
    endDate: "2026-06-02",
    days: 2,
    reason: "Acute migraine. Prescribed bed rest.",
    status: "approved",
    appliedDate: "2026-06-01",
    reviewedBy: "Sarah Jenkins",
    reviewedDate: "2026-06-01"
  },
  {
    id: "LV-2031",
    employeeName: "Devon Reynolds",
    employeeId: "EMP-2026-104",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    type: "Annual Leave",
    startDate: "2026-05-15",
    endDate: "2026-05-22",
    days: 6,
    reason: "Spring camping trip.",
    status: "rejected",
    appliedDate: "2026-04-20",
    reviewedBy: "Sarah Jenkins",
    reviewedDate: "2026-04-22",
    rejectionReason: "Too many team members are already out on annual leave during this week. Coverage is insufficient."
  }
];

export const mockAdminStats = {
  totalEmployees: 45,
  totalRequests: 148,
  pendingRequests: 5,
  approvedRequests: 125,
  rejectedRequests: 18
};

// Recharts datasets configured with Replicate-styled colors (orange, charcoal, pink, glow, soft green)
export const leaveOverviewData = [
  { month: "Jan", applied: 14, approved: 12, rejected: 2 },
  { month: "Feb", applied: 18, approved: 15, rejected: 3 },
  { month: "Mar", applied: 22, approved: 18, rejected: 4 },
  { month: "Apr", applied: 15, approved: 13, rejected: 2 },
  { month: "May", applied: 35, approved: 30, rejected: 5 },
  { month: "Jun", applied: 44, approved: 37, rejected: 2 }
];

export const leaveTypeDistribution = [
  { name: "Annual Leave", value: 65, color: "#ea2804" },
  { name: "Sick Leave", value: 20, color: "#2b9a66" },
  { name: "Casual Leave", value: 10, color: "#f59e0b" },
  { name: "Maternity", value: 3, color: "#ff6a3d" },
  { name: "Unpaid", value: 2, color: "#646464" }
];

export const mockNotifications = [
  {
    id: "nt-1",
    title: "Leave Approved",
    message: "Your Sick Leave request for Jun 18 - Jun 19 has been approved by Sarah Jenkins.",
    time: "2 weeks ago",
    read: false,
    type: "approved"
  },
  {
    id: "nt-2",
    title: "Leave Applied Successfully",
    message: "Your Annual Leave request for Jul 15 - Jul 22 has been submitted for review.",
    time: "4 hours ago",
    read: false,
    type: "applied"
  },
  {
    id: "nt-3",
    title: "Leave Rejected",
    message: "Your Annual Leave request for Mar 01 - Mar 05 was rejected. Reason: 'Quarterly release deadline.'",
    time: "4 months ago",
    read: true,
    type: "rejected"
  }
];

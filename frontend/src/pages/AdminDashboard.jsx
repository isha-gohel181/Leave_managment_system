import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Hourglass, 
  CheckCircle2, 
  XCircle, 
  CalendarDays,
  FileSpreadsheet
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
export function AdminDashboard({ leaveRequests, setActiveTab }) {
  // Recalculate stats dynamically based on leaveRequests state
  const pendingRequests = leaveRequests.filter(req => req.status === "pending").length;
  const approvedRequests = leaveRequests.filter(req => req.status === "approved").length;
  const rejectedRequests = leaveRequests.filter(req => req.status === "rejected").length;
  const totalRequests = leaveRequests.length;

  // Dynamic Total Staff based on active requesters (fallback to placeholder if empty)
  const totalEmployees = new Set(leaveRequests.map(req => req.employeeId).filter(Boolean)).size || 1;

  // Dynamic Leave Type Distribution for Pie Chart
  const typeCounts = {
    'Annual Leave': 0,
    'Sick Leave': 0,
    'Casual Leave': 0
  };
  leaveRequests.forEach(req => {
    if (typeCounts[req.type] !== undefined) {
      typeCounts[req.type] += req.days;
    }
  });
  const leaveTypeDistribution = [
    { name: "Annual Leave", value: typeCounts['Annual Leave'] || 0, color: "#ea2804" },
    { name: "Sick Leave", value: typeCounts['Sick Leave'] || 0, color: "#2b9a66" },
    { name: "Casual Leave", value: typeCounts['Casual Leave'] || 0, color: "#f59e0b" }
  ];

  // Dynamic Monthly Leave overview for Bar Chart
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const leaveOverviewData = months.map(m => ({ month: m, applied: 0, approved: 0, rejected: 0 }));
  
  leaveRequests.forEach(req => {
    if (!req.appliedDate) return;
    const date = new Date(req.appliedDate);
    const monthIndex = date.getMonth();
    if (monthIndex >= 0 && monthIndex < 12) {
      leaveOverviewData[monthIndex].applied += 1;
      if (req.status === "approved") {
        leaveOverviewData[monthIndex].approved += 1;
      } else if (req.status === "rejected") {
        leaveOverviewData[monthIndex].rejected += 1;
      }
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  // Custom tooltips matching Replicate's dark code block style
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-surface-dark text-text-dark border border-border/10 p-3 rounded-lg shadow-md font-mono text-xs space-y-1">
          <p className="font-bold border-b border-border/20 pb-1 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Page Welcome Header */}
      <motion.div variants={itemVariants} className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-wider text-brand-primary font-bold">
          analytics / administration
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight font-display text-text-primary">
              Enterprise Overview
            </h2>
            <p className="text-text-muted text-sm max-w-xl font-sans">
              Real-time leave management metrics, trends, and queue statistics across all departments.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Analytics Stats Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        {/* Total Employees */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.15 } }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold text-text-muted font-sans uppercase">Total Staff</span>
              <Users className="w-4 h-4 text-text-muted shrink-0" />
            </div>
            <h3 className="text-3xl font-black text-text-primary font-display">
              {totalEmployees}
            </h3>
          </div>
          <p className="text-[10px] text-text-light font-mono mt-3 pt-2 border-t border-border/40">
            Active payroll directory
          </p>
        </motion.div>

        {/* Total Requests */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.15 } }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold text-text-muted font-sans uppercase">Total Requests</span>
              <FileSpreadsheet className="w-4 h-4 text-text-muted shrink-0" />
            </div>
            <h3 className="text-3xl font-black text-text-primary font-display">
              {totalRequests}
            </h3>
          </div>
          <p className="text-[10px] text-text-light font-mono mt-3 pt-2 border-t border-border/40">
            Total submission volume
          </p>
        </motion.div>

        {/* Pending Requests */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.15 } }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between cursor-pointer"
          onClick={() => setActiveTab("manage")}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold text-text-muted font-sans uppercase">Pending Queue</span>
              <Hourglass className="w-4 h-4 text-status-pending shrink-0" />
            </div>
            <h3 className="text-3xl font-black text-status-pending font-display">
              {pendingRequests}
            </h3>
          </div>
          <p className="text-[10px] text-brand-primary font-mono font-bold mt-3 pt-2 border-t border-border/40 hover:underline">
            Needs Review →
          </p>
        </motion.div>

        {/* Approved Requests */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.15 } }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold text-text-muted font-sans uppercase">Approved</span>
              <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
            </div>
            <h3 className="text-3xl font-black text-text-primary font-display">
              {approvedRequests}
            </h3>
          </div>
          <p className="text-[10px] text-text-light font-mono mt-3 pt-2 border-t border-border/40">
            Granted time off
          </p>
        </motion.div>

        {/* Rejected Requests */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.15 } }}
          className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold text-text-muted font-sans uppercase">Rejected</span>
              <XCircle className="w-4 h-4 text-status-rejected shrink-0" />
            </div>
            <h3 className="text-3xl font-black text-text-primary font-display">
              {rejectedRequests}
            </h3>
          </div>
          <p className="text-[10px] text-text-light font-mono mt-3 pt-2 border-t border-border/40">
            Declined requests
          </p>
        </motion.div>
      </motion.div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Monthly bar graph */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm space-y-4"
        >
          <div>
            <h3 className="text-lg font-bold text-text-primary font-display">
              Leave Requests Volume
            </h3>
            <p className="text-xs text-text-muted">
              Monthly overview comparing applied, approved, and rejected leaves.
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={leaveOverviewData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e2d8" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--color-text-muted)" }}
                  stroke="#e6e2d8"
                />
                <YAxis 
                  tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--color-text-muted)" }}
                  stroke="#e6e2d8"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-sans)", paddingTop: 10 }}
                  verticalAlign="bottom"
                  height={36}
                />
                <Bar dataKey="applied" name="Applied" fill="#ff6a3d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Approved" fill="#2b9a66" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right Side: Category Pie Chart */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-1 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-text-primary font-display">
              Category Distribution
            </h3>
            <p className="text-xs text-text-muted">
              Breakdown of leave requests by category.
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leaveTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {leaveTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute text-center">
              <span className="text-2xl font-black font-display text-text-primary">65%</span>
              <span className="text-[9px] text-text-light font-mono block uppercase">annual leave</span>
            </div>
          </div>

          {/* Custom Labels List */}
          <div className="space-y-1.5 pt-4 border-t border-border/60">
            {leaveTypeDistribution.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="font-semibold text-text-body">{entry.name}</span>
                </div>
                <span className="font-mono text-text-muted">{entry.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AdminDashboard;

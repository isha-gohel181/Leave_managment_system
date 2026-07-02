import React from "react";
import { motion } from "framer-motion";
import { 
  CalendarDays, 
  Hourglass, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function EmployeeDashboard({ 
  leaveRequests, 
  leaveBalances, 
  userProfile,
  setActiveTab 
}) {
  // Filter requests for the current user (which is Aiden in mockData)
  const myRequests = leaveRequests.filter(req => req.employeeId === userProfile.id);

  // Compute stat counts
  const totalAvailable = leaveBalances.reduce((sum, item) => sum + item.available, 0);
  const pendingRequests = myRequests.filter(req => req.status === "pending").length;
  const approvedRequests = myRequests.filter(req => req.status === "approved").length;
  const rejectedRequests = myRequests.filter(req => req.status === "rejected").length;

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-status-success/15 text-status-success hover:bg-status-success/20 border border-status-success/20 font-mono text-[10px] uppercase font-bold rounded-full px-2 py-0.5">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-status-rejected/15 text-status-rejected hover:bg-status-rejected/25 border border-status-rejected/20 font-mono text-[10px] uppercase font-bold rounded-full px-2 py-0.5">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-status-pending/15 text-status-pending hover:bg-status-pending/20 border border-status-pending/20 font-mono text-[10px] uppercase font-bold rounded-full px-2 py-0.5 animate-pulse">
            Pending
          </Badge>
        );
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Editorial Welcome Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-wider text-brand-primary font-bold">
          overview / index
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight font-display text-text-primary">
              Welcome back, {userProfile.name.split(" ")[0]}
            </h2>
            <p className="text-text-muted text-sm max-w-xl font-sans mt-1">
              You are signed in as an employee in the <span className="font-semibold text-text-primary">{userProfile.department}</span> division.
            </p>
          </div>
          <Button 
            onClick={() => setActiveTab("apply")}
            className="rounded-full bg-brand-primary hover:bg-brand-primary-hover text-text-dark font-medium shadow-sm transition-all flex items-center gap-1.5 px-5 py-2 cursor-pointer self-start md:self-auto"
          >
            Apply for Leave
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Analytics Stats Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Remaining Leave Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.15 } }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl group-hover:bg-brand-primary/10 transition-all duration-300 -mr-6 -mt-6" />
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-text-muted font-sans uppercase">Remaining Balance</span>
              <CalendarDays className="w-5 h-5 text-brand-primary shrink-0" />
            </div>
            <div>
              <h3 className="text-4xl font-black text-text-primary tracking-tight font-display">
                {totalAvailable} <span className="text-xs font-mono text-text-light font-medium uppercase">days</span>
              </h3>
            </div>
          </div>
          <p className="text-[11px] text-text-light font-mono mt-4 pt-3 border-t border-border/60">
            Across {leaveBalances.length} categories
          </p>
        </motion.div>

        {/* Pending Requests Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.15 } }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-text-muted font-sans uppercase">Pending Requests</span>
              <Hourglass className="w-5 h-5 text-status-pending shrink-0" />
            </div>
            <div>
              <h3 className="text-4xl font-black text-text-primary tracking-tight font-display">
                {pendingRequests}
              </h3>
            </div>
          </div>
          <p className="text-[11px] text-text-light font-mono mt-4 pt-3 border-t border-border/60">
            Awaiting manager approval
          </p>
        </motion.div>

        {/* Approved Leaves Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.15 } }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-text-muted font-sans uppercase">Approved Leaves</span>
              <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" />
            </div>
            <div>
              <h3 className="text-4xl font-black text-text-primary tracking-tight font-display">
                {approvedRequests}
              </h3>
            </div>
          </div>
          <p className="text-[11px] text-text-light font-mono mt-4 pt-3 border-t border-border/60">
            Current calendar year requests
          </p>
        </motion.div>

        {/* Rejected Leaves Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.15 } }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-text-muted font-sans uppercase">Rejected Leaves</span>
              <XCircle className="w-5 h-5 text-status-rejected shrink-0" />
            </div>
            <div>
              <h3 className="text-4xl font-black text-text-primary tracking-tight font-display">
                {rejectedRequests}
              </h3>
            </div>
          </div>
          <p className="text-[11px] text-text-light font-mono mt-4 pt-3 border-t border-border/60">
            Declined requests
          </p>
        </motion.div>
      </motion.div>

      {/* Main dashboard content grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Balance breakdown */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary font-display">
              Balance Breakdown
            </h3>
            <span className="text-[10px] font-mono text-text-light uppercase tracking-wider">
              real-time values
            </span>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            {leaveBalances.map((bal, i) => {
              const percentage = Math.round((bal.available / bal.total) * 100);
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-text-body">{bal.type}</span>
                    <span className="font-mono text-text-primary">
                      {bal.available} / {bal.total} <span className="text-[10px] text-text-light">days</span>
                    </span>
                  </div>
                  {/* Custom thin progress bar */}
                  <div className="w-full h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: bal.color || "var(--color-brand-primary)"
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Side: Recent requests table */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary font-display">
              Recent Leave Requests
            </h3>
            <button 
              onClick={() => setActiveTab("history")}
              className="text-xs font-mono font-bold text-brand-primary hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              View full history
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            {myRequests.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-sm font-sans">
                You haven't submitted any leave requests yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-bg-secondary/40 text-[10px] font-mono uppercase text-text-muted">
                      <th className="py-3 px-4 font-semibold">Type</th>
                      <th className="py-3 px-4 font-semibold">Dates</th>
                      <th className="py-3 px-4 font-semibold">Days</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-sm">
                    {myRequests.slice(0, 4).map((req) => (
                      <tr 
                        key={req.id} 
                        className="hover:bg-bg-secondary/20 transition-colors group"
                      >
                        <td className="py-3 px-4 font-medium text-text-primary">
                          {req.type}
                        </td>
                        <td className="py-3 px-4 text-text-body font-mono text-xs">
                          {req.startDate} <span className="text-text-light">to</span> {req.endDate}
                        </td>
                        <td className="py-3 px-4 text-text-muted font-mono font-medium">
                          {req.days} {req.days === 1 ? "day" : "days"}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(req.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default EmployeeDashboard;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function ApplyLeave({ 
  leaveBalances, 
  userProfile, 
  onAddRequest,
  setActiveTab 
}) {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [daysCount, setDaysCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Leave types list matching the balances
  const leaveTypesList = leaveBalances.map(bal => bal.type);

  // Get active balance for selected leave type
  const activeBalance = leaveBalances.find(bal => bal.type === leaveType);

  // Calculate days difference
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end >= start) {
        // Calculate difference in days (inclusive)
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        // Simple logic: count business days roughly or calendar days
        // Let's count calendar days for simplicity, but display a helpful tag
        setDaysCount(diffDays);
      } else {
        setDaysCount(0);
      }
    } else {
      setDaysCount(0);
    }
  }, [startDate, endDate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!leaveType) {
      toast.error("Please select a leave type");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date cannot be earlier than start date");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason for your leave request");
      return;
    }

    if (activeBalance && daysCount > activeBalance.available) {
      toast.error(`Insufficient balance. You only have ${activeBalance.available} available days for ${leaveType}.`);
      return;
    }

    setIsSubmitting(true);
    onAddRequest({
      type: leaveType,
      startDate,
      endDate,
      days: daysCount,
      reason,
      employeeName: userProfile.name,
      employeeId: userProfile.id,
      avatar: userProfile.avatar,
    })
      .then(() => {
        setIsSubmitting(false);
        setLeaveType("");
        setStartDate("");
        setEndDate("");
        setReason("");
        setActiveTab("history");
      })
      .catch(() => {
        setIsSubmitting(false);
      });
  };

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-wider text-brand-primary font-bold">
          application / request-new
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight font-display text-text-primary">
          Apply for Leave
        </h2>
        <p className="text-text-muted text-sm max-w-xl font-sans">
          Fill out the form below to request time off. Your manager will be notified immediately.
        </p>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leave Type Select */}
            <div className="space-y-2">
              <label htmlFor="leaveType" className="text-xs font-bold text-text-muted uppercase font-sans tracking-wide">
                Leave Type
              </label>
              <select
                id="leaveType"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full bg-bg-app border border-border text-text-primary rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/10 transition-all font-sans"
              >
                <option value="">Select a leave type</option>
                {leaveBalances.map((bal, i) => (
                  <option key={i} value={bal.type}>
                    {bal.type} ({bal.available} days remaining)
                  </option>
                ))}
              </select>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-xs font-bold text-text-muted uppercase font-sans tracking-wide">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-full bg-bg-app border border-border text-text-primary px-4 py-2.5 focus:outline-none focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="endDate" className="text-xs font-bold text-text-muted uppercase font-sans tracking-wide">
                  End Date
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-full bg-bg-app border border-border text-text-primary px-4 py-2.5 focus:outline-none focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/10 transition-all"
                />
              </div>
            </div>

            {/* Live Count Helper Banner */}
            {daysCount > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-bg-secondary border border-border flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-brand-primary" />
                  <div>
                    <span className="text-sm font-bold text-text-primary font-display">
                      Requested Duration: {daysCount} {daysCount === 1 ? "Day" : "Days"}
                    </span>
                    {activeBalance && (
                      <span className="text-xs text-text-muted block mt-0.5">
                        New balance will be {activeBalance.available - daysCount} days of {activeBalance.type}.
                      </span>
                    )}
                  </div>
                </div>
                {activeBalance && daysCount <= activeBalance.available ? (
                  <Badge className="bg-status-success/15 text-status-success hover:bg-status-success/15 border-0 font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-full">
                    Available
                  </Badge>
                ) : (
                  <Badge className="bg-status-rejected/15 text-status-rejected hover:bg-status-rejected/15 border-0 font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Insufficient
                  </Badge>
                )}
              </motion.div>
            )}

            {/* Leave Reason */}
            <div className="space-y-2">
              <label htmlFor="reason" className="text-xs font-bold text-text-muted uppercase font-sans tracking-wide">
                Reason for Leave
              </label>
              <Textarea
                id="reason"
                placeholder="Please describe why you are requesting time off..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl bg-bg-app border border-border text-text-primary p-4 min-h-[120px] focus:outline-none focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/10 transition-all"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-brand-primary hover:bg-brand-primary-hover text-text-dark font-medium shadow-sm transition-all py-3 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-text-dark border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Request...</span>
                </div>
              ) : (
                "Submit Leave Request"
              )}
            </Button>
          </form>
        </motion.div>

        {/* Right Column: Balance Summary Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-text-primary font-display">
              Balances Overview
            </h3>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-4">
            <p className="text-xs text-text-muted font-sans pb-3 border-b border-border/80">
              Clicking a category automatically prefills the select dropdown menu.
            </p>
            <div className="space-y-3">
              {leaveBalances.map((bal, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setLeaveType(bal.type)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    leaveType === bal.type
                      ? "bg-bg-secondary border-brand-primary shadow-sm"
                      : "bg-transparent border-border/60 hover:bg-bg-secondary/40"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-text-primary block font-display">
                      {bal.type}
                    </span>
                    <span className="text-[11px] text-text-muted block font-sans">
                      Used: {bal.used} / Total: {bal.total}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-text-primary block font-display">
                      {bal.available}
                    </span>
                    <span className="text-[9px] text-text-light font-mono block uppercase">
                      available
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ApplyLeave;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Clock 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogFooter, 
  DialogTitle, 
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";

export function ManageRequests({ leaveRequests, onUpdateRequest }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending"); // Default to pending queue
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Rejection modal state
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Extract unique leave types for filter dropdown
  const leaveTypes = ["all", ...new Set(leaveRequests.map((req) => req.type))];

  // Apply search & filters
  const filteredRequests = leaveRequests.filter((req) => {
    const matchesSearch = 
      req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesType = typeFilter === "all" || req.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  const handleApprove = (id) => {
    onUpdateRequest(id, "approved");
    toast.success("Leave Request Approved Successfully");
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    onUpdateRequest(rejectingRequest.id, "rejected", rejectionReason);
    toast.success("Leave Request Rejected");
    setRejectingRequest(null);
    setRejectionReason("");
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
          <Badge className="bg-status-pending/15 text-status-pending hover:bg-status-pending/20 border border-status-pending/20 font-mono text-[10px] uppercase font-bold rounded-full px-2 py-0.5">
            Pending
          </Badge>
        );
    }
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
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-wider text-brand-primary font-bold">
          queue / action-required
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight font-display text-text-primary">
          Manage Leave Requests
        </h2>
        <p className="text-text-muted text-sm max-w-xl font-sans">
          Review, approve, or reject employee leave submissions. Use filters to access historical decisions.
        </p>
      </motion.div>

      {/* Control Bar */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-sm"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-light" />
          <Input
            type="text"
            placeholder="Search employee, ID, reason..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-8 rounded-full bg-bg-app border border-border focus:ring-2 focus:ring-blue-500/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3.5 text-text-light hover:text-text-primary cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Leave Type Selector */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-bg-app border border-border text-text-primary rounded-full px-4 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
          >
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "ALL TYPES" : type.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Status Tabs */}
          <div className="flex bg-bg-secondary p-1 rounded-full border border-border/80">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 text-xs font-mono font-medium transition-all uppercase cursor-pointer ${
                  statusFilter === status
                    ? "bg-card text-text-primary shadow-sm font-semibold"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Table */}
      <motion.div variants={itemVariants} className="space-y-4">
        {filteredRequests.length === 0 ? (
          <EmptyState 
            title="Queue is empty"
            description={
              searchTerm 
                ? "No matching pending requests or search parameters found." 
                : "Good job! You have processed all submissions in this category."
            }
          />
        ) : (
          <>
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-bg-secondary/40 text-[10px] font-mono uppercase text-text-muted">
                      <th className="py-4 px-6 font-semibold">Employee</th>
                      <th className="py-4 px-6 font-semibold">Leave Type</th>
                      <th className="py-4 px-6 font-semibold">Dates</th>
                      <th className="py-4 px-6 text-center font-semibold">Days</th>
                      <th className="py-4 px-6 font-semibold">Reason</th>
                      <th className="py-4 px-6 font-semibold">Status</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-sm">
                    {currentItems.map((req) => (
                      <tr 
                        key={req.id} 
                        className="hover:bg-bg-secondary/10 transition-colors"
                      >
                        {/* Employee info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={req.avatar}
                              alt={req.employeeName}
                              className="w-9 h-9 rounded-full object-cover border border-border"
                            />
                            <div>
                              <h4 className="font-bold text-text-primary font-display leading-tight">
                                {req.employeeName}
                              </h4>
                              <span className="text-[10px] text-text-light font-mono block">
                                {req.employeeId}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Leave type */}
                        <td className="py-4 px-6 font-semibold text-text-primary">
                          {req.type}
                        </td>

                        {/* Dates */}
                        <td className="py-4 px-6 text-text-body font-mono text-xs whitespace-nowrap">
                          {req.startDate} <span className="text-text-light font-sans">to</span> {req.endDate}
                        </td>

                        {/* Days */}
                        <td className="py-4 px-6 text-center text-text-muted font-mono font-medium">
                          {req.days}
                        </td>

                        {/* Reason */}
                        <td className="py-4 px-6 text-text-muted max-w-xs">
                          <p className="line-clamp-2 leading-relaxed" title={req.reason}>
                            {req.reason}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          {getStatusBadge(req.status)}
                        </td>

                        {/* Action buttons */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          {req.status === "pending" ? (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(req.id)}
                                className="rounded-full bg-status-success hover:bg-status-success/80 text-text-dark font-medium shadow-sm transition-all h-8 w-8 p-0 flex items-center justify-center cursor-pointer"
                                title="Approve Request"
                              >
                                <Check className="w-4 h-4 text-white" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => setRejectingRequest(req)}
                                className="rounded-full bg-status-rejected hover:bg-status-rejected/80 text-text-dark font-medium shadow-sm transition-all h-8 w-8 p-0 flex items-center justify-center cursor-pointer"
                                title="Reject Request"
                              >
                                <X className="w-4 h-4 text-white" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-text-light font-mono">
                              Processed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-text-light font-mono">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRequests.length)} of {filteredRequests.length} logs
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-card border-border cursor-pointer text-xs"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                    Prev
                  </Button>
                  <span className="text-xs font-mono font-bold text-text-primary px-3">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-card border-border cursor-pointer text-xs"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* ShadCN Dialog overlay for Rejection Reason */}
      <Dialog open={!!rejectingRequest} onOpenChange={(open) => { if (!open) setRejectingRequest(null); }}>
        <DialogContent className="rounded-2xl border border-border bg-card max-w-md w-full">
          <form onSubmit={handleRejectSubmit}>
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-lg font-bold font-display text-text-primary">
                Reject Leave Request
              </DialogTitle>
              <DialogDescription className="text-xs text-text-muted">
                Provide a reason for declining the request from <span className="font-semibold text-text-primary">{rejectingRequest?.employeeName}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3">
              <label htmlFor="rejectReason" className="text-[10px] font-bold font-mono uppercase text-text-muted tracking-wide">
                Rejection Reason
              </label>
              <Textarea
                id="rejectReason"
                placeholder="Specify the release schedule conflicts, team coverage gaps, or other reasons..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                className="w-full rounded-xl bg-bg-app border border-border text-text-primary p-3 min-h-[100px] text-xs focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-4 h-9 text-xs border-border"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="rounded-full bg-status-rejected hover:bg-status-rejected/90 text-text-dark font-medium px-4 h-9 text-xs cursor-pointer"
              >
                Confirm Reject
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default ManageRequests;

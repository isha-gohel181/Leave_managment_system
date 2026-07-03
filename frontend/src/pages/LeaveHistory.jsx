import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/EmptyState";

export function LeaveHistory({ leaveRequests, userProfile }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter requests for the current user
  const myRequests = leaveRequests.filter(req => req.employeeId === userProfile.id);

  // Apply search & filters
  const filteredRequests = myRequests.filter((req) => {
    const matchesSearch = 
      req.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

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
          history / request-log
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight font-display text-text-primary">
          Leave History
        </h2>
        <p className="text-text-muted text-sm max-w-xl font-sans">
          Review all leave requests submitted by you, check statuses, and read approval feedback.
        </p>
      </motion.div>

      {/* Filters & Search Control Bar */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-sm"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
          <Input
            type="text"
            placeholder="Search by category, description, request ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to first page
            }}
            className="pl-10 pr-8 rounded-full bg-bg-app border border-border focus:outline-none focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/10 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-text-primary cursor-pointer flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-bg-secondary p-1 rounded-full border border-border/80 self-start md:self-auto">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all uppercase cursor-pointer ${
                statusFilter === status
                  ? "bg-card text-text-primary shadow-sm font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Table Content */}
      <motion.div variants={itemVariants} className="space-y-4">
        {filteredRequests.length === 0 ? (
          <EmptyState 
            title="No leave requests match your filters"
            description={
              searchTerm 
                ? "Try adjusting your search queries or clearing filters." 
                : "You don't have any leave requests under the selected category."
            }
          />
        ) : (
          <>
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-bg-secondary/40 text-[10px] font-mono uppercase text-text-muted">
                      <th className="py-3.5 px-6 font-semibold">ID</th>
                      <th className="py-3.5 px-6 font-semibold">Leave Type</th>
                      <th className="py-3.5 px-6 font-semibold">Dates Requested</th>
                      <th className="py-3.5 px-6 font-semibold text-center">Days</th>
                      <th className="py-3.5 px-6 font-semibold">Reason</th>
                      <th className="py-3.5 px-6 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-sm">
                    {currentItems.map((req) => (
                      <tr 
                        key={req.id} 
                        className="hover:bg-bg-secondary/10 transition-colors"
                      >
                        <td className="py-4 px-6 font-mono text-xs text-text-muted">
                          {req.id}
                        </td>
                        <td className="py-4 px-6 font-semibold text-text-primary">
                          {req.type}
                        </td>
                        <td className="py-4 px-6 text-text-body font-mono text-xs">
                          {req.startDate} <span className="text-text-light font-sans">to</span> {req.endDate}
                        </td>
                        <td className="py-4 px-6 text-center text-text-muted font-mono font-medium">
                          {req.days}
                        </td>
                        <td className="py-4 px-6 text-text-muted max-w-xs truncate" title={req.reason}>
                          {req.reason}
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            {getStatusBadge(req.status)}
                            {req.status === "approved" && req.reviewedBy && (
                              <span className="text-[10px] text-text-light font-mono block">
                                Approved by {req.reviewedBy}
                              </span>
                            )}
                            {req.status === "rejected" && req.rejectionReason && (
                              <span 
                                className="text-[10px] text-status-rejected font-mono block max-w-xs truncate cursor-help"
                                title={`Reason: ${req.rejectionReason}`}
                              >
                                Reason: {req.rejectionReason}
                              </span>
                            )}
                          </div>
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
    </motion.div>
  );
}

export default LeaveHistory;

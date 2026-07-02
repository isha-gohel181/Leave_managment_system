import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Layout } from "@/components/Layout";
import { EmployeeDashboard } from "@/pages/EmployeeDashboard";
import { ApplyLeave } from "@/pages/ApplyLeave";
import { LeaveHistory } from "@/pages/LeaveHistory";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { ManageRequests } from "@/pages/ManageRequests";
import { Profile } from "@/pages/Profile";
import { 
  StatsSkeleton, 
  TableSkeleton, 
  FormSkeleton 
} from "@/components/LoadingSkeleton";
import { 
  mockUsers, 
  initialLeaveBalances, 
  initialLeaveRequests 
} from "@/lib/mockData";

export default function App() {
  const [role, setRole] = useState("employee"); // "employee" or "admin"
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, apply, history, manage, profile
  const [isLoading, setIsLoading] = useState(false);
  
  // Shared state to allow reactive updates between apply, history and admin actions
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [leaveBalances, setLeaveBalances] = useState(initialLeaveBalances);

  const currentUser = role === "admin" ? mockUsers.admin : mockUsers.employee;

  // Simulate loading states on tab transition to show off the skeleton UI
  const handleSetActiveTab = (tab) => {
    setIsLoading(true);
    setActiveTab(tab);
  };

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Adjust active tab when changing roles to avoid landing on invalid tabs
  const handleSetRole = (newRole) => {
    setRole(newRole);
    if (newRole === "admin") {
      handleSetActiveTab("admin-dashboard");
    } else {
      handleSetActiveTab("dashboard");
    }
    toast.success(`Switched role to ${newRole === "admin" ? "HR Administrator" : "Aidan (Employee)"}`);
  };

  const handleAddRequest = (newReq) => {
    const id = `LV-${Math.floor(1000 + Math.random() * 9000)}`;
    const reqWithId = {
      id,
      ...newReq,
      status: "pending",
      appliedDate: new Date().toISOString().split("T")[0]
    };
    
    // Prepend request
    setLeaveRequests(prev => [reqWithId, ...prev]);

    // Update balance: move available to pending
    setLeaveBalances(prevBalances => 
      prevBalances.map(bal => {
        if (bal.type === newReq.type) {
          return {
            ...bal,
            pending: bal.pending + newReq.days,
            available: Math.max(0, bal.available - newReq.days)
          };
        }
        return bal;
      })
    );
  };

  const handleUpdateRequest = (id, status, rejectionReason = "") => {
    const req = leaveRequests.find(r => r.id === id);
    if (!req) return;

    // Update request status
    setLeaveRequests(prevRequests => 
      prevRequests.map(r => {
        if (r.id === id) {
          return {
            ...r,
            status,
            reviewedBy: mockUsers.admin.name,
            reviewedDate: new Date().toISOString().split("T")[0],
            rejectionReason
          };
        }
        return r;
      })
    );

    // Update balances: clear pending and adjust available/used
    setLeaveBalances(prevBalances => 
      prevBalances.map(bal => {
        if (bal.type === req.type) {
          if (status === "approved") {
            return {
              ...bal,
              pending: Math.max(0, bal.pending - req.days),
              used: bal.used + req.days
            };
          } else if (status === "rejected") {
            return {
              ...bal,
              pending: Math.max(0, bal.pending - req.days),
              available: bal.available + req.days // restore available days
            };
          }
        }
        return bal;
      })
    );
  };

  const handleLogout = () => {
    toast.info("Mock system sign out triggered.");
  };

  // Render Page Content or Skeleton depending on loading state
  const renderContent = () => {
    if (isLoading) {
      if (activeTab === "dashboard" || activeTab === "admin-dashboard") {
        return (
          <div className="space-y-8 animate-pulse">
            <StatsSkeleton />
            <TableSkeleton rows={4} cols={4} />
          </div>
        );
      }
      if (activeTab === "apply") {
        return <FormSkeleton />;
      }
      if (activeTab === "history" || activeTab === "manage") {
        return <TableSkeleton rows={6} cols={6} />;
      }
      return (
        <div className="space-y-4 max-w-xl mx-auto pt-10">
          <div className="h-8 bg-border/40 rounded-full w-48 animate-pulse" />
          <div className="h-32 bg-border/40 rounded-xl w-full animate-pulse" />
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <EmployeeDashboard
            leaveRequests={leaveRequests}
            leaveBalances={leaveBalances}
            userProfile={currentUser}
            setActiveTab={handleSetActiveTab}
          />
        );
      case "apply":
        return (
          <ApplyLeave
            leaveBalances={leaveBalances}
            userProfile={currentUser}
            onAddRequest={handleAddRequest}
            setActiveTab={handleSetActiveTab}
          />
        );
      case "history":
        return (
          <LeaveHistory
            leaveRequests={leaveRequests}
            userProfile={currentUser}
          />
        );
      case "admin-dashboard":
        return (
          <AdminDashboard
            leaveRequests={leaveRequests}
            setActiveTab={handleSetActiveTab}
          />
        );
      case "manage":
        return (
          <ManageRequests
            leaveRequests={leaveRequests}
            onUpdateRequest={handleUpdateRequest}
          />
        );
      case "profile":
        return (
          <Profile
            userProfile={currentUser}
            role={role}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-text-muted">
            Page not found.
          </div>
        );
    }
  };

  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: "var(--color-bg-surface-dark)",
            color: "var(--color-text-dark)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            borderRadius: "9999px",
            padding: "8px 16px"
          }
        }} 
      />
      <Layout
        role={role}
        setRole={handleSetRole}
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        userProfile={currentUser}
        onLogout={handleLogout}
      >
        {renderContent()}
      </Layout>
    </>
  );
}

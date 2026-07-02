import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Layout } from "@/components/Layout";
import { Login } from "@/pages/Login";
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
import { api, calculateLeaveBalances } from "@/lib/api";

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("employee"); // "employee" or "admin"
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, apply, history, manage, profile
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Shared state populated dynamically from the backend APIs
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const response = await api.auth.getMe();
          if (response.success && response.data) {
            const currentUser = response.data;
            setUser(currentUser);
            setToken(savedToken);
            setRole(currentUser.role);
            setActiveTab(currentUser.role === "admin" ? "admin-dashboard" : "dashboard");
          }
        } catch (error) {
          localStorage.removeItem("token");
          toast.error("Session expired. Please sign in again.");
        }
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  // Fetch data from backend APIs
  const loadData = async (currentUser) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      if (currentUser.role === "admin") {
        const reqResponse = await api.leaves.getAllRequests();
        if (reqResponse.success) {
          setLeaveRequests(reqResponse.data);
        }
      } else {
        const reqResponse = await api.leaves.getMyRequests();
        if (reqResponse.success) {
          setLeaveRequests(reqResponse.data);
          const computedBalances = calculateLeaveBalances(currentUser.rawBalances, reqResponse.data);
          setLeaveBalances(computedBalances);
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to load leave data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch data whenever user, active tab, or role changes
  useEffect(() => {
    if (user) {
      loadData(user);
    }
  }, [user, activeTab, role]);

  const handleLoginSuccess = (loggedInUser, userToken) => {
    setUser(loggedInUser);
    setToken(userToken);
    setRole(loggedInUser.role);
    setActiveTab(loggedInUser.role === "admin" ? "admin-dashboard" : "dashboard");
  };

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
  };

  const handleAddRequest = async (newReq) => {
    setIsLoading(true);
    try {
      const response = await api.leaves.apply(newReq);
      if (response.success) {
        toast.success("Leave request submitted successfully!");
        // Refresh local data from server
        if (user) {
          const refreshedMe = await api.auth.getMe();
          if (refreshedMe.success) {
            setUser(refreshedMe.data);
          }
        }
        handleSetActiveTab("dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Could not submit leave request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRequest = async (id, status, rejectionReason = "") => {
    setIsLoading(true);
    try {
      const response = await api.leaves.updateStatus(id, status, rejectionReason);
      if (response.success) {
        toast.success(`Leave request was ${status.toLowerCase()}!`);
        // Refresh data
        await loadData(user);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update request status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    setUser(null);
    setToken(null);
    setLeaveRequests([]);
    setLeaveBalances([]);
    toast.success("Logged out successfully.");
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
            userProfile={user}
            setActiveTab={handleSetActiveTab}
          />
        );
      case "apply":
        return (
          <ApplyLeave
            leaveBalances={leaveBalances}
            userProfile={user}
            onAddRequest={handleAddRequest}
            setActiveTab={handleSetActiveTab}
          />
        );
      case "history":
        return (
          <LeaveHistory
            leaveRequests={leaveRequests}
            userProfile={user}
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
            userProfile={user}
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

  // Authenticating Loader
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-bg-app flex justify-center items-center">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest animate-pulse">
            Verifying Identity Portal
          </p>
        </div>
      </div>
    );
  }

  // Not Logged In screen
  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <Login onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

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
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        userProfile={user}
        onLogout={handleLogout}
      >
        {renderContent()}
      </Layout>
    </>
  );
}


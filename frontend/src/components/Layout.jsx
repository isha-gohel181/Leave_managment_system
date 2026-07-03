import React, { useState } from "react";
import { 
  LayoutDashboard, 
  CalendarPlus, 
  CalendarDays, 
  Users2, 
  UserCircle, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Shield,
  Circle,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Layout({ 
  children, 
  role, 
  activeTab, 
  setActiveTab,
  userProfile,
  onLogout,
  leaveRequests = []
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState([]);

  // Generate dynamic notifications from real backend leave requests
  const notifications = (() => {
    if (role === "admin") {
      // HR Admin notifications for pending queue requests
      return leaveRequests
        .filter(req => req.status === "pending")
        .map(req => ({
          id: req.id,
          title: "New Queue Request",
          message: `${req.employeeName} requested ${req.days} day(s) of ${req.type}.`,
          time: req.appliedDate || "Today",
          read: readNotificationIds.includes(req.id),
          type: "pending"
        }));
    } else {
      // Employee notifications for approvals and status changes
      return leaveRequests.map(req => {
        let title = "Request Submitted";
        let message = `Your ${req.type} request for ${req.startDate} has been sent for review.`;
        if (req.status === "approved") {
          title = "Request Approved";
          message = `Your ${req.type} request for ${req.startDate} was approved by ${req.reviewedBy || 'HR'}.`;
        } else if (req.status === "rejected") {
          title = "Request Rejected";
          message = `Your ${req.type} request for ${req.startDate} was rejected.`;
        }
        return {
          id: req.id,
          title,
          message,
          time: req.appliedDate || "Recently",
          read: readNotificationIds.includes(req.id),
          type: req.status
        };
      });
    }
  })();

  const unreadCount = notifications.filter(n => !n.read).length;

  const employeeMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "apply", label: "Apply Leave", icon: CalendarPlus },
    { id: "history", label: "Leave History", icon: CalendarDays },
    { id: "profile", label: "Profile", icon: UserCircle },
  ];

  const adminMenuItems = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "manage", label: "Manage Requests", icon: Users2 },
    { id: "profile", label: "Profile", icon: UserCircle },
  ];

  const menuItems = role === "admin" ? adminMenuItems : employeeMenuItems;

  const markAllAsRead = () => {
    setReadNotificationIds(notifications.map(n => n.id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-status-success" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-status-rejected" />;
      default:
        return <Info className="w-4 h-4 text-status-pending" />;
    }
  };

  const currentItem = menuItems.find(item => item.id === activeTab) || menuItems[0];
  const pageTitle = currentItem ? currentItem.label : "Dashboard";

  return (
    <div className="min-h-screen bg-bg-app text-text-primary flex font-sans antialiased">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-bg-secondary border-r border-border min-h-screen p-6 shrink-0 justify-between">
        <div className="space-y-8">
          {/* Logo / Brand Header */}
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 text-brand-primary stroke-current">
              <circle cx="50" cy="50" r="40" strokeWidth="16" strokeLinecap="round" strokeDasharray="180 300" strokeDashoffset="-20" />
              <circle cx="50" cy="50" r="22" strokeWidth="8" strokeLinecap="round" strokeDasharray="90 300" strokeDashoffset="-10" opacity="0.8" />
              <circle cx="78" cy="50" r="7" className="fill-current stroke-none" />
            </svg>
            <div>
              <span className="font-display font-extrabold text-lg tracking-tight text-text-primary">
                crave
              </span>
              <span className="font-mono text-[10px] block text-brand-primary font-bold tracking-widest uppercase">
                leave_sys
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-bold transition-all group cursor-pointer ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "text-text-body font-semibold hover:bg-border/40 hover:text-text-primary"
                  }`}
                >
                  <Icon 
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? "text-brand-primary" : "text-text-light"
                    }`} 
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile section at the bottom of sidebar */}
        <div className="space-y-4 pt-6 border-t border-border relative">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-10 h-10 rounded-full object-cover border border-border"
              />
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold font-display text-text-primary truncate">
                  {userProfile.name}
                </h4>
                <p className="text-[10px] text-text-muted font-mono uppercase truncate flex items-center gap-1">
                  {role === "admin" && <Shield className="w-2.5 h-2.5 text-brand-primary" />}
                  {role}
                </p>
              </div>
            </div>

            {/* Desktop Notification Bell */}
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-full hover:bg-border/60 text-text-body transition-all relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-brand-primary text-text-dark font-mono text-[8px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notifications Dropdown Panel (Desktop Sidebar version) */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setIsNotificationsOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-16 left-0 w-80 bg-card border border-border rounded-xl shadow-lg z-40 overflow-hidden text-left"
                >
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <span className="font-display font-extrabold text-sm text-text-primary">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-mono text-brand-primary font-bold hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-border/50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-text-muted">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`p-3 text-left transition-all ${
                            !notif.read ? "bg-bg-secondary/40 font-medium" : "opacity-80"
                          }`}
                        >
                          <div className="flex gap-2.5">
                            <div className="mt-0.5 shrink-0">
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <h4 className="text-xs font-bold text-text-primary truncate">
                                {notif.title}
                              </h4>
                              <p className="text-[11px] text-text-body leading-normal line-clamp-2">
                                {notif.message}
                              </p>
                              <span className="text-[9px] text-text-light font-mono block">
                                {notif.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-full text-xs font-medium text-text-muted hover:bg-status-rejected/10 hover:text-status-rejected transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="lg:hidden h-16 border-b border-border bg-card/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-full hover:bg-border/50 text-text-primary transition-all cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-extrabold tracking-tight font-display text-text-primary flex items-center gap-2">
              {pageTitle}
              {role === "admin" && (
                <Badge variant="secondary" className="font-mono text-[9px] uppercase font-bold text-brand-primary rounded-full px-2 py-0">
                  Admin Panel
                </Badge>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3">

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-full hover:bg-bg-secondary text-text-body transition-all relative cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-primary text-text-dark font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    {/* Click-away backdrop */}
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setIsNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-40 overflow-hidden"
                    >
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <span className="font-display font-extrabold text-sm text-text-primary">
                          Notifications
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[10px] font-mono text-brand-primary font-bold hover:underline cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-border/50">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-text-muted">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              className={`p-3 text-left transition-all ${
                                !notif.read ? "bg-bg-secondary/40 font-medium" : "opacity-80"
                              }`}
                            >
                              <div className="flex gap-2.5">
                                <div className="mt-0.5 shrink-0">
                                  {getNotificationIcon(notif.type)}
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                  <h4 className="text-xs font-bold text-text-primary truncate">
                                    {notif.title}
                                  </h4>
                                  <p className="text-[11px] text-text-body leading-normal line-clamp-2">
                                    {notif.message}
                                  </p>
                                  <span className="text-[9px] text-text-light font-mono block">
                                    {notif.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile-only avatar trigger */}
            <div className="lg:hidden flex items-center">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-8 h-8 rounded-full object-cover border border-border"
              />
            </div>
          </div>
        </header>

        {/* Dynamic page container with smooth transitions */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Slide-out Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-bg-surface-dark z-50 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-bg-secondary p-6 z-50 shadow-2xl flex flex-col justify-between lg:hidden border-r border-border"
            >
              <div className="space-y-8">
                {/* Drawer Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 text-brand-primary stroke-current">
                      <circle cx="50" cy="50" r="40" strokeWidth="16" strokeLinecap="round" strokeDasharray="180 300" strokeDashoffset="-20" />
                      <circle cx="50" cy="50" r="22" strokeWidth="8" strokeLinecap="round" strokeDasharray="90 300" strokeDashoffset="-10" opacity="0.8" />
                      <circle cx="78" cy="50" r="7" className="fill-current stroke-none" />
                    </svg>
                    <div>
                      <span className="font-display font-extrabold text-base tracking-tight text-text-primary">
                        crave
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-full hover:bg-border/60 text-text-primary cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>


                {/* Links */}
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-bold transition-all ${
                          isActive
                            ? "bg-brand-primary/10 text-brand-primary"
                            : "text-text-body font-semibold hover:bg-border/40 hover:text-text-primary"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-brand-primary" : "text-text-light"}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Footer */}
              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-10 h-10 rounded-full object-cover border border-border"
                  />
                  <div>
                    <h4 className="text-xs font-bold font-display text-text-primary truncate">
                      {userProfile.name}
                    </h4>
                    <p className="text-[10px] text-text-muted font-mono uppercase">
                      {role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-full text-xs font-medium text-text-muted hover:bg-status-rejected/10 hover:text-status-rejected transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Layout;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, User, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import loginArtwork from "@/assets/login_artwork.png";

export function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee"); // Employee or Admin

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegistering && !name)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        // Register flow
        const response = await api.auth.register(name, email, password, role);
        if (response.success) {
          toast.success(`Welcome to Crave Leave System, ${response.data.user.name}!`);
          onLoginSuccess(response.data.user, response.data.token);
        }
      } else {
        // Login flow
        const response = await api.auth.login(email, password);
        if (response.success) {
          toast.success(`Welcome back, ${response.data.user.name}!`);
          onLoginSuccess(response.data.user, response.data.token);
        }
      }
    } catch (error) {
      toast.error(error.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-app text-text-primary flex flex-col justify-center items-center p-4 font-sans selection:bg-brand-pink selection:text-brand-primary">
      {/* Main Container */}
      <div className="w-full max-w-md md:max-w-4xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden relative grid grid-cols-1 md:grid-cols-2">
        {/* Glow Line Indicator */}
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-glow via-brand-primary to-brand-pink animate-pulse col-span-1 md:col-span-2" />

        {/* Left Column: Form Section */}
        <div className="p-8 md:p-10 space-y-6 flex flex-col justify-center">
          <div className="space-y-4">
            {/* Brand Header */}
            <div className="flex items-center gap-3 justify-center">
              <svg viewBox="0 0 100 100" fill="none" className="w-8 h-8 text-brand-primary stroke-current">
                <circle cx="50" cy="50" r="40" strokeWidth="16" strokeLinecap="round" strokeDasharray="180 300" strokeDashoffset="-20" />
                <circle cx="50" cy="50" r="22" strokeWidth="8" strokeLinecap="round" strokeDasharray="90 300" strokeDashoffset="-10" opacity="0.8" />
                <circle cx="78" cy="50" r="7" className="fill-current stroke-none" />
              </svg>
              <div>
                <span className="font-display font-extrabold text-xl tracking-tight text-text-primary">
                  crave
                </span>
                <span className="font-mono text-[10px] block text-brand-primary font-bold tracking-widest uppercase">
                  leave_sys
                </span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-2xl font-black font-display tracking-tight text-text-primary">
                {isRegistering ? "Create an account" : "Welcome back"}
              </h1>
              <p className="text-xs text-text-muted">
                {isRegistering
                  ? "Enter your details to register as staff"
                  : "Enter your credentials to access your portal"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {isRegistering && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-1"
                >
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aidan O'Connor"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-bg-app/50 text-sm outline-none focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/10 transition-all font-sans text-text-primary placeholder:text-text-muted/60"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@crave.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-bg-app/50 text-sm outline-none focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/10 transition-all font-sans text-text-primary placeholder:text-text-muted/60"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-bg-app/50 text-sm outline-none focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/10 transition-all font-sans text-text-primary placeholder:text-text-muted/60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary rounded-full cursor-pointer transition-all"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {isRegistering && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-1.5 pt-2"
                >
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                    Portal Role Profile
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1 bg-bg-app border border-border/80 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setRole("Employee")}
                      className={`py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        role === "Employee"
                          ? "bg-card text-brand-primary shadow-sm border border-border"
                          : "text-text-muted hover:text-text-primary"
                      }`}
                    >
                      Employee
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("Admin")}
                      className={`py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        role === "Admin"
                          ? "bg-card text-brand-primary shadow-sm border border-border"
                          : "text-text-muted hover:text-text-primary"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      HR Admin
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-text-dark font-medium shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-text-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegistering ? "Register Staff Member" : "Sign In"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-border pt-4 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs font-mono font-bold text-text-muted hover:text-brand-primary transition-all cursor-pointer uppercase tracking-wider"
            >
              {isRegistering
                ? "Already have an account? Sign In"
                : "New staff member? Register here"}
            </button>
          </div>
        </div>

        {/* Right Column: Premium Illustration Panel */}
        <div className="hidden md:flex flex-col justify-center items-center p-12 bg-bg-secondary/40 border-l border-border relative overflow-hidden space-y-6">
          {/* Subtle Dynamic Ambient Glows */}
          <div className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full bg-brand-primary/5 blur-3xl" />
          <div className="absolute -left-20 -top-20 w-60 h-60 rounded-full bg-brand-pink/5 blur-3xl" />

          {/* Abstract Illustration */}
          <img 
            src={loginArtwork} 
            alt="Crave Leave Workspace" 
            className="max-w-[85%] h-auto rounded-xl object-contain drop-shadow-md select-none pointer-events-none z-10"
          />

          {/* Slogan & Quote */}
          <div className="text-center space-y-2 max-w-xs z-10">
            <h3 className="font-display font-extrabold text-sm text-text-primary uppercase tracking-wider">
              Streamline Your Time Off
            </h3>
            <p className="text-xs text-text-muted leading-relaxed font-sans">
              Apply for leave, manage requests, and track calendar coverage in one premium corporate portal.
            </p>
          </div>
        </div>
      </div>

      {/* Editorial Footer Info */}
      <div className="mt-8 text-center text-[10px] font-mono text-text-muted/60 uppercase tracking-widest">
        SECURE GATEWAY // ALL REQUESTS LOGGED
      </div>
    </div>
  );
}

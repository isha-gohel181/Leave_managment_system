import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Building, Shield, Calendar, MapPin, Key } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function Profile({ userProfile, role }) {
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

  // Convert profile to raw JSON representation for the dark code block
  const jsonProfile = JSON.stringify(
    {
      uuid: userProfile.id,
      identity: {
        displayName: userProfile.name,
        preferredEmail: userProfile.email,
        officeLocation: userProfile.office || "San Francisco HQ",
      },
      organization: {
        department: userProfile.department,
        systemRole: role,
        reportsTo: userProfile.manager || "Executive Committee",
        dateOfHire: userProfile.joinDate,
      },
      permissions: role === "admin" 
        ? ["leave.request.view_all", "leave.request.approve", "leave.request.reject", "audit.logs.read"]
        : ["leave.request.create", "leave.request.view_own", "profile.read"]
    },
    null,
    2
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-wider text-brand-primary font-bold">
          account / credentials
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight font-display text-text-primary">
          User Profile
        </h2>
        <p className="text-text-muted text-sm max-w-xl font-sans">
          Manage your enterprise identities, credentials, and organizational settings.
        </p>
      </motion.div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Avatar & Details */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <Card className="border-border bg-card shadow-sm p-6 text-center">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-28 h-28 rounded-full object-cover border-2 border-brand-primary"
                />
                <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-status-success border-2 border-card flex items-center justify-center" title="Online" />
              </div>
              <h3 className="text-xl font-bold font-display text-text-primary mt-4">
                {userProfile.name}
              </h3>
              <p className="text-xs text-text-muted font-mono uppercase mt-1">
                {role === "admin" ? "Administrative Officer" : "Software Engineer"}
              </p>
            </div>

            <div className="mt-8 text-left space-y-4 border-t border-border/60 pt-6">
              <div className="flex items-center gap-3 text-sm text-text-body">
                <User className="w-4 h-4 text-text-light shrink-0" />
                <div>
                  <span className="text-[10px] text-text-light block font-mono uppercase">employee id</span>
                  <span className="font-medium">{userProfile.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-body">
                <Mail className="w-4 h-4 text-text-light shrink-0" />
                <div>
                  <span className="text-[10px] text-text-light block font-mono uppercase">email</span>
                  <span className="font-medium">{userProfile.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-body">
                <Building className="w-4 h-4 text-text-light shrink-0" />
                <div>
                  <span className="text-[10px] text-text-light block font-mono uppercase">department</span>
                  <span className="font-medium">{userProfile.department}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-body">
                <Calendar className="w-4 h-4 text-text-light shrink-0" />
                <div>
                  <span className="text-[10px] text-text-light block font-mono uppercase">joining date</span>
                  <span className="font-medium">{userProfile.joinDate}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Side: Editorial JSON Config Block */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
              Metadata Configuration
            </h3>
            <span className="text-[10px] font-mono text-text-light uppercase tracking-wider">
              System LDAP Payload
            </span>
          </div>

          <div className="bg-bg-dark rounded-xl border border-border/10 overflow-hidden shadow-lg">
            {/* Dark editor header */}
            <div className="bg-bg-dark/80 px-4 py-2 border-b border-border/10 flex items-center justify-between text-[11px] font-mono text-text-light">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-status-rejected/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-pending/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-status-success/70" />
                <span className="ml-2">profile_payload.json</span>
              </span>
              <span>READONLY</span>
            </div>
            
            {/* JSON block */}
            <pre className="p-5 overflow-x-auto text-[13px] font-mono text-[#e5c07b] bg-[#282c34] leading-relaxed selection:bg-brand-primary/20">
              <code>{jsonProfile}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Profile;

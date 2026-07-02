import React from "react";
import { FolderOpen } from "lucide-react";

export function EmptyState({
  title = "No requests found",
  description = "Get started by submitting a new leave request.",
  icon: Icon = FolderOpen,
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-xl shadow-sm transition-all hover:shadow-md max-w-lg mx-auto my-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-brand-primary mb-6 border border-border/80">
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-text-primary tracking-tight mb-2 font-display">
        {title}
      </h3>
      <p className="text-sm text-text-muted max-w-sm mb-6 font-sans">
        {description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
          <Skeleton className="h-4 w-24 bg-bg-secondary rounded-full" />
          <Skeleton className="h-8 w-12 bg-bg-secondary rounded-full" />
          <Skeleton className="h-3 w-32 bg-bg-secondary rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-4 w-full overflow-hidden">
      <div className="flex justify-between items-center pb-2 border-b border-border">
        <Skeleton className="h-6 w-48 bg-bg-secondary rounded-full" />
        <Skeleton className="h-8 w-32 bg-bg-secondary rounded-full" />
      </div>
      <div className="space-y-4">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full bg-bg-secondary" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-bg-secondary rounded-full" />
                <Skeleton className="h-3 w-20 bg-bg-secondary rounded-full" />
              </div>
            </div>
            <div className="flex gap-4">
              {[...Array(cols - 1)].map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-20 bg-bg-secondary rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-8 shadow-sm space-y-6 w-full max-w-xl mx-auto">
      <Skeleton className="h-8 w-48 bg-bg-secondary rounded-full mx-auto" />
      <Skeleton className="h-4 w-64 bg-bg-secondary rounded-full mx-auto" />
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 bg-bg-secondary rounded-full" />
          <Skeleton className="h-10 w-full bg-bg-secondary rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-bg-secondary rounded-full" />
            <Skeleton className="h-10 w-full bg-bg-secondary rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-bg-secondary rounded-full" />
            <Skeleton className="h-10 w-full bg-bg-secondary rounded-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 bg-bg-secondary rounded-full" />
          <Skeleton className="h-24 w-full bg-bg-secondary rounded-xl" />
        </div>
        <Skeleton className="h-10 w-full bg-bg-secondary rounded-full pt-2" />
      </div>
    </div>
  );
}

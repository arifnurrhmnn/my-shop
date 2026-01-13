"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface EtalaseSkeletonProps {
  count?: number;
}

export function EtalaseSkeleton({ count = 4 }: EtalaseSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm animate-pulse"
        >
          {/* Thumbnail Skeleton */}
          <Skeleton className="aspect-square w-full" />

          {/* Number Badge Skeleton */}
          <div className="p-3 flex items-center justify-center">
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}

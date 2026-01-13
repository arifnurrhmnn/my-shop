"use client";

import { useEffect, useRef, useCallback } from "react";
import { Etalase } from "@/types";
import { EtalaseCard } from "./EtalaseCard";
import { EtalaseSkeleton } from "./EtalaseSkeleton";

interface EtalaseGridProps {
  items: Etalase[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function EtalaseGrid({
  items,
  loading,
  hasMore,
  onLoadMore,
}: EtalaseGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Show initial loading state
  if (loading && items.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3 p-4">
        <EtalaseSkeleton count={10} />
      </div>
    );
  }

  // Empty state
  if (!loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-4xl">🏪</span>
        </div>
        <p className="text-gray-500 text-center">Tidak ada etalase ditemukan</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((etalase, index) => (
          <EtalaseCard key={etalase.id} etalase={etalase} index={index} />
        ))}

        {/* Loading more skeleton */}
        {loading && <EtalaseSkeleton count={4} />}
      </div>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="h-10 flex items-center justify-center mt-4"
        >
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              Memuat...
            </div>
          )}
        </div>
      )}

      {/* End of list */}
      {!hasMore && items.length > 0 && (
        <p className="text-center text-sm text-gray-400 py-6">
          Semua etalase telah ditampilkan
        </p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux";
import { setAuthenticated } from "@/redux/slices/authSlice";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Check sessionStorage on mount
    const storedAuth = sessionStorage.getItem("isAuthenticated") === "true";

    if (storedAuth) {
      // User has valid session, sync with Redux
      dispatch(setAuthenticated(true));
    } else {
      // No valid session, redirect to login
      router.replace("/admin/login");
    }
  }, [dispatch, router]);

  // Show loading while checking auth (before Redux is updated)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Memverifikasi...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

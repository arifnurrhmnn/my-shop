"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux";
import { setAuthenticated } from "@/redux/slices/authSlice";
import { LoginForm } from "@/components/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Check if already authenticated
  useEffect(() => {
    // Check sessionStorage on mount
    const storedAuth = sessionStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      dispatch(setAuthenticated(true));
    }
  }, [dispatch]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-dvh bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <LoginForm />
      </div>
    </main>
  );
}

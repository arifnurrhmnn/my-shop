"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux";
import { login } from "@/redux/slices/authSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, User, LogIn } from "lucide-react";

// Static credentials as per PRD
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      dispatch(login());
      // Store auth state in sessionStorage for persistence
      sessionStorage.setItem("isAuthenticated", "true");
      toast.success("Login berhasil!", {
        description: "Selamat datang di Admin Dashboard",
      });
      router.push("/admin/dashboard");
    } else {
      toast.error("Login gagal!", {
        description: "Username atau password salah",
      });
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-sm border-0 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <Lock className="w-6 h-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
        <CardDescription>
          Masukkan kredensial untuk mengakses dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Masuk
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

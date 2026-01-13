"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux";
import { logout } from "@/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut, Store } from "lucide-react";
import { toast } from "sonner";

export function DashboardHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem("isAuthenticated");
    toast.success("Logout berhasil");
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Store className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-500">Simple Shop Etalase</p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-red-500"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[calc(100%-2rem)] max-w-xs rounded-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin keluar dari Admin Panel?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700"
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}

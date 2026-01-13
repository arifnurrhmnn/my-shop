"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function Header({ searchValue, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10">
      {/* Profile Section with Green Gradient */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-400 px-4 pt-6 pb-4 shadow-md">
        {/* Profile Info */}
        <div className="flex items-center gap-3 mb-5">
          {/* Avatar on the left - smaller size */}
          <Avatar className="w-12 h-12 ring-2 ring-white ring-offset-2 ring-offset-green-500 shadow-lg">
            <AvatarImage src="/logo-brand.webp" alt="Shop Avatar" />
            <AvatarFallback className="bg-white text-green-600 text-base font-bold">
              SE
            </AvatarFallback>
          </Avatar>

          {/* Title and Subtitle on the right */}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white drop-shadow-sm">
              Style Feast
            </h1>
            <p className="text-sm text-green-100">
              Temukan produk terbaik di sini
            </p>
          </div>
        </div>

        {/* Search Section - inside gradient but with white input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <Input
            type="text"
            placeholder="Cari nomor etalase (001, 002, ...)"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 bg-white border-0 shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:border-0 focus:border-0"
          />
        </div>
      </div>
    </header>
  );
}

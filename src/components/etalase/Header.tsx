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
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-400 px-4 pt-6 pb-5">
        <div className="flex items-center gap-4">
          {/* Avatar on the left */}
          <Avatar className="w-16 h-16 ring-2 ring-white ring-offset-2 ring-offset-green-500 shadow-lg">
            <AvatarImage src="/avatar.png" alt="Shop Avatar" />
            <AvatarFallback className="bg-white text-green-600 text-xl font-bold">
              SE
            </AvatarFallback>
          </Avatar>

          {/* Title and Subtitle on the right */}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white drop-shadow-sm">
              Simple Shop Etalase
            </h1>
            <p className="text-sm text-green-100">
              Temukan produk terbaik di sini
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari nomor etalase (001, 002, ...)"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>
    </header>
  );
}

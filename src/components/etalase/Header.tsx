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
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 pb-4">
      {/* Profile Section */}
      <div className="flex flex-col items-center pt-6 pb-4">
        <Avatar className="w-20 h-20 mb-3 ring-2 ring-green-500 ring-offset-2">
          <AvatarImage src="/avatar.png" alt="Shop Avatar" />
          <AvatarFallback className="bg-green-500 text-white text-2xl font-bold">
            SE
          </AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold text-gray-900">Simple Shop Etalase</h1>
        <p className="text-sm text-gray-500">Temukan produk terbaik di sini</p>
      </div>

      {/* Search Section */}
      <div className="relative px-4">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Cari nomor etalase (001, 002, ...)"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
        />
      </div>
    </header>
  );
}

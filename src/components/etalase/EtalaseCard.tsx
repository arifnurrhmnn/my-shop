"use client";

import { Etalase } from "@/types";
import Image from "next/image";

interface EtalaseCardProps {
  etalase: Etalase;
  index: number;
}

export function EtalaseCard({ etalase, index }: EtalaseCardProps) {
  const handleClick = () => {
    window.open(etalase.affiliate_url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={etalase.thumbnail_url}
          alt={`Etalase ${etalase.etalase_number}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, 200px"
        />
      </div>

      {/* Etalase Number Badge */}
      <div className="p-3 flex items-center justify-center">
        <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold text-green-700 bg-green-50 rounded-full">
          #{etalase.etalase_number}
        </span>
      </div>
    </div>
  );
}

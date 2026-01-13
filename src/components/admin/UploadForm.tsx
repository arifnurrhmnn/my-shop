"use client";

import { useState, useRef, useEffect } from "react";
import { etalaseService } from "@/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Link, Hash, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface UploadFormProps {
  onSuccess?: () => void;
}

export function UploadForm({ onSuccess }: UploadFormProps) {
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [etalaseNumber, setEtalaseNumber] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNumber, setIsLoadingNumber] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch next etalase number on mount
  useEffect(() => {
    const fetchNextNumber = async () => {
      try {
        const nextNumber = await etalaseService.getNextEtalaseNumber();
        setEtalaseNumber(nextNumber);
      } catch (error) {
        console.error("Failed to fetch next number:", error);
        toast.error("Gagal mengambil nomor etalase");
      } finally {
        setIsLoadingNumber(false);
      }
    };

    fetchNextNumber();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      setThumbnailFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!thumbnailFile) {
      toast.error("Pilih gambar thumbnail");
      return;
    }

    if (!affiliateUrl.trim()) {
      toast.error("Masukkan affiliate URL");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload thumbnail
      const thumbnailUrl = await etalaseService.uploadThumbnail(thumbnailFile);

      // 2. Create etalase record
      await etalaseService.createEtalase({
        etalase_number: etalaseNumber,
        thumbnail_url: thumbnailUrl,
        affiliate_url: affiliateUrl.trim(),
      });

      toast.success("Etalase berhasil ditambahkan!", {
        description: `Nomor etalase: #${etalaseNumber}`,
      });

      // Reset form
      setAffiliateUrl("");
      setThumbnailFile(null);
      setThumbnailPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Fetch next number
      const nextNumber = await etalaseService.getNextEtalaseNumber();
      setEtalaseNumber(nextNumber);

      // Callback
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create etalase:", error);
      toast.error("Gagal menambahkan etalase", {
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="w-5 h-5 text-green-600" />
          Upload Etalase Baru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-lg p-4 cursor-pointer
                transition-colors duration-200 flex flex-col items-center justify-center
                ${
                  thumbnailPreview
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                }
              `}
            >
              {thumbnailPreview ? (
                <div className="relative w-full aspect-video">
                  <Image
                    src={thumbnailPreview}
                    alt="Preview"
                    fill
                    className="object-contain rounded"
                  />
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center gap-2 text-gray-400">
                  <ImagePlus className="w-10 h-10" />
                  <p className="text-sm">Klik untuk pilih gambar</p>
                  <p className="text-xs">PNG, JPG, WEBP (max 5MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Affiliate URL */}
          <div className="space-y-2">
            <Label htmlFor="affiliateUrl">Affiliate URL</Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="affiliateUrl"
                type="url"
                placeholder="https://example.com/product"
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Etalase Number (Auto-generated, Disabled) */}
          <div className="space-y-2">
            <Label htmlFor="etalaseNumber">Nomor Etalase (Auto)</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="etalaseNumber"
                type="text"
                value={isLoadingNumber ? "..." : etalaseNumber}
                className="pl-10 bg-gray-50 font-mono"
                disabled
              />
            </div>
            <p className="text-xs text-gray-500">
              Nomor ini di-generate otomatis dan tidak bisa diubah
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading || isLoadingNumber}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengupload...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Etalase
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

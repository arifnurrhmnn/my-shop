"use client";

import { useState, useRef, useEffect } from "react";
import { etalaseService } from "@/services";
import { Etalase } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, Hash, ImagePlus, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface EditEtalaseDialogProps {
  etalase: Etalase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditEtalaseDialog({
  etalase,
  open,
  onOpenChange,
  onSuccess,
}: EditEtalaseDialogProps) {
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when etalase changes
  useEffect(() => {
    if (etalase) {
      setAffiliateUrl(etalase.affiliate_url);
      setThumbnailPreview(etalase.thumbnail_url);
      setThumbnailFile(null);
    }
  }, [etalase]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      setThumbnailFile(file);

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

    if (!etalase) return;

    if (!affiliateUrl.trim()) {
      toast.error("Masukkan affiliate URL");
      return;
    }

    setIsLoading(true);

    try {
      let thumbnailUrl = etalase.thumbnail_url;

      // Upload new thumbnail if changed
      if (thumbnailFile) {
        thumbnailUrl = await etalaseService.uploadThumbnail(thumbnailFile);
      }

      // Update etalase record
      await etalaseService.updateEtalase(etalase.id, {
        thumbnail_url: thumbnailUrl,
        affiliate_url: affiliateUrl.trim(),
      });

      toast.success("Etalase berhasil diupdate!", {
        description: `Nomor etalase: #${etalase.etalase_number}`,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update etalase:", error);
      toast.error("Gagal mengupdate etalase", {
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <DialogHeader>
          <DialogTitle>Edit Etalase</DialogTitle>
          <DialogDescription>
            Edit data etalase #{etalase?.etalase_number}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Thumbnail */}
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-lg p-2 cursor-pointer
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
                <div className="py-4 flex flex-col items-center gap-2 text-gray-400">
                  <ImagePlus className="w-8 h-8" />
                  <p className="text-xs">Klik untuk ganti gambar</p>
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
            <p className="text-xs text-gray-500">
              Biarkan jika tidak ingin mengubah gambar
            </p>
          </div>

          {/* Affiliate URL */}
          <div className="space-y-2">
            <Label htmlFor="editAffiliateUrl">Affiliate URL</Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="editAffiliateUrl"
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

          {/* Etalase Number (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="editEtalaseNumber">Nomor Etalase</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="editEtalaseNumber"
                type="text"
                value={etalase?.etalase_number || ""}
                className="pl-10 bg-gray-50 font-mono"
                disabled
              />
            </div>
            <p className="text-xs text-gray-500">
              Nomor etalase tidak bisa diubah
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Simpan
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Style Feast - Katalog Produk Fashion Terbaik",
    short_name: "Style Feast",
    description:
      "Temukan berbagai pilihan produk fashion berkualitas dengan harga terjangkau. Belanja mudah dan aman.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16a34a",
    orientation: "portrait",
    categories: ["shopping", "lifestyle"],
    lang: "id",
    icons: [
      {
        src: "/icon.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

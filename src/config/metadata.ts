import type { Metadata, Viewport } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://stylefeast.vercel.app";

type StaticMetadataParams = {
  title: string | { default: string; template: string };
  description: string;
  keywords: string[];
  canonical?: string;
};

export const getStaticMetadata = ({
  title,
  description,
  keywords,
  canonical = "",
}: StaticMetadataParams): Metadata => {
  const titleString = typeof title === "string" ? title : title.default;

  return {
    metadataBase: new URL(baseUrl),
    title: title,
    description: description,
    authors: [{ name: "Style Feast", url: baseUrl }],
    creator: "Style Feast",
    publisher: "Style Feast",
    keywords: keywords,
    alternates: {
      canonical: `${baseUrl}${canonical}`,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon.png", sizes: "48x48", type: "image/png" },
      ],
      shortcut: "/icon.png",
      apple: "/apple-touch-icon.png",
      other: {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon.png",
      },
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: "Style Feast",
      title: titleString,
      description: description,
      url: `${baseUrl}${canonical}`,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: titleString,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleString,
      description: description,
      creator: "@stylefeast",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          alt: titleString,
        },
      ],
    },
  };
};

// Default metadata untuk homepage
export const defaultMetadata = getStaticMetadata({
  title: {
    default: "Style Feast - Temukan Produk Fashion Terbaik",
    template: "%s | Style Feast",
  },
  description:
    "Style Feast adalah katalog produk fashion terbaik. Temukan berbagai pilihan produk berkualitas dengan harga terjangkau. Belanja mudah dan aman.",
  keywords: [
    "style feast",
    "fashion",
    "katalog produk",
    "belanja online",
    "etalase",
    "produk terbaik",
    "fashion murah",
    "online shop",
  ],
  canonical: "",
});

export const defaultViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#16a34a" },
    { media: "(prefers-color-scheme: dark)", color: "#16a34a" },
  ],
};

export function JsonLd() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://stylefeast.vercel.app";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Style Feast",
    url: siteUrl,
    description:
      "Style Feast adalah katalog produk fashion terbaik. Temukan berbagai pilihan produk berkualitas dengan harga terjangkau.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Style Feast",
    url: siteUrl,
    logo: `${siteUrl}/logo-brand.webp`,
    sameAs: [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
    </>
  );
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Saldo — Entrate, uscite e investimenti",
    short_name: "Saldo",
    description: "Il tuo registro personale di entrate, uscite e investimenti",
    start_url: "/",
    display: "standalone",
    background_color: "#F5FAFC",
    theme_color: "#355A70",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

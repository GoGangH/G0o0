import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "고강현",
    short_name: "고강현",
    description: "백엔드 개발자 고강현의 방",
    start_url: "/",
    display: "standalone",
    background_color: "#14110e",
    theme_color: "#14110e",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 필요한 외부 이미지 호스트만 추가하세요
      // 예: { protocol: "https", hostname: "example.com" }
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ideal-blog", // 본인 레포지토리 이름 확인
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
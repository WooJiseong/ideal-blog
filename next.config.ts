import type { NextConfig } from "next";

const nextConfig = {
  output: "export",
  
  // 2. 블로그가 하위 경로(/ideal-blog)에 배포되므로 필수 설정
  basePath: "/ideal-blog",
  
  images: {
    unoptimized: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages 배포를 위한 정적 내보내기 설정
  output: "export",
  
  // GitHub Pages는 Next.js의 이미지 최적화 서버를 사용할 수 없으므로 비활성화
  images: {
    unoptimized: true,
  },

  // (선택사항) 만약 'username.github.io/repository-name' 주소로 배포한다면
  // 아래 주석을 풀고 repository-name을 입력해야 합니다.
  // basePath: "/repository-name",
};

export default nextConfig;
// src/components/post-format/inde.ts

// 1. 사용할 컴포넌트들을 임포트
import { BookCard } from './BookCard';
// import { Youtube } from './Youtube';
// import { Callout } from './Callout';

// 2. markdown-to-jsx 형식에 맞춰서 객체로 내보내기
export const MDX_COMPONENTS = {
  // 컴포넌트 이름: { component: 실제컴포넌트 }
  BookCard,
};
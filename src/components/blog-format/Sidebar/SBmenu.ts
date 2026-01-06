// src/constants/blog-format/SidebarLayout.ts

export interface MenuItem {
  label: string;
  href: string;
  newTab?: boolean; // 이 속성이 있으면 새 탭으로 엽니다.
}

export const MENU_ITEMS: MenuItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Curriculum Vitae', href: '/posts/Curriculum_Vitae' },
  { label: 'UOS Portal', href: 'https://portal.uos.ac.kr', newTab: true},
  { label: 'GitHub', href: 'https://github.com/WooJiseong', newTab: true},
  // { label: 'About', href: '/about' }, // 나중에 추가하기 쉬움
];
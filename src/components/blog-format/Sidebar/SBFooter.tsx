'use client';

import Link from 'next/link';

export default function SidebarFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
      
      {/* 1. 소셜 아이콘 영역 (나중에 아이콘으로 교체 가능) */}
      <div className="flex justify-center gap-6 mb-4">
        <SocialLink href="https://github.com/WooJiseong" label="GitHub">
          {/* GitHub SVG Icon */}
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </SocialLink>
        
        <SocialLink href="mailto:dnwltjd1234@uos.ac.kr" label="Email">
          {/* Mail SVG Icon */}
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </SocialLink>
      </div>

      {/* 2. 카피라이트 영역 */}
      <p className="text-xs text-zinc-400 text-center leading-relaxed">
        © {currentYear} WooJiseong.
        <br />
        All rights reserved.
      </p>
    </div>
  );
}

// 반복되는 소셜 링크를 위한 작은 컴포넌트
function SocialLink({ href, label, children }: { href: string, label: string, children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label={label}
      className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors transform hover:scale-110"
    >
      {children}
    </a>
  );
}
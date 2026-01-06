'use client';

import Link from 'next/link';

interface SidebarHeaderProps {
  onClose: () => void; // 닫기 기능을 부모에게서 받아옵니다.
}

export default function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="p-6 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800">
      
      {/* 1. 로고 및 타이틀 (클릭 시 홈으로 이동 + 사이드바 닫기) */}
      <Link 
        href="/" 
        onClick={onClose} 
        className="flex items-center gap-3 group"
      >
        <span className="text-xl font-bold italic text-[#ff6b6b]">
          Ideal
        </span>
      </Link>

      {/* 2. 닫기 버튼 */}
      <button 
        onClick={onClose}
        className="p-2 text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
        aria-label="Close Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
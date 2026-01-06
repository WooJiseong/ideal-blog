'use client';

// [추가] 상태 관리를 위해 useState를 불러옵니다.
import { useState } from 'react';
import Link from "next/link";
import Sidebar from "@/components/blog-format/Sidebar";

const Navibar = () => {
  // [추가] 사이드바가 열렸는지 닫혔는지 관리하는 state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 transition-all">
        
        {/* 왼쪽: 메뉴 버튼 */}
        <div className="flex-1 flex justify-start">
          <button 
            type="button"
            // [수정] 버튼 클릭 시 상태를 true로 변경하여 사이드바를 엽니다.
            onClick={() => setIsSidebarOpen(true)}
            className="-ml-2 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Open Menu"
          >
            {/* 메뉴 아이콘 */}
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* 중앙: Ideal 로고 */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="text-2xl font-semibold italic text-[#ff6b6b]">
            Ideal
          </Link>
        </div>

        {/* 오른쪽: 링크들 */}
        <div className="flex-1 flex justify-end items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                Home
            </Link>
            
            <Link 
              href="/posts/Curriculum_Vitae" 
              className="text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                CV
            </Link>
        </div>
      </header>

      {/* [추가] 사이드바 컴포넌트 렌더링 */}
      {/* Portal을 사용하므로 위치는 상관없지만, 로직상 여기에 둡니다. */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </>
  );
};

export default Navibar;
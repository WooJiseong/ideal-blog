// src/components/blog-format/Sidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { MENU_ITEMS } from '@/components/blog-format/Sidebar/SBmenu';
import SidebarHeader from '@/components/blog-format/Sidebar/SBHeader'; // [Header]
import SidebarFooter from '@/components/blog-format/Sidebar/SBFooter'; // [Footer]

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* 1. Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 99998 }}
        onClick={onClose}
      />

      {/* 2. Sidebar Layout */}
      <aside 
        className={`fixed top-0 left-0 h-full w-[300px] bg-white dark:bg-[#0a0a0a] border-r border-zinc-200 dark:border-zinc-800 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ zIndex: 99999 }}
      >
        
        {/* [Header] 로고, 타이틀, 닫기 버튼 */}
        <SidebarHeader onClose={onClose} />

        {/* [Content] 네비게이션 메뉴 (스크롤 가능 영역) */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {MENU_ITEMS.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={onClose}
              target={item.newTab ? '_blank' : undefined}
              rel={item.newTab ? 'noopener noreferrer' : undefined}
              className="block px-4 py-3 text-lg font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <span>{item.label}</span>
                {item.newTab && (
                   <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* [Footer] 카피라이트, SNS 링크 */}
        <SidebarFooter />

      </aside>
    </>,
    document.body
  );
}
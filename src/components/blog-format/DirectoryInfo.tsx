'use client';

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Markdown from 'markdown-to-jsx'; 
import { MDX_COMPONENTS } from '@/components/post-format/format-list';

interface DirectoryInfoProps {
  title: string;
  content: string;
  color?: string;
}

export default function DirectoryInfo({ title, content, color }: DirectoryInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  // ★ width 상태 추가 (초기값은 기본값인 320 혹은 1000 등으로 설정)
  const [layout, setLayout] = useState({ top: 0, left: 0, width: 320 });
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = () => {
    if (buttonRef.current && typeof window !== 'undefined') {
      const rect = buttonRef.current.getBoundingClientRect();
      
      const IDEAL_WIDTH = 1000; // 우리가 원하는 이상적인 너비
      const LEFT_POS = rect.right + 14; // 팝업 시작 위치
      
      // 1. 화면 우측 한계점 (전체 화면의 95%)
      const rightBoundary = window.innerWidth * 0.95;
      
      // 2. 남은 공간 계산 (한계점 - 시작위치)
      const availableSpace = rightBoundary - LEFT_POS;

      // 3. 최종 너비 결정 (이상적인 너비와 남은 공간 중 작은 값)
      // Math.max(300, ...)을 추가한 이유는 너무 좁아지는 것을 방지하기 위함입니다.
      const finalWidth = Math.max(300, Math.min(IDEAL_WIDTH, availableSpace));

      setLayout({
        top: rect.top, 
        left: LEFT_POS,
        width: finalWidth
      });
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    calculatePosition();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  if (!content) return null;

  return (
    <>
      <div 
        className="relative inline-flex items-center ml-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          ref={buttonRef}
          className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-help"
          aria-label="Info"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" 
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
      </div>

      {isOpen && createPortal(
        <div 
          className="fixed pointer-events-auto"
          style={{ 
            zIndex: 99999,
            top: layout.top, 
            left: layout.left,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            // ★ width를 style로 제어하므로 className에서 w-[...] 제거
            // max-w-[90vw]는 모바일 안전장치로 남겨둠
            className="max-w-[90vw] bg-[#09090b] border border-zinc-800 p-8 rounded-xl shadow-2xl text-left max-h-[40vh] overflow-y-auto custom-scrollbar relative animate-in fade-in zoom-in-95 duration-200"
            style={{ 
                width: layout.width, // ★ 계산된 너비 적용
            }}
          >
            <h4 
              className="text-2xl font-bold mb-6 pb-4 border-b border-zinc-800"
              style={{ color: color || '#ffffff' }} 
            >
              {title}
            </h4>
            
            <div className="prose prose-invert prose-base max-w-none text-zinc-300">
              <Markdown
                options={{
                  overrides: {
                    ...MDX_COMPONENTS,
                    p: { props: { className: "text-zinc-300 mb-4 leading-relaxed" } },
                    a: { props: { className: "text-blue-400 no-underline hover:underline", target: "_blank", rel: "noopener noreferrer" } },
                    ul: { props: { className: "list-disc list-inside text-zinc-300 my-4" } },
                    li: { props: { className: "my-1" } },
                    strong: { props: { className: "text-white font-bold" } },
                  }
                }}
              >
                {content}
              </Markdown>
            </div>

            <div 
              className="absolute top-6 -left-1.5 w-3 h-3 bg-[#09090b] border-l border-b border-zinc-800 transform rotate-45"
            ></div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
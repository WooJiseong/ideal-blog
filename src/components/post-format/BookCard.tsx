// src/components/mdx/BookCard.tsx
import React from 'react';

interface BookCardProps {
  title: string;
  author: string;
  link?: string;
  imageSrc?: string;
}

export const BookCard = ({ title, author, link, imageSrc }: BookCardProps) => {
  return (
    <div className="flex gap-4 p-4 my-4 border border-zinc-700 bg-zinc-900 rounded-lg items-start">
      
      {/* 1. 텍스트 영역 (왼쪽) */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="text-lg font-bold text-white m-0 break-keep leading-snug">
          {title}
        </h3>
        <p className="text-sm text-zinc-400 mt-2 mb-0">
          {author}
        </p>
        {link && (
          <a href={link} target="_blank" rel="noreferrer" className="text-xs text-blue-400 mt-3 hover:underline self-start">
            더 보기 →
          </a>
        )}
      </div>

      {/* 2. 이미지 영역 (오른쪽) */}
      {imageSrc && (
        <div className="flex-shrink-0 w-[80px]"> 
          {/* [핵심 수정 사항] 
             1. w-full h-auto: 부모 너비(80px)에 맞추고, 높이는 이미지 비율대로 자동 조절
             2. object-contain: 이미지가 잘리지 않고 전체가 다 보이게 함
             3. m-0: prose 등의 외부 마진 간섭 제거
          */}
          <img 
            src={imageSrc} 
            alt={`${title} cover`}
            className="w-full h-auto rounded-sm border border-zinc-800 object-contain m-0"
            style={{ maxHeight: '150px' }} // 이미지가 너무 길어지는 것 방지 (안전장치)
          />
        </div>
      )}
    </div>
  );
};
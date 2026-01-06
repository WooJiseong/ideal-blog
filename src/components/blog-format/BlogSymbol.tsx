// src/components/BlogSymbol.tsx
'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

// SSR 방지
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <div className="text-zinc-400 h-[250px] flex items-center">Loading Symbol...</div>
});

const BlogSymbol = () => {
  const data = useMemo(() => {
    // 뇌 옆모습 윤곽선을 형성하는 좌표들
    const nodes = [
      // 중앙 텍스트 (위치를 약간 조정했습니다)
      { id: 'c-text', name: 'Ideal', val: 30, color: 'transparent', fx: 5, fy: -10 }, 
      
      // 외곽선 노드들 (시계 방향 순서)
      { id: 'n1', fx: -90, fy: -30 },  // 전두엽 앞쪽
      { id: 'n2', fx: -60, fy: -70 },  // 전두엽 상단
      { id: 'n3', fx: 10, fy: -90 },   // 두정엽 상단 (가장 높은 곳)
      { id: 'n4', fx: 80, fy: -60 },   // 후두엽 상단
      { id: 'n5', fx: 110, fy: -10 },  // 후두엽 뒤쪽
      { id: 'n6', fx: 90, fy: 40 },    // 소뇌 부근
      { id: 'n7', fx: 40, fy: 60 },    // 측두엽 하단 뒤
      { id: 'n8', fx: -20, fy: 45 },   // 측두엽 하단 중간
      { id: 'n9', fx: -70, fy: 20 },   // 측두엽 앞쪽
    ];

    // 윤곽선을 순서대로 연결
    const links = [
      { source: 'n1', target: 'n2' }, 
      { source: 'n2', target: 'n3' }, 
      { source: 'n3', target: 'n4' }, 
      { source: 'n4', target: 'n5' }, 
      { source: 'n5', target: 'n6' }, 
      { source: 'n6', target: 'n7' },
      { source: 'n7', target: 'n8' },
      { source: 'n8', target: 'n9' },
      { source: 'n9', target: 'n1' }, // 다시 처음으로 연결하여 닫힌 도형 만들기
      
      { source: 'n2', target: 'n8', color: '#ffaaaa' }, // 연한색
      { source: 'n3', target: 'n7', color: '#ffaaaa' },
      { source: 'n4', target: 'c-text', color: '#ffaaaa' }
    ];
    return { nodes, links };
  }, []);

  return (
    // pointer-events-none: 이 심볼 위에서의 마우스 상호작용을 완전히 차단
    <div className="flex justify-center items-center pointer-events-none"> 
      <ForceGraph2D
        width={420}
        height={350}
        graphData={data}
        backgroundColor="#00000000"
        
        // 상호작용 비활성화
        enableZoomInteraction={false} 
        enablePanInteraction={false}
        enableNodeDrag={false}
        cooldownTicks={0} 

        // 디자인
        nodeRelSize={3} // 노드 크기를 조금 줄여서 세련되게
        nodeColor={(node: any) => node.color || '#ff6b6b'}
        
        // 링크 색상 커스텀 (내부 선은 연하게)
        linkColor={(link: any) => link.color || '#ff6b6b'}
        linkWidth={2.5}
        
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          if (node.id === 'c-text') {
            const label = node.name;
            const fontSize = 45; 
            // 폰트를 약간 기울여(italic) 역동적인 느낌 추가
            ctx.font = `italic 600 ${fontSize}px Sans-Serif`; 
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ff6b6b';
            ctx.fillText(label, node.x, node.y);
          } else {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 3, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color || '#ff6b6b';
            ctx.fill();
          }
        }}
      />
    </div>
  );
};

export default BlogSymbol;
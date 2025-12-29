'use client';

import React, { useRef, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function ForceGraphWrapper({ initialData }: { initialData: any }) {
  // 수정된 부분: 괄호 안에 null을 넣었습니다.
  const fgRef = useRef<any>(null);
  
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(800);

  useEffect(() => {
    // 브라우저 환경에서만 window 객체에 접근
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);

    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ForceGraph2D
      ref={fgRef}
      width={width}
      height={height}
      graphData={initialData}
      nodeLabel="label"
      nodeColor={(node: any) => node.color}
      nodeRelSize={6}
      linkColor={() => '#cccccc'}
      backgroundColor="#fdfbf7"
      
      nodeCanvasObject={(node: any, ctx, globalScale) => {
        const label = node.label;
        const fontSize = 14 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333';
        ctx.fillText(label, node.x, node.y + 8);
      }}
      
      onNodeClick={(node: any) => {
        // null 체크를 통해 안전하게 접근
        if (fgRef.current) {
          fgRef.current.centerAt(node.x, node.y, 1000);
          fgRef.current.zoom(4, 2000);
        }
      }}
    />
  );
}
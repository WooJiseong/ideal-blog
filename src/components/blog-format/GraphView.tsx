'use client';

import { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import DirectoryInfo from '@/components/blog-format/DirectoryInfo';
import { GraphData, GraphNode, PostSummary } from '@/lib/GraphData';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <div className="text-zinc-500">Loading Graph...</div>
});

const COLORS = {
  root: '#ff6b6b', gray: '#868e96'
};

interface ForceGraphNode extends GraphNode {
  fx?: number;
  fy?: number;
}

interface GraphViewProps {
  initialData: GraphData;
}

const GraphView = ({ initialData }: GraphViewProps) => {
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 600 });
  const [selectedNode, setSelectedNode] = useState<ForceGraphNode | null>(null);
  const needsFitRef = useRef(true);

  // 1. 화면 크기 감지
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ w: window.innerWidth * 0.85, h: window.innerHeight * 0.85 });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 노드 간 반발력을 통해 그래프를 펼치는 콜백함수
  const refreshPhysics = useCallback(() => {
    const graph = fgRef.current;
    if (!graph) return;

    graph.centerAt(0, 0, 0);
    graph.zoom(1, 0);

    needsFitRef.current = true

    // (1) 강력한 힘 설정
    graph.d3Force('charge').strength(-600).distanceMax(1000);
    graph.d3Force('link').strength(1).distance((link: any) => {
        if (link.source.id === 'root') return 150;
        if (link.source.level === 1 && link.target.level === 2) return 75;
        return 50;
    });
    graph.d3Force('center').strength(0.01);

    // (2) (물리엔진 시작)
    graph.d3ReheatSimulation();
  }, []);

  // 2. 데이터 가공: 좌표 계산 로직 단순화 (Root만 중앙 고정)
  const data = useMemo(() => {
    if (!initialData) return { nodes: [], links: [] };

    const cleanNodes = JSON.parse(JSON.stringify(initialData.nodes));
    const cleanLinks = JSON.parse(JSON.stringify(initialData.links));

    const nodesWithPos: ForceGraphNode[] = cleanNodes.map((node : any) => {
      const newNode = { ...node };
      delete newNode.x;
      delete newNode.y;
      delete newNode.vx;
      delete newNode.vy;

      // [핵심 변경] Root를 화면 정중앙(0, 0)에 고정
      if (node.id === 'root') {
        newNode.fx = 0;
        newNode.fy = 0;
      } 
      // 나머지 모든 노드(Category, Post)는 fx, fy를 제거하여 
      // 물리 엔진(반발력)에 의해 자연스럽게 퍼지도록 함
      
      return newNode;
    });
    return {
      nodes: nodesWithPos,
      links: cleanLinks
    };
  }, [initialData]);
  
  // 세팅값 (데이터, 화면크기, 그래프)가 변화하면, 실행되는 구문
  useEffect(() => {
                    const timer = setTimeout(() => {
                      refreshPhysics();
                    },200);
                  return () => clearTimeout(timer);
                  }, [dimensions, data, refreshPhysics]);

  return (
    <div className="relative flex justify-center items-center">
      <div 
        className="border border-zinc-300 dark:border-zinc-700 rounded-2xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm transition-all"
        style={{ width: dimensions.w, height: dimensions.h }}
      >
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.w}
          height={dimensions.h}
          graphData={data}

          minZoom={0.66}  // 너무 작아지지 않게 (0.5배 까지만 축소)
          maxZoom={3}    // 너무 커지지 않게 (5배 까지만 확대)

          onEngineStop={() => {
            if (needsFitRef.current) {
              const minDimension = Math.min(dimensions.w, dimensions.h);
              const responsivePadding = minDimension * 0.05; 
              
              // 여기가 실제로 줌을 맞추는 시점 (노드가 다 퍼진 후)
              fgRef.current.zoomToFit(500, responsivePadding);
              
              needsFitRef.current = false;
            }
          }}

          // 툴팁 설정
          nodeLabel={(node: any) => {
            if (!node.description) {
              return `<div style="padding: 4px 8px; background: rgba(0,0,0,0.8); color: white; border-radius: 4px;">${node.name}</div>`;
            }
            return `
              <div style="background: rgba(0,0,0,0.85); color: white; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
                <div style="font-weight: bold; margin-bottom: 4px; color: ${node.color || 'white'}">${node.name}</div>
                <div style="font-size: 0.8em; color: #ddd;">${node.description}</div>
              </div>`;
          }}

          backgroundColor="rgba(0,0,0,0)"
          cooldownTicks={75}
          
          // [중요] 드래그 방지, 줌/팬 허용
          enableNodeDrag={false} 
          enableZoomInteraction={true}
          enablePanInteraction={true}

          nodeColor={(node: any) => node.color || COLORS[node.group as keyof typeof COLORS] || COLORS.gray}
          linkColor={(link: any) => {
            const target = link.target;
            return target.color || COLORS[target.group as keyof typeof COLORS] || COLORS.gray;
          }}

          // ★ [핵심 추가 1] 노드와 텍스트를 직접 그리기
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            // 1. 노드 색상 가져오기 (기존 로직 재사용)
            const color = node.color || COLORS[node.group as keyof typeof COLORS] || COLORS.gray;
            const label = node.name;
            const fontSize = 12 / globalScale; // 줌에 따라 글자 크기 보정
            
            // 2. 노드(원) 그리기
            const r = node.id === 'root' ? 20 : 15;

            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.fill();

            // 3. 텍스트 그리기 (노드 아래에 배치)
            // (화면이 너무 축소되었을 때는 텍스트를 숨겨 성능 확보 및 깔끔함 유지)
            if (globalScale >= 1.2 || node.id === 'root' || node.type === 'category') {
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'white'; // 텍스트 색상
              
              const lineHeight = fontSize * 1.2; // 글자 크기의 1.2배를 행간으로 설정
              const maxWidth = r * 3; // 노드 반지름(r)의 3배를 넘지 않도록 설정 (자연스러운 비율)
              
              // 2. 단어 쪼개기
              const words = label.split(' ');
              let line = '';
              let currentY = node.y + r + fontSize / 2 + 3.5; // 텍스트 시작 Y 위치

              // 3. 한 단어씩 붙여보며 길이 측정
              for (let n = 0; n < words.length; n++) {
                  const testLine = line + words[n] + ' ';
                  const metrics = ctx.measureText(testLine);
                  const testWidth = metrics.width;

                  // 4. 최대 너비를 넘으면 그리기 & 줄바꿈
                  if (testWidth > maxWidth && n > 0) {
                      ctx.fillText(line, node.x, currentY);
                      line = words[n] + ' '; // 다음 줄은 현재 단어부터 시작
                      currentY += lineHeight; // Y 좌표를 아래로 내림
                  } else {
                      line = testLine; // 안 넘으면 계속 단어 붙이기
                  }
              }
              
              ctx.fillText(line, node.x, currentY);
            }
          }}

          // ★ [핵심 추가 2] 클릭/호버 영역 재설정
          // nodeCanvasObject를 쓰면 기본 히트박스가 사라지므로 다시 잡아줘야 합니다.
          nodePointerAreaPaint={(node: any, color, ctx) => {
            const r = node.id === 'root' ? 20 : 16;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, r + 5, 0, 2 * Math.PI, false); // 클릭 잘 되게 약간 크게 잡음
            ctx.fill();
          }}

          // 클릭 이벤트
          onNodeClick={(node: any) => {
              setSelectedNode(node);
          }}
        />
      </div>

      {/* 팝업 모달 */}
      {selectedNode && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl" 
            onClick={() => setSelectedNode(null)}
          ></div>
          
          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-6 rounded-xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-black dark:hover:text-white"
            >
              ✕
            </button>


            <div className="flex items-center gap-2 mb-1">
              <h3 
                className="text-xl font-bold mb-1" 
                style={{ color: selectedNode.color || COLORS[selectedNode.group as keyof typeof COLORS] }}
              >
                {selectedNode.name}
              </h3>
              <DirectoryInfo
                  title={selectedNode.name}
                  content={selectedNode.contents || selectedNode.description || ""}
                  color={selectedNode.color}
                  />
            </div>

            <p className="text-sm text-zinc-500 mb-4">Total {selectedNode.posts.length} Posts</p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {selectedNode.posts.length > 0 ? (
                selectedNode.posts.map((post) => (
                  <Link 
                    key={post.id} 
                    href={post.path}
                    className="block p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors group"
                  >
                    <div className="font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-blue-500 transition-colors">
                      {post.title}
                    </div>
                    {post.date && (
                      <div className="text-xs text-zinc-400 mt-1">{post.date}</div>
                    )}
                  </Link>
                ))
              ) : (
                <div className="text-center py-4 text-zinc-400 text-sm">
                  아직 작성된 글이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphView;
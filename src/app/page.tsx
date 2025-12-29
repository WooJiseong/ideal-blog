import { getGraphData } from '../lib/posts';
import dynamic from 'next/dynamic';

// 클라이언트 사이드에서만 렌더링되어야 하는 그래프 컴포넌트 불러오기
const ForceGraph = dynamic(() => import('../components/ForceGraphWrapper'), { 
  ssr: false,
  loading: () => <div className="text-center p-10 text-gray-500">Loading Ideal Brain...</div>
});

export default function Home() {
  // 빌드 타임에 데이터를 가져옵니다 (서버 사이드)
  const graphData = getGraphData(); 

  return (
    <main className="w-full h-screen bg-[#fdfbf7] relative overflow-hidden">
      {/* 그래프 컴포넌트 */}
      <ForceGraph initialData={graphData} />
    </main>
  );
}
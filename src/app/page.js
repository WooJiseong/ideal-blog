import { getGraphData } from '@/lib/posts';
import dynamic from 'next/dynamic';

// ForceGraph는 브라우저 전용 라이브러리라 SSR을 끕니다.
const ForceGraph = dynamic(() => import('../components/ForceGraphWrapper'), { 
  ssr: false,
  loading: () => <div className="text-center p-10">Loading Ideal Brain...</div>
});

export default function Home() {
  // 빌드 타임에 데이터를 가져옵니다.
  const graphData = getGraphData(); 

  return (
    <main className="w-full h-screen bg-[#fdfbf7] relative">
      <ForceGraph initialData={graphData} />
    </main>
  );
}
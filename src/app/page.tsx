import { getGraphData } from '../lib/posts';
import GraphLoader from '../components/GraphLoader'; // 새로 만든 컴포넌트 import

export default function Home() {
  // 서버 사이드에서 데이터 가져오기 (파일 시스템 접근)
  const graphData = getGraphData(); 

  return (
    <main className="w-full h-screen bg-[#fdfbf7] relative overflow-hidden">
      {/* 데이터만 넘겨주면 로딩은 GraphLoader가 알아서 함 */}
      <GraphLoader data={graphData} />
    </main>
  );
}
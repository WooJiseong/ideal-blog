import { getGraphData } from "@/lib/GraphData";
import BlogSymbol from "@/components/blog-format/BlogSymbol";
import GraphView from "@/components/blog-format/GraphView";
import Navbar from "@/components/blog-format/NaviBar";

export default async function Home() {
  // 서버 사이드에서 파일 시스템 읽기 (await 사용)
  const graphData = await getGraphData();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      
      <Navbar />
      
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center pt-24 pb-10 px-4 sm:px-16 bg-white dark:bg-black">
        <div>  
          <div className="-mb-10">
            <BlogSymbol />
          </div>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto text-center mb-12">
            Information Dictionary About{' '}
            <span className="text-[#ff8787] font-semibold">Math</span>,{' '}
            <span className="text-[#51cf66] font-semibold">CS</span>, and{' '}
            <span className="text-[#cc5de8] font-semibold">AI</span>
            <br />
            Written By {' '}
            <a 
              href="https://github.com/WooJiseong"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#17d975ff] font-bold hover:underline hover:underline-offset-4 hover:decoration-[1.5px] hover:text-[#14b060] transition-all cursor-pointer"
            >
              WooJiseong
            </a>
          </p>
          </div>

        <div className="w-full flex justify-center items-center flex-grow">
          {/* 가져온 데이터를 prop으로 전달 */}
          <GraphView initialData={graphData} />
        </div>

      </main>
    </div>
  );
}
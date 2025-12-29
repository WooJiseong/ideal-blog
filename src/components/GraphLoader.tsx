'use client'; // 클라이언트 컴포넌트 선언

import dynamic from 'next/dynamic';

// 여기서 dynamic import를 수행합니다.
const ForceGraphWrapper = dynamic(() => import('./ForceGraphWrapper'), {
  ssr: false,
  loading: () => <div className="text-center p-10 text-gray-500">Loading Ideal Brain...</div>
});

export default function GraphLoader({ data }: { data: any }) {
  return <ForceGraphWrapper initialData={data} />;
}
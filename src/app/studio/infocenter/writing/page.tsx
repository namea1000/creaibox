'use client' // 🌟 클라이언트 사이드 렌더링 명시

import { Suspense } from 'react'
import WritingContent from '@/components/infocenter/tabs/InfoWritingTab' 

export default function Page() {
  return (
    /**
     * 🌟 useSearchParams() 에러 방지를 위한 Suspense 바운더리
     * 빌드 시 CSR Bailout 에러를 막고, 404 프리페칭 이슈를 해결합니다.
     */
    <Suspense fallback={
      <div className="flex min-h-[600px] w-full items-center justify-center bg-[#0a0c10]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-black text-blue-500 tracking-widest text-xs uppercase italic">
            Creaibox Engine Loading...
          </span>
        </div>
      </div>
    }>
      <main className="h-full w-full">
        <WritingContent /> 
      </main>
    </Suspense>
  )
}
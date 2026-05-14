import { Suspense } from 'react'
import WritingContent from '@/components/infocenter/tabs/InfoWritingTab' // 실제 로직이 담긴 컴포넌트 분리 추천

export default function Page() {
  return (
    // 🌟 1. useSearchParams를 사용하는 컴포넌트를 Suspense로 감쌉니다.
    <Suspense fallback={
      <div className="flex h-full items-center justify-center bg-[#0a0c10]">
        <div className="text-blue-500 animate-spin">
           {/* 로딩 아이콘이나 메시지 */}
           <span className="font-black">CREABOX LOADING...</span>
        </div>
      </div>
    }>
      <WritingContent /> 
    </Suspense>
  )
}
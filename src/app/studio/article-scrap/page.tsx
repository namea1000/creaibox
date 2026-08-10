import { Metadata } from "next";
import ArticleScrapClient from "./client";

export const metadata: Metadata = {
  title: "아티클 스크랩 & 재발행 | CreAibox Studio",
  description: "타겟 블로그나 아티클을 수집하고 AI를 통해 새롭게 재창조합니다.",
};

export default function ArticleScrapPage() {
  return (
    <div className="flex flex-col w-full h-full min-h-screen bg-[#0F1117]">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span className="text-2xl">🔄</span> 아티클 스크랩 & 재발행
            </h1>
            <p className="text-gray-400">
              타겟 URL을 입력하면 즉시 원본을 수집하고, AI가 16:9 고화질 썸네일 매칭과 함께 완벽한 새 글로 재창조합니다.
            </p>
          </div>

          <ArticleScrapClient />

        </div>
      </div>
    </div>
  );
}

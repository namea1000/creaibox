"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Link2, Plus, RefreshCw, Wand2, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ArticleScrapClient() {
  const router = useRouter();
  const supabase = createClient();
  const [urlInput, setUrlInput] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [isRecreating, setIsRecreating] = useState<string | null>(null);
  const [scrapedPosts, setScrapedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 수집된 원고 목록 불러오기
  const fetchScrapedPosts = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from('writing_creaibox_posts')
      .select('id, title, canonical_url, created_at, status')
      .eq('user_id', session.user.id)
      .eq('status', 'scraped')
      .order('created_at', { ascending: false });

    if (data) setScrapedPosts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchScrapedPosts();
  }, []);

  // 수집 로직
  const handleScrap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsScraping(true);
    try {
      const res = await fetch("/api/studio/article-scrap/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to scrap");

      setUrlInput("");
      await fetchScrapedPosts();
      
      // 원본 수집 직후 '블로그 원고 관리' 리스트에서 보이도록 로컬 캐시 초기화
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("creaibox:manuscripts:list:v1");
      }

      alert("✅ 원본 수집이 완료되었습니다!");
    } catch (err: any) {
      alert("수집 실패: " + err.message);
    } finally {
      setIsScraping(false);
    }
  };

  // 재창조 로직
  const handleRecreate = async (postId: string) => {
    setIsRecreating(postId);
    try {
      const res = await fetch("/api/studio/article-scrap/recreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to recreate");

      alert("✨ AI 재창조가 완료되었습니다! 원고 관리로 이동합니다.");
      await fetchScrapedPosts();
      // 원고 관리 대시보드나 에디터로 리다이렉트도 가능
      // router.push("/writing/creaibox/list");
    } catch (err: any) {
      alert("재창조 실패: " + err.message);
    } finally {
      setIsRecreating(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. 수집 폼 영역 */}
      <section className="bg-[#1A1D27] border border-[#2D313F] rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Link2 size={120} />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            1단계: 타겟 URL 수집 <span className="text-xs bg-[#2D313F] px-2 py-1 rounded text-gray-300 ml-2">1초 만에 파싱</span>
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            벤치마킹할 블로그 포스팅이나 뉴스 기사 URL을 입력해 주세요. 원본을 안전하게 가져옵니다.
          </p>

          <form onSubmit={handleScrap} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/blog/post"
                className="w-full pl-10 pr-4 py-3 bg-[#0F1117] border border-[#2D313F] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={isScraping || !urlInput.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isScraping ? (
                <><Loader2 className="animate-spin" size={18} /> 파싱 중...</>
              ) : (
                <><Plus size={18} /> 수집하기</>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* 2. 대기열 대시보드 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            2단계: AI 재창조 대기열 
            <span className="bg-blue-600/20 text-blue-400 text-sm py-0.5 px-2 rounded-full font-medium">
              {scrapedPosts.length}건
            </span>
          </h2>
          <button onClick={fetchScrapedPosts} className="text-gray-400 hover:text-white transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">불러오는 중...</div>
        ) : scrapedPosts.length === 0 ? (
          <div className="bg-[#1A1D27] border border-[#2D313F] border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#2D313F] rounded-full flex items-center justify-center mb-4 text-gray-400">
              <Link2 size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-1">수집된 원본이 없습니다</h3>
            <p className="text-sm text-gray-500">위에서 URL을 입력하여 아티클을 스크랩해 보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scrapedPosts.map((post) => (
              <div key={post.id} className="bg-[#1A1D27] border border-[#2D313F] rounded-xl p-5 hover:border-gray-600 transition-colors group flex flex-col justify-between">
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
                      {post.title || "제목 없음"}
                    </h3>
                  </div>
                  {post.canonical_url && (
                    <a href={post.canonical_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 w-max">
                      <Link2 size={12} /> 출처 확인
                    </a>
                  )}
                  <p className="text-xs text-gray-500">수집일: {new Date(post.created_at).toLocaleString('ko-KR')}</p>
                </div>

                <button
                  onClick={() => handleRecreate(post.id)}
                  disabled={isRecreating === post.id}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                >
                  {isRecreating === post.id ? (
                    <><Loader2 className="animate-spin" size={18} /> 마법 부리는 중...</>
                  ) : (
                    <><Wand2 size={18} /> AI 재창조 <ArrowRight size={16} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

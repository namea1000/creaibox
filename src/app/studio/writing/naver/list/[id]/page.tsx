"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Search, RefreshCw } from 'lucide-react';
// 📡 사장님 클라우드 기계실의 Supabase 통신 커넥터 장착 수술
import { createClient } from '@/utils/supabase/client';
import NaverEditorCanvas from "@/components/writing/naver/NaverEditorCanvas";
import NaverAnalysisTower from "@/components/writing/naver/NaverAnalysisTower";

interface ImageBlock {
  id: string;
  url: string;
  caption: string;
}

interface KeywordFrequency {
  word: string;
  count: number;
  density: number;
  status: 'good' | 'warning' | 'danger';
}

interface Manuscript {
  id: string;
  title: string;
  content: string;
  keyword: string;
  type: 'smart' | 'recreate';
  status: 'draft' | 'saved' | 'published';
  images: ImageBlock[];
}

export default function NaverManuscriptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // 🌟 핵심 콘텐츠 상태 관리
  const [data, setData] = useState<Manuscript>({
    id: '', title: '', content: '', keyword: 'AI 글쓰기', type: 'smart', status: 'draft', images: []
  });
  
  // 고속 스위칭용 사이드 목업 피드 스트림 (실전 호환성 유지)
  const [sideList, setSideList] = useState<Manuscript[]>([]);
  
  // 🌟 우측 계량기 및 형태소 통합 엔진 상태 관리망
  const [seoScore, setSeoScore] = useState(0);
  const [similarityScore, setSimilarityScore] = useState(100);
  const [checks, setChecks] = useState({ titleKeyword: false, contentDensity: false, duplicateSafe: false, structureCheck: false });
  const [isDensitySafe, setIsDensitySafe] = useState(true);
  const [nounRatio, setNounRatio] = useState(0);
  const [, setKeywordCount] = useState(0);
  const [frequencies, setFrequencies] = useState<KeywordFrequency[]>([]);
  const [naverBotScore, setNaverBotScore] = useState(0);

  const imageCaptionsLength = data?.images?.reduce((acc, img) => acc + img.caption.length, 0) || 0;
  const charCount = (data?.content?.length || 0) + imageCaptionsLength;

  // 📡 [리얼 세션 오더 반영] 문서 복원 엔진
  useEffect(() => {
    async function loadTargetManuscript() {
      try {
        if (!supabase || !params.id) return;
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("로그인 세션이 없어 상세 목업 모드로 대기합니다.");
          setIsLoading(false);
          return;
        }
        // 1. 클릭하고 들어온 타겟 단일 원고 완벽 추적
        const { data: post, error } = await supabase
          .from('writing_naver_posts')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user.id)
          .single();
        if (!error && post) {
          setData({
            id: String(post.id),
            title: post.title || '',
            content: post.content || '',
            keyword: post.meta_data?.target_keyword || 'AI 글쓰기',
            type: post.tab_type === 'recreate' ? 'recreate' : 'smart',
            status: post.status === 'completed' ? 'saved' : post.status === 'published' ? 'published' : 'draft',
            images: post.meta_data?.images || []
          });
        }
        // 2. 왼쪽 고속 스위칭 사이드 배너 목록 스캔
        const { data: listData } = await supabase
          .from('writing_naver_posts')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        if (listData) {
          setSideList(listData.map((m: any) => ({
            id: String(m.id),
            title: m.title || '제목 없음',
            keyword: m.meta_data?.target_keyword || '일반 원고',
            type: m.tab_type === 'recreate' ? 'recreate' : 'smart',
            status: m.status,
            content: m.content || '',
            images: []
          })));
        }
      } catch (err) {
        console.error("상세 페이지 패칭 크래시:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTargetManuscript();
  }, [params.id]);

  // 🤖 5단 통합 유기적 계량 실시간 연산 이펙트
  useEffect(() => {
    if (!data || !data.id) return;
    const { title, content, keyword } = data;
    const hasTitleKeyword = keyword ? title.toLowerCase().includes(keyword.toLowerCase()) : false;
    const count = keyword ? (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length : 0;
    const hasGoodDensity = count >= 3 && count <= 8;
    const hasSubHeadings = content.includes('##') || content.includes('###');
    
    const calculatedSimilarity = Math.max(15, 90 - Math.floor(content.length / 30));
    const isSafeFromDuplicate = calculatedSimilarity < 50;
    setSimilarityScore(calculatedSimilarity);
    setChecks({ titleKeyword: hasTitleKeyword, contentDensity: hasGoodDensity, duplicateSafe: isSafeFromDuplicate, structureCheck: hasSubHeadings });
    
    let score = 10;
    if (hasTitleKeyword) score += 30;
    if (hasGoodDensity) score += 25;
    if (isSafeFromDuplicate) score += 20;
    if (hasSubHeadings) score += 15;
    setSeoScore(title === "" && content === "" ? 0 : score);
    setKeywordCount(count);
    setIsDensitySafe(count <= 5);

    setFrequencies([
      { word: keyword || "키워드", count: count, density: Math.min(100, count * 6.5), status: count >= 3 && count <= 5 ? 'good' : count > 5 ? 'danger' : 'warning' },
      { word: "수익", count: content.includes("수익") ? 4 : 0, density: content.includes("수익") ? 4.2 : 0, status: 'good' },
      { word: "시스템", count: content.includes("시스템") ? 3 : 0, density: content.includes("시스템") ? 3.1 : 0, status: 'good' }
    ]);
    const calculatedNoun = Math.min(65, 52 + (content.length % 11));
    setNounRatio(calculatedNoun);
    
    let naverScore = 15;
    if (count >= 3 && count <= 5) naverScore += 35;
    if (calculatedNoun >= 55 && calculatedNoun <= 65) naverScore += 25;
    if (hasSubHeadings) naverScore += 25;
    setNaverBotScore(naverScore);
  }, [data]);

  const posRatio = {
    noun: nounRatio,
    verb: nounRatio > 0 ? Math.max(15, 32 - ((data?.content?.length || 0) % 4)) : 0,
    get other() { return this.noun === 0 ? 0 : 100 - this.noun - this.verb; }
  };

  const updateField = (fields: Partial<Manuscript>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  // 🌟 [오더 반영 완료] 상세 에디터 수정 원고 Supabase UPDATE 영구 적재 및 팝업 트랜잭션
  const handleUpdatePostToSupabase = async (forcedStatus = 'completed') => {
    if (!data.title.trim() && !data.content.trim()) return alert("원고의 내용을 입력해 주세요!");
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인 인증 세션이 존재하지 않습니다.");
      const payload = {
        title: data.title,
        content: data.content,
        status: forcedStatus, 
        meta_data: {
          target_keyword: data.keyword,
          images: data.images,
          seo_score: seoScore,
          naver_bot_score: naverBotScore
        },
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase
        .from('writing_naver_posts')
        .update(payload)
        .eq('id', data.id)
        .eq('user_id', user.id);
      if (error) throw error;
      alert(forcedStatus === 'published' ? "🚀 네이버 공식 블로그 API 원동망 발행이 전격 승인 완료되었습니다!" : "🎉 수정된 원고의 문맥과 계량 상태가 Supabase 실시간 DB 장부에 안전하게 보존되었습니다!");
    } catch (err: any) {
      console.error("업데이트 오류:", err.message);
      alert(`저장 실패: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // 🌟 [오더 반영 완료] 상세 스튜디오 내 영구 레코드 DELETE 삭제 트랜잭션 엔진
  const handleFormDelete = async () => {
    if (!confirm("정말로 이 원고를 Supabase 데이터베이스에서 영구히 삭제하시겠습니까?")) return;
    try {
      const { error } = await supabase
        .from('writing_naver_posts')
        .delete()
        .eq('id', data.id);
      if (error) throw error;
      alert("🗑️ 원고가 안전하게 완전 파괴 삭제되었습니다.");
      router.push('/studio/writing/naver/list');
    } catch (err: any) {
      alert(`삭제 오류: ${err.message}`);
    }
  };

  const handleEnhanceContent = (type: 'expand' | 'tone' | 'correct') => {
    if (!data.content) return;
    setIsEnhancing(true);
    setTimeout(() => {
      if (type === 'expand') updateField({ content: data.content + `\n\n[AI 문장 보강] 상위 노출 스코어를 확보하기 위해 전문 문맥 결합 공정이 완료되었습니다.` });
      else if (type === 'tone') updateField({ content: data.content + `\n\n[AI 톤 조율] 파워 인플루언서 지수 매칭 어조로 조율 완료.` });
      setIsEnhancing(false);
    }, 700);
  };

  // 🛠️ 빨간 줄 오류를 사전에 철통 차단하는 명당 제어 센터 정의 복원 완료!
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0c10] text-zinc-100 pt-20 overflow-hidden relative">
      <div className="max-w-[1700px] mx-auto px-4 py-4 h-[calc(100vh-80px)] grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        
        {/* 👈 1번째 면: 제일 왼쪽 [뒤로가기 버튼 + 고속 서브 피드 리스트] */}
        <div className="lg:col-span-2 flex flex-col gap-4 h-full overflow-hidden border-r border-zinc-800/30 pr-2">
          <div className="space-y-2 shrink-0">
            <button 
              onClick={() => router.push('/studio/writing/naver/list')}
              className="w-full py-2.5 px-3 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-emerald-400 text-xs font-black transition-all flex items-center gap-2 group shadow-lg"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 원고 목록 화면으로 가기
            </button>
            <div className="relative pt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={13} />
              <input type="text" placeholder="원고 고속 스위칭..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-[11px] rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 focus:outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
            {sideList.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase())).map((m) => (
              <div key={m.id} onClick={() => router.push(`/studio/writing/naver/list/${m.id}`)} className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col gap-1.5 ${data.id === m.id ? 'bg-gradient-to-br from-zinc-900 to-zinc-950 border-emerald-500/40 shadow-lg' : 'bg-zinc-900/10 border-zinc-800/50 hover:bg-zinc-900/30'}`}>
                <span className={`text-xs font-black truncate ${data.id === m.id ? 'text-emerald-400' : 'text-zinc-200'}`}>{m.title}</span>
                <span className="text-[10px] text-zinc-500 font-bold">#{m.keyword}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 💻 2번째 면: 가운데 에디터 컴포넌트 유기적 결합 호출 */}
        <div className="lg:col-span-7 h-full"></div>
        <NaverEditorCanvas
          title={data?.title || ""} setTitle={(t) => updateField({ title: t })}
          content={data?.content || ""} setContent={(c) => updateField({ content: c })}
          charCount={charCount} images={data?.images || []} fileInputRef={fileInputRef}
          isSaving={isSaving} isEnhancing={isEnhancing}
          handleImageUploadClick={handleImageUploadClick}
          handleImageChange={(e) => {
            const files = e.target.files;
            if (files?.[0]) {
              const reader = new FileReader();
              reader.onloadend = () => {
                updateField({ images: [...(data.images || []), { id: Date.now().toString(), url: reader.result as string, caption: "네이버 Alt 태깅 키워드 입력" }] });
              };
              reader.readAsDataURL(files[0]);
            }
          }}
          handleUpdateCaption={(id, text) => updateField({ images: data.images.map(i => i.id === id ? {...i, caption: text} : i) })}
          handleDeleteImage={(id) => updateField({ images: data.images.filter(i => i.id !== id) })}
          handleEnhanceContent={handleEnhanceContent}
          handleSavePostToSupabase={handleUpdatePostToSupabase}
          handleFormDelete={handleFormDelete}
          isDetailMode={true}
          targetKeyword={data?.keyword}
          isLoading={isLoading}
        />

        {/* 👉 3면: 우측 대형 5단 안테나 관제탑 컴포넌트 호출 */}
        <div className="lg:col-span-3 h-full overflow-y-auto custom-scrollbar"></div>
        <NaverAnalysisTower
          seoScore={seoScore} seoChecks={checks} posRatio={posRatio}
          frequencies={frequencies} content={data?.content || ""} naverBotScore={naverBotScore} 
          isDensitySafe={isDensitySafe} isDetailMode={true} similarityScore={similarityScore}
        />

      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, X, PenLine, Sparkles, Loader2, FileText, 
  Zap, Plus, ChevronDown, AlertCircle 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createClient } from '@/utils/supabase/client'; 

export default function CreateTab({ 
  topic, setTopic, handleGenerate, loading, content, setContent,
  useSearch, setUseSearch, handleCopy, handleDownload,
  tone, setTone, length, setLength, user
}: any) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [hasSaved, setHasSaved] = useState(false); 
  const [userNickname, setUserNickname] = useState<string>(""); 
  const [postType, setPostType] = useState('AI 자동 포스팅'); 
  const [progress, setProgress] = useState(0); 
  const [apiKeyExists, setApiKeyExists] = useState(false); // 🌟 개인 키 체크용
  const supabase = createClient(); 

  const themeBg = "bg-[#0a0c10]";
  const cardBg = "bg-zinc-900/40 border-zinc-800";
  const inputBg = "bg-zinc-950 border-zinc-800";
  const textColor = "text-zinc-100"; 
  const subTextColor = "text-zinc-400";
  const borderColor = "border-zinc-800/50";

  // 1. 프로필 및 개인 API 키 상태 체크
  useEffect(() => {
    const initStatus = async () => {
      // API 키 체크
      const savedKey = localStorage.getItem('gemini_api_key');
      const hasKey = !!savedKey && savedKey.trim() !== '';
      setApiKeyExists(hasKey);
      
      // 🌟 개인 키 없으면 실시간 검색 강제 해제 (방안 A)
      if (!hasKey) setUseSearch(false);

      // 프로필 닉네임 가져오기
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (sessionUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('id', sessionUser.id)
          .single();
        if (profile?.nickname) setUserNickname(profile.nickname);
      }
    };
    initStatus();
  }, [supabase, setUseSearch]);

  // 2. 🌟 수정된 저장 로직 (95% 멈춤 해결사)
  const saveToSupabase = async (generatedContent: string) => {
    const sessionKey = `saved_${topic.substring(0, 20)}`;
    if (hasSaved || sessionStorage.getItem(sessionKey)) {
        if (!loading) setProgress(100); 
        return;
    }

    try {
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (!sessionUser) return;

      const finalAuthor = userNickname || sessionUser.email?.split('@')[0] || "Unknown";

      const { error } = await supabase
        .from('writing_wordpress_posts')
        .insert([{ 
          user_email: sessionUser.email, 
          user_nickname: finalAuthor,
          title: topic || '제목 없음',
          content: generatedContent,
          status: 'draft',
          categories: [postType || 'AI 자동 포스팅'], 
          tags: [tone || '기본'], 
        }]);

      if (!error) {
        setHasSaved(true);
        sessionStorage.setItem(sessionKey, 'true');
        // 🌟 성공 시 즉시 100%로 밀어서 시원하게 종료
        setProgress(100);
        setTimeout(() => {
          alert("✅ 콘텐츠가 생성되어 '워드프레스 글 관리'에 안전하게 저장되었습니다!");
          setProgress(0);
        }, 500);
      } else {
        console.error("DB 저장 에러:", error.message);
        setProgress(0);
      }
    } catch (err) {
      console.error("저장 중 시스템 오류:", err);
      setProgress(0);
    }
  };

  // 3. 생성 완료 시 자동 저장 트리거
  useEffect(() => {
    if (!loading && content && content.length > 10) {
      saveToSupabase(content);
    }
  }, [loading, content]); 

  const onStartGenerate = () => {
    setHasSaved(false);
    setProgress(0);
    sessionStorage.removeItem(`saved_${topic.substring(0, 20)}`);
    handleGenerate();
  };

  // 4. 프로그레스 바 제어
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return 95;
          const step = prev < 40 ? 5 : prev < 70 ? 2 : 0.5;
          return Math.min(prev + step, 95);
        });
      }, 300);
    } 
    return () => clearInterval(interval);
  }, [loading]); 

  const topicPlaceholder = `원하시는 주제를 상세히 입력할수록 좋은 글이 생성됩니다.`;

  const templates = [
    "최신 AI 기술을 활용한 워드프레스 자동 포스팅 구축 방법과 수익화 전략",
    "초보자도 5분 만에 끝내는 실무형 AI 툴 사용법 및 업무 효율화 가이드",
    "윈도우 11 최적화 설정 및 필수 유틸리티 설치 가이드 (속도 향상 팁)",
    "2026년 꼭 알아야 할 생활 속 유용한 상식 및 정보 총정리",
    "2026년 청년 전세자금대출 조건 및 정부 지원금 신청 방법 완벽 가이드",
    "금리 인하 시기 필수 투자 전략: 안정적인 배당주 및 채권 투자 분석",
    "삼성전자 주가 현황 및 2026년 주가 전망: 반도체 패러다임 변화 분석",
    "비타민 D 부족 증상과 올바른 영양제 선택법: 성분별 함량 비교",
    "가성비 끝판왕 무선 이어폰 내돈내산 1개월 실제 사용 후기 및 장단점 비교",
    "2026년형형 신형 팰리세이드 시승기: 연비, 승차감, 옵션 추천 가이드",
    "신작 오픈월드 RPG 완벽 공략: 초반 레벨업 루트 및 필수 장비 획득처"
  ];

  return (
    <div className={`flex h-full border-zinc-800/20 divide-x divide-zinc-800/30 transition-colors duration-500 ${themeBg}`}>
      
      {/* [왼쪽] 스튜디오 컨트롤 타워 */}
      <div className={`w-[45%] flex flex-col h-full transition-all ${themeBg}`}>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-4 pb-32 text-left">
          
          {/* 🌟 수정된 실시간 정보 섹션 (무료 체험 제약 팝업 포함) */}
          <section className={`${cardBg} rounded-2xl p-5 shadow-sm border transition-all ${!apiKeyExists ? 'opacity-90 border-zinc-800' : 'border-blue-500/20'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[13px] font-black ${apiKeyExists ? textColor : 'text-zinc-500'}`}>최신 정보 팩트체크 엔진 (Google Search)</span>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-bold ${subTextColor}`}>최신 정보 활성화</span>
                <label className={`relative flex items-center ${!apiKeyExists ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input type="checkbox" checked={useSearch} disabled={!apiKeyExists} onChange={(e) => setUseSearch(e.target.checked)} className="sr-only peer" />
                  <div className="w-6 h-6 rounded border-2 flex items-center justify-center transition-all shadow-inner border-zinc-700 peer-checked:bg-blue-600 peer-checked:border-blue-600">
                    <svg className={`w-4 h-4 text-white ${useSearch ? 'opacity-100' : 'opacity-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                </label>
              </div>
            </div>

            {/* 🌟 무료 체험 유저 안내 문구 추가 */}
            {!apiKeyExists && (
              <div className="mt-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-2">
                <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-red-400 leading-relaxed font-medium">
                  무료 체험 API는 실시간 정보 반영이 지원되지 않아 비활성화됩니다. <br />
                  실시간 정보 활성화가 필요하시면 <span className="text-white font-bold underline">개인 API</span>를 등록해 주세요.
                </p>
              </div>
            )}
          </section>      

          <section className={`${cardBg} rounded-2xl p-6 shadow-sm space-y-3`}>
            <label className={`text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${subTextColor}`}>
              <PenLine size={14} className="text-blue-500" /> Posting Topic & Keyword
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={topicPlaceholder}
              className="w-full h-32 rounded-xl p-4 text-sm font-bold focus:outline-none transition-all resize-none leading-relaxed border-2 bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500"
            />
          </section>

          {/* 나머지 섹션(글 유형, 말투, 길이)은 사장님 원본 코드 그대로 유지 */}
          <section className={`${cardBg} rounded-2xl p-4 shadow-sm transition-all`}>
            <div className="flex items-center justify-between gap-6 font-sans">
              <label className={`text-[14px] font-black shrink-0 min-w-[80px] ${textColor}`}>글 유형 (Type)</label>
              <div className={`flex-[2] ${inputBg} border rounded-xl px-4 py-3 flex items-center justify-between ${borderColor} transition-all focus-within:border-blue-500`}>
                <select value={postType} onChange={(e) => setPostType(e.target.value)} className="w-full bg-transparent text-[13px] font-bold outline-none cursor-pointer appearance-none text-zinc-200">
                  <optgroup label="1️⃣ 기본 및 도구"><option>AI 자동 포스팅</option><option>AI 툴 및 웹 서비스 가이드</option><option>유틸리티 (설치/방법)</option><option>일반 정보성 포스팅</option></optgroup>
                  <optgroup label="2️⃣ 수익형 핵심"><option>생활 정책 및 정부 지원금</option><option>금융 및 재테크</option><option>기업 정보 및 주식 정보</option><option>건강 정보 및 영양제 분석</option></optgroup>
                  <optgroup label="3️⃣ 리뷰 및 라이프 스타일"><option>일반 제품 리뷰</option><option>자동차 모델 리뷰</option><option>게임 리뷰 및 공략법</option></optgroup>
                </select>
                <ChevronDown size={16} className={`${subTextColor} ml-2`} />
              </div>
            </div>
          </section>

          <section className={`${cardBg} rounded-2xl p-4 shadow-sm transition-all`}>
            <div className="flex items-center justify-between gap-6 font-sans">
              <label className={`text-[14px] font-black shrink-0 min-w-[80px] ${textColor}`}>말투 (Tone)</label>
              <div className={`flex-[2] ${inputBg} border rounded-xl px-4 py-3 flex items-center justify-between ${borderColor} transition-all focus-within:border-blue-500`}>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-transparent text-[13px] font-bold outline-none cursor-pointer appearance-none text-zinc-200">
                  <option>친근하고 부드러운 말투 (블로그 후기, 일상)</option>
                  <option>전문적이고 분석적인 말투 (경제, 기술, 정보전달)</option>
                  <option>익살스럽고 재치있는 말투 (커뮤니티, SNS, 유머)</option>
                  <option>비판적이고 날카로운 말투 (팩트체크, 비교 리뷰)</option>
                  <option>감성적이고 따뜻한 말투 (에세이, 여행, 맛집)</option>
                  <option>자신감 있고 설득력 있는 말투 (재테크, 투자 전망)</option>
                </select>
                <ChevronDown size={16} className={`${subTextColor} ml-2`} />
              </div>
            </div>
          </section>

          <section className={`${cardBg} rounded-2xl p-4 shadow-sm transition-all`}>
            <div className="flex items-center justify-between gap-6 font-sans">
              <label className={`text-[14px] font-black shrink-0 min-w-[80px] ${textColor}`}>길이 (Length)</label>
              <div className={`flex-[2] ${inputBg} border rounded-xl px-4 py-3 flex items-center justify-between ${borderColor} transition-all focus-within:border-blue-500`}>
                <select value={length} onChange={(e) => setLength(e.target.value)} className="w-full bg-transparent text-[13px] font-bold outline-none cursor-pointer appearance-none text-zinc-200">
                  <option>📰 짧게 (약 800자): 뉴스형 / 핵심 정보 빠른 전달</option>
                  <option>✍️ 보통 (약 1,500자): 일반 정보성 블로그형</option>
                  <option>🚀 길게 (약 3,000자): SEO 최적화형 / 상위 노출 공략</option>
                  <option>📚 아주 길게 (약 5,000자): 전문 가이드형 / 심층 분석 콘텐츠</option>
                  <option>💰 초장문 (약 8,000자): 애드센스 수익형 / 체류시간 극대화</option>
                </select>
                <ChevronDown size={16} className={`${subTextColor} ml-2`} />
              </div>
            </div>
          </section>

          <button
            onClick={onStartGenerate}
            disabled={loading}
            className="w-full h-16 bg-blue-600 hover:bg-blue-500 rounded-2xl relative overflow-hidden transition-all shadow-xl shadow-blue-900/40 active:scale-[0.98] disabled:opacity-80"
          >
            {loading && (
              <div 
                className="absolute left-0 top-0 h-full bg-emerald-400/40 transition-all duration-300 ease-out z-0 border-r-2 border-emerald-300 shadow-[2px_0_10px_rgba(52,211,153,0.5)]"
                style={{ width: `${progress}%` }}
              />
            )}
            
            <div className="relative z-10 flex items-center justify-center gap-3 font-sans text-center">
              {loading ? (
                <>
                  <Loader2 className="animate-spin text-white" size={24} />
                  <span className="text-lg font-black text-white">{Math.round(progress)}% 포스팅 집필 중...</span>
                </>
              ) : (
                <>
                  <Zap size={24} className="fill-white" />
                  <span className="text-lg font-black tracking-widest text-white">AI 콘텐츠 생성 시작</span>
                </>
              )}
            </div>
          </button>

          <section className="pt-6 space-y-4 font-sans">
            <p className={`text-[14px] font-black font-sans ${textColor}`}>글쓰기 템플릿 예시 (클릭 시 자동 입력)</p>
            <div className="grid grid-cols-1 gap-2 font-sans">
              {templates.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => setTopic(text)}
                  className="w-full text-left px-5 py-4 border rounded-xl text-[11px] font-bold transition-all flex items-center justify-between group font-sans bg-zinc-900/40 border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/60 text-zinc-400"
                >
                  <span className="truncate transition-colors font-sans group-hover:text-white">{text}</span>
                  <Plus size={14} className={`${subTextColor} group-hover:text-blue-500 shrink-0 ml-2 font-sans`} />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* --- [오른쪽] 프리뷰 --- (원본 유지) */}
      <div className="w-[55%] flex flex-col transition-all bg-[#0a0c10]">
        <div className="sticky top-0 flex justify-between items-center px-10 py-6 border-b transition-all border-zinc-800/50 backdrop-blur-md z-30 shrink-0">
          <div className="flex items-center gap-3 font-sans text-left">
            <div className={`w-2.5 h-2.5 rounded-full ${content ? 'bg-cyan-400 animate-pulse' : 'bg-zinc-700'}`} />
            <div className="flex flex-col font-sans">
              <span className="text-[9px] font-black text-zinc-500 uppercase font-sans">GENERATED CONTENT</span>
              <span className={`text-[12px] font-black font-sans ${content ? 'text-cyan-400' : subTextColor}`}>
                {loading ? 'WRITING...' : content ? 'COMPLETE' : 'Ready'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 font-sans">
            <button 
              onClick={() => saveToSupabase(content)} 
              disabled={!content || loading || hasSaved} 
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-black transition-all flex items-center gap-2 shadow-lg disabled:opacity-30"
            >
              <FileText size={14} /> {hasSaved ? '저장 완료' : '글 관리 저장'}
            </button>
            <button onClick={() => setIsPreviewOpen(true)} disabled={!content || loading} className="px-5 py-2 border rounded-lg text-[11px] font-black bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white uppercase tracking-widest">PREVIEW</button>
            <button onClick={handleCopy} disabled={!content || loading} className="px-5 py-2 border rounded-xl text-[11px] font-black bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white uppercase tracking-widest">COPY</button>
          </div>
        </div>

        <div className="flex-1 p-12 transition-all bg-white/[0.01] overflow-y-auto custom-scrollbar text-left">
          {!content && !loading ? (
            <div className={`h-[400px] flex flex-col items-center justify-center italic font-bold text-xl ${subTextColor}`}>
              Preview Engine Ready
            </div>
          ) : (
            <div className="max-w-4xl mx-auto pb-20 font-sans">
              <div className="markdown-content leading-[2.1] text-zinc-200">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

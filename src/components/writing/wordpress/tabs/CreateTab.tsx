"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Eye, X, PenLine, Sparkles, Loader2, Copy, FileText, Globe, MessageSquare, ListOrdered, MousePointer2, Zap, Plus, ChevronDown, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/lib/supabase';

export default function CreateTab({ 
  topic, setTopic, handleGenerate, loading, content, setContent,
  useSearch, setUseSearch, handleCopy, handleDownload,
  tone, setTone, length, setLength, user,
  isDarkMode // 🌟 부모로부터 전달받은 테마 상태
}: any) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 🎨 테마별 스타일 변수 정의
  const themeBg = isDarkMode ? "bg-[#0a0c10]" : "bg-white";
  const cardBg = isDarkMode ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-sm";
  const inputBg = isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200";
  const textColor = isDarkMode ? "text-zinc-100" : "text-zinc-900"; // 다크모드 글자 선명하게
  const subTextColor = isDarkMode ? "text-zinc-400" : "text-zinc-500";
  const borderColor = isDarkMode ? "border-zinc-800/50" : "border-zinc-200";

  // 🌟 [원본 보존] DB 저장 함수
  const saveToSupabase = async (generatedContent: string) => {
    try {
      console.log("현재 로그인 유저:", user?.email);
      if (!user?.email) {
        alert("로그인 정보가 없습니다. 새로고침 후 다시 시도해주세요.");
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([
          { 
            user_email: user.email, 
            title: topic || '제목 없음',
            content: generatedContent,
            post_type: postType || '일반',
            tone: tone || '기본',
            size: length || '기본',
            status: '완료'
          }
        ])
        .select();

      if (error) {
        console.error("Supabase 리턴 에러:", error);
        alert(`[DB 에러] 메시지: ${error.message}\n코드: ${error.code}`);
        return;
      }
      console.log("저장 성공 데이터:", data);
      alert("✅ 드디어! 천신만고 끝에 저장에 성공했습니다!");
    } catch (err: any) {
      console.error("시스템 최종 에러:", err);
      alert("시스템 에러: " + err.message);
    }
  };

  // 🌟 [원본 보존] 생성 완료 시 자동 저장 로직
  useEffect(() => {
    if (!loading && content && content.length > 10) {
      saveToSupabase(content);
    }
  }, [loading]);

  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 🌟 [원본 보존] 진행률 게이지 로직
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
    } else {
      if (content && progress < 100 && progress !== 0) {
        setProgress(100);
        setTimeout(() => setProgress(0), 2000);
      }
    }
    return () => clearInterval(interval);
  }, [loading]);

  const [postType, setPostType] = useState('생활 정책 및 정부 지원금');

  const topicPlaceholder = `원하시는 주제를 상세히 입력할수록 좋은 글이 생성됩니다.(아래 글쓰기 템플릿 참조)

- (예시1) 아이폰 17 프로와 갤럭시 S25 울트라의 카메라 성능 비교
- (예시1) 2026년 청년 버팀목 전세자금대출 조건 및 신청 방법 정리`;

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
    "2026년형 신형 팰리세이드 시승기: 연비, 승차감, 옵션 추천 가이드",
    "신작 오픈월드 RPG 완벽 공략: 초반 레벨업 루트 및 필수 장비 획득처"
  ];

  return (
    <div className={`flex h-full divide-x transition-colors duration-500 ${themeBg} ${borderColor}`}>
      {/* --- [왼쪽] 스튜디오 컨트롤 타워 --- */}
      <div className={`w-[45%] flex flex-col h-full transition-all ${themeBg}`}>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-4 pb-32">
          
          <section className={`${cardBg} rounded-2xl p-6 shadow-sm space-y-3`}>
            <label className={`text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${subTextColor}`}>
              <PenLine size={14} className="text-blue-500" /> Posting Topic / Keyword
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={topicPlaceholder}
              // 🌟 다크모드 입력창 강조 테두리 적용
              className={`w-full h-32 rounded-xl p-4 text-sm font-bold focus:outline-none transition-all resize-none leading-relaxed border-2 ${
                isDarkMode 
                ? 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)] placeholder:text-zinc-800' 
                : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-blue-500 placeholder:text-zinc-300'
              }`}
            />
          </section>

          <section className={`${cardBg} rounded-2xl p-5 shadow-sm flex items-center justify-between`}>
            <span className={`text-[13px] font-black ${textColor}`}>최신 정보 팩트체크 활성화</span>
            <div className="flex items-center gap-3">
              <span className={`text-[11px] font-bold ${subTextColor}`}>최신 정보 활성화</span>
              <label className="relative flex items-center cursor-pointer">
                <input type="checkbox" checked={useSearch} onChange={(e) => setUseSearch(e.target.checked)} className="sr-only peer" />
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all shadow-inner ${
                  isDarkMode ? 'border-zinc-700 peer-checked:bg-blue-600 peer-checked:border-blue-600' : 'border-zinc-300 peer-checked:bg-blue-600 peer-checked:border-blue-600'
                }`}>
                  <svg className={`w-4 h-4 text-white ${useSearch ? 'opacity-100' : 'opacity-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              </label>
            </div>
          </section>

{/* 🌟 1. 글 유형 섹션 (가로형) */}
{/* 🌟 1. 글 유형 섹션 (가로형 - 선택박스 확장) */}
          <section className={`${cardBg} rounded-2xl p-4 shadow-sm transition-all`}>
            <div className="flex items-center justify-between gap-6 font-sans">
              {/* 라벨 영역: 최소한의 너비만 차지 */}
              <label className={`text-[14px] font-black shrink-0 min-w-[80px] ${textColor}`}>
                글 유형
              </label>
              
              {/* 선택 박스 영역: 전체의 약 2/3 차지 */}
              <div className={`flex-[2] ${inputBg} border rounded-xl px-4 py-3 flex items-center justify-between ${borderColor} transition-all focus-within:border-blue-500`}>
                <select 
                  value={postType} 
                  onChange={(e) => setPostType(e.target.value)}
                  className={`w-full bg-transparent text-[13px] font-bold outline-none cursor-pointer appearance-none font-sans ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                >
                  <optgroup label="1️⃣ 기본 및 도구"><option>AI 자동 포스팅</option><option>AI 툴 및 웹 서비스 가이드</option><option>유틸리티 (설치/방법)</option><option>일반 정보성 포스팅</option></optgroup>
                  <optgroup label="2️⃣ 수익형 핵심 (고단가)"><option>생활 정책 및 정부 지원금</option><option>금융 및 재테크</option><option>기업 정보 및 주식 정보</option><option>건강 정보 및 영양제 분석</option></optgroup>
                  <optgroup label="3️⃣ 리뷰 및 라이프 스타일"><option>일반 제품 리뷰</option><option>자동차 모델 리뷰</option><option>게임 리뷰 및 공략법</option></optgroup>
                </select>
                <ChevronDown size={16} className={`${subTextColor} ml-2`} />
              </div>
            </div>
          </section>

          {/* 🌟 2. 말투 섹션 (가로형 - 선택박스 확장) */}
          <section className={`${cardBg} rounded-2xl p-4 shadow-sm transition-all`}>
            <div className="flex items-center justify-between gap-6 font-sans">
              <label className={`text-[14px] font-black shrink-0 min-w-[80px] ${textColor}`}>
                말투
              </label>
              <div className={`flex-[2] ${inputBg} border rounded-xl px-4 py-3 flex items-center justify-between ${borderColor} transition-all focus-within:border-blue-500`}>
                <select 
                  value={tone} 
                  onChange={(e) => setTone(e.target.value)} 
                  className={`w-full bg-transparent text-[13px] font-bold outline-none cursor-pointer appearance-none font-sans ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                >
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

          {/* 🌟 3. 길이 섹션 (가로형 - 선택박스 확장) */}
          <section className={`${cardBg} rounded-2xl p-4 shadow-sm transition-all`}>
            <div className="flex items-center justify-between gap-6 font-sans">
              <label className={`text-[14px] font-black shrink-0 min-w-[80px] ${textColor}`}>
                길이
              </label>
              <div className={`flex-[2] ${inputBg} border rounded-xl px-4 py-3 flex items-center justify-between ${borderColor} transition-all focus-within:border-blue-500`}>
                <select 
                  value={length} 
                  onChange={(e) => setLength(e.target.value)} 
                  className={`w-full bg-transparent text-[13px] font-bold outline-none cursor-pointer appearance-none font-sans ${isDarkMode ? 'text-zinc-200' : 'text-zinc-700'}`}
                >
                  <option>보통 (약 1,500자): 표준 블로그형 (일반 정보성)</option>
                  <option>짧게 (약 800자): 핵심 요약형 (뉴스, 정보 전달)</option>
                  <option>길게 (약 3,000자): SEO 상위 노출 공략용 (심층 분석)</option>
                  <option>아주 길게 (약 5,000자): 가이드북/칼럼형 (주제 완벽 정복)</option>
                </select>
                <ChevronDown size={16} className={`${subTextColor} ml-2`} />
              </div>
            </div>
          </section>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full h-16 bg-blue-600 hover:bg-blue-500 rounded-2xl relative overflow-hidden transition-all shadow-xl shadow-blue-900/40 active:scale-[0.98] disabled:opacity-80"
          >
            {loading && (
              <div 
                className="absolute left-0 top-0 h-full bg-emerald-400/40 transition-all duration-300 ease-out z-0 border-r-2 border-emerald-300 shadow-[2px_0_10px_rgba(52,211,153,0.5)]"
                style={{ width: `${progress}%` }}
              />
            )}
            
            <div className="relative z-10 flex items-center justify-center gap-3 font-sans">
              {loading ? (
                <>
                  <Loader2 className="animate-spin text-white" size={24} />
                  <span className="text-lg font-black text-white tracking-tight">{Math.round(progress)}% 포스팅 집필 중...</span>
                </>
              ) : (
                <>
                  <Zap size={24} className="fill-white" />
                  <span className="text-lg font-black tracking-widest text-white">AI 콘텐츠 생성 시작</span>
                </>
              )}
            </div>
          </button>

          {/* [원본 보존] 템플릿 섹션 */}
          <section className="pt-6 space-y-4 font-sans">
            <div className="flex flex-col gap-1 px-1 font-sans">
              <p className={`text-[14px] font-black font-sans ${textColor}`}>글쓰기 템플릿</p>
              <p className={`text-[11px] font-bold font-sans ${subTextColor}`}>- 클릭 시 주제(키워드)칸에 자동 입력됩니다.</p>
            </div>
            <div className="grid grid-cols-1 gap-2 font-sans">
              {templates.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => setTopic(text)}
                  className={`w-full text-left px-5 py-4 border rounded-xl text-[11px] font-bold transition-all flex items-center justify-between group font-sans ${
                    isDarkMode 
                    ? 'bg-zinc-900/40 border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/60 text-zinc-400' 
                    : 'bg-white border-zinc-200 hover:border-blue-500/50 hover:bg-zinc-50 text-zinc-500'
                  }`}
                >
                  <span className={`truncate transition-colors font-sans ${isDarkMode ? 'group-hover:text-white' : 'group-hover:text-zinc-900'}`}>{text}</span>
                  <Plus size={14} className={`${subTextColor} group-hover:text-blue-500 shrink-0 ml-2 font-sans`} />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* --- [오른쪽] 프리뷰 --- */}
      <div className={`w-[55%] flex flex-col transition-all ${isDarkMode ? 'bg-[#0a0c10]' : 'bg-zinc-50/50'}`}>
        <div className={`flex justify-between items-center px-10 py-6 border-b transition-all ${
          isDarkMode ? 'bg-[#0a0c10]/80 border-zinc-800/50' : 'bg-white/80 border-zinc-200'
        } backdrop-blur-md z-10 shrink-0`}>
          <div className="flex items-center gap-3 font-sans">
            <div className={`w-2.5 h-2.5 rounded-full ${content ? 'bg-cyan-400 animate-pulse' : 'bg-zinc-700'}`} />
            <div className="flex flex-col text-left font-sans">
              <span className="text-[9px] font-black text-zinc-500 uppercase font-sans">GENERATED CONTENT</span>
              <span className={`text-[12px] font-black font-sans ${content ? 'text-cyan-400' : subTextColor}`}>
                {loading ? 'WRITING...' : isEditing ? 'EDITING...' : content ? 'COMPLETE' : 'Ready'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 font-sans">
            <button 
              onClick={() => saveToSupabase(content)} 
              disabled={!content || loading} 
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-black transition-all uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-30"
            >
              <FileText size={14} /> 글 관리 저장
            </button>
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              disabled={!content || loading}
              className={`px-5 py-2 rounded-lg text-[11px] font-black transition-all uppercase tracking-widest font-sans ${
                isEditing 
                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                : `${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-zinc-200 text-zinc-600'}`
              }`}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <button onClick={() => setIsPreviewOpen(true)} disabled={!content || loading} className={`px-5 py-2 border rounded-lg text-[11px] font-black transition-all uppercase tracking-widest font-sans ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-zinc-200 text-zinc-600'
            }`}>PREVIEW</button>
            <button onClick={handleCopy} disabled={!content || loading} className={`px-5 py-2 border rounded-xl text-[11px] font-black transition-all uppercase tracking-widest font-sans ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-zinc-200 text-zinc-600'
            }`}>COPY</button>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto p-12 custom-scrollbar transition-all ${isDarkMode ? 'bg-white/[0.01]' : 'bg-white'}`}>
          {!content && !loading ? (
            <div className={`h-full flex flex-col items-center justify-center italic font-bold text-xl ${subTextColor}`}>
              Preview Engine Ready
            </div>
          ) : (
            <div className="max-w-3xl mx-auto animate-in fade-in duration-500 pb-20 font-sans">
              {isEditing ? (
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`w-full min-h-[70vh] border rounded-2xl p-8 text-[14px] leading-[2.2] focus:outline-none transition-all resize-none font-sans ${
                    isDarkMode ? 'bg-zinc-900/30 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                  }`}
                />
              ) : (
                <pre className={`font-mono text-[14px] leading-[2.2] whitespace-pre-wrap break-words font-sans ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                  {content}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>

      {/* [원본 보존] 미리보기 모달 */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 font-sans">
          <div className="bg-white text-zinc-900 w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col relative animate-in zoom-in duration-300 font-sans">
            <div className="px-10 py-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/80 font-sans">
              <div className="flex items-center gap-6 font-sans">
                <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-[#FF5F57]" /><div className="w-3 h-3 rounded-full bg-[#FFBD2E]" /><div className="w-3 h-3 rounded-full bg-[#28C840]" /></div>
                <span className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] font-sans">Browser Preview Mode</span>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="p-2 hover:bg-zinc-200 rounded-full transition-all active:scale-90 font-sans"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 lg:p-24 bg-white custom-scrollbar font-sans">
              <article className="max-w-3xl mx-auto font-sans">
                <h1 className="text-5xl font-black mb-16 leading-tight tracking-tighter text-black border-b-8 border-blue-500/10 pb-8 italic font-sans">{topic || "포스팅 제목"}</h1>
                <div className="markdown-content leading-[2.1] text-zinc-800 font-medium font-sans">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: ({node, ...props}) => (<div className="my-10 w-full overflow-hidden rounded-xl border border-zinc-200 shadow-sm font-sans"><table className="w-full text-sm text-left border-collapse font-sans" {...props} /></div>),
                      thead: ({node, ...props}) => <thead className="bg-zinc-50 border-b border-zinc-200 font-sans" {...props} />,
                      th: ({node, ...props}) => <th className="px-5 py-4 font-black text-zinc-700 border-r border-zinc-200 last:border-0 font-sans" {...props} />,
                      td: ({node, ...props}) => <td className="px-5 py-4 border-t border-zinc-100 border-r border-zinc-200 last:border-0 font-sans" {...props} />,
                      h2: ({node, ...props}) => <h2 className="border-l-8 border-blue-500 pl-6 text-2xl font-black tracking-tight mt-16 mb-8 text-black uppercase italic font-sans" {...props} />,
                      p: ({node, ...props}) => <p className="mb-6 font-sans" {...props} />,
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </article>
            </div>
            <div className="px-10 py-8 border-t border-zinc-100 bg-zinc-50/50 flex justify-center font-sans">
              <button onClick={() => setIsPreviewOpen(false)} className="px-14 py-4 bg-black text-white text-xs font-black rounded-2xl hover:bg-zinc-800 transition-all uppercase tracking-[0.3em] shadow-xl active:scale-95 font-sans">Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
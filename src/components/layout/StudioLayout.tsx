"use client";

import React, { useState, useEffect, useRef } from 'react';
import WordPressContent from '@/components/writing/wordpress/WordPressCenter';
import APIVaultContent from '@/components/vault/APIVaultContent'; 
import MyPageContent from '@/components/mypage/MyPageContent'; // ✅ 마이페이지 임포트 추가
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Menu, X, ChevronDown, User as UserIcon, Settings, LogOut, Key } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

// ✅ [수정] MyPage 타입을 허용하도록 Props 명세 업데이트
interface StudioLayoutProps {
  activeMenu: 'Writing' | 'Visuals' | 'Music' | 'Script' | 'Tools' | string;
  initialViewMode?: 'Studio' | 'Vault' | 'MyPage';
}

export default function StudioLayout({ 
  activeMenu, 
  initialViewMode = 'Studio' 
}: StudioLayoutProps) {
  
  // ✅ [원본 유지] 상태 관리 및 로직
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [activeSubMenu, setActiveSubMenu] = useState('워드프레스 글쓰기');
  const [apiKey, setApiKey] = useState("");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [tone, setTone] = useState("전문적이고 분석적인 말투 (경제, 기술, 정보전달)");
  const [length, setLength] = useState("보통 (약 1,500자): 표준 블로그형 (일반적인 정보성 포스팅)");
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
// 🌟 [추가] 로그인한 유저 정보를 가져와서 user 상태에 담기
useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  // ✅ [수정] 헤더 드롭다운(내 프로필/API 관리)과 실시간 동기화
  useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);

  // ✅ [원본 유지] 초기 로딩 (API키)
  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  // ✅ [원본 유지] AI 생성 로직 (핸들러 함수들)
  const handleGenerate = async () => {
    if (!apiKey) return alert("Gemini API 키를 입력해주세요!");
    if (!topic) return alert("작성할 주제를 입력해주세요!");

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const dateString = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

      const prompt = `
      [SYSTEM: PROFESSIONAL CONTENT CREATOR]
      오늘 날짜는 ${dateString}입니다.
      주제: "${topic}"
      **지정된 말투: "${tone}"**
      **지정된 길이: "${length}"**
      [작성 규칙]
      1. 반드시 지정된 말투(${tone})의 특성을 살려 전체 문장을 구성하세요.
      2. 지정된 길이(${length})에 맞춰서 정보의 깊이와 양을 조절하세요.
      3. SEO 최적화: Title은 "${topic}" 키워드를 포함하고 소제목은 H2(##)를 사용하세요.
      4. 실시간 데이터: 구글 검색 도구로 수치를 확보하여 표(Table) 형식을 활용하세요.
      5. 하이퍼링크 출처: [뉴스 제목/출처](URL 주소) 형식을 사용하세요.
      6. 포맷팅: 내용 전체적으로 구분선(---)을 절대 사용하지 마세요.
      `;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} } as any],
      });

      const response = await result.response;
      setContent(response.text());
    } catch (error: any) {
      console.error("AI 생성 에러:", error);
      alert("에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!content) return alert("복사할 내용이 없습니다!");
    await navigator.clipboard.writeText(content);
    alert("글이 클립보드에 복사되었습니다!");
  };

  const handleDownload = () => {
    if (!content) return alert("저장할 내용이 없습니다!");
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${topic || 'ai_content'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // ✅ [원본 유지] 사이드바 데이터
  const sidebarData: any = {
    Writing: ['워드프레스 글쓰기', '네이버 글쓰기', '뉴스 글쓰기', 'SNS 글쓰기', '광고 카피라이팅', '텍스트 변형/확장', 'AI 캐릭터 페르소나 설정기', 'SEO 최적화 메타 데이터'],
    Visuals: ['이미지 생성기', '비디오 생성기', '썸네일 생성기'],
    Music: ['Suno 스타일 라이브러리', 'Suno 작곡', '가사 생성기(다국어)'],
    Script: ['대본 생성기(대본/이미지/비디오)'],
    Tools: ['AI 트렌드 대시보드', '다채널 리포퍼징', '키워드 분석']
  };

  useEffect(() => {
    if (sidebarData[activeMenu]) {
      setActiveSubMenu(sidebarData[activeMenu][0]);
    }
  }, [activeMenu]);

  return (
    <div className="flex h-full w-full bg-black">
      
      {/* 1. 사이드바 영역 */}
      <aside className="w-72 border-r border-zinc-800 bg-zinc-950 flex flex-col overflow-y-auto custom-scrollbar">
        <div className="p-6">
          <nav className="mb-10 mt-4">
            <p className="text-[11px] font-black mb-5 uppercase tracking-[0.2em] text-blue-500/80 ml-2">
              {activeMenu} Focus
            </p>
            <div className="space-y-1.5">
              {sidebarData[activeMenu]?.map((item: string) => (
                <div 
                  key={item} 
                  onClick={() => { setActiveSubMenu(item); setViewMode('Studio'); }}
                  className={`px-4 py-3 text-[14px] font-bold rounded-xl cursor-pointer transition-all ${
                    activeSubMenu === item && viewMode === 'Studio' 
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-600/20' 
                    : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </nav>

          <nav className="mb-8">
            <p className="text-[11px] font-black mb-4 uppercase tracking-[0.2em] text-zinc-600 ml-2">Management</p>
            <div className="space-y-1">
              {['대시보드', '마켓플레이스', '커뮤니티', 'FAQ / Q&A', 'AI 챗봇'].map((item) => (
                <div key={item} className="px-4 py-2 text-[13px] font-bold text-zinc-500 hover:text-zinc-300 cursor-pointer transition-all">{item}</div>
              ))}
            </div>
          </nav>

          <nav className="mb-8">
            <p className="text-[11px] font-black mb-4 uppercase tracking-[0.2em] text-zinc-600 ml-2">Account</p>
            <div className="space-y-1">
              {/* ✅ [수정] 사이드바 내 프로필 클릭 시 MyPage 전환 */}
              <div 
                onClick={() => setViewMode('MyPage')}
                className={`px-4 py-2 text-[13px] font-bold cursor-pointer transition-all ${viewMode === 'MyPage' ? 'text-blue-500 bg-blue-500/10 rounded-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                내 프로필
              </div>
              <div 
                onClick={() => setViewMode('Vault')} 
                className={`px-4 py-2 text-[13px] font-bold cursor-pointer transition-all ${viewMode === 'Vault' ? 'text-blue-500 bg-blue-500/10 rounded-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                API 키 관리
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* 2. 메인 콘텐츠 영역 (조건부 렌더링 확장) */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-10 bg-transparent custom-scrollbar">
        {viewMode === 'Studio' ? (
          activeMenu === 'Writing' && activeSubMenu === '워드프레스 글쓰기' ? (
            <WordPressContent 
              isDark={true}
              topic={topic} setTopic={setTopic} 
              handleGenerate={handleGenerate} 
              loading={loading} 
              content={content} 
              useSearch={useSearch} setUseSearch={setUseSearch} 
              handleCopy={handleCopy} 
              handleDownload={handleDownload} 
              tone={tone} setTone={setTone} 
              length={length} setLength={setLength} 
              user={user}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-30 italic font-bold text-2xl">
              {activeSubMenu} 준비 중...
            </div>
          )
        ) : viewMode === 'Vault' ? (
          <APIVaultContent />
        ) : (
          /* ✅ [추가] viewMode가 'MyPage'일 때 마이페이지 콘텐츠 렌더링 */
          <MyPageContent />
        )}
      </main>
    </div>
  );
}
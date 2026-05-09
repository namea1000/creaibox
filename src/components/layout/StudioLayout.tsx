"use client";

import React, { useState, useEffect, useRef } from 'react';
import WordPressContent from '@/components/writing/wordpress/WordPressCenter';
import APIVaultContent from '@/components/vault/APIVaultContent'; 
import MyPageContent from '@/components/mypage/MyPageContent'; 
import CommunityCenter from '@/components/community/CommunityCenter'; // 🌟 커뮤니티 컴포넌트 추가
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  Menu, X, ChevronDown, User as UserIcon, Settings, LogOut, Key, 
  ChevronLeft, ChevronRight, LayoutDashboard, ShoppingBag, Users, 
  HelpCircle, MessageCircle, FileText, Newspaper, Share2, PenTool, 
  Type, UserCircle, Search, Image as ImageIcon, Video, Music, Sparkles, 
  Wand2, Mic2, BarChart3, Repeat
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface StudioLayoutProps {
  activeMenu: 'Writing' | 'Visuals' | 'Music' | 'Script' | 'Tools' | string;
  initialViewMode?: 'Studio' | 'Vault' | 'MyPage' | 'Community'; // 🌟 Community 추가
  isDarkMode: boolean;
}

export default function StudioLayout({ 
  activeMenu, 
  initialViewMode = 'Studio',
  isDarkMode
}: StudioLayoutProps) {
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const [viewMode, setViewMode] = useState<any>(initialViewMode);
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

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

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

  const menuIcons: any = {
    '워드프레스 글쓰기': FileText, '네이버 글쓰기': Newspaper, '뉴스 글쓰기': Newspaper, 'SNS 글쓰기': Share2,
    '광고 카피라이팅': Sparkles, '텍스트 변형/확장': Type, 'AI 캐릭터 페르소나 설정기': UserCircle,
    'SEO 최적화 메타 데이터': Search, '이미지 생성기': ImageIcon, '비디오 생성기': Video, '썸네일 생성기': Wand2,
    'Suno 스타일 라이브러리': Music, 'Suno 작곡': Music, '가사 생성기(다국어)': Mic2,
    '대본 생성기(대본/이미지/비디오)': FileText, 'AI 트렌드 대시보드': BarChart3, '다채널 리포퍼징': Repeat,
    '키워드 분석': Search, '대시보드': LayoutDashboard, '마켓플레이스': ShoppingBag, '커뮤니티': Users,
    'FAQ / Q&A': HelpCircle, 'AI 챗봇': MessageCircle, '내 프로필': UserIcon, 'API 키 관리': Key
  };

  const sidebarBg = isDarkMode ? "bg-[#0d1117] border-zinc-800/50" : "bg-white border-zinc-200";
  const mainBg = isDarkMode ? "bg-[#0a0c10]" : "bg-zinc-50";
  const textColor = isDarkMode ? "text-zinc-100" : "text-zinc-900";
  const subTextColor = isDarkMode ? "text-zinc-500" : "text-zinc-400";

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
    <div className={`relative flex h-full w-full transition-colors duration-500 overflow-hidden font-sans ${mainBg}`}>
      
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 border-b z-[40] flex items-center justify-between px-5 transition-all ${
        isDarkMode ? 'bg-[#0d1117] border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <button onClick={() => setIsMobileOpen(true)} className={`${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
          <Menu size={24} />
        </button>
        <h1 className={`font-black italic text-lg tracking-tighter ${isDarkMode ? 'text-yellow-400' : 'text-blue-600'}`}>CREAIBOX</h1>
        <div className="w-10"></div>
      </div>

      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        className={`
          fixed lg:relative flex flex-col border-r transition-all duration-300 ease-in-out z-[50] h-full
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
          ${sidebarBg}
        `}
      >
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`hidden lg:flex absolute -right-3 top-12 z-[60] h-6 w-6 items-center justify-center rounded-full border transition-all shadow-md active:scale-90 ${
            isDarkMode ? 'bg-zinc-900 border-zinc-700 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'
          }`}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <div className={`p-6 ${isCollapsed ? 'px-4' : ''}`}>
            
            <nav className="mb-10 mt-4">
              <p className={`text-[10px] font-black mb-5 uppercase tracking-[0.2em] ml-2 transition-opacity duration-300 ${
                isDarkMode ? 'text-blue-500/80' : 'text-blue-600'
              } ${isCollapsed ? 'lg:opacity-0 lg:h-0 overflow-hidden' : 'opacity-100'}`}>
                {activeMenu} Focus
              </p>
              <div className="space-y-1.5">
                {sidebarData[activeMenu]?.map((item: string) => {
                  const Icon = menuIcons[item] || PenTool;
                  const isActive = activeSubMenu === item && viewMode === 'Studio';
                  return (
                    <div 
                      key={item} 
                      onClick={() => { setActiveSubMenu(item); setViewMode('Studio'); setIsMobileOpen(false); }}
                      title={isCollapsed ? item : ""}
                      className={`flex items-center px-4 py-3 text-[14px] font-bold rounded-xl cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-blue-600/15 text-blue-500 border border-blue-500/20 shadow-sm' 
                          : `${isDarkMode ? 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`
                      } ${isCollapsed ? 'lg:justify-center lg:px-0' : 'gap-3'}`}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span className={`truncate transition-all duration-300 ${isCollapsed ? 'lg:hidden' : 'block'}`}>{item}</span>
                    </div>
                  );
                })}
              </div>
            </nav>

            {[
              { label: 'Management', items: ['대시보드', '마켓플레이스', '커뮤니티', 'FAQ / Q&A', 'AI 챗봇'] },
              { label: 'Account', items: ['내 프로필', 'API 키 관리'] }
            ].map((section) => (
              <nav key={section.label} className="mb-8">
                <p className={`text-[10px] font-black mb-4 uppercase tracking-[0.2em] ml-2 transition-opacity duration-300 ${subTextColor} ${isCollapsed ? 'lg:opacity-0 lg:h-0 overflow-hidden' : 'opacity-100'}`}>
                  {section.label}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = menuIcons[item] || LayoutDashboard;
                    const isAccountItem = section.label === 'Account';
                    
                    // 🌟 활성화 상태 로직 고도화
                    const isItemActive = 
                      (item === '내 프로필' && viewMode === 'MyPage') || 
                      (item === 'API 키 관리' && viewMode === 'Vault') ||
                      (item === '커뮤니티' && viewMode === 'Community');
                    
                    return (
                      <div 
                        key={item} 
                        onClick={() => {
                          if (item === '내 프로필') setViewMode('MyPage');
                          else if (item === 'API 키 관리') setViewMode('Vault');
                          else if (item === '커뮤니티') setViewMode('Community'); // 🌟 커뮤니티 연결
                          else {
                            setActiveSubMenu(item);
                            setViewMode('Studio');
                          }
                          setIsMobileOpen(false);
                        }}
                        title={isCollapsed ? item : ""}
                        className={`flex items-center px-4 py-2 text-[13px] font-bold cursor-pointer transition-all ${
                          isItemActive 
                            ? 'text-blue-500 bg-blue-500/10 rounded-lg' 
                            : `${isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-900'}`
                        } ${isCollapsed ? 'lg:justify-center lg:px-0' : 'gap-3'}`}
                      >
                        <Icon size={16} className="shrink-0" />
                        {!isCollapsed && <span>{item}</span>}
                      </div>
                    );
                  })}
                </div>
              </nav>
            ))}
          </div>
        </div>
      </aside>

      <main 
        className={`
          flex-1 overflow-y-auto custom-scrollbar transition-all duration-300
          ${isMobileOpen ? 'blur-sm pointer-events-none' : ''}
          lg:p-10 p-5 pt-20 lg:pt-10
        `}
      >
        {viewMode === 'Studio' ? (
          activeMenu === 'Writing' && activeSubMenu === '워드프레스 글쓰기' ? (
            <WordPressContent 
              isDarkMode={isDarkMode} 
              isDark={isDarkMode} 
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
            <div className={`flex flex-col items-center justify-center h-full opacity-30 italic font-bold text-2xl ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
              {activeSubMenu} 준비 중...
            </div>
          )
        ) : viewMode === 'Vault' ? (
          <APIVaultContent />
        ) : viewMode === 'MyPage' ? (
          <MyPageContent />
        ) : viewMode === 'Community' ? (
          <CommunityCenter isDarkMode={isDarkMode} /> // 🌟 커뮤니티 화면 연결!
        ) : (
          <div className="flex items-center justify-center h-full opacity-20 font-black text-2xl">READY</div>
        )}
      </main>
    </div>
  );
}
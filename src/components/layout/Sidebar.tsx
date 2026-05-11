"use client";

import React from 'react';
import { 
  X, ChevronLeft, ChevronRight, LayoutDashboard, ShoppingBag, Users, 
  HelpCircle, MessageCircle, FileText, Newspaper, Share2, PenTool, 
  Type, UserCircle, Search, Image as ImageIcon, Video, Music, Sparkles, 
  Wand2, Mic2, BarChart3, Repeat, Key, User as UserIcon
} from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  activeSubMenu: string;
  setActiveSubMenu: (menu: string) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
  isDarkMode: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeMenu,
  activeSubMenu,
  setActiveSubMenu,
  viewMode,
  setViewMode,
  isDarkMode,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: SidebarProps) {

  // 메뉴 아이콘 매핑 (기존 데이터 100% 보존)
  const menuIcons: any = {
    '워드프레스 글쓰기': FileText, '네이버 글쓰기': Newspaper, '뉴스 글쓰기': Newspaper, 'SNS 글쓰기': Share2,
    '광고 카피라이팅': Sparkles, '텍스트 변형/확장': Type, 'AI 캐릭터 페르소나 설정기': UserCircle,
    'SEO 최적화 메타 데이터': Search, '이미지 생성기': ImageIcon, '비디오 생성기': Video, '썸네일 생성기': Wand2,
    'Suno 스타일 라이브러리': Music, 'Suno 작곡': Music, '가사 생성기(다국어)': Mic2,
    '대본 생성기(대본/이미지/비디오)': FileText, 'AI 트렌드 대시보드': BarChart3, '다채널 리포퍼징': Repeat,
    '키워드 분석': Search, '대시보드': LayoutDashboard, '마켓플레이스': ShoppingBag, '커뮤니티': Users,
    'FAQ / Q&A': HelpCircle, 'AI 챗봇': MessageCircle, '내 프로필': UserIcon, 'API 키 관리': Key
  };

  // 사이드바 메뉴 데이터 (기존 데이터 100% 보존)
  const sidebarData: any = {
    Writing: ['워드프레스 글쓰기', '네이버 글쓰기', '뉴스 글쓰기', 'SNS 글쓰기', '광고 카피라이팅', '텍스트 변형/확장', 'AI 캐릭터 페르소나 설정기', 'SEO 최적화 메타 데이터'],
    Visuals: ['이미지 생성기', '비디오 생성기', '썸네일 생성기'],
    Music: ['Suno 스타일 라이브러리', 'Suno 작곡', '가사 생성기(다국어)'],
    Script: ['대본 생성기(대본/이미지/비디오)'],
    Tools: ['AI 트렌드 대시보드', '다채널 리포퍼징', '키워드 분석']
  };

  const sidebarBg = isDarkMode ? "bg-[#0d1117] border-zinc-800/50" : "bg-white border-zinc-200";
  const subTextColor = isDarkMode ? "text-zinc-500" : "text-zinc-400";

  return (
    <aside 
      className={`
        fixed lg:relative flex flex-col border-r transition-all duration-300 ease-in-out z-[50]
        ${isCollapsed ? 'lg:w-20' : 'lg:w-65'}
        ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
        ${sidebarBg}
      `}
    >
      {/* 접기/펴기 버튼 (데스크톱) */}
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
          
          {/* 메인 스튜디오 섹션 */}
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

          {/* 공통 관리 섹션 */}
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
                  
                  // 활성화 상태 체크 로직
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
                        else if (item === '커뮤니티') setViewMode('Community');
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
            {/* 푸터 정보 (Aside 내부에 작게) */}
      <div className={`p-6 border-t ${isDarkMode ? 'border-zinc-800/50' : 'border-zinc-200'}`}>
        <p className={`text-[10px] text-center ${subTextColor}`}>
          © CreAibox - AI Contents Studio <br />
          v1.0.4 - Premium Support
        </p>
      </div>
    </aside>
    
  );
}
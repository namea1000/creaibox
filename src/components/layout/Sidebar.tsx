"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, LayoutDashboard, ShoppingBag, Users, 
  HelpCircle, MessageCircle, FileText, Newspaper, Share2, Sparkles, 
  Type, UserCircle, Search, Image as ImageIcon, Video, Music, 
  Wand2, Mic2, BarChart3, Repeat, Key, User as UserIcon, PenTool
} from 'lucide-react';

// 🌟 쓰레기 Props(setActiveSubMenu, setViewMode 등)를 모두 제거했습니다.
interface SidebarProps {
  activeMenu: string; // 현재 어떤 스튜디오(Writing, Visuals 등)인지 구분용
  isDarkMode: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeMenu,
  isDarkMode,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: SidebarProps) {
  
  const pathname = usePathname();

  // 메뉴 아이콘 매핑 (사장님 원본 데이터 100% 보존)
  const menuIcons: any = {
    '워드프레스 글쓰기': FileText, '네이버 글쓰기': Newspaper, '뉴스 글쓰기': Newspaper, 'SNS 글쓰기': Share2,
    '광고 카피라이팅': Sparkles, '텍스트 변형/확장': Type, 'AI 캐릭터 페르소나 설정기': UserCircle,
    'SEO 최적화 메타 데이터': Search, '이미지 생성기': ImageIcon, '비디오 생성기': Video, '썸네일 생성기': Wand2,
    'Suno 스타일 라이브러리': Music, 'Suno 작곡': Music, '가사 생성기(다국어)': Mic2,
    '대본 생성기(대본/이미지/비디오)': FileText, 'AI 트렌드 대시보드': BarChart3, '다채널 리포퍼징': Repeat,
    '키워드 분석': Search, '대시보드': LayoutDashboard, '마켓플레이스': ShoppingBag, '커뮤니티': Users,
    'FAQ / Q&A': HelpCircle, 'AI 챗봇': MessageCircle, '내 프로필': UserIcon, 'API 키 관리': Key
  };

  // 사이드바 메뉴 데이터 및 경로 매핑 (사장님 원본 데이터 유지 + href 추가)
  // 🌟 실제 경로가 만들어지면 href를 수정하시면 됩니다.
  const sidebarData: any = {
    Writing: [
      { name: '워드프레스 글쓰기', href: '/studio/writing/wp' },
      { name: '네이버 글쓰기', href: '/studio/writing/naver' },
      { name: '뉴스 글쓰기', href: '/studio/writing/news' },
      { name: 'SNS 글쓰기', href: '/studio/writing/sns' },
      { name: '광고 카피라이팅', href: '/studio/writing/copy' },
      { name: '텍스트 변형/확장', href: '/studio/writing/transform' },
      { name: 'AI 캐릭터 페르소나 설정기', href: '/studio/writing/persona' },
      { name: 'SEO 최적화 메타 데이터', href: '/studio/writing/seo' }
    ],
    Visuals: [
      { name: '이미지 생성기', href: '/studio/visuals/image' },
      { name: '비디오 생성기', href: '/studio/visuals/video' },
      { name: '썸네일 생성기', href: '/studio/visuals/thumb' }
    ],
    Music: [
      { name: 'Suno 스타일 라이브러리', href: '/studio/music/library' },
      { name: 'Suno 작곡', href: '/studio/music/compose' },
      { name: '가사 생성기(다국어)', href: '/studio/music/lyrics' }
    ],
    Script: [
      { name: '대본 생성기(대본/이미지/비디오)', href: '/studio/script/gen' }
    ],
    Tools: [
      { name: 'AI 트렌드 대시보드', href: '/tools/trend' },
      { name: '다채널 리포퍼징', href: '/tools/repurposing' },
      { name: '키워드 분석', href: '/tools/keyword' }
    ]
  };

  const sidebarBg = isDarkMode ? "bg-[#0d1117] border-zinc-800/50" : "bg-white border-zinc-200";
  const subTextColor = isDarkMode ? "text-zinc-500" : "text-zinc-400";

  return (
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

      <div className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden pt-20">
        <div className={`p-6 ${isCollapsed ? 'px-4' : ''}`}>
          
          <nav className="mb-10 mt-4">
            <p className={`text-[10px] font-black mb-5 uppercase tracking-[0.2em] ml-2 transition-opacity duration-300 ${
              isDarkMode ? 'text-blue-500/80' : 'text-blue-600'
            } ${isCollapsed ? 'lg:opacity-0 lg:h-0 overflow-hidden' : 'opacity-100'}`}>
              {activeMenu} Focus
            </p>
            <div className="space-y-1.5">
              {sidebarData[activeMenu]?.map((item: any) => {
                const Icon = menuIcons[item.name] || PenTool;
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.name === '워드프레스 글쓰기' ? '/studio/writing/wp' : '#'} // 예시 경로, 추후 채우시면 됩니다.
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center px-4 py-3 text-[14px] font-bold rounded-xl cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-blue-600/15 text-blue-500 border border-blue-500/20 shadow-sm' 
                        : `${isDarkMode ? 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200' : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}`
                    } ${isCollapsed ? 'lg:justify-center lg:px-0' : 'gap-3'}`}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </nav>

          {[
            { label: 'Management', items: [
              { name: '대시보드', href: '/dashboard' },
              { name: '마켓플레이스', href: '/marketplace' },
              { name: '인포센터', href: '/infocenter' },
              { name: 'FAQ / Q&A', href: '/faq' },
              { name: 'AI 챗봇', href: '/chatbot' }
            ]},
            { label: 'Account', items: [
              { name: '내 프로필', href: '/adm/mypage' },
              { name: 'API 키 관리', href: '/apivault' }
            ]}
          ].map((section) => (
            <nav key={section.label} className="mb-8">
              <p className={`text-[10px] font-black mb-4 uppercase tracking-[0.2em] ml-2 transition-opacity duration-300 ${subTextColor} ${isCollapsed ? 'lg:opacity-0 lg:h-0 overflow-hidden' : 'opacity-100'}`}>
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = menuIcons[item.name] || LayoutDashboard;
                  const isItemActive = pathname === item.href;
                  
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center px-4 py-2 text-[13px] font-bold cursor-pointer transition-all ${
                        isItemActive 
                          ? 'text-blue-500 bg-blue-500/10 rounded-lg' 
                          : `${isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-500 hover:text-zinc-900'}`
                      } ${isCollapsed ? 'lg:justify-center lg:px-0' : 'gap-3'}`}
                    >
                      <Icon size={16} className="shrink-0" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </nav>
          ))}
        </div>
      </div>

      <div className={`p-6 border-t ${isDarkMode ? 'border-zinc-800/50' : 'border-zinc-200'}`}>
        <p className={`text-[10px] text-center font-bold tracking-tighter ${subTextColor}`}>
          © CREAIBOX STUDIO <br />
          <span className="opacity-50 uppercase tracking-widest text-[8px]">Strategic Systems</span>
        </p>
      </div>
    </aside>
  );
}
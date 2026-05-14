"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, Shield, CreditCard, Trash2, Globe, 
  Save, Plus, Trash, Sparkles
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// 🌟 필요한 모든 전역 레이아웃 부품 로드
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import Aside from '@/components/layout/Aside';

export default function MyPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [wpSites, setWpSites] = useState<any[]>([]); 
  const [isCollapsed, setIsCollapsed] = useState(false); // 사이드바 상태
  const [profile, setProfile] = useState<any>({
    nickname: '',
    system_id: '',   
    brand_id: '',    
    blog_title: '',
    blog_description: '',
    membership_level: 'free'
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      if (currentUser) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        if (data) {
          setProfile(data);
          setWpSites(data.extra_configs?.wp_sites || []);
        }
      }
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  const checkDuplicate = async (field: 'nickname' | 'brand_id', value: string) => {
    if (field === 'brand_id') return; 
    if (!value || value.length < 2) return alert("2자 이상 입력해주세요.");
    
    const { data, error } = await supabase
      .from('profiles')
      .select(field)
      .eq(field, value.toLowerCase())
      .maybeSingle();

    if (error) return alert("체크 중 오류가 발생했습니다.");
    if (data) alert(`이미 사용 중인 닉네임입니다.`);
    else alert(`사용 가능한 닉네임입니다!`);
  };

  const addWpSite = () => setWpSites([...wpSites, { siteName: '', url: '', userId: '', appPassword: '' }]);
  const removeWpSite = (index: number) => setWpSites(wpSites.filter((_, i) => i !== index));
  const updateWpSite = (index: number, field: string, value: string) => {
    const newSites = [...wpSites];
    newSites[index][field] = value;
    setWpSites(newSites);
  };

  // 🌟 [추가] 사이드바가 모바일에서 열렸는지 닫혔는지 관리하는 상태가 필요합니다!
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const handleSave = async () => {
    if (!user) return alert("로그인이 필요합니다.");
    const { error } = await supabase
      .from('profiles')
      .update({
        nickname: profile.nickname,
        blog_title: profile.blog_title,
        blog_description: profile.blog_description,
        extra_configs: { ...profile.extra_configs, wp_sites: wpSites },
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) alert("저장 실패: " + error.message);
    else alert("프로필 설정이 안전하게 업데이트되었습니다.");
  };

  if (loading) return (
    <div className="h-screen bg-[#05070a] flex items-center justify-center">
      <div className="text-zinc-600 italic font-black tracking-widest animate-pulse uppercase">CreAibox Loading...</div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#05070a] text-zinc-100 font-sans">
      
      {/* 1. 고정 헤더 */}
      <Header />

      <div className="flex flex-1 pt-20 overflow-hidden">
        
        {/* 2. 좌측 사이드바 (기본 사이드바 사용) */}
        <Sidebar 
          activeMenu="MyPage" 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* 3. 중앙 본문 스크롤 영역 */}
        <main className="flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 p-8 lg:p-12">
          
          <div className="max-w-5xl mx-auto space-y-8 pb-32">
            {/* 상단 타이틀 */}
            <div className="text-center space-y-2 mb-10">
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                My <span className="text-blue-500">Profile</span> Settings
              </h1>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">개인 설정 및 콘텐츠 배포 환경 통합 관리</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 프로필 섹션 */}
              <section className="bg-zinc-900/40 border border-zinc-800 rounded-[32px] p-8 space-y-6 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                  <User className="text-blue-500" size={20} />
                  <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Profile Identity</h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">System ID</label>
                    <div className="bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-500 font-mono tracking-tighter">
                      {profile.system_id || 'Generating...'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={12} /> Display Nickname
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" value={profile.nickname}
                        onChange={(e)=>setProfile({...profile, nickname: e.target.value})}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-all font-bold placeholder:text-zinc-700"
                        placeholder="닉네임 입력"
                      />
                      <button onClick={()=>checkDuplicate('nickname', profile.nickname)} className="px-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-[11px] font-black transition-all border border-zinc-700 whitespace-nowrap uppercase italic">Check</button>
                    </div>
                  </div>
                  <button onClick={handleSave} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 italic uppercase tracking-widest active:scale-95">
                    <Save size={18} /> Update Profile
                  </button>
                </div>
              </section>

              {/* 멤버십 섹션 */}
              <section className="bg-zinc-900/40 border border-zinc-800 rounded-[32px] p-8 space-y-6 h-fit shadow-2xl">
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                  <Shield className="text-emerald-500" size={20} />
                  <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Membership Status</h2>
                </div>
                <div className="space-y-5">
                  <div className="flex justify-between items-center border-b border-zinc-800/50 pb-3">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Registered Email</span>
                    <span className="text-sm font-black italic text-zinc-200">{user?.email}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Access Level</span>
                    <span className="text-sm font-black italic text-blue-500">{profile.membership_level?.toUpperCase() || 'FREE'}</span>
                  </div>
                </div>
              </section>

              {/* 워드프레스 채널 섹션 */}
              <section className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-[32px] p-8 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <Globe className="text-blue-500" size={20} />
                    <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Distribution Channels</h2>
                  </div>
                  <button onClick={addWpSite} className="flex items-center gap-2 px-5 py-2 bg-emerald-600/10 text-emerald-500 text-[11px] font-black rounded-xl border border-emerald-600/20 hover:bg-emerald-600/20 transition-all uppercase italic">
                    <Plus size={14} /> Add Channel
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {wpSites.map((site, index) => (
                    <div key={index} className="p-6 bg-black/40 border border-zinc-800 rounded-2xl space-y-4 group transition-all hover:border-zinc-700 shadow-inner">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic text-blue-400">Channel {index + 1}</span>
                        <button onClick={() => removeWpSite(index)} className="text-zinc-600 hover:text-red-500 transition-colors"><Trash size={16} /></button>
                      </div>
                      <input type="text" placeholder="Site Name" value={site.siteName} onChange={(e) => updateWpSite(index, 'siteName', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:border-blue-500 outline-none font-bold" />
                      <input type="text" placeholder="WordPress URL" value={site.url} onChange={(e) => updateWpSite(index, 'url', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:border-blue-500 outline-none font-bold" />
                      <div className="flex gap-2">
                        <input type="text" placeholder="User ID" value={site.userId} onChange={(e) => updateWpSite(index, 'userId', e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:border-blue-500 outline-none font-bold" />
                        <input type="password" placeholder="App Password" value={site.appPassword} onChange={(e) => updateWpSite(index, 'appPassword', e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:border-blue-500 outline-none font-bold" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Danger Zone */}
              <section className="lg:col-span-2 bg-red-950/10 border border-red-900/20 rounded-[32px] p-8 flex items-center justify-between shadow-lg shadow-red-900/5">
                <div className="space-y-1">
                  <h3 className="text-lg font-black italic uppercase text-red-500 flex items-center gap-2"><Trash2 size={20} /> Danger Zone</h3>
                  <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">회원 탈퇴 시 모든 데이터가 즉시 삭제됩니다.</p>
                </div>
                <button className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[11px] font-black rounded-xl border border-red-500/20 uppercase italic tracking-widest transition-all active:scale-95">Terminate Account</button>
              </section>
            </div>
          </div>

          <Footer />
        </main>

        {/* 4. 우측 Aside */}
        <div className="hidden xl:flex shrink-0">
          <Aside />
        </div>
      </div>

      {/* 하단 플로팅 저장 버튼 */}
      <div className="fixed bottom-10 left-0 right-0 flex justify-center pointer-events-none z-50">
        <button onClick={handleSave} className="pointer-events-auto flex items-center gap-3 px-14 py-5 bg-blue-600 hover:bg-blue-500 text-white text-lg font-black italic rounded-2xl shadow-2xl transition-all border border-blue-400/30 uppercase tracking-tighter active:scale-95">
          <Save size={24} /> Sync & Save All Settings
        </button>
      </div>
    </div>
  );
}
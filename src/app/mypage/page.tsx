"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, Shield, CreditCard, Trash2, Globe, 
  Save, Plus, Trash, Sparkles, Key, CheckCircle, Mail, LogIn, RefreshCw
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// 전역 레이아웃 부품
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import Aside from '@/components/layout/Aside';

export default function MyPage() {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [wpSites, setWpSites] = useState<any[]>([]); 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState<any>({
    nickname: '',
    brand_id: '',
    membership_level: 'free'
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (data) {
          setProfile(data);
          setWpSites(data.extra_configs?.wp_sites || []);
        }
      }
      setIsDataLoading(false);
    };
    fetchInitialData();
  }, []);

  const checkDuplicate = async (field: 'nickname', value: string) => {
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

  const handleSave = async () => {
    if (!user) return alert("로그인이 필요합니다.");
    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        nickname: profile.nickname,
        extra_configs: { ...profile.extra_configs, wp_sites: wpSites },
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) alert("저장 실패: " + error.message);
    else alert("프로필 설정이 안전하게 업데이트되었습니다.");
    setIsSaving(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#05070a] text-zinc-100 font-sans">
      <div className="flex flex-1 pt-20 overflow-hidden">
        
        {/* 1. 좌측 사이드바 */}
        <Sidebar 
          activeMenu="MyPage" 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* 2. 중앙 본문 영역 */}
        <main className="flex-1 overflow-y-auto custom-scrollbar transition-all duration-300">
          <div className="p-6 lg:p-12 pt-4 lg:pt-10 max-w-[1400px] mx-auto pb-48">
            
            {/* 🌟 헤더 섹션: 우측에 저장 버튼 배치 */}
            <header className="mb-12 border-b border-zinc-800 pb-10 text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-2">
                <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
                  My <span className="text-blue-500">Profile</span> Settings
                </h1>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3 pl-1 italic">
                  Strategic Personal Environment & Identity Management
                </p>
              </div>
              
              {/* 🌟 상단 우측 저장 버튼 (fixed 제거하고 흐름에 맞게 배치) */}
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex items-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black italic rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all border border-blue-400/30 uppercase tracking-widest active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSaving ? <RefreshCw size={18} className="animate-spin text-white" /> : <Save size={18} className="group-hover:scale-110 transition-transform" />}
                Sync & Save All Settings
              </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* [좌측 섹션] 프로필 정보 Identity */}
              <section className="bg-zinc-900/40 border border-zinc-800 rounded-[40px] p-10 space-y-8 shadow-2xl text-left hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-6">
                  <User className="text-blue-500" size={24} />
                  <h2 className="text-2xl font-black italic uppercase text-white tracking-tight">Identity</h2>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-blue-500 uppercase tracking-widest pl-1 flex items-center gap-2">
                      <Sparkles size={14} /> 활동 닉네임 브랜딩
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" value={profile.nickname || ''}
                        onChange={(e)=>setProfile({...profile, nickname: e.target.value})}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-5 text-sm text-white focus:border-blue-500 outline-none transition-all font-bold placeholder:text-zinc-800 shadow-inner"
                        placeholder="나만의 닉네임을 입력하세요"
                      />
                      <button onClick={()=>checkDuplicate('nickname', profile.nickname)} className="px-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-2xl text-[11px] font-black transition-all border border-zinc-700 uppercase italic tracking-tighter">Check</button>
                    </div>
                    
                    <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-5 space-y-3">
                      <p className="text-xs text-blue-400 font-black leading-relaxed flex items-center gap-2">
                        <CheckCircle size={14} /> 닉네임 설정 가이드
                      </p>
                      <p className="text-[11px] text-zinc-500 font-bold leading-relaxed">
                        현재 할당된 닉네임은 계정 생성을 위한 <span className="text-zinc-300">임시 아이디(이메일 조합)</span>입니다. 
                        커뮤니티 활동을 위해 나만의 고유한 닉네임으로 자유롭게 변경해 주세요!
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 opacity-40 grayscale">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Brand ID (Domain Reservation)</label>
                    <div className="flex gap-2">
                        <div className="flex-1 flex items-center bg-black/40 border border-zinc-800 rounded-2xl px-6 py-4">
                            <span className="text-zinc-600 text-sm font-black italic uppercase">Coming Soon</span>
                            <span className="ml-auto text-zinc-800 text-xs font-black">.creaibox.com</span>
                        </div>
                    </div>
                    <p className="text-[9px] text-zinc-800 italic pl-1 uppercase font-black">Status: Service Under Development</p>
                  </div>
                </div>
              </section>

              {/* [우측 섹션] 계정 상태 정보 Status */}
              <section className="bg-zinc-900/40 border border-zinc-800 rounded-[40px] p-10 space-y-8 h-fit shadow-2xl">
                <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-6">
                  <Shield className="text-emerald-500" size={24} />
                  <h2 className="text-2xl font-black italic uppercase text-white tracking-tight">Security</h2>
                </div>
                <div className="space-y-7">
                  <div className="flex justify-between items-center py-2 border-b border-zinc-800/30">
                    <span className="text-[11px] font-black text-zinc-600 uppercase tracking-widest pl-1 flex items-center gap-2">
                      <Mail size={14} className="text-zinc-700" /> Account ID
                    </span>
                    <span className="text-sm font-black italic text-zinc-300 font-mono tracking-tighter">{user?.email}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-zinc-800/30">
                    <span className="text-[11px] font-black text-zinc-600 uppercase tracking-widest pl-1 flex items-center gap-2">
                      <LogIn size={14} className="text-zinc-700" /> Auth Provider
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10 italic uppercase tracking-widest">
                      {user?.app_metadata?.provider === 'google' && (
                        <img src="https://www.google.com/favicon.ico" className="w-3 h-3 grayscale opacity-70" alt="G" />
                      )}
                      {user?.app_metadata?.provider || 'EMAIL'} AUTHENTICATED
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-zinc-800/30">
                    <span className="text-[11px] font-black text-zinc-600 uppercase tracking-widest pl-1">Creation Date</span>
                    <span className="text-sm font-black italic text-zinc-400">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-[11px] font-black text-zinc-600 uppercase tracking-widest pl-1">Plan Level</span>
                    <span className="text-sm font-black italic text-blue-500 bg-blue-500/10 px-6 py-2 rounded-full border border-blue-500/20 uppercase tracking-widest">
                        {profile.membership_level || 'Free'}
                    </span>
                  </div>
                </div>
              </section>

              {/* [하단 섹션] 워드프레스 배포 채널 */}
              <section className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-[40px] p-10 space-y-10 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800/50 pb-8">
                  <div className="flex items-center gap-4 text-left">
                    <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-inner">
                      <Globe className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black italic uppercase text-white tracking-tight">WP Distribution Center</h2>
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1 italic">Multi-Site Connectivity Hub</p>
                    </div>
                  </div>
                  <button onClick={addWpSite} className="px-8 py-3 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white text-[11px] font-black rounded-xl border border-blue-500/20 transition-all uppercase italic tracking-widest shadow-lg shadow-blue-900/10">
                    + Register Site
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-emerald-500 uppercase italic px-2 tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Active Multi-Sites
                    </h3>
                    {wpSites.length === 0 && <p className="text-xs text-zinc-700 italic px-6 py-10 border border-dashed border-zinc-800 rounded-[32px] text-center">No active channels found.</p>}
                    <div className="space-y-4">
                      {wpSites.map((site, index) => (
                        <div key={index} className="p-10 bg-black/40 border border-zinc-800 rounded-[32px] space-y-6 relative group hover:border-blue-900/50 transition-all shadow-inner">
                          <button onClick={() => removeWpSite(index)} className="absolute top-8 right-8 text-zinc-800 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-xl"><Trash2 size={20} /></button>
                          <div className="space-y-4 pt-4">
                            <input type="text" placeholder="Site Name" value={site.siteName} onChange={(e) => updateWpSite(index, 'siteName', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs font-bold text-zinc-400 focus:border-blue-500 outline-none shadow-sm" />
                            <input type="text" placeholder="URL (https://...)" value={site.url} onChange={(e) => updateWpSite(index, 'url', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs font-bold text-zinc-400 focus:border-blue-500 outline-none shadow-sm" />
                            <div className="grid grid-cols-2 gap-4">
                              <input type="text" placeholder="User ID" value={site.userId} onChange={(e) => updateWpSite(index, 'userId', e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs font-bold text-zinc-400 focus:border-blue-500 outline-none shadow-sm" />
                              <input type="password" placeholder="Pass" value={site.appPassword} onChange={(e) => updateWpSite(index, 'appPassword', e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs font-bold text-zinc-400 focus:border-blue-500 outline-none shadow-sm" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-12 bg-zinc-900/20 border border-zinc-800 rounded-[40px] space-y-8 h-fit opacity-60 border-dashed relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Globe size={120} />
                    </div>
                    <h3 className="text-xs font-black text-zinc-500 uppercase italic tracking-widest flex items-center gap-2">
                      <Sparkles size={14} /> Personal Blog Status
                    </h3>
                    <div className="flex items-center gap-3 font-black text-zinc-600 bg-black/60 p-6 rounded-3xl border border-zinc-800/50 shadow-inner relative z-10">
                        <CheckCircle size={20} className="text-zinc-800" />
                        <span className="tracking-tighter uppercase italic">Ready to Launch</span>
                        <span className="ml-auto opacity-20 text-[10px] font-mono">.creaibox.com</span>
                    </div>
                    <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed relative z-10 italic pl-1">
                      ✨ 사장님만의 전용 서브도메인이 할당될 준비가 되었습니다. 고유 브랜드 ID 정책 수립 후 공식 오픈 예정입니다.
                    </p>
                  </div>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="lg:col-span-2 bg-red-950/5 border border-red-900/20 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-xl font-black italic uppercase text-red-600 flex items-center justify-center md:justify-start gap-3"><Trash2 size={26} /> Danger Zone</h3>
                  <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest pl-1 leading-relaxed">
                    회원 탈퇴 시 모든 워드프레스 연결 정보 및 개인 프로필 데이터가 <span className="text-red-900 underline underline-offset-2">즉시 영구 삭제</span>됩니다.
                  </p>
                </div>
                <button className="px-10 py-4 bg-red-950/20 hover:bg-red-600 text-red-700 hover:text-white text-[10px] font-black rounded-2xl border border-red-900/30 uppercase italic transition-all active:scale-95 tracking-[0.2em] shadow-lg shadow-red-950/50">
                  Terminate Account
                </button>
              </section>
            </div>

            <footer className="text-center text-zinc-800 text-[10px] mt-24 font-black tracking-[0.5em] uppercase italic opacity-30">
              Creaibox Strategic Studio — All Rights Reserved
            </footer>
          </div>

          <Footer />
        </main>

        <div className="hidden xl:flex shrink-0 border-l border-zinc-800/50 bg-[#05070a]">
          <Aside />
        </div>
      </div>
    </div>
  );
}
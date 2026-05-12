"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, Shield, CreditCard, Trash2, Globe, 
  Camera, Save, Plus, Trash, Key, CheckCircle, Sparkles 
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function MyPageContent() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [wpSites, setWpSites] = useState<any[]>([]); 
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
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
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

  // --- 🌟 중복 체크 로직 (현재 닉네임만 활성) ---
  const checkDuplicate = async (field: 'nickname' | 'brand_id', value: string) => {
    if (field === 'brand_id') return; // 브랜드 ID는 현재 비활성

    if (!value || value.length < 2) return alert("2자 이상 입력해주세요.");
    
    const { data, error } = await supabase
      .from('profiles')
      .select(field)
      .eq(field, value.toLowerCase())
      .maybeSingle();

    if (error) return alert("체크 중 오류가 발생했습니다.");
    
    if (data) {
      alert(`이미 사용 중인 닉네임입니다.`);
    } else {
      alert(`사용 가능한 닉네임입니다!`);
    }
  };

  const addWpSite = () => setWpSites([...wpSites, { siteName: '', url: '', userId: '', appPassword: '' }]);
  const removeWpSite = (index: number) => setWpSites(wpSites.filter((_, i) => i !== index));
  const updateWpSite = (index: number, field: string, value: string) => {
    const newSites = [...wpSites];
    newSites[index][field] = value;
    setWpSites(newSites);
  };

  const handleSave = async () => {
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

  if (loading) return <div className="p-10 text-center text-zinc-500 italic font-bold tracking-widest animate-pulse">CREBOX LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 p-4 lg:p-8 font-sans pb-24">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* 헤더 섹션 */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">내 프로필 설정</h1>
          <p className="text-zinc-500 text-sm font-medium">개인 설정 및 콘텐츠 배포 환경을 관리합니다.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 1. 프로필 정보 */}
          <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <User className="text-blue-500" size={20} />
              <h2 className="text-xl font-black italic uppercase tracking-tight">프로필 정보</h2>
            </div>

            <div className="space-y-6">
              {/* 시스템 아이디 */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">시스템 아이디 (고유식별)</label>
                <div className="bg-black/30 border border-zinc-800/50 rounded-xl px-4 py-3 text-sm text-zinc-600 font-mono">
                  {profile.system_id || '자동 생성 중...'}
                </div>
              </div>

              {/* 닉네임 */}
{/* 닉네임 섹션 (가장 중요) */}
<div className="space-y-2">
  <label className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
    <Sparkles size={14} /> 활동 닉네임 (필수)
  </label>
  <div className="flex gap-2">
    <input 
      type="text" 
      value={profile.nickname}
      onChange={(e)=>setProfile({...profile, nickname: e.target.value})}
      className="flex-1 bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all font-bold"
      placeholder="커뮤니티에서 사용할 이름을 입력하세요"
    />
    <button 
      onClick={()=>checkDuplicate('nickname', profile.nickname)} 
      className="px-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold transition-all border border-zinc-700 whitespace-nowrap"
    >
      중복 확인
    </button>
  </div>
  <p className="text-[10px] text-zinc-500 font-medium ml-1">
    ✨ 닉네임을 설정해야 게시판 글쓰기 및 댓글 참여가 가능합니다.
  </p>
</div>

              {/* 브랜드 ID (비활성화 처리) */}
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-600 uppercase tracking-widest">나의 브랜드 ID (추후 예약받을 예정)</label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center bg-zinc-900/20 border border-zinc-800/50 rounded-xl px-4 py-3 opacity-50">
                    <input 
                      type="text" 
                      disabled
                      className="flex-1 bg-transparent text-sm outline-none font-bold text-zinc-600 cursor-not-allowed"
                      placeholder="준비 중입니다"
                    />
                    <span className="text-zinc-700 text-xs font-bold">.creaibox.com</span>
                  </div>
                  <button disabled className="px-4 bg-zinc-900 text-zinc-700 rounded-xl text-xs font-bold border border-zinc-800 cursor-not-allowed">중복 확인</button>
                </div>
                <p className="text-[10px] text-zinc-500 italic ml-1 font-medium">✨ creaibox 블로그 시작 시 별도 공지 예정입니다</p>
              </div>

              <button onClick={handleSave} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                <Save size={18} /> 설정 저장하기
              </button>
            </div>
          </section>

          {/* 2. 계정 상태 정보 */}
          <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-6 h-fit">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <Shield className="text-emerald-500" size={20} />
              <h2 className="text-xl font-black italic uppercase tracking-tight">계정 상태 정보</h2>
            </div>
            <div className="space-y-5">
              {[
                { label: '이메일 주소', value: user?.email },
                { label: '로그인 방식', value: user?.app_metadata?.provider },
                { label: '가입일', value: new Date(user?.created_at).toLocaleDateString() },
                { label: '멤버십 등급', value: profile.membership_level?.toUpperCase() || 'FREE', color: 'text-blue-400' },
              ].map((info, idx) => (
                <div key={idx} className="flex justify-between items-center py-1">
                  <span className="text-xs font-bold text-zinc-500 uppercase">{info.label}</span>
                  <span className={`text-sm font-black ${info.color || 'text-zinc-200'}`}>{info.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 3. 워드프레스 멀티 채널 */}
          <section className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <Globe className="text-blue-400" size={20} />
                <h2 className="text-xl font-black italic uppercase tracking-tight">Main Distribution Channels</h2>
              </div>
              <button 
                onClick={addWpSite}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600/10 text-emerald-500 text-xs font-bold rounded-xl border border-emerald-600/20 hover:bg-emerald-600/20 transition-all"
              >
                <Plus size={14} /> 사이트 추가
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 md:col-span-1">
                <h3 className="text-sm font-black text-emerald-500 uppercase italic px-2">WordPress Multi-Sites</h3>
                {wpSites.length === 0 && <p className="text-xs text-zinc-600 italic px-2">등록된 사이트가 없습니다.</p>}
                {wpSites.map((site, index) => (
                  <div key={index} className="p-4 bg-black/30 border border-zinc-800 rounded-2xl space-y-3">
                    <input 
                      type="text" placeholder="사이트 명칭" value={site.siteName}
                      onChange={(e) => updateWpSite(index, 'siteName', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500"
                    />
                    <input 
                      type="text" placeholder="URL (https://...)" value={site.url}
                      onChange={(e) => updateWpSite(index, 'url', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                      <input type="text" placeholder="ID" value={site.userId} onChange={(e) => updateWpSite(index, 'userId', e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500" />
                      <input type="password" placeholder="비밀번호" value={site.appPassword} onChange={(e) => updateWpSite(index, 'appPassword', e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500" />
                      <button onClick={() => removeWpSite(index)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-all"><Trash size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-2xl space-y-4 h-fit opacity-60">
                <h3 className="text-sm font-black text-zinc-500 uppercase italic">CreAibox Personal Blog Status</h3>
                <div className="flex items-center gap-1 font-bold text-zinc-600 bg-black/20 p-3 rounded-xl border border-zinc-800/50">
                  <span>COMING</span>
                  <span>.creaibox.com</span>
                </div>
                <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">Status: SERVICE PREPARING</p>
              </div>
            </div>
          </section>

          {/* 4. 구독 및 탈퇴 (기존 유지) */}
          <section className="lg:col-span-2 bg-blue-600/5 border border-dashed border-blue-600/30 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-black italic uppercase text-white flex items-center gap-2"><CreditCard className="text-blue-500" /> 구독 플랜 관리</h2>
                <p className="text-sm text-zinc-500">현재 <span className="text-blue-400 font-bold">{profile.membership_level || 'Free'}</span> 플랜 이용 중</p>
              </div>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-600/20">플랜 업그레이드</button>
            </div>
          </section>

          <section className="lg:col-span-2 bg-red-950/10 border border-red-900/20 rounded-3xl p-8 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-black italic uppercase text-red-500 flex items-center gap-2"><Trash2 size={20} /> 위험 구역</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">탈퇴 시 모든 데이터는 복구가 불가능합니다.</p>
            </div>
            <button className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-black rounded-lg border border-red-500/20 transition-all">회원탈퇴 신청</button>
          </section>

        </div>
      </div>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none">
        <button onClick={handleSave} className="pointer-events-auto flex items-center gap-2 px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-2xl active:scale-95 transition-all border border-blue-400/30">
          <Save size={20} /> 모든 설정 저장하기
        </button>
      </div>
    </div>
  );
}
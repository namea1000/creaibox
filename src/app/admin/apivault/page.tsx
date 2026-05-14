"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, Key, Database, Activity, Users, 
  Trash2, Plus, RefreshCw, CheckCircle2, AlertTriangle,
  TrendingUp, BarChart3, Lock, Eye, EyeOff, X, Loader2, Edit3
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import Aside from '@/components/layout/Aside';

export default function APIVaultAdminPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 🌟 수정 관련 상태 추가
  const [editingId, setEditingId] = useState<number | null>(null);

  const [newKey, setNewKey] = useState({ 
    key: '', 
    label: '', 
    display_name: '', 
    model: 'gemini-1.5-flash' 
  });

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_api_vault')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) console.error("데이터 로드 실패:", error);
      else setApiKeys(data || []);
    } catch (err) {
      console.error("시스템 오류:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const adminEmails = ['jenam7720@gmail.com', 'namjjang7720@gmail.com'];
      if (!isMounted) return;
      if (!user || !adminEmails.includes(user.email || "")) { 
        alert("⚠️ 경고: 슈퍼 어드민 전용 구역입니다.");
        router.push('/'); 
        return;
      }
      setIsAdmin(true);
      await fetchKeys();
    };
    checkAdmin();
    return () => { isMounted = false; };
  }, [supabase, router, fetchKeys]);

  // 🌟 수정 버튼 클릭 시 데이터를 폼에 채워넣는 함수
  const handleEditClick = (item: any) => {
    let decodedKey = '';
    try {
      // 저장된 키가 Base64라면 디코딩해서 보여줌 (사장님이 직접 확인/수정 가능하게)
      decodedKey = atob(item.key);
    } catch (e) {
      decodedKey = item.key;
    }

    setNewKey({
      key: decodedKey,
      label: item.label,
      display_name: item.display_name,
      model: item.model || 'gemini-1.5-flash'
    });
    setEditingId(item.id);
    setIsAdding(true); // 모달 열기
  };

  // 🌟 저장/업데이트 통합 로직
  const handleSaveKey = async () => {
    if (!newKey.key || !newKey.label || !newKey.display_name) {
      return alert("모든 항목을 입력해주세요.");
    }

    setSaveLoading(true);
    try {
      const encodedKey = btoa(newKey.key.trim()); 
      const payload = {
        key: encodedKey,
        label: newKey.label.trim(),
        display_name: newKey.display_name.trim(),
        model: newKey.model,
        status: 'active'
      };

      let error;
      if (editingId) {
        // 🌟 수정 모드일 때 (UPDATE)
        const result = await supabase
          .from('admin_api_vault')
          .update(payload)
          .eq('id', editingId);
        error = result.error;
      } else {
        // 🌟 신규 추가 모드일 때 (INSERT)
        const result = await supabase
          .from('admin_api_vault')
          .insert([payload]);
        error = result.error;
      }

      if (error) throw error;

      alert(editingId ? "✅ 정보가 성공적으로 수정되었습니다!" : "✅ 새 API 키가 금고에 보관되었습니다!");
      closeModal();
      fetchKeys();
    } catch (err: any) {
      alert(`저장 실패: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewKey({ key: '', label: '', display_name: '', model: 'gemini-1.5-flash' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await supabase.from('admin_api_vault').delete().eq('id', id);
    fetchKeys();
  };

  if (!isAdmin && loading) return (
    <div className="bg-[#020406] h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#020406] text-slate-100 font-sans">
      <Header />
      <div className="flex flex-1 pt-20 overflow-hidden text-left">
        <Sidebar activeMenu="Admin" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 lg:p-12 max-w-[1600px] mx-auto pb-32">
            <header className="mb-10 flex flex-col lg:flex-row justify-between items-start gap-6">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-white flex items-center gap-3 uppercase">
                        <ShieldAlert className="text-red-500 w-10 h-10" /> Admin <span className="text-red-500">Master</span> Vault
                    </h1>
                    <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-[10px]">무료 체험 API 풀 시스템 중앙 관제소 — 사장님 전용 전유물</p>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
              <section className="col-span-12 lg:col-span-8">
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-[32px] overflow-hidden backdrop-blur-xl shadow-2xl">
                  <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
                    <h3 className="font-black text-xl flex items-center gap-2 italic uppercase text-white"><Database className="text-blue-500" size={20} /> Free API Pool List</h3>
                    <div className="flex gap-3">
                       <button onClick={() => fetchKeys()} className="p-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white"><RefreshCw size={18} className={loading ? "animate-spin" : ""} /></button>
                       <button onClick={() => setIsAdding(true)} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase flex items-center gap-2 transition-all"><Plus size={16} /> Add New Key</button>
                    </div>
                  </div>
                  
                  <div className="min-h-[300px] relative">
                    {loading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-50">
                        <Loader2 className="animate-spin text-blue-500" size={40} />
                      </div>
                    ) : (
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[10px] text-zinc-500 uppercase font-black tracking-widest border-b border-zinc-800/50 bg-zinc-900/20">
                            <th className="px-8 py-5">No.</th>
                            <th className="px-8 py-5">Key Information</th>
                            <th className="px-8 py-5 text-center">Usage</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/30">
                          {apiKeys.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-8 py-20 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs">No keys found in vault.</td>
                            </tr>
                          ) : (
                            apiKeys.map((k, idx) => (
                              <tr key={k.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-6 text-zinc-600 font-mono text-xs">{idx + 1}</td>
                                <td className="px-8 py-6">
                                  <span className="text-[10px] text-blue-500 font-black uppercase tracking-tighter mb-1 block">Display: {k.display_name}</span>
                                  <p className="font-black text-sm text-zinc-200">{k.label}</p>
                                  <p className="text-[10px] font-mono text-zinc-600 mt-1">{showKeys ? k.key : '••••••••••••••••••••'}</p>
                                </td>
                                <td className="px-8 py-6 text-center">
                                  <span className="font-black text-emerald-500">{k.today_count}</span>
                                  <span className="text-zinc-700 mx-1">/</span>
                                  <span className="text-zinc-600 text-xs font-black italic">{k.use_count}</span>
                                </td>
                                <td className="px-8 py-6">
                                  <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase ${k.status === 'active' ? 'text-emerald-500' : 'text-red-500'}`}>{k.status}</span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                   <div className="flex justify-end gap-2">
                                     {/* 🌟 수정 버튼 추가 */}
                                     <button onClick={() => handleEditClick(k)} className="p-2 text-zinc-500 hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100">
                                       <Edit3 size={16} />
                                     </button>
                                     <button onClick={() => handleDelete(k.id)} className="p-2 text-zinc-500 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                       <Trash2 size={16} />
                                     </button>
                                   </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
          <Footer />
        </main>
      </div>

      {/* 모달 - 등록/수정 공용 */}
      {isAdding && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md text-zinc-100">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
              <h3 className="text-lg font-black italic text-white flex items-center gap-2 uppercase">
                <Key className="text-blue-500" size={18} /> 
                {editingId ? "Update API Vault" : "Add New API Vault"}
              </h3>
              <button onClick={closeModal} className="text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-5 text-left">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Admin Memo</label>
                <input type="text" value={newKey.label} onChange={(e) => setNewKey({...newKey, label: e.target.value})} placeholder="관리자 메모" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-blue-600 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-blue-500 uppercase tracking-widest ml-1">Display Name</label>
                <input type="text" value={newKey.display_name} onChange={(e) => setNewKey({...newKey, display_name: e.target.value})} placeholder="무료체험 제미나이 API Key 1" className="w-full bg-zinc-950 border border-blue-900/30 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-blue-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Gemini API KEY</label>
                <input 
                  type="text" 
                  style={{ WebkitTextSecurity: 'disc' } as any}
                  autoComplete="off"
                  name={`api-key-${Math.random()}`}
                  value={newKey.key} 
                  onChange={(e) => setNewKey({...newKey, key: e.target.value})} 
                  placeholder="AIzaSy..." 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-blue-600 outline-none" 
                />
              </div>
            </div>

            <div className="px-8 py-6 bg-zinc-950 border-t border-zinc-800 flex gap-3">
              <button onClick={closeModal} className="flex-1 py-3 bg-zinc-800 text-zinc-400 rounded-xl font-black uppercase text-[10px]">Cancel</button>
              <button onClick={handleSaveKey} disabled={saveLoading} className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] shadow-lg flex items-center justify-center gap-2">
                {saveLoading ? <Loader2 size={14} className="animate-spin" /> : editingId ? "Update Vault" : "Store In Vault"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
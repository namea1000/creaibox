"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, Search, Filter, Edit3, Trash2, Send, 
  CheckCircle2, Clock, Sparkles, RefreshCw
} from 'lucide-react';

interface ManuscriptListType {
  id: string;
  title: string;
  keyword: string;
  type: 'smart' | 'recreate';
  status: 'draft' | 'saved' | 'published';
  wordCount: number;
  updatedAt: string;
}

export default function NaverManuscriptListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  
  const [manuscripts, setManuscripts] = useState<ManuscriptListType[]>([
    { id: '1', title: 'AI 자동화 수익화의 비밀', keyword: 'AI 자동화', type: 'smart', status: 'draft', wordCount: 1450, updatedAt: '2026-05-18 14:20' },
    { id: '2', title: '천안 맛집 TOP 5 추천', keyword: '천안 맛집', type: 'recreate', status: 'published', wordCount: 1220, updatedAt: '2026-05-17 09:15' },
    { id: '3', title: '2026 정부지원금 가이드', keyword: '정부지원금', type: 'smart', status: 'saved', wordCount: 1800, updatedAt: '2026-05-18 11:30' },
  ]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // 🌟 행 전체 클릭 이벤트가 발동하지 않도록 방어!
    if(confirm("정말로 이 원고를 삭제하시겠습니까?")) {
      setManuscripts(prev => prev.filter(m => m.id !== id));
    }
  };

  const handlePublish = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // 🌟 행 전체 클릭 이벤트 방어!
    alert("네이버 블로그 API 연동망을 통해 정식 발행을 요청합니다.");
    setManuscripts(prev => prev.map(m => m.id === id ? {...m, status: 'published'} : m));
  };

  const filteredList = manuscripts.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.keyword.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 max-w-[1600px] mx-auto h-[calc(100vh-80px)] flex flex-col gap-6 text-zinc-100 animate-in fade-in duration-200">
      
      {/* 상단 타이틀 및 검색 바 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <FileText className="text-emerald-400" /> 발행 원고 관리
          </h1>
          <p className="text-sm text-zinc-500 font-medium">원고 목록을 확인하고, 줄 전체를 클릭하시면 최첨단 상세 집필 스튜디오로 이동합니다.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="원고 제목 또는 키워드 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-zinc-800 bg-zinc-900/50 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>
          <button className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-all"><Filter size={18} /></button>
        </div>
      </div>

      {/* 테이블형 목록 보드 */}
      <div className="flex-1 bg-zinc-900/20 border border-zinc-800/60 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
            <tr className="border-b border-zinc-800/60 text-xs font-black uppercase tracking-widest text-zinc-500">
              <th className="px-6 py-5">원고 정보</th>
              <th className="px-6 py-5">유형</th>
              <th className="px-6 py-5">키워드</th>
              <th className="px-6 py-5">상태</th>
              <th className="px-6 py-5">최종 수정일</th>
              <th className="px-6 py-5 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {filteredList.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => router.push(`/studio/writing/naver/list/${item.id}`)} // 🌟 [핵심] 줄 전체 박스 어디를 클릭하든 동적 세부 수정 페이지로 이동!
                className="hover:bg-zinc-900/40 transition-all group cursor-pointer"
              >
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-black text-zinc-100 group-hover:text-emerald-400 transition-colors">{item.title}</span>
                    <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1"><Clock size={12} /> {item.wordCount.toLocaleString()}자</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  {item.type === 'smart' ? (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 w-fit"><Sparkles size={10} /> SMART</span>
                  ) : (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1 w-fit"><RefreshCw size={10} /> RECREATE</span>
                  )}
                </td>
                <td className="px-6 py-5 text-sm font-bold text-zinc-400">#{item.keyword}</td>
                <td className="px-6 py-5">
                  {item.status === 'published' ? <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5"><CheckCircle2 size={14} /> 발행완료</span> : <span className="text-[11px] font-black text-yellow-500 flex items-center gap-1.5"><Clock size={14} /> 임시저장</span>}
                </td>
                <td className="px-6 py-5 text-xs font-mono text-zinc-500">{item.updatedAt}</td>
                <td className="px-6 py-5text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={(e) => { e.stopPropagation(); router.push(`/studio/writing/naver/list/${item.id}`) }} className="p-2 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"><Edit3 size={16} /></button>
                    <button onClick={(e) => handlePublish(e, item.id)} disabled={item.status === 'published'} className={`p-2 rounded-lg transition-all ${item.status === 'published' ? 'opacity-30' : 'bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white'}`}><Send size={16} /></button>
                    <button onClick={(e) => handleDelete(e, item.id)} className="p-2 rounded-lg bg-red-500/5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"use client";

import React from 'react';
import { Edit3, Trash2, Send, Sparkles, RefreshCw, Clock, CheckCircle2 } from 'lucide-react';

interface ManuscriptListType {
  id: string;
  title: string;
  keyword: string;
  type: 'smart' | 'recreate';
  status: 'draft' | 'saved' | 'published';
  wordCount: number;
  updatedAt: string;
}

interface TableProps {
  filteredList: ManuscriptListType[];
  onRowClick: (id: string) => void;
  onEditClick: (id: string) => void;
  onPublishClick: (e: React.MouseEvent, id: string) => void;
  onDeleteClick: (e: React.MouseEvent, id: string) => void;
}

export default function NaverManuscriptListTable({ 
  filteredList, onRowClick, onEditClick, onPublishClick, onDeleteClick 
}: TableProps) {
  return (
    <table className="w-full text-left border-collapse">
      <thead className="sticky top-0 bg-zinc-950/90 backdrop-blur-md z-10 border-b border-zinc-850">
        <tr className="text-xs font-black uppercase tracking-widest text-zinc-500">
          <th className="px-6 py-5">원고 정보</th>
          <th className="px-6 py-5">유형</th>
          <th className="px-6 py-5">키워드</th>
          <th className="px-6 py-5">상태</th>
          <th className="px-6 py-5">최종 수정일</th>
          <th className="px-6 py-5 text-right pr-8">관리</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-850/40">
        {filteredList.map((item) => (
          <tr 
            key={item.id} 
            onClick={() => onRowClick(item.id)}
            className="hover:bg-zinc-900/40 transition-all group cursor-pointer"
          >
            <td className="px-6 py-5">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-black text-zinc-100 group-hover:text-emerald-400 transition-colors">{item.title}</span>
                <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1"><Clock size={12} /> {item.wordCount.toLocaleString()} 자</span>
              </div>
            </td>
            <td className="px-6 py-5">
              {item.type === 'smart' ? (
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 w-fit"><Sparkles size={10} /> SMART</span>
              ) : (
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1 w-fit"><RefreshCw size={10} /> RECREATE</span>
              )}
            </td>
            <td className="px-6 py-5 text-xs font-black text-zinc-400">#{item.keyword}</td>
            <td className="px-6 py-5">
              {item.status === 'published' ? (
                <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5"><CheckCircle2 size={14} /> 발행완료</span>
              ) : (
                <span className="text-[11px] font-black text-blue-400 flex items-center gap-1.5"><Clock size={14} /> 보관원고</span>
              )}
            </td>
            <td className="px-6 py-5 text-xs font-mono text-zinc-500">{item.updatedAt}</td>
            <td className="px-6 py-5 text-right pr-6">
              <div className="flex justify-end gap-2">
                <button onClick={(e) => { e.stopPropagation(); onEditClick(item.id); }} className="p-2 rounded-lg bg-zinc-800/50 text-zinc-400 hover:text-white transition-all"><Edit3 size={16} /></button>
                <button onClick={(e) => onPublishClick(e, item.id)} disabled={item.status === 'published'} className={`p-2 rounded-lg transition-all ${item.status === 'published' ? 'opacity-20' : 'bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white'}`}><Send size={16} /></button>
                <button onClick={(e) => onDeleteClick(e, item.id)} className="p-2 rounded-lg bg-red-500/5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 size={16} /></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
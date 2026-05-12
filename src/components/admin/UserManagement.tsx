'use client';

import React, { useState } from 'react';
import { 
  Users, ShieldCheck, ShieldAlert, 
  Search, Ban, Settings, Crown, Briefcase
} from 'lucide-react';

// [타입 정의] 원본 그대로 유지
interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'PAID' | 'FREE'; 
  status: 'ACTIVE' | 'BANNED';
  todayUsage: number;
  totalUsage: number;
  joinedAt: string;
  lastLogin: string;
}

export default function UserManagement() {
  // 데이터셋 원본 보전
  const [users, setUsers] = useState<UserProfile[]>([
    { id: '1', email: 'boss@creaibox.ai', name: '사장님', role: 'ADMIN', status: 'ACTIVE', todayUsage: 0, totalUsage: 1250, joinedAt: '2024-01-01', lastLogin: '방금 전' },
    { id: '2', email: 'manager@creaibox.ai', name: '김실장', role: 'MANAGER', status: 'ACTIVE', todayUsage: 12, totalUsage: 450, joinedAt: '2024-02-10', lastLogin: '1시간 전' },
    { id: '3', email: 'user1@gmail.com', name: '홍길동', role: 'FREE', status: 'ACTIVE', todayUsage: 3, totalUsage: 45, joinedAt: '2024-05-01', lastLogin: '2시간 전' },
    { id: '4', email: 'power@naver.com', name: '김철수', role: 'PAID', status: 'ACTIVE', todayUsage: 55, totalUsage: 890, joinedAt: '2024-03-15', lastLogin: '어제' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // 검색 필터링 로직 (내용 보전 및 기능 활성화)
  const filteredUsers = users.filter(user => 
    user.name.includes(searchTerm) || user.email.includes(searchTerm)
  );

  return (
    <div className="bg-[#05070a] text-slate-100 p-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
        
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white flex items-center gap-3 uppercase">
              <ShieldCheck className="text-blue-500 w-10 h-10" /> 
              Command <span className="text-blue-500">Center</span>
            </h1>
            <p className="text-zinc-500 font-bold mt-2 uppercase tracking-widest text-xs">
              최고 관리자 & 매니저 통합 권한 통제 시스템
            </p>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="사용자 검색..." 
                className="bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-blue-500 w-[300px] transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* --- 요약 통계 카드: 원본 보전 --- */}
        <div className="grid grid-cols-5 gap-6 mb-10">
          {[
            { label: 'Total Users', value: '1,284', icon: Users, color: 'text-blue-500' },
            { label: 'Admin', value: '1', icon: ShieldAlert, color: 'text-red-500' },
            { label: 'Manager', value: '3', icon: Briefcase, color: 'text-purple-500' },
            { label: 'Premium', value: '156', icon: Crown, color: 'text-yellow-500' },
            { label: 'Banned', value: '12', icon: Ban, color: 'text-zinc-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[24px] flex flex-col gap-4">
              <div className={`w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- 사용자 리스트 테이블: 원본 보전 --- */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[32px] overflow-hidden backdrop-blur-xl shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-zinc-500 uppercase font-black tracking-widest border-b border-zinc-800/50 bg-zinc-900/30">
                <th className="px-8 py-5">Identity</th>
                <th className="px-8 py-5">Access Level</th>
                <th className="px-8 py-5">Trial Usage</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Connection</th>
                <th className="px-8 py-5 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${
                        user.role === 'ADMIN' ? 'bg-red-500/20 text-red-500' :
                        user.role === 'MANAGER' ? 'bg-purple-500/20 text-purple-500' :
                        'bg-zinc-800 text-zinc-500'
                      }`}>
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-sm text-zinc-200 flex items-center gap-2 italic">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-zinc-600 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        user.role === 'ADMIN' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                        user.role === 'MANAGER' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' :
                        user.role === 'PAID' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                        'bg-zinc-800/50 border-zinc-700 text-zinc-500'
                      }`}>
                        {user.role}
                      </span>
                      {user.role === 'ADMIN' && <Crown size={12} className="text-red-500" />}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between w-28 text-[9px] font-black text-zinc-500 uppercase">
                        <span>{user.todayUsage} Units</span>
                        <span>{user.role === 'FREE' ? 'Max 3' : 'UNLIMITED'}</span>
                      </div>
                      <div className="w-28 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${user.todayUsage >= 3 && user.role === 'FREE' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-blue-500 shadow-[0_0_8px_#3b82f6]'}`} 
                          style={{ width: `${Math.min((user.todayUsage / 3) * 100, 100)}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black uppercase flex items-center gap-1.5 ${user.status === 'ACTIVE' ? 'text-emerald-500' : 'text-zinc-600'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-xs text-zinc-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 bg-zinc-800/50 rounded-xl hover:bg-zinc-700 hover:text-blue-500 transition-all">
                      <Settings size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <footer className="mt-16 text-center text-zinc-800 text-[10px] font-black uppercase tracking-[0.4em] pb-10">
        Strategic Hierarchy Management — Core System Admin
      </footer>
    </div>
  );
}
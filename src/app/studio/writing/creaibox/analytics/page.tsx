"use client";

import React, { useState } from 'react';
import { Sparkles, TrendingUp, LayoutDashboard, Save } from 'lucide-react';

/**
 * 트렌드 대시보드가 통합된 메인 애플리케이션
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' 또는 'dashboard'

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-gray-100 min-h-screen">
      {/* 탭 네비게이션 */}
      <div className="flex gap-4 border-b border-gray-700 mb-6">
        <button 
          onClick={() => setActiveTab('generator')}
          className={`flex items-center gap-2 pb-3 ${activeTab === 'generator' ? 'border-b-2 border-blue-500 text-blue-400' : ''}`}
        >
          <Sparkles size={18} /> 아이디어 생성기
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 pb-3 ${activeTab === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-400' : ''}`}
        >
          <TrendingUp size={18} /> 트렌드 대시보드
        </button>
      </div>

      {activeTab === 'generator' ? (
        <GeneratorView />
      ) : (
        <DashboardView />
      )}
    </div>
  );
}

// 아이디어 생성기 뷰
function GeneratorView() {
  return <div className="text-gray-400">아이디어 생성기 컨텐츠가 여기에 위치합니다.</div>;
}

// 트렌드 대시보드 뷰
function DashboardView() {
  const trendData = [
    { category: "AI 기술", value: "85%", trend: "+12%" },
    { category: "친환경 디자인", value: "62%", trend: "+5%" },
    { category: "비대면 서비스", value: "45%", trend: "-2%" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <LayoutDashboard /> 실시간 시장 트렌드
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trendData.map((item, idx) => (
          <div key={idx} className="p-6 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-sm">{item.category}</p>
            <h3 className="text-3xl font-bold my-2">{item.value}</h3>
            <span className={`text-sm ${item.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {item.trend} 최근 대비
            </span>
          </div>
        ))}
      </div>

      <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 h-64 flex items-center justify-center border-dashed">
        <p className="text-gray-500">이곳에 차트 라이브러리(Recharts 등)를 연동하세요.</p>
      </div>
    </div>
  );
}
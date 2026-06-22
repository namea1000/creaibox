"use client";

import React, { useState } from "react";
import { Video, Sparkles, Play, Pause, RefreshCw, Volume2 } from "lucide-react";

export default function AnchorSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("jiwon");
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);

  const avatars = [
    { id: "jiwon", name: "지원 (Jiwon)", gender: "여성", desc: "차분하고 신뢰감 있는 목소리" },
    { id: "minjun", name: "민준 (Minjun)", gender: "남성", desc: "낮고 안정적인 톤의 전달력" },
    { id: "sohee", name: "소희 (Sohee)", gender: "여성", desc: "밝고 활기찬 테크/트렌드 톤" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Video size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">AI 뉴스 앵커 (Anchor)</h2>
            <p className="text-xs font-bold text-zinc-500 mt-0.5">
              스크랩 원고를 바탕으로 완성형 대본을 구성하고 고화질 AI 앵커 아바타를 선택해 쇼츠 비디오용 더빙 영상을 자동 생성합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 아바타 및 목소리 설정 */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 space-y-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">AI 앵커 아바타 라인업</h3>

          <div className="space-y-2">
            {avatars.map((av) => {
              const isSelected = av.id === selectedAvatar;

              return (
                <button
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`w-full rounded-xl border p-3.5 text-left transition ${
                    isSelected
                      ? "border-blue-500/60 bg-blue-500/10 text-white"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:border-blue-500/35"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={isSelected ? "text-blue-400" : "text-zinc-900 dark:text-zinc-150"}>{av.name}</span>
                    <span className="text-[10px] text-zinc-500">{av.gender}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">{av.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="border-t border-zinc-850 pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
              <span className="flex items-center gap-1">
                <Volume2 size={14} />
                발화 속도
              </span>
              <span>{voiceSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.1"
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        {/* 앵커 대본 편집 및 비디오 플레이어 프리뷰 */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 space-y-6">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Video size={16} className="text-blue-400" />
            AI 앵커 동영상 렌더 프리뷰
          </h3>

          {/* 비디오 화면 박스 */}
          <div className="flex justify-center">
            <div className="relative h-64 w-44 rounded-2xl bg-zinc-950/80 overflow-hidden border border-zinc-800 flex flex-col justify-end p-4 shadow-xl">
              {/* 상단 뱃지 */}
              <div className="absolute top-3 left-3 bg-red-600/80 px-2 py-0.5 rounded text-[9px] font-black tracking-widest text-white animate-pulse">
                REC MOCK
              </div>

              {/* 아바타 애니메이션 모형 */}
              <div className="absolute inset-0 flex items-center justify-center text-center">
                {isPlaying ? (
                  <div className="space-y-2">
                    {/* 웨이브바 애니메이션 모형 */}
                    <div className="flex justify-center items-end gap-1 h-6">
                      <div className="h-4 w-1 bg-blue-400 animate-pulse" />
                      <div className="h-6 w-1 bg-blue-400 animate-pulse" />
                      <div className="h-3 w-1 bg-blue-400 animate-pulse" />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-bold block">앵커 음성 더빙 합성 중...</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-zinc-650 font-bold">비디오 재생 대기</span>
                )}
              </div>

              {/* 하단 캡션 자막 */}
              <div className="bg-zinc-900/90 border border-zinc-800/80 p-2 rounded-lg text-[10px] font-bold text-center text-zinc-200 leading-snug">
                {isPlaying ? "구글 딥마인드가 스스로 진화하는 '자가 학습 에이전트' 모델을 오늘 전격적으로 발표했습니다." : "대본을 재생하면 앵커 더빙이 이곳에 자막으로 연계 출력됩니다."}
              </div>
            </div>
          </div>

          {/* 플레이 제어 버턴 */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2 text-xs font-black text-white hover:bg-blue-500 transition"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? "일시정지" : "뉴스 앵커링 들어보기"}
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-500 transition">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
